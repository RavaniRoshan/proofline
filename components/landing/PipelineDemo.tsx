"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface Stage {
  id: string;
  badge: string;
  title: string;
  description: string;
  stat: string;
  codeSnippet: string;
}

const STAGES: Stage[] = [
  {
    id: "deterministic",
    badge: "STAGE 1 · ZERO MODEL CALLS",
    title: "Deterministic rule resolution",
    description:
      "Claims with numbers, currency symbols, dates, product names, or missing disclaimers are normalized and checked directly in TypeScript against active register facts. 78% of claims resolve with zero latency and zero API cost.",
    stat: "78% resolved without LLM",
    codeSnippet: `// TypeScript exact-match pipeline (Stage 1)
const claim = segmentDraft(draftText);
if (isNumericOrScalar(claim)) {
  const norm = normalizeCurrency(claim.raw);
  const fact = register.lookup(claim.product, claim.attr);
  if (fact && fact.value !== norm) {
    return { verdict: "CONTRADICTED", evidence: fact };
  }
}`,
  },
  {
    id: "lexical",
    badge: "STAGE 2 · LEXICAL RETRIEVAL",
    title: "Token overlap candidate retrieval",
    description:
      "When a claim requires semantic checking, the system retrieves at most 5 candidate facts using lexical token scoring over (attribute + entity + value). No vector database, no embeddings, no embedding drift.",
    stat: "≤ 5 facts sent to model",
    codeSnippet: `// Lexical token overlap scoring
const candidates = facts
  .filter(f => f.status === "approved" && f.valid_until >= reviewDate)
  .map(f => ({ fact: f, score: tokenOverlap(claim.tokens, f.tokens) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);`,
  },
  {
    id: "model",
    badge: "STAGE 3 · TIERED MODEL ROUTING",
    title: "Server-side schema classification",
    description:
      "A fast, pinned model receives only the claim text and the 5 retrieved facts. It returns strict Zod-validated JSON containing fact IDs only. It cannot generate citations or invent dates.",
    stat: "Zero hallucinated citations",
    codeSnippet: `// Schema-constrained model contract
const ResponseSchema = z.object({
  relation: z.enum(["entails", "contradicts", "unrelated"]),
  matched_fact_id: z.string().optional(),
  confidence: z.number().min(0).max(1),
});
// Key never leaves the server`,
  },
  {
    id: "evidence",
    badge: "STAGE 4 · THE EVIDENCE GATE",
    title: "Code-enforced evidence verification",
    description:
      "The model proposes; code decides. If the verdict is CONTRADICTED, code asserts that fact_id, fact_version, source_document_id, source_span, valid_from, and valid_until are complete. If any field is missing, it downgrades to UNVERIFIED.",
    stat: "100% auditable evidence record",
    codeSnippet: `// The Evidence Gate invariant (SPEC.md §2.4)
if (verdict === "CONTRADICTED") {
  const complete = fact_id && fact_version && 
    source_document_id && source_span && valid_from && valid_until;
  if (!complete) {
    // Never ship an ungrounded contradiction
    return { verdict: "UNVERIFIED", reason: "missing_evidence" };
  }
}`,
  },
];

export function PipelineDemo() {
  const [activeStage, setActiveStage] = useState(0);
  const current = STAGES[activeStage];

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      {/* Left: Interactive Stage Selector */}
      <div className="flex flex-col gap-3">
        {STAGES.map((s, idx) => {
          const isActive = idx === activeStage;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStage(idx)}
              className={`p-5 text-left transition-all duration-200 group flex flex-col gap-2 rounded-[22px] border ${
                isActive
                  ? "border-accent/40 bg-card shadow-sm"
                  : "border-transparent hover:border-line hover:bg-panel/50"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-mono text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full ${
                    isActive ? "bg-accent/10 text-accent" : "bg-panel text-ink-soft"
                  }`}
                >
                  {s.badge}
                </span>
                <span className="font-mono text-[11px] text-muted">{s.stat}</span>
              </div>
              <p
                className={`text-[17px] font-semibold leading-snug transition-colors ${
                  isActive ? "text-ink" : "text-ink-soft group-hover:text-ink"
                }`}
              >
                {s.title}
              </p>
              <p className="text-[13px] text-ink-soft leading-relaxed max-w-[48ch] text-pretty">
                {s.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right: Code Inspector Panel */}
      <div className="rounded-[28px] border border-white/10 bg-[#141412] text-paper p-7 overflow-hidden flex flex-col shadow-2xl sticky top-28">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 font-mono text-[12px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-white/80 font-medium">pipeline/{current.id}.ts</span>
          </div>
          <span className="text-white/60 text-[11px] font-mono">PROOF-PIPELINE-V1</span>
        </div>

        {/* Code Content */}
        <pre className="font-mono text-[12px] leading-relaxed text-[#d7d1c9] overflow-x-auto p-4 bg-[#0d0d0b] rounded-2xl border border-white/5">
          <code>{current.codeSnippet}</code>
        </pre>

        {/* Live Status readout */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[12px] font-mono">
          <div className="flex items-center gap-2 text-accent-readable">
            <Check size={14} aria-hidden="true" />
            <span>Deterministic invariant checked</span>
          </div>
          <span className="text-white/80 text-[12px] font-semibold">{current.stat}</span>
        </div>
      </div>
    </div>
  );
}
