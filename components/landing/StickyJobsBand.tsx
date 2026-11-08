"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Box, Zap, ShieldAlert } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { MeshCardBackdrop } from "@/components/landing/HeroTunnelCanvas";

interface JobStep {
  id: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  topPillPrompt: string;
  secondPillBadge: string;
  cardPath: string;
  cardHeading: string;
  cardSubheading: string;
  rows: {
    num: string;
    title: string;
    detail: string;
    badges: { text: string; bg: string; fg: string }[];
  }[];
  watchOutLabel: string;
  watchOutText: string;
}

const STEPS: JobStep[] = [
  {
    id: "skills",
    title: "Tested rules for recurring claims",
    description:
      "Proofline gives your review workflow deterministic rules: proven ways to parse prices, dates, and limits so it knows what to verify and what to flag.",
    topPillPrompt: "Check Flowdesk Q2 pricing & SLA draft",
    secondPillBadge: "Rule pack loaded",
    cardPath: "verify-marketing-draft / SKILL.md",
    cardHeading: "Verify Marketing Draft",
    cardSubheading: "Run claim preflight: scalar normalization, lineage lookup, evidence gate.",
    rows: [
      {
        num: "1",
        title: "Normalize scalars",
        detail: "Currency (₹/$), seat counts, storage caps, and date windows",
        badges: [
          { text: "₹", bg: "bg-v-contradicted-bg", fg: "text-v-contradicted-fg" },
          { text: "TS", bg: "bg-v-supported-bg", fg: "text-v-supported-fg" },
        ],
      },
      {
        num: "2",
        title: "Version lineage",
        detail: "Compare against active v4 pricing and superseded v3 records",
        badges: [
          { text: "F21", bg: "bg-v-stale-bg", fg: "text-v-stale-fg" },
          { text: "v4", bg: "bg-v-conflicting-bg", fg: "text-v-conflicting-fg" },
        ],
      },
      {
        num: "3",
        title: "Citation brief",
        detail: "A one-page evidence ledger with exact character spans, ready for sign-off",
        badges: [{ text: "P", bg: "bg-ink", fg: "text-paper" }],
      },
    ],
    watchOutLabel: "Watch out",
    watchOutText:
      "Models never author citations or byte spans. Look up all spans in code.",
  },
  {
    id: "computer",
    title: "TypeScript for the heavy lifting",
    description:
      "When a draft has 18 claims with numbers, dates, and mandatory disclaimers, Proofline resolves 78% of them in a sub-millisecond TypeScript pass and brings back exact proof.",
    topPillPrompt: "Evaluate 18 claims in seed/sample_draft.md",
    secondPillBadge: "78% resolved in <1ms",
    cardPath: "lib/normalize.ts / STAGE_01_ENGINE.ts",
    cardHeading: "Zero-LLM Scalar Engine",
    cardSubheading: "14 of 18 sample claims resolved deterministically without a model call.",
    rows: [
      {
        num: "1",
        title: "Exact byte spans",
        detail: "Segmenter extracts char_start: 36, char_end: 79 with zero drift",
        badges: [{ text: "0.4ms", bg: "bg-v-supported-bg", fg: "text-v-supported-fg" }],
      },
      {
        num: "2",
        title: "Top-5 lexical retrieval",
        detail: "Qualitative claims score active facts by token overlap (no vector DB)",
        badges: [
          { text: "≤5", bg: "bg-v-stale-bg", fg: "text-v-stale-fg" },
          { text: "ZOD", bg: "bg-v-conflicting-bg", fg: "text-v-conflicting-fg" },
        ],
      },
      {
        num: "3",
        title: "24/24 Smoke Gate",
        detail: "Every build verified against seed/smoke_cases.jsonl & 51 Vitest tests",
        badges: [{ text: "24", bg: "bg-ink", fg: "text-paper" }],
      },
    ],
    watchOutLabel: "Invariant",
    watchOutText:
      "Target ≥60% deterministic resolution. Actual Round 2 benchmark: 78%.",
  },
  {
    id: "gate",
    title: "Instant Evidence Gate, no sign-ups",
    description:
      "42 seeded Flowdesk facts, 5 source documents, and a runtime 6-field Evidence Gate ready in an incognito window. Test the downgrade invariant live.",
    ctaLabel: "OPEN THE CHECKER",
    ctaHref: "/check",
    topPillPrompt: "Assert 6-field Evidence Gate on F-021",
    secondPillBadge: "Evidence Gate active",
    cardPath: "lib/verdict.ts / EVIDENCE_GATE.ts",
    cardHeading: "Runtime Evidence Gate",
    cardSubheading: "Refuses to emit CONTRADICTED unless all 6 proof fields resolve.",
    rows: [
      {
        num: "1",
        title: "Fact ID & Version",
        detail: "Requires resolved fact_id (F-021) and fact_version (v4)",
        badges: [{ text: "ID", bg: "bg-v-supported-bg", fg: "text-v-supported-fg" }],
      },
      {
        num: "2",
        title: "Document & Byte Span",
        detail: "Requires source_document_id (DOC-003) and source_span [412..468]",
        badges: [{ text: "DOC", bg: "bg-v-contradicted-bg", fg: "text-v-contradicted-fg" }],
      },
      {
        num: "3",
        title: "Validity Window",
        detail: "Requires valid_from (2026-04-01) and valid_until (2027-03-31)",
        badges: [{ text: "CAL", bg: "bg-v-stale-bg", fg: "text-v-stale-fg" }],
      },
    ],
    watchOutLabel: "Fail-Safe",
    watchOutText:
      "If any field is missing, CONTRADICTED automatically downgrades to UNVERIFIED.",
  },
];

