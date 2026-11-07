import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/layouts/docs/page";
import Link from "next/link";
import { Code, Terminal, Network, ArrowRight } from "lucide-react";
import { ApiPlayground } from "@/components/landing/ApiPlayground";

export const metadata = {
  title: "REST API Reference (POST /api/verify) — Proofline Documentation",
  description: "Complete API specification for Proofline's headless draft copy verification endpoint.",
};

export default function DocsApiReferencePage() {
  return (
    <DocsPage>
      <DocsTitle>REST API Reference</DocsTitle>
      <DocsDescription>
        Headless HTTP endpoint for continuous integration, CMS webhooks, and copy preflight checks.
      </DocsDescription>
      <DocsBody>
        <h2>Endpoint Overview</h2>
        <div className="not-prose my-4 flex items-center gap-3 rounded-lg border border-border bg-card p-4 font-mono text-xs">
          <span className="rounded bg-primary/10 px-2 py-1 font-bold text-primary">POST</span>
          <span className="text-foreground">https://proofline.app/api/verify</span>
        </div>

        <p>
          Stateless execution with zero persistent storage. Accepts draft text and returns an array of segmented claims,
          canonical scalar values, matched fact IDs, and Evidence Gate citations.
        </p>

        <h2>Request Headers</h2>
        <div className="not-prose my-4 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4">Header</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2 font-bold text-foreground">Content-Type</td>
                <td className="py-2 text-muted-foreground">string</td>
                <td className="py-2 font-sans">Must be <code>application/json</code></td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-foreground">x-review-date</td>
                <td className="py-2 text-muted-foreground">string (optional)</td>
                <td className="py-2 font-sans">Simulated review date (defaults to current server date)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Request Body Schema</h2>
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
            JSON REQUEST BODY
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`{
  "draft": "Flowdesk Starter begins at ₹4,999 per month with 5 team workspaces.",
  "brand_id": "B-flowdesk",
  "review_date": "2026-11-07"
}`}
          </pre>
        </div>

        <h2>Response Body Schema</h2>
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
            JSON RESPONSE (HTTP 200 OK)
          </div>
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`{
  "summary": {
    "total_claims": 2,
    "deterministic_resolved": 2,
    "model_resolved": 0,
    "latency_ms": 0.42
  },
  "findings": [
    {
      "claim_id": "CLM-001",
      "verdict": "CONTRADICTED",
      "claim_text": "Flowdesk Starter begins at ₹4,999 per month",
      "char_span": [0, 43],
      "stage": "STAGE_1_DETERMINISTIC",
      "evidence": {
        "fact_id": "F-021",
        "fact_version": "v4.0",
        "source_document_id": "DOC-003",
        "source_span": [412, 468],
        "valid_from": "2026-04-01",
        "valid_until": "2027-03-31"
      },
      "suggested_fix": "Update pricing to ₹6,499 per month as approved in Pricing-SLA-Q2-2026.pdf"
    }
  ]
}`}
          </pre>
        </div>

        <h2>Live Interactive API Playground</h2>
        <p>
          Execute live POST requests directly against <code>/api/verify</code> in this browser session. Inspect the returned JSON payload and deterministic latency:
        </p>
        <div className="not-prose my-6">
          <ApiPlayground />
        </div>

        <h2>Example cURL Execution</h2>
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card">
          <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
{`curl -X POST https://proofline.app/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "draft": "Flowdesk Starter begins at ₹4,999 per month with 5 team workspaces.",
    "brand_id": "B-flowdesk"
  }'`}
          </pre>
        </div>

        <div className="not-prose mt-8 flex justify-between border-t border-border pt-6">
          <Link href="/docs/fact-register" className="text-sm text-muted-foreground hover:text-foreground">
            ← Fact Register Schema
          </Link>
          <Link href="/docs/typescript-sdk" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            <span>TypeScript SDK</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DocsBody>
    </DocsPage>
  );
}
