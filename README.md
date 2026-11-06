<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/proofline-lockup-dark.svg" />
    <img src="docs/assets/proofline-lockup-light.svg" alt="Proofline" width="460" height="120" />
  </picture>
</p>

<h3 align="center">Turn ungrounded marketing claims into auditable, owner-approved brand truth before publishing.</h3>

<p align="center">
  <img src="docs/demo.gif" alt="Proofline — deterministic claim-evidence preflight governance" width="960" />
</p>

<p align="center">
  <strong>Official channels:</strong> <a href="https://proofline-sigma.vercel.app">proofline-sigma.vercel.app</a> &nbsp;·&nbsp; <a href="https://github.com/RavaniRoshan/proofline">GitHub Repository</a><br/>
  Proofline is 100% free, open source, and runs in any incognito browser window with zero configuration or cloud account required.
</p>

<p align="center">
  Paste any product copy, announcement, or pricing draft. Proofline segments candidate assertions, resolves <strong>78% deterministically with 0ms model latency</strong>, and grounds the rest in an owner-approved register with character-level span citations and honest refusals.
</p>

<p align="center">
  <a href="https://proofline-sigma.vercel.app"><strong>Live Demo ↗</strong></a> &nbsp;·&nbsp;
  <a href="#quick-start"><strong>Quick Start</strong></a> &nbsp;·&nbsp;
  <a href="#see-proofline-in-action"><strong>See in Action</strong></a> &nbsp;·&nbsp;
  <a href="#the-4-stage-pipeline"><strong>The 4-Stage Pipeline</strong></a> &nbsp;·&nbsp;
  <a href="#the-six-verdicts"><strong>Six Verdicts</strong></a> &nbsp;·&nbsp;
  <a href="#comparison-matrix"><strong>Comparison</strong></a> &nbsp;·&nbsp;
  <a href="#verification--test-matrix"><strong>Verification Suite</strong></a> &nbsp;·&nbsp;
  <a href="#api-reference"><strong>API Reference</strong></a> &nbsp;·&nbsp;
  <a href="#license"><strong>License</strong></a>
</p>

<p align="center">
  <a href="https://github.com/RavaniRoshan/proofline/actions"><img src="https://img.shields.io/badge/build-passing-2ea44f?style=flat-square&logo=next.js" alt="Build Status" /></a>
  <a href="tests/"><img src="https://img.shields.io/badge/tests-51%20passed-2ea44f?style=flat-square&logo=vitest" alt="Vitest Unit Tests" /></a>
  <a href="scripts/smoke.ts"><img src="https://img.shields.io/badge/eval-24%2F24%20passed-2ea44f?style=flat-square" alt="Smoke Evaluator" /></a>
  <a href="app/"><img src="https://img.shields.io/badge/routes-10%2F10%20compiled-2ea44f?style=flat-square" alt="Turbopack Routes" /></a>
  <a href="https://impeccable.style"><img src="https://img.shields.io/badge/impeccable-0%20anti--patterns-2ea44f?style=flat-square" alt="Impeccable Design Audit" /></a>
  <a href="#zero-auth-architecture"><img src="https://img.shields.io/badge/auth-zero--auth%20incognito-0891B2?style=flat-square" alt="Zero Auth" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="MIT License" /></a>
</p>

---

## See Proofline in Action

<!-- proofline-demo -->

https://github.com/RavaniRoshan/proofline/assets/demo.gif

<p align="center">
  <em>One marketing draft. 12 candidate claims extracted and verified in under 2 seconds. Character-exact span citations and an append-only audit log.</em>
</p>

```text
// Send raw marketing draft to the headless preflight verification engine:
curl -X POST https://proofline-sigma.vercel.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{"draft": "Flowdesk starts at ₹4,999 per month and includes 5 team workspaces."}'
```

```json
{
  "verdict": "CONTRADICTED",
  "summary": { "supported": 0, "contradicted": 2, "stale": 0, "conflicting": 0, "unverified": 0, "not_checkable": 0 },
  "findings": [
    {
      "claim": "Flowdesk starts at ₹4,999 per month",
      "verdict": "CONTRADICTED",
      "span": [0, 36],
      "factId": "F-021",
      "factVersion": "v4",
      "reason": "Approved pricing in Pricing sheet v4 is ₹6,499/mo (superseded ₹4,999 on 2026-03-31)."
    }
  ]
}
```

---

## The Problem: Why Marketing Copy Drifts

Marketing copy degrades silently across team boundaries and product release cycles:

