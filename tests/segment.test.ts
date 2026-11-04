import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { segmentDraft } from "@/lib/segment";

const sample = readFileSync(join(process.cwd(), "seed/sample_draft.md"), "utf8");

describe("segmentDraft", () => {
  it("keeps exact character offsets into the original text", () => {
    for (const s of segmentDraft(sample)) {
      expect(sample.slice(s.charStart, s.charEnd)).toBe(s.text);
    }
  });

  it("excludes markdown headings", () => {
    const texts = segmentDraft(sample).map((s) => s.text);
    expect(texts.some((t) => /launch page/i.test(t))).toBe(false);
  });

  it("does not split ₹4,999 at the thousands comma", () => {
    const texts = segmentDraft(sample).map((s) => s.text);
    expect(texts.some((t) => t.includes("₹4,999"))).toBe(true);
  });

  it("splits comma-separated lists into clauses", () => {
    const texts = segmentDraft(sample).map((s) => s.text);
    expect(texts.some((t) => /5 seats/.test(t))).toBe(true);
    expect(texts.some((t) => /50 GB of storage/.test(t))).toBe(true);
  });

  it("splits 'seats, 50 GB' style lists at non-digit commas but not inside numbers", () => {
    const segs = segmentDraft("Alpha includes 5 seats, 50 GB of storage.");
    const texts = segs.map((s) => s.text);
    expect(texts).toContain("Alpha includes 5 seats");
    expect(texts).toContain("50 GB of storage");
  });

  it("strips leading conjunctions left by comma splits", () => {
    const segs = segmentDraft("one two three, and the best choice ever.");
    expect(segs.map((s) => s.text)).toContain("the best choice ever");
  });
});
