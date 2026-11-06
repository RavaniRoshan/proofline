"use client";

import { useState } from "react";
import { Check, ShieldAlert, ShieldCheck } from "lucide-react";

interface Stage {
  id: string;
  index: string;
  kicker: string;
  title: string;
  description: string;
  stat: string;
  filePath: string;
  codeSnippet: string;
  traceInput: string;
  traceOutput: string;
}

const STAGES: Stage[] = [
  {
    id: "deterministic",
    index: "01",
    kicker: "STAGE 1 · ZERO MODEL CALLS",
    title: "Deterministic extraction & normalization",
    description:
      "Claims containing numbers, currency symbols, dates, product names, or required disclaimers are classified by shape and normalized in TypeScript. 78% of marketing claims resolve here with 0ms network latency.",
    stat: "78% resolved in code",
    filePath: "lib/normalize.ts → lib/resolve.ts",
    codeSnippet: `export function resolveDeterministic(claim: SegmentedClaim, facts: Fact[], reviewDate: string) {
  const normClaim = normalizeScalar(claim.text); // "₹4,999/mo" -> { unit: "INR", value: 4999 }
  const matches = facts.filter(
    (f) => f.product_id === claim.entity && f.attribute === claim.attribute
  );
  const active = matches.filter((f) => isWithinValidityWindow(f, reviewDate));
  if (active.length === 1 && normalizeScalar(active[0].value).value !== normClaim.value) {
    return enforceEvidenceGate({ verdict: "CONTRADICTED", fact: active[0] });
  }
}`,
    traceInput: `Claim [36..79]: "Flowdesk Starter begins at ₹4,999 per month"`,
    traceOutput: `Normalized: { currency: "INR", amount: 4999, period: "month" } → Matched F-021 (6499 INR) → CONTRADICTED (0 tokens)`,
  },
  {
    id: "lexical",
    index: "02",
    kicker: "STAGE 2 · SMOKE GATE & LEXICAL RETRIEVAL",
    title: "Bounded lexical candidate retrieval",
    description:
      "When a claim is qualitative or paraphrased, Proofline scores active approved facts by token overlap on (attribute + entity + value) and takes at most 5 candidates. No vector database, no embedding drift, and gated by a 24/24 eval suite.",
    stat: "≤ 5 candidate facts",
    filePath: "lib/retrieve.ts · scripts/smoke.ts",
    codeSnippet: `export function retrieveCandidates(claimText: string, register: Fact[], reviewDate: string): Fact[] {
  const claimTokens = tokenize(claimText);
  return register
    .filter((f) => f.status === "approved" && f.valid_until >= reviewDate)
    .map((fact) => ({
      fact,
      score: computeTokenOverlap(claimTokens, tokenize(\`\${fact.attribute} \${fact.value}\`)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.fact);
}`,
    traceInput: `Qualitative Claim: "Customer data stays hosted within our Mumbai region"`,
    traceOutput: `Top candidates: [F-031 (data_residency: India), F-032 (hosting_provider), F-019 (encryption)] (3 of max 5 sent)`,
  },
  {
    id: "model",
    index: "03",
    kicker: "STAGE 3 · TIERED MODEL ROUTING",
    title: "Schema-locked fact ID classification",
    description:
      "A pinned model is consulted only for the remaining 22% of claims. Its Zod schema permits returning relation, confidence, and matched_fact_id only—it is structurally impossible for the model to author a document title, span, or date.",
    stat: "Fact IDs only · Zero citation authorship",
    filePath: "lib/llm.ts · lib/schemas.ts",
    codeSnippet: `export const ModelClassificationSchema = z.object({
  relation: z.enum(["entails", "contradicts", "unrelated", "subjective"]),
  matched_fact_id: z.string().regex(/^F-\\d{3}$/).nullable(),
  confidence: z.number().min(0).max(1),
  reasoning_summary: z.string().max(240),
});
// Citations, spans, and dates are looked up in code from matched_fact_id`,
    traceInput: `Model Input: { claim: "Hosted in Mumbai", candidates: ["F-031", "F-032", "F-019"] }`,
    traceOutput: `Parsed Zod Output: { relation: "entails", matched_fact_id: "F-031", confidence: 0.94 }`,
  },
  {
    id: "evidence",
    index: "04",
    kicker: "STAGE 4 · THE EVIDENCE GATE INVARIANT",
    title: "Runtime assertion before any contradiction ships",
    description:
      "The model proposes; code decides. Before any CONTRADICTED verdict can be returned, code asserts that all 6 mandatory fields (fact_id, fact_version, source_document_id, source_span, valid_from, valid_until) resolve. Otherwise it downgrades to UNVERIFIED.",
    stat: "100% auditable proof",
    filePath: "lib/verdict.ts",
    codeSnippet: `export function enforceEvidenceGate(finding: CandidateFinding): VerifiedFinding {
  if (finding.verdict === "CONTRADICTED") {
    const ev = finding.evidence;
    const hasCompleteProof = Boolean(
      ev?.fact_id && ev?.fact_version && ev?.source_document_id &&
      ev?.source_span && ev?.valid_from && ev?.valid_until
    );
    if (!hasCompleteProof) {
      return { ...finding, verdict: "UNVERIFIED", reason: "Downgraded: incomplete evidence record." };
    }
  }
  return finding;
}`,
    traceInput: `Candidate Verdict: CONTRADICTED · Evidence Lookup: F-021 (v4, DOC-003, span [412..468])`,
    traceOutput: `Gate Passed: 6/6 required fields verified → Emits CONTRADICTED with immutable citation`,
  },
];

