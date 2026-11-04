/**
 * Stage 1 — deterministic attribute/entity/value resolution.
 * Everything here is TypeScript; no model is called.
 */

export interface ResolvedClaim {
  attribute: string;
  /** null = claim names no product; evaluated across all products. */
  productId: string | null;
  /** Normalised claim value fed to scalarOf(). */
  claimValue: string;
  /** Claim-side unit (used for dimension comparability only). */
  unit: string;
}

const LEGACY_RE = /legacy/i;
const STARTER_RE = /\bstarter\b/i;
const GROWTH_RE = /\bgrowth\b/i;

export function productScopeOf(clause: string): string | null {
  const legacy = LEGACY_RE.test(clause);
  if (STARTER_RE.test(clause) || legacy) return "P-starter";
  if (GROWTH_RE.test(clause)) return "P-growth";
  return null;
}

const NUM = /\d[\d,]*(?:\.\d+)?/g;

/** Numbers in the clause, with index. */
function numbersIn(clause: string): Array<{ value: string; index: number }> {
  const out: Array<{ value: string; index: number }> = [];
  for (const m of clause.matchAll(NUM)) {
    if (m.index === undefined) continue;
    out.push({ value: m[0], index: m.index });
  }
  return out;
}

/** Nearest number to an anchor index; falls back to the first number. */
function nearestNumber(
  clause: string,
  anchorIndex: number,
): { value: string; index: number } | null {
  const nums = numbersIn(clause);
  if (nums.length === 0) return null;
  let best = nums[0]!;
  for (const n of nums) {
    if (Math.abs(n.index - anchorIndex) < Math.abs(best.index - anchorIndex)) best = n;
  }
  return best;
}

function anchorEnd(clause: string, re: RegExp): number | null {
  const m = re.exec(clause);
  return m ? m.index + m[0].length : null;
}

function boolValue(clause: string): "true" | "false" {
  return /\b(no|not|never|without|doesn't|doesnt|don't|dont|isn't|isnt|exclud)\w*\b/i.test(clause)
    ? "false"
    : "true";
}

function enumValue(clause: string, vocabulary: string[]): string | null {
  const found = vocabulary.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(clause));
  return found.length > 0 ? found.join(",") : null;
}

interface Rule {
  /** Attribute in legacy context (price/seat/storage only). */
  legacy?: string;
  attribute: string;
  test: RegExp;
  /** Anchor used for number proximity, defaults to `test`. */
  anchor?: RegExp;
  unit: (clause: string) => string;
  claimValue: (clause: string) => string | null;
}