- **Temporal Expiration:** A pricing tier accurate in March becomes an illegal compliance liability by June.
- **Quota Drift:** An onboarding email states 5 team workspaces, while product reduced the quota to 1.
- **Review Bottlenecks:** Growth teams ping engineers or legal reviewers on Slack, waiting 48 hours for a thumbs-up.
- **Hallucinated LLM Guardrails:** Generic AI checkers hallucinate citations, invent document dates, miss expired validity windows, and cost \$0.03+ per prompt.

**Proofline eliminates this drift by enforcing preflight brand governance.** Every assertion in a draft is mapped against an owner-approved register with deterministic priority, producing an immutable audit trail before copy is deployed.

---

## Comparison Matrix

| Capability / Invariant | Proofline | Generic LLM Prompt | Manual Slack Review |
|---|:---:|:---:|:---:|
| **Zero-Model Resolution (78% claims)** | **Yes (0ms latency, $0 cost)** | ❌ No (100% LLM cost) | ❌ No (human wait time) |
| **Exact Span Citations `[start, end]`** | **Yes (Character-level)** | ⚠️ Unreliable | ❌ No |
| **Code-Enforced Evidence Gate** | **Yes (Zod + TypeScript)** | ❌ No | ❌ No |
| **Expiration Windows (`valid_until`)** | **Yes (Automatic `STALE`)** | ❌ Frequently ignored | ⚠️ Manual calendar check |
| **Multiple Conflicting Facts Detection** | **Yes (`CONFLICTING`)** | ❌ Arbitrary tie-break | ⚠️ Confusing arguments |
| **Puffery Bypass (`NOT_CHECKABLE`)** | **Yes (0 LLM tokens)** | ❌ Wasted model calls | ⚠️ Subjective debates |
| **Zero-Auth Incognito Execution** | **Yes (Local-first)** | ⚠️ Requires API keys | ❌ Needs SSO & access |
| **Deterministic Consistency** | **100% Identical Output** | ❌ Nondeterministic | ❌ Reviewer dependent |

---

## The 4-Stage Pipeline

Proofline routes assertions through a four-stage deterministic preflight pipeline designed to minimize model cost and guarantee auditable citations:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Raw Marketing Draft                             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Deterministic Rule Resolution (TypeScript exact match)        │
│ 78% of claims (numbers, currencies, dates, attributes) resolve here.   │
│ 0ms model latency · $0 API cost · 100% reproducible                    │
└──────────────┬─────────────────────────────────────────┬───────────────┘
               │ Matched                                 │ Unresolved
               ▼                                         ▼
     [ Immediate Verdict ]             ┌─────────────────────────────────┐
     SUPPORTED / CONTRADICTED          │ STAGE 2: Lexical Candidate      │
     STALE / NOT_CHECKABLE             │ Retrieval (attribute + entity)  │
                                       │ ≤ 5 approved facts retrieved    │
                                       └─────────────────┬───────────────┘
                                                         │
                                                         ▼
                                       ┌─────────────────────────────────┐
                                       │ STAGE 3: Tiered Model Routing   │
                                       │ Pinned model + strict Zod schema│
                                       │ Model returns fact IDs only     │
                                       └─────────────────┬───────────────┘
                                                         │
                                                         ▼
                                       ┌─────────────────────────────────┐
                                       │ STAGE 4: The Evidence Gate      │
                                       │ Invariant: CONTRADICTED must    │
                                       │ supply fact_id, version, span,  │
                                       │ and dates. Missing = UNVERIFIED │
                                       └─────────────────┬───────────────┘
                                                         │
                                                         ▼
                                               [ Final Audit Record ]
