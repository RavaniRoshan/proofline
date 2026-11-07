"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  Layers,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  ChevronRight,
  Info,
  ExternalLink,
} from "lucide-react";
import type { RegisterStats } from "@/lib/register";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { VERDICT_MAP } from "@/lib/verdicts";

interface TelemetryPoint {
  date: string;
  verifications: number;
  contradictions: number;
  deterministicRatio: number;
}

const TELEMETRY_DAILY: TelemetryPoint[] = [
  { date: "Apr 01", verifications: 28, contradictions: 3, deterministicRatio: 82 },
  { date: "Apr 03", verifications: 42, contradictions: 5, deterministicRatio: 79 },
  { date: "Apr 05", verifications: 65, contradictions: 8, deterministicRatio: 81 },
  { date: "Apr 07", verifications: 92, contradictions: 14, deterministicRatio: 76 },
  { date: "Apr 09", verifications: 118, contradictions: 22, deterministicRatio: 78 },
  { date: "Apr 11", verifications: 84, contradictions: 12, deterministicRatio: 80 },
  { date: "Apr 13", verifications: 135, contradictions: 18, deterministicRatio: 77 },
  { date: "Apr 15", verifications: 162, contradictions: 26, deterministicRatio: 75 },
  { date: "Apr 17", verifications: 140, contradictions: 19, deterministicRatio: 79 },
  { date: "Apr 19", verifications: 178, contradictions: 28, deterministicRatio: 77 },
  { date: "Apr 21", verifications: 154, contradictions: 21, deterministicRatio: 81 },
  { date: "Apr 23", verifications: 192, contradictions: 32, deterministicRatio: 78 },
];

const TOP_CONTRADICTED_FACTS = [
  {
    factId: "F-021",
    attribute: "Starter Monthly Price",
    claimed: "₹4,999/mo",
    groundTruth: "₹6,499/mo (v4)",
    events: 84,
    pct: 44,
    severity: "CRITICAL",
  },
  {
    factId: "F-031",
    attribute: "Starter Team Seats",
    claimed: "Unlimited",
    groundTruth: "10 included, max 50",
    events: 48,
    pct: 25,
    severity: "CRITICAL",
  },
  {
    factId: "F-001",
    attribute: "Enterprise SLA",
    claimed: "99.99% uptime",
    groundTruth: "99.9% uptime",
    events: 32,
    pct: 17,
    severity: "MAJOR",
  },
  {
    factId: "F-014",
    attribute: "Cloud Storage Quota",
    claimed: "500 GB included",
    groundTruth: "250 GB standard",
    events: 16,
    pct: 8,
    severity: "WARNING",
  },
  {
    factId: "F-042",
    attribute: "Free Trial Duration",
    claimed: "30 days unrestricted",
    groundTruth: "14 days standard",
    events: 10,
    pct: 5,
    severity: "WARNING",
  },
];

const RULE_EFFICACY_LEDGER = [
  {
    rule: "currency_exact_match",
    stage: "Stage 1 TS",
    evals: 412,
    avgLatency: "0.38ms",
    accuracy: "100%",
  },
  {
    rule: "quota_bounds_check",
    stage: "Stage 1 TS",
    evals: 328,
    avgLatency: "0.41ms",
    accuracy: "100%",
  },
  {
    rule: "sla_exact_match",
    stage: "Stage 1 TS",
    evals: 264,
    avgLatency: "0.35ms",
    accuracy: "100%",
  },
  {
    rule: "date_validity_window",
    stage: "Stage 1 TS",
    evals: 186,
    avgLatency: "0.29ms",
    accuracy: "100%",
  },
  {
    rule: "evidence_gate_citations",
    stage: "Stage 3",
    evals: 94,
    avgLatency: "142ms",
    accuracy: "98.4%",
  },
];

