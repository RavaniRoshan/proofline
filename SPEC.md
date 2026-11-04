# SPEC.md — Proofline

**Round 2 build. Deadline 2026-11-07 10:00 IST. Two people. Roughly 60 working hours.**

---

## 1. Problem and hook

**The frustration.** A B2B SaaS marketing team publishes pricing, feature and limit claims through several people, an agency, and AI assistants. A sentence that was accurate in March is wrong in June, and no ordinary review catches a claim that *used to be* correct. Reviewers resolve the doubt by asking a colleague, because there is no record to check against.

**The hook.** Proofline checks a submitted draft against an owner-approved, versioned fact register and returns a verdict with the exact source behind it, or an honest refusal to judge.

**The one thing being scored.** Content in → checked against approved facts → issues explained with evidence → a human decides. If a judge can do that unaided in under three minutes, Round 2 succeeds regardless of what else is unfinished.

### Hard constraints from the organiser

- A judge must open the URL and use the core product **without assistance or a walkthrough**. No login screen, no empty dashboard.
- **Every link must open in an incognito window with no sign-in.** This is the single most common way teams lose their place.
- Not polished is acceptable. Not usable is not.

---

## 2. Deterministic-first pipeline contract

Four stages. Stage 1 must remove the majority of model work before Stage 3 is ever reached.

### Stage 1 — Deterministic extraction and checks (no model)

Input: pasted draft text. Split into candidate claims with a sentence/clause segmenter, keeping `char_start`, `char_end`.

Classify each claim in TypeScript by shape, not by model:

| Type | Test | Decided by |
|---|---|---|
| `numeric` | contains a digit, currency symbol, unit, or percent | code |
| `temporal` | contains a month, year, "since", "by", a date | code |
| `entity` | contains a known product or feature name | code |
| `disclaimer` | the draft is missing a required disclaimer | code |
| `qualitative` | none of the above | **model** |

For `numeric`, `temporal`, `entity` and `disclaimer` claims, resolve **without the model**: normalise the value (currency, unit, thousands separators), then exact-match against active facts on `(product_id, attribute)`. These claims never reach an API call. Target: **≥60% of claims resolved with zero model cost.**

### Stage 2 — Smoke gate before any batch

Before wiring the semantic path into the UI, run it over `seed/smoke_cases.jsonl` (≈24 labelled claims, one per verdict state) and write `out/smoke_report.json`.

Gate: the run must produce the expected verdict for **≥20 of 24** cases. If it does not, fix the prompt or the rules and re-run. Do not build UI on an unvalidated classifier.

### Stage 3 — Tiered model routing

- **One route: `POST /api/verify`.** Server-side only. The key never reaches the browser.
- **Model:** a fast, cheap model, pinned by exact version string in one constant. Frontier models are for architecture and code, not for per-claim classification.
- **Input:** only the claim text, the claim type, and the **retrieved candidate facts** (max 5). Never the whole draft, never the whole fact register.
- **Output:** strict JSON, parsed with Zod. Shape in `DATA.md` §4. A parse failure is a hard error, never a silent fallback.
- **Retrieval is lexical, not vector.** With ≤200 facts, score candidates by token overlap on `attribute` + `entity` + value tokens, filter by `status='approved'` and validity window, take top 5. No embedding index, no pgvector.

### Stage 4 — Output schema and verdict rules

The verdict is computed in code from the model's structured answer **plus** the evidence lookup. The model proposes; code decides.

| Verdict | Condition (all must hold) |
|---|---|
| `NOT_CHECKABLE` | claim type is `qualitative` and the model finds no factual predicate |
| `CONTRADICTED` | an approved fact matches `(product, attribute)`, is active at `review_date`, its normalised value differs, **and** no second active fact disagrees with it. Evidence record required. |
| `STALE` | the best-matching fact exists but `review_date > valid_until`, or it is superseded |
| `CONFLICTING` | ≥2 approved facts match `(product, attribute)` with different values, both active at `review_date` |
| `SUPPORTED` | best active fact entails the claim (model confidence ≥ 0.75) and nothing contradicts it |
| `UNVERIFIED` | none of the above, or the model returned an unresolvable `fact_id` |

**Evidence gate (assert in code):** if `verdict === 'CONTRADICTED'` and any of `fact_id, fact_version, source_document_id, source_span, valid_from, valid_until` is missing, throw in dev and downgrade to `UNVERIFIED` in production.

**Severity, for sort order only:** `contradicted × numeric` = 3, `contradicted × other` = 2, `stale` = 2, `conflicting` = 2, `unverified` = 1, `supported`/`not_checkable` = 0.

---

## 3. UI and state invariants

**Views (five, no more).**

