# GOAL — Proofline Round 2

**Deadline:** 2026-11-07 10:00 IST. **Scored flow:** judge opens URL → pastes/loads draft → Check → findings with evidence → decision recorded. Under 3 minutes, no sign-in.

## Done means (verified by command, not claim)

- [x] Canonical layout: `LAW.md SPEC.md DATA.md README.md`, `seed/`, `scripts/validate_seed.py` — `python3 scripts/validate_seed.py seed/` exits 0
- [x] Next.js + TypeScript + Tailwind scaffold — `npm run build` exits 0
- [x] Stage 1 deterministic pipeline (segmentation, type classification, normalisation, entity resolution) + unit tests — `npm test` exits 0 (51 tests)
- [x] `POST /api/verify` to DATA.md §4 contract (Zod in/out, evidence gate, model returns fact_ids only) — verified with curl against the production server (CONTRADICTED with full F-021/F-014 evidence records)
- [x] Stage 2 smoke gate: ≥20 of 24 verdicts match — `npm run smoke` exits 0, **23/24**, `out/smoke_report.json` committed
- [x] Five views: `/` (landing checker, sample pre-load, exactly one primary action — Check), `/facts`, `/audit`, `/dashboard`, `/about`; Reset demo in header
- [x] Evidence gate enforced by runtime assertion with tests — `npm test -- verdict` exits 0
- [x] E2E: draft → findings → decision → audit entry — `npm run test:e2e` exits 0 (3/3)
- [x] `npx tsc --noEmit` exits 0, `npm run lint` exits 0
- [x] Five views screenshot-verified
- [x] GitHub repo — public, https://github.com/RavaniRoshan/proofline (pushed, no secrets)
- [x] Vercel production deploy — https://proofline-sigma.vercel.app (all routes 200 anonymously)
- [x] Incognito-equivalent production flow verified from a fresh browser context (draft → findings → decision → audit)
- [x] Round 1 PDF link — Google Drive (public) wired into /about
- [ ] Add `LLM_API_KEY` in Vercel to switch on the semantic path (deploy currently runs deterministic checks + explicit UNVERIFIED for qualitative claims — 18 findings, 0 model calls; design working as specified)

## Cut order if time runs out

`/dashboard` → `/facts` filtering → suggested-correction field → candidate-fact approval.
**Never cut:** the evidence gate, the six verdicts, the reviewer decision, the audit entry. — All four shipped and e2e-tested.

## Standing decisions (made autonomously, reviewed at the end)

- LLM access is provider-agnostic via `LLM_PROVIDER` (`auto` | `ollama` | `openai` | `mock`):
  - Local dev/test: Ollama at `http://localhost:11434` with `qwen3:4b` (native API, `think:false`, `format:json`) — no key needed, same pipeline as production.
  - Production: any OpenAI-compatible endpoint via `LLM_BASE_URL` + `LLM_API_KEY` (defaults: `https://api.openai.com/v1`, model pinned `gpt-4o-mini-2024-07-18`).
  - No provider configured/reachable → qualitative claims return UNVERIFIED with an explicit "semantic check unavailable" reason. Never silent, never fake.
- S-008 ("The Starter plan includes SSO.") is unresolvable as CONTRADICTED under SPEC §2 Stage 4 (no `(P-starter, sso_included)` fact; the only SSO facts are P-growth). Rules stay strict → UNVERIFIED. Smoke gate passes at 23/24 regardless.
- SUPPORTED for deterministic exact matches is decided by code (confidence 1.0); the 0.75 threshold applies only to the model path.
- `review_date` = server's current date at check time (client passes today's date to the API; the API also defaults to today); injected everywhere for determinism in tests/smoke (smoke cases pin 2026-11-04).
- Missing required disclaimer (draft has price claims, no change/terms disclaimer) → one UNVERIFIED finding, never CONTRADICTED. Verified present in unit tests.
- `/about` Round 1 PDF link points at the team repository until the final PDF URL is supplied.
- Segmenter collapses single newlines inside a paragraph 1:1 (offsets stay exact); blank lines separate paragraphs; markdown headings are never claims.
- `disclaimer` segments and boolean/enum claims are resolved by code; the model is only called when attribute resolution fails (qualitative) or values cannot be compared in code (e.g. minutes vs business days).
