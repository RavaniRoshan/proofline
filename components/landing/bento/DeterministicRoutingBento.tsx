"use client";

import React, { useState } from "react";
import {
  Code,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  Filter,
} from "lucide-react";

interface ClaimRouteItem {
  id: string;
  claim: string;
  stage: "STAGE_1_TS" | "STAGE_3_EVIDENCE";
  rule: string;
  latency: string;
  verdict: "CONTRADICTED" | "SUPPORTED" | "ESCALATED";
  factId: string;
  expected: string;
}

const CLAIMS: ClaimRouteItem[] = [
  {
    id: "CLM-001",
    claim: "Flowdesk Starter begins at ₹4,999 per month",
    stage: "STAGE_1_TS",
    rule: "currency_exact_match",
    latency: "0.38ms",
    verdict: "CONTRADICTED",
    factId: "F-021",
    expected: "₹6,499/mo (v4 approved)",
  },
  {
    id: "CLM-002",
    claim: "Enterprise tier includes an unconditional 99.99% SLA",
    stage: "STAGE_1_TS",
    rule: "sla_exact_match",
    latency: "0.41ms",
    verdict: "CONTRADICTED",
    factId: "F-001",
    expected: "99.9% uptime SLA",
  },
  {
    id: "CLM-003",
    claim: "Includes 250 GB encrypted cloud storage standard",
    stage: "STAGE_1_TS",
    rule: "storage_exact_match",
    latency: "0.34ms",
    verdict: "SUPPORTED",
    factId: "F-014",
    expected: "250 GB storage (v2 approved)",
  },
  {
    id: "CLM-004",
    claim: "Zero seat quota limits across all workspace accounts",
    stage: "STAGE_1_TS",
    rule: "quota_bounds_check",
    latency: "0.39ms",
    verdict: "CONTRADICTED",
    factId: "F-031",
    expected: "50 seats max on Starter",
  },
  {
    id: "CLM-005",
    claim: "Full compliance with ISO/IEC 27001 data residency guidelines",
    stage: "STAGE_3_EVIDENCE",
    rule: "semantic_citation_gate",
    latency: "142ms",
    verdict: "ESCALATED",
    factId: "F-042",
    expected: "Requires signed audit doc",
  },
];

export function DeterministicRoutingBento() {
  const [filter, setFilter] = useState<"all" | "deterministic" | "escalated">("all");
  const [activeClaimId, setActiveClaimId] = useState<string>("CLM-001");

  const filtered = CLAIMS.filter((c) => {
    if (filter === "deterministic") return c.stage === "STAGE_1_TS";
    if (filter === "escalated") return c.stage === "STAGE_3_EVIDENCE";
    return true;
  });

  const activeClaim = CLAIMS.find((c) => c.id === activeClaimId) || CLAIMS[0];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/95 p-4 sm:p-6 shadow-sm font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-2 rounded-full bg-[#1F5C43]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              Stage 1 Deterministic Router
            </span>
            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              TypeScript 0.4ms
            </span>
          </div>
          <h3 className="mt-1 font-serif text-lg sm:text-xl font-normal tracking-[-0.03em] text-foreground">
            78% of Claims Resolved Deterministically Before Any Model Call
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 font-mono text-[11px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Traffic (100%)
          </button>
          <button
            type="button"
            onClick={() => setFilter("deterministic")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "deterministic"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            78% TS Rules (&lt;1ms)
          </button>
          <button
            type="button"
            onClick={() => setFilter("escalated")}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              filter === "escalated"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            22% Bounded
          </button>
        </div>
      </div>

      {/* Main Split Grid: Live Stream on Left + Inspector Drawer on Right */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Claim Stream Rows (Linear Issue List Style) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Incoming Claim Assertion</span>
            <span>Latency</span>
          </div>

          <div className="space-y-1.5">
            {filtered.map((item) => {
              const isSelected = item.id === activeClaimId;
              const isContradicted = item.verdict === "CONTRADICTED";
              const isSupported = item.verdict === "SUPPORTED";

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveClaimId(item.id)}
                  className={`group flex items-center justify-between gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-foreground/40 bg-muted/50 shadow-xs"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Status Icon */}
                    {isContradicted && (
                      <XCircle size={15} className="text-[#8B1E27] shrink-0" />
                    )}
                    {isSupported && (
                      <CheckCircle2 size={15} className="text-[#1F5C43] shrink-0" />
                    )}
                    {!isContradicted && !isSupported && (
                      <AlertTriangle size={15} className="text-[#D4847A] shrink-0" />
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.id}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                            isContradicted
                              ? "bg-v-contradicted-bg text-v-contradicted-fg border border-v-contradicted-border"
                              : isSupported
                              ? "bg-v-supported-bg text-v-supported-fg border border-v-supported-border"
                              : "bg-v-stale-bg text-v-stale-fg border border-v-stale-border"
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-foreground truncate">
                        {item.claim}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-muted-foreground">
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-muted/40 text-[10px]">
                      {item.rule}
                    </span>
                    <span className="tabular-nums font-semibold text-foreground">
                      {item.latency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspector Card (Linear Metadata Panel Style) */}
        <div className="lg:col-span-5 rounded-lg border border-border/80 bg-muted/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Routing Inspector
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                {activeClaim.id}
              </span>
            </div>

            <div className="mt-3 space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Evaluated Claim
                </span>
                <p className="font-sans text-xs font-medium text-foreground mt-0.5">
                  &ldquo;{activeClaim.claim}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Execution Path
                  </span>
                  <span className="font-semibold text-foreground">
                    {activeClaim.stage === "STAGE_1_TS"
                      ? "Pure TypeScript Rule"
                      : "Bounded Model Tier"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Rule Identifier
                  </span>
                  <span className="text-foreground">{activeClaim.rule}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Register Fact ID
                  </span>
                  <span className="font-bold text-accent-brand dark:text-accent-readable">
                    {activeClaim.factId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Execution Time
                  </span>
                  <span className="font-semibold text-foreground">
                    {activeClaim.latency}
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Ground Truth Resolution
                </span>
                <p className="mt-0.5 text-xs text-foreground font-sans">
                  {activeClaim.expected}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-[#D4847A]" />
              0 API Cost · 0 Tokens
            </span>
            <span className="font-semibold text-foreground">100% Deterministic</span>
          </div>
        </div>
      </div>
    </div>
  );
}
