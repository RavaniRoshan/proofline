"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Lightbulb,
  Check,
  X,
  PencilLine,
  ExternalLink,
  Link as LinkIcon,
  CheckCheck,
  type LucideIcon,
} from "lucide-react";
import type { Finding } from "@/lib/types";
import { DECISION_LABEL, recordDecision, type StoredDecision, type DecisionValue } from "@/lib/local";
import { VerdictBadge } from "@/components/ui/badge";
import { getDecisionTrace } from "@/lib/trace";

const DECISION_ICON: Record<DecisionValue, LucideIcon> = {
  approve: Check,
  reject: X,
  needs_edit: PencilLine,
};

interface FindingCardProps {
  finding: Finding;
  index: number;
  selected?: boolean;
  decision?: StoredDecision | null;
  onRecorded?: () => void;
  onViewEvidence?: (finding: Finding) => void;
  onSelect?: (index: number) => void;
}

export function FindingCard({
  finding,
  index,
  selected,
  decision,
  onRecorded,
  onViewEvidence,
  onSelect,
}: FindingCardProps) {
  const [pending, setPending] = useState<DecisionValue | null>(null);
  const [reason, setReason] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const trace = getDecisionTrace(finding);

  useEffect(() => {
    if (pending) inputRef.current?.focus();
  }, [pending]);

  // Keyboard review shortcuts: 'a' for approve, 'r' for reject, 'e' for needs_edit
  useEffect(() => {
    if (!selected) return;
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "a") {
        e.preventDefault();
        setPending("approve");
      } else if (e.key === "r") {
        e.preventDefault();
        setPending("reject");
      } else if (e.key === "e") {
        e.preventDefault();
        setPending("needs_edit");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const e = finding.evidence;
  const reasonValid = reason.trim().length >= 3;

  function submit() {
    if (!pending || !reasonValid) return;
    recordDecision(finding, pending, reason);
    setPending(null);
    setReason("");
    onRecorded?.();
  }

  function copyFindingLink(ev: React.MouseEvent) {
    ev.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set("finding", finding.id);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article
      data-testid="finding"
      data-verdict={finding.verdict}
      data-index={index}
      style={{ "--index": index } as React.CSSProperties}
      onClick={() => onSelect?.(index)}
      className={`rounded-[6px] border bg-card p-4 sm:p-5 transition-colors cursor-pointer ${
        selected ? "border-slate ring-2 ring-slate/25" : "border-line-strong hover:border-slate/60"
      }`}
      aria-label={`Finding ${index + 1}: ${finding.verdict}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <VerdictBadge verdict={finding.verdict} />
          <span className="text-[11px] uppercase tracking-wide text-muted">
            {finding.claim_type} · {finding.source === "deterministic" ? "rule check" : "model check"}
          </span>
        </div>
        <button
          type="button"
          onClick={copyFindingLink}
          title="Copy link to this finding"
          className="inline-flex items-center gap-1 rounded-[4px] border border-line-strong bg-panel px-1.5 py-0.5 text-[10px] text-muted transition-colors hover:border-slate hover:text-foreground"
        >
          {copied ? (
            <>
              <CheckCheck size={11} className="text-v-supported-fg" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <LinkIcon size={11} aria-hidden="true" />
              <span>Link</span>
            </>
          )}
        </button>
      </div>

      <blockquote className="mt-3 border-l-2 border-line-strong pl-3 text-[15px] font-medium leading-snug text-foreground">
        “{finding.claim}”
      </blockquote>

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{finding.reason}</p>

      {/* One-line Decision Trace */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1 text-[11px] font-mono text-muted">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate">[{trace.source}]</span>
          <span>{trace.ruleName}</span>
          {trace.modelId && (
            <span className="text-muted">· {trace.modelId}</span>
          )}
          {trace.promptVersion && trace.source === "MODEL" && (
            <span className="text-muted">· {trace.promptVersion}</span>
          )}
          {typeof trace.latencyMs === "number" && (
            <span className="text-muted">· {trace.latencyMs}ms</span>
          )}
        </span>
        <button
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            onViewEvidence?.(finding);
          }}
          className="inline-flex items-center gap-1 font-medium text-slate hover:underline underline-offset-2"
        >
          <span>{e ? "Inspect evidence" : "Trace detail"}</span>
          <ExternalLink size={10} aria-hidden="true" />
        </button>
      </div>

      {e ? (
        <div
          onClick={(ev) => {
            ev.stopPropagation();
            onViewEvidence?.(finding);
          }}
          className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[4px] border border-line-strong bg-panel/50 px-3 py-2 text-[12px] text-muted hover:border-slate transition-colors"
        >
          <FileText size={13} aria-hidden="true" className="shrink-0 text-slate" />
          <span className="font-medium text-foreground/80">
            {e.document_title || e.source_document_id}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{e.source_span}</span>
          <span aria-hidden="true">·</span>
          <span>version {e.fact_version}</span>
          <span aria-hidden="true">·</span>
          <span>
            valid {e.valid_from} → {e.valid_until}
          </span>
          <span className="ml-auto rounded-[4px] border border-line-strong bg-card px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
            {e.fact_id}
          </span>
        </div>
      ) : (
        <p className="mt-3 rounded-[4px] border border-dashed border-line-strong bg-panel/30 px-3 py-2 text-[12px] text-muted">
          {finding.verdict === "CONFLICTING"
            ? "Conflict between approved facts — see versions below."
            : "No approved source behind this finding."}
        </p>
      )}

      {finding.conflict_with && finding.conflict_with.length > 0 && (
        <p className="mt-2 text-[12px] text-muted">
          Also currently approved for the same attribute:{" "}
          {finding.conflict_with.map((id) => (
            <span
              key={id}
              className="mr-1 rounded-[4px] border border-line-strong bg-panel px-1.5 py-0.5 font-mono text-[11px]"
            >
              {id}
            </span>
          ))}
        </p>
      )}

      {finding.suggested_correction && (
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-foreground/90">
          <Lightbulb size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-v-stale-fg" />
          <span>
            <span className="font-semibold">Suggested correction: </span>
            {finding.suggested_correction}
          </span>
        </p>
      )}

      <div className="mt-4 border-t border-line-strong pt-3">
        {decision ? (
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1 font-medium">
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
              const shortcutKey = d === "approve" ? "a" : d === "reject" ? "r" : "e";
              return (
                <button
                  key={d}
                  type="button"
                  data-testid={`decision-${d}`}
                  className={`inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-panel px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-colors ${
                    d === "approve"
                      ? "hover:border-v-supported-fg hover:text-v-supported-fg"
                      : "hover:border-accent hover:text-accent"
                  }`}
                  onClick={() => setPending(d)}
                >
                  <Icon size={13} aria-hidden="true" />
                  {DECISION_LABEL[d]}
                  {selected && (
                    <kbd className="ml-0.5 rounded border border-line bg-paper px-1 py-0.2 font-mono text-[10px] text-muted">
                      {shortcutKey}
                    </kbd>
                  )}
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
              className="h-9 flex-1 rounded-[4px] border border-line-strong bg-paper px-3 text-[13px] placeholder:text-muted focus:border-slate focus:outline-none"
              maxLength={280}
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                data-testid="record-decision"
                disabled={!reasonValid}
                className="h-9 rounded-[4px] bg-accent px-3 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Record
              </button>
              <button
                type="button"
                className="h-9 rounded-[4px] border border-line-strong bg-panel px-3 text-[13px] text-muted hover:border-slate hover:text-foreground"
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
