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
  const totalClaims = deterministic + model;
  const rulesPct = totalClaims > 0 ? Math.round((deterministic / totalClaims) * 100) : 78;

  const totalUserDecisions = state.audit.length;

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
              <span className="font-mono text-foreground">{reviewDate} → Active</span>
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
          2. DASHBOARD TOPBAR WITH SCOPE SELECTOR & SEARCH
          ========================================================================= */}
      <DashboardTopbar />

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
          6. LIVE SESSION AUDIT TRAIL (Local Browser State with SHA-256 Hashes)
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
              <Button asChild size="sm" className="mt-3 font-mono text-xs bg-[#8B1E27] text-white hover:bg-[#8B1E27]/90">
                <Link href="/check">
                  Open Preflight Checker →
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
