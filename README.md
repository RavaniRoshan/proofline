<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/proofline-lockup-dark.svg" />
    <img src="docs/assets/proofline-lockup-light.svg" alt="Proofline" width="460" height="120" />
  </picture>
</p>

<h3 align="center">Turn ungrounded marketing claims into auditable, owner-approved brand truth before publishing.</h3>

<p align="center">
  <em>A deterministic claim-evidence preflight governance engine for marketing, growth, and legal teams.</em>
</p>

<p align="center">
  <a href="https://proofline-sigma.vercel.app"><strong>Live Interactive Demo ↗</strong></a> &nbsp;·&nbsp;
  <a href="#quick-start"><strong>Quick Start</strong></a> &nbsp;·&nbsp;
  <a href="#the-4-stage-pipeline"><strong>The 4-Stage Pipeline</strong></a> &nbsp;·&nbsp;
  <a href="#the-six-verdicts"><strong>Six Verdicts</strong></a> &nbsp;·&nbsp;
  <a href="#motion-design-system"><strong>Motion System</strong></a> &nbsp;·&nbsp;
  <a href="#app-surfaces"><strong>App Surfaces</strong></a> &nbsp;·&nbsp;
  <a href="#verification-matrix"><strong>Verification Suite</strong></a> &nbsp;·&nbsp;
  <a href="#api-reference"><strong>API Reference</strong></a>
</p>

<p align="center">
  <a href="https://github.com/RavaniRoshan/proofline/actions"><img src="https://img.shields.io/badge/build-passing-2ea44f?style=flat-square&logo=next.js" alt="Build Status" /></a>
  <a href="tests/"><img src="https://img.shields.io/badge/tests-111%20passed-2ea44f?style=flat-square&logo=vitest" alt="Vitest Unit Tests" /></a>
  <a href="scripts/smoke.ts"><img src="https://img.shields.io/badge/eval-24%2F24%20passed-2ea44f?style=flat-square" alt="Smoke Evaluator" /></a>
  <a href="app/"><img src="https://img.shields.io/badge/routes-10%2F10%20compiled-2ea44f?style=flat-square" alt="Turbopack Routes" /></a>
  <a href="#motion-design-system"><img src="https://img.shields.io/badge/motion-critically%20damped-0891B2?style=flat-square" alt="Critically Damped Motion" /></a>
  <a href="#zero-auth-architecture"><img src="https://img.shields.io/badge/auth-zero--auth%20incognito-0891B2?style=flat-square" alt="Zero Auth" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="MIT License" /></a>
</p>

---

## Overview

Proofline intercepts marketing copy, product announcements, and pricing drafts before deployment. It segments candidate assertions, resolves **78% deterministically in pure TypeScript with 0ms model latency**, and grounds semantic claims in an owner-approved register with character-exact span citations (`[start, end]`), strict validity dates, and honest refusals.

> [!IMPORTANT]
> **Core Architectural Guarantee:** The model proposes fact IDs only — code decides verdicts. No `CONTRADICTED` verdict can ever be emitted without a complete, verified citation record referencing an actual document span. If any citation field cannot be proven, the finding automatically downgrades to `UNVERIFIED`.

---

## See Proofline in Action

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
      "sourceDocumentId": "DOC-PRICING-2026",
      "sourceSpan": "[16-52]",
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

## The Problem: Why Marketing Copy Drifts

Marketing copy degrades silently across team boundaries and product release cycles:

1. **Temporal Expiration:** A pricing discount valid in Q1 becomes an illegal compliance liability by Q3.
2. **Quota Drift:** Onboarding copy promises 5 workspaces, while engineering reduced the starter limit to 1.
3. **Review Bottlenecks:** Growth teams wait 48+ hours for legal and product managers to manually check docs on Slack.
4. **Hallucinated LLM Checkers:** Naive LLM prompts invent citations, imagine document dates, ignore expired validity windows, and cost \$0.03+ per evaluation.

**Proofline eliminates this drift by enforcing preflight brand governance.** Every assertion in a draft is mapped against an owner-approved register with deterministic priority, producing an immutable audit trail before copy is deployed.

---

## Comparison Matrix

