import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroRotator } from "@/components/landing/HeroRotator";
import { LogoLoop } from "@/components/landing/LogoLoop";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { VerdictCard } from "@/components/landing/VerdictCard";
import { PipelineDemo } from "@/components/landing/PipelineDemo";
import { NewsletterForm } from "@/components/landing/NewsletterForm";
import { EvidenceGateDiagram } from "@/components/landing/assets/EvidenceGateDiagram";
import { RegisterLockupDiagram } from "@/components/landing/assets/RegisterLockupDiagram";
import { DeterministicSplitDiagram } from "@/components/landing/assets/DeterministicSplitDiagram";
import { EnterpriseSecurityDiagram } from "@/components/landing/assets/EnterpriseSecurityDiagram";
import {
  ShieldCheck,
  FileText,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  GitBranch,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How is Proofline different from a grammar or spell checker?",
    a: "Grammar checkers assess tone, readability, and syntax. Proofline checks truth: pricing, seat tiers, storage limits, effective dates, and mandatory legal disclaimers against an owner-approved, version-controlled fact register.",
  },
  {
    q: "Why use deterministic rules instead of asking an LLM directly?",
    a: "LLMs frequently suffer from number hallucination, subtle math errors, and temporal confusion (e.g. failing to notice an expiration date). 78% of marketing claims contain numbers, currency, dates, or product names that TypeScript can verify with 100% precision and zero API latency.",
  },
  {
    q: "Can I trust a CONTRADICTED verdict?",
    a: "Yes. Proofline enforces an architectural Evidence Gate: a CONTRADICTED verdict cannot be issued unless the system resolves an exact fact ID, fact version, source document, character span, and active validity window. If any of these fields are missing, it safely downgrades to UNVERIFIED.",
  },
  {
    q: "Does Proofline store or train on my drafts?",
    a: "No. Proofline operates under strict privacy invariants: drafts are verified on-demand in memory and never stored on a server. Decisions, local register modifications, and audit logs reside strictly in your browser's localStorage.",
  },
  {
    q: "What assistants and AI tools does Proofline work with?",
    a: "Proofline exposes a single REST endpoint (POST /api/verify) that can be plugged into any MCP client, custom agent, Claude workflow, ChatGPT action, or CI/CD pre-publish check. No specialized plugin is required.",
  },
  {
    q: "What does Proofline deliberately NOT do?",
    a: "As defined in SPEC.md: Proofline does not do file uploads (PDF/DOCX), OCR, visual/color grading, or open-web crawling. It stays strictly focused on verifying claims against your private, authenticated brand register.",
  },
];

const VERDICT_PILLS = [
  { name: "SUPPORTED", color: "bg-v-supported-bg text-v-supported-fg border-v-supported-fg/20" },
  { name: "CONTRADICTED", color: "bg-v-contradicted-bg text-v-contradicted-fg border-v-contradicted-fg/20" },
  { name: "STALE", color: "bg-v-stale-bg text-v-stale-fg border-v-stale-fg/20" },
  { name: "CONFLICTING", color: "bg-v-conflicting-bg text-v-conflicting-fg border-v-conflicting-fg/20" },
  { name: "UNVERIFIED", color: "bg-v-unverified-bg text-v-unverified-fg border-v-unverified-fg/20" },
  { name: "NOT_CHECKABLE", color: "bg-v-notcheckable-bg text-v-notcheckable-fg border-v-notcheckable-fg/20" },
];

const SPEC_HIGHLIGHTS = [
  "42 APPROVED FACTS",
  "78% DETERMINISTIC RESOLUTION",
  "51 UNIT TESTS PASSING",
  "24/24 EVAL SMOKE GATE",
  "3 E2E PLAYWRIGHT FLOWS",
  "POST /API/VERIFY",
  "LOCALSTORAGE PERSISTENCE",
  "ZERO SERVER USER DATA",
];

