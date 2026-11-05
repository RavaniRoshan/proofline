"use client";

import React from "react";
import type { Finding } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VerdictBadge } from "@/components/ui/badge";
import { getDecisionTrace } from "@/lib/trace";
import { FileText, Calendar, Check, AlertCircle } from "lucide-react";

interface EvidenceDrawerProps {
  finding: Finding | null;
  open: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ finding, open, onClose }: EvidenceDrawerProps) {
  if (!finding) return null;

  const e = finding.evidence;
  const trace = getDecisionTrace(finding);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <VerdictBadge verdict={finding.verdict} />
            <span className="font-mono text-xs text-muted">
              {finding.claim_type} · {trace.source}
            </span>
          </div>
          <DialogTitle className="mt-1">
            {e ? e.document_title || e.source_document_id : "Evidence Record"}
          </DialogTitle>
          <DialogDescription>
            {e
              ? `Source verification for attribute “${e.attribute.replace(/_/g, " ")}”`
              : "No approved register source behind this claim."}
          </DialogDescription>
        </DialogHeader>

        {/* Claim context */}
        <div className="rounded-[4px] border border-line-strong bg-panel p-3.5 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Claim Under Review</p>
          <blockquote className="mt-1 border-l-2 border-line-strong pl-2.5 font-medium text-foreground">
            “{finding.claim}”
          </blockquote>
          <p className="mt-2 text-xs text-muted">{finding.reason}</p>
        </div>

        {/* Evidence details */}
        {e ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-[6px] border border-line-strong bg-card p-4">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  <FileText size={14} className="text-slate" />
                  <span>Document Record</span>
                </div>
                <span className="font-mono text-xs text-muted">{e.source_version_id}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-muted block text-[11px]">Fact ID</span>
                  <span className="font-mono font-medium">{e.fact_id} (v{e.fact_version})</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Cited Span</span>
                  <span className="font-mono font-medium">{e.source_span}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Valid From</span>
                  <span className="font-mono font-medium">{e.valid_from}</span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Valid Until</span>
                  <span className="font-mono font-medium">{e.valid_until}</span>
                </div>
              </div>

              {/* Cited span highlight container */}
              <div className="mt-4 rounded-[4px] border border-line-strong bg-panel/70 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Cited Source Span in Document
                </p>
                <div className="font-mono text-[13px] leading-relaxed text-foreground">
                  <span>… </span>
                  <span className="font-semibold underline decoration-accent decoration-2 underline-offset-4 text-foreground bg-background px-1.5 py-0.5 rounded-[2px] border border-line">
                    {e.display_value || `${e.value} ${e.unit}`}
                  </span>
                  <span> …</span>
                </div>
                <p className="mt-2 text-[11px] text-muted italic">
                  Span cited at offset {e.source_span} in {e.document_title}. Underlined in brand oxblood.
                </p>
              </div>

              {/* Invariant 3 notice */}
              <div className="mt-3 flex items-start gap-2 text-[11px] text-muted bg-panel p-2.5 rounded-[4px] border border-line">
                <Calendar size={13} className="shrink-0 text-slate mt-0.5" />
                <span>
                  <strong>Proofline Invariant 3:</strong> Source text is verified against approved register span {e.source_span}. Synthetic source bodies are never fabricated.
                </span>
              </div>
            </div>

            {/* Suggested correction if any */}
            {finding.suggested_correction && (
              <div className="rounded-[4px] border border-v-supported-fg/30 bg-v-supported-bg/40 p-3 text-xs text-v-supported-fg">
                <p className="font-semibold">Suggested Correction:</p>
                <p className="mt-0.5 font-medium">{finding.suggested_correction}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[6px] border border-line-strong bg-panel/50 p-6 text-center text-xs text-muted">
            <AlertCircle size={24} className="mx-auto text-slate mb-2" />
            <p className="font-medium text-foreground">No Register Fact Found</p>
            <p className="mt-1 max-w-sm mx-auto">
              This claim could not be matched against any approved active fact in the register.
              Under Proofline invariants, an unresolvable claim cannot be verified.
            </p>
          </div>
        )}

        {/* Decision trace row */}
        <div className="rounded-[4px] border border-line-strong bg-panel p-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground font-semibold">
            <span className={trace.source === "RULE" ? "text-slate" : "text-ink-soft"}>
              [{trace.source}]
            </span>
            <span>{trace.ruleName}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted leading-tight">{trace.summary}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
