"use client";

import Link from "next/link";
import { Check, X, PencilLine, Download, ScrollText, type LucideIcon } from "lucide-react";
import { DECISION_LABEL, type DecisionValue } from "@/lib/local";
import { useProoflineState } from "@/lib/use-proofline";
import { VerdictBadge } from "@/components/ui/badge";

const DECISION_ICON: Record<DecisionValue, LucideIcon> = {
  approve: Check,
  reject: X,
  needs_edit: PencilLine,
};

export function AuditLog() {
  const state = useProoflineState();
  const entries = [...state.audit].reverse();

  function download() {
    const blob = new Blob([JSON.stringify(state.audit, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proofline-audit.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (entries.length === 0) {
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
    <section className="mt-6">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold">
          {entries.length} entr{entries.length === 1 ? "y" : "ies"}
        </p>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-slate hover:text-foreground"
        >
          <Download size={13} aria-hidden="true" />
          Download JSON
        </button>
      </div>
      <ol className="mt-3 flex flex-col gap-2" data-testid="audit-entries">
        {entries.map((entry) => {
          const Icon = DECISION_ICON[entry.decision];
          return (
            <li key={entry.id} className="rounded-[6px] border border-line-strong bg-card p-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <time dateTime={entry.at} className="font-mono">
                  {new Date(entry.at).toLocaleString()}
                </time>
                <span className="inline-flex items-center gap-1 rounded-[4px] border border-line-strong bg-panel px-2 py-0.5 font-medium text-foreground">
                  <Icon size={11} aria-hidden="true" />
                  {DECISION_LABEL[entry.decision]}
                </span>
                <VerdictBadge verdict={entry.verdict} />
                {entry.fact_id && (
                  <span className="rounded-[4px] border border-line-strong bg-panel px-1.5 py-0.5 font-mono">
                    {entry.fact_id}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14px] leading-snug text-foreground/90">“{entry.claim}”</p>
              <p className="mt-1 text-[13px] text-muted">
                <span className="font-medium text-foreground/70">Reason: </span>
                {entry.reason}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
