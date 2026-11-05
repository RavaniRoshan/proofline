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
  type LucideIcon,
} from "lucide-react";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import type { Verdict } from "@/lib/types";
import { ALL_VERDICTS } from "@/lib/types";
import { VerdictBadge } from "@/components/ui/badge";

const DECISION_ICON: Record<DecisionValue, LucideIcon> = {
  approve: Check,
  reject: X,
  needs_edit: PencilLine,
};

export function AuditLog() {
  const state = useProoflineState();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allEntries = useMemo(() => [...state.audit].reverse(), [state.audit]);

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
    a.download = "proofline-audit.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (allEntries.length === 0) {
    return (
      <div className="mt-6 rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-8 text-center">
        <ScrollText size={28} aria-hidden="true" className="mx-auto text-slate" />
        <p className="mt-3 font-semibold">Nothing logged yet.</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          Check a draft and record a decision on a finding — every decision you make
          appears here with its reason and the fact behind it.
        </p>
        <Link
          href="/check"
          className="mt-4 inline-flex h-10 items-center rounded-[4px] bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Go check a draft
        </Link>
      </div>
    );
  }

  return (
    <section className="mt-6 space-y-4">
      {/* Filter and action bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 rounded-[4px] border border-line-strong bg-paper px-2.5 text-xs font-medium text-foreground focus:border-slate focus:outline-none"
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
            className="h-9 rounded-[4px] border border-line-strong bg-paper px-2.5 text-xs font-medium text-foreground focus:border-slate focus:outline-none"
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
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims or reasons..."
              className="h-9 w-44 rounded-[4px] border border-line-strong bg-paper pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted focus:border-slate focus:outline-none sm:w-56"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">
            {filteredEntries.length} of {allEntries.length} entr{allEntries.length === 1 ? "y" : "ies"}
          </span>
          <button
            type="button"
            onClick={download}
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-3 text-xs font-medium text-foreground transition-colors hover:border-slate hover:bg-paper"
          >
            <Download size={13} aria-hidden="true" />
            Download JSON
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-line-strong bg-panel/40 p-6 text-center text-sm">
          <p className="font-semibold text-foreground">No matching log entries found.</p>
          <p className="mt-1 text-xs text-muted">
            No entries match your selected filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setActionFilter("all");
              setVerdictFilter("all");
              setSearchQuery("");
            }}
            className="mt-3 inline-flex h-8 items-center rounded-[4px] border border-line-strong bg-paper px-3 text-xs font-medium text-foreground hover:border-slate"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <ol className="flex flex-col gap-2.5" data-testid="audit-entries">
          {filteredEntries.map((entry) => {
            const Icon = DECISION_ICON[entry.decision];
            return (
              <li
                key={entry.id}
                className="group rounded-[6px] border border-line-strong bg-card p-4 transition-colors hover:border-slate"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2.5 text-[11px] text-muted">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-[4px] border border-line-strong bg-panel px-2 py-0.5 font-medium text-foreground">
                      <Icon size={11} aria-hidden="true" />
                      {DECISION_LABEL[entry.decision]}
                    </span>
                    <VerdictBadge verdict={entry.verdict} />
                    {entry.fact_id && (
                      <span className="rounded-[4px] border border-line-strong bg-panel px-1.5 py-0.5 font-mono text-[11px]">
                        {entry.fact_id}
                      </span>
                    )}
                  </div>
                  <time dateTime={entry.at} className="font-mono text-[11px] text-muted">
                    {new Date(entry.at).toLocaleString()}
                  </time>
                </div>
                <div className="mt-2.5">
                  <p className="text-[14px] leading-snug text-foreground font-medium">
                    “{entry.claim}”
                  </p>
                  <p className="mt-1.5 text-[13px] text-muted">
                    <span className="font-medium text-foreground/80">Reason: </span>
                    {entry.reason}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
