import { z } from "zod";
import type { Verdict } from "@/lib/types";
import { FactSchema, type Fact } from "@/lib/schemas";

export type DecisionValue = "approve" | "reject" | "needs_edit";

export interface AuditEntry {
  id: string;
  at: string;
  decision: DecisionValue;
  reason: string;
  /** null for register approvals, which carry no claim verdict. */
  verdict: Verdict | null;
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
  /**
   * Locally approved register rows: each approved new version, plus the
   * previous rows marked superseded. Merged over the seed at read time
   * (lib/seed.ts mergeLocalFacts) — the seed files themselves never change.
   */
  fact_overrides: Fact[];
}

export const STATE_KEY = "proofline.v1";

export const EMPTY_STATE: ProoflineState = { version: 1, decisions: {}, audit: [], fact_overrides: [] };

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
      verdict: VerdictSchema.nullable(),
      claim: z.string(),
      fact_id: z.string().nullable(),
    }),
  ),
  fact_overrides: z.array(FactSchema).default([]),
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
  window.dispatchEvent(new Event(STATE_EVENT));
}

export const STATE_EVENT = "proofline:update";

/** Cached client snapshot so useSyncExternalStore gets a stable identity. */
let cachedSnapshot: ProoflineState | null = null;
export function getStateSnapshot(): ProoflineState {
  if (!cachedSnapshot) cachedSnapshot = loadState();
  return cachedSnapshot;
}
export function invalidateSnapshot(): void {
  cachedSnapshot = null;
}

export function subscribeState(callback: () => void): () => void {
  const onUpdate = () => {
    invalidateSnapshot();
    callback();
  };
  window.addEventListener(STATE_EVENT, onUpdate);
  window.addEventListener("storage", onUpdate);
  return () => {
    window.removeEventListener(STATE_EVENT, onUpdate);
    window.removeEventListener("storage", onUpdate);
  };
}

/** Server snapshot: always empty, always identical identity. */
export const SERVER_SNAPSHOT: ProoflineState = EMPTY_STATE;

export function resetDemo(): void {
  window.localStorage.removeItem(STATE_KEY);
  invalidateSnapshot();
  window.dispatchEvent(new Event(STATE_EVENT));
}

export interface FindingLike {
  id: string;
  verdict: Verdict;
  claim: string;
  evidence: { fact_id: string } | null;
}

function newEntryId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function upsertOverrides(existing: Fact[], rows: Fact[]): Fact[] {
  const byKey = new Map(existing.map((f) => [`${f.fact_id}@${f.version}`, f]));
  for (const f of rows) byKey.set(`${f.fact_id}@${f.version}`, f);
  return [...byKey.values()];
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
    id: newEntryId(),
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
    fact_overrides: state.fact_overrides,
  };
  saveState(next);
  return next;
}

/**
 * Approve an edited value as a new version of a fact. The current approved
 * row is overridden to "superseded"; a same-fact_id, version+1 "approved" row
 * is added with valid_from = reviewDate; the change is logged to the audit
 * trail naming both values. Seed files are never touched.
 */
export function approveFactVersion(
  current: Fact,
  change: { value: string; displayValue: string },
  reviewDate: string,
): ProoflineState {
  const value = change.value.trim();
  const displayValue = change.displayValue.trim();
  if (!value || !displayValue) {
    throw new Error("New value and display value are both required.");
  }
  const state = loadState();
  const at = new Date().toISOString();
  const oldDisplay = current.display_value || String(current.value);
  const approved: Fact = {
    ...current,
    version: current.version + 1,
    value,
    display_value: displayValue,
    valid_from: reviewDate,
    supersedes_fact_id: current.fact_id,
    status: "approved",
    approved_by: "brand-owner",
    approved_at: at,
  };
  const superseded: Fact = { ...current, status: "superseded" };
  const entry: AuditEntry = {
    id: newEntryId(),
    at,
    decision: "approve",
    reason: `Approved value changed from “${oldDisplay}” to “${displayValue}”. v${current.version} superseded; valid from ${reviewDate}.`,
    verdict: null,
    claim: `${current.fact_id} · ${current.attribute} (v${current.version} → v${approved.version})`,
    fact_id: current.fact_id,
  };
  const next: ProoflineState = {
    ...state,
    fact_overrides: upsertOverrides(state.fact_overrides, [superseded, approved]),
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
