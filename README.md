# Proofline

**Claim-evidence checker for brand governance** · CodeNexus India 2026 · Round 2
Deadline 2026-11-07 10:00 IST

A judge opens the URL, pastes a draft (or loads the seeded sample), clicks **Check**, sees
findings — each citing the approved fact, source span, version and validity window behind it —
and records a decision on each one. No sign-in, no walkthrough, under three minutes.

## Run it

```bash
npm install
npm run build
npm start          # http://localhost:3000 — the landing page IS the checker
```

No API key is required to try it locally: if a local [Ollama](https://ollama.com) server is
running, the semantic path uses it (`LLM_PROVIDER=auto` finds it). Otherwise every
deterministic check still runs, and qualitative claims are reported as UNVERIFIED with an
explicit "semantic check unavailable" reason — never silently, never faked.

## Links

- Production: https://proofline-sigma.vercel.app (public, no sign-in — verified anonymously)
- Source (public): https://github.com/RavaniRoshan/proofline

## Deployed configuration (Vercel)

Environment variables (server-side only, see `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `LLM_API_KEY` | — | Key for the OpenAI-compatible provider. Without it the six deterministic verdict paths still work; qualitative claims degrade to explicit UNVERIFIED. |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1` (deployed) | Any OpenAI-compatible endpoint. |
| `LLM_MODEL` | `openai/gpt-oss-20b` (deployed) / `gpt-4o-mini-2024-07-18` | Pinned model, one constant per provider in `lib/llm.ts`. |
| `LLM_PROVIDER` | `auto` | `openai` · `ollama` · `mock` · `auto`. |
| `LLM_OLLAMA_URL` | `http://localhost:11434` | Local Ollama, for development without a key. |

## Verification (all five gates, real output)

```bash
npm run build                          # exits 0
npx tsc --noEmit                       # exits 0
npm test                               # 51 unit tests — verdicts, gate, evidence, segmenter
python3 scripts/validate_seed.py seed/ # seed integrity — PASS (42 rows, 41 fact ids, 24 cases)
npm run test:e2e                       # draft → findings → decision → audit entry
npm run smoke                          # Stage 2 gate — ≥20 of 24 (24/24 on both Ollama qwen3:4b and the deployed Groq gpt-oss-20b)
```

`scripts/verify_goal.sh` runs everything and prints a checklist.

## How it works

1. **Stage 1 — deterministic (TypeScript, no model):** segmentation with exact char offsets,
   shape classification (numeric / temporal / entity / disclaimer / qualitative), value
   normalisation (₹/INR, Indian thousands separators, units, string-booleans), closed-map
   attribute resolution. ≥60% of sample-draft claims are decided here.
2. **Stage 2 — smoke gate:** all 24 labelled cases in `seed/smoke_cases.jsonl` run through the
   real verdict logic; `out/smoke_report.json` records expected vs actual per case. Gate: ≥20/24.
   Gate passes **24/24** with the deployed provider (Groq `openai/gpt-oss-20b`); S-008 resolves deterministically against F-025 with zero model calls. Threshold 20 never moved; labels untouched.
3. **Stage 3 — tiered model routing:** one route, `POST /api/verify`. Input = claim + type + ≤5
   lexically-retrieved candidate facts. `LLM_PROVIDER` selects the backend: OpenAI-compatible
   API in production, local Ollama in development (same code path), `mock` in unit tests.
   Output is strict JSON parsed with Zod; a parse failure is a hard error — never a silent
   fallback. The model returns fact ids only; it never writes citations, spans or dates.
4. **Stage 4 — verdicts in code:** six verdicts computed from relation+confidence plus the
   evidence lookup. An evidence gate asserts in code that no CONTRADICTED ships without a
   complete, resolvable record (`fact_id`, `fact_version`, `source_document_id`, `source_span`,
   `valid_from`, `valid_until`); otherwise the finding downgrades to UNVERIFIED
   (production) or throws (development).

## State

Zero auth, zero database server, zero vector index, zero queue, zero ORM. Seed ships in
`seed/*.json` and is read at build time. Everything the judge changes lives in
`localStorage` under the single key `proofline.v1` (decisions + append-only audit log).
**Reset demo** (header) clears it and reloads the seeded demo.

## Honest limitations

- "Append-only" audit is a local convention — a determined user can edit `localStorage`.
  It is a review log for a seeded demo, not a tamper-proof system of record.
- Verdicts are date-dependent (validity windows). F-024 (Growth seats) expires 2026-12-31;
  after that the Growth-seats case flips CONFLICTING → CONTRADICTED.
- The model path is non-deterministic; identical input can yield UNVERIFIED vs CONTRADICTED
  for borderline claims (e.g. "Setup takes 30 minutes"). The evidence gate bounds the blast
  radius of any wrong CONTRADICTED to zero.
- `/about` links the Round 1 plan/PDF (public Google Drive link) and the public repository at
  https://github.com/RavaniRoshan/proofline
- Data provenance: every fact is fictional (Flowdesk), seeded deliberately with stale rows
  and a conflicting pair for the demo. Not market research.

## Repository layout

```
app/                  the five views + /api/verify
components/           Checker, FindingCard, FactsTable, AuditLog, Dashboard, NavLinks, ResetDemo, VerdictBadge
lib/                  seed loading, segmentation, classification, resolution, verdicts + evidence gate,
                      lexical retrieval, LLM providers, localStorage state (proofline.v1)
seed/                 the fixture — never edited to make tests pass
scripts/              validate_seed.py · smoke.ts · verify_goal.sh
tests/                vitest unit tests
e2e/                  Playwright end-to-end
out/smoke_report.json the Stage 2 gate artefact
SPEC.md DATA.md LAW.md  the build brief (unchanged)
GOAL.md               the standing goal and cut order
```
