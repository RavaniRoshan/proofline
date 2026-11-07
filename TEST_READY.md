# TEST_READY: Proofline Motion Architecture Test Suite

**Status**: READY / PASSED  
**Total Test Files**: 6  
**Total Tests**: 111 (51 baseline regression guardrail tests + 60 motion architecture tests)  
**Pass Rate**: 100% (111 passed, 0 failed)  
**Execution Time**: ~680ms  
**Test Runner**: Vitest v5.1.0 (`npm run test` or `npx vitest run`)  
**TypeScript**: Passed with zero errors (`npm run typecheck`)  
**ESLint**: Passed with zero errors (`npx eslint tests/motion.test.ts`)  

---

## 1. Test Suite Catalog

| # | Test File | Test Suites | Total Tests | Status | Scope |
|---|-----------|:-----------:|:-----------:|:------:|-------|
| 1 | `tests/normalize.test.ts` | 3 | 9 | PASS | Deterministic numeric & token-set parsing (Baseline) |
| 2 | `tests/resolve.test.ts` | 1 | 11 | PASS | Attribute resolution & scoping (Baseline) |
| 3 | `tests/segment.test.ts` | 1 | 6 | PASS | Character offset & clause segmentation (Baseline) |
| 4 | `tests/verdict.test.ts` | 3 | 15 | PASS | Deterministic verdicts & Evidence Gate (Baseline) |
| 5 | `tests/verify.test.ts` | 2 | 10 | PASS | Full pipeline hermetic verification (Baseline) |
| 6 | **`tests/motion.test.ts`** | **19** | **60** | **PASS** | **4-Tier Proofline Motion Graphics & Micro-Animation Suite** |
| **Total** | **6 files** | **29 suites** | **111 tests** | **PASS** | **Complete Project Coverage** |

---

## 2. 4-Tier Motion Test Coverage Matrix (`tests/motion.test.ts`)

### Tier 1: Feature Coverage (45 tests across 9 features)
- **Feature 1: Motion Design Tokens & Physical Equations (5 tests)**
  - 1.1.1 Monotonic duration scale: `instant` (0ms), `micro` (120ms), `fast` (180ms), `standard` (240ms), `deliberate` (320ms), `hero` (420ms).
  - 1.1.2 Arrival Bézier curve `(0.16, 1, 0.3, 1)` initial steep slope ($dy/dx = 6.25$) and asymptotic deceleration landing without overshoot.
  - 1.1.3 Departure Bézier curve `(0.4, 0, 1, 1)` initial stationary slope ($dy/dx = 0$) accelerating outward.
  - 1.1.4 Standard spring layout physics ($k=380, c=30, m=1$) damping ratio $\zeta \approx 0.77$ (`bounce: 0`).
  - 1.1.5 Micro spring tactile physics ($k=500, c=32, m=0.8$) damping ratio $\zeta = 0.80$ (`bounce: 0`).
- **Feature 2: Reduced-Motion Architecture & CSS Killswitch (5 tests)**
  - 1.2.1 `@media (prefers-reduced-motion: reduce)` declaration present in `app/globals.css`.
  - 1.2.2 Universal override sets `animation-duration: 0.01ms !important`.
  - 1.2.3 Universal override sets `transition-duration: 0.01ms !important`.
  - 1.2.4 Universal override sets `animation-iteration-count: 1 !important`.
  - 1.2.5 Media query change listener registration and cleanup lifecycle contract.
- **Feature 3: Kinetic Logomark Aperture `[ ]` (5 tests)**
  - 1.3.1 Brand logomark preserves signature bracket glyphs `[` and `]`.
  - 1.3.2 Accessible aria-label `"Proofline — Home"` on logo navigation link.
  - 1.3.3 Symmetrical opposite displacement coordinate vectors ($-4\text{px} / +4\text{px}$).
  - 1.3.4 Logomark brackets contained inside `aria-hidden="true"` element.
  - 1.3.5 Brand typography classes `text-accent-brand` and `dark:text-accent-readable`.
- **Feature 4: Hero Brief Mockup Tabs & Staged Entrance (5 tests)**
  - 1.4.1 Declaration of all 4 brief tabs (`outcomes`, `decisions`, `actions`, `questions`).
  - 1.4.2 Hero entrance lifecycle evaluates `(prefers-reduced-motion: reduce)`.
  - 1.4.3 Reduced motion sets `data-enter="done"` immediately without timer.
  - 1.4.4 Standard entrance sets `data-enter="run"` and transitions to `data-enter="done"`.
  - 1.4.5 Tab selection index validity within `[0..3]`.
- **Feature 5: Tactile Micro-Interactions & Button Feedback (5 tests)**
  - 1.5.1 Focus ring outline token: `outline: 2px solid var(--oxide); outline-offset: 2px;`.
  - 1.5.2 Universal button / input transition duration of 120ms in `app/globals.css`.
  - 1.5.3 Verdict badge transition duration of 320ms for decision state changes.
  - 1.5.4 Active press scale factor `0.97` (3% mechanical compression).
  - 1.5.5 Review shortcuts (`a`, `r`, `e`) dispatch immediately with 0ms animation delay.
- **Feature 6: Interactive Accordion (FAQ) (5 tests)**
  - 1.6.1 Single item toggle updates `openIndices` array accurately.
  - 1.6.2 Toggle all expands or collapses all indices simultaneously.
  - 1.6.3 ARIA contracts: `aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`.
  - 1.6.4 Toggle indicator symbol swaps between `−` (open) and `+` (closed).
  - 1.6.5 Header title color transition to `text-accent-brand` / `dark:text-accent-readable`.