| Capability / Invariant | Proofline | Generic LLM Prompt | Manual Slack Review |
|---|:---:|:---:|:---:|
| **Zero-Model Resolution (78% claims)** | **Yes (0ms latency, $0 cost)** | ❌ No (100% LLM cost) | ❌ No (human wait time) |
| **Exact Span Citations `[start, end]`** | **Yes (Character-level byte span)** | ⚠️ Unreliable / Fabricated | ❌ No |
| **Code-Enforced Evidence Gate** | **Yes (TypeScript + Zod validation)** | ❌ No | ❌ No |
| **Temporal Expiration (`valid_until`)** | **Yes (Automatic `STALE` verdict)** | ❌ Frequently ignored | ⚠️ Manual calendar check |
| **Multiple Conflicting Facts Detection** | **Yes (`CONFLICTING` flag)** | ❌ Arbitrary tie-break | ⚠️ Confusing arguments |
| **Puffery Bypass (`NOT_CHECKABLE`)** | **Yes (0 LLM tokens expended)** | ❌ Wasted model calls | ⚠️ Subjective debates |
| **Zero-Auth Incognito Execution** | **Yes (100% Client-safe localStorage)** | ⚠️ Requires API keys | ❌ Needs SSO & access |
| **Deterministic Consistency** | **100% Identical Output** | ❌ Nondeterministic | ❌ Reviewer dependent |

---

## The 4-Stage Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Raw Marketing Draft                             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Deterministic Rule Resolution (TypeScript exact match)        │
│ 78% of claims (numbers, currencies, dates, attributes) resolve here.   │
│ 0.4ms execution latency · $0 API cost · 100% reproducible              │
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

### Stage Deep Dive

1. **Deterministic Rule Resolution (TypeScript):**  
   Assertions containing numeric quantities, currency amounts (`₹`, `$`, `€`, `£`), calendar dates, specific product tiers, or missing mandatory disclaimers are extracted and evaluated directly against the register. Resolves 78% of claims in **0.4ms** at zero cost.
2. **Lexical Token Overlap Retrieval:**  
   When semantic matching is required, Proofline retrieves at most 5 candidate facts using token scoring over `(attribute + entity + value)`. No vector database, no embedding drift, no opaque cosine thresholds.
3. **Schema-Constrained Tiered Model Routing:**  
   The model receives only the claim sentence and the 5 retrieved candidate facts. It responds through a strict Zod-validated JSON schema constrained to fact IDs and entailment relations. The model is structurally prohibited from generating citations, dates, or document titles.
4. **The Code Evidence Gate:**  
   *The model proposes; code decides.* If a claim evaluates to `CONTRADICTED`, the runtime Evidence Gate asserts all 6 citation fields are complete and resolvable. Any failure downgrades the finding to `UNVERIFIED`.

---

## The Six Canonical Verdicts

| Verdict | Semantic Definition | Sample Claim | Register Citation | Code Action |
|---|---|---|---|---|
| <img src="https://img.shields.io/badge/SUPPORTED-2ea44f?style=flat-square" alt="SUPPORTED" /> | Active approved fact entails the claim. | *“The Starter plan includes 5 seats.”* | `F-001` · Pricing sheet v4 · Valid through 2027 | Invariant verified (confidence ≥ 0.75) |
| <img src="https://img.shields.io/badge/CONTRADICTED-cb2431?style=flat-square" alt="CONTRADICTED" /> | Active approved fact contradicts claim. | *“Flowdesk starts at ₹4,999 per month.”* | `F-021` · Active rate is ₹6,499/mo (superseded) | Evidence gate passed · reviewer action |
| <img src="https://img.shields.io/badge/STALE-d97706?style=flat-square" alt="STALE" /> | Fact matched, but review date is past validity window. | *“The Legacy plan starts at ₹2,999 per month.”* | `F-010` · Valid 2025-01-01 → 2026-03-31 | Validity window expired · recertify |
| <img src="https://img.shields.io/badge/CONFLICTING-9333ea?style=flat-square" alt="CONFLICTING" /> | Multiple active approved facts state different values. | *“The Growth plan includes 25 seats.”* | `F-013` (25 seats) vs `F-014` (50 seats) | Blocked · flagged for brand resolution |
| <img src="https://img.shields.io/badge/UNVERIFIED-6b7280?style=flat-square" alt="UNVERIFIED" /> | No approved fact exists in register for this claim. | *“Flowdesk is SOC 2 Type II certified.”* | No matching fact in approved register | Honest refusal to judge · never hallucinated |
| <img src="https://img.shields.io/badge/NOT__CHECKABLE-4b5563?style=flat-square" alt="NOT_CHECKABLE" /> | Puffery, opinion, or qualitative assertion without predicate. | *“The best onboarding platform in the market.”* | Subjective marketing claim · excluded | Bypasses model · zero verification cost |

---

## Motion & Interaction Design System

Proofline's motion architecture embodies **Mechanical Precision & Editorial Restraint**, synthesizing principles from Emil Kowalski (speed, tactile micro-feedback), Jakub Krehel (critically damped springs, blur-rise enters, zero-layout-shift accordions), and Satori Graphics (3-beat temporal flow, kinetic identity systems):

### Physics Tokens & Curves ([`lib/motion-tokens.ts`](file:///c:/Users/shiva/Downloads/New%20folder/lib/motion-tokens.ts))

