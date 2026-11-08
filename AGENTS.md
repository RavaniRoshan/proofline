<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Proofline

Guidance for AI coding agents working in this repository. Read this before touching any file. Project specifics live in `SPEC.md`, data schemas in `DATA.md`, build rules in `LAW.md`.

## Project overview

Proofline is a deterministic claim-evidence preflight governance engine for marketing copy. It takes a marketing draft, segments it into claims, and returns one of six verdicts per claim (`SUPPORTED`, `CONTRADICTED`, `STALE`, `CONFLICTING`, `UNVERIFIED`, `NOT_CHECKABLE`) with the exact source document, character span, fact version, and validity dates behind it — or an honest refusal to judge.

The product is a Next.js 16 App Router web app with zero authentication: no accounts, sessions, cookies, or server-side user data. All reviewer state (decisions, audit log, register overrides) lives in browser `localStorage` under the key `proofline.v1`. Seed facts ship in `seed/*.json` and are read at build time.

The defining architectural guarantee: the language model proposes candidate fact IDs only; deterministic TypeScript code decides verdicts. No `CONTRADICTED` verdict can be emitted without a complete, resolvable 6-field evidence record; otherwise it downgrades to `UNVERIFIED`. ~78% of claims resolve in pure TypeScript at ~0.4ms with $0 model cost.

- Live demo: https://proofline-sigma.vercel.app
- License: MIT

## Technology stack

- Framework: Next.js 16.4.5 (App Router, Turbopack) + React 19.3.0 + React DOM 19.3.0
- Language: TypeScript 5, strict mode (`"strict": true`, `noEmit`)
- Styling: Tailwind CSS v4 (Turbopack loader in `next.config.ts`), `tw-animate-css`, CSS variables, `class-variance-authority`, `tailwind-merge`, `clsx`
- UI primitives: shadcn/ui (style `base-nova`), `@base-ui/react`, Radix UI, `lucide-react`, `@tabler/icons-react`, `@hugeicons/*`, `@aliimam/*`
- Animation: GSAP core + `@gsap/react`, `motion` (Framer Motion), `animejs`
- Docs: Fumadocs (`fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`) with MDX content in `content/docs/`
- Validation: Zod 4
- LLM access: provider-agnostic client (`lib/llm.ts`) supporting `auto` / `ollama` / `openai` (OpenAI-compatible) / `mock`
- Charts: `recharts`; toasts: `sonner`; dates: `date-fns`; themes: `next-themes`
- Testing: Vitest 5 (unit + motion), Playwright 1.64 (e2e), smoke evaluator via `tsx`
- Runtime: Node.js (package manager: npm; `bun.lock` also present). Postinstall runs `fumadocs-mdx`.

## Build and test commands

```bash
npm install              # also runs fumadocs-mdx postinstall
npm run dev              # next dev (http://localhost:3000)
npm run build            # next build (all static pages via Turbopack)
npm run start            # next start
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm test                 # vitest run (111 tests)
npm run smoke            # tsx scripts/smoke.ts (24 cases, gate >= 20)
npm run eval             # alias for smoke
npm run test:e2e         # next build && playwright test (3 flows)
```

Additional verification commands used by the project:

```bash
python3 scripts/validate_seed.py seed/        # seed integrity (stdlib only)
npx tsx scripts/challenger-milestone2-1-stress.ts   # motion stress harness
```

Definition of done (all must pass): `npm run build`, `npx tsc --noEmit`, `npm test`, `python3 scripts/validate_seed.py seed/`, `npm run test:e2e`.

## Code organization

Top-level layout:

```
app/            Next.js App Router routes
  (marketing)/  landing page + layout
  (app)/        /check /facts /audit /dashboard /about /settings
  docs/         Fumadocs catch-all MDX route + layout
  api/verify/   POST /api/verify (headless verification)
  api/search/   GET /api/search (Fumadocs local search)
components/     React components (ui/, landing/, motion/, bentos)
lib/            Core engine + helpers
content/docs/   Fumadocs MDX corpus (meta.json + *.mdx)
seed/           brand.json, source_documents.json, facts.json, sample_draft.md, smoke_cases.jsonl
tests/          Vitest suites (normalize, resolve, segment, verdict, verify, motion)
scripts/        smoke.ts, validate_seed.py, challenger stress harnesses, extractors
e2e/            Playwright flow.spec.ts
out/            smoke_report.json
```