- **Feature 7: Dual-Pane Signal Pulses & Pipeline Scenarios (5 tests)**
  - 1.7.1 Scenario catalog includes Pricing case with 3 tool steps.
  - 1.7.2 Verdict styling maps `CONTRADICTED`, `STALE`, `SUPPORTED`.
  - 1.7.3 Tool step badge sequence: `"01"`, `"02"`, `"03"`.
  - 1.7.4 Scenario selection state switching contract (`activeIdx`, `setActiveIdx`).
  - 1.7.5 Step transitions preserve pause/play state (`paused`, `setPaused`).
- **Feature 8: Ambient Assets & Canvas Graphics (5 tests)**
  - 1.8.1 `HeroTunnelCanvas` checks `prefers-reduced-motion` to bypass particle movement.
  - 1.8.2 Tunnel canvas strictly uses Proofline brand palette tokens (`--oxide`, `--slate`, `--v-supported-fg`).
  - 1.8.3 High-DPI canvas scaling clamps `devicePixelRatio` to maximum 2.
  - 1.8.4 Animation frame delta time $\Delta t$ clamped to $\le 0.05\text{s}$ to prevent tab-switching jumps.
  - 1.8.5 `StageGridBackdrop` SVG pattern defines 32x32 precision coordinate grid.
- **Feature 9: Command Palette & Evidence Drawer Physics (5 tests)**
  - 1.9.1 CommandPalette hotkeys: `⌘K` / `Ctrl+K` to open, `Escape` to close.
  - 1.9.2 Case-insensitive query filter across label and sublabel.
  - 1.9.3 EvidenceDrawer `splitExcerpt` accurately slices cited span `[start-end]`.
  - 1.9.4 `splitExcerpt` returns `null` for malformed or out-of-bounds spans.
  - 1.9.5 Dialog markup has `role="dialog"` and `aria-modal="true"`.

---

### Tier 2: Boundary & Corner Cases (5 tests)
- 2.1 Zero-duration fallback evaluation: Bézier endpoints $(0, 0)$ and $(1, 1)$ preserve mathematical stability without division by zero.
- 2.2 Stagger formula `calc(var(--index, 0) * 35ms)` across edge cases (index 0 $\to$ 0ms, negative index clamp $\to$ 0ms, index 50 $\to$ 1750ms).
- 2.3 High-frequency keyboard shortcuts: 20 rapid keystrokes within single tick execute deterministically without race conditions.
- 2.4 Media query listener lifecycle: 10 rapid preference changes dispatch listeners cleanly; cleanup unregisters all callbacks.
- 2.5 Degenerate & boundary string inputs: `splitExcerpt` handles empty string, single character, and 100,000-character excerpts safely.

---

### Tier 3: Cross-Feature Interactions (5 tests)
- 3.1 Reduced Motion + Hero Tab Switching: switching tabs when reduced motion is active executes with $\le 0.01\text{ms}$ duration.
- 3.2 Reduced Motion + Accordion Expansion: expanding accordion panel under reduced motion executes with $\le 0.01\text{ms}$ duration.
- 3.3 Theme Change (Light/Dark) + Motion Persistence: `.dark` selector alters color tokens without overriding motion durations or Bézier curves.
- 3.4 Modal Command Palette + Background Canvas: modal activation does not corrupt canvas coordinate matrices.
- 3.5 FindingCard Review Shortcut + Evidence Drawer Trigger: decision update maintains evidence span and citation data.

---

### Tier 4: Real-World Application Scenarios (5 tests)
- 4.1 Scenario 1: First-time visitor landing sequence (hero entrance lifecycle `run` $\to$ `done`, logomark bracket render, brief tabs cycle).
- 4.2 Scenario 2: Marketing reviewer pastes draft in Checker, materializes findings, inspects evidence drawer span.
- 4.3 Scenario 3: Developer visits terminal band, switches REST / TypeScript tabs, copies snippet, verifies timeout revert.
- 4.4 Scenario 4: User with `prefers-reduced-motion: reduce` navigates platform; universal override activates, canvas drift freezes, hero entrance skips delay.
- 4.5 Scenario 5: Deterministic verification engine preserves 100% regression fidelity on ground-truth claim (`F-012`).

---

## 3. How to Run the Test Suite

```bash
# Run full Vitest suite (all 111 tests)
npm run test

# Run only the Motion Architecture suite
npx vitest run tests/motion.test.ts

# Verify TypeScript typecheck
npm run typecheck

# Run smoke gate evaluation (24 cases)
npm run smoke
```

---

## 4. Observations & Notes for Milestone Workers

1. **Tailwind v4 Token Exposing**:
   Explorer M1-1's handoff recommends exposing `--motion-duration-*` and `--ease-*` in `app/globals.css` `:root` and mapping them inside `@theme inline` (`--duration-standard: var(--motion-duration-standard); --ease-arrival: var(--ease-arrival);`).
2. **React Hook Extraction**:
   Explorer M1-2 designed `lib/use-reduced-motion.ts` with `usePrefersReducedMotion()` and imperative `getPrefersReducedMotion()`.
3. **Sunset Pulse Anti-Slop**:
   Explorer M1-3 noted that `.animate-sunset-pulse` at `app/globals.css:271` is an unmotivated 10-second infinite loop and recommended taming or replacing it with scroll-reactive opacity.
