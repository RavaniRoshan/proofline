"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Search,
  Lock,
  FileCheck2,
  Terminal,
  Sparkles,
  BookOpen,
  Code2,
} from "lucide-react";
import { motion } from "motion/react";
import { FaArrowRight } from "react-icons/fa6";

interface Bento1Props {
  className?: string;
}

export default function Bento1({ className }: Bento1Props) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className={cn("w-full py-4 font-sans antialiased", className)}>
      <div className="mx-auto w-full max-w-6xl">
        {/* ===================================================================
            2-COLUMN FEATURE STAGE (Direct match to Composio pixel-perfect reference)
            =================================================================== */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {/* ===================================================================
              FEATURE CARD 1: Deterministic Verification Pipeline
              =================================================================== */}
          <div
            className="group flex flex-col"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Visual Stage Container with Ambient Glow Backdrop */}
            <div className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-ink/10 dark:border-white/12 p-6 md:p-8 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-gradient-to-b from-[#e0f2fe]/70 via-[#f0f9ff]/50 to-paper/30 dark:from-[#0d121a] dark:via-[#0c0e12] dark:to-[#0c0e12]">
              {/* Luminous Ambient Glow Radial Mesh */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 size-72 rounded-full bg-[#38bdf8]/20 dark:bg-[#E07A70]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70"
              />

              {/* Floating Prompt Pill (Top Context Trigger) */}
              <motion.div
                className="relative z-10 mb-3 flex items-center gap-1.5 rounded-full border border-ink/10 dark:border-white/15 bg-paper/95 dark:bg-zinc-800/95 px-4 py-1.5 text-xs font-mono font-medium text-ink dark:text-zinc-200 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
                animate={hoveredCard === 1 ? { y: -2 } : { y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="size-3 text-accent dark:text-[#E07A70]" />
                <span>Verify Flowdesk Q2 marketing draft</span>
              </motion.div>

              {/* Sub-Pill: Active Execution Mode */}
              <div className="relative z-10 mb-4 flex items-center gap-1 rounded-full border border-ink/8 dark:border-white/10 bg-paper/80 dark:bg-zinc-900/80 px-2.5 py-0.5 text-[10.5px] font-mono text-ink-soft dark:text-zinc-400 shadow-2xs">
                <Cpu className="size-3 text-[#1F5C43] dark:text-[#4ADE80]" />
                <span>Stage 1 deterministic fast-path active</span>
              </div>

              {/* Main Floating Document Card (High-Precision Spec Window) */}
              <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-ink/10 dark:border-white/12 bg-paper/98 dark:bg-[#13161c] p-5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]">
                {/* Header Row */}
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft dark:text-zinc-400">
                  <BookOpen className="size-3 text-accent dark:text-[#E07A70]" />
                  <span>pipeline / STAGES.md</span>
                </div>

                <div className="mt-1.5">
                  <h4 className="text-[15.5px] font-semibold tracking-tight text-ink dark:text-white">
                    3-Stage Resolution Pipeline
                  </h4>
                  <p className="text-[11.5px] text-ink-soft dark:text-zinc-400 mt-0.5">
                    0.38ms in-memory TypeScript scalar normalizer
                  </p>
                </div>

                {/* Numbered Steps */}
                <div className="mt-4 flex flex-col gap-2.5">
                  {/* Step 1 */}
                  <div className="group/item flex items-start gap-3 rounded-xl border border-ink/5 dark:border-white/5 bg-panel/70 dark:bg-zinc-900/60 p-2.5 transition-colors hover:bg-panel dark:hover:bg-zinc-800/80">
                    <span className="font-mono text-[11px] font-bold text-ink-soft dark:text-zinc-500 pt-0.5">
                      1
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-ink dark:text-zinc-200">
                          Stage 1 · Scalar Fast-Path
                        </span>
                        <span className="rounded bg-[#1F5C43]/10 dark:bg-[#4ADE80]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#1F5C43] dark:text-[#4ADE80]">
                          &lt;1ms
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-ink-soft dark:text-zinc-400 leading-tight">
                        Parse currency (₹4,999) &amp; seat quotas in memory
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="group/item flex items-start gap-3 rounded-xl border border-ink/5 dark:border-white/5 bg-panel/70 dark:bg-zinc-900/60 p-2.5 transition-colors hover:bg-panel dark:hover:bg-zinc-800/80">
                    <span className="font-mono text-[11px] font-bold text-ink-soft dark:text-zinc-500 pt-0.5">
                      2
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-ink dark:text-zinc-200">
                          Stage 2 · Lexical Grounding
                        </span>
                        <span className="font-mono text-[9.5px] text-ink-soft dark:text-zinc-400">
                          42 Facts
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-ink-soft dark:text-zinc-400 leading-tight">
                        Rank active facts by BM25 token overlap (≤5 facts)
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="group/item flex items-start gap-3 rounded-xl border border-accent/20 dark:border-[#E07A70]/25 bg-accent/5 dark:bg-[#E07A70]/10 p-2.5">
                    <span className="font-mono text-[11px] font-bold text-accent dark:text-[#E07A70] pt-0.5">
                      3
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-accent dark:text-[#E07A70]">
                          Stage 3 · Bounded Model Tier
                        </span>
                        <span className="rounded bg-[#8B1E27]/15 dark:bg-[#E07A70]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#8B1E27] dark:text-[#E07A70]">
                          CONTRADICTED
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-ink-soft dark:text-zinc-300 leading-tight">
                        Zod-constrained entailment · Never writes citations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Callout Pill (Exact match to Composio Watch Out callout) */}
                <div className="mt-3.5 flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 font-mono text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <span>⚡</span> 78% Deterministic Split
                  </span>
                  <span className="font-bold tabular-nums">
                    $0.00 Token Cost on Scalars
                  </span>
                </div>
              </div>
            </div>

            {/* Typography Section (Positioned Cleanly Below Visual Stage) */}
            <div className="mt-5 text-left">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                <span>01 · 3-STAGE PIPELINE</span>
              </div>
              <h3 className="mt-1.5 flex items-center gap-2 text-[20px] md:text-[22px] font-medium tracking-tight text-ink dark:text-white">
                <Layers className="size-5 text-accent dark:text-[#E07A70]" />
                <span>Deterministic Verification Pipeline</span>
              </h3>
              <p className="mt-2 text-[14.5px] md:text-[15px] leading-relaxed text-ink-soft dark:text-zinc-400">
                Stage 1 normalizes currency, seats, and dates in pure TypeScript memory in 0.38ms. Only ambiguous prose escalates to bounded model evaluation.
              </p>
            </div>
          </div>

          {/* ===================================================================
              FEATURE CARD 2: 6-Field Evidence Gate
              =================================================================== */}
          <div
            className="group flex flex-col"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Visual Stage Container with Ambient Glow Backdrop */}
            <div className="relative flex min-h-[440px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-ink/10 dark:border-white/12 p-6 md:p-8 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-gradient-to-b from-[#e0e7ff]/70 via-[#f5f3ff]/50 to-paper/30 dark:from-[#0d121a] dark:via-[#0c0e12] dark:to-[#0c0e12]">
              {/* Luminous Ambient Glow Radial Mesh */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 size-72 rounded-full bg-[#6366f1]/20 dark:bg-[#1F5C43]/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70"
              />

              {/* Floating Prompt Pill (Top Context Trigger) */}
              <motion.div
                className="relative z-10 mb-3 flex items-center gap-1.5 rounded-full border border-ink/10 dark:border-white/15 bg-paper/95 dark:bg-zinc-800/95 px-4 py-1.5 text-xs font-mono font-medium text-ink dark:text-zinc-200 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
                animate={hoveredCard === 2 ? { y: -2 } : { y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="size-3 text-accent dark:text-[#E07A70]" />
                <span>Enforce 6 citation pins on CONTRADICTED</span>
              </motion.div>

              {/* Sub-Pill: Runtime Gate Status */}
              <div className="relative z-10 mb-4 flex items-center gap-1 rounded-full border border-ink/8 dark:border-white/10 bg-paper/80 dark:bg-zinc-900/80 px-2.5 py-0.5 text-[10.5px] font-mono text-ink-soft dark:text-zinc-400 shadow-2xs">
                <ShieldCheck className="size-3 text-[#1F5C43] dark:text-[#4ADE80]" />
                <span>lib/verdict.ts invariant gate locked</span>
              </div>

              {/* Main Floating Terminal Card (High-Precision Invariant Table) */}
              <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-ink/10 dark:border-white/12 bg-paper/98 dark:bg-[#13161c] p-5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)] font-mono text-[11px]">
                {/* Header Bar matching Composio Computer Terminal */}
                <div className="flex items-center justify-between border-b border-ink/8 dark:border-white/10 pb-2 mb-3">
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-ink-soft dark:text-zinc-400 flex items-center gap-1.5">
                    <Code2 className="size-3 text-accent dark:text-[#E07A70]" />
                    <span>EVIDENCE GATE · SHEAR LINE</span>
                  </span>
                  <span className="font-mono text-[10.5px] font-bold text-[#1F5C43] dark:text-[#4ADE80]">
                    ✓ 6/6 VALID
                  </span>
                </div>

                {/* 6 Proof Pins List */}
                <div className="space-y-1.5">
                  {[
                    { name: "fact_id", val: "F-021" },
                    { name: "fact_version", val: "v4.0" },
                    { name: "source_doc", val: "DOC-003" },
                    { name: "source_span", val: "[412, 468]" },
                    { name: "valid_from", val: "2026-04-01" },
                    { name: "valid_until", val: "2027-03-31" },
                  ].map((field) => (
                    <div
                      key={field.name}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1 bg-panel/70 dark:bg-zinc-900/60 border border-ink/5 dark:border-white/5 transition-colors hover:bg-panel dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={12}
                          className="text-[#1F5C43] dark:text-[#4ADE80] shrink-0"
                        />
                        <span className="text-ink-soft dark:text-zinc-400">
                          {field.name}
                        </span>
                      </div>
                      <span className="font-semibold text-ink dark:text-zinc-100">
                        {field.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Downgrade Invariant Callout */}
                <div className="mt-3 rounded-xl border border-[#8B1E27]/25 dark:border-[#E07A70]/30 bg-[#8B1E27]/5 dark:bg-[#E07A70]/10 p-2.5 text-[10.5px] leading-snug text-[#8B1E27] dark:text-[#E07A70]">
                  <span className="font-bold uppercase">Downgrade Rule: </span>
                  Missing byte span or dates downgrades CONTRADICTED → UNVERIFIABLE automatically.
                </div>
              </div>

              {/* Floating Bottom Overlap Pill (Exact Composio bottom pill) */}
              <div className="relative -mt-3.5 z-20 flex items-center gap-2 rounded-full border border-ink/15 dark:border-white/20 bg-paper dark:bg-zinc-800 px-4 py-1.5 text-xs font-mono text-ink dark:text-zinc-200 shadow-md">
                <CheckCircle2 className="size-3.5 text-[#1F5C43] dark:text-[#4ADE80]" />
                <span>Proof Locked: 100% Provenance Trace</span>
              </div>
            </div>

            {/* Typography Section (Positioned Cleanly Below Visual Stage) */}
            <div className="mt-5 text-left">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                <span>02 · PROOF INVARIANTS</span>
              </div>
              <h3 className="mt-1.5 flex items-center gap-2 text-[20px] md:text-[22px] font-medium tracking-tight text-ink dark:text-white">
                <ShieldCheck className="size-5 text-[#1F5C43] dark:text-[#4ADE80]" />
                <span>6-Field Evidence Gate</span>
              </h3>
              <p className="mt-2 text-[14.5px] md:text-[15px] leading-relaxed text-ink-soft dark:text-zinc-400">
                Zero hallucinated citations. Accusations cannot be emitted without exact document ID, byte span, and validity dates.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            ROW 2: Auditable Reviewer Sign-Offs & Merkle Trail (Pixel-Perfect Extension)
            =================================================================== */}
        <div
          className="group mt-12 flex flex-col"
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Visual Stage Container */}
          <div className="relative flex min-h-[280px] flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden rounded-[28px] border border-ink/10 dark:border-white/12 p-6 md:p-8 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-gradient-to-r from-panel/70 via-paper/90 to-panel/70 dark:from-[#0d121a] dark:via-[#0c0e12] dark:to-[#0d121a]">
            {/* Left Context & Action Controls */}
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-ink/10 dark:border-white/15 bg-paper/80 dark:bg-zinc-800/80 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                <Lock size={12} />
                <span>03 · IMMUTABLE DECISION LEDGER</span>
              </div>
              <h3 className="text-[22px] md:text-[26px] font-medium tracking-tight text-ink dark:text-white">
                Auditable Reviewer Sign-Offs &amp; Merkle Trail
              </h3>
              <p className="max-w-xl text-[14.5px] leading-relaxed text-ink-soft dark:text-zinc-400">
                Decisions are cryptographically signed with SHA-256 hashes and chained into an append-only journal in local browser memory. Zero customer drafts are ever stored on external servers.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/check"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#8B1E27] py-1.5 pr-2 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#8B1E27]/90 active:scale-[0.98]"
                >
                  <span>Open Preflight Checker</span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-black/20 text-white">
                    <FaArrowRight className="size-3 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <Link
                  href="/audit"
                  className="group inline-flex items-center gap-3 rounded-full border border-ink/20 dark:border-white/20 bg-paper/80 dark:bg-white/5 py-1.5 pr-2 pl-5 font-mono text-xs font-medium uppercase tracking-wider text-ink dark:text-white transition-all duration-200 hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98]"
                >
                  <span>Inspect Audit Log</span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-ink/5 dark:bg-white/10 text-ink dark:text-white">
                    <FaArrowRight className="size-3 text-ink dark:text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Live Decision Stream Card */}
            <div className="w-full lg:max-w-md rounded-2xl border border-ink/10 dark:border-white/12 bg-paper/98 dark:bg-[#13161c] p-4 shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between border-b border-ink/8 dark:border-white/10 pb-2 mb-2 text-[10px] uppercase tracking-wider text-ink-soft dark:text-zinc-400">
                <span>Verified Decision Record</span>
                <span>Reviewer Authority</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: "AUD-8021",
                    title: "Flowdesk Q2 Launch Copy",
                    reviewer: "Sarah Chen",
                    role: "Compliance Lead",
                    verdict: "REJECTED_STALE",
                    verdictClass:
                      "bg-v-contradicted-bg text-v-contradicted-fg border border-v-contradicted-border",
                    hash: "sha256:7f83b1c4e9...",
                  },
                  {
                    id: "AUD-8020",
                    title: "Enterprise Security Whitepaper",
                    reviewer: "Alex Mercer",
                    role: "Legal Counsel",
                    verdict: "APPROVED",
                    verdictClass:
                      "bg-v-supported-bg text-v-supported-fg border border-v-supported-border",
                    hash: "sha256:4c18e7a9b0...",
                  },
                  {
                    id: "AUD-8019",
                    title: "Pricing Page Comparison Matrix",
                    reviewer: "Priya Sharma",
                    role: "Product Marketing",
                    verdict: "NEEDS_EDIT",
                    verdictClass:
                      "bg-v-stale-bg text-v-stale-fg border border-v-stale-border",
                    hash: "sha256:9d42f8b1c0...",
                  },
                ].map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-ink/5 dark:border-white/5 bg-panel/70 dark:bg-zinc-900/60 p-2.5 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-ink-soft dark:text-zinc-400">
                          {entry.id}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase",
                            entry.verdictClass
                          )}
                        >
                          {entry.verdict}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-sans text-xs font-medium text-ink dark:text-zinc-100">
                        {entry.title}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-sans font-medium text-ink dark:text-zinc-200">
                        {entry.reviewer}
                      </div>
                      <span className="font-mono text-[9.5px] text-ink-soft dark:text-zinc-500">
                        {entry.hash}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
