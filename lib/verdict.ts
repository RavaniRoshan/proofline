/**
 * Stage 4 — verdict computation and the evidence gate.
 * The model proposes; this file decides.
 */
import { brand, approvedFactsFor, findFact, documentOf } from "@/lib/seed";
import {
  compareScalar,
  scalarOf,
  unitsComparable,
  type Scalar,
} from "@/lib/normalize";
import type { ResolvedClaim } from "@/lib/resolve";
import type {
  ClaimType,
  EvidenceRecord,
  Finding,
  Severity,
  Verdict,
} from "@/lib/types";
import type { Fact } from "@/lib/schemas";
import { facts } from "@/lib/seed";

function scalarKey(s: Scalar): string {
  switch (s.kind) {
    case "number":
      return `n:${Math.round(s.num * 1e6) / 1e6}`;
    case "boolean":
      return `b:${s.bool}`;
    case "list":
      return `l:${[...s.items].sort().join(",")}`;
    case "text":
      return `t:${s.text}`;
  }
}

function rowsFor(productId: string, attribute: string): Fact[] {
  return facts
    .filter((f) => f.product_id === productId && f.attribute === attribute)
    .sort((a, b) => b.version - a.version);
}

/** Verdict for one product scope. null => cannot decide here (units incomparable). */
interface ScopeVerdict {
  verdict: Verdict;
  fact: Fact | null;
  conflictWith?: string[];
  reason: string;
  correction: string | null;
}

function decideScope(
  scope: string,
  claim: ResolvedClaim,
  reviewDate: string,
): ScopeVerdict | "needs_model" | null {
  const rows = rowsFor(scope, claim.attribute);
  if (rows.length === 0) return null;

  const approved = rows.filter((r) => r.status === "approved");
  const active = approved.filter(
    (f) => f.valid_from <= reviewDate && reviewDate <= f.valid_until,
  );

  // CONFLICTING: >=2 approved facts, same (product, attribute), different values, both active.
  if (active.length >= 2) {
    const byValue = new Map<string, Fact[]>();
    for (const f of active) {
      const key = scalarKey(scalarOf(f.value, f.unit, { asList: unitDimensionIsEnum(f.unit) }));
      const list = byValue.get(key) ?? [];
      list.push(f);
      byValue.set(key, list);
    }
    if (byValue.size >= 2) {
      // Best match = the active fact whose value the claim states, else the newest.
      const claimScalar = scalarOf(claim.claimValue, claim.unit);
      const claimKey = scalarKey(claimScalar);
      const claimMatch = active.find(
        (f) =>
          scalarKey(scalarOf(f.value, f.unit, { asList: unitDimensionIsEnum(f.unit) })) ===
          claimKey,
      );
      const best = claimMatch ?? [...active].sort((a, b) => b.version - a.version)[0]!;
      const others = active.filter((f) => f.fact_id !== best.fact_id);
      const vals = [...new Set(active.map((f) => f.display_value || f.value))];
      return {
        verdict: "CONFLICTING",
        fact: best,
        conflictWith: others.map((f) => f.fact_id),
        reason: `Two approved facts for this attribute are both currently valid and disagree (${vals
          .slice(0, 2)
          .join(" vs ")}).`,
        correction:
          "Hold publication until the brand owner resolves the conflicting approved facts.",
      };
    }
  }

  const reference = [...active].sort((a, b) => b.version - a.version)[0];
  if (reference) {
    if (!unitsComparable(claim.unit, reference.unit)) return "needs_model";
    const rel = compareScalar(
      scalarOf(claim.claimValue, claim.unit),
      scalarOf(reference.value, reference.unit, {
        asList: unitDimensionIsEnum(reference.unit),
      }),
    );
    if (rel === "equal") {
      return {
        verdict: "SUPPORTED",
        fact: reference,
        reason: "Matches the current approved register entry for this claim.",
        correction: null,
      };
    }
    if (rel === "different") {
      return {
        verdict: "CONTRADICTED",
        fact: reference,
        reason: `The claim differs from the current approved value (${reference.display_value || reference.value}).`,
        correction: `Replace with: ${reference.display_value || reference.value}`,
      };
    }
    return "needs_model";
  }

  // No active fact: the best-matching fact expired or was superseded -> STALE.
  const best = approved[0] ?? rows[0]!; // rows already newest-first
  return {
    verdict: "STALE",
    fact: best,
    reason: `The only matching fact exists but is outside its validity window at the review date.`,
    correction:
      "Remove or refresh this claim before publishing — the matching fact has expired.",
  };
}

function unitDimensionIsEnum(unit: string): boolean {
  return unit.trim().toLowerCase() === "enum";
}

export type ClaimDecision =
  | { kind: "decided"; decision: ScopeVerdict }
  | { kind: "needs_model"; candidateFact: Fact | null }
  | { kind: "no_match" }
  | { kind: "mixed"; reason: string };

