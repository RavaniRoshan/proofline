import Link from "next/link";
import { Header } from "@/components/ui/vercel-navbar";
import { ProoflineHero } from "@/components/landing/ProoflineHero";
import { MeshCardBackdrop } from "@/components/landing/HeroTunnelCanvas";
import { UseCasesDualPane } from "@/components/landing/UseCasesDualPane";
import { TrustSecurityCards } from "@/components/landing/AgentsAndTrustBands";
import { StickyJobsBand } from "@/components/landing/StickyJobsBand";
import Features4 from "@/components/ui/features-4";
import Faq6 from "@/components/ui/faq-6";
import Bento1 from "@/components/ui/bento-1";
import { Footer15 } from "@/components/ui/footer-15";
import { FaArrowRight } from "react-icons/fa6";
import { CheckCircle2, Lock, FileCheck2 } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

const FOOTER_LINKS = [
  {
    title: "PRODUCT",
    links: [
      { label: "Preflight Checker", href: "/check" },
      { label: "Ground Truth Facts", href: "/facts" },
      { label: "Operational Telemetry", href: "/dashboard" },
      { label: "Decision Journal", href: "/audit" },
    ],
  },
  {
    title: "ARCHITECTURE",
    links: [
      { label: "Deterministic Split (78/22)", href: "/docs/architecture" },
      { label: "Evidence Gate Specification", href: "/docs/evidence-gate" },
      { label: "Fact Register Lineage", href: "/docs/fact-register" },
      { label: "REST API Endpoint", href: "/docs/api-reference" },
    ],
  },
  {
    title: "GOVERNANCE & TRUST",
    links: [
      { label: "Documentation Hub", href: "/docs" },
      { label: "TypeScript SDK", href: "/docs/typescript-sdk" },
      { label: "Zero Server Storage", href: "/docs/security-compliance" },
      { label: "Architecture RFC", href: "/about" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I have to create an account or sign in to evaluate Proofline?",
    a: "No. Proofline runs with zero sign-in and zero cookies in any incognito browser window. Open /check, click 'Load sample draft', and verify 12 Flowdesk marketing claims in under two seconds.",
  },
  {
    q: "How is Proofline different from a grammar or style checker?",
    a: "Grammar checkers evaluate tone, readability, and syntax. Proofline checks factual truth: pricing, seat tiers, storage limits, effective dates, and mandatory legal disclaimers against an owner-approved, version-controlled fact register.",
  },
  {
    q: "Why resolve claims with deterministic TypeScript rules before calling a model?",
    a: "Language models frequently hallucinate numbers, miss subtle unit conversions, and overlook expired validity windows. 78% of marketing claims contain numbers, currency, dates, or product names that TypeScript verifies with 100% precision and <1ms API latency.",
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
    q: "How long does it take to run the verification test suite locally?",
    a: "Under 5 seconds. Run `python3 scripts/validate_seed.py`, `npm test` (51 Vitest assertions), and `npm run smoke` (24/24 evaluation cases across all 6 verdicts).",
  },
  {
    q: "Can I use Proofline for CI/CD pipelines as well as editorial reviews?",
    a: "Yes. Proofline exposes a headless `POST /api/verify` JSON endpoint that runs the exact same 4-stage pipeline for GitHub Actions release gates, MCP agents, and internal publishing tools.",
  },
];

const PROOFLINE_FAQS = FAQ_ITEMS.map((item, idx) => ({
  id: `item-${idx + 1}`,
  question: item.q,
  answer: item.a,
}));


export default function LandingPage() {
  return (
    <main id="main-content" className="landing min-h-screen flex flex-col bg-paper text-ink overflow-x-hidden">
      {/* =========================================================================
          HERO SECTION: Full-Viewport Proofline Stage
          ========================================================================= */}
      <Header />
      <ProoflineHero />

      {/* =========================================================================
          BAND 2 (#how-it-works / #use-cases): Interactive Dual-Pane Use Cases
          (Exact match to 03-band2-use-cases.png with border-x border-t page rails)
          ========================================================================= */}
      <section id="how-it-works" className="relative bg-paper text-ink">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          {/* Subtle gradient hairline highlight across the top border */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />

          {/* Centered Section Header + Sharp 0px Mono CTA */}
          <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              [01] INTERACTIVE VERIFICATION WORKFLOWS
            </span>
            <h2 className="max-w-[22ch] text-balance font-serif text-[32px] md:text-[44px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
              Make your copy{" "}
              <span className="text-accent dark:text-[#E07A70]">provably accurate</span>
            </h2>
            <p className="mt-4 max-w-[54ch] text-[16px] md:text-[17px] tracking-[-0.022em] leading-[1.45] text-ink-soft dark:text-zinc-300 text-pretty">
              Proofline gives reviewers deterministic rules, access to your owner-approved fact
              register, and an Evidence Gate that already works, so claims ship right the first
              time.
            </p>
            <MagneticButton pullStrength={0.2}>
              <Link
                href="/check"
                className="group mt-6 inline-flex items-center justify-center gap-2 border border-ink/20 dark:border-white/20 bg-paper dark:bg-white/5 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider text-ink dark:text-white transition-all hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98] rounded-none shadow-xs font-semibold"
              >
                <span>TRY IT IN THE CHECKER</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </MagneticButton>
          </div>

          {/* 3-Column Connected Interactive Flow Stage */}
          <ScrollReveal direction="up" distance={20} blur={4}>
            <UseCasesDualPane />
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          BAND 4 (#pipeline / #harder-jobs): Sticky 3-Step Timeline + Silk Mesh Card
          + Interactive Archify System Topology & Deterministic Split Diagram
          (Exact match to 05-band4-sticky-timeline.png)
          ========================================================================= */}
      <section id="pipeline" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />

          {/* 2-Column Sticky Timeline + 547x680 Rounded-[32px] Silk Mesh Card */}
          <ScrollReveal direction="up" distance={20} blur={4}>
            <StickyJobsBand />
          </ScrollReveal>

          {/* Interactive Bento Suite with generous spacing and dedicated showcase header */}
          <div className="mt-28 md:mt-36 border-t border-ink/15 dark:border-white/12 pt-20">
            <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/12 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                [02.2] ARCHITECTURAL SPECIFICATION
              </span>
              <h3 className="max-w-[24ch] text-balance font-serif text-[28px] md:text-[38px] font-normal tracking-[-0.04em] leading-[1.12] text-ink dark:text-white">
                Unified Claim Verification <span className="text-accent dark:text-[#E07A70]">Engine</span>
              </h3>
              <p className="mt-3.5 max-w-[52ch] text-[15px] md:text-[16.5px] tracking-[-0.02em] leading-[1.5] text-ink-soft dark:text-zinc-300">
                Interactive topology of high-throughput deterministic rules, local citation verification, and zero-token scalar pipelines.
              </p>
            </div>

            <ScrollReveal direction="up" distance={24} blur={6}>
              <div className="overflow-hidden rounded-[28px] border border-ink/15 dark:border-white/12 bg-card shadow-[0_8px_32px_-8px_rgba(26,26,24,0.08)]">
                <Bento1 />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 5 (#register / #teams): 3-Column Shared Team Cards + Floating Toast
          (Exact match to 06-band5-permissions-diagram.png)
          ========================================================================= */}
      <section id="register" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />

          {/* Centered Header + Sharp 0px Button */}
          <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              [03] COLLABORATIVE TRUTH REGISTER
            </span>
            <h2 className="max-w-[22ch] text-balance font-serif text-[32px] md:text-[44px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
              One register for{" "}
              <span className="text-accent dark:text-[#E07A70]">your whole team</span>
            </h2>
            <p className="mt-3.5 max-w-[52ch] text-[16px] md:text-[17px] tracking-[-0.02em] leading-[1.45] text-ink-soft dark:text-zinc-300">
              Approve product facts, validity windows, and disclaimers once. Every reviewer’s check
              gets them automatically.
            </p>
            <MagneticButton pullStrength={0.2}>
              <Link
                href="/facts"
                className="group mt-6 inline-flex items-center justify-center gap-2 border border-ink/20 dark:border-white/20 bg-paper dark:bg-white/5 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider text-ink dark:text-white transition-all hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98] rounded-none shadow-xs font-semibold"
              >
                <span>EXPLORE 42 SEEDED FACTS</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </MagneticButton>
          </div>

          {/* 3 Equal Cards (375x368 geometry) + Floating Overlap Notification Pill */}
          <ScrollReveal direction="up" distance={20} blur={4}>
            <div className="relative mx-auto max-w-[1158px]">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                {/* Card 1: Shared Fact Register (Shared Accounts equivalent) */}
                <section className="flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card p-6 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all">
                  <div>
                    <h3 className="font-sans text-[18px] font-medium text-ink dark:text-white">
                      Shared Fact Register
                    </h3>
                    <p className="mt-0.5 text-[13.5px] text-ink-soft dark:text-zinc-400">
                      Ready for every reviewer
                    </p>

                    <div className="mt-5 flex flex-col gap-2">
                      {[
                        { badge: "₹", badgeBg: "bg-v-contradicted-bg text-v-contradicted-fg", label: "flowdesk.starter_price (v4)" },
                        { badge: "₹", badgeBg: "bg-v-contradicted-bg text-v-contradicted-fg", label: "flowdesk.pro_price (v4)" },
                        { badge: "F", badgeBg: "bg-ink text-paper dark:bg-white dark:text-zinc-950", label: "Flowdesk Enterprise SLA" },
                        { badge: "M", badgeBg: "bg-v-supported-bg text-v-supported-fg", label: "mumbai.data_residency" },
                        { badge: "S", badgeBg: "bg-v-stale-bg text-v-stale-fg", label: "legacy.growth_sunset" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center gap-3 rounded-xl bg-panel/80 dark:bg-zinc-800/80 px-3.5 py-2.5 text-[13px] text-ink dark:text-zinc-200"
                        >
                          <span
                            className={`inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] font-mono text-[10px] font-bold ${row.badgeBg}`}
                          >
                            {row.badge}
                          </span>
                          <span className="truncate">{row.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Card 2: Shared Rules & Lineage (Shared Skills equivalent) */}
                <section className="flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card p-6 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all">
                  <div>
                    <h3 className="font-sans text-[18px] font-medium text-ink dark:text-white">
                      Shared Verification Rules
                    </h3>
                    <p className="mt-0.5 text-[13.5px] text-ink-soft dark:text-zinc-400">
                      For every campaign &amp; launch
                    </p>

                    <div className="mt-5 flex flex-col gap-2">
                      {[
                        { label: "Check Q2 Pricing Draft", tag: "P", tagClass: "bg-v-conflicting-bg text-v-conflicting-fg" },
                        { label: "Audit Renewal Emails", tag: "M", tagClass: "bg-v-stale-bg text-v-stale-fg" },
                        { label: "Verify Security Whitepaper", tag: "D", tagClass: "bg-v-supported-bg text-v-supported-fg" },
                        { label: "Flag Seat Tier Conflicts", tag: "S", tagClass: "bg-panel dark:bg-zinc-800 text-ink-soft dark:text-zinc-400" },
                        { label: "Enforce Uptime Disclaimer", tag: "L", tagClass: "bg-v-contradicted-bg text-v-contradicted-fg" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between gap-2 rounded-xl bg-panel/80 dark:bg-zinc-800/80 px-3.5 py-2.5 text-[13px] text-ink dark:text-zinc-200"
                        >
                          <span className="truncate">{row.label}</span>
                          <span
                            className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold ${row.tagClass}`}
                          >
                            {row.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Card 3: Deterministic Budget (Shared Budget equivalent with bottom dark card) */}
                <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all">
                  <MeshCardBackdrop className="opacity-45" />
                  <div className="relative z-10 p-6 pb-3">
                    <h3 className="font-sans text-[18px] font-medium text-ink dark:text-white">
                      Deterministic Budget
                    </h3>
                    <p className="mt-0.5 text-[13.5px] text-ink-soft dark:text-zinc-400 tabular-nums">
                      78% resolved with 0 model tokens
                    </p>

                    {/* Segmented Progress Bar */}
                    <div className="mt-4 flex h-2 w-full gap-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                      <div className="h-full w-[56%] rounded-l-full bg-accent" />
                      <div className="h-full w-[22%] bg-accent/65" />
                      <div className="h-full w-[14%] bg-accent/35" />
                    </div>

                    {/* 3 Spend / Execution Rows */}
                    <div className="mt-4 flex flex-col gap-2">
                      {[
                        { dot: "bg-accent", icon: "TS", name: "Stage 1 Scalar Rules", val: "78%" },
                        { dot: "bg-accent/65", icon: "LX", name: "Stage 2 Lexical Top-5", val: "0.4ms" },
                        { dot: "bg-accent/35", icon: "GM", name: "Stage 3 Bounded Model", val: "22%" },
                      ].map((r) => (
                        <div
                          key={r.name}
                          className="flex items-center justify-between rounded-xl bg-paper/90 dark:bg-zinc-800/90 border border-ink/6 dark:border-white/6 px-3.5 py-2 text-[13px] shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`size-1.5 rounded-full ${r.dot}`} />
                            <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-ink text-paper dark:bg-white dark:text-zinc-950 font-mono text-[9px] font-bold">
                              {r.icon}
                            </span>
                            <span className="text-ink dark:text-zinc-200">{r.name}</span>
                          </div>
                          <span className="font-mono text-[12px] text-ink-soft dark:text-zinc-400 tabular-nums">
                            {r.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Dark Card inside Card 3 matching 06-band5-permissions-diagram.png */}
                  <div className="relative z-10 mx-6 mt-2 rounded-t-2xl border border-b-0 border-white/15 bg-[#1A1A18] p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[13px] font-bold text-accent-readable">
                          [ ]
                        </span>
                        <span className="font-sans text-[14px] font-semibold">
                          Proofline
                        </span>
                      </div>
                      <span className="border border-accent-readable/50 bg-accent/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-readable">
                        ⚡ ZERO LLM COST
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-white/50">
                      <span>PROOFLINE.V1</span>
                      <span>24/24 SMOKE PASS</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Floating Bottom-Center Overlap Toast Card (Exact 06-band5-permissions-diagram.png) */}
              <div className="mx-auto mt-8 relative z-20 flex w-fit items-center gap-3 rounded-2xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card px-6 py-4 shadow-[0_16px_40px_rgba(26,26,24,0.1)]">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-v-supported-bg text-v-supported-fg">
                  <CheckCircle2 size={15} />
                </span>
                <div className="text-left">
                  <p className="text-[13.5px] font-medium text-ink dark:text-white leading-tight">
                    Pricing sheet v4 approved in register
                  </p>
                  <p className="text-[12px] text-ink-soft dark:text-zinc-400">
                    Facts, byte spans, and validity windows ready for every check
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          BAND 6 (#trust): 3 Trust & Security Cards + 5-Pin Evidence Gate Diagram
          (Exact match to 07-band6-trust-security.png)
          ========================================================================= */}
      <section id="trust" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />

          <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              [04] DETERMINISTIC PROOF &amp; EVIDENCE
            </span>
            <h2 className="max-w-[22ch] text-balance font-serif text-[32px] md:text-[44px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
              Deterministic proof,{" "}
              <span className="block text-accent dark:text-[#E07A70]">always in your control</span>
            </h2>
            <p className="mt-4 max-w-[48ch] text-[16px] md:text-[17px] tracking-[-0.02em] leading-[1.45] text-ink-soft dark:text-zinc-300">
              Decide what facts are active and what evidence is required. Proofline keeps unbacked
              claims out.
            </p>
          </div>

          {/* 3 Visual-Top Cards matching 07-band6-trust-security.png */}
          <ScrollReveal direction="up" distance={20} blur={4}>
            <TrustSecurityCards />
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          BAND 7 (#build): 5-Card Proofline Verification Architecture Mosaic
          ========================================================================= */}
      <section id="build" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />
          <ScrollReveal direction="up" distance={20} blur={4}>
            <Features4 />
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          BAND 9 & 10 (#enterprise): Enterprise Governance & Zero Server Storage
          (Exact match to bands-extraction.json sections 14 & 15)
          ========================================================================= */}
      <section id="enterprise" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />

          <div className="mx-auto mb-16 md:mb-20 flex max-w-[720px] flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-panel/80 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
              [06] ENTERPRISE GOVERNANCE &amp; PRIVACY
            </span>
            <h2 className="max-w-[22ch] text-balance font-serif text-[32px] md:text-[44px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
              One place to govern{" "}
              <span className="text-accent dark:text-[#E07A70]">every claim in your company.</span>
            </h2>
            <p className="mt-4 max-w-[54ch] text-[16px] md:text-[17px] tracking-[-0.02em] leading-[1.45] text-ink-soft dark:text-zinc-300">
              Roll Proofline out across product marketing, legal, and release engineering within
              strict local-first privacy and deterministic audit rules.
            </p>

            {/* Dual Sharp 0px Enterprise CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton pullStrength={0.25}>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-ink text-paper dark:bg-white dark:text-zinc-950 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider transition-all hover:opacity-90 active:scale-[0.98] rounded-none shadow-xs font-semibold"
                >
                  <span>OPEN REGISTER DASHBOARD</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </MagneticButton>
              <MagneticButton pullStrength={0.2}>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border border-ink/20 dark:border-white/20 bg-paper dark:bg-white/5 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider text-ink dark:text-white transition-all hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98] rounded-none font-medium"
                >
                  <span>READ ROUND 1 → 2 SPEC</span>
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* 2-Column Enterprise Governance Cards */}
          <ScrollReveal direction="up" distance={20} blur={4}>
            <div className="mx-auto grid max-w-[1158px] grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-between rounded-3xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card p-8 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all">
                <div>
                  <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent dark:text-[#E07A70]">
                    <Lock size={14} />
                    <span>LOCAL-FIRST ISOLATION</span>
                  </div>
                  <h3 className="font-sans text-[20px] font-medium text-ink dark:text-white">
                    Zero server draft retention &amp; incognito ready
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft dark:text-zinc-300">
                    Drafts are verified statelessly in memory. Reviewer sign-offs, fact version
                    approvals, and the append-only decision journal persist strictly in{" "}
                    <code className="font-mono text-[12.5px] text-ink dark:text-zinc-200">localStorage (proofline.v1)</code>.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2 border-t border-ink/10 dark:border-white/10 pt-4 font-mono text-[11.5px] text-ink-soft dark:text-zinc-400">
                  <span>· Zero Auth Wall</span>
                  <span>· Zero Tracking Cookies</span>
                  <span>· 1-Click Reset Demo</span>
                  <span>· Full Offline Audit</span>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-ink/15 dark:border-white/12 bg-paper dark:bg-card p-8 shadow-[0_4px_24px_-4px_rgba(26,26,24,0.06),0_1px_3px_rgba(26,26,24,0.04)] hover:shadow-[0_12px_36px_-6px_rgba(26,26,24,0.1)] transition-all">
                <div>
                  <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent dark:text-[#E07A70]">
                    <FileCheck2 size={14} />
                    <span>VERIFIED ENGINEERING GATES</span>
                  </div>
                  <h3 className="font-sans text-[20px] font-medium text-ink dark:text-white">
                    Certified Round 2 benchmark controls
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft dark:text-zinc-300">
                    Every commit is gated by seed schema validation, 51 unit tests across all
                    normalization and resolution modules, and a 24-case evaluation smoke harness.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-2 border-t border-ink/10 dark:border-white/10 pt-4 font-mono text-[11.5px] text-ink-soft dark:text-zinc-400 tabular-nums">
                  <span>· 78% Deterministic Split</span>
                  <span>· 24/24 Smoke Eval Pass</span>
                  <span>· 51/51 Vitest Suite</span>
                  <span>· 3 Playwright E2E Flows</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          BAND 11 (#faq): Frequently Asked Questions (Faq6 Primitive)
          ========================================================================= */}
      <section id="faq" className="relative bg-paper text-ink scroll-mt-20">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />
          <ScrollReveal direction="up" distance={20} blur={4}>
            <Faq6
              badge="[07] FREQUENTLY ASKED QUESTIONS"
              title={
                <>
                  Frequently
                  <br />
                  asked questions.
                </>
              }
              faqs={PROOFLINE_FAQS}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          BAND 12 (#start): 1158x462 Rounded-[32px] Bottom CTA Silk Mesh Card
          (Exact match to 10-band12-bottom-cta.png)
          ========================================================================= */}
      <section id="start" className="relative bg-paper text-ink">
        <div className="relative mx-auto w-full max-w-[1240px] border-x border-t border-ink/15 dark:border-white/12 shadow-[0_-1px_0_rgba(0,0,0,0.04)] dark:shadow-[0_-1px_0_rgba(255,255,255,0.06)] px-5 py-20 md:px-10 md:py-28 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/25 dark:via-white/25 to-transparent" />
          <ScrollReveal direction="up" distance={20} blur={4}>
            <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-ink/15 dark:border-white/12 p-8 text-center md:min-h-[480px] md:p-16 shadow-[0_16px_48px_-12px_rgba(26,26,24,0.12)]">
              {/* Diagonal Silk Mesh Backdrop in Proofline Tokens */}
              <MeshCardBackdrop />

              <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 dark:border-white/15 bg-paper/80 dark:bg-white/10 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent dark:text-[#E07A70]">
                  [08] GET STARTED IN SECONDS
                </span>
                <h2 className="max-w-[20ch] text-balance font-serif text-[32px] md:text-[46px] font-normal tracking-[-0.04em] leading-[1.08] text-ink dark:text-white">
                  Give your team what it needs to{" "}
                  <span className="text-accent dark:text-[#E07A70]">tell the truth</span>
                </h2>
                <p className="max-w-[38ch] text-balance text-[16px] md:text-[17.5px] tracking-[-0.022em] leading-[1.45] text-ink-soft dark:text-zinc-300">
                  Open Proofline in the browser you already use. Free to evaluate, and ready in
                  seconds.
                </p>

                {/* Dual Sharp 0px Buttons — High-contrast across both Light and Dark modes */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                  <MagneticButton pullStrength={0.25}>
                    <Link
                      href="/check"
                      className="inline-flex items-center justify-center gap-2 bg-ink text-paper dark:bg-white dark:text-zinc-950 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider transition-all hover:opacity-90 active:scale-[0.98] rounded-none shadow-md font-semibold"
                    >
                      <span>CHECK A DRAFT</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </MagneticButton>
                  <MagneticButton pullStrength={0.2}>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center justify-center border border-ink/20 dark:border-white/20 bg-paper dark:bg-white/5 px-6 py-3.5 font-mono text-[13px] uppercase tracking-wider text-ink dark:text-white transition-all hover:border-ink/40 dark:hover:border-white/40 hover:bg-panel dark:hover:bg-white/10 active:scale-[0.98] rounded-none font-medium"
                    >
                      SEE IT WORK
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          FOOTER: High-Impact Panoramic Footer (Footer15)
          ========================================================================= */}
      <Footer15
        brandName="Proofline"
        heroBrandName="PROOFLINE"
        description="Deterministic claim governance for high-stakes marketing, pricing, and product copy. Zero hallucination, 100% verifiable ground truth."
        ctaLabel="Check a Draft"
        ctaHref="/check"
      />
    </main>
  );
}