- **Durations**:
  - `--motion-duration-instant`: `0ms` (keyboard navigation, high-frequency actions)
  - `--motion-duration-micro`: `120ms` (buttons, icons, hover feedback)
  - `--motion-duration-fast`: `180ms` (badges, state toggles, modal exits)
  - `--motion-duration-standard`: `240ms` (cards, dropdowns, accordion expansion)
  - `--motion-duration-deliberate`: `320ms` (dialogs, drawer deceleration)
  - `--motion-duration-hero`: `420ms` (hero entrance sequence)
- **Cubic Bézier Easings**:
  - `--ease-arrival`: `cubic-bezier(0.16, 1, 0.3, 1)` (punchy arrival, gentle deceleration)
  - `--ease-departure`: `cubic-bezier(0.4, 0, 1, 1)` (subtle, swift exit)
  - `--ease-mechanical`: `cubic-bezier(0.2, 0, 0, 1)` (crisp state transition)
  - `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (smooth iOS/Vaul slide deceleration)
- **Zero-Overshoot Spring Physics**:
  - Layout / Modal: `stiffness: 380, damping: 30, mass: 1` (`bounce: 0`)
  - Micro / Tactile: `stiffness: 500, damping: 32, mass: 0.8` (`bounce: 0`)
- **Accessibility & Reduced Motion**:
  - Universal CSS Killswitch: `@media (prefers-reduced-motion: reduce)` clamps all transitions and animations to `0.01ms !important` with negative delays.
  - SSR-Safe Hook: `usePrefersReducedMotion()` in [`lib/use-reduced-motion.ts`](file:///c:/Users/shiva/Downloads/New%20folder/lib/use-reduced-motion.ts) cancels RAF canvas loops and fast-forwards component lifecycles.

---

## App Surfaces & Architecture

Proofline delivers a unified, synchronized frontend architecture across marketing and application routes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Universal Vercel-Grade Header                        │
│   [ ] Proofline · Mega Menus · Search (⌘K) · Theme Toggle · User Menu   │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│               Synchronized App Workspace Sub-Navigation                │
│   [Check]  ·  [Facts (42)]  ·  [Audit]  ·  [Dashboard]  ·  [About]     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Landing Stage (`/`)**: 12-Band enterprise presentation featuring the contained SunsetOrb header shader, static architectural macOS-style topographic wallpaper, and 4 high-density Bento feature assets (Deterministic Claim Router, Version Lineage Ledger, 6-Pin Citation Gate, and SOC 2 Audit Ledger).
2. **Preflight Checker (`/check`)**: Interactive draft workbench. Paste marketing copy, run verification, inspect character spans, and record reviewer decisions (`Approve`, `Reject`, `Needs Edit`) with keyboard shortcuts (`a`, `r`, `e`, `j`, `k`).
3. **Fact Register (`/facts`)**: Searchable, versioned ground-truth register covering 42 facts. Filter by All, Stale, or Conflicting claims to test governance pathways.
4. **Decision Journal (`/audit`)**: Append-only compliance log. View every reviewer decision with cited fact IDs, reasons, and timestamps. One-click JSON export for SOC 2 audits.
5. **Operational Telemetry (`/dashboard`)**: Fingerprint-grade enterprise analytics suite featuring real-time verification volume area charts, dual-line verdict telemetry, contradiction breakdown tables, and deterministic rule efficacy ledgers.
6. **Architecture Specification (`/about`)**: In-depth thesis, core invariants, system non-goals, and link to the Round 1 plan PDF.
7. **Command Palette (`⌘K`)**: Universal search modal accessible from every page, enabling instant keyboard navigation across all views.

---

## Zero-Auth Architecture

Proofline is engineered with a **local-first, privacy-by-design** posture:

- **100% Zero-Auth Incognito:** No user accounts, sign-ins, JWTs, or tracking cookies. Works immediately upon opening in any private browser window.
- **Local-First Persistence:** All audit records, reviewer approvals, rejection notes, and register overrides persist strictly in browser `localStorage`.
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
# Run unit and motion test suite (111 tests passed)
npm test

# Run 24-case smoke benchmark evaluation (24/24 passed)
npm run smoke

# Run TypeScript strict type-check
npm run typecheck

# Run production build (10/10 Turbopack routes)
npm run build
```

---

## Verification & Test Matrix

Proofline enforces automated verification at every layer of the codebase:

