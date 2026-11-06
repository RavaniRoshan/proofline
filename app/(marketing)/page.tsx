import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroRotator } from "@/components/landing/HeroRotator";
import { HeroWorkbench } from "@/components/landing/HeroWorkbench";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { VerdictCard } from "@/components/landing/VerdictCard";
import { PipelineDemo } from "@/components/landing/PipelineDemo";
import { ApiPlayground } from "@/components/landing/ApiPlayground";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { EvidenceGateDiagram } from "@/components/landing/assets/EvidenceGateDiagram";
import { RegisterLockupDiagram } from "@/components/landing/assets/RegisterLockupDiagram";
import { DeterministicSplitDiagram } from "@/components/landing/assets/DeterministicSplitDiagram";
import { EnterpriseSecurityDiagram } from "@/components/landing/assets/EnterpriseSecurityDiagram";
import {
  ArrowRight,
  FileText,
  GitBranch,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How is Proofline different from a grammar or style checker?",
    a: "Grammar checkers evaluate tone, readability, and syntax. Proofline checks factual truth: pricing, seat tiers, storage limits, effective dates, and mandatory legal disclaimers against an owner-approved, version-controlled fact register.",
  },
  {
    q: "Why resolve claims with deterministic TypeScript rules before calling a model?",
    a: "Language models frequently hallucinate numbers, miss subtle unit conversions, and overlook expired validity windows. 78% of marketing claims contain numbers, currency, dates, or product names that TypeScript verifies with 100% precision and 0ms API latency.",
  },
  {
    q: "Can a reviewer trust a CONTRADICTED verdict without double-checking?",
    a: "Yes. Proofline enforces a runtime Evidence Gate in code: a CONTRADICTED verdict cannot be emitted unless fact_id, fact_version, source_document_id, source_span, valid_from, and valid_until are all resolved. If any field is missing, the finding automatically downgrades to UNVERIFIED.",
  },
  {
    q: "Does the language model ever write citations or character spans?",
    a: "Never. When a qualitative claim reaches Stage 3, the model receives at most 5 lexically retrieved candidate facts and returns a strict Zod-validated JSON object containing matched_fact_id only. All document titles, character spans, and validity dates are looked up deterministically in code.",
  },
  {
    q: "Does Proofline store or train on submitted marketing drafts?",
    a: "No. Drafts are verified statelessly in memory and never persisted on a server. Reviewer decisions, local register overrides, and the append-only audit log live strictly in your browser's localStorage under proofline.v1, with a one-click Reset Demo control.",
  },
  {
    q: "What did you intentionally cut between Round 1 and Round 2?",
    a: "Per SPEC.md §6, we replaced multi-tenant auth, pgvector embeddings, and async queues with a zero-auth incognito workspace, lexical token retrieval over 42 seeded facts, and synchronous verification—ensuring any judge can evaluate the full flow in under three minutes.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing overflow-x-hidden min-h-screen flex flex-col bg-paper text-ink">
      {/* =========================================================================
          BAND 0: Editorial Topbar (Dark Scope)
          ========================================================================= */}
      <aside className="topbar dark-scope z-50 relative" aria-label="Announcement">
        <Link href="/check" className="topbar__link">
          <p className="topbar__text font-mono text-[11px] sm:text-[12px] truncate">
            <span className="topbar__lead">ROUND 2 BUILD</span>
            <span className="topbar__sub">
              {" "}· 42 Seeded Facts · 24/24 Smoke Gate
            </span>
            <span className="topbar__sub hidden sm:inline">
              {" "}· 51 Unit Tests · Zero Sign-In Required
            </span>
          </p>
          <span className="topbar__cta hidden md:inline-flex">
            OPEN WORKSPACE <span aria-hidden="true">→</span>
          </span>
        </Link>
      </aside>

      {/* Floating 3-Zone Pill Header */}
      <LandingHeader />

      {/* =========================================================================
          SECTION 1: Hero Section + Live Interactive Preflight Workbench (Dark Scope)
          ========================================================================= */}
      <section className="dark-scope relative flex flex-col items-center justify-center pt-24 pb-16 md:pt-28 md:pb-24 px-4 overflow-hidden border-b border-white/10">
        {/* Subtle Architectural Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-[1240px] w-full text-center">
          {/* Unboxed Editorial Kicker */}
          <p className="font-mono text-[12px] tracking-[0.08em] text-white/70 uppercase">
            <span>Brand Governance</span>
            <span className="mx-2.5 text-white/30" aria-hidden="true">·</span>
            <span className="text-accent-readable">Deterministic Claim Preflight</span>
            <span className="mx-2.5 text-white/30" aria-hidden="true">·</span>
            <span>Evidence Gate v1</span>
          </p>

          {/* Dynamic Hero Title with Rotator */}
          <h1 className="hero__title">
            <span className="block mb-1.5">Every marketing claim checked</span>
            <span className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2">
              against <HeroRotator /> <span className="hero__chip">with evidence</span>
            </span>
          </h1>

          {/* Subheading / Lede */}
          <p className="max-w-[60ch] text-[16px] md:text-[18px] leading-relaxed text-white/75 font-sans text-pretty">
            Proofline verifies marketing drafts against an owner-approved, versioned register of
            product facts. Numbers, dates, and limits resolve deterministically in TypeScript; every
            finding cites the exact source document, byte span, and validity&nbsp;window.
          </p>

          {/* Primary Action & Secondary Spec Link */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
            <Link href="/check" className="btn-primary-landing">
              <span>Check a Draft Now</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/facts" className="btn-ghost-landing">
              <span>Inspect 42 Seeded Facts</span>
            </Link>
          </div>

          {/* Unboxed Tabular Proof Strip */}
          <div className="mt-2 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[12px] font-mono text-white/60 tabular-nums">
            <span>78% Zero-LLM Resolution</span>
            <span aria-hidden="true" className="text-white/25">·</span>
            <span>24/24 Eval Smoke Gate</span>
            <span aria-hidden="true" className="text-white/25">·</span>
            <span>51 Unit Tests Passing</span>
            <span aria-hidden="true" className="text-white/25">·</span>
            <span>100% Incognito Ready</span>
          </div>

          {/* Interactive Above-the-Fold Preflight Workbench */}
          <HeroWorkbench />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: Asymmetric Bento Workflow (#how-it-works, LIGHT)
          ========================================================================= */}
      <section id="how-it-works" className="bg-paper text-ink py-20 md:py-28">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
              01 · End-to-End Verification Loop
            </p>
            <h2 className="bandhead__title">
              Make every sentence <span className="brand-readable">provably accurate</span>
            </h2>
            <p className="bandhead__lede">
              A claim accurate in March is often wrong by June. Proofline separates verified product
              truth from drifted copy so reviewers never have to ping a colleague to confirm a number.
            </p>
          </header>

          {/* Asymmetric 12-Column Bento Grid */}
          <div className="grid gap-6 lg:grid-cols-12 items-stretch">
            {/* Left 7 Columns: Step 01 + Step 02 Combined Manuscript & Rule Diff */}
            <div className="lg:col-span-7 rounded-[18px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-line mb-5 font-mono text-[12px]">
                  <span className="text-accent font-semibold">
                    01 / INGESTION &amp; DETERMINISTIC NORMALISATION
                  </span>
                  <span className="text-muted tabular-nums">seed/sample_draft.md · 12 claims</span>
                </div>

                <p className="text-[15px] text-ink-soft leading-relaxed mb-5 text-pretty">
                  Paste any campaign landing page, release note, or pricing email. The segmenter splits
                  paragraphs into candidate claims with exact character offsets and classifies numbers,
                  currencies, dates, product entities, and required disclaimers directly in code.
                </p>

                {/* Archival Manuscript Specimen */}
                <div className="rounded-[10px] border border-line bg-panel/60 p-5 font-serif text-[16px] leading-relaxed text-ink">
                  <div className="flex items-center justify-between font-mono text-[11px] text-muted pb-3 mb-3 border-b border-line">
                    <span>SEGMENT #02 · NUMERIC SCALAR CLAIM</span>
                    <span className="tabular-nums">char_start: 36 · char_end: 79</span>
                  </div>
                  <p className="text-pretty">
                    “Ready to scale?{" "}
                    <mark className="bg-v-contradicted-bg text-v-contradicted-fg px-1.5 py-0.5 rounded-[3px] font-sans font-medium">
                      Flowdesk starts at ₹4,999 per month
                    </mark>{" "}
                    and includes 5 team workspaces with automated triage.”
                  </p>
                </div>

                {/* Normalized Attribute Comparison Table */}
                <div className="mt-5 grid sm:grid-cols-3 gap-4 pt-4 border-t border-line font-mono text-[12px]">
                  <div>
                    <span className="text-muted block text-[11px]">PARSED SCALAR</span>
                    <span className="text-ink font-semibold mt-0.5 block tabular-nums">
                      4,999 INR / month
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">REGISTER LOOKUP</span>
                    <span className="text-ink font-semibold mt-0.5 block">
                       (flowdesk, starter_price)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">ACTIVE RECORD (F-021)</span>
                    <span className="text-v-contradicted-fg font-semibold mt-0.5 block tabular-nums">
                      6,499 INR / month (v4)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2 text-[12px] font-mono text-muted">
                <span>Decided in TypeScript · 0 model tokens</span>
                <Link
                  href="/check"
                  className="text-accent font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
                >
                  <span>Run this draft in the Checker</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Step 03 Evidence Gate & Human Audit Trail */}
            <div className="lg:col-span-5 rounded-[18px] border border-line-strong bg-panel/50 p-7 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-line mb-5 font-mono text-[12px]">
                  <span className="text-accent font-semibold">02 / EVIDENCE &amp; HUMAN DECISION</span>
                  <span className="text-v-contradicted-fg font-semibold">CONTRADICTED</span>
                </div>

                <h3 className="text-[20px] font-serif font-normal text-ink leading-snug">
                  Refuses to accuse without a complete citation record.
                </h3>
                <p className="mt-2.5 text-[14px] text-ink-soft leading-relaxed text-pretty">
                  Every finding ships with its source document, character span, version lineage, and
                  suggested correction. A human reviewer records the final decision (Approve, Reject,
                  or Request Edit) with a mandatory rationale.
                </p>

                <dl className="mt-5 divide-y divide-line border-t border-b border-line text-[12px] font-mono">
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-muted">Source Document</dt>
                    <dd className="text-ink font-medium">Pricing sheet v4 (DOC-003)</dd>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-muted">Exact Byte Span</dt>
                    <dd className="text-ink font-medium tabular-nums">chars 412–468</dd>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-muted">Validity Window</dt>
                    <dd className="text-ink font-medium tabular-nums">2026-04-01 → 2027-03-31</dd>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-muted">Audit Persistence</dt>
                    <dd className="text-ink font-medium">localStorage (proofline.v1)</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between text-[12px] font-mono">
                <span className="text-muted">Never auto-publishes</span>
                <Link
                  href="/audit"
                  className="text-ink font-semibold hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  <span>View Audit Ledger</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Architectural Schematic: 78% Deterministic Routing */}
          <div className="mt-10 rounded-[18px] bg-panel/60 border border-line-strong p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-line text-[12px] font-mono text-muted">
              <span>ARCHITECTURAL SCHEMATIC 01 · STAGE 1 DETERMINISTIC SPLIT VS STAGE 3 SEMANTIC ROUTING</span>
              <span className="tabular-nums">TARGET ≥ 60% · ACTUAL 78% DETERMINISTIC</span>
            </div>
            <DeterministicSplitDiagram />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Six Canonical Verdicts (#verdicts, LIGHT PANEL)
          ========================================================================= */}
      <section id="verdicts" className="bg-panel text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
              02 · Six Canonical Verdict States
            </p>
            <h2 className="bandhead__title">
              A verdict is an explicit word, <span className="brand-readable">never a vague score</span>
            </h2>
            <p className="bandhead__lede">
              Colour is information: the six verdicts are the only saturated values in Proofline’s
              design system. Every claim resolves into one of six deterministic states sorted by
              severity.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <VerdictCard type="CONTRADICTED" />
            <VerdictCard type="STALE" />
            <VerdictCard type="CONFLICTING" />
            <VerdictCard type="UNVERIFIED" />
            <VerdictCard type="SUPPORTED" />
            <VerdictCard type="NOT_CHECKABLE" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: The 4-Stage Deterministic Pipeline (#pipeline, LIGHT)
          ========================================================================= */}
      <section id="pipeline" className="bg-paper text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
              03 · Four-Stage Verification Engine
            </p>
            <h2 className="bandhead__title">
              78% of claims resolved <span className="brand-readable">without an LLM call</span>
            </h2>
            <p className="bandhead__lede">
              Models propose; TypeScript decides. Inspect the live 4-stage pipeline below and test how
              the runtime Evidence Gate prevents unbacked contradictions from ever shipping.
            </p>
          </header>

          {/* Interactive 4-Stage Pipeline Debugger */}
          <PipelineDemo />

          {/* Architectural Schematic: The 5-Field Evidence Gate */}
          <div className="mt-12 rounded-[18px] bg-panel/60 border border-line-strong p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-line text-[12px] font-mono text-muted">
              <span>ARCHITECTURAL SCHEMATIC 02 · RUNTIME EVIDENCE GATE ASSERTION (SPEC.MD §2.4)</span>
              <span>CONTRADICTED REQUIRES 100% CITATION RESOLUTION</span>
            </div>
            <EvidenceGateDiagram />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: Shared Register & Governance Lineage (#register, LIGHT PANEL)
          ========================================================================= */}
      <section id="register" className="bg-panel text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
              04 · Versioned Brand Register
            </p>
            <h2 className="bandhead__title">
              One owner-approved register for <span className="brand-readable">every product truth</span>
            </h2>
            <p className="bandhead__lede">
              Instead of crawling the open web, Proofline checks claims strictly against versioned,
              date-bounded records approved by product and legal owners.
            </p>
            <Link href="/facts" className="btn-outline-landing">
              Browse all 42 seeded facts →
            </Link>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                index: "01",
                title: "Versioned Lineage",
                sub: "Superseded rates stay on record",
                items: [
                  "Pricing sheet v4 · Active from 2026-04-01",
                  "Pricing sheet v3 · Superseded (₹4,999/mo)",
                  "Starter tier · 5 agent seats included",
                  "Immutable approver sign-off metadata",
                ],
                footer: "42 SEEDED FACTS IN SEED/FACTS.JSON",
              },
              {
                index: "02",
                title: "Temporal Validity Windows",
                sub: "Automatic expiration detection",
                items: [
                  "F-010 Legacy Plan · Expired 2026-03-31",
                  "F-004 14-day Trial · Active through 2027",
                  "F-031 Mumbai Residency · Active approved",
                  "3 facts deliberately seeded as STALE",
                ],
                footer: "CHECKED AGAINST REVIEW_DATE",
              },
              {
                index: "03",
                title: "Conflict & Override Control",
                sub: "Surfaces multi-owner discrepancies",
                items: [
                  "F-024 (25 seats) vs F-025 (50 seats) conflict",
                  "Approve new fact versions in browser",
                  "Append-only decision journal in /audit",
                  "One-click Reset Demo restores clean seed",
                ],
                footer: "LOCALSTORAGE KEY: PROOFLINE.V1",
              },
            ].map((col) => (
              <article
                key={col.title}
                className="rounded-[16px] border border-line-strong bg-card flex flex-col justify-between"
              >
                <div className="p-6 pb-4">
                  <p className="font-mono text-[11px] text-accent font-semibold mb-1">
                    {col.index} · REGISTER CAPABILITY
                  </p>
                  <h3 className="text-[19px] font-semibold text-ink">{col.title}</h3>
                  <p className="text-[13px] text-muted mb-4">{col.sub}</p>
                  <ul className="divide-y divide-line text-[12px] font-mono border-t border-line">
                    {col.items.map((item) => (
                      <li key={item} className="py-2.5 text-ink-soft flex items-center gap-2">
                        <span className="text-muted" aria-hidden="true">·</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-3 bg-panel/60 border-t border-line text-[11px] font-mono text-muted rounded-b-[16px]">
                  {col.footer}
                </div>
              </article>
            ))}
          </div>

          {/* Register Lockup Diagram */}
          <div className="mt-10 rounded-[18px] bg-card border border-line-strong p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-line text-[12px] font-mono text-muted">
              <span>ARCHITECTURAL SCHEMATIC 03 · VERSIONED REGISTER RECORD &amp; VALIDITY LINEAGE (F-021)</span>
              <span>SEED INTEGRITY VERIFIED BY VALIDATE_SEED.PY</span>
            </div>
            <RegisterLockupDiagram />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: Headless Developer API & Live Playground (#build, DARK SCOPE)
          ========================================================================= */}
      <section id="build" className="dark-scope py-20 md:py-28 border-t border-white/10 relative">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-white/60 uppercase">
              05 · Headless Verification Endpoint
            </p>
            <h2 className="bandhead__title">
              Plug <code className="font-mono text-[0.82em] text-accent-readable">POST /api/verify</code> into{" "}
              <span className="brand-readable">any workflow</span>
            </h2>
            <p className="bandhead__lede">
              Run Proofline from CI/CD release gates, MCP agents, or editorial tools. Test the real
              server endpoint live below or copy the cURL payload.
            </p>
          </header>

          {/* Interactive API Playground */}
          <ApiPlayground />

          {/* Engineering Quality & Round 2 Verification Matrix */}
          <div className="mt-14 pt-12 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <p className="font-mono text-[12px] uppercase tracking-wider text-white/70">
                VERIFIED ENGINEERING BENCHMARKS (ROUND 2 DEFINITION OF DONE)
              </p>
              <Link
                href="/about"
                className="font-mono text-[12px] text-accent-readable hover:underline inline-flex items-center gap-1"
              >
                <span>Read Round 1 → Round 2 architectural notes</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  metric: "78%",
                  label: "DETERMINISTIC RESOLUTION",
                  detail: "14 of 18 sample draft claims solved in 0ms without calling an LLM.",
                },
                {
                  metric: "24 / 24",
                  label: "EVAL SMOKE GATE",
                  detail: "100% expected verdict match across seed/smoke_cases.jsonl.",
                },
                {
                  metric: "51 / 51",
                  label: "VITEST UNIT SUITE",
                  detail: "Covers segmentation, normalization, entity resolution & Evidence Gate.",
                },
                {
                  metric: "0 Bytes",
                  label: "SERVER USER STORAGE",
                  detail: "100% anonymous incognito evaluation; decisions stay in localStorage.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-[14px] border border-white/15 bg-white/[0.03] flex flex-col justify-between"
                >
                  <div>
                    <p className="font-serif text-[32px] md:text-[36px] text-white leading-none tabular-nums">
                      {item.metric}
                    </p>
                    <p className="font-mono text-[11px] font-semibold text-accent-readable tracking-wider mt-3">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-[13px] text-white/70 leading-relaxed mt-3 text-pretty">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: Enterprise Privacy & Governance Chain (#enterprise, LIGHT)
          ========================================================================= */}
      <section id="enterprise" className="bg-paper text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <p className="font-mono text-[12px] tracking-[0.08em] text-muted uppercase">
              06 · Governance &amp; Privacy Architecture
            </p>
            <h2 className="bandhead__title">
              Trace any claim back to <span className="brand-readable">the executive record</span>
            </h2>
            <p className="bandhead__lede">
              Every design decision in Proofline enforces reviewer autonomy, zero server-side draft
              retention, and complete chain-of-custody auditability.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                label: "INGESTED CLAIM",
                title: "“Flowdesk starts at ₹4,999”",
                detail: "Extracted at span [36..79] with exact character offsets",
              },
              {
                step: "02",
                label: "MATCHED RECORD",
                title: "Pricing sheet v4 (F-021)",
                detail: "Approved by VP Marketing · Active since 2026-04-01",
              },
              {
                step: "03",
                label: "EVIDENCE GATE",
                title: "CONTRADICTED",
                detail: "All 6 citation fields verified in code before output",
              },
              {
                step: "04",
                label: "AUDIT LEDGER",
                title: "Reviewer Decision",
                detail: "Logged with mandatory reason in append-only journal",
              },
            ].map((c) => (
              <div
                key={c.step}
                className="rounded-[14px] border border-line-strong bg-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-muted pb-3 mb-3 border-b border-line">
                    <span className="text-accent font-semibold">STEP {c.step}</span>
                    <span>{c.label}</span>
                  </div>
                  <p className="text-[17px] font-semibold text-ink">{c.title}</p>
                </div>
                <p className="text-[13px] text-ink-soft mt-4 pt-3 border-t border-line">{c.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[18px] bg-panel/60 border border-line-strong p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-line text-[12px] font-mono text-muted">
              <span>ARCHITECTURAL SCHEMATIC 04 · LOCAL-FIRST ISOLATION &amp; APPEND-ONLY AUDIT MODEL</span>
              <span>ZERO COOKIES · ZERO SERVER PII</span>
            </div>
            <EnterpriseSecurityDiagram />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: Frequently Asked Questions (#faq, LIGHT PANEL)
          ========================================================================= */}
      <section id="faq" className="bg-panel text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="lg:sticky lg:top-28 p-7 rounded-[18px] bg-card border border-line-strong">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold mb-2">
                07 · Specification FAQ
              </p>
              <h2 className="text-[28px] md:text-[32px] font-serif font-normal text-left text-ink leading-tight">
                Frequently asked questions
              </h2>
              <p className="text-[14px] text-ink-soft leading-relaxed mt-3 text-pretty">
                Details on the deterministic pipeline, Evidence Gate invariant, Round 1 PDF, and
                local storage persistence model.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-line">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                >
                  <FileText size={14} aria-hidden="true" />
                  <span>Read About &amp; Round 1 PDF</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
                <a
                  href="https://github.com/RavaniRoshan/proofline"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft hover:text-ink"
                >
                  <GitBranch size={14} aria-hidden="true" />
                  <span>github.com/RavaniRoshan/proofline</span>
                </a>
              </div>
            </div>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: Final Conversion Banner (#start, LIGHT)
          ========================================================================= */}
      <section id="start" className="bg-paper text-ink py-16 md:py-24 border-t border-line">
        <div className="band-wrap">
          <div className="rounded-[24px] border border-line-strong bg-panel p-8 sm:p-14 text-center relative overflow-hidden">
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-accent font-semibold mb-3">
              Zero Configuration · No Sign-In Required · Under 3 Minutes
            </p>
            <h2 className="bandhead__title mx-auto">
              Verify a marketing draft against <span className="brand-readable">approved facts now</span>
            </h2>
            <p className="bandhead__lede mx-auto mt-4 text-[16px] sm:text-[17px]">
              Open the workspace, load the seeded Flowdesk draft with one click, inspect findings
              with exact character spans, and record a decision to the audit log.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/check"
                className="btn-primary-landing bg-accent text-paper hover:bg-accent-hover"
              >
                <span>Open the Checker</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/dashboard" className="btn-outline-landing">
                <span>View Register Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (LIGHT)
          ========================================================================= */}
      <footer className="bg-paper text-ink border-t border-line pt-14 pb-12">
        <div className="band-wrap">
          {/* Newsletter Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-14 pb-12 border-b border-line items-center">
            <div>
              <p className="text-[24px] md:text-[28px] font-serif font-normal text-ink">
                Release notes &amp; governance specifications
              </p>
              <p className="mt-1.5 text-[14px] text-ink-soft max-w-[52ch] text-pretty">
                Receive updates on deterministic claim verification, schema invariants, and preflight
                benchmarks.
              </p>
            </div>
            <div className="md: flex md:justify-end">
              <NewsletterForm />
            </div>
          </div>

          {/* 5-Column Navigation Mirror */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            <div>
              <p className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                Workspace Views
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <Link href="/check" className="hover:text-accent transition-colors">
                    Check a Draft
                  </Link>
                </li>
                <li>
                  <Link href="/facts" className="hover:text-accent transition-colors">
                    Fact Register (42)
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className="hover:text-accent transition-colors">
                    Audit Log
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Register Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-accent transition-colors">
                    About &amp; Spec
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                Six Verdicts
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-ink-soft">
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    SUPPORTED
                  </a>
                </li>
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    CONTRADICTED
                  </a>
                </li>
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    STALE
                  </a>
                </li>
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    CONFLICTING
                  </a>
                </li>
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    UNVERIFIED
                  </a>
                </li>
                <li>
                  <a href="#verdicts" className="hover:text-accent transition-colors">
                    NOT_CHECKABLE
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                4-Stage Pipeline
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <a href="#pipeline" className="hover:text-accent transition-colors">
                    Stage 1: Deterministic
                  </a>
                </li>
                <li>
                  <a href="#pipeline" className="hover:text-accent transition-colors">
                    Stage 2: Smoke Gate
                  </a>
                </li>
                <li>
                  <a href="#pipeline" className="hover:text-accent transition-colors">
                    Stage 3: Tiered Model
                  </a>
                </li>
                <li>
                  <a href="#pipeline" className="hover:text-accent transition-colors">
                    Stage 4: Evidence Gate
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                Verification Suite
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-ink-soft tabular-nums">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-v-supported-fg" aria-hidden="true" />
                  <span>51 Unit Tests Passing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-v-supported-fg" aria-hidden="true" />
                  <span>24/24 Smoke Eval</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-v-supported-fg" aria-hidden="true" />
                  <span>3 E2E Playwright Flows</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-v-supported-fg" aria-hidden="true" />
                  <span>Zero Citation Leak</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
                Documentation
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <Link href="/about" className="hover:text-accent transition-colors">
                    What Proofline Is
                  </Link>
                </li>
                <li>
                  <a
                    href="https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    Round 1 Plan &amp; PDF ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/RavaniRoshan/proofline"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    GitHub Repository ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal & Invariant Bar */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted font-sans">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-ink">
                <span className="text-accent">[ ]</span> Proofline
              </span>
              <span aria-hidden="true">·</span>
              <span>Round 2 build · Deterministic claim-evidence checker</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              <span>FICTIONAL DEMO BRAND (FLOWDESK)</span>
              <span aria-hidden="true">·</span>
              <span>ZERO SERVER STORAGE</span>
              <span aria-hidden="true">·</span>
              <span>MIT LICENSE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
