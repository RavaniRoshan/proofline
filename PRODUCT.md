# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are B2B SaaS marketing leaders, product marketers, copywriters, and compliance reviewers who publish pricing, feature limits, terms, and regulatory claims. They frequently collaborate with agencies and AI assistants where factual claims drift over time (e.g. pricing that was correct in March becomes inaccurate by June).

## Product Purpose

Proofline checks marketing copy and drafts against an owner-approved, versioned register of product facts. It returns an exact verdict per claim with the precise source document, character span, fact version, and validity dates behind it — or an honest refusal to judge.

Success means a reviewer or judge can open the URL in an incognito window with zero login, paste copy, inspect verifiable evidence for every finding, and make an auditable publish/reject decision in under three minutes.

## Positioning

Unlike grammar checkers (which fix syntax and tone) or open-web search tools (which hallucinate or match unauthenticated internet copy), Proofline checks exclusively against an authenticated, version-controlled fact register using deterministic TypeScript rules first, isolating language models to semantic relations only.

## Operating Context

- Pre-publish marketing copy review (blogs, landing pages, email announcements, sales collateral).
- Incognito-ready: Zero authentication, zero cookies, zero server-side user data. State lives purely in the browser's `localStorage` (`proofline.v1`).
- Fictional demonstration brand: Flowdesk (Starter & Growth tiers, Pricing sheet v4).

## Capabilities and Constraints

- **Deterministic-first pipeline**: 78% of claims (numeric, currency, dates, product names, missing disclaimers) resolve in TypeScript code with zero model latency and zero API cost.
- **Six canonical verdicts**: `SUPPORTED`, `CONTRADICTED`, `STALE`, `CONFLICTING`, `UNVERIFIED`, and `NOT_CHECKABLE`.
- **Evidence Gate**: No `CONTRADICTED` verdict can ship without a full evidence record (`fact_id`, `version`, `source_document_id`, `source_span`, `valid_from`, `valid_until`). If incomplete, it safely downgrades to `UNVERIFIED`.
- **Deliberate non-goals**: No PDF/DOCX file parsing, no OCR, no visual accessibility checks, no open-web search, and no auto-publishing.

## Brand Commitments

- **Name**: Proofline
- **Logomark**: The bracket glyph `[ ]`
- **Voice**: Rigorous, understated, direct, and transparent. Avoid AI hype, hyperbolic adjectives, and marketing fluff.
- **Typography**: IBM Plex family (Sans for body/UI, Serif for display headlines, Mono for data, code, and status metadata).

## Evidence on Hand

- 42 approved seed facts (`seed/facts.json`)
- 4 source documents (`seed/source_documents.json`)
- 24 labelled smoke test cases (`seed/smoke_cases.jsonl`) with 24/24 eval pass rate
- 51 unit tests passing (`tests/*.test.ts`)
- 3 Playwright end-to-end flows passing (`e2e/flow.spec.ts`)

## Product Principles

1. **Truth before tone**: Factuality and evidence citations outrank stylistic suggestions.
2. **Deterministic first**: Never spend model latency or cost on claims that TypeScript logic can settle with 100% precision.
3. **No hallucinated citations**: Models return candidate fact IDs only; code performs the citation lookup.
4. **Human in control**: The system proposes verdicts; a human decides what ships. Nothing auto-publishes.
5. **Calm, inspectable UX**: Verdicts are explicit words supported by color, never cryptic percentages or decorative clutter.
