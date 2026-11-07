import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { Lock, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { AuditLedgerBento } from "@/components/landing/bento/AuditLedgerBento";

export const metadata = {
  title: "Local-First Privacy & Zero Retention — Proofline Documentation",
  description: "Security architecture, in-memory execution boundaries, and SOC 2 Type II controls.",
};

export default function DocsSecurityCompliancePage() {
  return (
    <DocsPage>
      <DocsTitle>Local-First Privacy &amp; Zero Retention</DocsTitle>
      <DocsDescription>
        Enterprise-grade privacy guarantees, zero server data persistence, and cryptographic auditability.
      </DocsDescription>
      <DocsBody>
        <h2>Zero Server Retention Policy</h2>
        <p>
          High-stakes marketing copy often contains confidential unreleased product names, embargoed pricing tiers, and
          strategic roadmap plans. Sending this prose to third-party databases exposes companies to leaks and IP theft.
        </p>
        <p>
          Proofline is designed with a strict <strong>Zero Server Draft Retention Invariant</strong>:
        </p>
        <ul>
          <li><strong>Stateless Execution</strong>: Drafts are verified in transient memory within the request cycle.</li>
          <li><strong>Zero Prose Persistence</strong>: Neither draft text nor proposed edits are ever written to remote disk or databases.</li>
          <li><strong>No Model Training</strong>: Customer copy is never used to train, tune, or evaluate foundation models.</li>
        </ul>

        <h2>Local Storage Journal (`proofline.v1`)</h2>
        <p>
          Reviewer sign-offs, fact approvals, and decision logs persist strictly within the user’s browser storage at:
        </p>
        <pre className="not-prose rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
          localStorage.getItem("proofline.v1.decisions")
        </pre>
        <p>
          This guarantees that reviewers can evaluate copy offline or in an incognito window with total privacy.
        </p>

        <h2>SHA-256 Decision Signing &amp; Merkle Chain</h2>
        <p>
          Every verified decision record generates a cryptographic SHA-256 hash chaining back to the previous decision:
        </p>
        <pre className="not-prose rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
          sha256(decision_id + fact_id + reviewer_key + timestamp + previous_hash)
        </pre>
        <p>
          This provides legal teams with an immutable audit trail for defense against false advertising claims without
          persisting the proprietary marketing text itself on external servers.
        </p>

        <h2>Interactive SOC 2 Compliance Ledger &amp; Export</h2>
        <p>
          Inspect the immutable Merkle chain records below or download the cryptographic audit ledger directly as JSON:
        </p>
        <div className="not-prose my-6">
          <AuditLedgerBento />
        </div>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs/typescript-sdk" className="text-sm text-muted-foreground hover:text-foreground">
            ← TypeScript SDK
          </Link>
          <Link href="/check" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>Try the Preflight Checker</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
