import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { verifyDraft } from "@/lib/verify";
import { LlmParseError, type LlmClient } from "@/lib/llm";
import { evidenceProblem } from "@/lib/verdict";
import type { ModelResponse } from "@/lib/schemas";

const sample = readFileSync(join(process.cwd(), "seed/sample_draft.md"), "utf8");
const REVIEW = "2026-11-04";

function fakeLlm(response: Partial<ModelResponse>): LlmClient {
  return {
    name: "fake",
    async reviewClaim() {
      return {
        claim_type: "qualitative",
        candidate_fact_ids: [],
        relation: "insufficient",
        confidence: 0.5,
        reason: "fake",
        suggested_correction: null,
        ...response,
      };
    },
  };
}

describe("verifyDraft — sample draft, no LLM (hermetic)", () => {
  it("produces the expected headline findings with evidence", async () => {
    const { findings } = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    const byClaim = (needle: string) => findings.find((f) => f.claim.includes(needle));

    expect(byClaim("₹4,999")?.verdict).toBe("CONTRADICTED");
    expect(byClaim("₹4,999")?.evidence?.fact_id).toBe("F-021");

    expect(byClaim("2,999")?.verdict).toBe("STALE");
    expect(byClaim("25 seats")?.verdict).toBe("CONFLICTING");
    expect(byClaim("3 business days")?.verdict).toBe("SUPPORTED");
    // Draft ends with the required disclaimer — no missing-disclaimer finding.
    expect(findings.some((f) => f.claim.includes("without the required change disclaimer"))).toBe(
      false,
    );
    // The disclaimer line itself is not a checkable claim.
    expect(byClaim("Pricing is subject to change")?.verdict).toBe("NOT_CHECKABLE");
  });

  it("never emits CONTRADICTED without complete, resolvable evidence", async () => {
    const { findings } = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    for (const f of findings) {
      if (f.verdict === "CONTRADICTED") {
        expect(evidenceProblem(f.evidence)).toBeNull();
      }
    }
  });

  it("resolves at least 60% of claims with zero model calls", async () => {
    const { summary } = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    expect(summary.deterministic / summary.total).toBeGreaterThanOrEqual(0.6);
  });

  it("sorts findings by severity, contradicted numeric first", async () => {
    const { findings } = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    for (let i = 1; i < findings.length; i++) {
      expect(findings[i - 1]!.severity).toBeGreaterThanOrEqual(findings[i]!.severity);
    }
    expect(findings[0]!.severity).toBe(3);
  });

  it("is deterministic for identical input", async () => {
    const a = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    const b = await verifyDraft(sample, { reviewDate: REVIEW, llm: null });
    expect(a.findings.map((f) => f.id)).toEqual(b.findings.map((f) => f.id));
  });
});

describe("verifyDraft — model path (fake client)", () => {
  const superlative = "Flowdesk is the most trusted onboarding platform in the market.";

  it("SUPPORTED when the model entails with confidence >= 0.75 and cites an active fact", async () => {
    const { findings } = await verifyDraft(superlative, {
      reviewDate: REVIEW,
      llm: fakeLlm({ relation: "supports", confidence: 0.9, candidate_fact_ids: ["F-014"] }),
    });
    expect(findings[0]?.verdict).toBe("SUPPORTED");
    expect(findings[0]?.source).toBe("model");
    expect(findings[0]?.evidence?.fact_id).toBe("F-014");
  });

  it("CONTRADICTED when the model cites an active fact it contradicts", async () => {
    const { findings } = await verifyDraft(superlative, {
      reviewDate: REVIEW,
      llm: fakeLlm({
        relation: "contradicts",
        confidence: 0.9,
        candidate_fact_ids: ["F-014"],
        reason: "The approved fact rules this out.",
      }),
    });
    expect(findings[0]?.verdict).toBe("CONTRADICTED");
    expect(findings[0]?.evidence?.fact_id).toBe("F-014");
  });

  it("downgrades to UNVERIFIED when the model cites an unresolvable fact", async () => {
    const { findings } = await verifyDraft(superlative, {
      reviewDate: REVIEW,
      llm: fakeLlm({
        relation: "contradicts",
        confidence: 0.9,
        candidate_fact_ids: ["F-999"],
      }),
    });
    expect(findings[0]?.verdict).toBe("UNVERIFIED");
    expect(findings[0]?.evidence).toBeNull();
  });

  it("NOT_CHECKABLE for qualitative claims with no factual predicate", async () => {
    const { findings } = await verifyDraft(superlative, {
      reviewDate: REVIEW,
      llm: fakeLlm({ relation: "insufficient", confidence: 0.9, candidate_fact_ids: [] }),
    });
    expect(findings[0]?.verdict).toBe("NOT_CHECKABLE");
  });

  it("throws (never silently falls back) when the model output fails validation", async () => {
    const broken: LlmClient = {
      name: "broken",
      async reviewClaim() {
        throw new LlmParseError("model returned no JSON object");
      },
    };
    await expect(verifyDraft(superlative, { reviewDate: REVIEW, llm: broken })).rejects.toThrow(
      /model returned no JSON/,
    );
  });
});
