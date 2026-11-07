"use client";

import React, { useState } from "react";
import {
  BookText,
  BadgeCheck,
  CheckCircle2,
  Calendar,
  FileText,
  UserCheck,
  Copy,
  Check,
  History,
  Lock,
} from "lucide-react";

interface FactVersion {
  version: string;
  value: string;
  status: "ACTIVE APPROVED" | "SUPERSEDED" | "ARCHIVED";
  validFrom: string;
  validUntil: string;
  owner: string;
  ownerRole: string;
  docId: string;
  docTitle: string;
  span: [number, number];
  sha: string;
}

const VERSIONS: FactVersion[] = [
  {
    version: "v4.0",
    value: "₹6,499 per month",
    status: "ACTIVE APPROVED",
    validFrom: "2026-04-01",
    validUntil: "2027-03-31",
    owner: "VP Product Marketing",
    ownerRole: "Owner & Legal Signoff",
    docId: "DOC-003",
    docTitle: "Pricing-SLA-Q2-2026.pdf",
    span: [412, 468],
    sha: "7f83b1c4e92a83f1201948",
  },
  {
    version: "v3.0",
    value: "₹4,999 per month",
    status: "SUPERSEDED",
    validFrom: "2025-10-01",
    validUntil: "2026-03-31",
    owner: "VP Product Marketing",
    ownerRole: "Owner & Signoff",
    docId: "DOC-002",
    docTitle: "Pricing-SLA-FY25-Q3.pdf",
    span: [318, 370],
    sha: "4c18e7a9b039481ad98214",
  },
  {
    version: "v2.0",
    value: "₹4,999 per month",
    status: "SUPERSEDED",
    validFrom: "2025-01-01",
    validUntil: "2025-09-30",
    owner: "Product Ops Lead",
    ownerRole: "Owner & Signoff",
    docId: "DOC-002",
    docTitle: "Pricing-SLA-FY25-Q1.pdf",
    span: [204, 252],
    sha: "9d42f8b1c0e29384810239",
  },
  {
    version: "v1.0",
    value: "₹3,499 per month",
    status: "ARCHIVED",
    validFrom: "2024-06-01",
    validUntil: "2024-12-31",
    owner: "Product Ops Lead",
    ownerRole: "Initial Seeding",
    docId: "DOC-001",
    docTitle: "Pricing-SLA-Initial.pdf",
    span: [110, 156],
    sha: "3a91c0e294819283748291",
  },
];

export function RegisterLineageBento() {
  const [selectedVer, setSelectedVer] = useState<string>("v4.0");
  const [copiedSha, setCopiedSha] = useState(false);

  const active = VERSIONS.find((v) => v.version === selectedVer) || VERSIONS[0];
  const isActive = active.status === "ACTIVE APPROVED";

  const handleCopySha = () => {
    navigator.clipboard?.writeText(active.sha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 1600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-card/95 p-4 sm:p-6 shadow-sm font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              Fact Register Lineage
            </span>
            <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Fact ID: F-021
            </span>
            <span className="rounded bg-accent-brand/10 dark:bg-accent-readable/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-brand dark:text-accent-readable font-semibold">
              42 Seed Facts
            </span>
          </div>
          <h3 className="mt-1 font-serif text-lg sm:text-xl font-normal tracking-[-0.03em] text-foreground">
            Version-Controlled Ground Truth with Owner Signatures
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <Lock size={13} className="text-muted-foreground" />
          <span>Immutable Ledger</span>
        </div>
      </div>

      {/* Main Grid: Versions on Left + Detail Drawer on Right */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Version History List */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between px-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Version Lineage</span>
            <span>Validity Window</span>
          </div>

          <div className="space-y-1.5">
            {VERSIONS.map((v) => {
              const isSelected = v.version === selectedVer;
              const isCurActive = v.status === "ACTIVE APPROVED";

              return (
                <div
                  key={v.version}
                  onClick={() => setSelectedVer(v.version)}
                  className={`group flex items-center justify-between gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-foreground/40 bg-muted/50 shadow-xs"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-1 rounded ${
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {v.version}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">
                          {v.value}
                        </span>
                        <span
                          className={`font-mono text-[9.5px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                            isCurActive
                              ? "bg-v-supported-bg text-v-supported-fg border border-v-supported-border"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                        {v.docTitle} · {v.owner}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[10.5px] text-muted-foreground shrink-0 tabular-nums">
                    {v.validFrom} → {v.validUntil}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Linear Inspector Drawer */}
        <div className="lg:col-span-5 rounded-lg border border-border/80 bg-muted/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Record Specification
              </span>
              <span
                className={`font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  isActive
                    ? "bg-v-supported-bg text-v-supported-fg border border-v-supported-border"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {active.status}
              </span>
            </div>

            <div className="mt-3 space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Ground Truth Value
                </span>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {active.value}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Version Key
                  </span>
                  <span className="font-semibold text-foreground">
                    F-021 ({active.version})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground block">
                    Document
                  </span>
                  <span className="text-foreground truncate block">
                    {active.docId}
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Designated Approver
                </span>
                <div className="mt-1 flex items-center gap-1.5 font-sans">
                  <div className="size-4 rounded-full bg-accent-brand/20 dark:bg-accent-readable/20 flex items-center justify-center text-[10px] font-bold text-accent-brand dark:text-accent-readable">
                    VP
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {active.owner}
                  </span>
                  <BadgeCheck size={13} className="text-[#1F5C43]" />
                </div>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Source Character Span
                </span>
                <span className="text-xs text-foreground">
                  chars [{active.span[0]}, {active.span[1]}]
                </span>
              </div>

              <div className="pt-1 border-t border-border/40">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Validity Window
                </span>
                <span className="text-[11px] text-foreground">
                  {active.validFrom} to {active.validUntil}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground truncate">
              sha256:{active.sha.slice(0, 12)}...
            </span>
            <button
              type="button"
              onClick={handleCopySha}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/60 bg-muted/30 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer active:scale-[0.98]"
            >
              {copiedSha ? (
                <>
                  <Check size={12} className="text-[#1F5C43]" />
                  <span className="text-[#1F5C43]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy SHA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