1. `/` — **Check a draft.** Textarea, a "Load sample draft" button, "Check" button, findings list, per-finding decision controls. This is the landing page. A judge must land here, not on a dashboard.
2. `/facts` — the fact register: value, version, validity window, approver, status. Filter chips for stale and conflicting.
3. `/audit` — append-only decision log.
4. `/dashboard` — counts by verdict, stale count, conflicting count.
5. `/about` — three sentences on what this is, plus the Round 1 PDF link.

**State. Zero auth, zero server-side user data.**

- Seed facts, source documents and the sample draft ship in `seed/*.json` and are read at build time.
- Everything the judge changes (decisions, edited facts) lives in `localStorage` under one key: `proofline.v1`.
- A **"Reset demo"** button in the header clears that key and reloads the seed. A judge who breaks the demo must be able to recover in one click.
- No cookies, no sessions, no accounts, no PII.

**Anti-slop UI rules.**

- One primary action per screen. `/` has exactly one: **Check**.
- The verdict is a word, not a colour alone. Colour supports the label, never replaces it.
- Every finding shows: the claim text, the verdict, a one-sentence reason, the evidence (document · span · version · dates), and one suggested correction. Nothing else.
- Empty states say what to do next, not "No data".
- No modal on first load. No tour. No cookie banner.
- Keyboard: `Cmd/Ctrl+Enter` runs a check; `j`/`k` move between findings.

---

## 4. Human vs agent boundary

**Human, once, before building:**

1. Create the LLM provider account and paste the key into Vercel env vars as `LLM_API_KEY`.
2. Create the GitHub repo and connect it to Vercel.
3. Approve the 40 seed facts as the fictional brand owner (they are fixtures, not real claims).

**Agent does everything else:** all code, all tests, seed validation, build, deploy, and the incognito link check.

**Definition of done for Round 2** — all seven must pass, verified by command, not by claim:

```
npm run build                    # exits 0
npx tsc --noEmit                 # exits 0
npm test                         # verdict rules pass, incl. the evidence gate
python3 scripts/validate_seed.py seed/   # seed integrity
npm run test:e2e                 # draft -> findings -> decision -> audit entry
```

Plus, manually: open the production URL in an incognito window and complete the flow in under three minutes without reading any instructions.

---

## 5. Scope: what ships, what does not

**Ships:** seeded workspace · fact register with validity windows · paste a draft · deterministic checks · semantic check for qualitative claims · six verdicts with evidence · suggested correction · reviewer decision with reason · audit log · stale/conflict detection · dashboard counts · reset demo.

**Does not ship, and says so in the UI where relevant:** file upload (DOCX/PDF), OCR, visual or accessibility checking, multi-brand, agencies, auth, integrations, multi-language, open-web fact checking, auto-publishing.

---

## 6. Changes from the Round 1 plan, and why

This section exists because the organiser requires an explanation of plan changes. It is the honest list.

| Round 1 plan | Round 2 build | Why |
|---|---|---|
| Supabase Auth + RLS + multi-tenant Postgres | No auth; single seeded workspace; state in `localStorage` | A judge must use the product without sign-in, and RLS protects tenants that do not exist yet. Removes ~1 day of work and the most likely demo failure. |
| pgvector + hybrid retrieval | Lexical scoring over ≤200 facts in memory | At this corpus size vector search adds a dependency and an index without improving recall. Honest simplification, stated as such. |
| Async queue with polling | One synchronous request per draft | 12 claims × one small model call fits inside a serverless timeout. A queue is infrastructure for a load that does not exist. |
| DOCX and PDF ingestion | Paste text only | Text-layer extraction is a day of work that adds nothing to the scored workflow. |
| Full dashboard with analytics | Counts by verdict, stale, conflicting | Kept the parts that demonstrate the register is maintained. |

What did **not** change: the evidence gate, the six verdict states, the human decision, the append-only audit log, and the refusal to auto-publish. Those are the product.

---

## 7. The three Round 3 improvements (unchanged from Round 1)

1. **Multimodal visual and accessibility preflight** — OCR text from supported assets, approved logo/asset reference matching, palette and contrast checks, accessibility metadata. Uncertain visual findings escalate to a human rather than auto-failing.
2. **Temporal and governance intelligence** — automated stale-fact detection with owner notifications, conflicting-fact and overlapping-validity detection, and reporting of recurring findings and reviewer overrides so unclear guidelines surface. Authorised approval required before any active fact changes.
3. **One creator-workflow integration** — a single integration (Google Docs *or* Word, not both), so findings and review handoff arrive inside the creator's existing document workflow with revision linkage preserved.

These are product additions, not design changes, which is what the brief requires.
