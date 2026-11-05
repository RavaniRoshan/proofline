# Proofline

**Claim-evidence checker for brand governance** · CodeNexus India 2026 · Team `SHIVAMKUMAR10958` · Round 2

A draft of marketing content goes in; each claim is checked against an owner-approved, versioned register of product facts; every finding returns one of six verdicts with the source document, character span, fact version and validity dates behind it, or refuses to judge.

A judge lands cold with no instructions and no sign-in, understands the product in five seconds, clicks into the checker, loads the sample draft, checks claims, inspects the interactive marked-up draft with offsets, sees the evidence drawer with the cited span underlined in oxblood, and records a review decision that appears in the append-only audit log.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the production app
# IMPORTANT: npm run build must be run before npx tsc --noEmit because
# Next.js generates .next/types required for full TypeScript typecheck.
npm run build

# 3. Start production server
npm start          # http://localhost:3000
```

No API key is required to try it locally: if a local [Ollama](https://ollama.com) server is running, the semantic path uses it (`LLM_PROVIDER=auto` finds it). Otherwise every deterministic check still runs (78% of the sample draft), and qualitative claims are reported as `UNVERIFIED` with an explicit "semantic check unavailable" reason — never silently, never faked.

---

## The Six Verdicts

Colour in Proofline is information. The six verdicts are the only saturated values in the entire design system:

| Verdict | Colour | Value | Semantic Meaning |
|---|---|---|---|
| **SUPPORTED** | Sage Green | `#1F5C43` / `#DDEBE0` | Claim strictly matches an approved, currently valid fact in the register. |
| **CONTRADICTED** | Brick Red | `#A8261C` / `#F7E3E0` | Claim directly conflicts with an approved fact. Never returned without resolved evidence. |
| **STALE** | Amber | `#7E4A10` / `#F8EEDA` | Claim matches a fact that has expired or been superseded by a newer version. |
| **CONFLICTING** | Deep Plum | `#5A3461` / `#EDE5EF` | Two or more active, approved register facts disagree on this attribute. |
| **UNVERIFIED** | Slate Grey | `#4A4A45` / `#E8E6DF` | Claim is checkable in principle, but no approved fact or model confidence exists. |
| **NOT_CHECKABLE** | Faint Grey | `#5F5F58` / `#ECEAE3` | Subjective fluff, puffery, opinion, or non-verifiable marketing copy. |

### The Oxblood Rule
Oxblood (`--oxide`, `#6E1F26`) is a brand mark only. It appears on exactly four things:
1. Logo brackets `[ ]`
2. Primary CTA buttons (filled, white text)
3. Section counters `[01]`, `[02]`, `[03]`
4. Inline links

It never appears on icons, active nav states, selection rings, or positive-action hovers.

---

## Architectural Invariants

1. **`CONTRADICTED` is never returned without a resolved evidence record:** `fact_id`, `fact_version`, `source_document_id`, `source_span`, `valid_from`, `valid_until`. Enforced by assertion in code. Missing or unresolvable evidence downgrades to `UNVERIFIED`.
2. **Model returns fact IDs only:** It never writes a citation, source name, span or date. The UI renders those by looking up the IDs in the register.
3. **Never fabricate source text:** If a document has no body text in the seed, Proofline shows the span reference and says so explicitly.
4. **Deterministic before semantic:** Numbers, currency (₹/INR), dates, product names, terminology, and required disclaimers are decided in TypeScript, never by a model. 78% of claims in the sample draft resolve with zero model calls.
5. **Zero server state:** No authentication, no database server, no vector index, no job queue, no ORM. Single tenant, local state in `localStorage` under `proofline.v1`, seed read from `seed/*.json`.
6. **No auto-publish:** Nothing writes to external systems.
7. **The seed is the fixture:** Seed facts and smoke labels are never edited to make tests pass.

---

## Keyboard Navigation & Productivity

Proofline is completely operable without a mouse:

