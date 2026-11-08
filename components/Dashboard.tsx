"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Zap,
  Clock,
  Scale,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type { RegisterStats } from "@/lib/register";
import { DECISION_LABEL } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
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
  const [activeEngineTab, setActiveEngineTab] = useState<
    "deterministic" | "lineage" | "gate" | "api" | "audit"
  >("deterministic");
  const totalClaims = deterministic + model;
  const rulesPct = totalClaims > 0 ? Math.round((deterministic / totalClaims) * 100) : 78;

  const totalUserDecisions = state.audit.length;

  const verdictDistribution = useMemo(() => {
    const byVerdict: Record<string, number> = {};
    for (const entry of state.audit) {
      const v = entry.verdict ?? "UNVERIFIED";
      byVerdict[v] = (byVerdict[v] ?? 0) + 1;
    }
    return byVerdict;
  }, [state.audit]);

  const decisionCounts = useMemo(() => {
    const counts = { approve: 0, reject: 0, needs_edit: 0 };
    for (const entry of state.audit) {
      if (entry.decision === "approve") counts.approve++;
      else if (entry.decision === "reject") counts.reject++;
      else counts.needs_edit++;
    }
    return counts;
  }, [state.audit]);

  const pct = (n: number, total: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. TOP STATUS RIBBON
          ========================================================================= */}
      <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-v-supported-fg" />
              <span className="font-semibold text-foreground">Status:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-fg/30">
                Aligned · {stats.approvedCurrent} Facts
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Scope:</span>
              <span className="font-medium text-foreground">
                {stats.products.join(", ")}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Active Window:</span>
              <span className="font-mono text-foreground">{reviewDate} → Active</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Health:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                {stats.conflictingGroups === 0 ? "No Drift Detected" : `${stats.conflictingGroups} Conflicts`}
              </Badge>
            </div>
          </div>

          <Button asChild variant="ghost" size="sm" className="h-7 gap-1 font-mono text-xs text-accent">
            <Link href="/facts">
              <span>Browse Full Register</span>
              <ChevronRight size={13} />
            </Link>
          </Button>
        </div>
      </Card>

      {/* =========================================================================
          2. REAL REGISTER TELEMETRY (no demo financials)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Register telemetry">
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Approved Facts
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-v-supported-bg text-v-supported-fg">
              <Layers size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
              {stats.approvedCurrent}
            </span>
            <span className="font-mono text-xs font-semibold text-v-supported-fg">
              in-window
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.factIds} unique IDs across {stats.products.length} products
          </p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Deterministic Ratio
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Zap size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
              {rulesPct}%
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Stage 1 fast-path
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {deterministic} rule checks · {model} bounded-model checks
          </p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stale Facts
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-v-stale-bg text-v-stale-fg">
              <Clock size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
              {stats.stale}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              out of validity
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Superseded or past valid_until at {reviewDate}
          </p>
        </Card>

        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conflicts
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-v-conflicting-bg text-v-conflicting-fg">
              <Scale size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">
              {stats.conflictingGroups}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              groups
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.conflictingRows} rows across {stats.conflictingGroups} attributes
          </p>
        </Card>
      </section>

      {/* =========================================================================
          3. SESSION VERDICT DISTRIBUTION (real local audit data, chart + table)
          ========================================================================= */}
      <Card className="shadow-xs border border-border">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Session Verdict Distribution
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                Reviewer decisions recorded in this browser session, real counts, never demo data
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[11px]">
              {totalUserDecisions} Decisions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {totalUserDecisions === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 p-5 text-center">
              <FileText size={22} className="mx-auto text-muted-foreground/60" />
              <p className="mt-2 text-xs font-semibold text-foreground">No local session data yet</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Run a check in the Preflight Checker to populate verdict and decision counts.
              </p>
              <Button asChild size="sm" className="group mt-4 inline-flex items-center gap-2.5 rounded-full bg-accent py-2 pr-2.5 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-colors transition-transform duration-200 hover:bg-accent/90 active:scale-[0.98]">
                <Link href="/check">
                  <span>Open Preflight Checker</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </span>
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2.5" role="img" aria-label={`Verdict distribution of ${totalUserDecisions} decisions`}>
                {Object.entries(verdictDistribution).map(([verdict, count]) => {
                  const v = verdict.toLowerCase();
                  const barClass =
                    verdict === "SUPPORTED"
                      ? "bg-v-supported-fg"
                      : verdict === "CONTRADICTED"
                        ? "bg-v-contradicted-fg"
                        : verdict === "STALE"
                          ? "bg-v-stale-fg"
                          : verdict === "CONFLICTING"
                            ? "bg-v-conflicting-fg"
                            : "bg-v-unverified-fg";
                  return (
                    <div key={verdict} className="flex items-center gap-3 text-xs">
                      <span className="w-28 shrink-0 font-mono text-[11px] font-semibold uppercase text-foreground">
                        {v.replace("_", " ")}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${barClass}`}
                          style={{ width: `${pct(count, totalUserDecisions)}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                        {count}
                      </span>
                    </div>
                  );
                })}
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <span>Approve {decisionCounts.approve}</span>
                  <span>·</span>
                  <span>Reject {decisionCounts.reject}</span>
                  <span>·</span>
                  <span>Needs edit {decisionCounts.needs_edit}</span>
                </div>
              </div>
              <table className="sr-only">
                <caption>Verdicts recorded this session</caption>
                <tbody>
                  {Object.entries(verdictDistribution).map(([verdict, count]) => (
                    <tr key={verdict}>
                      <th>{verdict}</th>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t border-border/60">
          <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs text-accent font-mono">
            <Link href="/audit">
              <span>Inspect Full Decision Journal &amp; Signatures</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* =========================================================================
          4. INTERACTIVE ENGINE TOPOLOGY & ARCHITECTURAL INSPECTORS
          ========================================================================= */}
      <Card className="shadow-xs border border-border overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  Engine Inspectors
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="font-mono text-xs text-muted-foreground">
                  Interactive Architectural Pipeline
                </span>
              </div>
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground mt-1 font-serif">
                Deterministic Routing, Proof Gates &amp; Audit Trail
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Inspect how claims resolve deterministically before model invocation, enforce the 6-field Evidence Gate, and verify SHA-256 Merkle proofs.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-full border border-border text-xs font-mono" role="tablist" aria-label="Engine inspectors">
              {(
                [
                  ["deterministic", "TS Router (78%)"],
                  ["lineage", "F-021 Lineage"],
                  ["gate", "Evidence Gate"],
                  ["api", "API Playground"],
                  ["audit", "SOC 2 Ledger"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeEngineTab === id}
                  onClick={() => setActiveEngineTab(id)}
                  className={`px-3 py-1 rounded-full transition-colors transition-transform cursor-pointer ${
                    activeEngineTab === id
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 bg-muted/10" role="tabpanel">
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
          5. LIVE SESSION AUDIT TRAIL (Local Browser State with SHA-256 Hashes)
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
          <Badge variant="outline" className="font-mono text-[11px]">
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
              <Button asChild size="sm" className="group mt-4 inline-flex items-center gap-2.5 rounded-full bg-accent py-2 pr-2.5 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-colors transition-transform duration-200 hover:bg-accent/90 active:scale-[0.98]">
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
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {entry.id}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase ${
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
                  <p className="mt-1 text-[11px] text-muted-foreground font-mono tabular-nums">
                    {new Date(entry.at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t border-border/60">
          <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs text-accent font-mono">
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