export function decideClaim(
  claim: ResolvedClaim,
  reviewDate: string,
): ClaimDecision {
  const scopes =
    claim.productId !== null
      ? [claim.productId]
      : brand.products.map((p) => p.product_id);

  let sawRows = false;
  let needsModel = false;
  const decided: Array<{ scope: string; v: ScopeVerdict }> = [];

  for (const scope of scopes) {
    const r = decideScope(scope, claim, reviewDate);
    if (r === null) continue;
    sawRows = true;
    if (r === "needs_model") {
      needsModel = true;
      continue;
    }
    decided.push({ scope, v: r });
  }

  if (decided.length === 0) {
    if (sawRows && needsModel) {
      const cand = scopes
        .flatMap((s) => approvedFactsFor(s, claim.attribute))
        .sort((a, b) => b.version - a.version)[0] ?? null;
      return { kind: "needs_model", candidateFact: cand };
    }
    return { kind: "no_match" };
  }

  const verdicts = new Set(decided.map((d) => d.v.verdict));
  if (verdicts.size === 1) {
    return { kind: "decided", decision: decided[0]!.v };
  }
  const detail = decided
    .map((d) => `${productLabel(d.scope)}: ${d.v.verdict}`)
    .join(" / ");
  return {
    kind: "mixed",
    reason: `The register disagrees across plans (${detail}) — specify the plan you mean.`,
  };
}

function productLabel(scope: string): string {
  return scope === "P-starter" ? "Starter" : scope === "P-growth" ? "Growth" : scope;
}

// ---------------------------------------------------------------------------
// Evidence gate (LAW §5). Enforced in code, not in the prompt.
// ---------------------------------------------------------------------------

export function makeEvidence(fact: Fact): EvidenceRecord {
  const doc = documentOf(fact);
  return {
    fact_id: fact.fact_id,
    fact_version: fact.version,
    source_document_id: fact.source_document_id,
    source_version_id: fact.source_version_id,
    source_span: fact.source_span,
    valid_from: fact.valid_from,
    valid_until: fact.valid_until,
    attribute: fact.attribute,
    product_id: fact.product_id,
    value: fact.value,
    unit: fact.unit,
    display_value: fact.display_value,
    document_title: doc?.title ?? "",
  };
}

/** Returns null when the record is complete and resolvable, else the problem. */
export function evidenceProblem(e: EvidenceRecord | null | undefined): string | null {
  if (!e) return "no evidence record";
  const problems: string[] = [];
  if (!e.fact_id) problems.push("fact_id");
  if (!Number.isInteger(e.fact_version) || e.fact_version < 1) problems.push("fact_version");
  if (!e.source_document_id) problems.push("source_document_id");
  if (!e.source_span || !/^\[.*\]$/.test(e.source_span)) problems.push("source_span");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.valid_from)) problems.push("valid_from");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.valid_until)) problems.push("valid_until");
  if (problems.length > 0) return `incomplete evidence (missing ${problems.join(", ")})`;
  const fact = findFact(e.fact_id, e.fact_version);
  if (!fact) return `fact_id ${e.fact_id} v${e.fact_version} does not resolve in the register`;
  if (!documentOf(fact)) return `source document for ${e.fact_id} v${e.fact_version} does not resolve`;
  if (fact.product_id !== e.product_id || fact.attribute !== e.attribute)
    return `evidence does not match ${e.fact_id} v${e.fact_version}`;
  return null;
}

/**
 * The gate. In development an incomplete CONTRADICTED record throws;
 * in production the finding is downgraded to UNVERIFIED with the reason stated.
 */
export function gateContradicted(finding: Finding): Finding {
  if (finding.verdict !== "CONTRADICTED") return finding;
  const problem = evidenceProblem(finding.evidence);
  if (problem === null) return finding;
  const message = `Evidence gate: CONTRADICTED downgraded — ${problem}`;
  if (process.env.NODE_ENV !== "production") {
    throw new Error(message);
  }
  return {
    ...finding,
    verdict: "UNVERIFIED",
    severity: 1,
    reason: `${finding.reason} Downgraded: ${problem}.`,
  };
}

export function severityOf(verdict: Verdict, claimType: ClaimType): Severity {
  if (verdict === "CONTRADICTED") return claimType === "numeric" ? 3 : 2;
  if (verdict === "STALE" || verdict === "CONFLICTING") return 2;
  if (verdict === "UNVERIFIED") return 1;
  return 0;
}

/** Stable finding id: stable for identical input text. */
export function findingId(claim: string, charStart: number, charEnd: number): string {
  // cyrb53 — small, dependency-free, stable.
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  const s = `${charStart}:${charEnd}:${claim}`;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return ((h2 >>> 0) * 4294967296 + (h1 >>> 0)).toString(36);
}

/** All rows matching (product, attribute) regardless of status — used by tests. */
export function allRowsFor(productId: string, attribute: string): Fact[] {
  return rowsFor(productId, attribute);
}
