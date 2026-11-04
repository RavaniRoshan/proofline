/** Value normalisation. No model involved. */

const CURRENCY_SYMBOLS = /[₹$€£]/g;
const CURRENCY_WORDS = /\b(inr|rs\.?|rupees?|usd|eur|gbp)\b/gi;
const THOUSANDS = /[,\s]/g;

/** Parse "₹4,999", "6,499", "99.9%", "1200" -> number, else null. */
export function parseNumber(raw: string): number | null {
  const cleaned = raw
    .replace(CURRENCY_SYMBOLS, "")
    .replace(CURRENCY_WORDS, "")
    .replace(THOUSANDS, "")
    .replace(/%|percent\b/gi, "")
    .trim();
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export type Dimension =
  | "currency"
  | "days"
  | "minutes"
  | "weeks"
  | "months"
  | "gb"
  | "seats"
  | "workspaces"
  | "percent"
  | "rpm"
  | "region"
  | "enum"
  | "boolean"
  | "none";

const UNIT_DIMENSION: Record<string, Dimension> = {
  "": "none",
  inr: "currency",
  rs: "currency",
  usd: "currency",
  day: "days",
  days: "days",
  "business day": "days",
  "business days": "days",
  minute: "minutes",
  minutes: "minutes",
  mins: "minutes",
  week: "weeks",
  weeks: "weeks",
  month: "months",
  months: "months",
  gb: "gb",
  seats: "seats",
  seat: "seats",
  workspace: "workspaces",
  workspaces: "workspaces",
  percent: "percent",
  "%": "percent",
  requests_per_minute: "rpm",
  "requests per minute": "rpm",
  rpm: "rpm",
  region: "region",
  enum: "enum",
  boolean: "boolean",
  value: "none",
};

export function unitDimension(unit: string): Dimension {
  const key = unit.trim().toLowerCase();
  return UNIT_DIMENSION[key] ?? (`unknown:${key}` as Dimension);
}

export function unitsComparable(claimUnit: string, factUnit: string): boolean {
  const a = unitDimension(claimUnit);
  const b = unitDimension(factUnit);
  if (a === "none" || b === "none") return true; // unitless compares with anything numeric
  return a === b;
}

export type Scalar =
  | { kind: "number"; num: number }
  | { kind: "boolean"; bool: boolean }
  | { kind: "list"; items: Set<string> }
  | { kind: "text"; text: string };

/** Normalise a raw fact/claim value. */
export function scalarOf(
  raw: string,
  unit: string,
  opts: { asList?: boolean } = {},
): Scalar {
  const t = raw.trim();
  const lower = t.toLowerCase();
  if (lower === "true" || lower === "false") return { kind: "boolean", bool: lower === "true" };
  // A comma inside a number is a thousands separator, never a list separator —
  // try the numeric reading before the list reading.
  const n = parseNumber(t);
  if (n !== null) return { kind: "number", num: n };
  if (opts.asList || unitDimension(unit) === "enum" || /[,;&|]|\band\b/.test(lower)) {
    return { kind: "list", items: tokenSet(lower) };
  }
  return { kind: "text", text: lower };
}

export function tokenSet(raw: string): Set<string> {
  return new Set(
    raw
      .toLowerCase()
      .split(/[,;&|]|\band\b|\bor\b/g)
      .map((s) => s.trim().replace(/^(a|an|the)\s+/, ""))
      .filter((s) => s.length > 0),
  );
}

export type ValueRelation = "equal" | "different" | "incomparable";

export function compareScalar(claim: Scalar, fact: Scalar): ValueRelation {
  if (claim.kind !== fact.kind) {
    if (claim.kind === "number" && fact.kind === "text") {
      const n = parseNumber(fact.text);
      if (n !== null) return Math.abs(claim.num - n) < 1e-9 ? "equal" : "different";
    }
    return "incomparable";
  }
  switch (claim.kind) {
    case "number": {
      const f = fact as Extract<Scalar, { kind: "number" }>;
      return Math.abs(claim.num - f.num) < 1e-9 ? "equal" : "different";
    }
    case "boolean":
      return claim.bool === (fact as Extract<Scalar, { kind: "boolean" }>).bool
        ? "equal"
        : "different";
    case "list": {
      const f = fact as Extract<Scalar, { kind: "list" }>;
      // Claim entitlement: every claimed item must be in the fact.
      for (const item of claim.items) if (!f.items.has(item)) return "different";
      return "equal";
    }
    case "text":
      return claim.text === (fact as Extract<Scalar, { kind: "text" }>).text
        ? "equal"
        : "different";
  }
}
