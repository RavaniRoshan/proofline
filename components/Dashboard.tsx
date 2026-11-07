"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  TrendingUp,
  Zap,
  XCircle,
  Calendar,
  Info,
  ArrowUpRight,
  FileText,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { RegisterStats } from "@/lib/register";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// High-agency Web3-inspired design components customized with Proofline tokens
import { StatGrid } from "@/components/ui/web3-dashboard/components/web3/stat-card";
import { PortfolioPanel } from "@/components/ui/web3-dashboard/components/web3/portfolio-panel";
import { MarketsPanel } from "@/components/ui/web3-dashboard/components/web3/markets-panel";
import { AssetTableCard } from "@/components/ui/web3-dashboard/components/web3/asset-table-card";
import { DashboardTopbar } from "@/components/ui/web3-dashboard/components/web3/topbar";
import { netWorthAssets, borrowedAssets } from "@/components/ui/web3-dashboard/data";
import { DeterministicRoutingBento } from "@/components/landing/bento/DeterministicRoutingBento";
import { RegisterLineageBento } from "@/components/landing/bento/RegisterLineageBento";
import { EvidenceGateInspectorBento } from "@/components/landing/bento/EvidenceGateInspectorBento";
import { AuditLedgerBento } from "@/components/landing/bento/AuditLedgerBento";
import { ApiPlayground } from "@/components/landing/ApiPlayground";

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
  const state = useProoflineState();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2026, 3, 1),
    to: new Date(2026, 10, 7),
  });
  const [activeEngineTab, setActiveEngineTab] = useState<
    "deterministic" | "lineage" | "gate" | "api" | "audit"
  >("deterministic");
  const totalClaims = deterministic + model;
  const rulesPct = totalClaims > 0 ? Math.round((deterministic / totalClaims) * 100) : 78;

  const totalUserDecisions = state.audit.length;

  const windowLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")} → ${format(dateRange.to, "yyyy-MM-dd")}`
      : `${format(dateRange.from, "yyyy-MM-dd")} → Active`
    : `${reviewDate} → Active`;

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. TOP ENTERPRISE STATUS RIBBON (Fingerprint / Linear Style)
          ========================================================================= */}
      <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Status Indicator */}
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
              <span className="font-mono text-foreground">{windowLabel}</span>
            </div>

            {/* Health */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Health:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                {stats.conflictingGroups === 0 ? "No Drift Detected" : `${stats.conflictingGroups} Conflicts`}
              </Badge>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="h-7 gap-1 font-mono text-xs text-accent-brand dark:text-accent-readable">
            <Link href="/facts">
              <span>Browse Full Register</span>
              <ChevronRight size={13} />
            </Link>
          </Button>
        </div>
      </Card>

      {/* =========================================================================
          2. DASHBOARD TOPBAR WITH SCOPE SELECTOR, SEARCH & CALENDAR WINDOW
          ========================================================================= */}
      <DashboardTopbar dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* =========================================================================
          3. STAT GRID (4 Tone-Badged High-Density KPI Cards)
          ========================================================================= */}
      <StatGrid />

      {/* =========================================================================
          4. PERFORMANCE & RULE EFFICACY SECTION (PortfolioPanel + MarketsPanel)
          ========================================================================= */}
      <section className="grid gap-4 xl:grid-cols-4">
        <PortfolioPanel />
        <MarketsPanel />
      </section>

      {/* =========================================================================
          5. ASSET TABLES & CONTRADICTION LOG (AssetTableCard Primitives)
          ========================================================================= */}
      <section className="grid gap-4 xl:grid-cols-2">
        <AssetTableCard
          title="Ground Truth Fact Attributes"
          assets={netWorthAssets}
          action="Inspect Register"
          valueLabel="True Value"
        />
        <AssetTableCard
          title="Active Contradiction Log"
          assets={borrowedAssets}
          action="Verify in Preflight Checker"
          valueLabel="Severity"
          external
        />
      </section>

      {/* =========================================================================
          6. INTERACTIVE ENGINE TOPOLOGY & ARCHITECTURAL INSPECTORS
          ========================================================================= */}
      <Card className="shadow-xs border border-border overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
                  [LIVE ENGINE INSPECTORS]
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="font-mono text-xs text-muted-foreground">
                  Interactive Architectural Pipeline
                </span>
              </div>
              <CardTitle className="text-lg font-bold tracking-tight text-foreground mt-1">
                Deterministic Routing, Proof Gates &amp; Audit Trail
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Inspect how claims resolve deterministically before model invocation, enforce the 6-field Evidence Gate, and verify SHA-256 Merkle proofs.
              </CardDescription>
            </div>

            {/* Tab switchers */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-full border border-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveEngineTab("deterministic")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeEngineTab === "deterministic"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TS Router (78%)
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab("lineage")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeEngineTab === "lineage"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                F-021 Lineage
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab("gate")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeEngineTab === "gate"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Evidence Gate
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab("api")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeEngineTab === "api"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                API Playground
              </button>
              <button
                type="button"
                onClick={() => setActiveEngineTab("audit")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeEngineTab === "audit"
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SOC 2 Ledger
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 bg-muted/10">
          {activeEngineTab === "deterministic" && (
            <div className="animate-in fade-in duration-200">
              <DeterministicRoutingBento />
            </div>
          )}
          {activeEngineTab === "lineage" && (
            <div className="animate-in fade-in duration-200">
              <RegisterLineageBento />
            </div>
          )}
          {activeEngineTab === "gate" && (
            <div className="animate-in fade-in duration-200">
              <EvidenceGateInspectorBento />
            </div>
          )}
          {activeEngineTab === "api" && (
            <div className="animate-in fade-in duration-200">
              <ApiPlayground />
            </div>
          )}
          {activeEngineTab === "audit" && (
            <div className="animate-in fade-in duration-200">
              <AuditLedgerBento />
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================================================================
          7. LIVE SESSION AUDIT TRAIL (Local Browser State with SHA-256 Hashes)
          ========================================================================= */}
      <Card className="shadow-xs border border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
          <div>
            <CardTitle className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Session Audit Trail
            </CardTitle>
            <CardDescription className="text-[11px] mt-0.5">
              Live human reviewer decisions recorded in this browser session
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {totalUserDecisions} Actions Logged
          </Badge>
        </CardHeader>

        <CardContent className="pt-3">
          {totalUserDecisions === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 p-5 text-center">
              <FileText size={22} className="mx-auto text-muted-foreground/60" />
              <p className="mt-2 text-xs font-semibold text-foreground">
                No Local Decisions Logged Yet
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Verify a draft in the Preflight Checker to record decisions with SHA-256 signatures.
              </p>
              <Button asChild size="sm" className="group mt-4 inline-flex items-center gap-2.5 rounded-full bg-[#8B1E27] py-2 pr-2.5 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-all duration-200 hover:bg-[#8B1E27]/90 active:scale-[0.98]">
                <Link href="/check">
                  <span>Open Preflight Checker</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {state.audit.slice(-4).reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-md border border-border/60 p-2.5 bg-card/60 text-xs"
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
                  <p className="mt-1.5 font-medium text-foreground truncate">
                    {entry.claim || (entry.verdict ? entry.verdict.replace("_", " ") : "Draft Claim")}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground font-mono">
                    {new Date(entry.at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t border-border/60">
          <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs text-accent-brand dark:text-accent-readable font-mono">
            <Link href="/audit">
              <span>Inspect Full Decision Journal &amp; Signatures</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