| Keybinding | Action | Scope |
|---|---|---|
| `j` / `k` | Navigate down / up through findings | Checker (`/check`) |
| `a` | Approve selected finding (prompts for reason) | Checker (`/check`) |
| `r` | Reject selected finding (prompts for reason) | Checker (`/check`) |
| `e` | Request edit on selected finding (prompts for reason) | Checker (`/check`) |
| `⌘ + Enter` / `Ctrl + Enter` | Run claim verification on current draft | Checker (`/check`) |
| `⌘ + K` / `Ctrl + K` | Open Command Palette (jump to any page, reset demo) | Global |
| `Esc` | Dismiss Evidence Drawer or Command Palette | Global |

---

## Verification Gates (All 5 Passing)

Every commit in this repository verifies cleanly across all five gates:

```bash
# Gate 1: Production build
npm run build
# Route (app): /, /about, /api/verify, /audit, /check, /dashboard, /facts, /opengraph-image

# Gate 2: TypeScript strict typecheck
npx tsc --noEmit
# Exits 0 with zero errors

# Gate 3: Vitest unit suite
npm test
# 51 passed across 5 test files (resolve, normalize, segment, verdict, verify)

# Gate 4: Seed integrity verification
python3 scripts/validate_seed.py seed/
# PASS: 42 facts, 41 fact IDs, 4 documents, 24 smoke cases

# Gate 5: Stage 2 smoke test gate (>= 20 of 24 required)
npm run smoke
# 24 of 24 match expected verdicts (100% pass rate)

# End-to-End Playwright suite
npx playwright test
# 3 passed (core flow, reset demo, route navigation)
```

---

## Known Limits

- **Append-only audit in local storage:** The audit trail is stored locally under `proofline.v1` in `localStorage`. It provides complete auditability for the reviewer's session, but is client-side.
- **Validity windows are temporal:** Fact validity is evaluated relative to the review date. If a validity window closes, findings transition automatically (e.g. from `SUPPORTED` to `STALE` or `CONFLICTING` to `CONTRADICTED`).
- **Semantic border cases:** Qualitative puffery vs verifiable statements depend on LLM provider confidence when falling back from Stage 1 deterministic rules. The evidence gate ensures that even in ambiguous cases, `CONTRADICTED` cannot be emitted without an approved register match.

---

## Repository Structure

```
app/
  page.tsx                # Landing page with [01]-[03] workflow & S-005 hero case
  check/page.tsx          # Full claim checker
  facts/page.tsx          # Fact register browser with search & filter
  audit/page.tsx          # Review log with action & verdict filters
  dashboard/page.tsx      # Register health & proportional CSS verdict bars
  about/page.tsx          # Architecture, invariants, and Round 1 PDF link
  opengraph-image.tsx     # Dynamic social card with 6 verdict badges
  globals.css             # Round 1 PDF tokens & CSS-only state motion
components/
  ui/                     # Design primitives (button, badge, card, dialog, tabs)
  Checker.tsx             # Interactive claim checker & split-screen layout
  MarkedDraft.tsx         # Exact character-offset highlighted draft
  FindingCard.tsx         # Finding card with decision trace & keyboard review
  EvidenceDrawer.tsx      # Source document viewer with underlined cited span
  FactsTable.tsx          # Searchable, filterable fact register table
  AuditLog.tsx            # Filterable append-only audit trail
  Dashboard.tsx           # Proportional CSS bars and register metrics
  CommandPalette.tsx      # ⌘K command palette
lib/
  verdicts.ts             # Single source of truth for verdict tokens & labels
  trace.ts                # One-line decision trace generator ([RULE] vs [MODEL])
  schemas.ts              # Zod schemas for facts, claims, and verification
  normalize.ts            # Currency, numbers, and unit normalization
  segment.ts              # Draft segmentation with exact character spans
  resolve.ts              # Deterministic fact matching and relation scoring
  verdict.ts              # Verdict resolution engine & Invariant 1 evidence gate
  seed.ts                 # Seed loader & active fact filtering
seed/                     # Canonical fixtures (never modified for tests)
scripts/                  # validate_seed.py, smoke.ts, verify_goal.sh
tests/                    # Vitest unit test suite (51 tests)
e2e/                      # Playwright end-to-end tests
docs/                     # Real 1440x900 and 390px captured screenshots
```
