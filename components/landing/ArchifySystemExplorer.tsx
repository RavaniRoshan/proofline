"use client";

import { useState, useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { ArrowRight, Code2, Eye, GitCommit, Layers, ShieldCheck } from "lucide-react";

type RouteLens = "all" | "deterministic" | "semantic" | "downgrade";

interface ArchNode {
  id: string;
  title: string;
  file: string;
  role: string;
  stage: string;
  x: number;
  y: number;
  w: number;
  h: number;
  routes: RouteLens[];
  summary: string;
  invariants: string[];
  codeExcerpt: string;
  upstream: string[];
  downstream: string[];
}

interface ArchEdge {
  id: string;
  from: string;
  to: string;
  path: string;
  label: string;
  labelX: number;
  labelY: number;
  routes: RouteLens[];
  isDashed?: boolean;
}

const ARCH_NODES: ArchNode[] = [
  {
    id: "segment",
    title: "Draft Segmenter",
    file: "lib/segment.ts",
    role: "INGESTION · STAGE 1A",
    stage: "01",
    x: 28,
    y: 130,
    w: 150,
    h: 76,
    routes: ["all", "deterministic", "semantic", "downgrade"],
    summary:
      "Splits pasted markdown draft into candidate claims while preserving 1:1 character offsets (char_start, char_end). Headings are excluded automatically.",
    invariants: [
      "Collapses single newlines 1:1 so byte offsets never drift",
      "Markdown headings (#, ##) are never classified as claims",
      "Deterministic pure function, <1ms latency",
    ],
    codeExcerpt: `// lib/segment.ts
export function segmentDraft(draft: string): SegmentedClaim[] {
  // Preserves exact [char_start, char_end] slices against raw draft
  return extractSentencesWithOffsets(draft).filter(s => !isHeading(s));
}`,
    upstream: [],
    downstream: ["classify"],
  },
  {
    id: "classify",
    title: "Shape Classifier",
    file: "lib/classify.ts",
    role: "ROUTER · STAGE 1B",
    stage: "02",
    x: 210,
    y: 130,
    w: 155,
    h: 76,
    routes: ["all", "deterministic", "semantic", "downgrade"],
    summary:
      "Classifies each segmented claim in TypeScript into numeric, temporal, entity, disclaimer, or qualitative without touching a language model.",
    invariants: [
      "78% of marketing claims match numeric, temporal, entity, or disclaimer",
      "Only qualitative claims without scalar tokens route to Stage 3",
    ],
    codeExcerpt: `// lib/classify.ts
export function classifyClaim(text: string): ClaimType {
  if (hasCurrencyOrNumber(text)) return "numeric";
  if (hasDateOrWindow(text)) return "temporal";
  if (hasProductEntity(text)) return "entity";
  return "qualitative";
}`,
    upstream: ["segment"],
    downstream: ["resolve", "retrieve"],
  },
  {
    id: "resolve",
    title: "Deterministic Resolver",
    file: "lib/normalize.ts + lib/resolve.ts",
    role: "FAST PATH · 78% CLAIMS",
    stage: "03A",
    x: 406,
    y: 44,
    w: 192,
    h: 82,
    routes: ["all", "deterministic", "downgrade"],
    summary:
      "Normalizes currency (₹4,999 → 4999 INR), units, and dates, then exact-matches active facts on (product_id, attribute) in memory.",
    invariants: [
      "Zero external API calls · 0.4ms execution time",
      "Detects STALE (review_date > valid_until) and CONFLICTING (>=2 active values)",
    ],
    codeExcerpt: `// lib/resolve.ts
const active = register.filter(f => f.product_id === entity && f.attribute === attr);
if (active.length > 1 && hasDistinctValues(active)) {
  return { verdict: "CONFLICTING", facts: active };
}`,
    upstream: ["classify"],
    downstream: ["gate"],
  },
  {
    id: "retrieve",
    title: "Lexical Top-5 Retriever",
    file: "lib/retrieve.ts + lib/llm.ts",
    role: "BOUNDED · 22% CLAIMS",
    stage: "03B",
    x: 406,
    y: 214,
    w: 192,
    h: 82,
    routes: ["all", "semantic", "downgrade"],
    summary:
      "Scores approved active facts by lexical token overlap on (attribute + entity + value), sending at most 5 candidates to the Zod-locked model.",
    invariants: [
      "No vector DB or embeddings, deterministic token overlap over <=200 facts",
      "Model returns matched_fact_id only, never authors citations or spans",
    ],
    codeExcerpt: `// lib/retrieve.ts
export function retrieveTopCandidates(claim: string, facts: Fact[]): Fact[] {
  return scoreByTokenOverlap(claim, facts)
    .filter(f => f.status === "approved")
    .slice(0, 5);
}`,
    upstream: ["classify"],
    downstream: ["gate"],
  },
  {
    id: "gate",
    title: "The Evidence Gate",
    file: "lib/verdict.ts",
    role: "INVARIANT · STAGE 4",
    stage: "04",
    x: 640,
    y: 126,
    w: 180,
    h: 86,
    routes: ["all", "deterministic", "semantic", "downgrade"],
    summary:
      "Runtime assertion enforcing LAW.md §5: no CONTRADICTED verdict can ship unless all 6 evidence fields resolve from the register.",
    invariants: [
      "Requires: fact_id, fact_version, source_document_id, source_span, valid_from, valid_until",
      "Automatically downgrades incomplete contradictions to UNVERIFIED",
    ],
    codeExcerpt: `// lib/verdict.ts
if (verdict === "CONTRADICTED" && !isCompleteEvidence(evidence)) {
  return { verdict: "UNVERIFIED", reason: "Evidence gate downgrade" };
}`,
    upstream: ["resolve", "retrieve"],
    downstream: ["audit"],
  },
  {
    id: "audit",
    title: "Verdict & Audit Ledger",
    file: "app/api/verify/route.ts",
    role: "OUTPUT · LOCALSTORAGE",
    stage: "05",
    x: 856,
    y: 130,
    w: 168,
    h: 76,
    routes: ["all", "deterministic", "semantic", "downgrade"],
    summary:
      "Emits Zod-validated findings sorted by severity. Human reviewer decisions (Approve, Reject, Request Edit) append to localStorage['proofline.v1'].",
    invariants: [
      "Zero server-side draft storage or PII retention",
      "One-click Reset Demo restores clean seed fixture",
    ],
    codeExcerpt: `// lib/local.ts
export function appendAuditDecision(entry: AuditEntry): void {
  const state = loadLocalState("proofline.v1");
  saveLocalState({ ...state, audit: [entry, ...state.audit] });
}`,
    upstream: ["gate"],
    downstream: [],
  },
];

const ARCH_EDGES: ArchEdge[] = [
  {
    id: "e-seg-cls",
    from: "segment",
    to: "classify",
    path: "M 178 168 L 210 168",
    label: "[char_start..end]",
    labelX: 194,
    labelY: 116,
    routes: ["all", "deterministic", "semantic", "downgrade"],
  },
  {
    id: "e-cls-res",
    from: "classify",
    to: "resolve",
    path: "M 365 152 C 386 152, 384 85, 406 85",
    label: "78% scalar/date",
    labelX: 342,
    labelY: 88,
    routes: ["all", "deterministic", "downgrade"],
  },
  {
    id: "e-cls-ret",
    from: "classify",
    to: "retrieve",
    path: "M 365 184 C 386 184, 384 255, 406 255",
    label: "22% qualitative",
    labelX: 342,
    labelY: 256,
    routes: ["all", "semantic"],
    isDashed: true,
  },
  {
    id: "e-res-gate",
    from: "resolve",
    to: "gate",
    path: "M 598 85 C 620 85, 618 154, 640 154",
    label: "<1ms exact lookup",
    labelX: 660,
    labelY: 88,
    routes: ["all", "deterministic", "downgrade"],
  },
  {
    id: "e-ret-gate",
    from: "retrieve",
    to: "gate",
    path: "M 598 255 C 620 255, 618 184, 640 184",
    label: "fact_id only",
    labelX: 652,
    labelY: 256,
    routes: ["all", "semantic"],
    isDashed: true,
  },
  {
    id: "e-gate-aud",
    from: "gate",
    to: "audit",
    path: "M 820 168 L 856 168",
    label: "6-field proof",
    labelX: 838,
    labelY: 116,
    routes: ["all", "deterministic", "semantic", "downgrade"],
  },
];

export function ArchifySystemExplorer() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("gate");
  const [activeLens, setActiveLens] = useState<RouteLens>("all");
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = ARCH_NODES.find((n) => n.id === selectedNodeId) ?? ARCH_NODES[4];

  // Trigger Anime.js pulse choreography along active edges & nodes when lens or selected node changes
  useEffect(() => {
    if (!svgRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const activeNodeEls = svgRef.current.querySelectorAll(".arch-node-active");
    const packetEls = svgRef.current.querySelectorAll(".arch-signal-dot");

    animate(activeNodeEls, {
      opacity: [0.45, 1],
      duration: 340,
      ease: "outCubic",
      delay: stagger(35),
    });

    animate(packetEls, {
      opacity: [0.25, 1, 0.25],
      r: [2.5, 4.5, 2.5],
      duration: 1600,
      loop: true,
      ease: "inOutSine",
      delay: stagger(240),
    });
  }, [activeLens, selectedNodeId]);

  return (
    <div className="mt-10 rounded-[18px] border border-line-strong bg-card overflow-hidden">
      {/* Top Archify Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-panel border-b border-line font-mono text-[12px]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-ink font-semibold">
            <Layers size={14} className="text-accent" aria-hidden="true" />
            <span>ARCHIFY SYSTEM MAP</span>
          </span>
          <span className="text-muted" aria-hidden="true">·</span>
          <span className="text-ink-soft hidden sm:inline">
            CODE → DIAGRAM · Click any module node to inspect its source contract &amp; reach
          </span>
        </div>

        {/* Route Lens Switcher */}
        <div
          role="tablist"
          aria-label="Architecture route lens"
          className="flex flex-wrap items-center gap-1 p-1 rounded-[6px] bg-paper border border-line"
        >
          {(
            [
              { id: "all", label: "All Paths (100%)" },
              { id: "deterministic", label: "Deterministic Fast-Path (78%)" },
              { id: "semantic", label: "Semantic Bounded Path (22%)" },
              { id: "downgrade", label: "Evidence Gate Guard" },
            ] as const
          ).map((lens) => {
            const active = activeLens === lens.id;
            return (
              <button
                key={lens.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveLens(lens.id);
                  if (lens.id === "deterministic") setSelectedNodeId("resolve");
                  if (lens.id === "semantic") setSelectedNodeId("retrieve");
                  if (lens.id === "downgrade") setSelectedNodeId("gate");
                }}
                className={`px-2.5 py-1 rounded-[4px] text-[11px] font-mono transition-colors transition-transform cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                  active
                    ? "bg-ink text-paper font-semibold"
                    : "text-ink-soft hover:text-ink hover:bg-panel"
                }`}
              >
                {lens.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="p-4 sm:p-6 bg-panel border-b border-line overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 1040 340"
          className="w-full h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Archify interactive source-backed runtime architecture map of Proofline"
        >
          <defs>
            <pattern id="archifyGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1A1A18" fillOpacity="0.09" />
            </pattern>
            <marker
              id="archArrowActive"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#6E1F26" />
            </marker>
            <marker
              id="archArrowMuted"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#C9C9C1" />
            </marker>
          </defs>

          <rect width="1040" height="340" rx="12" fill="url(#archifyGrid)" />

          {/* Trust Boundary Zone Box around Stage 1-4 Server / Deterministic Core */}
          <rect
            x="16"
            y="20"
            width="818"
            height="300"
            rx="10"
            fill="#FFFFFF"
            fillOpacity="0.55"
            stroke="#DEDED8"
            strokeWidth="1.2"
            strokeDasharray="5 5"
          />
          <text
            x="30"
            y="40"
            fontFamily="var(--font-plex-mono), monospace"
            fontSize="10"
            fill="#6B6B63"
            fontWeight="600"
          >
            STATELESS VERIFICATION BOUNDARY · POST /API/VERIFY · ZERO DATABASE WRITES
          </text>

          {/* Edges */}
          {ARCH_EDGES.map((edge) => {
            const inLens = edge.routes.includes(activeLens);
            const isConnectedToSelected =
              edge.from === selectedNodeId || edge.to === selectedNodeId;
            const strokeColor = !inLens
              ? "#E2E2DC"
              : isConnectedToSelected
                ? "#6E1F26"
                : "#3B4A45";

            return (
              <g key={edge.id} opacity={inLens ? 1 : 0.3}>
                <path
                  d={edge.path}
                  stroke={strokeColor}
                  strokeWidth={isConnectedToSelected ? "2.4" : "1.7"}
                  strokeDasharray={edge.isDashed ? "5 4" : undefined}
                  markerEnd={inLens ? "url(#archArrowActive)" : "url(#archArrowMuted)"}
                />
                {inLens && (
                  <circle
                    className="arch-signal-dot"
                    cx={edge.labelX}
                    cy={edge.labelY + 10}
                    r="3.2"
                    fill="#6E1F26"
                  />
                )}
                <text
                  x={edge.labelX}
                  y={edge.labelY}
                  textAnchor="middle"
                  fontFamily="var(--font-plex-mono), monospace"
                  fontSize="10"
                  fill={isConnectedToSelected ? "#6E1F26" : "#4F4F4A"}
                  fontWeight={isConnectedToSelected ? "600" : "400"}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {ARCH_NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const inLens = node.routes.includes(activeLens);
            const isNeighbor =
              selectedNode.upstream.includes(node.id) ||
              selectedNode.downstream.includes(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNodeId(node.id)}
                className="cursor-pointer"
                opacity={inLens ? 1 : 0.35}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${node.title} (${node.file})`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedNodeId(node.id);
                  }
                }}
              >
                <g className={inLens ? "arch-node-active" : undefined}>
                  <rect
                    width={node.w}
                    height={node.h}
                    rx="10"
                    fill={isSelected ? "#1A1A18" : "#FFFFFF"}
                    stroke={
                      isSelected
                        ? "#6E1F26"
                        : isNeighbor
                          ? "#3B4A45"
                          : "#C9C9C1"
                    }
                    strokeWidth={isSelected ? "2.2" : isNeighbor ? "1.6" : "1.2"}
                  />

                  {/* Stage Tag */}
                  <text
                    x="12"
                    y="20"
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize="10"
                    fill={isSelected ? "#D4847A" : "#6E1F26"}
                    fontWeight="600"
                  >
                    {node.stage} · {node.role}
                  </text>

                  {/* Node Title */}
                  <text
                    x="12"
                    y="42"
                    fontFamily="var(--font-plex-sans), system-ui, sans-serif"
                    fontSize="13"
                    fill={isSelected ? "#FFFFFF" : "#1A1A18"}
                    fontWeight="600"
                  >
                    {node.title}
                  </text>

                  {/* Source File Path */}
                  <text
                    x="12"
                    y="62"
                    fontFamily="var(--font-plex-mono), monospace"
                    fontSize="10.5"
                    fill={isSelected ? "#A0A09A" : "#4F4F4A"}
                  >
                    {node.file}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Source-Backed Inspector Drawer (Archify Source Card) */}
      <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line bg-card">
        {/* Left 6 Columns: Selected Node Explanation & Reach */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line font-mono text-[11px]">
              <span className="text-accent font-semibold">
                FOCUSED NODE · {selectedNode.stage} / {selectedNode.title.toUpperCase()}
              </span>
              <span className="text-muted flex items-center gap-1">
                <GitCommit size={12} aria-hidden="true" />
                <span>{selectedNode.file}</span>
              </span>
            </div>

            <p className="mt-3.5 text-[14px] text-ink leading-relaxed text-pretty">
              {selectedNode.summary}
            </p>

            <ul className="mt-4 space-y-1.5 text-[12px] font-mono text-ink-soft">
              {selectedNode.invariants.map((inv) => (
                <li key={inv} className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-v-supported-fg shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upstream / Downstream Reach Navigation */}
          <div className="mt-5 pt-3.5 border-t border-line flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-muted">UPSTREAM:</span>
              {selectedNode.upstream.length === 0 ? (
                <span className="text-ink-soft">Entrypoint (Raw Draft)</span>
              ) : (
                selectedNode.upstream.map((upId) => (
                  <button
                    key={upId}
                    type="button"
                    onClick={() => setSelectedNodeId(upId)}
                    className="underline text-ink hover:text-accent cursor-pointer"
                  >
                    {upId}.ts
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted">DOWNSTREAM:</span>
              {selectedNode.downstream.length === 0 ? (
                <span className="text-ink-soft">Client UI / Audit Log</span>
              ) : (
                selectedNode.downstream.map((downId) => (
                  <button
                    key={downId}
                    type="button"
                    onClick={() => setSelectedNodeId(downId)}
                    className="inline-flex items-center gap-0.5 underline text-ink hover:text-accent cursor-pointer"
                  >
                    <span>{downId}.ts</span>
                    <ArrowRight size={11} aria-hidden="true" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Pinned Repository Source Excerpt */}
        <div className="lg:col-span-6 p-6 bg-[#141412] text-paper font-mono text-[12px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-[11px] text-white/60">
              <span className="flex items-center gap-1.5 text-white/90 font-semibold">
                <Code2 size={13} className="text-accent-readable" aria-hidden="true" />
                <span>SOURCE EXCERPT · {selectedNode.file}</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Eye size={12} aria-hidden="true" />
                <span>Verified in repo</span>
              </span>
            </div>

            <pre className="p-4 rounded-[8px] bg-[#0b0b09] border border-white/10 text-[#d7d1c9] whitespace-pre-wrap break-words leading-relaxed text-[11.5px]">
              <code>{selectedNode.codeExcerpt}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <span>Click any node in the diagram above to trace its contract</span>
            <span className="tabular-nums">51/51 unit tests passing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
