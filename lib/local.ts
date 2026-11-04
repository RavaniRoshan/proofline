import { z } from "zod";
import type { Verdict } from "@/lib/types";

export type DecisionValue = "approve" | "reject" | "needs_edit";

export interface AuditEntry {
  id: string;
  at: string;
  decision: DecisionValue;
  reason: string;
  verdict: Verdict;
  claim: string;
  fact_id: string | null;
}

export interface StoredDecision {
  decision: DecisionValue;
  reason: string;
  at: string;
  verdict: Verdict;
  claim: string;
  fact_id: string | null;
}

export interface ProoflineState {
  version: 1;
  decisions: Record<string, StoredDecision>;
  audit: AuditEntry[];
}

export const STATE_KEY = "proofline.v1";

export const EMPTY_STATE: ProoflineState = { version: 1, decisions: {}, audit: [] };

const VerdictSchema = z.enum([
  "SUPPORTED",
  "CONTRADICTED",
  "STALE",
  "UNVERIFIED",
  "CONFLICTING",
  "NOT_CHECKABLE",
]);
const DecisionSchema = z.enum(["approve", "reject", "needs_edit"]);

const StoredDecisionSchema = z.object({
  decision: DecisionSchema,
  reason: z.string(),
  at: z.string(),
  verdict: VerdictSchema,
  claim: z.string(),
  fact_id: z.string().nullable(),
});
const ProoflineStateSchema = z.object({
  version: z.literal(1),
  decisions: z.record(z.string(), StoredDecisionSchema),
  audit: z.array(
    z.object({
      id: z.string(),
      at: z.string(),
      decision: DecisionSchema,
      reason: z.string(),
      verdict: VerdictSchema,
      claim: z.string(),
      fact_id: z.string().nullable(),
    }),
  ),
});

/** Client-side parse at the storage boundary. Corrupt state is never trusted. */
export function loadState(): ProoflineState {
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = ProoflineStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as ProoflineState) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: ProoflineState): void {
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function resetDemo(): void {
  window.localStorage.removeItem(STATE_KEY);
}

export interface FindingLike {
  id: string;
  verdict: Verdict;
  claim: string;
  evidence: { fact_id: string } | null;
}

/** Record a reviewer decision and append the audit entry. Returns the new state. */
export function recordDecision(
  finding: FindingLike,
  decision: DecisionValue,
  reason: string,
): ProoflineState {
  const state = loadState();
  const at = new Date().toISOString();
  const entry: AuditEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    at,
    decision,
    reason: reason.trim(),
    verdict: finding.verdict,
    claim: finding.claim,
    fact_id: finding.evidence?.fact_id ?? null,
  };
  const next: ProoflineState = {
    version: 1,
    decisions: {
      ...state.decisions,
      [finding.id]: {
        decision,
        reason: entry.reason,
        at,
        verdict: finding.verdict,
        claim: finding.claim,
        fact_id: entry.fact_id,
      },
    },
    audit: [...state.audit, entry],
  };
  saveState(next);
  return next;
}

export const DECISION_LABEL: Record<DecisionValue, string> = {
  approve: "Approve",
  reject: "Reject",
  needs_edit: "Needs edit",
};
