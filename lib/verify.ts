/**
 * The verify pipeline: segment -> classify -> resolve deterministically ->
 * fall back to the model only when the register cannot decide -> code computes
 * the verdict -> the evidence gate runs on every CONTRADICTED.
 */
import { isDisclaimer, classifyClaim } from "@/lib/classify";
import { getLlmClient, LlmParseError, type LlmClient } from "@/lib/llm";
import { retrieveCandidates } from "@/lib/retrieve";
import { resolveAttributes } from "@/lib/resolve";
import { segmentDraft } from "@/lib/segment";
import { findFact, isActiveAt } from "@/lib/seed";
import {
  decideClaim,
  findingId,
  gateContradicted,
  makeEvidence,
  severityOf,
} from "@/lib/verdict";
import type {
  ClaimType,
  Finding,
  VerifyResult,
  VerifySummary,
  Verdict,
} from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";

export interface VerifyOptions {
  /** ISO date; defaults to today. Injected for tests and smoke cases. */
  reviewDate?: string;
  /** Pass a client to override env-based resolution (tests); pass null to force "unavailable". */
  llm?: LlmClient | null;
}

const PRICE_MENTION = /(₹|\$|€|£|price|pricing|per month|\binr\b)/i;

export async function verifyDraft(
  draft: string,
  opts: VerifyOptions = {},
): Promise<VerifyResult> {
  const reviewDate = opts.reviewDate ?? new Date().toISOString().slice(0, 10);
  const segments = segmentDraft(draft);
  const findings: Finding[] = [];

  const hasDisclaimer = segments.some((s) => isDisclaimer(s.text));
  if (PRICE_MENTION.test(draft) && !hasDisclaimer) {
    findings.push(
      build({
        claim: "Draft mentions pricing without the required change disclaimer.",
        char_start: 0,
        char_end: 0,
        claimType: "disclaimer",
        verdict: "UNVERIFIED",
        reason:
          "A price promise cannot go to market without the change disclaimer; the register does not back it.",
        correction: "Add “Pricing is subject to change.” at the foot of the draft.",
        evidence: null,
        source: "deterministic",
        idSalt: "disclaimer",
      }),
    );
  }

  const llm = opts.llm === undefined ? await getLlmClient() : opts.llm;

  for (const seg of segments) {
    const claimType = classifyClaim(seg.text);
    if (claimType === "not_a_claim") continue;

    const resolved = resolveAttributes(seg.text);

    if (resolved.length > 0) {
      for (const r of resolved) {
        const decision = decideClaim(r, reviewDate);
        if (decision.kind === "decided") {
          const d = decision.decision;
          findings.push(
            build({
              claim: seg.text,
              char_start: seg.charStart,
              char_end: seg.charEnd,
              claimType,
              verdict: d.verdict,
              reason: d.reason,
              correction: d.correction,
              evidence: d.fact ? makeEvidence(d.fact) : null,
              conflictWith: d.conflictWith,
              source: "deterministic",
              idSalt: r.attribute,
            }),
          );
        } else if (decision.kind === "mixed") {
          findings.push(
            build({
              claim: seg.text,
              char_start: seg.charStart,
              char_end: seg.charEnd,
              claimType,
              verdict: "UNVERIFIED",
              reason: decision.reason,
              correction: "Clarify which plan the claim is about.",
              evidence: null,
              source: "deterministic",
              idSalt: r.attribute,
            }),
          );
        } else if (decision.kind === "no_match") {
          findings.push(
            build({
              claim: seg.text,
              char_start: seg.charStart,
              char_end: seg.charEnd,
              claimType,
              verdict: "UNVERIFIED",
              reason: `No approved fact in the register covers ${r.attribute.replace(/_/g, " ")}${
                r.productId ? ` for ${r.productId === "P-starter" ? "Starter" : "Growth"}` : ""
              }.`,
              correction: null,
              evidence: null,
              source: "deterministic",
              idSalt: r.attribute,
            }),
          );
        } else {
          // needs_model: attribute resolved but the values cannot be compared in code.
          findings.push(
            await modelFinding(seg.text, seg.charStart, seg.charEnd, claimType, r.attribute, reviewDate, llm),
          );
        }
      }
      continue;
    }

    if (claimType === "disclaimer") {
      findings.push(
        build({
          claim: seg.text,
          char_start: seg.charStart,
          char_end: seg.charEnd,
          claimType,
          verdict: "NOT_CHECKABLE",
          reason: "Boilerplate disclaimer — there is no checkable claim here.",
          correction: null,
          evidence: null,
          source: "deterministic",
          idSalt: "disclaimer",
        }),
      );
      continue;
    }
    if (claimType === "qualitative") {
      findings.push(
        await modelFinding(seg.text, seg.charStart, seg.charEnd, claimType, undefined, reviewDate, llm),
      );
      continue;
    }
    // numeric / temporal / entity with no resolvable attribute: honest refusal, no model call.
    findings.push(
      build({
        claim: seg.text,
        char_start: seg.charStart,
        char_end: seg.charEnd,
        claimType,
        verdict: "UNVERIFIED",
        reason: "No approved fact in the register covers this claim.",
        correction: null,
        evidence: null,
        source: "deterministic",
        idSalt: "nomatch",
      }),
    );
  }

  findings.sort(
    (a, b) => b.severity - a.severity || a.char_start - b.char_start || a.claim.localeCompare(b.claim),
  );

  const by_verdict = Object.fromEntries(ALL_VERDICTS.map((v) => [v, 0])) as Record<Verdict, number>;
  let deterministic = 0;
  let model = 0;
  for (const f of findings) {
    by_verdict[f.verdict] += 1;
    if (f.source === "deterministic") deterministic += 1;
    else model += 1;
  }
  const summary: VerifySummary = {
    total: findings.length,
    by_verdict,
    deterministic,
    model,
    review_date: reviewDate,
  };
  return { findings, summary };
}

