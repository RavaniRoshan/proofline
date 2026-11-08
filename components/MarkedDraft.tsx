"use client";

import React, { useMemo } from "react";
import type { Finding } from "@/lib/types";
import { VERDICT_MAP } from "@/lib/verdicts";
import { cn } from "@/lib/utils";

interface MarkedDraftProps {
  draft: string;
  findings: Finding[];
  selectedFindingId: string | null;
  onSelectFinding: (finding: Finding) => void;
}

interface TextSegment {
  type: "text" | "claim";
  text: string;
  finding?: Finding;
  key: string;
}

export function MarkedDraft({
  draft,
  findings,
  selectedFindingId,
  onSelectFinding,
}: MarkedDraftProps) {
  // Extract and sort valid claim spans from findings
  const segments = useMemo(() => {
    const claimFindings = findings
      .filter((f) => f.char_end > f.char_start && f.char_end <= draft.length)
      .sort((a, b) => a.char_start - b.char_start);

    const result: TextSegment[] = [];
    let cursor = 0;

    for (let i = 0; i < claimFindings.length; i++) {
      const f = claimFindings[i];
      if (f.char_start < cursor) {
        // Skip overlapping spans to prevent corrupting text
        continue;
      }

      if (f.char_start > cursor) {
        result.push({
          type: "text",
          text: draft.slice(cursor, f.char_start),
          key: `text-${cursor}-${f.char_start}`,
        });
      }

      result.push({
        type: "claim",
        text: draft.slice(f.char_start, f.char_end),
        finding: f,
        key: `claim-${f.id}-${f.char_start}`,
      });

      cursor = f.char_end;
    }

    if (cursor < draft.length) {
      result.push({
        type: "text",
        text: draft.slice(cursor),
        key: `text-${cursor}-${draft.length}`,
      });
    }

    return result;
  }, [draft, findings]);

  return (
    <div
      data-testid="marked-draft"
      className="rounded-[6px] border border-line-strong bg-card p-4 sm:p-5 text-[14px] leading-relaxed text-foreground"
    >
      <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Marked-up Draft
          </span>
          <span className="text-[11px] text-muted">· click any highlighted claim</span>
        </div>
        <span className="font-mono text-[11px] text-muted">
          {findings.length} claim{findings.length === 1 ? "" : "s"} marked
        </span>
      </div>

      <div className="whitespace-pre-wrap font-sans selection:bg-panel selection:text-foreground">
        {segments.map((seg) => {
          if (seg.type === "text") {
            return <span key={seg.key}>{seg.text}</span>;
          }

          const f = seg.finding!;
          const isSelected = f.id === selectedFindingId;
          const config = VERDICT_MAP[f.verdict];

          return (
            <button
              key={seg.key}
              type="button"
              onClick={() => onSelectFinding(f)}
              title={`${f.verdict}: ${f.reason}`}
              aria-pressed={isSelected}
              aria-label={`Claim: ${seg.text.trim()}, ${f.verdict.replace("_", " ")}. ${f.reason}`}
              className={cn(
                "inline cursor-pointer rounded-none border-b-2 px-1 py-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                config.badgeClasses,
                isSelected
                  ? "ring-2 ring-slate ring-offset-1 font-semibold"
                  : "hover:opacity-85 hover:border-slate"
              )}
            >
              {seg.text}
              <span className="ml-1 inline-block text-[11px] font-mono opacity-75">
                [{f.verdict.slice(0, 4)}]
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