const RULES: Rule[] = [
  {
    attribute: "seat_limit",
    legacy: "legacy_seat_limit",
    test: /\bseats?\b/i,
    anchor: /\bseats?\b/i,
    unit: () => "seats",
    claimValue: (c) => {
      const a = anchorEnd(c, /\bseats?\b/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "storage_gb",
    legacy: "legacy_storage_gb",
    test: /\b(storage|gb)\b/i,
    anchor: /\bgb\b/i,
    unit: () => "GB",
    claimValue: (c) => {
      const a = anchorEnd(c, /\bgb\b/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "price_monthly",
    legacy: "legacy_plan_price",
    test: /(₹|\brs\.?\b|\binr\b|\$|price|per month|\/mo\b)/i,
    anchor: /(₹|\brs\.?\b|\binr\b|\$|price|per month|\/mo\b)/i,
    unit: () => "INR",
    claimValue: (c) => {
      const a = anchorEnd(c, /(₹|\brs\.?\b|\binr\b|\$|price|per month|\/mo\b)/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "onboarding_days",
    test: /\b(onboarding|onboard)\b|\bsetup takes\b/i,
    anchor: /\b(onboarding|onboard|setup takes)\b/i,
    unit: (c) => (/business days?/i.test(c) ? "business days" : /minutes?|mins\b/i.test(c) ? "minutes" : "days"),
    claimValue: (c) => {
      const a = anchorEnd(c, /\b(onboarding|setup takes|live)\b/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "trial_days",
    test: /\btrial\b/i,
    anchor: /\btrial\b/i,
    unit: () => "days",
    claimValue: (c) => {
      const a = anchorEnd(c, /\btrial\b/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "workspace_limit",
    test: /\bworkspaces?\b/i,
    anchor: /\bworkspaces?\b/i,
    unit: () => "workspaces",
    claimValue: (c) => {
      const a = anchorEnd(c, /\bworkspaces?\b/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "sso_included",
    test: /\b(sso|single sign-on|saml)\b/i,
    unit: () => "boolean",
    claimValue: (c) => boolValue(c),
  },
  {
    attribute: "sso_type",
    test: /\bsaml\b/i,
    unit: () => "enum",
    claimValue: (c) => enumValue(c, ["saml"]),
  },
  {
    attribute: "support_channel",
    test: /\bsupport\b/i,
    unit: () => "enum",
    claimValue: (c) => enumValue(c, ["email", "chat", "phone", "slack"]),
  },
  {
    attribute: "cancellation",
    test: /\bcancel/i,
    unit: () => "enum",
    claimValue: (c) => (/\banytime\b/i.test(c) ? "anytime" : null),
  },
  {
    attribute: "data_residency",
    test: /\b(stored in india|data residency|residency|stored in)\b/i,
    unit: () => "region",
    claimValue: (c) => {
      if (/\bindia\b/i.test(c)) return "IN";
      if (/\b(united states|usa|u\.s\.)\b/i.test(c)) return "US";
      if (/\beuropean union|eu\b/i.test(c)) return "EU";
      return null;
    },
  },
  {
    attribute: "uptime_sla",
    // "sla credit" is a different attribute — check it first elsewhere.
    test: /\buptime\b|\b99(\.\d+)?\s*%/i,
    anchor: /\b99(\.\d+)?\s*%|\buptime/i,
    unit: () => "percent",
    claimValue: (c) => {
      const a = anchorEnd(c, /\b99(\.\d+)?\s*%|\buptime/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "sla_credit",
    test: /\bsla credit/i,
    unit: () => "boolean",
    claimValue: (c) => boolValue(c),
  },
  {
    attribute: "api_rate_limit",
    test: /\b(rate limit|requests per minute|api requests|rpm\b)/i,
    anchor: /\b(rate limit|requests per minute|api requests|rpm\b)/i,
    unit: () => "requests_per_minute",
    claimValue: (c) => {
      const a = anchorEnd(c, /\b(rate limit|requests per minute|api requests|rpm\b)/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "setup_fee",
    test: /\bsetup fee/i,
    unit: () => "INR",
    claimValue: (c) => {
      if (/\b(no|without|zero|free)\b[^.]{0,20}setup fee/i.test(c) || /setup fee[^.]{0,12}\b(no|zero|free|none)\b/i.test(c))
        return "0";
      const a = anchorEnd(c, /\bsetup fee/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "retention_days",
    test: /\bretention\b|\bkeeps? (your )?data\b/i,
    anchor: /\bretention\b/i,
    unit: () => "days",
    claimValue: (c) => {
      const a = anchorEnd(c, /\bretention\b/i) ?? anchorEnd(c, /\bdays?\b/i) ?? 0;
      const n = nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "audit_log_days",
    test: /\baudit log/i,
    anchor: /\baudit log/i,
    unit: () => "days",
    claimValue: (c) => {
      const a = anchorEnd(c, /\baudit log/i);
      const n = a === null ? null : nearestNumber(c, a);
      return n?.value ?? null;
    },
  },
  {
    attribute: "feature_analytics",
    test: /\banalytics\b/i,
    unit: () => "boolean",
    claimValue: (c) => boolValue(c),
  },
  {
    attribute: "export_format",
    test: /\b(export|csv|xlsx|pdf export)\b/i,
    unit: () => "enum",
    claimValue: (c) => enumValue(c, ["csv", "xlsx", "pdf", "json"]),
  },
  {
    attribute: "api_access",
    test: /\b(public api|api access)\b/i,
    unit: () => "boolean",
    claimValue: (c) => boolValue(c),
  },
  {
    attribute: "mobile_app",
    test: /\bmobile app/i,
    unit: () => "boolean",
    claimValue: (c) => boolValue(c),
  },
  {
    attribute: "role_types",
    test: /\b(role|admin|editor|viewer)\w*\b/i,
    unit: () => "enum",
    claimValue: (c) => enumValue(c, ["admin", "editor", "viewer"]),
  },
  {
    attribute: "onboarding_support",
    // Scope must be onboarding specifically — "dedicated success manager in Pune"
    // is not backed by an "onboarding manager" fact.
    test: /\bonboarding\s+(manager|support)\b/i,
    unit: () => "enum",
    claimValue: (c) => (/\bdedicated\b/i.test(c) ? "dedicated" : null),
  },
];

/**
 * Resolve all checkable attributes mentioned in a clause.
 * Returns one entry per matched attribute (a clause may carry several).
 */
export function resolveAttributes(clause: string): ResolvedClaim[] {
  const legacy = LEGACY_RE.test(clause);
  const productId = productScopeOf(clause);
  const seen = new Set<string>();
  const out: ResolvedClaim[] = [];
  for (const rule of RULES) {
    if (!rule.test.test(clause)) continue;
    const attribute = legacy && rule.legacy ? rule.legacy : rule.attribute;
    if (seen.has(attribute)) continue;
    const claimValue = rule.claimValue(clause);
    if (claimValue === null) continue;
    seen.add(attribute);
    out.push({ attribute, productId, claimValue, unit: rule.unit(clause) });
  }
  return out;
}