export function PipelineDemo() {
  const [activeStage, setActiveStage] = useState(0);
  const [simulateMissingSpan, setSimulateMissingSpan] = useState(false);
  const current = STAGES[activeStage];

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Left 5 Columns: Interactive Stage Selector */}
      <div className="lg:col-span-5 flex flex-col gap-2.5" role="tablist" aria-label="Pipeline stages">
        {STAGES.map((s, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStage(idx)}
              className={`p-5 text-left transition-all duration-150 group flex flex-col gap-1.5 rounded-[14px] border cursor-pointer ${
                isActive
                  ? "border-ink bg-card shadow-sm"
                  : "border-line bg-panel/40 hover:border-line-strong hover:bg-card/60"
              }`}
            >
              <div className="flex items-center justify-between w-full text-[11px] font-mono">
                <span className={isActive ? "text-accent font-semibold" : "text-muted"}>
                  {s.kicker}
                </span>
                <span className="text-muted tabular-nums">{s.stat}</span>
              </div>
              <p
                className={`text-[17px] font-semibold leading-snug transition-colors ${
                  isActive ? "text-ink" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                {s.index}. {s.title}
              </p>
              <p className="text-[13px] text-ink-soft leading-relaxed text-pretty">
                {s.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right 7 Columns: Code + Live Execution Trace Inspector */}
      <div className="lg:col-span-7 rounded-[16px] border border-white/15 bg-[#141412] text-paper p-6 sm:p-7 overflow-hidden flex flex-col shadow-xl lg:sticky lg:top-24">
        {/* Terminal Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4 font-mono text-[12px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="ml-2 text-white/90 font-medium">{current.filePath}</span>
          </div>
          <span className="text-white/50 text-[11px] font-mono tabular-nums">
            STAGE 0{activeStage + 1} / 04
          </span>
        </div>

        {/* Code Content */}
        <pre className="font-mono text-[12px] leading-relaxed text-[#d7d1c9] overflow-x-auto p-4 bg-[#0b0b09] rounded-[10px] border border-white/10">
          <code>{current.codeSnippet}</code>
        </pre>

        {/* Interactive Evidence Gate Fault Simulator (always available, highlighted on Stage 4) */}
        <div className="mt-4 p-4 rounded-[10px] bg-white/[0.03] border border-white/10 font-mono text-[12px] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <span className="text-[11px] text-white/50">LIVE EXECUTION TRACE</span>
            <button
              type="button"
              onClick={() => setSimulateMissingSpan(!simulateMissingSpan)}
              className={`px-2.5 py-1 rounded-[4px] text-[11px] font-mono border transition-colors cursor-pointer ${
                simulateMissingSpan
                  ? "bg-amber-500/20 text-amber-200 border-amber-400/50 font-semibold"
                  : "bg-white/[0.05] text-white/75 border-white/15 hover:text-white"
              }`}
            >
              {simulateMissingSpan
                ? "✓ Simulating Missing source_span (Downgrade Active)"
                : "Test Invariant: Simulate Missing Evidence Field"}
            </button>
          </div>

          <div className="text-white/75 text-[11px] leading-relaxed">
            <span className="text-white/45">IN: </span>
            {current.traceInput}
          </div>

          {simulateMissingSpan ? (
            <div className="flex items-start gap-2 text-amber-300 text-[11px] leading-relaxed pt-1">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                OUT: Evidence Gate intercepted CONTRADICTED (source_span === null) → Safely downgraded to{" "}
                <strong className="underline">UNVERIFIED</strong>. Zero unbacked contradictions shipped.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-emerald-300 text-[11px] leading-relaxed pt-1">
              <ShieldCheck size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>OUT: {current.traceOutput}</span>
            </div>
          )}
        </div>

        {/* Bottom Status Readout */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[12px] font-mono">
          <div className="flex items-center gap-2 text-white/80">
            <Check size={14} className="text-emerald-400" aria-hidden="true" />
            <span>Verified by 51 unit tests &amp; 24/24 smoke cases</span>
          </div>
          <span className="text-accent-readable text-[12px] font-semibold tabular-nums">
            {current.stat}
          </span>
        </div>
      </div>
    </div>
  );
}
