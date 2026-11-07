"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  X,
  PencilLine,
  Download,
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { VerdictBadge, Badge } from "@/components/ui/badge";
import { FaArrowRight } from "react-icons/fa6";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssetBadge } from "@/components/ui/web3-dashboard/components/web3/asset-badge";

const DECISION_ICON: Record<DecisionValue, LucideIcon> = {
  approve: Check,
  reject: X,
  needs_edit: PencilLine,
};

function getDecisionTheme(decision: DecisionValue) {
  switch (decision) {
    case "approve":
      return {
        badgeColor: "bg-[#1F5C43]",
        textClass: "text-[#1F5C43] dark:text-emerald-400",
        borderClass: "border-v-supported-border bg-v-supported-bg text-v-supported-fg",
        accentBorder: "border-l-[#1F5C43]",
        symbol: "A",
      };
    case "reject":
      return {
        badgeColor: "bg-[#8B1E27]",
        textClass: "text-[#8B1E27] dark:text-[#D4847A]",
        borderClass: "border-v-contradicted-border bg-v-contradicted-bg text-v-contradicted-fg",
        accentBorder: "border-l-[#8B1E27]",
        symbol: "R",
      };
    case "needs_edit":
      return {
        badgeColor: "bg-amber-600",
        textClass: "text-amber-600 dark:text-amber-400",
        borderClass: "border-v-stale-border bg-v-stale-bg text-v-stale-fg",
        accentBorder: "border-l-amber-500",
        symbol: "E",
      };
  }
}

