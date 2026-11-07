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
} from "lucide-react";

export const metadata: Metadata = { title: "About" };

const REPO = "https://github.com/RavaniRoshan/proofline";
const ROUND1_PDF =
  "https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing";

export default function AboutPage() {
  return (
    <div className="max-w-4xl space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-brand dark:text-accent-readable">
            [05] ARCHITECTURAL SPECIFICATION &amp; THESIS
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="font-mono text-xs text-muted-foreground">
            System Invariants &amp; Verification Model
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-balance text-foreground">
          What Proofline is.
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground text-pretty max-w-3xl">
          Proofline checks marketing, pricing, and product draft copy against an owner-approved, versioned register of ground-truth facts. It returns one of six deterministic verdicts per candidate assertion — complete with source document title, exact character span, fact version, and active validity window.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={ROUND1_PDF}
          target="_blank"
          rel="noreferrer"
          data-testid="round1-pdf"
          className="btn-proofline-tactile inline-flex h-10 items-center gap-2 rounded-md border border-border bg-panel px-4 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:border-accent-brand dark:hover:border-accent-readable active:scale-[0.97]"
        >
          <FileText size={16} aria-hidden="true" className="text-accent-brand dark:text-accent-readable" />
          Round 1 Plan &amp; PDF
          <ExternalLink size={13} className="text-muted-foreground" />
        </a>
        <Link
          href="/check"
          className="btn-proofline-tactile inline-flex h-10 items-center gap-2 rounded-md bg-accent-brand dark:bg-accent-readable px-4 text-xs sm:text-sm font-semibold text-white dark:text-background transition-colors hover:opacity-90 active:scale-[0.97]"
        >
          <ShieldCheck size={16} aria-hidden="true" />
          Check a Draft
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="btn-proofline-tactile inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
        >
          <Code size={16} aria-hidden="true" />
          GitHub Repository
        </a>
      </div>

      {/* Invariants Grid */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Core System Invariants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Zap size={16} className="text-accent-brand dark:text-accent-readable" />
              <span>1. Deterministic Rule Resolution (78%)</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pricing numbers, dates, scalar quotas, currency symbols, and disclaimers resolve deterministically in code with 0ms model latency. An LLM is never invoked for arithmetic or exact-match lookups.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lock size={16} className="text-slate" />
              <span>2. Bounded Candidate Generation</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              When an LLM is consulted, it receives at most five candidate facts and can only return fact IDs and entailment relations. It never outputs hallucinated citations, spans, or dates.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Search size={16} className="text-v-supported-fg" />
              <span>3. Character-Exact Span Fidelity</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Every citation references a verifiable byte offset into an actual registered source document. Synthetic or imagined source text is strictly rejected by the pipeline.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle size={16} className="text-v-stale-fg" />
              <span>4. Honest Refusal &amp; Evidence Gate</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              When the register does not contain an approved answer, the finding is marked UNVERIFIED. A CONTRADICTED verdict cannot be emitted without all 6 provenance fields validated.
            </p>
          </div>
        </div>
      </div>

      {/* Scope Boundaries */}
      <section className="rounded-xl border border-border bg-panel/40 p-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What This Does Not Do (Deliberate Scope Boundaries)
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground list-disc pl-4">
          <li>No file upload, OCR, or visual screenshot parsing — plain text only.</li>
          <li>No open-web browsing — only the owner-approved register is trusted.</li>
          <li>No multi-tenant accounts, auth gates, or auto-publishing pipelines.</li>
          <li>All demonstration facts belong to a fictional brand (Flowdesk).</li>
        </ul>
      </section>

      {/* Provenance & Seed Data */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source Code &amp; Test Provenance
        </h2>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          Built completely in the open on GitHub. Every fact in the register is versioned and seeded with deliberate stale and conflicting cases to exercise all verification paths. The suite includes 111 Vitest unit tests, 24 benchmark smoke evaluation cases, and comprehensive prefers-reduced-motion accessibility coverage.
        </p>
      </section>
    </div>
  );
}
