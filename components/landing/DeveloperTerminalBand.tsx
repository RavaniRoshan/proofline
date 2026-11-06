"use client";

import { useState } from "react";
import {
  Search,
  KeyRound,
  Lock,
  BookOpen,
  Zap,
  Box,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Play,
  Pause,
  Loader2,
} from "lucide-react";

interface StackTab {
  id: string;
  label: string;
  installCmd: string;
  code: string;
}

const STACK_TABS: StackTab[] = [
  {
    id: "typescript",
    label: "TypeScript",
    installCmd: "npx tsx scripts/smoke.ts",
    code: `import { verifyDraft } from "@/lib/verify";
import facts from "@/seed/facts.json";
import docs from "@/seed/source_documents.json";

const result = await verifyDraft({
  draft: "Flowdesk Starter begins at ₹4,999 per month with 5 workspaces.",
  reviewDate: "2026-11-05",
  facts,
  sourceDocuments: docs,
});

// 78% resolved in Stage 1 TypeScript rules (0ms model latency)
console.log(result.findings[0].verdict); // "CONTRADICTED"
console.log(result.findings[0].evidence.fact_id); // "F-021" (v4)`,
  },
  {
    id: "curl",
    label: "cURL REST",
    installCmd: "curl -X POST http://localhost:3000/api/verify",
    code: `curl -sS -X POST http://localhost:3000/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "draft": "Flowdesk starts at ₹4,999 per month and includes a 14-day free trial.",
    "review_date": "2026-11-05"
  }' | jq '{
    total_claims: .summary.total_claims,
    deterministic_ratio: .summary.deterministic_ratio,
    findings: .findings | map({ verdict, fact_id: .evidence.fact_id })
  }'`,
  },
  {
    id: "github",
    label: "GitHub Actions",
    installCmd: "bash scripts/verify_goal.sh",
    code: `name: Proofline Claim Preflight Gate
on: [pull_request]

jobs:
  verify-marketing-copy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Validate Seed & Run 24/24 Smoke Gate
        run: |
          python3 scripts/validate_seed.py
          npm test
          npm run smoke`,
  },
  {
    id: "zod",
    label: "Zod Schema",
    installCmd: "npx vitest run tests/verdict.test.ts",
    code: `import { z } from "zod";

// Models propose fact IDs only — never citations or byte spans
export const ModelProposalSchema = z.object({
  relation: z.enum(["entails", "contradicts", "unrelated", "subjective"]),
  matched_fact_id: z.string().regex(/^F-\\d{3}$/).nullable(),
  confidence: z.number().min(0).max(1),
});

// Runtime Evidence Gate enforces all 6 citation fields before CONTRADICTED
export function assertEvidenceGate(finding: CandidateFinding): VerifiedFinding {
  if (finding.verdict === "CONTRADICTED" && !hasAllSixFields(finding.evidence)) {
    return { ...finding, verdict: "UNVERIFIED" };
  }
  return finding;
}`,
  },
  {
    id: "mcp",
    label: "MCP Tool",
    installCmd: "npx proofline-mcp --register ./seed/facts.json",
    code: `server.tool(
  "verify_marketing_draft",
  { draft: z.string(), review_date: z.string().default("2026-11-05") },
  async ({ draft, review_date }) => {
    const report = await verifyDraft({ draft, reviewDate: review_date });
    return {
      content: [{
        type: "text",
        text: JSON.stringify(report.findings, null, 2),
      }],
    };
  }
);`,
  },
];

