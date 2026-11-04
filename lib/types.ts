export type Verdict =
  | "SUPPORTED"
  | "CONTRADICTED"
  | "STALE"
  | "UNVERIFIED"
  | "CONFLICTING"
  | "NOT_CHECKABLE";

export type ClaimType =
  | "numeric"
  | "temporal"
  | "entity"
  | "disclaimer"
  | "qualitative"
  | "not_a_claim";

/** Severity is used for sort order only. */
export type Severity = 0 | 1 | 2 | 3;

export interface EvidenceRecord {
  fact_id: string;
  fact_version: number;
  source_document_id: string;
  source_version_id: string;
  source_span: string;
  valid_from: string;
  valid_until: string;
  attribute: string;
  product_id: string;
  value: string;
  unit: string;
  display_value: string;
  document_title: string;
}

export interface Finding {
  /** Stable across runs for identical input (cyrb53 of claim + span). */
  id: string;
  claim: string;
  char_start: number;
  char_end: number;
  claim_type: ClaimType;
  verdict: Verdict;
  severity: Severity;
  /** One sentence, no citation text. */
  reason: string;
  suggested_correction: string | null;
  /** Resolved evidence — UI renders this; the model never writes it. */
  evidence: EvidenceRecord | null;
  /** Other approved fact_ids in conflict (CONFLICTING only). */
  conflict_with?: string[];
  source: "deterministic" | "model";
}

export interface VerifySummary {
  total: number;
  by_verdict: Record<Verdict, number>;
  deterministic: number;
  model: number;
  review_date: string;
}

export interface VerifyResult {
  findings: Finding[];
  summary: VerifySummary;
}

export const ALL_VERDICTS: Verdict[] = [
  "SUPPORTED",
  "CONTRADICTED",
  "STALE",
  "UNVERIFIED",
  "CONFLICTING",
  "NOT_CHECKABLE",
];
