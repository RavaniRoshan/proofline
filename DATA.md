# DATA.md — Proofline seed substrate

> **For AI agents: start here.**
> This folder is a complete, self-contained fact register for one fictional B2B SaaS brand, plus a labelled smoke set. You do not need an API key, a database, or a network call to build a working client against it.
> To rebuild the product from scratch: read `SPEC.md` §2–3, then run `python3 scripts/validate_seed.py seed/`, then implement the five views. The data contract below is fixed; do not change field names.
> If you are extending the seed: keep every `fact_id` stable, never edit a fact to make a test pass, and add a new version row instead of overwriting an old one.

---

## 1. Files

| File | Rows | Purpose |
|---|---|---|
| `seed/brand.json` | 1 | Brand and product identity |
| `seed/source_documents.json` | 4 | The documents facts were extracted from |
| `seed/facts.json` | ~40 | The versioned fact register — the product's core asset |
| `seed/sample_draft.md` | 1 | A launch-page draft containing 9–12 checkable claims |
| `seed/smoke_cases.jsonl` | ~24 | Labelled claims, one per verdict state, for the Stage 2 gate |

---

## 2. Schemas

### `brand.json`
```json
{ "brand_id": "B-flowdesk", "brand_name": "Flowdesk", "products": [
  { "product_id": "P-starter", "name": "Starter", "status": "active" },
  { "product_id": "P-growth",  "name": "Growth",  "status": "active" } ] }
```

### `source_documents.json`
```json
{ "document_id": "D-pricing", "version_id": "D-pricing-v4", "title": "Pricing sheet v4",
  "kind": "pricing", "effective_date": "2026-04-01", "pages": 2,
  "uploaded_by": "brand-owner", "char_length": 1840 }
```
`document_id` is stable across versions. `version_id` changes per revision. Facts point at `version_id`.

### `facts.json` — one row per fact **version**
```json
{ "fact_id": "F-021", "version": 4,
  "product_id": "P-starter", "attribute": "price_monthly",
  "value": "6499", "unit": "INR",
  "display_value": "₹6,499 per month, billed annually",
  "source_document_id": "D-pricing", "source_version_id": "D-pricing-v4",
  "source_span": "[412-468]",
  "valid_from": "2026-04-01", "valid_until": "2027-03-31",
  "supersedes_fact_id": "F-021",
  "status": "approved",
  "approved_by": "brand-owner", "approved_at": "2026-04-02T10:00:00+05:30" }
```

**Required fields on every row.** A row missing any of these fails validation and must not be loaded:

`fact_id · version · product_id · attribute · value · unit · source_document_id · source_version_id · source_span · valid_from · valid_until · status · approved_by · approved_at`

**`status`** is one of `approved` | `superseded` | `rejected`. Only `approved` facts are checkable.

**Two facts that share a `fact_id` are versions of the same attribute.** The row with the highest `version` and `status: "approved"` is current. Earlier versions stay in the file so `STALE` and supersession can be computed — never delete them.

### `smoke_cases.jsonl` — one JSON object per line
```json
{"case_id": "S-007", "claim": "Flowdesk starts at ₹4,999 per month.",
 "claim_type": "numeric", "expected_verdict": "CONTRADICTED",
 "expected_fact_id": "F-021", "review_date": "2026-11-04", "note": "v4 price is 6499"}
```

---

## 3. Join keys

```
facts.source_document_id  -> source_documents.document_id
facts.source_version_id   -> source_documents.version_id
facts.product_id          -> brand.products[].product_id
facts.supersedes_fact_id  -> facts.fact_id   (same fact_id, lower version)
findings.fact_id          -> facts.fact_id   (must resolve, or the finding downgrades to UNVERIFIED)
```

Every finding the UI renders must resolve `fact_id → fact row → source_documents row`. If that chain breaks, the finding is `UNVERIFIED`. This is the product's only real guarantee.

---

## 4. The `/api/verify` response contract

The model returns exactly this. Parsed with Zod; a parse failure is a hard error.

```json
{ "claim_type": "numeric | temporal | entity | qualitative | disclaimer | not_a_claim",
  "candidate_fact_ids": ["F-021"],
  "relation": "supports | contradicts | unrelated | insufficient",
  "confidence": 0.0,
  "reason": "one sentence, no citation text",
  "suggested_correction": "replacement phrasing, or null" }
```

The model may **only** return `fact_id` values that were given to it. It never writes a source name, span, or date — those are looked up from `facts.json` and rendered by the UI. Any `fact_id` outside the supplied set is discarded.

---

## 5. Known caveats — read before you trust anything here

- **Everything is fictional.** "Flowdesk" is invented. Prices, limits and dates are fixtures for a demo, not claims about any real company. Do not present this data as market research.
- **The register is deliberately small.** ~40 facts across two products. It is sized to make retrieval a solved problem so the demo can be about verdicts and evidence, not about search quality.
- **Three facts are seeded to be stale and two pairs to conflict.** This is intentional: they exercise the `STALE` and `CONFLICTING` paths. Do not "fix" them.
- **No real personal data.** `approved_by` values are role labels, not people.
- **No third-party metadata.** Nothing here is scraped, so there are no licensing restrictions to inherit. If you add a real corpus later, its licence is your problem, not this file's.
- **The sample draft is written to fail in useful ways.** It contains one stale price, one conflicting limit, one unsupported superlative, one opinion, and one claim that is simply true. Keep that spread when you edit it.

---

## 6. Validation

```
python3 scripts/validate_seed.py seed/
```
Zero dependencies, standard library only. Checks: JSON parses · every required field present · dates are ISO and `valid_from <= valid_until` · every `source_document_id` and `source_version_id` resolves · no duplicate `(fact_id, version)` · every smoke case's `expected_fact_id` resolves · every expected verdict is one of the six. Exits non-zero on any failure, printing the offending row.

---

## 7. Starter prompt

```
Read LAW.md, SPEC.md and DATA.md in this folder. Then:
1. Run `python3 scripts/validate_seed.py seed/` and report the result.
2. Implement Stage 1 (deterministic claim classification + numeric/temporal/entity
   resolution) in TypeScript with unit tests. Do not call any model yet.
3. Implement `POST /api/verify` to the contract in DATA.md §4, with Zod parsing and
   the evidence gate from LAW.md §5.
4. Build the five views in SPEC.md §3. The landing page is the draft checker.
5. Run the Stage 2 smoke gate over seed/smoke_cases.jsonl and write out/smoke_report.json.
   Do not proceed to step 6 until >=20 of 24 cases match.
6. Wire the UI to the API. Add the "Reset demo" button.
7. Run every command in SPEC.md §4 and paste the real output.
Report anything in the spec that turned out to be wrong.
```
