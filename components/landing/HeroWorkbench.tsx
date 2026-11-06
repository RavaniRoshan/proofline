"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface DemoClaimScenario {
  id: string;
  tabLabel: string;
  claimType: "numeric" | "temporal" | "entity" | "qualitative";
  executionPath: "DETERMINISTIC · STAGE 1" | "SEMANTIC GATE · STAGE 3";
  latency: string;
  modelCost: string;
  draftBefore: string;
  highlightedClaim: string;
  draftAfter: string;
  charSpan: string;
  verdict: "CONTRADICTED" | "STALE" | "CONFLICTING" | "SUPPORTED";
  verdictBadgeClass: string;
  highlightClass: string;
  reason: string;
  factId: string;
  factVersion: string;
  sourceDoc: string;
  sourceSpan: string;
  validityWindow: string;
  approvedValue: string;
  suggestedCorrection: string;
}

const SCENARIOS: DemoClaimScenario[] = [
  {
    id: "contradicted-price",
    tabLabel: "01. Pricing Drift",
    claimType: "numeric",
    executionPath: "DETERMINISTIC · STAGE 1",
    latency: "0.4 ms",
    modelCost: "$0.00 (0 tokens)",
    draftBefore: "Ready to scale customer operations? ",
    highlightedClaim: "Flowdesk Starter begins at ₹4,999 per month",
    draftAfter: " with automated triage and instant workspace provisioning.",
    charSpan: "[36..79]",
    verdict: "CONTRADICTED",
    verdictBadgeClass:
      "bg-v-contradicted-bg text-v-contradicted-fg border-v-contradicted-fg/30",
    highlightClass:
      "bg-rose-500/20 text-rose-200 border-b-2 border-rose-400 px-1.5 py-0.5 rounded-[2px]",
    reason:
      "Normalized scalar (4999 INR/month) contradicts active fact F-021 (6499 INR/month). The ₹4,999 rate was superseded on 2026-03-31.",
    factId: "F-021",
    factVersion: "v4 (Active)",
    sourceDoc: "Pricing Sheet v4 (DOC-003)",
    sourceSpan: "chars 412–468",
    validityWindow: "2026-04-01 → 2027-03-31",
    approvedValue: "₹6,499 per month (billed monthly)",
    suggestedCorrection: "Update claim to “Flowdesk Starter begins at ₹6,499 per month”.",
  },
  {
    id: "stale-promo",
    tabLabel: "02. Expired Promo",
    claimType: "temporal",
    executionPath: "DETERMINISTIC · STAGE 1",
    latency: "0.3 ms",
    modelCost: "$0.00 (0 tokens)",
    draftBefore: "Switch your support desk before quarter-end: ",
    highlightedClaim: "Lock in the Legacy Plan at ₹2,999/month",
    draftAfter: " for your entire frontline engineering team.",
    charSpan: "[45..84]",
    verdict: "STALE",
    verdictBadgeClass: "bg-v-stale-bg text-v-stale-fg border-v-stale-fg/30",
    highlightClass:
      "bg-amber-500/20 text-amber-200 border-b-2 border-amber-400 px-1.5 py-0.5 rounded-[2px]",
    reason:
      "Matched fact F-010 on (flowdesk.legacy_monthly), but review_date (2026-11-06) exceeds valid_until (2026-03-31).",
    factId: "F-010",
    factVersion: "v2 (Expired)",
    sourceDoc: "Q1 Legacy Rate Card (DOC-001)",
    sourceSpan: "chars 118–174",
    validityWindow: "2025-01-01 → 2026-03-31 (EXPIRED)",
    approvedValue: "Legacy tier retired on 2026-03-31",
    suggestedCorrection: "Remove Legacy Plan pricing; reference Starter Plan (F-021) at ₹6,499/mo.",
  },
  {
    id: "conflicting-seats",
    tabLabel: "03. Register Conflict",
    claimType: "numeric",
    executionPath: "DETERMINISTIC · STAGE 1",
    latency: "0.5 ms",
    modelCost: "$0.00 (0 tokens)",
    draftBefore: "Built for expanding mid-market teams, ",
    highlightedClaim: "the Growth plan includes up to 25 agent seats",
    draftAfter: " with role-based access control included.",
    charSpan: "[38..83]",
    verdict: "CONFLICTING",
    verdictBadgeClass:
      "bg-v-conflicting-bg text-v-conflicting-fg border-v-conflicting-fg/30",
    highlightClass:
      "bg-purple-500/20 text-purple-200 border-b-2 border-purple-400 px-1.5 py-0.5 rounded-[2px]",
    reason:
      "Two simultaneously active approved facts (F-024 and F-025) assert different values for (growth.seat_limit): 25 seats vs 50 seats.",
    factId: "F-024 vs F-025",
    factVersion: "v2 & v3 (Both Active)",
    sourceDoc: "Pricing Sheet v4 vs Enterprise Addendum",
    sourceSpan: "chars 820–864 / 210–255",
    validityWindow: "2026-01-01 → 2026-12-31",
    approvedValue: "Discrepancy: 25 seats (F-024) vs 50 seats (F-025)",
    suggestedCorrection: "Escalate to brand owner to supersede F-024 or F-025 before publishing.",
  },
  {
    id: "supported-trial",
    tabLabel: "04. Verified Claim",
    claimType: "numeric",
    executionPath: "DETERMINISTIC · STAGE 1",
    latency: "0.3 ms",
    modelCost: "$0.00 (0 tokens)",
    draftBefore: "Evaluate every workflow risk-free: ",
    highlightedClaim: "Every Starter and Growth workspace includes a 14-day free trial",
    draftAfter: " with no credit card required on sign-up.",
    charSpan: "[35..98]",
    verdict: "SUPPORTED",
    verdictBadgeClass:
      "bg-v-supported-bg text-v-supported-fg border-v-supported-fg/30",
    highlightClass:
      "bg-emerald-500/20 text-emerald-200 border-b-2 border-emerald-400 px-1.5 py-0.5 rounded-[2px]",
    reason:
      "Exact deterministic match on (flowdesk.trial_days = 14). Active validity window confirmed and no competing record disagrees.",
    factId: "F-004",
    factVersion: "v1 (Active)",
    sourceDoc: "Terms of Service v3.2 (DOC-002)",
    sourceSpan: "chars 64–129",
    validityWindow: "2026-01-01 → 2027-12-31",
    approvedValue: "14-day full-feature trial on Starter & Growth",
    suggestedCorrection: "No edit required — claim is entailed by active register record F-004.",
  },
];

