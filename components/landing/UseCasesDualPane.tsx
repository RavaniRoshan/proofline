"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  KeyRound,
  Lock,
  BookOpen,
  Zap,
  Box,
  ShieldCheck,
  FileText,
  ArrowUp,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

interface Scenario {
  id: string;
  sourceLabel: string;
  draftPrompt: string;
  highlightedClaim: string;
  toolSteps: { badge: string; module: string; action: string }[];
  activeToolRight: string;
  verdict: "CONTRADICTED" | "STALE" | "SUPPORTED";
  factId: string;
  factVersion: string;
  docTitle: string;
  spanRange: string;
  approvedValue: string;
  suggestedFix: string;
  logCount: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "pricing",
    sourceLabel: "Flowdesk Q2 Campaign",
    draftPrompt:
      "Check tomorrow's Flowdesk launch draft against the register. Verify the Starter monthly price, workspace limit, and save an audit brief.",
    highlightedClaim: "“Flowdesk Starter begins at ₹4,999 per month with 5 team workspaces.”",
    toolSteps: [
      { badge: "01", module: "segmenter", action: "split_claims" },
      { badge: "02", module: "normalizer", action: "parse_inr_scalar" },
      { badge: "03", module: "register", action: "lookup_f021" },
    ],
    activeToolRight: "lookup_f021",
    verdict: "CONTRADICTED",
    factId: "F-021",
    factVersion: "v4 (Active)",
    docTitle: "Pricing sheet v4 · DOC-003",
    spanRange: "chars 412–468",
    approvedValue: "₹6,499 per month (effective 2026-04-01)",
    suggestedFix: "Update “₹4,999 per month” → “₹6,499 per month”",
    logCount: "3 recorded",
  },
  {
    id: "stale",
    sourceLabel: "Legacy Renewal Email",
    draftPrompt:
      "Verify our customer renewal sequence against active validity windows. Flag any grandfathering or legacy tier promises that expired.",
    highlightedClaim: "“Lock in the Legacy Growth Plan at $29/seat through the end of the year.”",
    toolSteps: [
      { badge: "01", module: "segmenter", action: "extract_dates" },
      { badge: "02", module: "validity", action: "check_window" },
      { badge: "03", module: "register", action: "lookup_f010" },
    ],
    activeToolRight: "check_window",
    verdict: "STALE",
    factId: "F-010",
    factVersion: "v2 (Expired)",
    docTitle: "Legacy Sunset Policy · DOC-002",
    spanRange: "chars 188–244",
    approvedValue: "Expired on 2026-03-31 (review_date: 2026-11-05)",
    suggestedFix: "Remove Legacy Growth Plan reference or cite v4 Pro tier",
    logCount: "4 recorded",
  },
  {
    id: "security",
    sourceLabel: "Enterprise Trust Page",
    draftPrompt:
      "Run preflight on our enterprise security section. Confirm regional data residency and encryption claims against approved legal docs.",
    highlightedClaim:
      "“All customer workspaces are hosted in Mumbai with AES-256 encryption at rest.”",
    toolSteps: [
      { badge: "01", module: "retrieve", action: "lexical_top5" },
      { badge: "02", module: "verdict", action: "entailment_check" },
      { badge: "03", module: "evidence", action: "verify_6_fields" },
    ],
    activeToolRight: "verify_6_fields",
    verdict: "SUPPORTED",
    factId: "F-031",
    factVersion: "v1 (Approved)",
    docTitle: "Security Architecture Whitepaper · DOC-004",
    spanRange: "chars 820–891",
    approvedValue: "Primary hosting region: ap-south-1 (Mumbai) · AES-256",
    suggestedFix: "No edit required — citation attached to audit brief",
    logCount: "5 recorded",
  },
];

