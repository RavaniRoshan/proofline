import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "About" };

const REPO = "https://github.com/SHIVAMKUMAR10958/proofline";

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">About</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">What Proofline is.</h1>

      <div className="mt-4 flex flex-col gap-3 text-[16px] leading-relaxed text-foreground/90">
        <p>
          Proofline checks a marketing draft against an owner-approved, versioned register of product
          facts, and returns one of six verdicts per claim — with the source document, the exact span,
          the fact version and the validity dates behind it.
        </p>
        <p>
          Numbers, dates, currency, product names, terminology and disclaimers are decided
          deterministically in code; a model is only consulted for claims those rules cannot settle,
          and it returns fact ids only — never citations, spans or dates.
        </p>
        <p>
          It refuses to guess: when the register does not contain an approved answer, the finding is
          marked UNVERIFIED, and a human decides what ships. Nothing is published, filed or sent
          anywhere by this tool.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <FileText size={17} aria-hidden="true" />
          Round 1 plan &amp; PDF
        </a>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-card px-5 text-[15px] font-semibold text-accent transition-colors hover:border-accent"
        >
          <ShieldCheck size={17} aria-hidden="true" />
          Check a draft
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          What this does not do
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-foreground/80">
          <li>No file upload, OCR or visual/accessibility checking — paste text only.</li>
          <li>No open-web fact checking — only the owner-approved register is consulted.</li>
          <li>No multi-brand, no agencies, no integrations, no accounts, no auto-publishing.</li>
          <li>No real facts — every number here belongs to a fictional brand (Flowdesk) and exists to demo the workflow.</li>
        </ul>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          How it decides
        </h2>
        <p className="mt-1.5 text-[14px] leading-relaxed text-foreground/80">
          Four stages: deterministic extraction and normalisation → a labelled smoke gate over the
          seeded register → a single model call with at most five candidate facts → a verdict computed
          in code from the model&apos;s relation and confidence plus the evidence lookup. An evidence
          gate in code asserts that no CONTRADICTED verdict ships without a complete, resolvable
          record; otherwise the finding downgrades to UNVERIFIED.
        </p>
      </section>
    </div>
  );
}