Core engine modules (`lib/`):

- `segment.ts` — Stage 1 claim segmentation with exact `charStart`/`charEnd` offsets; collapses soft wraps 1:1; skips markdown headings.
- `classify.ts` — shape-based claim classification (`numeric`, `temporal`, `entity`, `disclaimer`, `qualitative`, `not_a_claim`); no model.
- `resolve.ts` — deterministic attribute/entity/value resolution (product scope, currency, seats, storage, price, SLA, etc.) via regex rules.
- `normalize.ts` — currency/number/date normalization, scalar comparison, unit dimension comparability.
- `verdict.ts` — Stage 4 verdict computation + Evidence Gate (`gateContradicted`, `evidenceProblem`, `makeEvidence`).
- `verify.ts` — orchestrates segment → classify → resolve → model fallback → verdict → sorting/summary.
- `retrieve.ts` — Stage 3 lexical candidate retrieval (token overlap, top 5, no embeddings).
- `llm.ts` — LLM client interface + providers (openai-compatible, ollama, mock) + strict JSON parsing; model returns fact IDs only.
- `seed.ts` — loads/parses seed JSON with Zod; `facts`, `documents`, `brand`; `applyFactOverrides` / `mergeLocalFacts` for local register edits.
- `register.ts` — derived views for `/facts` and `/dashboard` (conflict groups, stale flags, stats).
- `local.ts` — browser `localStorage` state (`proofline.v1`), audit entries, fact version approval, reset demo.
- `use-proofline.ts` — `useSyncExternalStore` hook over `local.ts`.
- `schemas.ts` — Zod schemas (`FactSchema`, `SourceDocumentSchema`, `BrandSchema`, `ModelResponseSchema`).
- `types.ts` — `Verdict`, `ClaimType`, `Finding`, `EvidenceRecord`, etc.
- `verdicts.ts` — verdict UI config (labels, icons, badge classes).
- `motion-tokens.ts`, `use-reduced-motion.ts`, `motion/gsap-config.ts` — motion design system.

Key routes:

- `app/api/verify/route.ts` — `POST /api/verify` (Zod in/out, serialised request queue, applies `register_overrides` in-process only, restores register after each request). `GET` returns 405.
- `app/api/search/route.ts` — Fumadocs search.

## Development conventions

- Path alias `@/*` maps to project root (see `tsconfig.json`). Use `@/lib/...`, `@/components/...`.
- Strict TypeScript: no `any`; use `unknown` plus a Zod parse at boundaries. `npm run typecheck` must exit 0.
- Match existing file style: imports, typing, naming. Surgical changes only (LAW.md §3): every changed line must trace to the task; no drive-by refactoring.
- Prefer deterministic rules over model calls (LAW.md §2). Do not add services/dependencies/migrations without justification.
- Constants go at the top of the file that uses them; no config files for single use.
- Catch only at real boundaries (network, model output, user file input); no try/catch around internal states.
- Oxblood (`#8B1E27`) is a brand mark (logo brackets, primary buttons, section counters, inline links) — never on icons, active states, selection rings, or positive-action hovers.
- Motion: respect `prefers-reduced-motion` (CSS universal override + JS guard). Tailwind v4 tokens exposed in `app/globals.css`.
- Seed data is the fixture: never edit `seed/` facts to make a test pass; add a new version row instead. Keep `fact_id` stable.

## Product invariants (override convenience)

- Never emit `CONTRADICTED` without an evidence record (`fact_id`, `fact_version`, `source_document_id`, `source_span`, `valid_from`, `valid_until`). Enforced by `gateContradicted` in code, not by prompt.
- Never let the model author a citation. It returns `fact_id` values; the UI renders source document, span, and dates by lookup. Unresolvable id → `UNVERIFIED`.
- Deterministic before semantic: numbers, currency, dates, product names, approved terminology, required disclaimers decided in TypeScript. Model only when rules cannot decide.
- No auto-publish; nothing writes to an external system.
- Model may only return `fact_id`s supplied to it; extras are discarded (`keepSuppliedIds`).

