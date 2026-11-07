"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function EvidenceGateInspectorBento() {
  const [tampered, setTampered] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/95 p-4 sm:p-6 shadow-sm font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Runtime Evidence Gate
            </span>
            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              6-Field Citation Invariant
            </span>
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                tampered
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-v-supported-bg text-v-supported-fg border border-v-supported-border"
              }`}
            >
              {tampered ? "UNVERIFIED FALLBACK" : "VERDICT COMMITTED"}
            </span>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-bold tracking-tight text-foreground">
            Zero Hallucinated Citations: All 6 Proof Pins Enforced at Runtime
          </h3>
        </div>

        {/* Interactive Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 font-mono text-[11px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTampered(false)}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              !tampered
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Valid Citation (6/6)
          </button>
          <button
            type="button"
            onClick={() => setTampered(true)}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              tampered
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Missing Span (Hallucination)
          </button>
        </div>
      </div>

      {/* Main Grid: Document Viewer on Left + 6-Pin Gate Checklist on Right */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Authentic Document Excerpt Viewer */}
        <div className="lg:col-span-7 rounded-lg border border-border/80 bg-muted/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-muted-foreground" />
                <span className="font-mono text-xs font-semibold text-foreground">
                  DOC-003 · Pricing-SLA-Q2-2026.pdf
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                Page 4 · chars 390–520
              </span>
            </div>

            {/* Document Prose with Exact Highlighted Span */}
            <div className="mt-3 rounded border border-border/60 bg-background/80 p-3.5 font-mono text-xs leading-relaxed text-foreground/80">
              <p className="text-muted-foreground/60 text-[11px]">
                [Line 42] ...Section 3.1: Standard Commercial Terms...
              </p>
              <p className="mt-1.5">
                Effective fiscal Q2, the base license for the{" "}
                <span
                  className={`inline-block px-1.5 py-0.5 rounded font-semibold transition-all ${
                    tampered
                      ? "bg-muted text-muted-foreground line-through"
                      : "bg-[#8B1E27]/15 dark:bg-[#D4847A]/20 text-[#8B1E27] dark:text-[#D4847A] border border-[#8B1E27]/30"
                  }`}
                >
                  Flowdesk Starter tier is officially set at ₹6,499 per month
                </span>{" "}
                billed annually, with all previous ₹4,999 introductory pricing
                superseded and voided.
              </p>
              <p className="mt-1 text-muted-foreground/60 text-[11px]">
                [Line 45] ...End of commercial amendments...
              </p>
            </div>

            {tampered ? (
              <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300 font-mono">
                ⚠ SIMULATION: The model proposed fact F-021 but failed to provide
                the exact byte span [412, 468]. The Evidence Gate blocks the
                verdict and marks it UNVERIFIED instead of blindly accepting it.
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Exact Byte Span: [412, 468]</span>
                <span className="text-[#1F5C43] font-semibold">
                  ✓ Byte-level match verified
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Evaluated Claim: &ldquo;Flowdesk starts at ₹4,999/mo&rdquo;</span>
            <span className="font-semibold text-[#8B1E27] dark:text-[#D4847A]">
              {tampered ? "FALLBACK TO UNVERIFIED" : "CONTRADICTED (F-021)"}
            </span>
          </div>
        </div>

        {/* Right Column: 6-Pin Verification Checklist */}
        <div className="lg:col-span-5 rounded-lg border border-border/80 bg-muted/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Evidence Gate Shear Line
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                {tampered ? "5/6 Valid" : "6/6 Valid"}
              </span>
            </div>

            {/* The 6 Pins */}
            <div className="mt-3 space-y-2 font-mono text-xs">
              {/* Pin 1: Fact ID */}
              <div className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  <span className="text-foreground font-medium">1. fact_id</span>
                </div>
                <span className="text-accent-brand dark:text-accent-readable font-bold">
                  F-021
                </span>
              </div>

              {/* Pin 2: Fact Version */}
              <div className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  <span className="text-foreground font-medium">2. fact_version</span>
                </div>
                <span className="text-foreground">v4.0</span>
              </div>

              {/* Pin 3: Document ID */}
              <div className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  <span className="text-foreground font-medium">3. source_doc</span>
                </div>
                <span className="text-foreground">DOC-003</span>
              </div>

              {/* Pin 4: Byte Span (Tampered pin in demo mode) */}
              <div
                className={`flex items-center justify-between p-2 rounded border ${
                  tampered
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-background/60 border-border/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  {tampered ? (
                    <XCircle size={13} className="text-[#8B1E27]" />
                  ) : (
                    <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  )}
                  <span className="text-foreground font-medium">4. source_span</span>
                </div>
                <span
                  className={
                    tampered
                      ? "text-[#8B1E27] font-bold"
                      : "text-foreground"
                  }
                >
                  {tampered ? "MISSING_NULL" : "[412, 468]"}
                </span>
              </div>

              {/* Pin 5: Valid From */}
              <div className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  <span className="text-foreground font-medium">5. valid_from</span>
                </div>
                <span className="text-foreground">2026-04-01</span>
              </div>

              {/* Pin 6: Valid Until */}
              <div className="flex items-center justify-between p-2 rounded bg-background/60 border border-border/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#1F5C43]" />
                  <span className="text-foreground font-medium">6. valid_until</span>
                </div>
                <span className="text-foreground">2027-03-31</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {tampered ? (
                <>
                  <Unlock size={12} className="text-amber-500" />
                  Gate Disengaged
                </>
              ) : (
                <>
                  <Lock size={12} className="text-[#1F5C43]" />
                  Gate Locked & Verified
                </>
              )}
            </span>
            <span className="font-semibold text-foreground">
              {tampered ? "Zero Hallucinations" : "100% Provenance"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
