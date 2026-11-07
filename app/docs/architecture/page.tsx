import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { Cpu, Zap, Code, ShieldAlert, ArrowRight } from "lucide-react";
import { DeterministicRoutingBento } from "@/components/landing/bento/DeterministicRoutingBento";

export const metadata = {
  title: "Deterministic Verification Engine — Proofline Documentation",
  description: "Detailed specification of the 3-stage deterministic routing pipeline.",
};

export default function DocsArchitecturePage() {
  return (
    <DocsPage>
      <DocsTitle>Deterministic Verification Engine</DocsTitle>
      <DocsDescription>
        0.4ms TypeScript scalar normalization, lexical grounding, and bounded model routing.
      </DocsDescription>
      <DocsBody>
        <p>
          Proofline rejects the naive industry pattern of piping entire marketing documents into an unconstrained
          LLM. That architecture produces high latency (1–4 seconds per check), non-deterministic decisions, and
          hallucinated citations.
        </p>

        <h2>The Three Stages</h2>

        <h3>Stage 1: Pure TypeScript AST &amp; Scalar Normalizer</h3>
        <p>
          Runs entirely in memory with <code>lib/normalize.ts</code>. It parses structured scalars using strict regex
          grammars:
        </p>
        <ul>
          <li><strong>Currency Scalars</strong>: Normalizes <code>₹4,999</code>, <code>4999 INR</code>, <code>$49/mo</code> into canonical integer cents/paise with ISO currency codes.</li>
          <li><strong>Storage &amp; Quota Bounds</strong>: Parses <code>250 GB</code>, <code>5 workspaces</code>, <code>10 team seats</code> into integer values.</li>
          <li><strong>Calendar Windows</strong>: Evaluates validity against review dates (e.g. <code>2026-04-01</code> to <code>2027-03-31</code>).</li>
        </ul>
        <p>
          <strong>Performance Benchmark</strong>: Evaluates in <strong>0.38ms</strong> with zero LLM API calls, zero token
          costs, and 100% deterministic reproducibility.
        </p>

        <h3>Stage 2: Lexical Top-5 Grounding</h3>
        <p>
          When claims involve named features or SLA clauses, <code>lib/resolve.ts</code> performs an n-gram token overlap
          across all 42 registered facts in <code>seed/facts.json</code>.
        </p>
        <p>
          It ranks candidates by lexical match score, returning the Top-5 most relevant facts with their respective
          byte spans, document IDs, and active version numbers.
        </p>

        <h3>Stage 3: Bounded Model Routing</h3>
        <p>
          Only when a claim cannot be resolved deterministically (such as high-level marketing positioning claims like
          <em>"Enterprise-grade security trusted by Fortune 500s"</em>) does Proofline route to Stage 3.
        </p>
        <ul>
          <li><strong>Zero Temperature</strong>: Enforces strict factual adherence.</li>
          <li><strong>Structured Zod Schema</strong>: Guarantees the output matches the 6-field Evidence Gate.</li>
          <li><strong>Downgrade Invariant</strong>: If the model cannot provide a byte span, the verdict is downgraded from CONTRADICTED to UNVERIFIABLE.</li>
        </ul>

        <h2>Live Interactive Stage 1 vs Stage 3 Router</h2>
        <p>
          Interact directly with the deterministic router below. Select claims to inspect exact rule execution paths and microsecond latencies.
        </p>
        <div className="not-prose my-6">
          <DeterministicRoutingBento />
        </div>

        <h2>Benchmark Validation Metrics</h2>
        <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="font-mono text-2xl font-bold text-foreground">78%</div>
            <div className="text-xs text-muted-foreground mt-1">Deterministic Split Ratio</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/24</div>
            <div className="text-xs text-muted-foreground mt-1">Smoke Eval Suite Pass</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="font-mono text-2xl font-bold text-primary">111/111</div>
            <div className="text-xs text-muted-foreground mt-1">Vitest Unit Test Suite</div>
          </div>
        </div>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
            ← Overview
          </Link>
          <Link href="/docs/evidence-gate" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>6-Field Evidence Gate</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
