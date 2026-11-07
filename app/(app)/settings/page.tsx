"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  Calendar,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Database,
  ArrowRight,
  User,
  Sliders,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resetDemo } from "@/lib/local";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [reviewDate, setReviewDate] = useState("2026-11-07");
  const [selectedRole, setSelectedRole] = useState("Compliance Lead");
  const [strictGate, setStrictGate] = useState(true);
  const [fastPath, setFastPath] = useState(true);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setResetting(true);
    resetDemo();
    setTimeout(() => {
      setResetting(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [07] WORKSPACE CONFIGURATION
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            Engine &amp; Privacy Controls
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          Workspace Settings
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Configure simulated review date windows, designated reviewer identity, Evidence Gate enforcement invariants, and local-first privacy boundaries.
        </p>
      </div>

      {/* =====================================================================
          SECTION 1: Reviewer Identity & Simulated Date Window
          ===================================================================== */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <User size={15} className="text-accent-brand dark:text-accent-readable" />
            <CardTitle className="text-base font-semibold text-foreground">
              Reviewer Identity &amp; Active Validity Window
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Determines which ground truth fact versions and temporal validity windows are considered active during draft preflight checks.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Simulated Review Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Simulated Review Date
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Facts with validity windows outside this date evaluate as STALE or SUPERSEDED.
              </p>
            </div>

            {/* Designated Reviewer Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Designated Reviewer Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer"
              >
                <option value="Compliance Lead">Sarah Chen (Compliance Lead)</option>
                <option value="Legal Counsel">Alex Mercer (Legal Counsel)</option>
                <option value="Product Marketing">Devon Vance (Product Marketing)</option>
              </select>
              <p className="text-[11px] text-muted-foreground">
                Authority key stamped onto SHA-256 Merkle audit decision records.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1F5C43]" />
              <span className="font-semibold text-foreground">Current Active Scope:</span>
              <span className="text-muted-foreground">Flowdesk Inc. (B-flowdesk · Starter, Growth, Pro, Enterprise)</span>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">
              42 Seed Facts Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================================
          SECTION 2: Engine Governance Invariants
          ===================================================================== */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Cpu size={15} className="text-accent-brand dark:text-accent-readable" />
            <CardTitle className="text-base font-semibold text-foreground">
              Verification Engine Invariants
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Mathematical rules enforced in code to prevent hallucinated citations and eliminate false contradictions.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {/* Strict Evidence Gate */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3 bg-card">
            <div className="space-y-0.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Strict 6-Field Evidence Gate
                </span>
                <span className="rounded bg-v-supported-bg text-v-supported-fg px-1.5 py-0.2 font-mono text-[9px] font-bold">
                  Enforced
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Refuses to serialize CONTRADICTED unless fact_id, version, document_id, byte span, and validity dates all resolve with 100% precision.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStrictGate(!strictGate)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                strictGate ? "bg-[#1F5C43]" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  strictGate ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Stage 1 Deterministic Fast-Path */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3 bg-card">
            <div className="space-y-0.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Stage 1 TypeScript AST Normalizer (&lt;1ms)
                </span>
                <span className="rounded bg-accent/10 text-accent-brand dark:text-accent-readable px-1.5 py-0.2 font-mono text-[9px] font-bold">
                  78% Fast-Path
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Evaluates numeric prices, currencies, dates, and quotas in pure memory at $0.00 token cost before making any model invocation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFastPath(!fastPath)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                fastPath ? "bg-[#1F5C43]" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  fastPath ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================================
          SECTION 3: Privacy & Local Storage Journal
          ===================================================================== */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-[#1F5C43]" />
            <CardTitle className="text-base font-semibold text-foreground">
              Local-First Isolation &amp; Session State
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Reviewer sign-offs and decision journals live strictly inside your browser’s localStorage.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-[10px] uppercase text-muted-foreground block">Storage Key</span>
              <span className="font-bold text-foreground mt-0.5 block truncate">proofline.v1</span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-[10px] uppercase text-muted-foreground block">Server Prose</span>
              <span className="font-bold text-[#1F5C43] mt-0.5 block">0 Bytes Transmitted</span>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-[10px] uppercase text-muted-foreground block">Merkle Chain</span>
              <span className="font-bold text-foreground mt-0.5 block">SHA-256 Valid</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Reset Demo Session Data
              </p>
              <p className="text-[11px] text-muted-foreground">
                Clears all local reviewer approvals, decision journals, and custom register edits, reloading the initial 42 Flowdesk seed facts.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={resetting}
              className="gap-1.5 font-mono text-xs rounded-full px-4 border-border hover:border-[#8B1E27]/40 hover:text-[#8B1E27] shrink-0 active:scale-[0.98] transition-all"
            >
              <RotateCcw size={13} className={resetting ? "animate-spin" : ""} />
              <span>{resetting ? "Resetting…" : "Reset Session Demo"}</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between">
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="font-mono text-xs gap-1.5 rounded-full px-5 bg-[#8B1E27] text-white hover:bg-[#8B1E27]/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            {saved ? (
              <>
                <Check size={13} className="text-white" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <span>Save Workspace Configuration</span>
            )}
          </Button>

          <Button asChild variant="ghost" size="sm" className="font-mono text-xs text-accent-brand dark:text-accent-readable rounded-full px-3">
            <Link href="/dashboard" className="gap-1.5">
              <span>Back to Dashboard</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
