import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { EvidenceGateInspectorBento } from "@/components/landing/bento/EvidenceGateInspectorBento";

export const metadata = {
  title: "6-Field Evidence Gate & Invariant Proofs — Proofline Documentation",
  description: "The mathematical and procedural invariants protecting against false claim accusations.",
};

export default function DocsEvidenceGatePage() {
  return (
    <DocsPage>
      <DocsTitle>6-Field Evidence Gate &amp; Invariants</DocsTitle>
      <DocsDescription>
        The runtime shear line stopping unbacked accusations and hallucinated citations.
      </DocsDescription>
      <DocsBody>
        <p>
          In a claim governance engine, a false accusation (falsely claiming an honest marketer's copy is
          <code>CONTRADICTED</code>) is just as damaging as letting false copy through.
        </p>
        <p>
          The <strong>Evidence Gate</strong> is an invariant codified directly in <code>lib/verdict.ts</code> that
          refuses to serialize a <code>CONTRADICTED</code> verdict unless every single one of the 6 proof fields
          resolves with 100% precision.
        </p>

        <h2>The 6 Mandatory Proof Fields</h2>
        <div className="not-prose my-6 space-y-3">
          {[
            { num: "01", name: "fact_id", desc: "Canonical identifier in the owner-approved register (e.g. F-021)." },
            { num: "02", name: "fact_version", desc: "Active version key (e.g. v4.0). Superseded versions cannot stand as active truth." },
            { num: "03", name: "source_document_id", desc: "Primary source document provenance key (e.g. DOC-003)." },
            { num: "04", name: "source_span", desc: "Exact character byte span [start, end] indexing into the document text (e.g. [412, 468])." },
            { num: "05", name: "valid_from", desc: "ISO 8601 validity window start date (e.g. 2026-04-01)." },
            { num: "06", name: "valid_until", desc: "ISO 8601 validity window expiration date (e.g. 2027-03-31)." },
          ].map((field) => (
            <div key={field.name} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5">
              <span className="font-mono text-xs font-bold text-primary shrink-0">{field.num}</span>
              <div>
                <code className="font-mono text-xs font-semibold text-foreground">{field.name}</code>
                <p className="mt-0.5 text-xs text-muted-foreground">{field.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Interactive Evidence Gate Inspector</h2>
        <p>
          Toggle between a valid 6-field citation and an unbacked span below to see how the engine asserts byte-level ground truth and prevents false contradictions.
        </p>
        <div className="not-prose my-6">
          <EvidenceGateInspectorBento />
        </div>

        <h2>The Downgrade Invariant</h2>
        <p>
          If any evaluation engine (human, scalar rule, or bounded LLM) attempts to emit <code>CONTRADICTED</code> but
          fails to resolve any one of these 6 fields (such as a missing source document span or an expired validity date):
        </p>
        <blockquote>
          <strong>Downgrade Rule</strong>: The engine intercepts the finding and forcibly downgrades the verdict to{" "}
          <code>UNVERIFIABLE</code>. It logs a warning in the decision trace:{" "}
          <em>"Evidence Gate: Incomplete citation provenance. Downgraded to protect reviewer integrity."</em>
        </blockquote>

        <h2>Verdict Taxonomy</h2>
        <p>Proofline uses a formal 5-state verdict lattice:</p>
        <div className="not-prose my-4 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Verdict</th>
                <th className="py-2 pr-4">Definition</th>
                <th className="py-2">Evidence Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">SUPPORTED</td>
                <td className="py-2.5 font-sans">Claim matches ground truth fact within active date window.</td>
                <td className="py-2.5">Fact ID + Source Span</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-rose-600 dark:text-rose-400">CONTRADICTED</td>
                <td className="py-2.5 font-sans">Claim directly conflicts with approved fact. Fix required.</td>
                <td className="py-2.5">All 6 Proof Fields</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-amber-600 dark:text-amber-400">STALE</td>
                <td className="py-2.5 font-sans">Claim references fact with expired validity window.</td>
                <td className="py-2.5">Fact ID + Validity Dates</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-orange-600 dark:text-orange-400">CONFLICTING</td>
                <td className="py-2.5 font-sans">Two active register documents contradict each other.</td>
                <td className="py-2.5">Two conflicting Fact IDs</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-muted-foreground">UNVERIFIABLE</td>
                <td className="py-2.5 font-sans">Assertion cannot be mapped to any registered product fact.</td>
                <td className="py-2.5">None</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs/architecture" className="text-sm text-muted-foreground hover:text-foreground">
            ← Architecture
          </Link>
          <Link href="/docs/fact-register" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>Fact Register Schema</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
