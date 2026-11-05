import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Lightbulb,
  ClipboardPaste,
  ScrollText,
  Lock,
} from "lucide-react";
import { VerdictBadge } from "@/components/ui/badge";
import type { Verdict } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const ROUND1_PDF =
  "https://drive.google.com/file/d/1f2UiggPpvjTz1mhgyASbu8RWp1csY9q4/view?usp=sharing";

const VERDICTS = [
  { verdict: "SUPPORTED", meaning: "Matches an approved fact" },
  { verdict: "CONTRADICTED", meaning: "Conflicts with approved fact" },
  { verdict: "STALE", meaning: "Fact past its validity window" },
  { verdict: "UNVERIFIED", meaning: "No approved fact matches it" },
  { verdict: "CONFLICTING", meaning: "Approved facts disagree" },
  { verdict: "NOT_CHECKABLE", meaning: "Not a verifiable claim" },
] as const;

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero */}
      <section className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start pt-6 sm:pt-10">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Brand governance · deterministic claim verification
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-foreground">
            Every marketing claim checked against approved facts.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            For B2B SaaS marketing teams who ship pricing, features, and limits through people,
            agencies, and AI assistants.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/check"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Open the checker
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={ROUND1_PDF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-line-strong bg-panel px-6 text-[15px] font-semibold text-foreground transition-colors hover:border-slate"
            >
              <FileText size={16} aria-hidden="true" />
              Read the 10-page plan
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <VerdictBadge verdict="CONTRADICTED" />
              <span className="text-[11px] uppercase tracking-wide text-muted">
                numeric · rule check
              </span>
            </div>
            <blockquote className="mt-3 border-l-2 border-line pl-3 text-[15px] font-medium leading-snug text-foreground">
              “Flowdesk starts at ₹4,999 per month.”
            </blockquote>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
              Approved pricing in Pricing sheet v4 is ₹6,499 per month, billed annually. The ₹4,999
              price was superseded on 2026-03-31.
            </p>
            <div className="mt-3 flex items-center justify-between rounded-[4px] border border-line bg-panel px-2.5 py-1 text-[11px] font-mono text-muted">
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-slate">[RULE]</span>
                <span>rule:numeric-scalar-bounds</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-slate">
                Inspect evidence
                <ArrowRight size={10} aria-hidden="true" />
              </span>
            </div>
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
            <p className="mt-3 flex items-start gap-2 text-[12px] leading-snug text-foreground/90">
              <Lightbulb size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-v-stale-fg" />
              <span>
                <span className="font-semibold">Suggested correction: </span>
                Update pricing to ₹6,499 per month, billed annually.
              </span>
            </p>
          </Card>
        </div>
      </section>

      {/* 2. Proof strip */}
      <section className="mt-12 border-y border-line py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums">24/24</p>
            <p className="text-xs text-muted">eval cases</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">51</p>
            <p className="text-xs text-muted">unit tests</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">78%</p>
            <p className="text-xs text-muted">claims resolved with zero model calls</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">6</p>
            <p className="text-xs text-muted">verdict states</p>
          </div>
        </div>
      </section>

      {/* 3. Problem */}
      <section className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">The problem</h2>
        <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-foreground/90">
          <p>
            A sentence that was accurate in March is wrong in June, and no ordinary review catches a
            claim that used to be correct.
          </p>
          <p>
            Reviewers resolve the doubt by asking a colleague, because there is no record to check
            against — only memory and a Slack thread.
          </p>
          <p>
            Proofline gives that sentence a verdict, with the exact source behind it, or an honest
            refusal to judge.
          </p>
        </div>
        <p className="mt-5 rounded-[4px] border border-line-strong bg-panel px-4 py-3 font-mono text-[13px] text-foreground">
          Before: “Flowdesk starts at ₹4,999.” After: CONTRADICTED · F-021 · Pricing sheet v4 · valid
          2026-04-01 → 2027-03-31
        </p>
      </section>

      {/* 4. How it works */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", title: "Paste a draft", body: "Or load the seeded sample. One textarea, one action." },
            {
              n: "2",
              title: "Rules decide first",
              body: "Numbers, dates, names and disclaimers resolve in TypeScript; the model only reads what rules cannot.",
            },
            {
              n: "3",
              title: "A person decides",
              body: "Every finding shows its source span and version; the decision and reason land in the audit log.",
            },
          ].map((s) => (
            <li key={s.n} className="rounded-[6px] border border-line-strong bg-card p-5">
              <span className="font-mono text-xs font-semibold text-accent">[{s.n}]</span>
              <h3 className="mt-2 text-[15px] font-semibold">{s.title}</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Capability blocks */}
      <section className="mt-24 space-y-16">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold tracking-tight">Versioned register with validity windows</h3>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-foreground/90">
              Forty approved facts across two products, each pinned to a version, an approver, and a
              validity window. Stale and conflicting rows are detected, not hidden.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/screenshots/facts.png"
              alt="Fact register table showing version, validity window and approver"
              className="w-full rounded-[6px] border border-line-strong"
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <img
              src="/screenshots/evidence.png"
              alt="Evidence drawer with the underlined source span"
              className="w-full rounded-[6px] border border-line-strong"
            />
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <h3 className="text-xl font-bold tracking-tight">Marked-up draft with span-level evidence</h3>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-foreground/90">
              The draft is marked up inline; every finding cites the document, the span, the fact
              version and the dates. Nothing is paraphrased by the model.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold tracking-tight">Audit log with the decision trace</h3>
            <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-foreground/90">
              Approve, reject, or request an edit with a reason. Each entry records the verdict, the
              fact id and the trace — RULE or MODEL — behind it.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/screenshots/dashboard.png"
              alt="Dashboard with verdict counts and decision trace"
              className="w-full rounded-[6px] border border-line-strong"
            />
          </div>
        </div>
      </section>

      {/* 6. Security and compliance */}
      <section className="mt-24 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Security and compliance</h2>
        <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-foreground/90">
          <li>No sign-in required.</li>
          <li>Nothing you type is stored server-side.</li>
          <li>Decisions live in this browser&apos;s localStorage; one button clears them.</li>
          <li>No PII collected.</li>
          <li>
            The model sees only the claim and up to five candidate facts, never the whole draft.
          </li>
          <li>Nothing auto-publishes.</li>
        </ul>
      </section>

      {/* 7. FAQ */}
      <section className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
        <div className="mt-6 space-y-4">
          {[
            {
              q: "How is this different from a grammar checker?",
              a: "A grammar checker fixes language. Proofline checks facts: pricing, limits, dates, and required disclaimers against an approved register.",
            },
            {
              q: "What happens when the model is unavailable?",
              a: "Qualitative claims return UNVERIFIED with an explicit reason. Deterministic checks still run, and nothing is faked.",
            },
            {
              q: "Can I trust a CONTRADICTED verdict?",
              a: "It ships only with a complete evidence record — fact id, version, document, span, and validity window — enforced by a runtime assertion in code.",
            },
            {
              q: "Does it store my content?",
              a: "No. Drafts are checked in one request and discarded. Decisions stay in this browser only.",
            },
            {
              q: "What does it not do?",
              a: "No file upload, OCR, visual checks, open-web fact checking, multi-brand, or auto-publishing.",
            },
          ].map((f) => (
            <details key={f.q} className="rounded-[6px] border border-line-strong bg-card p-4">
              <summary className="cursor-pointer text-[15px] font-semibold">{f.q}</summary>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="mt-24 rounded-[6px] border border-line-strong bg-panel px-6 py-12 text-center">
        <p className="mx-auto max-w-2xl text-[18px] font-medium leading-snug text-foreground">
          Every marketing claim checked against approved facts.
        </p>
        <div className="mt-6">
          <Link
            href="/check"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Open the checker
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Verdict legend */}
      <section className="mt-16 border-t border-line pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          The six verdicts
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {VERDICTS.map((v) => (
            <li key={v.verdict} className="flex flex-col items-start gap-1.5">
              <VerdictBadge verdict={v.verdict as Verdict} />
              <span className="text-[11px] leading-snug text-muted">{v.meaning}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
