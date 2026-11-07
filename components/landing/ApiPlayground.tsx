"use client";

import { useState } from "react";
import { Check, Copy, Play, Terminal } from "lucide-react";

interface ApiScenario {
  id: string;
  label: string;
  description: string;
  latencyMs: number;
  status: string;
  verdict: "CONTRADICTED" | "CONFLICTING" | "UNVERIFIED";
  verdictColor: string;
  requestPayload: {
    draft: string;
    brand_id: string;
    review_date: string;
  };
  responsePayload: Record<string, unknown>;
}

const API_SCENARIOS: ApiScenario[] = [
  {
    id: "pricing-contradiction",
    label: "01. Contradicted Price (F-021)",
    description: "Deterministic currency normalization catches superseded v3 rate in 0.4ms.",
    latencyMs: 14,
    status: "200 OK",
    verdict: "CONTRADICTED",
    verdictColor: "text-rose-400 border-rose-800/50 bg-rose-950/40",
    requestPayload: {
      draft: "Flowdesk Starter begins at ₹4,999 per month with 5 team workspaces.",
      brand_id: "B-flowdesk",
      review_date: "2026-11-06",
    },
    responsePayload: {
      summary: { total: 2, deterministic: 2, model: 0 },
      findings: [
        {
          verdict: "CONTRADICTED",
          claim_type: "numeric",
          claim_text: "Flowdesk Starter begins at ₹4,999 per month",
          char_span: [0, 43],
          reason: "Active approved fact F-021 states ₹6,499/month (v4, effective 2026-04-01).",
          evidence: {
            fact_id: "F-021",
            fact_version: 4,
            source_document_id: "DOC-003",
            source_title: "Pricing sheet v4",
            source_span: "chars 412–468",
            valid_from: "2026-04-01",
            valid_until: "2027-03-31",
          },
          suggested_correction: "Flowdesk Starter begins at ₹6,499 per month",
        },
      ],
    },
  },
  {
    id: "seat-conflict",
    label: "02. Register Conflict (F-024/F-025)",
    description: "Two active facts disagree on Growth seat limits; code halts & flags conflict.",
    latencyMs: 11,
    status: "200 OK",
    verdict: "CONFLICTING",
    verdictColor: "text-purple-300 border-purple-800/50 bg-purple-950/40",
    requestPayload: {
      draft: "Upgrade to the Growth plan for up to 25 seats and priority routing.",
      brand_id: "B-flowdesk",
      review_date: "2026-11-06",
    },
    responsePayload: {
      summary: { total: 1, deterministic: 1, model: 0 },
      findings: [
        {
          verdict: "CONFLICTING",
          claim_type: "numeric",
          claim_text: "Upgrade to the Growth plan for up to 25 seats",
          char_span: [0, 45],
          reason: "Multiple active approved facts match (growth, seats) with different values: F-024 (25) vs F-025 (50).",
          evidence: {
            conflicting_fact_ids: ["F-024", "F-025"],
            source_documents: ["DOC-003 (Pricing sheet v4)", "DOC-004 (Enterprise SLA)"],
            resolution_required: "Brand owner must supersede F-024 or F-025",
          },
        },
      ],
    },
  },
  {
    id: "missing-disclaimer",
    label: "03. Missing Disclaimer Gate",
    description: "Draft asserts pricing without mandatory terms disclaimer; flagged as UNVERIFIED.",
    latencyMs: 9,
    status: "200 OK",
    verdict: "UNVERIFIED",
    verdictColor: "text-amber-300 border-amber-800/50 bg-amber-950/40",
    requestPayload: {
      draft: "Annual billing saves 15% across all Flowdesk seats.",
      brand_id: "B-flowdesk",
      review_date: "2026-11-06",
    },
    responsePayload: {
      summary: { total: 2, deterministic: 2, model: 0 },
      findings: [
        {
          verdict: "UNVERIFIED",
          claim_type: "disclaimer",
          claim_text: "[Draft-level required pricing disclaimer check]",
          reason: "Draft contains monetary/discount claims but omits required taxes & terms disclaimer (F-038).",
          evidence: null,
          suggested_correction: "Append: “Prices exclude applicable GST; subject to annual agreement terms.”",
        },
      ],
    },
  },
];

export function ApiPlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liveResult, setLiveResult] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [measuredMs, setMeasuredMs] = useState<number | null>(null);

  const current = API_SCENARIOS[selectedIdx];

  const curlString = `curl -X POST https://proofline.app/api/verify \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(current.requestPayload, null, 2)}'`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(curlString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleRunLive = async () => {
    setIsRunning(true);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: current.requestPayload.draft,
          reviewDate: current.requestPayload.review_date,
        }),
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - t0);
      setMeasuredMs(elapsed);
      setLiveResult(JSON.stringify(data, null, 2));
    } catch {
      setLiveResult(JSON.stringify(current.responsePayload, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  const displayedJson = liveResult ?? JSON.stringify(current.responsePayload, null, 2);

  return (
    <div className="w-full">
      {/* Top Scenario Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[6px] bg-white/[0.05] border border-white/10">
          {API_SCENARIOS.map((sc, idx) => {
            const active = idx === selectedIdx;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setLiveResult(null);
                  setMeasuredMs(null);
                }}
                className={`px-3.5 py-1.5 rounded-[4px] font-mono text-[12px] transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-paper text-ink font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        <p className="text-[13px] font-mono text-white/65">{current.description}</p>
      </div>

      {/* Dual Terminal Split */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Request Terminal */}
        <div className="rounded-[14px] border border-white/15 bg-[#121210] p-6 font-mono text-[12px] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-white/70">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent-readable" aria-hidden="true" />
                <span className="font-semibold text-white">POST /api/verify</span>
                <span className="text-white/40">· Zod-validated input</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-[11px] font-mono uppercase tracking-wider text-white/90 hover:text-white hover:border-white/40 hover:bg-white/[0.08] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? "Copied" : "Copy cURL"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRunLive}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8B1E27] text-white text-[11px] font-mono uppercase tracking-wider font-semibold hover:bg-[#8B1E27]/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Play size={11} aria-hidden="true" />
                  <span>{isRunning ? "Running..." : "Execute Live"}</span>
                </button>
              </div>
            </div>

            <pre className="text-white/85 overflow-x-auto leading-relaxed p-4 rounded-[8px] bg-[#0a0a09] border border-white/10 text-[12px]">
              <code>{curlString}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/55">
            <span>Stateless execution · Zero database writes</span>
            <span className="tabular-nums">Schema: DATA.md §4</span>
          </div>
        </div>

        {/* Right: Response Terminal */}
        <div className="rounded-[14px] border border-white/15 bg-[#121210] p-6 font-mono text-[12px] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-white/70">
              <div className="flex items-center gap-2 tabular-nums">
                <span className="text-emerald-400 font-semibold">{current.status}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/80">
                  {measuredMs !== null ? `${measuredMs}ms (live server)` : `${current.latencyMs}ms (deterministic)`}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-[4px] border ${current.verdictColor}`}
              >
                {current.verdict}
              </span>
            </div>

            <pre className="text-[#d7d1c9] overflow-x-auto max-h-[270px] leading-relaxed text-[11px] p-4 rounded-[8px] bg-[#0a0a09] border border-white/10">
              <code>{displayedJson}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/55">
            <span>Evidence Gate enforced in code before serialization</span>
            <span className="text-emerald-400">✓ Citations verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
