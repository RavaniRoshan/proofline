import type { Finding } from "@/lib/types";
import { PROMPT_VERSION } from "@/lib/llm";

export interface DecisionTrace {
  source: "RULE" | "MODEL";
  ruleName: string;
  summary: string;
  modelId?: string;
  promptVersion?: string;
  latencyMs?: number;
}

export function getDecisionTrace(finding: Finding): DecisionTrace {
  if (finding.source === "deterministic") {
    switch (finding.claim_type) {
      case "numeric":
        return {
          source: "RULE",
          ruleName: "rule:numeric-scalar-bounds",
          summary: "Deterministic numeric matcher — normalized scalar value verified against active fact register bounds with zero model cost.",
        };
      case "temporal":
        return {
          source: "RULE",
          ruleName: "rule:temporal-validity-window",
          summary: "Deterministic temporal evaluator — verified review date against fact validity window [valid_from → valid_until].",
        };
      case "entity":
        return {
          source: "RULE",
          ruleName: "rule:entity-scope-attribute",
          summary: "Deterministic entity resolver — matched product scope and attribute pair in TypeScript.",
        };
      case "disclaimer":
        return {
          source: "RULE",
          ruleName: "rule:mandatory-pricing-disclaimer",
          summary: "Deterministic governance guard — asserted presence of required pricing change disclaimer.",
        };
      default:
        return {
          source: "RULE",
          ruleName: "rule:deterministic-register-lookup",
          summary: "Deterministic register rule — resolved in TypeScript without calling external model.",
        };
    }
  }

  return {
    source: "MODEL",
    ruleName: "model:semantic-entailment-classifier",
    summary: "Tiered model check — qualitative relation evaluated against candidate facts with strict evidence assertion.",
    modelId: finding.model_id ?? undefined,
    promptVersion: finding.prompt_version ?? PROMPT_VERSION,
    latencyMs: finding.latency_ms ?? undefined,
  };
}
