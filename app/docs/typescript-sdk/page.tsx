import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { Code, Terminal, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "TypeScript SDK (verifyDraft) — Proofline Documentation",
  description: "Pure function in-memory copy verification library for CI/CD gates and headless apps.",
};

export default function DocsTypeScriptSdkPage() {
  return (
    <DocsPage>
      <DocsTitle>TypeScript SDK (verifyDraft)</DocsTitle>
      <DocsDescription>
        Zero network latency, pure function execution for pre-commit hooks, GitHub Actions, and headless apps.
      </DocsDescription>
      <DocsBody>
        <p>
          For local development and automated deployment gates, Proofline can be imported directly as a pure TypeScript
          function library without requiring an HTTP server or remote network connection.
        </p>

        <h2>Installation</h2>
        <div className="not-prose my-4 overflow-hidden rounded-xl border border-border bg-card">
          <pre className="p-4 font-mono text-xs leading-relaxed text-foreground">
            npm install @proofline/engine zod
          </pre>
        </div>

        <h2>Core Usage: verifyDraft()</h2>
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
            EXAMPLE INTEGRATION
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`import { verifyDraft } from "@/lib/verify";

const draftCopy = "Flowdesk Starter begins at ₹4,999 per month with 5 team workspaces.";

const result = await verifyDraft(draftCopy, {
  reviewDate: new Date("2026-11-07"),
  enforceEvidenceGate: true,
});

if (result.findings.some(f => f.verdict === "CONTRADICTED")) {
  console.error("❌ Blocked: Marketing copy contains superseded pricing!");
  process.exit(1);
} else {
  console.log("✅ Passed: All claims verified against owner facts.");
}`}
          </pre>
        </div>

        <h2>Pre-commit Hook Integration</h2>
        <p>You can run Proofline in a Husky pre-commit hook or GitHub Actions workflow to gate markdown files:</p>
        <pre className="not-prose rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
          npx tsx scripts/smoke.ts
        </pre>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs/api-reference" className="text-sm text-muted-foreground hover:text-foreground">
            ← REST API Reference
          </Link>
          <Link href="/docs/security-compliance" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>Security &amp; Privacy</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