// ---------------------------------------------------------------------------

interface BuildInput {
  claim: string;
  char_start: number;
  char_end: number;
  claimType: ClaimType;
  verdict: Verdict;
  reason: string;
  correction: string | null;
  evidence: Finding["evidence"];
  conflictWith?: string[];
  source: Finding["source"];
  idSalt: string;
}

function build(input: BuildInput): Finding {
  const finding: Finding = {
    id: findingId(`${input.idSalt}::${input.claim}`, input.char_start, input.char_end),
    claim: input.claim,
    char_start: input.char_start,
    char_end: input.char_end,
    claim_type: input.claimType,
    verdict: input.verdict,
    severity: severityOf(input.verdict, input.claimType),
    reason: input.reason,
    suggested_correction: input.correction,
    evidence: input.evidence,
    conflict_with: input.conflictWith,
    source: input.source,
  };
  return gateContradicted(finding);
}

async function modelFinding(
  claim: string,
  char_start: number,
  char_end: number,
  claimType: ClaimType,
  attributeHint: string | undefined,
  reviewDate: string,
  llm: LlmClient | null,
): Promise<Finding> {
  const base = {
    claim,
    char_start,
    char_end,
    claimType,
    source: "model" as const,
    idSalt: attributeHint ?? "model",
  };
  if (llm === null) {
    return build({
      ...base,
      source: "deterministic" as const,
      verdict: "UNVERIFIED",
      reason:
        "Semantic check unavailable — no LLM provider is configured. Deterministic checks were applied.",
      correction: null,
      evidence: null,
    });
  }
  const candidates = retrieveCandidates(claim, attributeHint);
  let resp;
  try {
    resp = await llm.reviewClaim({ claim, claimType, candidates });
  } catch (e) {
    if (e instanceof LlmParseError) throw e; // hard error, never a silent fallback
    return build({
      ...base,
      verdict: "UNVERIFIED",
      reason: `Semantic check failed: ${(e as Error).message.slice(0, 140)}`,
      correction: null,
      evidence: null,
    });
  }

  const cited = resp.candidate_fact_ids
    .map((id) => findFact(id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  if (resp.relation === "supports") {
    const active = cited.find((f) => isActiveAt(f, reviewDate));
    if (resp.confidence >= 0.75 && active) {
      return build({
        ...base,
        verdict: "SUPPORTED",
        reason: "An approved fact entails this claim.",
        correction: null,
        evidence: makeEvidence(active),
      });
    }
    const expired = !active && cited[0] ? cited[0] : null;
    if (expired) {
      return build({
        ...base,
        verdict: "STALE",
        reason: "The only matching fact is outside its validity window at the review date.",
        correction:
          "Remove or refresh this claim before publishing — the matching fact has expired.",
        evidence: makeEvidence(expired),
      });
    }
    return build({
      ...base,
      verdict: "UNVERIFIED",
      reason:
        resp.confidence < 0.75
          ? `The model was not confident enough (${resp.confidence.toFixed(2)}) to confirm this claim.`
          : "The model cited no resolvable approved fact for this claim.",
      correction: resp.suggested_correction,
      evidence: null,
    });
  }

  if (resp.relation === "contradicts") {
    const active = cited.find((f) => isActiveAt(f, reviewDate));
    if (!active) {
      return build({
        ...base,
        verdict: "UNVERIFIED",
        reason: "The model cited a fact that is missing or inactive at the review date — not counted.",
        correction: null,
        evidence: null,
      });
    }
    return build({
      ...base,
      verdict: "CONTRADICTED",
      reason: resp.reason,
      correction: resp.suggested_correction,
      evidence: makeEvidence(active),
    });
  }

  // unrelated | insufficient
  if (claimType === "qualitative") {
    return build({
      ...base,
      verdict: "NOT_CHECKABLE",
      reason: resp.reason || "No factual predicate for the register to check.",
      correction: null,
      evidence: null,
    });
  }
  return build({
    ...base,
    verdict: "UNVERIFIED",
    reason: resp.reason || "The model could not confirm or refute this claim.",
    correction: resp.suggested_correction,
    evidence: null,
  });
}