export function HeroWorkbench() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, "Approved" | "Rejected" | "Edit Requested">>({});
  const current = SCENARIOS[activeIndex];

  const VerdictIcon =
    current.verdict === "SUPPORTED"
      ? CheckCircle2
      : current.verdict === "CONTRADICTED"
        ? XCircle
        : current.verdict === "STALE"
          ? Clock
          : AlertTriangle;

  const recordedDecision = decisions[current.id];

  return (
    <div className="w-full max-w-[1120px] mx-auto mt-6 text-left">
      {/* Top Scenario Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-2 text-[12px] font-mono text-white/70">
          <span className="text-accent-readable font-semibold">00 / INTERACTIVE PREFLIGHT SPECIMEN</span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span className="text-white/50 hidden sm:inline">Select a seeded claim to inspect live evidence resolution</span>
        </div>

        <div
          role="tablist"
          aria-label="Inspect seeded claim scenarios"
          className="flex flex-wrap items-center gap-1 p-1 rounded-[6px] bg-white/[0.06] border border-white/10"
        >
          {SCENARIOS.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1.5 rounded-[4px] font-mono text-[12px] transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-paper text-ink font-semibold shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Workbench Frame */}
      <div className="rounded-[14px] border border-white/15 bg-[#121210] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Workbench Window Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-[#181815] border-b border-white/10 text-[12px] font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="text-white/90 font-medium">seed/sample_draft.md</span>
            <span className="text-white/30" aria-hidden="true">·</span>
            <span className="text-white/60">span {current.charSpan}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] tabular-nums">
            <span className="text-emerald-400 font-medium">{current.executionPath}</span>
            <span className="text-white/30" aria-hidden="true">·</span>
            <span className="text-white/70">Latency: {current.latency}</span>
            <span className="text-white/30 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-white/70 hidden sm:inline">LLM Cost: {current.modelCost}</span>
          </div>
        </div>

        {/* 12-Column Split Interior */}
        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Left 7 Columns: Draft Segment & Deterministic AST Extraction */}
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between bg-[#141412]">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-4">
                <span>01 / DRAFT SEGMENTATION &amp; NORMALISATION</span>
                <span className="tabular-nums">TYPE: {current.claimType.toUpperCase()}</span>
              </div>

              {/* Manuscript Line Box */}
              <div className="p-5 rounded-[8px] bg-[#0c0c0a] border border-white/10 font-serif text-[17px] sm:text-[19px] leading-relaxed text-white/90">
                <div className="flex gap-4">
                  <div
                    aria-hidden="true"
                    className="select-none font-mono text-[12px] text-white/30 pt-1 flex flex-col gap-2 border-r border-white/10 pr-3 tabular-nums"
                  >
                    <span>14</span>
                    <span>15</span>
                    <span>16</span>
                  </div>
                  <p className="text-pretty">
                    <span className="text-white/60">{current.draftBefore}</span>
                    <mark className={`font-sans font-medium ${current.highlightClass}`}>
                      {current.highlightedClaim}
                    </mark>
                    <span className="text-white/60">{current.draftAfter}</span>
                  </p>
                </div>
              </div>

              {/* Deterministic Extraction Trace */}
              <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[12px] font-mono">
                <div>
                  <span className="text-white/45 block text-[11px]">EXTRACTED ENTITY</span>
                  <span className="text-white/90 font-medium mt-0.5 block">Flowdesk (B-flowdesk)</span>
                </div>
                <div>
                  <span className="text-white/45 block text-[11px]">CLASSIFIED SHAPE</span>
                  <span className="text-white/90 font-medium mt-0.5 block">{current.claimType} rule</span>
                </div>
                <div>
                  <span className="text-white/45 block text-[11px]">EVIDENCE GATE</span>
                  <span className="text-emerald-400 font-medium mt-0.5 block">5/5 fields resolved</span>
                </div>
              </div>
            </div>

            {/* Suggested Correction Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[12px] font-mono">
                <span className="text-white/45 block text-[11px]">SUGGESTED REMEDIATION</span>
                <span className="text-accent-readable font-medium">{current.suggestedCorrection}</span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Verdict & Locked Evidence Record */}
          <div className="lg:col-span-5 p-6 sm:p-7 bg-[#181815] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] font-mono text-white/50">
                  02 / VERDICT &amp; CITATION RECORD
                </span>
                <span
                  data-verdict-badge
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border font-mono text-[11px] font-semibold tracking-wider ${current.verdictBadgeClass}`}
                >
                  <VerdictIcon size={13} aria-hidden="true" />
                  {current.verdict}
                </span>
              </div>

              <p className="text-[14px] leading-relaxed text-white/90 font-sans text-pretty mb-5">
                {current.reason}
              </p>

              {/* 5-Field Evidence Gate Ledger */}
              <div className="rounded-[8px] border border-white/10 bg-[#11110f] p-4 font-mono text-[12px] space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-white/50 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1.5 text-white/80 font-semibold">
                    <ShieldCheck size={13} className="text-accent-readable" aria-hidden="true" />
                    EVIDENCE RECORD LOCKUP
                  </span>
                  <span>IMMUTABLE</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-white/50">fact_id · version</span>
                  <span className="text-white font-semibold tabular-nums">
                    {current.factId} · {current.factVersion}
                  </span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-white/50">source_document</span>
                  <span className="text-white/90">{current.sourceDoc}</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-white/50">source_span</span>
                  <span className="text-white/90 tabular-nums">{current.sourceSpan}</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-white/50">validity_window</span>
                  <span className="text-white/90 tabular-nums">{current.validityWindow}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex flex-col gap-1">
                  <span className="text-white/50 text-[11px]">APPROVED REGISTER VALUE</span>
                  <span className="text-emerald-300 font-semibold">{current.approvedValue}</span>
                </div>
              </div>
            </div>

            {/* Reviewer Action & Full Checker Handoff */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {(["Approved", "Rejected", "Edit Requested"] as const).map((act) => {
                  const isCurrent = recordedDecision === act;
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() =>
                        setDecisions((prev) => ({
                          ...prev,
                          [current.id]: act,
                        }))
                      }
                      className={`px-2.5 py-1 rounded-[4px] font-mono text-[11px] border transition-colors cursor-pointer whitespace-nowrap ${
                        isCurrent
                          ? "bg-paper text-ink border-paper font-semibold"
                          : "border-white/15 bg-white/[0.04] text-white/75 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {isCurrent ? `✓ ${act}` : act}
                    </button>
                  );
                })}
              </div>

              <Link
                href="/check"
                className="inline-flex items-center gap-1.5 font-mono text-[12px] font-semibold text-accent-readable hover:text-white transition-colors whitespace-nowrap"
              >
                <span>Inspect full 12-claim draft</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
