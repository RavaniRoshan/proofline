import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  ArrowRight,
  Code,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Cpu,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetBadge } from "@/components/ui/web3-dashboard/components/web3/asset-badge";

export const metadata: Metadata = { title: "About" };

const REPO = "https://github.com/RavaniRoshan/proofline";
const ROUND1_PDF =
  "https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [05] ARCHITECTURAL SPECIFICATION &amp; THESIS
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            System Invariants &amp; Verification Model
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-balance text-foreground">
          What Proofline is.
        </h1>
        <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          Proofline checks marketing, pricing, and product draft copy against an owner-approved, versioned register of ground-truth facts. It returns one of six deterministic verdicts per candidate assertion — complete with source document title, exact character span, fact version, and active validity window.
        </p>
      </div>

      {/* =========================================================================
          1. TOP ENTERPRISE STATUS RIBBON
          ========================================================================= */}
      <Card className="p-3.5 sm:p-4 shadow-xs border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
              <span className="font-semibold text-foreground">Specification:</span>
              <span className="rounded-full bg-v-supported-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-v-supported-fg border border-v-supported-border">
                Proofline Architecture v1.0
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-muted-foreground">Standard:</span>
              <span className="font-mono text-foreground">RFC-Deterministic Claim Governance</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-muted-foreground">Verification Engine:</span>
              <span className="font-mono text-foreground">Stage 1–4 AST + Bounded Lexical</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Test Coverage:</span>
              <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                111 Vitest Specs Passing
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-7 gap-1 font-mono text-xs text-foreground">
              <a href={REPO} target="_blank" rel="noreferrer">
                <Code size={12} />
                <span>GitHub Repo</span>
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          2. ARCHITECTURE TELEMETRY STAT CARDS (4 Tone-Badged High-Density Cards)
          ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Deterministic Share */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fast-Path Coverage
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#8B1E27]/10 text-[#8B1E27] dark:text-[#D4847A]">
              <Zap size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              78%
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              0ms Model Latency
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Prices, quotas &amp; dates evaluated purely in code
          </p>
        </Card>

        {/* Card 2: Bounded Context Budget */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bounded Context
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              ≤ 5
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Candidate facts
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Strict lexical retrieval eliminates hallucination space
          </p>
        </Card>

        {/* Card 3: Evidence Gate Invariant */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Evidence Gate
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-[#1F5C43]/10 text-[#1F5C43]">
              <ShieldCheck size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              6-Field
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Invariant Proof
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            All 6 provenance fields mandatory for contradictions
          </p>
        </Card>

        {/* Card 4: Local Storage Privacy */}
        <Card className="p-4 sm:p-5 shadow-xs border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Storage Boundary
            </span>
            <span className="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Cpu size={15} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              100%
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Local Browser
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Zero server-side persistence or confidential data leaks
          </p>
        </Card>
      </section>

      {/* =========================================================================
          3. CORE SYSTEM INVARIANTS (Web3 Asset Cards)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Core System Invariants (LAW.md Specification)
          </h2>
          <Badge variant="outline" className="font-mono text-[10px]">
            4 Invariants Enforced
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invariant 1 */}
          <Card className="p-5 shadow-xs border border-border bg-card hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3">
              <AssetBadge symbol="1" color="bg-[#8B1E27]" size="sm" />
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-[#8B1E27] dark:text-[#D4847A]" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Deterministic Fast-Path (78%)
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Pricing numbers, dates, scalar quotas, currency symbols, and disclaimers resolve deterministically in TypeScript AST rules with 0ms model latency. An LLM is never invoked for arithmetic or exact-match lookups.
            </p>
          </Card>

          {/* Invariant 2 */}
          <Card className="p-5 shadow-xs border border-border bg-card hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3">
              <AssetBadge symbol="2" color="bg-amber-600" size="sm" />
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-amber-500" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Bounded Candidate Generation
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              When an LLM is consulted, it receives at most five candidate facts and can only return fact IDs and entailment relations. It never outputs hallucinated citations, spans, or synthetic dates.
            </p>
          </Card>

          {/* Invariant 3 */}
          <Card className="p-5 shadow-xs border border-border bg-card hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3">
              <AssetBadge symbol="3" color="bg-[#1F5C43]" size="sm" />
              <div className="flex items-center gap-2">
                <Search size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Character-Exact Span Fidelity
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Every citation references a verifiable byte offset into an actual registered source document. Synthetic or imagined source text is strictly rejected by the pipeline runtime invariant.
            </p>
          </Card>

          {/* Invariant 4 */}
          <Card className="p-5 shadow-xs border border-border bg-card hover:border-foreground/30 transition-colors">
            <div className="flex items-center gap-3">
              <AssetBadge symbol="4" color="bg-purple-600" size="sm" />
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-purple-500" />
                <span className="font-mono text-xs font-bold text-foreground">
                  Honest Refusal &amp; Evidence Gate
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              When the register does not contain an approved answer, the finding is marked UNVERIFIED. A CONTRADICTED verdict cannot be emitted without all 6 provenance fields validated.
            </p>
          </Card>
        </div>
      </div>

      {/* =========================================================================
          4. ACTION BUTTONS & SPEC PDF
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          asChild
          className="btn-proofline-tactile h-9 gap-2 font-mono text-xs bg-[#8B1E27] text-white hover:bg-[#8B1E27]/90 active:scale-[0.98]"
        >
          <Link href="/check">
            <ShieldCheck size={14} />
            <span>Check a Draft</span>
            <ArrowRight size={13} />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          data-testid="round1-pdf"
          className="btn-proofline-tactile h-9 gap-2 font-mono text-xs text-foreground active:scale-[0.98]"
        >
          <a href={ROUND1_PDF} target="_blank" rel="noreferrer">
            <FileText size={14} className="text-[#8B1E27] dark:text-[#D4847A]" />
            <span>Round 1 Plan &amp; PDF</span>
            <ExternalLink size={12} className="text-muted-foreground" />
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="btn-proofline-tactile h-9 gap-2 font-mono text-xs text-foreground active:scale-[0.98]"
        >
          <a href={REPO} target="_blank" rel="noreferrer">
            <Code size={14} />
            <span>GitHub Repository</span>
          </a>
        </Button>
      </div>

      {/* =========================================================================
          5. DELIBERATE SCOPE BOUNDARIES & TEST PROVENANCE
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scope Boundaries */}
        <Card className="p-5 sm:p-6 shadow-xs border border-border bg-muted/20">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Deliberate Scope Boundaries
          </h2>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#8B1E27] dark:text-[#D4847A] font-bold">✕</span>
              <span>No file upload, OCR, or visual screenshot parsing — plain text only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#8B1E27] dark:text-[#D4847A] font-bold">✕</span>
              <span>No open-web browsing — only the owner-approved register is trusted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#8B1E27] dark:text-[#D4847A] font-bold">✕</span>
              <span>No multi-tenant accounts, auth gates, or auto-publishing pipelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[#8B1E27] dark:text-[#D4847A] font-bold">✕</span>
              <span>All demonstration facts belong to a fictional brand (Flowdesk).</span>
            </li>
          </ul>
        </Card>

        {/* Provenance & Test Suite */}
        <Card className="p-5 sm:p-6 shadow-xs border border-border bg-card">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Test Suite &amp; Source Provenance
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Built completely in the open on GitHub. Every fact in the register is versioned and seeded with deliberate stale and conflicting cases to exercise all verification paths. The suite includes 111 Vitest unit tests, 24 benchmark smoke evaluation cases, and comprehensive prefers-reduced-motion accessibility coverage.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#1F5C43] animate-pulse" />
            <span className="font-mono text-xs font-semibold text-foreground">111 / 111 Passing in CI</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