export function StickyJobsBand() {
  const [activeStep, setActiveStep] = useState(0);
  const [simulateFault, setSimulateFault] = useState(false);

  const current = STEPS[activeStep];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
      {/* =====================================================================
          LEFT COLUMN: Heading + 3-Step Opacity Timeline (05-band4-sticky-timeline.png)
          ===================================================================== */}
      <div className="lg:col-span-5">
        <h2 className="max-w-[18ch] text-balance font-sans text-[32px] md:text-[44px] font-normal tracking-[-0.042em] leading-[1.08] text-ink">
          Don’t settle for checkers that{" "}
          <span className="text-accent">stop halfway</span>
        </h2>

        <p className="mt-4 max-w-[46ch] text-[16px] md:text-[17px] tracking-[-0.022em] leading-[1.45] text-ink-soft text-pretty">
          Marketing claims are where generic AI stalls or hallucinates. Proofline gives your team
          proven deterministic steps, a place to run TypeScript rules, and an Evidence Gate that
          blocks unbacked claims.
        </p>

        {/* 3-Step Vertical List with Active/Inactive Opacity */}
        <div
          className="mt-8 divide-y divide-ink/10 border-y border-ink/10"
          role="tablist"
          aria-label="Verification capabilities"
        >
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            const Icon = idx === 0 ? BookOpen : idx === 1 ? Box : Zap;
            return (
              <div
                key={step.id}
                className={`py-6 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-35 hover:opacity-70"
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveStep(idx)}
                  className="flex w-full cursor-pointer flex-col text-left"
                >
                  <h3 className="flex items-center gap-2.5 text-[18px] font-medium text-ink">
                    <Icon
                      size={17}
                      className={isActive ? "text-accent" : "text-ink-faint"}
                    />
                    <span>{step.title}</span>
                  </h3>
                  <p className="mt-2 pl-[27px] text-[14.5px] leading-relaxed text-ink-soft text-pretty">
                    {step.description}
                  </p>
                </button>

                {step.ctaLabel && step.ctaHref && (
                  <div className="mt-4 pl-[27px]">
                    <Link
                      href={step.ctaHref}
                      className="group inline-flex items-center gap-3 rounded-full border border-ink/20 dark:border-white/20 bg-paper/80 dark:bg-white/5 py-1.5 pr-2 pl-4 font-mono text-xs font-medium uppercase tracking-wider text-ink dark:text-white transition-colors transition-transform duration-200 hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98]"
                    >
                      <span>{step.ctaLabel}</span>
                      <span className="flex size-6 items-center justify-center rounded-full bg-ink/5 dark:bg-white/10 text-ink dark:text-white">
                        <FaArrowRight className="size-2.5 text-ink dark:text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          RIGHT COLUMN: 547x680 Rounded-[32px] Mesh Card with Floating Pills & Frosted Card
          ===================================================================== */}
      <div className="lg:col-span-7 flex justify-center lg:justify-end">
        <div className="relative flex min-h-[580px] w-full max-w-[600px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-ink/10 dark:border-white/12 p-6 md:min-h-[650px] md:p-12">
          {/* Diagonal Silk Mesh Backdrop in Proofline Tokens */}
          <MeshCardBackdrop />

          {/* Floating Pill 1: Prompt */}
          <div className="relative z-10 mb-3 inline-flex items-center gap-2 rounded-full border border-ink/10 dark:border-white/15 bg-paper dark:bg-card px-4 py-2 text-[13.5px] font-medium text-ink dark:text-white shadow-sm">
            <span
              aria-hidden="true"
              className="inline-flex size-4 items-center justify-center rounded-full bg-accent/15 font-mono text-[11px] font-bold text-accent dark:text-accent-readable"
            >
              *
            </span>
            <span>{current.topPillPrompt}</span>
          </div>

          {/* Floating Pill 2: Skill / Stage Loaded */}
          <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-ink/10 dark:border-white/15 bg-paper dark:bg-card px-4 py-1.5 text-[13px] font-medium text-ink dark:text-white shadow-sm">
            <span className="font-mono text-[12px] font-bold text-accent dark:text-accent-readable">
              [ ]
            </span>
            <span>{current.secondPillBadge}</span>
          </div>

          {/* Frosted Glass Outer Frame -> Inner Card (Exact 05-band4-sticky-timeline.png) */}
          <div className="relative z-10 w-full max-w-[440px] rounded-[22px] bg-black/5 dark:bg-white/8 border border-ink/8 dark:border-white/10 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-md">
            <div className="rounded-2xl border border-ink/8 dark:border-white/10 bg-paper dark:bg-card p-6">
              {/* Top File Path */}
              <div className="flex items-center justify-between gap-2 font-mono text-[12px] text-ink-soft dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-accent dark:text-accent-readable" />
                  <span>{current.cardPath}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSimulateFault(!simulateFault)}
                  className="font-mono text-[11px] uppercase text-accent dark:text-accent-readable underline underline-offset-2 cursor-pointer"
                >
                  {simulateFault ? "Reset Gate" : "Test Fault"}
                </button>
              </div>

              {/* Card Heading */}
              <h3 className="mt-3 font-sans text-[19px] font-semibold text-ink dark:text-white">
                {current.cardHeading}
              </h3>
              <p className="mt-0.5 text-[13px] text-ink-soft dark:text-zinc-300">
                {current.cardSubheading}
              </p>

              {/* 3 Numbered Rows */}
              <div className="mt-4 divide-y divide-ink/8 dark:divide-white/8 border-t border-ink/10 dark:border-white/10">
                {current.rows.map((row) => (
                  <div
                    key={row.num}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[12px] text-ink-soft dark:text-zinc-400 pt-0.5 tabular-nums">
                        {row.num}
                      </span>
                      <div>
                        <p className="text-[14px] font-medium text-ink dark:text-white leading-snug">
                          {row.title}
                        </p>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft dark:text-zinc-300">
                          {row.detail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      {row.badges.map((b) => (
                        <span
                          key={b.text}
                          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] px-1 font-mono text-[11px] font-bold ${b.bg} ${b.fg}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Watch-Out / Fault Simulation Callout */}
              {simulateFault ? (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-v-stale-fg/30 bg-v-stale-bg px-3.5 py-3 text-[12px] leading-relaxed text-v-stale-fg">
                  <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Fault Simulated (source_span = null): </span>
                    <span>
                      Evidence Gate blocked CONTRADICTED and safely downgraded finding to{" "}
                      <strong className="underline">UNVERIFIED</strong>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#F7EFE6] dark:bg-amber-950/20 px-3.5 py-3 text-[12px] leading-relaxed text-ink dark:text-amber-200">
                  <span className="shrink-0 font-semibold text-v-stale-fg">
                    {current.watchOutLabel}
                  </span>
                  <span className="text-ink-soft dark:text-zinc-300">{current.watchOutText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
