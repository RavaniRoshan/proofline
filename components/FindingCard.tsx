"use client";

import { useEffect, useRef, useState } from "react";
import type { Finding } from "@/lib/types";
import {
  DECISION_LABEL,
  recordDecision,
  type DecisionValue,
  type StoredDecision,
} from "@/lib/local";
import { VerdictBadge } from "@/components/VerdictBadge";
import { FileText, Lightbulb, Check, X, PencilLine } from "lucide-react";

const DECISION_ICON: Record<DecisionValue, typeof Check> = {
  approve: Check,
  reject: X,
  needs_edit: PencilLine,
};

export interface FindingCardProps {
  finding: Finding;
  index: number;
  selected: boolean;
  decision: StoredDecision | null;
  onRecorded: () => void;
}

export function FindingCard({ finding, index, selected, decision, onRecorded }: FindingCardProps) {
  const [pending, setPending] = useState<DecisionValue | null>(null);
  const [reason, setReason] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pending) inputRef.current?.focus();
  }, [pending]);

  const e = finding.evidence;
  const reasonValid = reason.trim().length >= 3;

  function submit() {
    if (!pending || !reasonValid) return;
    recordDecision(finding, pending, reason);
    setPending(null);
    setReason("");
    onRecorded();
  }

  return (
    <article
      data-testid="finding"
      data-verdict={finding.verdict}
      data-index={index}
      className={`rounded-xl border bg-card p-4 shadow-sm transition-shadow sm:p-5 ${
        selected ? "border-accent ring-2 ring-accent/30" : "border-line"
      }`}
      aria-label={`Finding ${index + 1}: ${finding.verdict}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <VerdictBadge verdict={finding.verdict} />
        <span className="text-[11px] uppercase tracking-wide text-muted">
          {finding.claim_type} · {finding.source === "deterministic" ? "rule check" : "model check"}
        </span>
      </div>

      <blockquote className="mt-3 border-l-2 border-line pl-3 text-[15px] font-medium leading-snug text-foreground">
        “{finding.claim}”
      </blockquote>

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{finding.reason}</p>

      {e ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-background px-3 py-2 text-[12px] text-muted">
          <FileText size={13} aria-hidden="true" className="shrink-0" />
          <span className="font-medium text-foreground/80">{e.document_title || e.source_document_id}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{e.source_span}</span>
          <span aria-hidden="true">·</span>
          <span>version {e.fact_version}</span>
          <span aria-hidden="true">·</span>
          <span>
            valid {e.valid_from} → {e.valid_until}
          </span>
          <span className="ml-auto rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
            {e.fact_id}
          </span>
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-dashed border-line px-3 py-2 text-[12px] text-muted">
          {finding.verdict === "CONFLICTING"
            ? "Conflict between approved facts — see versions below."
            : "No approved source behind this finding."}
        </p>
      )}

      {finding.conflict_with && finding.conflict_with.length > 0 && (
        <p className="mt-2 text-[12px] text-muted">
          Also currently approved for the same attribute:{" "}
          {finding.conflict_with.map((id) => (
            <span key={id} className="mr-1 rounded border border-line bg-background px-1.5 py-0.5 font-mono text-[11px]">
              {id}
            </span>
          ))}
        </p>
      )}

      {finding.suggested_correction && (
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-foreground/90">
          <Lightbulb size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" />
          <span>
            <span className="font-semibold">Suggested correction: </span>
            {finding.suggested_correction}
          </span>
        </p>
      )}

      <div className="mt-4 border-t border-line pt-3">
        {decision ? (
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-background px-2.5 py-1 font-medium">
              {(() => {
                const Icon = DECISION_ICON[decision.decision];
                return <Icon size={13} aria-hidden="true" />;
              })()}
              Decision: {DECISION_LABEL[decision.decision]}
            </span>
            <span className="text-muted">— {decision.reason}</span>
            <button
              type="button"
              className="ml-auto text-xs font-medium text-accent underline-offset-2 hover:underline"
              onClick={() => {
                setPending(decision.decision);
                setReason(decision.reason);
              }}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-muted">Your decision:</span>
            {(["approve", "reject", "needs_edit"] as const).map((d) => {
              const Icon = DECISION_ICON[d];
              return (
                <button
                  key={d}
                  type="button"
                  data-testid={`decision-${d}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-background px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                  onClick={() => setPending(d)}
                >
                  <Icon size={13} aria-hidden="true" />
                  {DECISION_LABEL[d]}
                </button>
              );
            })}
          </div>
        )}

        {pending && (
          <form
            className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={(ev) => {
              ev.preventDefault();
              submit();
            }}
          >
            <label className="sr-only" htmlFor={`reason-${finding.id}`}>
              Why this decision? (required)
            </label>
            <input
              id={`reason-${finding.id}`}
              ref={inputRef}
              type="text"
              value={reason}
              onChange={(ev) => setReason(ev.target.value)}
              placeholder="Why this decision? (required)"
              className="h-9 flex-1 rounded-md border border-line bg-card px-3 text-[13px] placeholder:text-muted focus:border-accent"
              maxLength={280}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                data-testid="record-decision"
                disabled={!reasonValid}
                className="h-9 rounded-md bg-accent px-3 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Record
              </button>
              <button
                type="button"
                className="h-9 rounded-md border border-line px-3 text-[13px] text-muted hover:text-foreground"
                onClick={() => {
                  setPending(null);
                  setReason("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  );
}
