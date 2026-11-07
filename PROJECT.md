# Project: Proofline Motion Graphics & Interaction System

## Architecture
Proofline is an archival verification platform built on Next.js 16.4.5 App Router, React 19, and Tailwind CSS v4. The motion architecture embodies **Mechanical Precision & Editorial Restraint**, heavily weighted toward Emil Kowalski (60% - speed, restraint, tactile micro-feedback) and Jakub Krehel (35% - subtle production polish, bounce: 0 springs, blur+translate enters, softer exits), structured by Satori Graphics' 4 tutorial video principles (5% - Temporal Flow, 6 Levels of White Space, Moving Logo Systems, and the 3-Rule Design System).

### Motion Tokens & Physics Profiles
- **Durations**:
  - `--motion-instant`: 0ms (keyboard navigation, high-frequency actions)
  - `--motion-micro`: 120ms (buttons, icons, hover feedback)
  - `--motion-fast`: 180ms (badges, state toggles, icon crossfades)
  - `--motion-standard`: 240ms (cards, dropdowns, accordion expansion)
  - `--motion-deliberate`: 320ms (drawers, dialogs, layout shifts)
  - `--motion-hero`: 420ms (hero entrance sequence)
- **Cubic Bézier Curves**:
  - `--ease-arrival`: `cubic-bezier(0.16, 1, 0.3, 1)` (Fast arrival, gentle deceleration)
  - `--ease-departure`: `cubic-bezier(0.4, 0, 1, 1)` (Subtle, swift exit)
  - `--ease-mechanical`: `cubic-bezier(0.2, 0, 0, 1)` (Crisp state transition)
  - `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (Smooth iOS/Vaul slide deceleration)
- **Spring Physics**:
  - Standard/Layout: `stiffness: 380, damping: 30, mass: 1` (`bounce: 0`)
  - Micro/Tactile: `stiffness: 500, damping: 32, mass: 0.8` (`bounce: 0`)
- **Accessibility & Reduced Motion**:
  - Universal CSS override: `@media (prefers-reduced-motion: reduce)` sets animation/transition durations to `0.01ms !important`.
  - JS Guard: `window.matchMedia("(prefers-reduced-motion: reduce)").matches` checks before starting any Canvas / Anime.js / RAF loop.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Master Motion Tokens | CSS custom properties for durations, bezier curves, and spring tokens in globals.css | M1 | Video 4 / Skill |
| 2 | Reduced-Motion Architecture | Hardened CSS and JS prefers-reduced-motion killswitch and utility hooks | M1 | Request / Skill |
| 3 | Tactile Micro-Interactions | Button active press scale(0.97), badge transitions, focus rings | M1 | Emil Kowalski |
| 4 | Kinetic Logomark Aperture `[ ]` | Bracket glyph aperture expansion and snap lockup on load and hover | M2 | Video 3 (Ad0hBv_VMO0) |
| 5 | Hero Brief Mockup Tabs | Smooth sliding active tab pill indicator and row crossfade transitions | M2 | Video 2 & Emil Kowalski |
| 6 | Hero Stage Entrance | Temporal flow sequence (Notice -> Understand -> Find) with staggered blur-rise | M2 | Video 1 (GEOmxbCs-c8) |
| 7 | Use Cases Dual-Pane Flow | Smooth crossfade between scenarios and live SVG data signal pulses | M3 | Video 1 & Video 2 |
| 8 | FAQ Smooth Accordion | Zero-layout-shift smooth 0fr->1fr CSS grid height expansion with 45deg icon rotation | M3 | Jakub Krehel |
| 9 | Command Palette & Drawer Physics | Spring scale-up (0.96->1.0) modal entrance and right-rail drawer deceleration | M3 | Emil Kowalski (Vaul) |
| 10 | Interactive Checker Materialization | Claim finding cards materialize with blur+translate and capped 35ms stagger | M3 | Jakub Krehel |
| 11 | Kinetic Stage Blueprint & Grid | Subtly pulsing SVG coordinate grid with ambient radar scan | M4 | Satori Video 2 (POI) |
| 12 | Perspective Tunnel Activation | Seamlessly mounted HeroTunnelCanvas 2D canvas depth cluster with reduced-motion bypass | M4 | Video 1 (Implied Motion) |
| 13 | Developer Terminal Wire Pulses | Glowing SVG stroke-dash pulses across terminal and API playground connector wires | M4 | Video 2 (Alignment) |
| 14 | E2E Motion & Regression Test Suite | 4-Tier test suite verifying all motion behaviors, reduced motion, and regression guardrails | M-Test | Request R3 |
| 15 | Final Verification & Audit Gate | 51 Vitest tests, 24 smoke eval cases, clean build/typecheck, dev server health, clean audit | M5 | Request Acceptance |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M-Test | E2E Testing Suite (Dual Track) | Comprehensive 4-tier motion tests, reduced motion validation, and test harness | none | DONE (`TEST_READY.md`, 60 motion tests) |
| M1 | Motion Tokens & System Foundation | `app/globals.css`, motion token declarations, tactile button utilities, reduced motion hook | none | DONE (`lib/motion-tokens.ts`, `lib/use-reduced-motion.ts`, 111/111 tests passed) |
| M2 | Hero & Brand Kinetic Identity | `ProoflineHero.tsx`, `vercel-navbar.tsx`, logomark bracket kinetic lockup, brief tabs | M1 | DONE (`ProoflineHero.tsx`, `GATE_STATUS.md` PASS) |
| M3 | Interactive Components & State Transitions | `UseCasesDualPane.tsx`, `FaqAccordion.tsx`, `CommandPalette.tsx`, `Checker.tsx`, `FindingCard.tsx` | M1, M2 | DONE (`GATE_STATUS.md` PASS) |
| M4 | Ambient Assets & Kinetic Diagrams | `StageGridBackdrop.tsx`, `HeroTunnelCanvas.tsx`, `DeveloperTerminalBand.tsx`, SVG connectors | M1, M2 | PLANNED |
| M5 | Final Verification & Hardening Gate | Run full test suite (51 Vitest, 24 smoke, motion tests), typecheck, build, dev server, forensic audit | M1, M2, M3, M4, M-Test | PLANNED |

---

## Interface Contracts

### 1. Motion Tokens (`app/globals.css`)
- Variables:
  - `--motion-duration-instant`: `0ms`
  - `--motion-duration-micro`: `120ms`
  - `--motion-duration-fast`: `180ms`
  - `--motion-duration-standard`: `240ms`
  - `--motion-duration-deliberate`: `320ms`
  - `--motion-duration-hero`: `420ms`
  - `--ease-arrival`: `cubic-bezier(0.16, 1, 0.3, 1)`
  - `--ease-departure`: `cubic-bezier(0.4, 0, 1, 1)`
  - `--ease-mechanical`: `cubic-bezier(0.2, 0, 0, 1)`
  - `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)`
- Classes:
  - `.btn-proofline-tactile`: adds `active:scale-[0.97]` and standard hover transition
  - `.finding-card-enter`: applies `proofline-materialize-in` with `--index` stagger and `animation-fill-mode: backwards`
  - `.accordion-content-grid`: handles `grid-template-rows: 0fr -> 1fr`
  - `.logomark-bracket-left` / `.logomark-bracket-right`: handles aperture lock animation

### 2. Reduced Motion Contract
- CSS:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- JS hook: `usePrefersReducedMotion()` in `lib/use-reduced-motion.ts` returns boolean, reactive to `(prefers-reduced-motion: reduce)`.

---

## Code Layout
- `app/globals.css`: Master motion design tokens, keyframe definitions, tactile utilities, reduced-motion overrides.
- `lib/use-reduced-motion.ts`: Client hook for media query detection.
- `components/ui/vercel-navbar.tsx`: Header brand kinetic bracket `[ ]` aperture.
- `components/landing/ProoflineHero.tsx`: Hero stage entrance, hero bracket lockup, sliding brief tabs, metric pill micro-transitions.
- `components/landing/UseCasesDualPane.tsx`: Scenario crossfade, SVG wire data pulse signals.
- `components/landing/FaqAccordion.tsx`: Animated CSS grid height expansion, 45-degree rotating trigger icon.
- `components/landing/StageGridBackdrop.tsx`: SVG stage coordinate pulses.
- `components/landing/HeroTunnelCanvas.tsx`: 2D Canvas perspective tunnel activation with reduced-motion bypass.
- `components/landing/DeveloperTerminalBand.tsx`: Glowing SVG connector pulses.
- `components/CommandPalette.tsx`: Spring scale modal entrance.
- `components/FindingCard.tsx` & `components/Checker.tsx`: Materialize enter recipes and reviewer decision button feedback.
