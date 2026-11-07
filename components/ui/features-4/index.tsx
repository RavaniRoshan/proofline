'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/base-ui/card';
import {
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { gsap, useGsapReducedMotion } from '@/lib/motion/gsap-config';

export default function Features4() {
  const [telemetryPct, setTelemetryPct] = useState(78);
  const chartRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useGsapReducedMotion();

  useEffect(() => {
    if (reducedMotion || !chartRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: 78,
            duration: 1.1,
            ease: "power2.out",
            onUpdate: () => setTelemetryPct(Math.round(counterObj.val)),
          });

          gsap.fromTo(
            chartRef.current!.querySelectorAll('.telemetry-bar-fill'),
            { scaleY: 0, transformOrigin: 'bottom center' },
            { scaleY: 1, duration: 0.65, stagger: 0.04, ease: 'power2.out' }
          );

          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div className="flex w-full flex-col items-center justify-center font-sans">
      {/* Centered Section Header */}
      <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
          [05] CORE VERIFICATION MOSAIC
        </span>
        <h2 className="max-w-[22ch] text-balance font-serif text-[32px] md:text-[44px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
          Deterministic rules,{" "}
          <span className="text-accent dark:text-[#E07A70]">provable truth</span>
        </h2>
        <p className="mt-4 max-w-[54ch] text-[16px] md:text-[17px] tracking-[-0.02em] leading-[1.45] text-ink-soft dark:text-zinc-300 text-pretty">
          High-throughput TypeScript scalar rules, version-controlled ground truth registers, and a runtime Evidence Gate engineered to eliminate copy drift.
        </p>
      </div>

      {/* 3-Column Equal Height Cards */}
      <div className="grid w-full max-w-6xl items-stretch gap-6 md:grid-cols-3 lg:gap-8">
        {/* ===================================================================
            CARD 1: Sub-Millisecond Preflight Telemetry
            =================================================================== */}
        <Card className="bg-paper dark:bg-card flex h-full flex-col rounded-[28px] border border-ink/15 dark:border-white/12 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all p-0 overflow-hidden">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                01 · Preflight Engine
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight text-ink dark:text-white mt-1">
                Sub-millisecond Preflight
              </h3>
              <p className="text-sm text-ink-soft dark:text-zinc-400 mt-2 leading-relaxed">
                Normalizes currency, seat limits, storage quotas, and temporal validity windows in memory before making any model call.
              </p>
            </div>

            {/* Inner Telemetry Console */}
            <div className="flex flex-col justify-between rounded-2xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-soft dark:text-zinc-400 flex items-center gap-1.5">
                  <Zap className="size-3.5 text-accent dark:text-[#E07A70]" />
                  Scalar AST Fast-Path
                </span>
                <span className="text-[#1F5C43] dark:text-[#4ADE80] font-semibold">
                  ● 0.38ms avg
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-mono font-bold tracking-tight text-ink dark:text-white tabular-nums">
                  {telemetryPct}%
                </div>
                <div className="text-xs font-mono font-semibold text-[#1F5C43] dark:text-[#4ADE80]">
                  $0.00 Token Cost
                </div>
              </div>

              {/* 7 Latency Distribution Bars */}
              <div ref={chartRef} className="mt-4 flex h-16 items-end gap-1.5">
                {[
                  { h: 42, label: "0.34ms" },
                  { h: 65, label: "0.38ms" },
                  { h: 50, label: "0.36ms" },
                  { h: 88, label: "0.41ms" },
                  { h: 58, label: "0.37ms" },
                  { h: 45, label: "0.35ms" },
                  { h: 72, label: "0.39ms" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="telemetry-bar-fill w-full rounded-xs bg-[#8B1E27]/80 dark:bg-[#E07A70]/80 transition-colors hover:bg-[#8B1E27]"
                      style={{ height: `${bar.h}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="rounded-lg bg-paper dark:bg-zinc-800 p-2.5 border border-ink/5 dark:border-white/5">
                  <span className="text-[10px] uppercase text-ink-soft dark:text-zinc-400 block">
                    Regex Rules
                  </span>
                  <span className="text-sm font-bold text-ink dark:text-white">
                    12 Active
                  </span>
                </div>
                <div className="rounded-lg bg-paper dark:bg-zinc-800 p-2.5 border border-ink/5 dark:border-white/5">
                  <span className="text-[10px] uppercase text-ink-soft dark:text-zinc-400 block">
                    Precision
                  </span>
                  <span className="text-sm font-bold text-[#1F5C43] dark:text-[#4ADE80]">
                    100% Deterministic
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================================================================
            CARD 2: Owner-Approved Fact Register (42 Seed Facts)
            =================================================================== */}
        <Card className="bg-paper dark:bg-card flex h-full flex-col rounded-[28px] border border-ink/15 dark:border-white/12 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all p-0 overflow-hidden">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                02 · Ground Truth
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight text-ink dark:text-white mt-1">
                Versioned Fact Register
              </h3>
              <p className="text-sm text-ink-soft dark:text-zinc-400 mt-2 leading-relaxed">
                Single source of truth maintained by designated product and legal owners with temporal validity windows and amendment lineage.
              </p>
            </div>

            {/* Inner Register Console */}
            <div className="flex flex-col justify-between rounded-2xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-soft dark:text-zinc-400 flex items-center gap-1.5">
                  <Database className="size-3.5 text-ink dark:text-white" />
                  seed/facts.json
                </span>
                <span className="text-ink-faint dark:text-zinc-500">
                  42 Seed Facts
                </span>
              </div>

              {/* Circular Gauge */}
              <div className="my-3 flex items-center justify-center">
                <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-ink/10 dark:border-white/10">
                  <div className="absolute inset-0 rounded-full border-4 border-[#1F5C43] border-t-transparent" />
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-mono font-bold text-ink dark:text-white">
                      100%
                    </span>
                    <span className="text-[9px] font-mono uppercase text-ink-faint dark:text-zinc-500">
                      Grounded
                    </span>
                  </div>
                </div>
              </div>

              {/* Fact Categories */}
              <div className="space-y-1.5 text-xs font-mono">
                {[
                  { name: "Pricing & Tiers", count: "14 Facts", pct: "100%" },
                  { name: "SLA & Uptime", count: "8 Facts", pct: "100%" },
                  { name: "Data Residency & SOC 2", count: "12 Facts", pct: "100%" },
                  { name: "Storage & Quotas", count: "8 Facts", pct: "100%" },
                ].map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between rounded px-2.5 py-1 bg-paper dark:bg-zinc-800 border border-ink/5 dark:border-white/5"
                  >
                    <span className="text-ink dark:text-zinc-200">{cat.name}</span>
                    <span className="text-ink-soft dark:text-zinc-400">{cat.count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-1.5">
                <div className="h-1.5 flex-[4] rounded-full bg-[#1F5C43]" />
                <div className="h-1.5 flex-[1] rounded-full bg-[#8B1E27]" />
                <div className="h-1.5 flex-[1] rounded-full bg-[#B8860B]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================================================================
            CARD 3: 5-State Mathematical Verdict Lattice
            =================================================================== */}
        <Card className="bg-paper dark:bg-card flex h-full flex-col rounded-[28px] border border-ink/15 dark:border-white/12 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all p-0 overflow-hidden">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                03 · Formal Taxonomy
              </span>
              <h3 className="font-serif text-2xl font-normal tracking-tight text-ink dark:text-white mt-1">
                Formal Verdict Lattice
              </h3>
              <p className="text-sm text-ink-soft dark:text-zinc-400 mt-2 leading-relaxed">
                Eliminates fuzzy language model verdicts. Claims receive formal verdicts backed by byte-exact references and cryptographic proofs.
              </p>
            </div>

            {/* Inner Lattice Console */}
            <div className="flex flex-col justify-between rounded-2xl border border-ink/10 dark:border-white/10 bg-panel/70 dark:bg-zinc-900/60 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-ink-soft dark:text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-[#1F5C43]" />
                  lib/verdict.ts
                </span>
                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent dark:text-[#E07A70]">
                  5 Verdicts
                </span>
              </div>

              {/* Distribution Breakdown */}
              <div className="mt-3 space-y-2 text-xs font-mono">
                {[
                  { name: "SUPPORTED", pct: 64, color: "bg-[#1F5C43]", fg: "text-[#1F5C43] dark:text-[#4ADE80]" },
                  { name: "CONTRADICTED", pct: 18, color: "bg-[#8B1E27]", fg: "text-[#8B1E27] dark:text-[#E07A70]" },
                  { name: "STALE", pct: 11, color: "bg-[#B8860B]", fg: "text-[#B8860B] dark:text-[#FBBF24]" },
                  { name: "CONFLICTING", pct: 4, color: "bg-zinc-500", fg: "text-zinc-500" },
                  { name: "UNVERIFIABLE", pct: 3, color: "bg-zinc-400", fg: "text-zinc-400" },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className={`font-semibold ${item.fg}`}>{item.name}</span>
                      <span className="text-ink-soft dark:text-zinc-400">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Downgrade Invariant Pill */}
              <div className="mt-3.5 rounded-lg border border-ink/10 dark:border-white/10 bg-paper dark:bg-zinc-800 p-2.5 text-[11px] font-mono text-ink-soft dark:text-zinc-400 flex items-center justify-between">
                <span>Citation Invariant</span>
                <span className="font-semibold text-ink dark:text-white">Strict Shear Line</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