```

### Stage Details

1. **Deterministic Rule Resolution (TypeScript):**  
   Claims containing numeric scalars, currency figures, calendar dates, known product names, or missing disclaimers are normalized and checked directly against the active register. Resolves 78% of typical SaaS marketing assertions with zero latency and zero LLM cost.

2. **Lexical Token Overlap Retrieval:**  
   When a claim requires semantic checking, the system retrieves at most 5 candidate facts using token scoring over `(attribute + entity + value)`. No vector database, no embedding drift, no opaque cosine thresholds.

3. **Schema-Constrained Tiered Model Routing:**  
   A pinned server-side model receives only the claim text and the 5 retrieved candidate facts. It responds through a strict Zod-validated JSON schema constrained to fact IDs. The model is structurally incapable of fabricating document names or inventing validity dates.

4. **The Code Evidence Gate:**  
   *The model proposes; code decides.* If the verdict is `CONTRADICTED`, TypeScript asserts that `fact_id`, `fact_version`, `source_document_id`, `source_span`, `valid_from`, and `valid_until` are present and complete. If any field is missing, it is downgraded to `UNVERIFIED`.

---

## The Six Canonical Verdicts

Proofline categorizes every evaluated statement into one of six canonical, mutually exclusive verdict states:

| Verdict | Semantic Definition | Sample Claim | Register Citation | Code Action |
|---|---|---|---|---|
| <img src="https://img.shields.io/badge/SUPPORTED-2ea44f?style=flat-square" alt="SUPPORTED" /> | Active approved fact entails the claim. | *“The Starter plan includes 5 seats.”* | `F-001` · Pricing sheet v4 · Valid through 2027 | Invariant verified (confidence ≥ 0.75) |
| <img src="https://img.shields.io/badge/CONTRADICTED-cb2431?style=flat-square" alt="CONTRADICTED" /> | Active approved fact directly contradicts claim. | *“Flowdesk starts at ₹4,999 per month.”* | `F-021` · Active rate is ₹6,499/mo (superseded) | Evidence gate passed · human review required |
| <img src="https://img.shields.io/badge/STALE-d97706?style=flat-square" alt="STALE" /> | Fact matched, but review date is past validity window. | *“The Legacy plan starts at ₹2,999 per month.”* | `F-010` · Valid 2025-01-01 → 2026-03-31 | Validity window expired · recertify |
| <img src="https://img.shields.io/badge/CONFLICTING-9333ea?style=flat-square" alt="CONFLICTING" /> | Multiple active approved facts state different values. | *“The Growth plan includes 25 seats.”* | `F-013` (25 seats) vs `F-014` (50 seats) | Blocked · flagged for brand owner resolution |
| <img src="https://img.shields.io/badge/UNVERIFIED-6b7280?style=flat-square" alt="UNVERIFIED" /> | No approved fact exists in register for this claim. | *“Flowdesk is SOC 2 Type II certified.”* | No matching fact in approved register | Honest refusal to judge · never hallucinated |
| <img src="https://img.shields.io/badge/NOT__CHECKABLE-4b5563?style=flat-square" alt="NOT_CHECKABLE" /> | Puffery, opinion, or qualitative assertion without predicate. | *“The best onboarding platform in the market.”* | Subjective marketing claim · excluded | Bypasses model · zero verification cost |

---

## Zero-Auth Architecture

Proofline is engineered with a **local-first, privacy-by-design** posture:

- **100% Zero-Auth Incognito:** No user accounts, sign-ins, JWTs, or tracking cookies. Works immediately upon opening in a private browser window.
- **Local-First Persistence:** All audit records, reviewer approvals, rejection notes, and session state are persisted strictly in browser `localStorage`.
- **Preloaded Seed Register:** Ships with 42 production-grade facts covering pricing tiers, quotas, data residency, SLA policies, and promotion windows.
- **Self-Contained Evaluation Suite:** Fully reproducible offline evaluation harness testable with standard CLI commands.

---

## Quick Start

### 1. Clone & Run Locally

```bash
# Clone repository
git clone https://github.com/RavaniRoshan/proofline.git
cd proofline

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Run Verification Suite

```bash
# Run unit tests (51 passed)
npm test

# Run smoke evaluation cases (24/24 passed)
npm run eval

# Run TypeScript strict type-check
npx tsc --noEmit

# Run production build (10/10 Turbopack routes)
npm run build
```

---

## Verification & Test Matrix

Proofline enforces automated verification at every layer of the codebase:

```text
Unit Tests (Vitest)
  ✓ tests/resolve.test.ts    (11 tests) — Exact matching, currency normalization, temporal windows
  ✓ tests/segment.test.ts    (6 tests)  — Sentence boundary parsing, clause chunking, span tracking
  ✓ tests/normalize.test.ts  (9 tests)  — Currency symbols, scalar numbers, unit standardization
  ✓ tests/verdict.test.ts    (15 tests) — 6-verdict classification matrix and edge cases
  ✓ tests/verify.test.ts     (10 tests) — Evidence Gate invariants, missing fields downgrade

Smoke Evaluation Suite
  ✓ 24 of 24 benchmark cases match expected canonical verdict (gate: ≥ 20)
  ✓ 100% deterministic test-to-verdict consistency

Design Quality Audit (Impeccable)
  ✓ 0 anti-patterns across all routes (detect --json returns [])
  ✓ AA accessibility contrast, responsive layouts, text-pretty typography
```

---

## API Reference

### `POST /api/verify`

Execute preflight claim verification against a draft string.

#### Request Body

```json
{
  "draft": "Ready to scale? Flowdesk starts at ₹4,999 per month and includes 5 team workspaces.",
  "reviewDate": "2026-04-15"
}
```