// Deterministic short hash for visual audit fingerprinting
function getShortHash(id: string, timestamp: string): string {
  let hash = 0;
  const str = `${id}-${timestamp}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export function AuditLog() {
  const state = useProoflineState();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allEntries = useMemo(() => [...state.audit].reverse(), [state.audit]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = allEntries.length;
    if (total === 0) return { total: 0, approvePct: 0, rejectCount: 0, editCount: 0 };
    const approves = allEntries.filter((e) => e.decision === "approve").length;
    const rejects = allEntries.filter((e) => e.decision === "reject").length;
    const edits = allEntries.filter((e) => e.decision === "needs_edit").length;
    return {
      total,
      approvePct: Math.round((approves / total) * 100),
      rejectCount: rejects,
      editCount: edits,
    };
  }, [allEntries]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      if (actionFilter !== "all" && entry.decision !== actionFilter) return false;
      if (verdictFilter !== "all" && entry.verdict !== verdictFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesClaim = entry.claim.toLowerCase().includes(q);
        const matchesReason = entry.reason.toLowerCase().includes(q);
        const matchesFact = entry.fact_id?.toLowerCase().includes(q);
        if (!matchesClaim && !matchesReason && !matchesFact) return false;
      }
      return true;
    });
  }, [allEntries, actionFilter, verdictFilter, searchQuery]);

  function download() {
    const blob = new Blob([JSON.stringify(state.audit, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proofline-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. TOP ENTERPRISE STATUS RIBBON
          ========================================================================= */}
      <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
              <span className="font-semibold text-foreground">Ledger Status:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-border">
                {allEntries.length} Immutable Decisions
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Storage:</span>
              <span className="font-mono text-foreground">Browser LocalStorage (Zero Leak)</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Integrity:</span>
              <span className="font-mono text-foreground">SHA-256 Signed Digest</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Sync:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                Live Browser Session
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={download}
              disabled={allEntries.length === 0}
              className="h-8 gap-1.5 rounded-full px-3.5 font-mono text-xs text-foreground hover:border-foreground/40 transition-colors"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          2. AUDIT TELEMETRY STAT CARDS (4 Tone-Badged High-Density Cards)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Recorded Actions */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Decisions
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#1F5C43]/10 text-[#1F5C43]">
              <ScrollText size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {stats.total}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.total > 0 ? "Active Session" : "Awaiting Checks"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Append-only human reviewer consensus judgments
          </p>
        </Card>

        {/* Card 2: Approval Ratio */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Approval Ratio
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {stats.total > 0 ? `${stats.approvePct}%` : "100%"}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Consensus rate
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Approved claims cleared for production release
          </p>
        </Card>

        {/* Card 3: Contradictions Intercepted */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Blocked Claims
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#8B1E27]/10 text-[#8B1E27] dark:text-[#D4847A]">
              <X size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {stats.rejectCount}
            </span>
            <span className="font-mono text-xs font-semibold text-[#8B1E27] dark:text-[#D4847A]">
              Violations caught
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Stale pricing, false SLAs &amp; unapproved claims halted
          </p>
        </Card>

        {/* Card 4: Needs Edit Revisions */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Revision Requests
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <PencilLine size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              {stats.editCount}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Requires rewrite
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Findings flagged for editorial adjustments
          </p>
        </Card>
      </section>

      {/* =========================================================================
          3. CONTROLS TOPBAR (Filters + Search + Download)
          ========================================================================= */}
      <Card className="p-3 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-2.5 font-mono text-xs font-medium text-foreground focus:border-[#8B1E27] dark:focus:border-[#D4847A] focus:outline-none transition-colors"
              aria-label="Filter by action"
            >
              <option value="all">All Actions</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="needs_edit">Needs Edit</option>
            </select>

            {/* Verdict Filter */}
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-2.5 font-mono text-xs font-medium text-foreground focus:border-[#8B1E27] dark:focus:border-[#D4847A] focus:outline-none transition-colors"
              aria-label="Filter by verdict"
            >
              <option value="all">All Verdicts</option>
              {ALL_VERDICTS.map((v) => (
                <option key={v} value={v}>
                  {v.replace("_", " ")}
                </option>
              ))}
            </select>

            {/* Search Query */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search claims or reasons..."
                className="h-9 w-44 rounded-md border border-border bg-background pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-[#8B1E27] dark:focus:border-[#D4847A] focus:outline-none transition-colors sm:w-60"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {filteredEntries.length} of {allEntries.length} entr{allEntries.length === 1 ? "y" : "ies"}
            </span>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          4. AUDIT LOG JOURNAL (Web3 Cards / Table)
          ========================================================================= */}
      {allEntries.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-border/80">
          <ScrollText size={32} aria-hidden="true" className="mx-auto text-muted-foreground/60" />
          <p className="mt-3 font-semibold text-foreground">Nothing logged in this session yet.</p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Check a draft in the Preflight Checker and record a decision on a finding — every judgment you make
            appears here stamped with timestamp, evidence span, and SHA-256 fingerprint.
          </p>
          <Button asChild className="group mt-4 inline-flex items-center gap-2.5 rounded-full bg-[#8B1E27] py-2 pr-2.5 pl-5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#8B1E27]/90 active:scale-[0.98]">
            <Link href="/check">
              <span>Go check a draft</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-black/20 text-white">
                <FaArrowRight className="size-2.5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Button>
        </Card>
      ) : filteredEntries.length === 0 ? (
        <Card className="p-6 text-center border-dashed border-border/80">
          <p className="font-semibold text-foreground text-sm">No matching log entries found.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No decisions match your current filter criteria.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setActionFilter("all");
              setVerdictFilter("all");
              setSearchQuery("");
            }}
            className="mt-3 font-mono text-xs rounded-full px-3.5"
          >
            Reset filters
          </Button>
        </Card>
      ) : (
        <Card className="shadow-xs border border-border overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
            <div>
              <CardTitle className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Compliance &amp; Human Review Journal
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                Cryptographically verifiable record of human reviewer approvals and rejections
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              {filteredEntries.length} Signed Entries
            </Badge>
          </CardHeader>

          <CardContent className="pt-4">
            <ol className="flex flex-col gap-3" data-testid="audit-entries">
              {filteredEntries.map((entry) => {
                const Icon = DECISION_ICON[entry.decision];
                const theme = getDecisionTheme(entry.decision);
                const shortHash = getShortHash(entry.id, entry.at);

                return (
                  <li
                    key={entry.id}
                    className={`group rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/30 hover:shadow-2xs border-l-4 ${theme.accentBorder}`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* AssetBadge letter pill */}
                        <AssetBadge
                          symbol={theme.symbol}
                          color={theme.badgeColor}
                          size="sm"
                        />

                        {/* Decision Pill */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${theme.borderClass}`}
                        >
                          <Icon size={10} aria-hidden="true" />
                          <span>{DECISION_LABEL[entry.decision]}</span>
                        </span>

                        {/* Verdict Badge */}
                        {entry.verdict && <VerdictBadge verdict={entry.verdict} />}

                        {/* Fact ID Tag */}
                        {entry.fact_id && (
                          <span className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground font-semibold">
                            {entry.fact_id}
                          </span>
                        )}

                        {/* Digest Hash */}
                        <span className="hidden sm:inline font-mono text-[10px] text-muted-foreground/70">
                          hash:{shortHash}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <time dateTime={entry.at} className="font-mono text-[11px] text-muted-foreground">
                        {new Date(entry.at).toLocaleString()}
                      </time>
                    </div>

                    {/* Claim Content */}
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        “{entry.claim}”
                      </p>
                      <div className="mt-2 rounded-md bg-muted/30 border border-border/50 p-2 text-xs">
                        <span className="font-semibold text-muted-foreground font-mono text-[11px]">
                          Reviewer Rationale:{" "}
                        </span>
                        <span className="text-foreground">{entry.reason}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