## Environment variables

Copy `.env.example` to `.env.local` (never commit). Server-side only.

- `LLM_PROVIDER` = `auto` (default) | `ollama` | `openai` | `mock`
- `LLM_API_KEY` — for OpenAI-compatible endpoints (Groq in production)
- `LLM_BASE_URL` — default `https://api.openai.com/v1`
- `LLM_MODEL` — default `gpt-4o-mini-2024-07-18` (openai) / `qwen3:4b` (ollama)
- `LLM_OLLAMA_URL` — default `http://localhost:11434`
- `LLM_MOCK_RESPONSE` — JSON override for the mock provider

With no provider configured/reachable, qualitative claims return `UNVERIFIED` with an explicit "semantic check unavailable" reason (never silent, never fake). `auto`: uses OpenAI-compatible if `LLM_API_KEY` set, else local Ollama if reachable, else null.

## Testing instructions

```bash
npm test                          # 111 Vitest tests (51 baseline + 60 motion)
npx vitest run tests/motion.test.ts   # motion suite only
npm run smoke                     # 24 labelled cases, gate >= 20; writes out/smoke_report.json
npm run typecheck                 # tsc --noEmit
npm run lint                      # eslint
npm run test:e2e                  # next build + playwright (3 flows)
python3 scripts/validate_seed.py seed/   # seed integrity
```

Suites: `tests/normalize.test.ts` (9), `tests/resolve.test.ts` (11), `tests/segment.test.ts` (6), `tests/verdict.test.ts` (15), `tests/verify.test.ts` (10), `tests/motion.test.ts` (60). Smoke gate threshold 20/24; labels are never edited to pass. For any bug: write the failing test first, watch it fail, then fix.

## Security considerations

- API keys are server-side only; never logged, never sent to the browser. `LLM_API_KEY` read in `lib/llm.ts` (server). Do not commit `.env.local`.
- No auth, no DB, no vector index, no queue by design (LAW.md §6 banned). Single-tenant, stateless.
- `/api/verify` validates input with Zod (`draft` 1–200k chars, optional `review_date`, `register_overrides` max 50). LLM parse failures are hard errors (502), not silent fallbacks.
- Register overrides are applied in-process per request and restored afterwards; never persisted server-side.
- Evidence gate prevents hallucinated citations from shipping as `CONTRADICTED`.
- `npm run run_secret_scanning` is not part of this project; use standard care with any new secrets. `.gitignore` excludes `.env*`.

## Data contract (summary)

- Seed: `seed/brand.json` (1 brand, products), `seed/source_documents.json` (4 docs), `seed/facts.json` (~42 fact versions), `seed/smoke_cases.jsonl` (~24 cases), `seed/sample_draft.md`.
- Fact required fields: `fact_id, version, product_id, attribute, value, unit, source_document_id, source_version_id, source_span, valid_from, valid_until, status, approved_by, approved_at`. `status ∈ {approved, superseded, rejected}`; only `approved` facts are checkable.
- Same `fact_id` = versions of one attribute; highest `version` with `status: approved` is current.
- `/api/verify` contract: model returns `{ claim_type, candidate_fact_ids, relation, confidence, reason, suggested_correction }`. Model may only cite supplied ids.
- Validate with `python3 scripts/validate_seed.py seed/` (stdlib only).

## Further reading

- `README.md` — product overview, pipeline, API reference, project structure.
- `LAW.md` — build rules and product invariants.
- `SPEC.md` — pipeline contract, UI invariants, scope.
- `DATA.md` — seed schemas and validation.
- `GOAL.md`, `PROJECT.md`, `PRODUCT.md` — goals and product context.
- `DESIGN.md` — motion/interaction design system.
- `TEST_INFRA.md`, `TEST_READY.md` — test architecture and coverage.