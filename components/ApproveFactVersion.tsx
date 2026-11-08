"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCheck } from "lucide-react";
import type { FactRow } from "@/lib/register";
import { approveFactVersion } from "@/lib/local";

/**
 * "Approve new version" for an expanded register row. Creates a same-fact_id,
 * version+1 approved row (valid from today), overrides the current row to
 * superseded, and logs an audit entry naming the old and new value.
 * Persisted to localStorage via lib/local.ts; seed files are never touched.
 */
export function ApproveFactVersion({
  row,
  reviewDate,
  onApproved,
}: {
  row: FactRow;
  reviewDate: string;
  /** Called with the new row's expanded-row key after a successful approval. */
  onApproved: (newRowKey: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(row.value);
  const [displayValue, setDisplayValue] = useState(row.display_value || String(row.value));
  const [approvedVersion, setApprovedVersion] = useState<number | null>(null);

  const valid = value.trim().length > 0 && displayValue.trim().length > 0;

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!valid) return;
    approveFactVersion(row, { value, displayValue }, reviewDate);
    setApprovedVersion(row.version + 1);
    setOpen(false);
    onApproved(`${row.fact_id}-v${row.version + 1}`);
  }

  if (approvedVersion !== null) {
    return (
      <div className="mt-3 border-t border-line-strong pt-3">
        <p className="flex flex-wrap items-center gap-2 text-xs text-v-supported-fg">
          <CheckCheck size={14} aria-hidden="true" />
          <span>
            <span className="font-mono font-semibold">{row.fact_id} v{approvedVersion}</span> approved
            by brand-owner, v{row.version} superseded.
          </span>
          <Link
            href="/audit"
            className="font-medium text-accent underline underline-offset-2"
          >
            Audit log
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-line-strong pt-3">
      {!open ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-xl text-xs text-muted">
            Value changed? Approve the corrected value as a new version, this row becomes
            superseded and the change is logged in the audit log.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-testid="approve-new-version"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-slate hover:text-foreground"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            Approve new version
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`new-value-${row.fact_id}-v${row.version}`}
                className="text-[11px] uppercase tracking-wide text-muted"
              >
                New value{row.unit ? ` (${row.unit})` : ""}
              </label>
              <input
                id={`new-value-${row.fact_id}-v${row.version}`}
                type="text"
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
                className="mt-1 h-9 w-full rounded-[4px] border border-line-strong bg-paper px-3 font-mono text-[13px] text-foreground focus:border-slate focus:outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor={`new-display-${row.fact_id}-v${row.version}`}
                className="text-[11px] uppercase tracking-wide text-muted"
              >
                Display value
              </label>
              <input
                id={`new-display-${row.fact_id}-v${row.version}`}
                type="text"
                value={displayValue}
                onChange={(ev) => setDisplayValue(ev.target.value)}
                className="mt-1 h-9 w-full rounded-[4px] border border-line-strong bg-paper px-3 text-[13px] text-foreground focus:border-slate focus:outline-none"
                required
              />
            </div>
          </div>
          <p className="text-[11px] text-muted">
            Creates{" "}
            <span className="font-mono text-foreground">
              {row.fact_id} v{row.version + 1}
            </span>{" "}
            · valid from {reviewDate} · v{row.version} becomes superseded · logged in the audit log.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              data-testid="confirm-approve-new-version"
              disabled={!valid}
              className="h-9 rounded-[4px] bg-accent px-3 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Approve new version
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 rounded-[4px] border border-line-strong bg-panel px-3 text-[13px] text-muted hover:border-slate hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