export default function LandingPage() {
  return (
    <div className="landing overflow-x-hidden min-h-screen flex flex-col bg-paper text-ink">
      {/* =========================================================================
          BAND 0: Announcement Topbar (Dark Scope)
          ========================================================================= */}
      <aside className="topbar dark-scope z-50 relative" aria-label="Announcement">
        <Link href="/check" className="topbar__link">
          <p className="topbar__text">
            <span className="topbar__badge text-[11px]">NEW</span>
            <span className="topbar__lead">Evidence Gate Invariant</span>
            <span className="topbar__sub hidden sm:inline">
              {" "}· Every CONTRADICTED verdict ships with proof, or refuses to judge.
            </span>
          </p>
          <span className="topbar__cta hidden md:inline-flex">
            OPEN CHECKER <span aria-hidden="true">→</span>
          </span>
        </Link>
      </aside>

      {/* Floating Pill Header */}
      <LandingHeader />

      {/* =========================================================================
          BAND 1: Hero Section (Dark Scope)
          ========================================================================= */}
      <section className="dark-scope relative flex flex-col items-center justify-center pt-28 pb-20 md:pt-36 md:pb-28 px-4 overflow-hidden border-b border-white/10">
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-[1240px] w-full text-center">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[12px] font-mono tracking-wider text-white/80">
            <ShieldCheck size={14} className="text-accent-readable" aria-hidden="true" />
            <span>BRAND GOVERNANCE · DETERMINISTIC CLAIM AUDIT</span>
          </div>

          {/* Dynamic Hero Title with Rotator and Highlight Chip */}
          <h1 className="hero__title">
            <span className="block mb-2">Every marketing claim checked</span>
            <span className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2">
              against <HeroRotator /> <span className="hero__chip">with evidence</span>
            </span>
          </h1>

          {/* Subheading / Lede */}
          <p className="max-w-[54ch] text-[16px] md:text-[18px] leading-relaxed text-white/80 font-sans text-pretty">
            Proofline checks drafts against an owner-approved, versioned register of product facts.
            Deterministic TypeScript rules resolve numbers, dates, and limits with zero model cost;
            every finding cites the exact source document, version, and validity&nbsp;window.
          </p>

          {/* Primary CTAs with Zero-Jank Grid Stabilization */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link href="/check" className="btn-primary-landing">
              OPEN THE CHECKER
              <ArrowRight size={15} className="ml-1.5 inline" aria-hidden="true" />
            </Link>
            <Link href="/about" className="btn-ghost-landing inline-grid">
              <span aria-hidden="true" className="invisible col-start-1 row-start-1 flex items-center justify-center gap-2 whitespace-nowrap">
                READ THE SPECIFICATION <span className="w-2"></span>
              </span>
              <span className="col-start-1 row-start-1 flex items-center justify-center gap-2 whitespace-nowrap">
                READ THE SPEC
              </span>
            </Link>
          </div>

          {/* Subtle spec metrics pill */}
          <div className="mt-4 py-2 px-6 rounded-full border border-white/10 bg-white/[0.04] flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[12px] font-mono text-white/80">
            <span>42 APPROVED FACTS</span>
            <span>·</span>
            <span>78% ZERO-MODEL CLAIMS</span>
            <span>·</span>
            <span>51 PASSED TESTS</span>
            <span>·</span>
            <span>100% INCOGNITO READY</span>
          </div>

          {/* Marquee Loop 1: Verdict Spectrum */}
          <div className="w-full mt-8">
            <p className="text-center font-mono text-[12px] tracking-[0.6px] text-white/80 uppercase mb-3 font-medium">
              The Six Verdict States
            </p>
            <LogoLoop speed={35}>
              {VERDICT_PILLS.map((v) => (
                <span
                  key={v.name}
                  className={`inline-flex items-center px-4 py-1.5 rounded-full border font-mono text-[11px] font-semibold tracking-wider ${v.color}`}
                >
                  {v.name}
                </span>
              ))}
            </LogoLoop>
          </div>

          {/* Marquee Loop 2: Engine Invariants */}
          <div className="w-full mt-2">
            <LogoLoop speed={45}>
              {SPEC_HIGHLIGHTS.map((h) => (
                <span key={h} className="inline-flex items-center px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.04] font-mono text-[11px] tracking-wider text-white/80">
                  {h}
                </span>
              ))}
            </LogoLoop>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 2: How It Works (#how-it-works, LIGHT)
          ========================================================================= */}
      <section id="how-it-works" className="bg-paper text-ink py-20 md:py-28">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              Make your content <span className="brand-readable">provably accurate</span>
            </h2>
            <p className="bandhead__lede">
              A sentence accurate in March is often wrong by June. Proofline separates verified facts
              from drifted claims so reviewers never need to ping a colleague to confirm a number.
            </p>
            <Link href="/check" className="btn-outline-landing">
              Test the sample draft →
            </Link>
          </header>

          {/* 3-Column Visual Workflow Mock (Composio Style) */}
          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {/* Step 1: Draft Input Card */}
            <div className="rounded-[28px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-line mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    STEP 01 · DRAFT INPUT
                  </span>
                  <span className="text-[12px] font-mono text-ink-soft">sample_draft.md</span>
                </div>
                <p className="text-[13px] font-mono text-muted mb-2">// Pasted copy:</p>
                <blockquote className="border-l-2 border-accent pl-3.5 my-3 text-[14px] leading-relaxed text-ink-soft italic">
                  Ready to scale?{" "}
                  <mark className="bg-v-contradicted-bg text-v-contradicted-fg px-1.5 py-0.5 rounded-md font-medium not-italic">
                    Flowdesk starts at ₹4,999 per month
                  </mark>{" "}
                  and includes 5 team workspaces...
                </blockquote>
              </div>
              <div className="mt-5 pt-3.5 border-t border-line text-[12px] font-mono text-muted flex items-center justify-between">
                <span>12 candidate claims</span>
                <span className="text-accent font-semibold">Auto-segmented</span>
              </div>
            </div>

            {/* Step 2: Deterministic Rule Match */}
            <div className="rounded-[28px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-line mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    STEP 02 · PIPELINE MATCH
                  </span>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-300">
                    0ms MODEL COST
                  </span>
                </div>
                <dl className="divide-y divide-line text-[13px] font-mono">
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-ink-soft">Numeric scalar</dt>
                    <dd className="text-ink font-semibold">₹4,999/mo</dd>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-ink-soft">Attribute lookup</dt>
                    <dd className="text-ink">pricing.starter_monthly</dd>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-ink-soft">Matched fact</dt>
                    <dd className="text-accent font-semibold">F-021 (v4)</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-5 pt-3.5 border-t border-line text-[12px] font-mono text-muted flex items-center justify-between">
                <span>Active value: ₹6,499</span>
                <span className="text-v-contradicted-fg font-semibold">Mismatch detected</span>
              </div>
            </div>

            {/* Step 3: Finding & Human Decision */}
            <div className="rounded-[28px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-line mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                    STEP 03 · VERDICT & AUDIT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-v-contradicted-bg text-v-contradicted-fg border border-v-contradicted-fg/30">
                    CONTRADICTED
                  </span>
                </div>
                <p className="text-[14px] text-ink font-medium leading-relaxed">
                  Approved pricing in Pricing sheet v4 is ₹6,499/mo. The ₹4,999 rate was superseded on 2026-03-31.
                </p>
                <div className="mt-3.5 border-t border-line pt-3 text-[12px] font-mono text-ink-soft">
                  <span className="text-muted block text-[11px]">EVIDENCE SPAN [412–468]:</span>
                  <span>Pricing sheet v4 · Valid through 2027</span>
                </div>
              </div>
              <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between">
                <span className="text-[12px] font-mono text-muted">Human decision:</span>
                <span className="text-[12px] font-mono font-semibold px-3 py-1 rounded-full bg-ink text-paper">
                  Reject & Update
                </span>
              </div>
            </div>
          </div>

          {/* In-House Architecture Diagram: 78% Deterministic Routing in Double-Bezel Card */}
          <div className="mt-14 p-2.5 md:p-3 rounded-[32px] bg-panel border border-line-strong shadow-sm overflow-hidden">
            <div className="rounded-[calc(32px-10px)] overflow-hidden">
              <DeterministicSplitDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 3: Six Verdicts (#verdicts, LIGHT)
          ========================================================================= */}
      <section id="verdicts" className="bg-panel text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              Six verdicts, each with <span className="brand-readable">its evidence</span>
            </h2>
            <p className="bandhead__lede">
              The verdict is a precise status, never a vague percentage. Every claim resolves into one
              of six canonical states with concrete backing.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <VerdictCard type="SUPPORTED" />
            <VerdictCard type="CONTRADICTED" />
            <VerdictCard type="STALE" />
            <VerdictCard type="CONFLICTING" />
            <VerdictCard type="UNVERIFIED" />
            <VerdictCard type="NOT_CHECKABLE" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 4: The Deterministic Pipeline (#pipeline, LIGHT)
          ========================================================================= */}
      <section id="pipeline" className="bg-paper text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              78% of claims resolved <span className="brand-readable">without an LLM</span>
            </h2>
            <p className="bandhead__lede">
              Models are stochastic; brand guidelines are not. Proofline implements a tiered
              deterministic-first pipeline that saves cost, prevents latency, and avoids hallucination.
            </p>
          </header>

          {/* Interactive Pipeline Stage Demo */}
          <PipelineDemo />

          {/* In-House Schematic: 5-Field Evidence Gate Invariant in Double-Bezel Card */}
          <div className="mt-14 p-2.5 md:p-3 rounded-[32px] bg-panel border border-line-strong shadow-sm overflow-hidden">
            <div className="rounded-[calc(32px-10px)] overflow-hidden">
              <EvidenceGateDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 5: Trust & Invariants (#trust, LIGHT)
          ========================================================================= */}
      <section id="trust" className="bg-panel text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              Auditability and truth, <span className="brand-readable">always in your control</span>
            </h2>
            <p className="bandhead__lede">
              Every design decision in Proofline protects reviewer autonomy and regulatory rigor.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            <article className="rounded-[28px] md:rounded-[32px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Database size={22} className="text-accent shrink-0" aria-hidden="true" />
                  <h3 className="text-[19px] font-semibold text-ink">Owner-Approved Register</h3>
                </div>
                <p className="text-[14px] text-ink-soft leading-relaxed text-pretty">
                  Claims are never verified against arbitrary internet crawls. Only the facts approved
                  by authorized brand owners count as ground truth.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[12px] font-mono text-muted">
                42 seed facts · Versioned &amp; dated
              </div>
            </article>

            <article className="rounded-[28px] md:rounded-[32px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck size={22} className="text-emerald-700 shrink-0" aria-hidden="true" />
                  <h3 className="text-[19px] font-semibold text-ink">No Hallucinated Citations</h3>
                </div>
                <p className="text-[14px] text-ink-soft leading-relaxed text-pretty">
                  When a model evaluates a qualitative claim, its schema allows returning fact IDs only.
                  It cannot fabricate a document name or make up a validity date.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[12px] font-mono text-muted">
                Zod-validated output schema
              </div>
            </article>

            <article className="rounded-[28px] md:rounded-[32px] border border-line-strong bg-card p-7 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FileText size={22} className="text-slate shrink-0" aria-hidden="true" />
                  <h3 className="text-[19px] font-semibold text-ink">Append-Only Audit Log</h3>
                </div>
                <p className="text-[14px] text-ink-soft leading-relaxed text-pretty">
                  Every decision (Approve, Reject, Request Edit) is stored with an exact timestamp,
                  reviewer note, and citation trail for compliance records.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-line text-[12px] font-mono text-muted">
                Exportable compliance log
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 6: Register & Team Coordination (#register, LIGHT)
          ========================================================================= */}
      <section id="register" className="bg-paper text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              One shared register for <span className="brand-readable">your whole brand</span>
            </h2>
            <p className="bandhead__lede">
              Product, legal, and growth teams collaborate on a unified fact register. Stale windows and
              conflicting claims are surfaced immediately.
            </p>
            <Link href="/facts" className="btn-outline-landing">
              Browse 42 registered facts →
            </Link>
          </header>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Versioned Facts",
                sub: "Pricing & packaging",
                items: [
                  "Pricing sheet v4 (Active from 2026-04-01)",
                  "Pricing sheet v3 (Superseded)",
                  "Starter plan: 5 seats included",
                  "Growth plan: 25 seats tier",
                ],
              },
              {
                title: "Validity Windows",
                sub: "Automatic expiration gates",
                items: [
                  "Annual promo discount: Expired 2026-03-31",
                  "14-day free trial: Active indefinitely",
                  "Data residency: India datacenter active",
                  "Legacy plan: Expired & locked",
                ],
              },
              {
                title: "Conflict Resolution",
                sub: "Multi-stakeholder sanity checks",
                items: [
                  "Flag: F-013 vs F-014 seat count discrepancy",
                  "Auto-detection of conflicting attributes",
                  "Filter register by Stale / Conflicting",
                  "Single-click demo reset to restore seed",
                ],
              },
            ].map((col) => (
              <div
                key={col.title}
                className="rounded-[28px] md:rounded-[32px] border border-line-strong bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-7 pb-4">
                  <h3 className="text-[19px] font-semibold text-ink">{col.title}</h3>
                  <p className="text-[13px] text-muted mb-4">{col.sub}</p>
                  <ul className="divide-y divide-line text-[13px] font-mono">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="py-2.5 text-ink-soft flex items-center gap-2"
                      >
                        <ChevronRight size={13} className="text-accent shrink-0" aria-hidden="true" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-7 py-3.5 bg-panel border-t border-line text-[11px] font-mono text-muted rounded-b-[28px]">
                  REGISTER-V1 INVARIANT
                </div>
              </div>
            ))}
          </div>

          {/* In-House Register Lockup Diagram in Double-Bezel Card */}
          <div className="mt-14 p-2.5 md:p-3 rounded-[32px] bg-panel border border-line-strong shadow-sm overflow-hidden">
            <div className="rounded-[calc(32px-10px)] overflow-hidden">
              <RegisterLockupDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 7: Developer Platform / API (DARK SCOPE)
          ========================================================================= */}
      <section id="build" className="dark-scope py-20 md:py-28 border-t border-white/10 relative">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              Build it into <span className="brand-readable">your pipeline</span>
            </h2>
            <p className="bandhead__lede">
              Use Proofline headlessly in your CI/CD publishing workflows, Slack marketing bots, or
              internal editor extensions via a clean REST interface.
            </p>
            <Link href="/about" className="btn-outline-landing">
              View API architecture →
            </Link>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Terminal Request Block */}
            <div className="rounded-[28px] border border-white/10 bg-[#141412] p-6 md:p-7 font-mono text-[12px] shadow-2xl">
              <div className="flex items-center gap-2 pb-3.5 border-b border-white/10 mb-4 text-white/60">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 font-medium">terminal — cURL POST /api/verify</span>
              </div>
              <pre className="text-white/85 overflow-x-auto leading-relaxed p-4 rounded-2xl bg-[#0d0d0b] border border-white/5">
{`curl -X POST https://proofline.app/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "draft": "Flowdesk starts at ₹4,999/mo.",
    "brand_id": "B-flowdesk",
    "review_date": "2026-11-05"
  }'`}
              </pre>
            </div>

            {/* Terminal Response Block */}
            <div className="rounded-[28px] border border-white/10 bg-[#141412] p-6 md:p-7 font-mono text-[12px] shadow-2xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-white/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-readable" />
                  <span className="font-medium">200 OK — 112ms</span>
                </div>
                <span className="text-[11px] text-rose-400 font-semibold px-2 py-0.5 rounded-full bg-rose-950/40 border border-rose-800/40">CONTRADICTED</span>
              </div>
              <pre className="text-[#d7d1c9] overflow-x-auto leading-relaxed text-[11px] p-4 rounded-2xl bg-[#0d0d0b] border border-white/5">
{`{
  "verdict": "CONTRADICTED",
  "claim": "Flowdesk starts at ₹4,999/mo.",
  "evidence": {
    "fact_id": "F-021",
    "version": 4,
    "source_doc": "Pricing sheet v4",
    "span": [412, 468],
    "approved_value": "₹6,499 per month"
  },
  "suggested_correction": "Update to ₹6,499 per month"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 8: Engineering Stack (#stack, DARK SCOPE)
          ========================================================================= */}
      <section id="stack" className="dark-scope py-16 md:py-20 border-t border-white/10">
        <div className="band-wrap text-center">
          <p className="font-mono text-[12px] uppercase tracking-wider text-white/70 mb-3">
            BUILT WITH PRAGMATIC FOUNDATIONS
          </p>
          <h2 className="bandhead__title text-white mx-auto mb-8">
            Engineered with <span className="brand-readable">zero bloat</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "TypeScript Strict", desc: "Deterministic rules & schemas" },
              { name: "Next.js 16 App Router", desc: "Turbopack & React 19" },
              { name: "Vitest 51 Tests", desc: "100% verdict rules pass" },
              { name: "Zero Auth Required", desc: "Instant evaluation in incognito" },
            ].map((f) => (
              <div
                key={f.name}
                className="p-5 rounded-[22px] border border-white/10 bg-white/[0.04] text-left flex flex-col justify-between hover:bg-white/[0.07] transition-all"
              >
                <p className="font-mono text-[13px] font-semibold text-white">{f.name}</p>
                <p className="text-[12px] text-white/70 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 9: Enterprise Governance Chain (#enterprise, LIGHT)
          ========================================================================= */}
      <section id="enterprise" className="bg-paper text-ink py-20 md:py-28 border-t border-line">
        <div className="band-wrap">
          <header className="bandhead">
            <h2 className="bandhead__title">
              Built for <span className="brand-readable">enterprise brand safety</span>
            </h2>
            <p className="bandhead__lede">
              Trace any marketing statement backwards to the executive document or pricing sheet that
              authorized it.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                label: "Pasted Claim",
                title: "“Flowdesk starts at ₹4,999”",
                detail: "Found in draft headline",
              },
              {
                step: "02",
                label: "Matched Fact",
                title: "Pricing sheet v4",
                detail: "Active since 2026-04-01",
              },
              {
                step: "03",
                label: "System Verdict",
                title: "CONTRADICTED",
                detail: "Superseded rate F-021",
              },
              {
                step: "04",
                label: "Audit Record",
                title: "Reviewer Decision",
                detail: "Logged with reason",
              },
            ].map((c) => (
              <div
                key={c.step}
                className="rounded-[28px] border border-line-strong bg-card p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold font-mono flex items-center justify-center text-[12px] mb-3">
                    {c.step}
                  </div>
                  <p className="text-[11px] font-mono text-muted uppercase tracking-wider">{c.label}</p>
                  <p className="text-[16px] font-semibold text-ink mt-2">{c.title}</p>
                </div>
                <p className="text-[13px] text-ink-faint mt-4 pt-3 border-t border-line">{c.detail}</p>
              </div>
            ))}
          </div>

          {/* In-House Enterprise Security & Privacy Architecture Diagram in Double-Bezel Card */}
          <div className="mt-14 p-2.5 md:p-3 rounded-[32px] bg-panel border border-line-strong shadow-sm overflow-hidden">
            <div className="rounded-[calc(32px-10px)] overflow-hidden">
              <EnterpriseSecurityDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 10: FAQ (#faq, LIGHT)
          ========================================================================= */}
      <section id="faq" className="bg-panel text-ink py-20 md:py-32 border-t border-line">
        <div className="band-wrap grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="sticky top-28 p-7 md:p-8 rounded-[32px] bg-card border border-line-strong shadow-sm">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold block mb-2 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 w-max">
                QUESTIONS &amp; ANSWERS
              </span>
              <h2 className="text-[28px] md:text-[34px] font-serif font-normal text-left text-ink leading-tight mt-3">
                Frequently asked questions
              </h2>
              <p className="text-[14px] text-ink-soft leading-relaxed mt-4 text-pretty">
                Have more questions about the deterministic pipeline, local storage model, or evaluation&nbsp;suite?
              </p>
              <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-line">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                >
                  <span>Read full project specification</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <a
                  href="https://github.com/RavaniRoshan/proofline"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
                >
                  <span>Browse GitHub repository</span>
                  <GitBranch size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* =========================================================================
          BAND 11: Call to Action (#start, LIGHT)
          ========================================================================= */}
      <section id="start" className="bg-paper text-ink py-16 md:py-24 border-t border-line">
        <div className="band-wrap">
          <div className="rounded-[36px] md:rounded-[44px] border border-line-strong bg-panel p-10 sm:p-16 text-center shadow-md relative overflow-hidden">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold inline-block mb-3 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              ZERO CONFIGURATION · NO SIGN-IN REQUIRED
            </span>
            <h2 className="bandhead__title mx-auto">
              Give your marketing what it needs to <span className="brand-readable">tell the truth</span>
            </h2>
            <p className="bandhead__lede mx-auto mt-4 text-[16px] sm:text-[18px]">
              Open the checker in an incognito window, load the sample draft, and watch Proofline
              resolve 12 marketing claims in under 2 seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/check" className="btn-primary-landing bg-accent text-paper hover:bg-accent-hover">
                OPEN THE CHECKER
                <ArrowRight size={15} className="ml-1.5 inline" aria-hidden="true" />
              </Link>
              <Link href="/facts" className="btn-outline-landing">
                BROWSE 42 FACTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 12: Comprehensive Footer (LIGHT)
          ========================================================================= */}
      <footer className="bg-paper text-ink border-t border-line pt-16 pb-12">
        <div className="band-wrap">
          {/* Newsletter Box */}
          <div className="grid md:grid-cols-2 gap-10 mb-16 pb-12 border-b border-line items-center">
            <div>
              <p className="text-[26px] md:text-[30px] font-serif font-normal">
                Stay updated on brand governance
              </p>
              <p className="mt-2 text-[14px] text-ink-soft max-w-[50ch] text-pretty">
                Get occasional updates on deterministic claim verification, regulatory standards, and AI&nbsp;preflight.
              </p>
            </div>
            <NewsletterForm />
          </div>

          {/* 6-Column Navigation Links (Composio Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-14">
            <div>
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                PRODUCT
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <Link href="/check" className="hover:text-accent transition-colors">
                    Checker View
                  </Link>
                </li>
                <li>
                  <Link href="/facts" className="hover:text-accent transition-colors">
                    Fact Register
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className="hover:text-accent transition-colors">
                    Audit Trail
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                VERDICTS
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-ink-soft">
                <li>SUPPORTED</li>
                <li>CONTRADICTED</li>
                <li>STALE</li>
                <li>CONFLICTING</li>
                <li>UNVERIFIED</li>
                <li>NOT_CHECKABLE</li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                PIPELINE
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <a href="#pipeline" className="hover:text-accent transition-colors">
                    Stage 1: Numeric
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
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                DEMO BRAND
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-ink-soft">
                <li>Flowdesk Starter</li>
                <li>Flowdesk Growth</li>
                <li>Pricing Sheet v4</li>
                <li>Seed Cases (24)</li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                QUALITY GATES
              </p>
              <ul className="space-y-2 text-[13px] font-mono text-ink-soft">
                <li>51 Unit Tests</li>
                <li>24/24 Eval Score</li>
                <li>3 Playwright Flows</li>
                <li>Zero Model Leak</li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[12px] font-semibold text-muted uppercase tracking-wider mb-3">
                RESOURCES
              </p>
              <ul className="space-y-2 text-[13px] font-mono">
                <li>
                  <Link href="/about" className="hover:text-accent transition-colors">
                    What this is
                  </Link>
                </li>
                <li>
                  <a
                    href="https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    Round 1 PDF
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/RavaniRoshan/proofline"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    GitHub Repo
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal and Disclaimer Bar */}
          <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted font-sans">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-ink">[ ] Proofline</span>
              <span>·</span>
              <span>Round 2 build · Brand governance platform</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>ALL FACTS ARE DEMO DATA</span>
              <span>·</span>
              <span>NO TRACKING COOKIES</span>
              <span>·</span>
              <span>MIT LICENSED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
