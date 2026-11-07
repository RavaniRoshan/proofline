import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { ShieldCheck, Zap, Lock, Terminal, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Overview & Quickstart — Proofline Documentation",
  description: "Introduction to Proofline deterministic claim verification and developer quickstart.",
};

export default function DocsOverviewPage() {
  return (
    <DocsPage>
      <DocsTitle>Overview &amp; Quickstart</DocsTitle>
      <DocsDescription>
        Deterministic claim governance for high-stakes marketing, pricing, and product copy.
      </DocsDescription>
      <DocsBody>
        <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-primary">
              <Zap className="size-4" />
              <span>0.4MS FAST PATH</span>
            </div>
            <h4 className="mt-2 text-base font-medium text-foreground">78% Resolved Deterministically</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Stage 1 scalar TypeScript rules evaluate currency, seat quotas, and date windows at $0 LLM cost.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
              <span>EVIDENCE GATE</span>
            </div>
            <h4 className="mt-2 text-base font-medium text-foreground">6-Field Provenance Proof</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Refuses to emit a contradiction unless fact ID, version, doc ID, span, and validity dates resolve.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Lock className="size-4" />
              <span>LOCAL-FIRST PRIVACY</span>
            </div>
            <h4 className="mt-2 text-base font-medium text-foreground">Zero Server Draft Retention</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Drafts are checked in memory; reviewer sign-offs persist strictly in client local storage.
            </p>
          </div>
        </div>

        <h2>Why Proofline Exists</h2>
        <p>
          Generative AI tools and LLM evaluators struggle with exact scalars—currency conversions, active promotion
          windows, seat minimums, and service level agreements (SLAs). In marketing and legal review, hallucinating that
          a price is valid when it expired yesterday creates commercial liability.
        </p>
        <p>
          Proofline introduces a <strong>3-Stage Deterministic Routing Pipeline</strong> that resolves objective
          factual assertions before any generative model is ever consulted.
        </p>

        <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-4 py-2.5 font-mono text-xs text-muted-foreground flex items-center justify-between">
            <span>TERMINAL VERIFICATION DEMO</span>
            <span className="text-emerald-600 dark:text-emerald-400">STAGE 1 DETERMINISTIC</span>
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`$ npx tsx scripts/smoke.ts

[EVAL CASE 01] "Flowdesk Starter begins at ₹4,999 per month"
  -> Segmenter: Extracted numeric price assertion: "₹4,999/mo"
  -> Scalar Normalizer: 4999 INR / month (0.38ms)
  -> Fact Lineage: F-021 (v4.0 ACTIVE APPROVED) Ground truth: ₹6,499/mo
  -> Evidence Gate: Byte span [412..468] resolved in DOC-003
  => VERDICT: CONTRADICTED (0 tokens consumed, $0.00 cost)`}
          </pre>
        </div>

        <h2>The 3-Stage Pipeline Architecture</h2>
        <ol>
          <li>
            <strong>Stage 1 · Deterministic TypeScript Engine</strong>: Pure scalar normalizers evaluate numeric,
            currency (₹ / $), seat quota, storage, and calendar ranges using strict AST matching.
          </li>
          <li>
            <strong>Stage 2 · Lexical Top-5 Grounding</strong>: High-speed token n-gram alignment retrieves the closest
            registered fact candidates from <code>seed/facts.json</code>.
          </li>
          <li>
            <strong>Stage 3 · Bounded Model Evaluation</strong>: For subjective semantic claims, Proofline invokes a
            strictly bounded model pass gated by zero temperature and JSON schema enforcement.
          </li>
        </ol>

        <h2>Quick Links &amp; Next Steps</h2>
        <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/docs/architecture"
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-foreground text-sm">Deterministic Engine Spec</div>
              <div className="text-xs text-muted-foreground mt-0.5">Explore 0.4ms TypeScript rules and AST matching</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>

          <Link
            href="/docs/evidence-gate"
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-foreground text-sm">6-Field Evidence Gate</div>
              <div className="text-xs text-muted-foreground mt-0.5">How the downgrade invariant stops hallucinations</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>

          <Link
            href="/docs/api-reference"
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-foreground text-sm">REST API (POST /api/verify)</div>
              <div className="text-xs text-muted-foreground mt-0.5">Automate copy verification via stateless JSON payloads</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>

          <Link
            href="/docs/typescript-sdk"
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-foreground text-sm">TypeScript SDK (verifyDraft)</div>
              <div className="text-xs text-muted-foreground mt-0.5">Run headless CI/CD checks before git commits</div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
