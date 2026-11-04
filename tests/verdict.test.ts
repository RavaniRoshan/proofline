import { afterEach, describe, expect, it } from "vitest";
import {
  decideClaim,
  evidenceProblem,
  findingId,
  gateContradicted,
  makeEvidence,
  severityOf,
} from "@/lib/verdict";
import { findFact } from "@/lib/seed";
import type { Finding } from "@/lib/types";

const REVIEW = "2026-11-04";

describe("decideClaim (deterministic verdicts)", () => {
  it("SUPPORTED: Starter 5 seats matches F-012", () => {
    const d = decideClaim(
      { attribute: "seat_limit", productId: "P-starter", claimValue: "5", unit: "seats" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("SUPPORTED");
    expect(d.decision.fact?.fact_id).toBe("F-012");
  });

  it("CONTRADICTED: ₹4,999 claim vs F-021 v4 (evidence attached)", () => {
    const d = decideClaim(
      { attribute: "price_monthly", productId: "P-starter", claimValue: "4,999", unit: "INR" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("CONTRADICTED");
    expect(d.decision.fact?.fact_id).toBe("F-021");
    expect(d.decision.fact?.version).toBe(4);
  });

  it("STALE: Legacy price claim matches only an expired fact", () => {
    const d = decideClaim(
      { attribute: "legacy_plan_price", productId: "P-starter", claimValue: "2,999", unit: "INR" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("STALE");
    expect(d.decision.fact?.fact_id).toBe("F-030");
  });

  it("CONFLICTING: Growth 25 seats — F-013 and F-024 both active, different values", () => {
    const d = decideClaim(
      { attribute: "seat_limit", productId: "P-growth", claimValue: "25", unit: "seats" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("CONFLICTING");
    expect(d.decision.fact?.fact_id).toBe("F-013");
    expect(d.decision.conflictWith).toContain("F-024");
  });

  it("CONFLICTING: Growth 50 seats — claim matches F-024, disagrees with F-013", () => {
    const d = decideClaim(
      { attribute: "seat_limit", productId: "P-growth", claimValue: "50", unit: "seats" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("CONFLICTING");
    expect(d.decision.fact?.fact_id).toBe("F-024");
    expect(d.decision.conflictWith).toContain("F-013");
  });

  it("CONTRADICTED: Starter 5 workspaces vs F-047 (1)", () => {
    const d = decideClaim(
      { attribute: "workspace_limit", productId: "P-starter", claimValue: "5", unit: "workspaces" },
      REVIEW,
    );
    expect(d.kind).toBe("decided");
    if (d.kind !== "decided") return;
    expect(d.decision.verdict).toBe("CONTRADICTED");
    expect(d.decision.fact?.fact_id).toBe("F-047");
  });

  it("UNVERIFIED (no_match): claim about an unregistered attribute", () => {
    const d = decideClaim(
      { attribute: "records_per_day", productId: "P-starter", claimValue: "4000000", unit: "none" },
      REVIEW,
    );
    expect(d.kind).toBe("no_match");
  });

  it("needs_model: minutes vs business days cannot be compared in code", () => {
    const d = decideClaim(
      { attribute: "onboarding_days", productId: "P-starter", claimValue: "30", unit: "minutes" },
      REVIEW,
    );
    expect(d.kind).toBe("needs_model");
  });
});

describe("evidence gate", () => {
  const f021v4 = findFact("F-021", 4);
  if (!f021v4) throw new Error("fixture F-021 v4 missing");

  it("accepts a complete evidence record", () => {
    expect(evidenceProblem(makeEvidence(f021v4))).toBeNull();
  });

  it("rejects a record with an unresolvable fact_id", () => {
    const e = { ...makeEvidence(f021v4), fact_id: "F-999" };
    expect(evidenceProblem(e)).toMatch(/does not resolve/);
  });

  it("rejects incomplete records (missing span / dates)", () => {
    const e = { ...makeEvidence(f021v4), source_span: "", valid_until: "" };
    expect(evidenceProblem(e)).toMatch(/source_span|valid_until/);
  });

  const baseFinding = (): Finding => ({
    id: findingId("x", 0, 1),
    claim: "Flowdesk starts at ₹4,999 per month.",
    char_start: 0,
    char_end: 38,
    claim_type: "numeric",
    verdict: "CONTRADICTED",
    severity: 3,
    reason: "test",
    suggested_correction: null,
    evidence: makeEvidence(f021v4),
    source: "deterministic",
  });

  it("passes CONTRADICTED through when evidence is complete", () => {
    const f = gateContradicted(baseFinding());
    expect(f.verdict).toBe("CONTRADICTED");
  });

  it("throws in non-production when evidence is incomplete", () => {
    const bad = { ...baseFinding(), evidence: null };
    expect(() => gateContradicted(bad)).toThrow(/Evidence gate/);
  });

  it("downgrades to UNVERIFIED in production when evidence is incomplete", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      const f = gateContradicted({ ...baseFinding(), evidence: null });
      expect(f.verdict).toBe("UNVERIFIED");
      expect(f.reason).toMatch(/Downgraded/);
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});

describe("severityOf", () => {
  it("ranks contradicted numeric highest", () => {
    expect(severityOf("CONTRADICTED", "numeric")).toBe(3);
    expect(severityOf("CONTRADICTED", "entity")).toBe(2);
    expect(severityOf("STALE", "numeric")).toBe(2);
    expect(severityOf("CONFLICTING", "numeric")).toBe(2);
    expect(severityOf("UNVERIFIED", "numeric")).toBe(1);
    expect(severityOf("SUPPORTED", "numeric")).toBe(0);
    expect(severityOf("NOT_CHECKABLE", "qualitative")).toBe(0);
  });
});

const prevEnv = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = prevEnv;
});