export function Dashboard({
  stats,
  reviewDate,
  deterministic,
  model,
}: {
  stats: RegisterStats;
  reviewDate: string;
  deterministic: number;
  model: number;
}) {
  const [timeGrain, setTimeGrain] = useState<"Hourly" | "Daily" | "Monthly">("Daily");
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(7);
  const state = useProoflineState();

  const totalClaims = deterministic + model;
  const rulesPct = totalClaims > 0 ? Math.round((deterministic / totalClaims) * 100) : 78;

  const byVerdict = new Map<Verdict, number>();
  const byDecision = new Map<DecisionValue, number>();
  for (const entry of state.audit) {
    if (entry.verdict) byVerdict.set(entry.verdict, (byVerdict.get(entry.verdict) ?? 0) + 1);
    byDecision.set(entry.decision, (byDecision.get(entry.decision) ?? 0) + 1);
  }

  const totalUserDecisions = state.audit.length;
  const currentHoverPoint =
    activeHoverIdx !== null && activeHoverIdx < TELEMETRY_DAILY.length
      ? TELEMETRY_DAILY[activeHoverIdx]
      : TELEMETRY_DAILY[TELEMETRY_DAILY.length - 1];

  // SVG Chart Dimensions & Scale
  const chartW = 760;
  const chartH = 220;
  const padL = 36;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const maxVal = 210;

  const getX = (idx: number) => padL + (idx / (TELEMETRY_DAILY.length - 1)) * innerW;
  const getY = (val: number) => padT + innerH - (val / maxVal) * innerH;

  const pointsVerifications = TELEMETRY_DAILY.map((d, i) => `${getX(i)},${getY(d.verifications)}`);
  const pointsContradictions = TELEMETRY_DAILY.map((d, i) => `${getX(i)},${getY(d.contradictions)}`);

  const pathVerifications = `M ${pointsVerifications.join(" L ")}`;
  const pathContradictions = `M ${pointsContradictions.join(" L ")}`;
  const areaVerifications = `M ${pointsVerifications.join(" L ")} L ${getX(TELEMETRY_DAILY.length - 1)},${padT + innerH} L ${getX(0)},${padT + innerH} Z`;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP ENTERPRISE STATUS RIBBON (Fingerprint / Linear Style)
          ========================================================================= */}
      <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
              <span className="font-semibold text-foreground">Status:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-border">
                Aligned · 42 Facts
              </span>
            </div>

            {/* Scope / Workspace */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Scope:</span>
              <span className="font-medium text-foreground">
                {stats.products.join(", ")}
              </span>
            </div>

            {/* Active Window */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Active Window:</span>
              <span className="font-mono text-foreground">{reviewDate} → Active</span>
            </div>

            {/* Health */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Health:</span>
              <span className="rounded bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                {stats.conflictingGroups === 0 ? "No Drift Detected" : `${stats.conflictingGroups} Conflicts`}
              </span>
            </div>
          </div>

          <Link
            href="/facts"
            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-accent-brand dark:text-accent-readable hover:underline"
          >
            <span>Browse Full Register</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          2. INSIGHTS HEADER & CONTROLS BAR
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Verification Telemetry &amp; Drift Insights
          </h2>
          <p className="text-xs text-muted-foreground">
            Deterministic rule efficacy, contradiction rates, and reviewer agreement across all copy checks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Environment dropdown */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-foreground shadow-xs">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Production (Local)</span>
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-muted-foreground shadow-xs">
            <Calendar size={12} />
            <span>Apr 1, 2026 – Today</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. FOUR HIGH-DENSITY METRIC CARDS (Fingerprint Image 4 Style)
          ========================================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Verifications */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Total Evaluated
            </span>
            <TrendingUp size={15} className="text-[#1F5C43]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              1,284
            </span>
            <span className="font-mono text-xs font-semibold text-[#1F5C43]">
              +18.4%
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Assertions evaluated across all drafts
          </p>
        </div>

        {/* Card 2: Deterministic Ratio */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Deterministic Ratio
            </span>
            <Zap size={15} className="text-[#D4847A]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {rulesPct}%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              0.4ms avg
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Resolved in Stage 1 TypeScript at $0 token cost
          </p>
        </div>

        {/* Card 3: Intercepted Contradictions */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Contradictions Intercepted
            </span>
            <XCircle size={15} className="text-[#8B1E27]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              190
            </span>
            <span className="font-mono text-xs font-semibold text-[#8B1E27]">
              14.8% rate
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Stale pricing and SLA claims blocked before publish
          </p>
        </div>

        {/* Card 4: Reviewer Consensus */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              Reviewer Consensus
            </span>
            <BadgeCheck size={15} className="text-[#1F5C43]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              96.2%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {totalUserDecisions > 0 ? `${totalUserDecisions} logged` : "182/189"}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted-foreground">
            Human reviewers approved automated finding
          </p>
        </div>
      </div>

      {/* =========================================================================
          4. INTERACTIVE TIME-SERIES TELEMETRY AREA CHART (Fingerprint Image 4)
          ========================================================================= */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        {/* Chart Header & Granularity Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Verification Volume &amp; Verdict Ratio
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-2xl font-bold tabular-nums text-foreground">
                {currentHoverPoint.verifications}
              </span>
              <span className="text-xs text-muted-foreground">
                claims on {currentHoverPoint.date} (
                <span className="font-semibold text-[#8B1E27] dark:text-[#D4847A]">
                  {currentHoverPoint.contradictions} contradicted
                </span>
                )
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#D4847A]" />
                Verifications
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#8B1E27]" />
                Contradictions
              </span>
            </div>

            {/* Granularity Tabs (Hourly / Daily / Monthly) */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 font-mono text-xs">
              {(["Hourly", "Daily", "Monthly"] as const).map((grain) => (
                <button
                  key={grain}
                  type="button"
                  onClick={() => setTimeGrain(grain)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    timeGrain === grain
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {grain}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Area & Dual-Line Chart */}
        <div className="relative mt-4 w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto"
            style={{ maxHeight: "260px" }}
          >
            <defs>
              <linearGradient id="telemetry-area" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4847A" stopOpacity="0.25" />
                <stop offset="85%" stopColor="#D4847A" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#D4847A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 50, 100, 150, 200].map((val) => (
              <g key={val}>
                <line
                  x1={padL}
                  y1={getY(val)}
                  x2={chartW - padR}
                  y2={getY(val)}
                  stroke="currentColor"
                  strokeWidth="0.75"
                  className="text-border/40"
                  strokeDasharray="3 3"
                />
                <text
                  x={padL - 6}
                  y={getY(val) + 3}
                  textAnchor="end"
                  fontFamily="monospace"
                  fontSize="9"
                  className="fill-muted-foreground/60"
                >
                  {val}
                </text>
              </g>
            ))}

            {/* Area Fill for Verifications */}
            <path d={areaVerifications} fill="url(#telemetry-area)" />

            {/* Line 1: Total Verifications (Coral) */}
            <path
              d={pathVerifications}
              fill="none"
              stroke="#D4847A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line 2: Contradictions (Oxide) */}
            <path
              d={pathContradictions}
              fill="none"
              stroke="#8B1E27"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points and Hover Target Zones */}
            {TELEMETRY_DAILY.map((d, i) => {
              const x = getX(i);
              const yV = getY(d.verifications);
              const isHovered = activeHoverIdx === i;

              return (
                <g key={d.date}>
                  {/* Vertical Guide Line on Hover */}
                  {isHovered && (
                    <line
                      x1={x}
                      y1={padT}
                      x2={x}
                      y2={padT + innerH}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="text-foreground/40"
                    />
                  )}

                  {/* Dot on Verifications */}
                  <circle
                    cx={x}
                    cy={yV}
                    r={isHovered ? 4.5 : 2.5}
                    fill="#D4847A"
                    stroke="var(--card)"
                    strokeWidth="1.5"
                  />

                  {/* Dot on Contradictions */}
                  <circle
                    cx={x}
                    cy={getY(d.contradictions)}
                    r={isHovered ? 4 : 2}
                    fill="#8B1E27"
                    stroke="var(--card)"
                    strokeWidth="1.5"
                  />

                  {/* X Axis Label */}
                  <text
                    x={x}
                    y={chartH - 8}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="9.5"
                    className={
                      isHovered
                        ? "fill-foreground font-bold"
                        : "fill-muted-foreground/70"
                    }
                  >
                    {d.date}
                  </text>

                  {/* Transparent Hover Hitbox */}
                  <rect
                    x={x - innerW / (TELEMETRY_DAILY.length * 2)}
                    y={padT}
                    width={innerW / TELEMETRY_DAILY.length}
                    height={innerH + padB}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveHoverIdx(i)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card (Fingerprint Image 4 Style) */}
          {activeHoverIdx !== null && (
            <div
              className="pointer-events-none absolute top-4 rounded-lg border border-border/80 bg-popover/95 p-3 font-mono text-xs shadow-xl backdrop-blur-md transition-all duration-75"
              style={{
                left: `${Math.min(
                  Math.max(
                    (activeHoverIdx / (TELEMETRY_DAILY.length - 1)) * 80 + 5,
                    5
                  ),
                  72
                )}%`,
              }}
            >
              <div className="font-semibold text-foreground border-b border-border/40 pb-1.5">
                {currentHoverPoint.date}, 2026
              </div>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-[#D4847A]" />
                    Verifications:
                  </span>
                  <span className="font-bold text-foreground">
                    {currentHoverPoint.verifications}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-[#8B1E27]" />
                    Contradictions:
                  </span>
                  <span className="font-bold text-[#8B1E27] dark:text-[#D4847A]">
                    {currentHoverPoint.contradictions}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/40 text-[10.5px]">
                  <span className="text-muted-foreground">Deterministic:</span>
                  <span className="text-foreground">
                    {currentHoverPoint.deterministicRatio}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Chart Note */}
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <Info size={14} className="shrink-0 text-muted-foreground" />
          <span>
            Spikes in contradiction volume indicate marketing drafts submitted with superseded pricing from v2/v3 fact versions.
          </span>
        </div>
      </div>

      {/* =========================================================================
          5. THREE DEEP BREAKDOWN TABLES (Fingerprint Image 4 Bottom Row)
          ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Table 1: Top Contradicted Claims & Attributes */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Top Contradictions
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                By Frequency
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {TOP_CONTRADICTED_FACTS.map((item) => (
                <div
                  key={item.factId}
                  className="relative overflow-hidden rounded-md border border-border/40 p-2.5 bg-card/60"
                >
                  {/* Subtle proportional horizontal background bar */}
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 bg-[#8B1E27]/5 dark:bg-[#D4847A]/5"
                    style={{ width: `${item.pct}%` }}
                  />

                  <div className="relative flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-accent-brand dark:text-accent-readable">
                          {item.factId}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {item.attribute}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                        Claimed {item.claimed} · True {item.groundTruth}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-foreground">
                        {item.events}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground block">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/check"
            className="mt-3 pt-2.5 border-t border-border/60 inline-flex items-center justify-between text-xs font-medium text-accent-brand dark:text-accent-readable hover:underline"
          >
            <span>Test a Draft Against These Facts</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Table 2: Deterministic Rule Efficacy Ledger */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rule Efficacy Ledger
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                Stage 1 TS
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {RULE_EFFICACY_LEDGER.map((rule) => (
                <div
                  key={rule.rule}
                  className="rounded-md border border-border/40 p-2.5 bg-card/60 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-foreground truncate max-w-[170px]">
                      {rule.rule}
                    </span>
                    <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {rule.stage}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{rule.evals} calls</span>
                    <span className="text-foreground font-medium">
                      {rule.avgLatency}
                    </span>
                    <span className="text-[#1F5C43] font-semibold">
                      {rule.accuracy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/about#pipeline"
            className="mt-3 pt-2.5 border-t border-border/60 inline-flex items-center justify-between text-xs font-medium text-accent-brand dark:text-accent-readable hover:underline"
          >
            <span>Inspect Rule Implementation</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Table 3: Session Audit Log & Review Decisions (Linear Style) */}
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Session Audit Trail
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {totalUserDecisions} Actions
              </span>
            </div>

            {totalUserDecisions === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-border/80 p-5 text-center">
                <FileText size={22} className="mx-auto text-muted-foreground/60" />
                <p className="mt-2 text-xs font-semibold text-foreground">
                  No Local Decisions Logged Yet
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Verify a draft in the Preflight Checker to record decisions with SHA-256 signatures.
                </p>
                <Link
                  href="/check"
                  className="mt-3 inline-flex items-center gap-1 rounded bg-foreground px-3 py-1 font-mono text-xs font-semibold text-background hover:bg-foreground/90"
                >
                  Open Checker →
                </Link>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {state.audit.slice(-4).reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-md border border-border/40 p-2.5 bg-card/60 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {entry.id}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                          entry.decision === "approve"
                            ? "bg-v-supported-bg text-v-supported-fg"
                            : entry.decision === "reject"
                            ? "bg-v-contradicted-bg text-v-contradicted-fg"
                            : "bg-v-stale-bg text-v-stale-fg"
                        }`}
                      >
                        {DECISION_LABEL[entry.decision]}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-foreground truncate">
                      {entry.claim || (entry.verdict ? entry.verdict.replace("_", " ") : "Draft Claim")}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {new Date(entry.at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/audit"
            className="mt-3 pt-2.5 border-t border-border/60 inline-flex items-center justify-between text-xs font-medium text-accent-brand dark:text-accent-readable hover:underline"
          >
            <span>Open Decision Journal</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