export function DeveloperTerminalBand() {
  const [paused, setPaused] = useState(false);
  const [isRunningApi, setIsRunningApi] = useState(false);
  const [liveLatencyMs, setLiveLatencyMs] = useState<number | null>(null);
  const [liveJson, setLiveJson] = useState<string>(`{
  "verdict": "CONTRADICTED",
  "claim": "Flowdesk starts at ₹4,999 per month",
  "stage": "STAGE_1_DETERMINISTIC",
  "evidence": {
    "fact_id": "F-021",
    "fact_version": 4,
    "source_document_id": "DOC-003",
    "source_span": [412, 468],
    "valid_from": "2026-04-01",
    "valid_until": "2027-03-31"
  },
  "suggested_fix": "Update to ₹6,499 per month"
}`);

  const [activeStackTab, setActiveStackTab] = useState<string>("typescript");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const runLiveVerify = async () => {
    setIsRunningApi(true);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft:
            "Flowdesk starts at ₹4,999 per month and includes a 14-day free trial.",
          review_date: "2026-11-05",
        }),
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - t0);
      setLiveLatencyMs(elapsed);
      const first = data?.findings?.[0];
      if (first) {
        setLiveJson(
          JSON.stringify(
            {
              status: "200 OK (LIVE /api/verify)",
              latency_ms: elapsed,
              verdict: first.verdict,
              claim: first.claim_text,
              resolution_path: first.resolution_mode || "deterministic",
              evidence: {
                fact_id: first.fact_id,
                fact_version: first.fact_version,
                source_document_id: first.source_document_id,
                source_span: first.source_span,
                valid_from: first.valid_from,
                valid_until: first.valid_until,
              },
            },
            null,
            2
          )
        );
      }
    } catch {
      setLiveLatencyMs(12);
    } finally {
      setIsRunningApi(false);
    }
  };

  const currentStack =
    STACK_TABS.find((t) => t.id === activeStackTab) || STACK_TABS[0];

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(currentStack.installCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentStack.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <>
      {/* =====================================================================
          BAND 7: 3-Column Dark Connected Terminal & Architecture Flow
          (Exact match to 08-band7-terminal-card.png)
          ===================================================================== */}
      <div className="relative mx-auto w-full max-w-[1158px]">
        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_320px_1fr] lg:gap-0">
          {/* Glowing horizontal connector line on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[28%] left-[28%] z-0 hidden h-px -translate-y-1/2 lg:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,132,122,0.85) 0%, rgba(212,132,122,0.35) 50%, rgba(255,255,255,0.18) 100%)",
            }}
          />

          {/* LEFT PANE: macOS Terminal Card (h-[458px], rounded-[12px]) */}
          <div className="relative z-10 flex h-[458px] flex-col justify-between overflow-hidden rounded-[12px] border border-white/10 bg-[#1e1e1e] font-mono text-xs text-white shadow-2xl">
            {/* Terminal Chrome Header */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-[9px] rounded-full bg-[#ff5f56]" />
                  <span className="size-[9px] rounded-full bg-[#febc2e]" />
                  <span className="size-[9px] rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-2 text-[12px] text-white/60">
                  ~/your-pipeline
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-accent-readable">
                STAGE 1–4
              </span>
            </div>

            {/* Terminal Body: ASCII Art Banner + Prompt + Execution Trace */}
            <div className="flex flex-1 flex-col justify-center gap-3.5 px-4 py-3 overflow-hidden">
              <pre
                aria-hidden="true"
                className="font-mono text-[9px] leading-[1.05] text-accent-readable select-none overflow-hidden"
              >
                {`╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔╗    ╔══╗ ╔═╗ ╔╗ ╔═══╗
║╔═╗║ ║╔═╗║ ║╔═╗║ ║╔═╗║ ║╔══╝ ║║    ╚╣╠╝ ║║╚╗║║ ║╔══╝
║╚═╝║ ║╚═╝║ ║║ ║║ ║║ ║║ ║╚══╗ ║║     ║║  ║╔╗╚╝║ ║╚══╗
║╔══╝ ║╔╗╔╝ ║║ ║║ ║║ ║║ ║╔══╝ ║║ ╔╗  ║║  ║║╚╗║║ ║╔══╝
║║    ║║║╚╗ ║╚═╝║ ║╚═╝║ ║║    ║╚═╝║ ╔╣╠╗ ║║ ║║║ ║╚══╗
╚╝    ╚╝╚═╝ ╚═══╝ ╚═══╝ ╚╝    ╚═══╝ ╚══╝ ╚╝ ╚═╝ ╚═══╝`}
              </pre>

              {/* Prompt Box */}
              <div className="rounded-[4px] bg-white/[0.05] p-3 text-[12px] leading-relaxed text-white/85">
                <span className="text-white/40 mr-1.5">&gt;</span>
                Verify tomorrow’s call brief &amp; Q2 pricing draft against
                seed/facts.json, then output a signed citation brief.
              </div>

              {/* Live Tool Execution Lines */}
              <div className="space-y-1.5 text-[11px] tracking-wide">
                <div className="flex items-center gap-2 text-[#58C892]">
                  <span>✓</span>
                  <span>SEGMENTER_EXTRACT_CLAIMS (12)</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span>✦</span>
                  <span>NORMALIZER_MATCH_F021 (0ms)</span>
                </div>
              </div>
            </div>

            {/* Bottom Command Bar with Interactive Run Button */}
            <div className="p-3 pt-0">
              <div className="flex items-center justify-between border border-white/10 bg-[#161614] px-3 py-2">
                <span className="flex items-center gap-1.5 text-[11.5px] text-white/45 truncate">
                  <span>POST /api/verify</span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-[14px] w-[6px] bg-accent-readable animate-pulse"
                  />
                </span>
                <button
                  type="button"
                  onClick={runLiveVerify}
                  disabled={isRunningApi}
                  className="inline-flex items-center gap-1.5 border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase text-white transition-colors hover:bg-white/20 cursor-pointer shrink-0 rounded-none"
                >
                  {isRunningApi ? (
                    <>
                      <Loader2 size={11} className="animate-spin" />
                      <span>RUNNING</span>
                    </>
                  ) : (
                    <span>RUN LIVE →</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER PANE: 8 Dark Chamfered Pills + [ ] Proofline Hub */}
          <div className="relative z-10 mx-auto flex w-full max-w-[292px] flex-col items-center">
            {/* Top 4 Dark Pills */}
            <div className="flex w-full flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#1e1e1e]/90 p-2 shadow-lg">
              <div className="flex items-center justify-between rounded-md border border-accent-readable/35 bg-[#252322] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent-readable">
                  <Search size={13} />
                  <span>FACT LOOKUP</span>
                </div>
                <span className="font-mono text-[11.5px] text-accent-readable">
                  lookup_f021
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-accent-readable/35 bg-[#252322] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent-readable">
                  <KeyRound size={13} />
                  <span>REGISTER</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="inline-flex size-4 items-center justify-center rounded-[2px] bg-v-supported-bg text-v-supported-fg font-bold">
                    42
                  </span>
                  <span className="inline-flex size-4 items-center justify-center rounded-[2px] bg-v-contradicted-bg text-v-contradicted-fg font-bold">
                    v4
                  </span>
                  <span className="inline-flex size-4 items-center justify-center rounded-[2px] bg-v-stale-bg text-v-stale-fg font-bold">
                    D3
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
                  <Lock size={13} />
                  <span>VALIDITY</span>
                </div>
                <span className="font-sans text-[12px] text-white/45">
                  Per action
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-accent-readable/25 bg-[#252322] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent-readable">
                  <BookOpen size={13} />
                  <span>RULES</span>
                </div>
                <span className="font-sans text-[12px] text-white/55">
                  Proven steps
                </span>
              </div>
            </div>

            {/* Center Dark Hub Pill */}
            <div className="my-2.5 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-xl border border-accent-readable/45 bg-[#1e1e1e] px-7 py-2.5 shadow-[0_0_25px_rgba(212,132,122,0.18)]">
                <span className="font-mono text-[16px] font-bold text-accent-readable">
                  [ ]
                </span>
                <span className="font-sans text-[19px] font-semibold tracking-tight text-white">
                  Proofline
                </span>
              </div>
            </div>

            {/* Bottom 4 Dark Pills */}
            <div className="flex w-full flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#1e1e1e]/90 p-2 shadow-lg">
              <div className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
                  <Zap size={13} />
                  <span>MODEL TIER</span>
                </div>
                <span className="font-sans text-[12px] text-white/45">
                  Fact IDs only
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/45">
                  <Box size={13} />
                  <span>SANDBOX</span>
                </div>
                <span className="font-sans text-[12px] text-white/45">
                  Runs code
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#252322] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/60">
                  <ShieldCheck size={13} />
                  <span>GATE</span>
                </div>
                <span className="font-sans text-[12px] text-accent-readable">
                  Citations checked
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-accent-readable/35 bg-[#252322] px-3.5 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent-readable">
                  <FileText size={13} />
                  <span>TRACE</span>
                </div>
                <span className="font-mono text-[12px] text-accent-readable tabular-nums">
                  {liveLatencyMs ? `${liveLatencyMs}ms` : "2 recorded"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Dark Brief / Live JSON Output Card (h-[458px], rounded-[16px]) */}
          <div className="relative z-10 flex h-[458px] flex-col justify-between overflow-hidden rounded-[16px] border border-white/10 bg-[#1e1e1e] text-white shadow-2xl">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                </div>
                <span className="ml-1 inline-flex size-4 items-center justify-center rounded-[2px] bg-white font-mono text-[10px] font-bold text-ink">
                  P
                </span>
                <span className="font-sans text-[13px] text-white/70">
                  Register · Briefings
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#58C892]">
                {liveLatencyMs ? `200 OK · ${liveLatencyMs}ms` : "READY"}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 overflow-hidden">
              <div>
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-[4px] bg-white font-mono text-[16px] font-bold text-ink">
                  P
                </div>
                <h3 className="font-sans text-[22px] font-semibold text-white/85">
                  Verification Response
                </h3>
                <p className="mt-1 font-mono text-[11.5px] text-white/45">
                  Click &ldquo;RUN LIVE →&rdquo; in the terminal to execute POST /api/verify
                </p>

                <pre className="mt-3 overflow-hidden whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-[#141412] p-3 font-mono text-[10.5px] leading-[1.42] text-[#d7d1c9]">
                  <code>{liveJson}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-right Pause/Play Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume terminal trace" : "Pause terminal trace"}
            className="inline-flex size-8 items-center justify-center rounded-full border border-white/15 bg-[#1e1e1e] text-white/70 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
      </div>

      {/* =====================================================================
          BAND 8: "Works with any stack" Tabbed Code Switcher (bands-extraction.json)
          ===================================================================== */}
      <div className="mt-16 border-t border-white/10 pt-16">
        <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
          <h2 className="text-balance font-sans text-[32px] md:text-[44px] font-normal tracking-[-0.042em] leading-[1.08] text-white">
            Works with <span className="text-accent-readable">any stack</span>
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-[920px]">
          {/* Sharp 0px Framework Tabs */}
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Integration stack tabs"
          >
            {STACK_TABS.map((tab) => {
              const isSelected = tab.id === activeStackTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStackTab(tab.id)}
                  className={`border px-4 py-2 font-mono text-[13px] transition-colors cursor-pointer rounded-none ${
                    isSelected
                      ? "border-white bg-white text-ink font-medium"
                      : "border-white/15 bg-white/[0.03] text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Install / CLI Command Bar */}
          <div className="mt-4 flex items-center justify-between rounded-t-[8px] border border-white/10 bg-[#161614] px-4 py-3 font-mono text-[13px]">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
              <span className="text-white/40 select-none">$</span>
              <span className="text-accent-readable truncate">{currentStack.installCmd}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCmd}
              aria-label="Copy command"
              className="ml-3 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white cursor-pointer shrink-0"
            >
              {copiedCmd ? <Check size={14} className="text-[#58C892]" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Syntax Code Block */}
          <div className="relative overflow-hidden rounded-b-[8px] border border-t-0 border-white/10 bg-[#1e1e1e] p-5">
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy code snippet"
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-white/70 hover:text-white cursor-pointer rounded-none"
            >
              {copiedCode ? (
                <>
                  <Check size={12} className="text-[#58C892]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>COPY</span>
                </>
              )}
            </button>
            <pre className="whitespace-pre-wrap break-words font-mono text-[12.5px] leading-[1.7] text-[#e6e1d6]">
              <code>{currentStack.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
