"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode,
  Check,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  draftTitle: string;
  reviewer: string;
  reviewerRole: string;
  decision: "APPROVED" | "REJECTED_STALE" | "NEEDS_EDIT";
  stats: string;
  hash: string;
}

const AUDIT_FEED: AuditEntry[] = [
  {
    id: "AUD-8021",
    timestamp: "2026-11-05 14:22",
    draftTitle: "Flowdesk Q2 Launch Copy",
    reviewer: "Sarah Chen",
    reviewerRole: "Compliance Lead",
    decision: "REJECTED_STALE",
    stats: "3 Contradictions Intercepted",
    hash: "sha256:7f83b1c4e92a83f1201948",
  },
  {
    id: "AUD-8020",
    timestamp: "2026-11-05 11:08",
    draftTitle: "Enterprise Security Whitepaper",
    reviewer: "Alex Mercer",
    reviewerRole: "Legal Counsel",
    decision: "APPROVED",
    stats: "12 Claims Verified Clean",
    hash: "sha256:4c18e7a9b039481ad98214",
  },
  {
    id: "AUD-8019",
    timestamp: "2026-11-04 18:45",
    draftTitle: "Pricing Page Comparison Matrix",
    reviewer: "Devon Vance",
    reviewerRole: "Product Marketing",
    decision: "NEEDS_EDIT",
    stats: "1 SLA Latency Flagged",
    hash: "sha256:9d42f8b1c0e29384810239",
  },
];

export function AuditLedgerBento() {
  const [downloaded, setDownloaded] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string>("AUD-8021");

  const active = AUDIT_FEED.find((e) => e.id === activeEntryId) || AUDIT_FEED[0];

  const handleDownload = () => {
    const data = JSON.stringify(
      {
        export_standard: "PROOFLINE_SOC2_DECISION_LEDGER_V1",
        generated_at: new Date().toISOString(),
        entries: AUDIT_FEED,
      },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proofline_audit_ledger.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/95 p-4 sm:p-6 shadow-sm font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              SOC 2 Compliance Ledger
            </span>
            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              SHA-256 Merkle Chain
            </span>
            <span className="rounded bg-v-supported-bg text-v-supported-fg border border-v-supported-border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
              Zero Server Retention
            </span>
          </div>
          <h3 className="mt-1 font-serif text-lg sm:text-xl font-normal tracking-[-0.03em] text-foreground">
            Immutable Verification Ledger &amp; Exportable Compliance Trail
          </h3>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer self-start sm:self-auto shadow-xs"
        >
          {downloaded ? (
            <>
              <Check size={13} className="text-[#1F5C43]" />
              <span>Exported JSON</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>Export Audit Ledger</span>
            </>
          )}
        </button>
      </div>

      {/* Main Split Grid: Ledger Rows on Left + Cryptographic Inspector on Right */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Ledger Rows */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Verified Decision Record</span>
            <span>Reviewer</span>
          </div>

          <div className="space-y-1.5">
            {AUDIT_FEED.map((entry) => {
              const isSelected = entry.id === activeEntryId;
              const isRejected = entry.decision === "REJECTED_STALE";
              const isApproved = entry.decision === "APPROVED";

              return (
                <div
                  key={entry.id}
                  onClick={() => setActiveEntryId(entry.id)}
                  className={`group flex items-center justify-between gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-foreground/40 bg-muted/50 shadow-xs"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isRejected && (
                      <XCircle size={15} className="text-[#8B1E27] shrink-0" />
                    )}
                    {isApproved && (
                      <CheckCircle2 size={15} className="text-[#1F5C43] shrink-0" />
                    )}
                    {!isRejected && !isApproved && (
                      <AlertTriangle size={15} className="text-[#D4847A] shrink-0" />
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {entry.id}
                        </span>
                        <span
                          className={`font-mono text-[9.5px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                            isRejected
                              ? "bg-v-contradicted-bg text-v-contradicted-fg border border-v-contradicted-border"
                              : isApproved
                              ? "bg-v-supported-bg text-v-supported-fg border border-v-supported-border"
                              : "bg-v-stale-bg text-v-stale-fg border border-v-stale-border"
                          }`}
                        >
                          {entry.decision.replace("_", " ")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-semibold text-foreground truncate">
                        {entry.draftTitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {entry.stats}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px]">
                    <span className="text-foreground font-medium block">
                      {entry.reviewer}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {entry.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cryptographic Chain Inspector */}
        <div className="lg:col-span-5 rounded-lg border border-border/80 bg-muted/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Cryptographic Proof
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                {active.id}
              </span>
            </div>

            <div className="mt-3 space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Subject Document
                </span>
                <p className="font-sans text-xs font-bold text-foreground mt-0.5">
                  {active.draftTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Signing Authority
                  </span>
                  <span className="text-foreground font-semibold">
                    {active.reviewer}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {active.reviewerRole}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Timestamp (UTC)
                  </span>
                  <span className="text-foreground">{active.timestamp}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  SHA-256 Decision Hash
                </span>
                <span className="text-[11px] text-accent-brand dark:text-accent-readable font-mono break-all block mt-0.5">
                  {active.hash}
                </span>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Data Retention Boundary
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Stateless local memory execution · 0 bytes persisted to remote servers
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#1F5C43]" />
              SOC 2 Type II Invariant
            </span>
            <span className="font-semibold text-foreground">Immutable Trail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
