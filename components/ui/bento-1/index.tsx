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
} from "lucide-react";
import { motion } from "motion/react";

interface Bento1Props {
  className?: string;
}

const bentoCardClass = cn(
  "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-paper dark:bg-card p-6 md:p-8 duration-300 antialiased",
  "border border-ink/15 dark:border-white/12",
  "shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)]",
  "hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all"
);

export default function Bento1({ className }: Bento1Props) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section
      className={cn(
        "bg-panel/40 dark:bg-background/80 flex h-full w-full items-center justify-center p-4 md:p-8 font-sans antialiased",
        className
      )}
    >
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* ===================================================================
              TOP LEFT CARD (2 COLS): 3-Stage Deterministic Verification Pipeline
              =================================================================== */}
          <div
            className={cn(bentoCardClass, "flex min-h-[380px] flex-col md:col-span-2")}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Mock Pipeline Visualization at top */}
            <div className="relative mb-6 flex flex-1 flex-col justify-center">
              <div className="relative mx-auto flex w-full max-w-lg flex-col gap-3 rounded-xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-4 shadow-xs">
                {/* Stage 1: TypeScript AST Normalizer */}
                <motion.div
                  className="relative flex items-center justify-between rounded-lg border border-ink/10 dark:border-white/10 bg-paper dark:bg-zinc-800/90 p-3 shadow-xs"
                  animate={hoveredCard === 1 ? { scale: 1.01 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#8B1E27]/10 text-[#8B1E27] dark:bg-[#E07A70]/15 dark:text-[#E07A70]">
                      <Cpu className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                          Stage 1 · 0.38ms
                        </span>
                        <span className="rounded bg-[#1F5C43]/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-[#1F5C43] dark:text-[#4ADE80]">
                          TS Fast-Path
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink dark:text-zinc-100">
                        Parse currency (₹4,999) &amp; seat quotas deterministically
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-ink-soft dark:text-zinc-400">
                    &lt;1ms
                  </span>
                </motion.div>

                {/* Connector */}
                <div className="relative mx-auto h-3 w-px bg-ink/15 dark:bg-white/20">
                  <motion.div
                    className="absolute top-0 w-full bg-[#8B1E27] dark:bg-[#E07A70]"
                    initial={{ height: "0%" }}
                    animate={hoveredCard === 1 ? { height: "100%" } : { height: "0%" }}
                    transition={{ duration: 0.3, delay: hoveredCard === 1 ? 0.1 : 0 }}
                  />
                </div>

                {/* Stage 2: Lexical Top-5 Grounding */}
                <motion.div
                  className="relative flex items-center justify-between rounded-lg border border-ink/10 dark:border-white/10 bg-paper dark:bg-zinc-800/90 p-3 shadow-xs"
                  animate={hoveredCard === 1 ? { scale: 1.01 } : { scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-panel text-ink dark:bg-zinc-700 dark:text-white">
                      <Search className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft dark:text-zinc-400">
                          Stage 2 · Lexical Top-5
                        </span>
                        <span className="font-mono text-[9px] text-ink-faint dark:text-zinc-500">
                          seed/facts.json
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink dark:text-zinc-100">
                        Score 42 registered facts by token n-gram overlap
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-ink-soft dark:text-zinc-400">
                    42 Facts
                  </span>
                </motion.div>

                {/* Connector */}
                <div className="relative mx-auto h-3 w-px bg-ink/15 dark:bg-white/20">
                  <motion.div
                    className="absolute top-0 w-full bg-[#8B1E27] dark:bg-[#E07A70]"
                    initial={{ height: "0%" }}
                    animate={hoveredCard === 1 ? { height: "100%" } : { height: "0%" }}
                    transition={{ duration: 0.3, delay: hoveredCard === 1 ? 0.3 : 0 }}
                  />
                </div>

                {/* Stage 3: Evidence Gate Assertion */}
                <motion.div
                  className="relative flex items-center justify-between rounded-lg border border-[#8B1E27]/30 bg-[#8B1E27]/5 dark:border-[#E07A70]/30 dark:bg-[#E07A70]/10 p-3 shadow-xs"
                  animate={hoveredCard === 1 ? { scale: 1.01 } : { scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#8B1E27] text-white">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8B1E27] dark:text-[#E07A70]">
                          Stage 3 · Evidence Gate
                        </span>
                        <span className="rounded bg-[#8B1E27]/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[#8B1E27] dark:bg-[#E07A70]/20 dark:text-[#E07A70]">
                          CONTRADICTED (F-021)
                        </span>
                      </div>
                      <p className="text-xs font-medium text-ink dark:text-zinc-100">
                        Assert 6 proof fields before serializing verdict
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#8B1E27] dark:text-[#E07A70]">
                    v4 Active
                  </span>
                </motion.div>

                {/* Slide-out Benchmark Pill */}
                <motion.div
                  className="flex items-center justify-between rounded-md bg-[#1F5C43]/10 border border-[#1F5C43]/20 px-3 py-1.5 text-[11px] font-mono text-[#1F5C43] dark:text-[#4ADE80]"
                  initial={{ opacity: 0.9 }}
                  animate={hoveredCard === 1 ? { opacity: 1 } : { opacity: 0.9 }}
                >
                  <span className="font-semibold uppercase tracking-wider">
                    ⚡ 78% Deterministic Split
                  </span>
                  <span className="font-bold tabular-nums">
                    $0.00 Token Cost on Scalars
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Bottom Copy */}
            <div className="relative z-10 flex flex-col gap-1.5 border-t border-ink/10 dark:border-white/10 pt-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                01 · 3-Stage Pipeline
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight text-ink dark:text-white">
                Deterministic Verification Pipeline
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft dark:text-zinc-300">
                Stage 1 normalizes currency, seats, and dates in pure TypeScript memory in 0.38ms. Only ambiguous prose escalates to bounded model evaluation.
              </p>
            </div>
          </div>

          {/* ===================================================================
              TOP RIGHT CARD (1 COL): 6-Field Evidence Gate Shear Line
              =================================================================== */}
          <div
            className={cn(bentoCardClass, "flex min-h-[380px] flex-col md:col-span-1")}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Visual 6-Pin Shear Line */}
            <div className="relative mb-6 flex flex-1 flex-col justify-center">
              <div className="rounded-xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-2 mb-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft dark:text-zinc-400">
                    Evidence Shear Line
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#1F5C43] dark:text-[#4ADE80]">
                    6/6 Required
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px]">
                  {[
                    { num: "1", name: "fact_id", val: "F-021" },
                    { num: "2", name: "fact_version", val: "v4.0" },
                    { num: "3", name: "source_doc", val: "DOC-003" },
                    { num: "4", name: "source_span", val: "[412, 468]" },
                    { num: "5", name: "valid_from", val: "2026-04-01" },
                    { num: "6", name: "valid_until", val: "2027-03-31" },
                  ].map((field) => (
                    <div
                      key={field.name}
                      className="flex items-center justify-between rounded px-2 py-1 bg-paper/80 dark:bg-zinc-800/80 border border-ink/5 dark:border-white/5"
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={11} className="text-[#1F5C43] shrink-0" />
                        <span className="text-ink-soft dark:text-zinc-400">{field.name}</span>
                      </div>
                      <span className="font-semibold text-ink dark:text-zinc-100">{field.val}</span>
                    </div>
                  ))}
                </div>

                {/* Downgrade Invariant Alert */}
                <div className="mt-3 rounded border border-[#8B1E27]/25 bg-[#8B1E27]/5 p-2 font-mono text-[10px] leading-tight text-[#8B1E27] dark:text-[#E07A70]">
                  <span className="font-bold uppercase">Downgrade Rule: </span>
                  Missing byte span or dates downgrades CONTRADICTED → UNVERIFIABLE automatically.
                </div>
              </div>
            </div>

            {/* Bottom Copy */}
            <div className="relative z-10 flex flex-col gap-1.5 border-t border-ink/10 dark:border-white/10 pt-4">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                02 · Proof Invariants
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight text-ink dark:text-white">
                6-Field Evidence Gate
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft dark:text-zinc-300">
                Zero hallucinated citations. Accusations cannot be emitted without exact document ID, byte span, and validity dates.
              </p>
            </div>
          </div>

          {/* ===================================================================
              BOTTOM CARD (3 COLS): Auditable Reviewer Sign-Offs & Merkle Trail
              =================================================================== */}
          <div
            className={cn(
              bentoCardClass,
              "min-h-[280px] flex-col items-stretch gap-6 md:col-span-3 md:flex-row md:items-center"
            )}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Left Column: Context & CTA */}
            <div className="flex flex-1 flex-col items-start justify-center gap-2.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                03 · Immutable Decision Ledger
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-tight text-ink dark:text-white">
                Auditable Reviewer Sign-Offs &amp; Merkle Trail
              </h3>
              <p className="max-w-xl text-sm md:text-base leading-relaxed text-ink-soft dark:text-zinc-300">
                Decisions are cryptographically signed with SHA-256 hashes and chained into an append-only journal in local browser memory. Zero customer drafts are ever stored on external servers.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href="/check"
                  className="inline-flex items-center gap-2 bg-ink text-paper dark:bg-white dark:text-zinc-950 px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-[0.98] font-semibold"
                >
                  <span>Open Preflight Checker</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 border border-ink/20 dark:border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-ink dark:text-white hover:bg-panel transition-colors"
                >
                  Inspect Audit Log
                </Link>
              </div>
            </div>

            {/* Right Column: Live Decision Feed */}
            <div className="flex flex-1 flex-col gap-2 rounded-xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-4">
              <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-2 text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-zinc-400">
                <span>Verified Decision Record</span>
                <span>Reviewer Authority</span>
              </div>

              {[
                {
                  id: "AUD-8021",
                  title: "Flowdesk Q2 Launch Copy",
                  reviewer: "Sarah Chen",
                  role: "Compliance Lead",
                  verdict: "REJECTED_STALE",
                  verdictClass: "bg-v-contradicted-bg text-v-contradicted-fg border border-v-contradicted-border",
                  hash: "sha256:7f83b1c4e9...",
                },
                {
                  id: "AUD-8020",
                  title: "Enterprise Security Whitepaper",
                  reviewer: "Alex Mercer",
                  role: "Legal Counsel",
                  verdict: "APPROVED",
                  verdictClass: "bg-v-supported-bg text-v-supported-fg border border-v-supported-border",
                  hash: "sha256:4c18e7a9b0...",
                },
                {
                  id: "AUD-8019",
                  title: "Pricing Page Comparison Matrix",
                  reviewer: "Priya Sharma",
                  role: "Product Marketing",
                  verdict: "NEEDS_EDIT",
                  verdictClass: "bg-v-stale-bg text-v-stale-fg border border-v-stale-border",
                  hash: "sha256:9d42f8b1c0...",
                },
              ].map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-ink/5 dark:border-white/5 bg-paper dark:bg-zinc-800/90 p-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-ink-soft dark:text-zinc-400">
                        {entry.id}
                      </span>
                      <span className={cn("rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase", entry.verdictClass)}>
                        {entry.verdict}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-medium text-ink dark:text-zinc-100">
                      {entry.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-medium text-ink dark:text-zinc-200">
                      {entry.reviewer}
                    </div>
                    <span className="font-mono text-[9.5px] text-ink-faint dark:text-zinc-500">
                      {entry.hash}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