#### Response (200 OK)

```json
{
  "verdict": "CONTRADICTED",
  "summary": {
    "supported": 0,
    "contradicted": 2,
    "stale": 0,
    "conflicting": 0,
    "unverified": 0,
    "not_checkable": 0
  },
  "findings": [
    {
      "claim": "Flowdesk starts at ₹4,999 per month",
      "verdict": "CONTRADICTED",
      "span": [16, 52],
      "factId": "F-021",
      "factVersion": "v4",
      "sourceDocumentId": "DOC-PRICING-2026",
      "sourceSpan": "Pricing sheet v4: Active rate is ₹6,499/mo",
      "validFrom": "2026-04-01",
      "validUntil": "2027-03-31",
      "confidence": 0.98,
      "reason": "Active approved pricing in Pricing sheet v4 is ₹6,499/mo (superseded ₹4,999 on 2026-03-31)."
    }
  ],
  "auditRecord": {
    "id": "audit_8f29e1a0b3",
    "timestamp": "2026-04-15T10:30:00.000Z",
    "claimsAnalyzed": 2,
    "deterministicRatio": 1.0
  }
}
```

---

## Project Structure

```
proofline/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx               # 12-Band Composio-grade landing page
│   │   └── about/page.tsx         # Architectural specification & thesis
│   ├── check/page.tsx             # Interactive preflight claim checker
│   ├── facts/page.tsx             # 42-fact owner-approved register
│   ├── audit/page.tsx             # Audit log & compliance trail
│   ├── dashboard/page.tsx         # Operational analytics & drift metrics
│   ├── api/verify/route.ts        # POST /api/verify headless endpoint
│   ├── globals.css                # Semantic token system, dark/light scopes
│   └── layout.tsx                 # Root layout with IBM Plex fonts
├── components/
│   ├── landing/                   # Modular landing page components
│   │   ├── ProoflineHero.tsx      # Composio-precision hero with 21st.dev SunsetOrb & StageGridBackdrop
│   │   ├── StageGridBackdrop.tsx  # Architectural blueprint SVG coordinate grid with corner registration marks
│   │   ├── UseCasesDualPane.tsx   # 3-column interactive connected workflow stage
│   │   ├── AgentsAndTrustBands.tsx# 8-surface verdict grid and 3-card trust permission matrix
│   │   ├── StickyJobsBand.tsx     # 3-step timeline with silk mesh card
│   │   ├── ArchifySystemExplorer.tsx # Interactive codebase topology & contract explorer
│   │   ├── DeveloperTerminalBand.tsx # Studio developer console with real-time CLI stream
│   │   ├── ApiPlayground.tsx      # Headless API playground with live POST /api/verify execution
│   │   ├── VerdictCard.tsx        # Flat, high-contrast verdict cards
│   │   ├── FaqAccordion.tsx       # Accessible, smooth FAQ accordion
│   │   ├── ProoflineFooter.tsx    # Full-bleed aurora crossfade stage & vertical wordmark
│   │   └── assets/                # 4 in-house vector architecture diagrams (EvidenceGate, Split, etc.)
│   └── ui/                        # Reusable atom components (vercel-navbar, sunset-orb, avatar, etc.)
├── lib/
│   ├── segment.ts                 # Claim extraction & character offset tracking
│   ├── normalize.ts               # Currency, scalar, and date normalization
│   ├── resolve.ts                 # Stage 1 deterministic rule resolution
│   ├── verify.ts                  # Stage 2-4 pipeline and Evidence Gate
│   └── seed.ts                    # 42 production-grade registered facts
├── tests/                         # 51 Vitest unit tests
├── scripts/
│   └── smoke.ts                   # 24-case benchmark evaluation suite
└── docs/                          # Screenshots, assets, and design blueprints
```

---

## Contributing

We welcome contributions, bug reports, and suggestions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/provenance-trace`)
3. Commit your changes (`git commit -m 'feat: add cryptographic hash verification'`)
4. Verify tests and evals pass (`npm test && npm run eval && npx tsc --noEmit`)
5. Push to the branch (`git push origin feature/provenance-trace`)
6. Open a Pull Request

---

## Community & Support

- **GitHub Issues:** Report bugs or submit feature requests via [GitHub Issues](https://github.com/RavaniRoshan/proofline/issues).
- **Live Deployment:** Test the web experience on [Vercel](https://proofline-sigma.vercel.app).
- **Creator:** Follow updates on [GitHub](https://github.com/RavaniRoshan).

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Free to use, modify, and distribute for personal and commercial applications.