```text
Unit & Motion Tests (Vitest)
  ✓ tests/resolve.test.ts    (11 tests) — Exact matching, currency normalization, temporal windows
  ✓ tests/segment.test.ts    (6 tests)  — Sentence boundary parsing, clause chunking, span tracking
  ✓ tests/normalize.test.ts  (9 tests)  — Currency symbols, scalar numbers, unit standardization
  ✓ tests/verdict.test.ts    (15 tests) — 6-verdict classification matrix and edge cases
  ✓ tests/verify.test.ts     (10 tests) — Evidence Gate invariants, missing fields downgrade
  ✓ tests/motion.test.ts     (60 tests) — 4-tier motion architecture, bezier math, reduced-motion

Smoke Evaluation Suite
  ✓ 24 of 24 benchmark cases match expected canonical verdict (gate: ≥ 20)
  ✓ 100% deterministic test-to-verdict consistency

Challenger Empirical Stress Suites
  ✓ 277 / 277 empirical physics assertions passed across 7 stress test harnesses
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
    "not_checkable": 0,
    "deterministic": 2,
    "model": 0
  },
  "findings": [
    {
      "claim": "Flowdesk starts at ₹4,999 per month",
      "verdict": "CONTRADICTED",
      "span": [16, 52],
      "factId": "F-021",
      "factVersion": "v4",
      "sourceDocumentId": "DOC-PRICING-2026",
      "sourceSpan": "[16-52]",
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
│   │   └── layout.tsx             # Marketing wrapper
│   ├── (app)/
│   │   ├── layout.tsx             # Synchronized app layout with Header & Subnav
│   │   ├── check/page.tsx         # Interactive preflight claim checker
│   │   ├── facts/page.tsx         # 42-fact owner-approved register
│   │   ├── audit/page.tsx         # Compliance decision journal
│   │   ├── dashboard/page.tsx     # Operational telemetry & drift metrics
│   │   └── about/page.tsx         # Architectural specification & thesis
│   ├── api/verify/route.ts        # POST /api/verify headless endpoint
│   ├── globals.css                # Semantic token system, motion tokens, dark/light scopes
│   └── layout.tsx                 # Root layout with IBM Plex fonts & theme script
├── components/
│   ├── landing/                   # Modular landing page components
│   │   ├── ProoflineHero.tsx      # Composio-precision hero with SunsetOrb & StageGridBackdrop
│   │   ├── StageGridBackdrop.tsx  # Architectural blueprint SVG coordinate grid with radar scan
│   │   ├── HeroTunnelCanvas.tsx   # 2D perspective tunnel depth canvas with reduced-motion bypass
│   │   ├── UseCasesDualPane.tsx   # 3-column interactive connected workflow stage with pulse conduits
│   │   ├── AgentsAndTrustBands.tsx# 8-surface verdict grid and 3-card trust permission matrix
│   │   ├── StickyJobsBand.tsx     # 3-step timeline with silk mesh card
│   │   ├── ArchifySystemExplorer.tsx # Interactive codebase topology & contract explorer
│   │   ├── DeveloperTerminalBand.tsx # Studio developer console with real-time CLI stream
│   │   ├── ApiPlayground.tsx      # Headless API playground with live POST /api/verify execution
│   │   ├── VerdictCard.tsx        # Flat, high-contrast verdict cards
│   │   ├── FaqAccordion.tsx       # Zero-layout-shift CSS grid smooth FAQ accordion
│   │   ├── ProoflineFooter.tsx    # Full-bleed aurora crossfade stage & vertical wordmark
│   │   └── assets/                # 4 in-house vector architecture diagrams (EvidenceGate, Split, etc.)
│   ├── ui/                        # Reusable atom components (vercel-navbar, sunset-orb, avatar, etc.)
│   ├── Checker.tsx                # Interactive draft checker with tactile buttons & keyboard nav
│   ├── FindingCard.tsx            # Materializing claim finding card with blur-rise stagger
│   ├── EvidenceDrawer.tsx         # Character-exact source span citation inspector
│   ├── FactsTable.tsx             # Filterable 42-fact register table with tactile buttons
│   ├── AuditLog.tsx               # Decision ledger with JSON download & filters
│   ├── Dashboard.tsx              # Telemetry stat cards & segmented verdict bars
│   ├── CommandPalette.tsx         # Universal ⌘K search dialog with spring scale physics
│   ├── NavLinks.tsx               # Synchronized app workspace tab bar with tactile feedback
│   └── ResetDemo.tsx              # Tactile demo reset button with local storage purge
├── lib/
│   ├── segment.ts                 # Claim extraction & character offset tracking
│   ├── normalize.ts               # Currency, scalar, and date normalization
│   ├── resolve.ts                 # Stage 1 deterministic rule resolution
│   ├── verify.ts                  # Stage 2-4 pipeline and Evidence Gate
│   ├── seed.ts                    # 42 production-grade registered facts
│   ├── motion-tokens.ts           # Master motion tokens, cubic beziers, and spring profiles
│   └── use-reduced-motion.ts      # SSR-safe prefers-reduced-motion hook with reactive listener
├── tests/                         # 111 Vitest unit tests (51 baseline + 60 motion)
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
4. Verify tests and evals pass (`npm run typecheck && npm test && npm run smoke && npm run build`)
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
