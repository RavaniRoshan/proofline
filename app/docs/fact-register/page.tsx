import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { Database, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { RegisterLineageBento } from "@/components/landing/bento/RegisterLineageBento";

export const metadata = {
  title: "Fact Register & Lineage Schema — Proofline Documentation",
  description: "Structure of owner-approved ground truth facts, validity windows, and source documents.",
};

export default function DocsFactRegisterPage() {
  return (
    <DocsPage>
      <DocsTitle>Fact Register &amp; Lineage Schema</DocsTitle>
      <DocsDescription>
        Version-controlled ground truth records with owner signatures and temporal bounds.
      </DocsDescription>
      <DocsBody>
        <p>
          The ground truth dataset lives in <code>seed/facts.json</code>. It contains 42 meticulously curated facts
          spanning pricing, SLAs, seat tiers, storage limits, and security certifications for Flowdesk.
        </p>

        <h2>Fact Record Schema</h2>
        <p>Each fact entry adheres to a strict Zod schema:</p>
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
            TYPESCRIPT SCHEMA DEFINITION
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`export interface FactRecord {
  fact_id: string;              // e.g. "F-021"
  fact_version: string;          // e.g. "v4.0"
  status: "ACTIVE" | "SUPERSEDED" | "ARCHIVED";
  category: "pricing" | "sla" | "security" | "limits";
  assertion: string;            // Canonical claim text
  scalar_value?: number;        // e.g. 6499
  scalar_unit?: string;         // e.g. "INR/mo"
  valid_from: string;           // ISO date: "2026-04-01"
  valid_until: string;          // ISO date: "2027-03-31"
  source_document_id: string;   // e.g. "DOC-003"
  source_span: [number, number];// [412, 468]
  owner: {
    name: string;               // "VP Product Marketing"
    approved_at: string;        // "2026-03-28"
    signature_hash: string;     // sha256:...
  };
}`}
          </pre>
        </div>

        <h2>Lineage &amp; Supersession Semantics</h2>
        <p>
          Facts are never deleted or mutated in place. When pricing changes (such as Flowdesk Starter changing from
          <code>₹4,999</code> to <code>₹6,499</code>), a new version is appended:
        </p>
        <ul>
          <li><strong>v3.0 (Superseded)</strong>: Validity window <code>2025-10-01</code> to <code>2026-03-31</code>.</li>
          <li><strong>v4.0 (Active Approved)</strong>: Validity window <code>2026-04-01</code> to <code>2027-03-31</code>.</li>
        </ul>
        <p>
          If marketing copy states the old price after <code>2026-04-01</code>, the engine flags it as{" "}
          <code>CONTRADICTED</code> with a clear lineage trace showing the exact amendment that superseded it.
        </p>

        <h2>Interactive Version Lineage Explorer</h2>
        <p>
          Explore the version history of Fact F-021 below to see cryptographic signatures, source character spans, and temporal transitions:
        </p>
        <div className="not-prose my-6">
          <RegisterLineageBento />
        </div>

        <h2>Automated Seed Validation</h2>
        <p>
          Before any build or deployment, Python and TypeScript harnesses validate that byte spans correspond to the
          exact character indices in the attached source documents:
        </p>
        <pre className="not-prose rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
          python scripts/validate_seed.py
        </pre>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs/evidence-gate" className="text-sm text-muted-foreground hover:text-foreground">
            ← 6-Field Evidence Gate
          </Link>
          <Link href="/docs/api-reference" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>REST API Reference</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
