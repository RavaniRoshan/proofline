# E2E Test Infra: Proofline Motion Graphics & Interaction System

## Test Philosophy
- Opaque-box, requirement-driven. Derives from ORIGINAL_REQUEST.md and design motion specifications.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing across Tiers 1-4.
- Guardrails: 0 regressions across existing 51 Vitest unit tests and 24 smoke evaluation cases.
- Mandatory: Prefers-reduced-motion media query compliance, dev server zero-exception stability.

## Feature Inventory & Test Coverage Matrix
| # | Feature | Requirement Source | Tier 1 (Unit/Feature) | Tier 2 (Boundary/Edge) | Tier 3 (Cross-Feature) | Tier 4 (Workload) |
|---|---------|-------------------|:---------------------:|:----------------------:|:----------------------:|:-----------------:|
| 1 | Motion Design Tokens | ORIGINAL_REQUEST §R2 | 5 cases | 5 cases | ✓ | ✓ |
| 2 | Reduced-Motion Architecture | Acceptance Criteria | 5 cases | 5 cases | ✓ | ✓ |
| 3 | Kinetic Logomark Aperture `[ ]` | Tutorial Video 3 (Ad0hBv_VMO0) | 5 cases | 5 cases | ✓ | ✓ |
| 4 | Hero Brief Mockup Tabs | Tutorial Video 2 & Emil Kowalski | 5 cases | 5 cases | ✓ | ✓ |
| 5 | Tactile Micro-Interactions | Emil Kowalski | 5 cases | 5 cases | ✓ | ✓ |
| 6 | Interactive Accordion (FAQ) | Jakub Krehel | 5 cases | 5 cases | ✓ | ✓ |
| 7 | Dual-Pane Signal Pulses | Tutorial Video 1 & 2 | 5 cases | 5 cases | ✓ | ✓ |
| 8 | Ambient Assets & Canvas | Tutorial Video 1 & 2 | 5 cases | 5 cases | ✓ | ✓ |
| 9 | Command Palette / Drawer | Emil Kowalski (Vaul) | 5 cases | 5 cases | ✓ | ✓ |
| 10| Baseline Vitest (51 tests) | Acceptance Criteria | 51 cases (intact) | N/A | ✓ | ✓ |
| 11| Baseline Smoke (24 cases) | Acceptance Criteria | 24 cases (intact) | N/A | ✓ | ✓ |

## Test Architecture
- Test runner: Vitest (`npm run test` or `npx vitest run`) + Smoke runner (`npm run smoke`) + Motion suite (`tests/motion.test.ts`)
- Pass/Fail semantics: All tests must exit code 0 with 0 failures.
- Directory layout:
  - `tests/` — unit & motion test suites
  - `scripts/` — smoke evaluation scripts
  - `out/` — test execution reports

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | First-time visitor lands on hero, views kinetic logomark aperture, switches verification tabs | Logomark, Hero brief tabs, Ambient canvas, Reduced-motion check | High |
| 2 | Marketing reviewer pastes draft in Checker, interacts with finding cards, opens evidence drawer | Materialize enter, Tactile buttons, Drawer deceleration curve | High |
| 3 | Developer visits terminal band, switches REST/MCP tabs, copies cURL snippet | Copy icon swap, SVG connector pulses, Tab pill sliding | Medium |
| 4 | User with `prefers-reduced-motion: reduce` toggles system preferences and navigates site | Universal 0.01ms override, Canvas suppression, Accordion layout | Critical |
| 5 | Full smoke evaluation across all 24 factual claims with LLM verification | Deterministic engine + LLM fallback | Critical |

## Coverage Thresholds
- Tier 1: >= 5 test cases per motion feature
- Tier 2: >= 5 boundary / edge test cases (zero durations, invalid configs, reduced-motion)
- Tier 3: Pairwise combinations (e.g. reduced-motion + tab switch, reduced-motion + accordion expand)
- Tier 4: >= 5 application scenarios
