import Link from "next/link";
import { ArrowRight, FileText, Lightbulb, ExternalLink } from "lucide-react";
import { Badge, VerdictBadge } from "@/components/ui/badge";
import { VERDICT_MAP, type VerdictConfig } from "@/lib/verdicts";
import type { Verdict } from "@/lib/types";

const VERDICTS = Object.entries(VERDICT_MAP) as [Verdict, VerdictConfig][];

const VERDICT_MEANINGS: Record<Verdict, string> = {
  SUPPORTED: "Matches an approved fact",
  CONTRADICTED: "Conflicts with approved fact",
  STALE: "Fact past its validity window",
  UNVERIFIED: "No approved fact matches it",
  CONFLICTING: "Approved facts disagree",
  NOT_CHECKABLE: "Not a verifiable claim",
};

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl py-4 sm:py-6">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
        {/* Left Column: Value Prop & Steps */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Brand Governance · Deterministic Claim Verification
          </p>

          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl text-foreground font-serif">
            Every marketing claim checked against approved facts.
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft max-w-xl">
            Proofline checks drafts against an owner-approved, versioned register of product facts.
            Deterministic TypeScript rules decide numbers, currency, dates, and required disclaimers
            with zero model cost; every finding cites the exact source document, version, and validity
            window — or honestly refuses to judge.
          </p>

          {/* Three numbered steps */}
          <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Paste draft",
                body: "Paste copy or load the seeded sample draft.",
              },
              {
                step: "02",
                title: "Rule check",
                body: "78% of claims resolve with zero model calls.",
              },
              {
                step: "03",
                title: "Decide with proof",
                body: "Inspect cited source spans and record decisions.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-[6px] border border-line-strong bg-panel/50 p-3"
              >
                <span className="font-serif text-xs font-semibold text-accent">[{step}]</span>
                <p className="mt-1 text-[13px] font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{body}</p>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/check"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <span>Start checking claims</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link
              href="/facts"
              className="inline-flex h-11 items-center justify-center rounded-[4px] border border-line-strong bg-panel px-5 text-sm font-medium text-foreground transition-colors hover:border-slate hover:text-foreground"
            >
              Browse 42 approved facts
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Visual - Static real CONTRADICTED finding card */}
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted">
              <span className="font-semibold uppercase tracking-wider">Example Verified Finding</span>
              <span className="font-mono">Seed case S-005</span>
            </div>

            <article
              className="rounded-[6px] border border-line-strong bg-card p-4 sm:p-5 text-foreground"
              aria-label="Example finding card"
            >
              <div className="flex flex-wrap items-center gap-2">
                <VerdictBadge verdict="CONTRADICTED" />
                <span className="text-[11px] uppercase tracking-wide text-muted">
                  numeric · rule check
                </span>
              </div>

              <blockquote className="mt-3 border-l-2 border-line pl-3 text-[14px] font-medium leading-snug text-foreground">
                “Flowdesk starts at ₹4,999 per month.”
              </blockquote>

              <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
                Approved pricing in Pricing sheet v4 is ₹6,499 per month, billed annually. The ₹4,999 price was superseded on 2026-03-31.
              </p>

              {/* One-line Decision Trace */}
              <div className="mt-3 flex items-center justify-between rounded-[4px] border border-line bg-panel px-2.5 py-1 text-[11px] font-mono text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate">[RULE]</span>
                  <span>rule:numeric-scalar-bounds</span>
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-slate">
                  <span>Inspect evidence</span>
                  <ExternalLink size={10} aria-hidden="true" />
                </span>
              </div>

              {/* Evidence record pill */}
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[4px] border border-line bg-panel/50 px-3 py-2 text-[11px] text-muted">
                <FileText size={13} aria-hidden="true" className="shrink-0 text-slate" />
                <span className="font-medium text-foreground/80">Pricing sheet v4</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">[412-468]</span>
                <span aria-hidden="true">·</span>
                <span>version 4</span>
                <span aria-hidden="true">·</span>
                <span>valid 2026-04-01 → 2027-03-31</span>
                <span className="ml-auto rounded-[4px] border border-line bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
                  F-021
                </span>
              </div>

              {/* Suggested correction */}
              <p className="mt-3 flex items-start gap-2 text-[12px] leading-snug text-foreground/90">
                <Lightbulb size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-v-stale-fg" />
                <span>
                  <span className="font-semibold">Suggested correction: </span>
                  Update pricing to ₹6,499 per month, billed annually.
                </span>
              </p>

              {/* Sample decision control preview */}
              <div className="mt-4 border-t border-line pt-3 flex items-center justify-between text-xs text-muted">
                <span className="font-medium">Owner decision required before publish</span>
                <span className="font-mono text-[11px] text-slate font-semibold">100% deterministic</span>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* The six verdicts legend */}
      <section
        aria-labelledby="verdict-legend"
        className="mt-6 border-t border-line pt-4 sm:mt-7 sm:pt-5"
      >
        <h2
          id="verdict-legend"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          The six verdicts
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {VERDICTS.map(([verdict, config]) => {
            const Icon = config.icon;
            return (
              <li key={verdict} className="flex flex-col items-start gap-1.5">
                <Badge className={`${config.badgeClasses} font-semibold`}>
                  <Icon size={12} strokeWidth={2.5} aria-hidden="true" />
                  {config.label}
                </Badge>
                <span className="text-[11px] leading-snug text-muted">
                  {VERDICT_MEANINGS[verdict]}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