export function UseCasesDualPane() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [decisionMap, setDecisionMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCENARIOS.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [paused]);

  const current = SCENARIOS[activeIdx];
  const recordedDecision = decisionMap[current.id] || "Pending Review";

  return (
    <div className="relative mx-auto w-full max-w-[1158px]">
      {/* 3-Column Connected Stage matching 03-band2-use-cases.png 1:1 */}
      <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_320px_1fr] lg:gap-0">
        {/* Horizontal connector line on desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[28%] left-[28%] z-0 hidden h-px -translate-y-1/2 bg-ink/15 lg:block"
        />

        {/* Soft atmospheric glow behind the center hub (using Proofline oxide/parchment tokens) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[440px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-75 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 132, 122, 0.32) 0%, rgba(110, 31, 38, 0.12) 48%, transparent 72%)",
          }}
        />

        {/* =====================================================================
            LEFT PANE: Draft Input & Tool Call Stream (rounded-[24px])
            ===================================================================== */}
        <div className="relative z-10 flex h-[458px] flex-col justify-between rounded-[24px] border border-ink/10 bg-paper shadow-[0_8px_30px_rgba(26,26,24,0.04)] overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-flex size-5 items-center justify-center rounded-full bg-accent/12 font-mono text-[10px] font-bold text-accent"
              >
                *
              </span>
              <span className="font-sans text-[14px] font-medium text-ink">
                {current.sourceLabel}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {SCENARIOS.map((sc, i) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setActiveIdx(i);
                    setPaused(true);
                  }}
                  aria-label={`Select scenario ${sc.sourceLabel}`}
                  className={`min-h-[32px] min-w-[32px] px-2.5 py-1 font-mono text-[11px] rounded-[4px] uppercase transition-colors cursor-pointer inline-flex items-center justify-center ${
                    i === activeIdx
                      ? "bg-ink text-paper font-semibold"
                      : "bg-panel text-ink-faint hover:text-ink"
                  }`}
                >
                  0{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Center Prompt Bubble + Sequential Step Pills */}
          <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-4">
            <div className="ml-auto max-w-[92%] rounded-2xl bg-panel px-4 py-3.5 text-[13.5px] leading-relaxed text-ink">
              <p>{current.draftPrompt}</p>
              <p className="mt-2 border-t border-ink/10 pt-2 font-sans font-medium text-[13.5px] text-accent-brand dark:text-accent-readable font-semibold">
                {current.highlightedClaim}
              </p>
            </div>

            <div className="mt-1 flex flex-col items-start gap-2">
              {current.toolSteps.map((step) => (
                <div
                  key={step.action}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1 text-[12px] font-mono shadow-2xs"
                >
                  <span className="inline-flex size-4 items-center justify-center rounded-[4px] bg-accent/15 text-[10px] font-bold text-accent">
                    {step.badge}
                  </span>
                  <span className="text-ink-faint">{step.module}</span>
                  <span className="font-semibold text-ink">{step.action}</span>
                  <span className="text-[11px] text-accent" aria-hidden="true">
                    [ ]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Reply / Scenario Trigger Bar */}
          <div className="flex items-center justify-between border-t border-ink/10 bg-paper px-4 py-2.5">
            <span className="font-sans text-[13px] text-ink-faint truncate">
              Paste a marketing claim...
            </span>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="font-mono text-[11px] text-ink-faint">
                Stage 1 · 0ms
              </span>
              <button
                type="button"
                onClick={() => setActiveIdx((activeIdx + 1) % SCENARIOS.length)}
                aria-label="Run next verification scenario"
                className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-paper transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            CENTER PANE: 8 Asymmetric Layer Pills + Central [ ] Proofline Pill
            ===================================================================== */}
        <div className="relative z-10 mx-auto flex w-full max-w-[292px] flex-col items-center">
          {/* Top 4 Asymmetric Pills */}
          <div className="flex w-full flex-col gap-1.5 rounded-t-[28px] rounded-b-[20px] border border-ink/10 bg-paper/80 p-2 shadow-sm backdrop-blur-sm">
            {/* Row 1: rounded-t-[22px] rounded-b-md */}
            <div className="flex items-center justify-between rounded-t-[22px] rounded-b-md border border-ink/10 bg-paper px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <Search size={13} />
                <span>RULES</span>
              </div>
              <span className="font-mono text-[12px] font-medium text-accent">
                {current.activeToolRight}
              </span>
            </div>

            {/* Row 2: rounded-md */}
            <div className="flex items-center justify-between rounded-md border border-ink/10 bg-paper px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <KeyRound size={13} />
                <span>REGISTER</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-v-supported-bg text-v-supported-fg font-bold">
                  42
                </span>
                <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-v-contradicted-bg text-v-contradicted-fg font-bold">
                  v4
                </span>
                <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-v-stale-bg text-v-stale-fg font-bold">
                  D3
                </span>
              </div>
            </div>

            {/* Row 3: rounded-md */}
            <div className="flex items-center justify-between rounded-md border border-ink/8 bg-panel/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                <Lock size={13} />
                <span>VALIDITY</span>
              </div>
              <span className="font-sans text-[12px] text-ink-faint">
                Per review_date
              </span>
            </div>

            {/* Row 4: rounded-t-md rounded-b-[22px] */}
            <div className="flex items-center justify-between rounded-t-md rounded-b-[22px] border border-ink/8 bg-panel/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                <BookOpen size={13} />
                <span>RETRIEVAL</span>
              </div>
              <span className="font-sans text-[12px] text-ink-faint">
                Proven steps
              </span>
            </div>
          </div>

          {/* Center Floating [ ] Proofline Pill */}
          <div className="my-2.5 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-paper px-7 py-2.5 shadow-[0_6px_20px_rgba(110,31,38,0.12)]">
              <span className="font-mono text-[16px] font-bold text-accent">
                [ ]
              </span>
              <span className="font-sans text-[19px] font-semibold tracking-tight text-ink">
                Proofline
              </span>
            </div>
          </div>

          {/* Bottom 4 Asymmetric Pills */}
          <div className="flex w-full flex-col gap-1.5 rounded-t-[20px] rounded-b-[28px] border border-ink/10 bg-paper/80 p-2 shadow-sm backdrop-blur-sm">
            {/* Row 5: rounded-t-[22px] rounded-b-md */}
            <div className="flex items-center justify-between rounded-t-[22px] rounded-b-md border border-ink/8 bg-panel/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                <Zap size={13} />
                <span>MODEL TIER</span>
              </div>
              <span className="font-sans text-[12px] text-ink-faint">
                Fact IDs only
              </span>
            </div>

            {/* Row 6: rounded-md */}
            <div className="flex items-center justify-between rounded-md border border-ink/8 bg-panel/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                <Box size={13} />
                <span>TYPESCRIPT</span>
              </div>
              <span className="font-sans text-[12px] text-ink-faint">
                78% pure TS rules
              </span>
            </div>

            {/* Row 7: rounded-md */}
            <div className="flex items-center justify-between rounded-md border border-ink/10 bg-paper px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <ShieldCheck size={13} />
                <span>EVIDENCE GATE</span>
              </div>
              <span className="font-sans text-[12px] text-ink-soft">
                Blocks unbacked
              </span>
            </div>

            {/* Row 8: rounded-t-md rounded-b-[22px] */}
            <div className="flex items-center justify-between rounded-t-md rounded-b-[22px] border border-ink/10 bg-paper px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                <FileText size={13} />
                <span>LOG</span>
              </div>
              <span className="font-mono text-[12px] font-semibold text-accent tabular-nums">
                {current.logCount}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT PANE: Live Verification Brief Window (rounded-[24px])
            ===================================================================== */}
        <div className="relative z-10 flex h-[458px] flex-col justify-between rounded-[24px] border border-ink/10 bg-paper shadow-[0_8px_30px_rgba(26,26,24,0.04)] overflow-hidden">
          {/* Window Chrome Bar */}
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
              </div>
              <span className="ml-1 inline-flex size-4 items-center justify-center rounded-[3px] border border-ink/30 font-mono text-[10px] font-bold text-ink">
                P
              </span>
              <span className="font-sans text-[13px] text-ink-soft">
                Register · Verification Brief
              </span>
            </div>
            <span className="font-mono text-[11px] text-ink-faint tabular-nums">
              {current.factId}
            </span>
          </div>

          {/* Document Content */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              {/* Notion-style square emblem + verdict badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex size-9 sm:size-10 items-center justify-center rounded-[6px] border-2 border-ink font-mono text-[15px] font-bold text-ink">
                  P
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase ${
                    current.verdict === "CONTRADICTED"
                      ? "bg-v-contradicted-bg text-v-contradicted-fg"
                      : current.verdict === "STALE"
                        ? "bg-v-stale-bg text-v-stale-fg"
                        : "bg-v-supported-bg text-v-supported-fg"
                  }`}
                >
                  {current.verdict === "CONTRADICTED" && <XCircle size={12} />}
                  {current.verdict === "STALE" && <Clock size={12} />}
                  {current.verdict === "SUPPORTED" && <CheckCircle2 size={12} />}
                  <span>{current.verdict}</span>
                </span>
              </div>

              <h3 className="font-sans text-[22px] font-semibold tracking-tight text-ink">
                {current.docTitle}
              </h3>
              <p className="mt-1 font-mono text-[12px] text-ink-faint tabular-nums">
                Fact {current.factId} · {current.factVersion} · {current.spanRange}
              </p>

              <div className="mt-4 space-y-2.5 border-t border-ink/10 pt-3.5 text-[13px]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint block">
                    APPROVED REGISTER VALUE
                  </span>
                  <span className="font-medium text-ink">
                    {current.approvedValue}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint block">
                    RECOMMENDED ACTION
                  </span>
                  <span className="font-medium text-accent">
                    {current.suggestedFix}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Reviewer Decision Strip */}
            <div className="border-t border-ink/10 pt-3.5">
              <div className="flex items-center justify-between mb-2 font-mono text-[11px]">
                <span className="text-ink-faint uppercase">Reviewer Decision</span>
                <span className="font-semibold text-ink">{recordedDecision}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Approve", "Reject & Fix", "Request Edit"] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      setPaused(true);
                      setDecisionMap((prev) => ({ ...prev, [current.id]: action }));
                    }}
                    className={`border py-1.5 font-mono text-[11px] uppercase transition-colors cursor-pointer rounded-none ${
                      recordedDecision === action
                        ? "border-ink bg-ink text-paper font-semibold"
                        : "border-ink/15 bg-panel/60 text-ink hover:bg-panel"
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Pause/Play Demo Control at bottom-right matching 03-band2-use-cases.png */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink-faint">
          <span>SCENARIO 0{activeIdx + 1} / 03</span>
          <span aria-hidden="true">·</span>
          <Link href="/check" className="underline hover:text-ink">
            Open full 12-claim sample draft in Checker →
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play demo loop" : "Pause demo loop"}
          className="inline-flex size-8 items-center justify-center rounded-full border border-ink/15 bg-paper text-ink-soft transition-colors hover:border-ink/30 hover:text-ink cursor-pointer"
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
    </div>
  );
}
