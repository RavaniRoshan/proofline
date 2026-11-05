/**
 * Stage 2 — the smoke gate. Runs every labelled case in seed/smoke_cases.jsonl
 * through the real verdict logic and writes out/smoke_report.json.
 *
 * Gate: >= 20 of 24 expected verdicts must match. Labels are never edited to
 * make a case pass; the rules or the prompt are fixed instead.
 *
 *   npm run smoke                 # uses LLM_* env if set (Ollama is auto-detected)
 *   LLM_PROVIDER=ollama npm run smoke
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { verifyDraft } from "@/lib/verify";
import { getLlmClient } from "@/lib/llm";
import type { Verdict } from "@/lib/types";

const SmokeCaseSchema = z.object({
  case_id: z.string(),
  claim: z.string(),
  claim_type: z.string(),
  expected_verdict: z.string(),
  expected_fact_id: z.string().nullable(),
  review_date: z.string(),
  note: z.string().optional().default(""),
});


const GATE = 20;

/** Minimal .env.local loader (no dependency; existing env wins). */
function loadEnvLocal(): void {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!m || line.trim().startsWith("#")) continue;
      const [, key, value] = m;
      if (process.env[key!] === undefined) process.env[key!] = value;
    }
  } catch {
    // No .env.local — fine, env vars rule.
  }
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9%₹]+/g, " ").trim();
}

async function main() {
  loadEnvLocal();
  const root = process.cwd();
  const lines = readFileSync(join(root, "seed/smoke_cases.jsonl"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const cases = lines.map((l, i) => {
    const parsed = SmokeCaseSchema.safeParse(JSON.parse(l));
    if (!parsed.success) throw new Error(`smoke_cases.jsonl line ${i + 1}: ${parsed.error.message}`);
    return parsed.data;
  });

  const llm = await getLlmClient();
  console.log(`smoke: ${cases.length} cases · LLM provider: ${llm?.name ?? "none (deterministic only)"}`);

  const results: Array<Record<string, unknown>> = [];
  let matched = 0;
  for (const c of cases) {
    await new Promise((r) => setTimeout(r, 1200)); // smooth bursts against free-tier rate limits
    let actual = "NO_FINDING" as Verdict | "NO_FINDING" | "ERROR";
    let factId: string | null = null;
    let source: string | null = null;
    let reason = "";
    let error: string | null = null;
    try {
      const { findings } = await verifyDraft(c.claim, { reviewDate: c.review_date });
      // Prefer the finding that exactly matches the case claim text;
      // fall back to the highest-severity finding (sorted first).
      const target = norm(c.claim);
      const exact = findings.find((f) => norm(f.claim) === target);
      const picked = exact ?? findings[0];
      if (picked) {
        actual = picked.verdict;
        factId = picked.evidence?.fact_id ?? null;
        source = picked.source;
        reason = picked.reason;
      }
    } catch (e) {
      error = (e as Error).message;
      actual = "ERROR";
    }
    const ok = actual === c.expected_verdict;
    if (ok) matched += 1;
    const factOk = c.expected_fact_id === null || factId === c.expected_fact_id;
    results.push({
      case_id: c.case_id,
      claim: c.claim,
      claim_type: c.claim_type,
      expected_verdict: c.expected_verdict,
      expected_fact_id: c.expected_fact_id,
      actual_verdict: actual,
      actual_fact_id: factId,
      fact_id_match: factOk,
      source,
      matched: ok,
      reason,
      ...(error ? { error } : {}),
    });
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.case_id}  expected=${c.expected_verdict.padEnd(13)} actual=${String(actual).padEnd(13)} ${c.claim.slice(0, 60)}`);
  }

  const report = {
    generated_at: new Date().toISOString(),
    llm_provider: llm?.name ?? "none",
    gate_threshold: GATE,
    total: cases.length,
    matched,
    passed: matched >= GATE,
    mismatches: results.filter((r) => !r.matched).map((r) => r.case_id),
    cases: results,
  };
  mkdirSync(join(root, "out"), { recursive: true });
  writeFileSync(join(root, "out/smoke_report.json"), JSON.stringify(report, null, 2));
  console.log(`\nsmoke: ${matched} of ${cases.length} match the expected verdict (gate: >= ${GATE}) → ${report.passed ? "PASS" : "FAIL"}`);
  console.log(`${matched} of ${cases.length}`);
  console.log("report: out/smoke_report.json");
  process.exit(report.passed ? 0 : 1);
}

main().catch((e) => {
  console.error("smoke failed to run:", e);
  process.exit(1);
});
