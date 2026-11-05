---
name: Proofline
description: Deterministic claim-evidence checker for brand governance
colors:
  paper: "#FFFFFF"
  panel: "#F5F5F2"
  ink: "#1A1A18"
  ink-soft: "#4A4A45"
  ink-faint: "#6B6B63"
  slate: "#3B4A45"
  slate-deep: "#2A3632"
  oxide: "#6E1F26"
  oxide-hover: "#571820"
  accent-readable: "#D4847A"
  line: "#DEDED8"
  line-strong: "#C9C9C1"
  v-supported-fg: "#1F5C43"
  v-supported-bg: "#DDEBE0"
  v-contradicted-fg: "#A8261C"
  v-contradicted-bg: "#F7E3E0"
  v-stale-fg: "#7E4A10"
  v-stale-bg: "#F8EEDA"
  v-unverified-fg: "#4A4A45"
  v-unverified-bg: "#E8E6DF"
  v-conflicting-fg: "#5A3461"
  v-conflicting-bg: "#EDE5EF"
  v-notcheckable-fg: "#5F5F58"
  v-notcheckable-bg: "#ECEAE3"
typography:
  scale:
    - "10px"
    - "11px"
    - "12px"
    - "13px"
    - "14px"
    - "15px"
    - "16px"
    - "17px"
    - "18px"
    - "19px"
    - "24px"
    - "30px"
    - "36px"
    - "44px"
  headline:
    fontFamily: "var(--font-plex-serif), Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-plex-sans), system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "var(--font-plex-sans), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "var(--font-plex-mono), monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "18px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-accent:
    backgroundColor: "{colors.oxide}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  badge-verdict:
    rounded: "{rounded.sm}"
    padding: "4px 8px"
    typography: "{typography.mono}"
---

# Design System

## Overview

Proofline’s aesthetic reflects the editorial rigor of an archival legal press merged with the speed of an automated compiler. It rejects generic "AI slop" (random purple-blue gradients, floating orb illustrations, uncalibrated padding, and meaningless status pulses). Color conveys semantic truth: the six verdict states are the primary saturated accents in an otherwise quiet palette of white paper, warm slate, and deep oxblood.

## Colors

- **Paper (`#FFFFFF`) & Panel (`#F5F5F2`)**: Warm, neutral backgrounds resembling archival paper.
- **Ink (`#1A1A18`) & Ink Soft (`#4A4A45`)**: High-contrast, legible text tones meeting WCAG AA standards.
- **Oxide (`#6E1F26`)**: Proofline’s signature deep oxblood accent for key actions and critical discrepancies.
- **Accent Readable (`#D4847A`)**: Calibrated light oxblood variant ensuring high-contrast legibility on dark surfaces.
- **Hairline Lines (`#DEDED8` / `#C9C9C1`)**: Subtle structural division lines.
- **The Six Verdict Colors**:
  - `SUPPORTED`: Forest green (`#1F5C43` on `#DDEBE0`)
  - `CONTRADICTED`: Brick red (`#A8261C` on `#F7E3E0`)
  - `STALE`: Amber (`#7E4A10` on `#F8EEDA`)
  - `CONFLICTING`: Plum (`#5A3461` on `#EDE5EF`)
  - `UNVERIFIED`: Neutral slate (`#4A4A45` on `#E8E6DF`)
  - `NOT_CHECKABLE`: Faint olive slate (`#5F5F58` on `#ECEAE3`)

## Typography

- **Display & Headlines (`IBM Plex Serif`)**: Weight 400. Dignified, measured, editorial. Never bolded at display sizes (display weights remain 400/500).
- **Body & Controls (`IBM Plex Sans`)**: Weight 400 (regular) and 600 (semibold). Clear, legible, functional.
- **Metadata & Technical Reads (`IBM Plex Mono`)**: Weight 400. Used for verdict badges, document references, character span indicators, timestamps, and cURL commands.
- **Legibility Floor**: Functional UI text must never dip below 11px. Minimum body text is 14px (16px default).
- **Measure**: Body paragraphs constrain line length to `< 75ch` (`max-w-prose` or `max-w-[70ch]`) with `text-wrap: pretty`.

## Layout

- **Grid Systems**: 12-column responsive layout capped at `1240px` (`--max-w-page: 1240px`).
- **Breakpoints**: 375px (mobile), 768px (tablet / floating pill start), 1024px (desktop / 3-column nav), 1280px (standard desktop), 1536px (wide desktop).
- **Zero Horizontal Overflow**: Guaranteed at all breakpoints. Mobile grids collapse to 1 or 2 columns or horizontal snap-scroll rails.

## Elevation & Depth

- Restrained depth. Flat, crisp surfaces with 1px border lines rather than heavy drop shadows.
- Subtle elevation is reserved exclusively for the floating navigation pill (`0 16px 36px -10px rgba(0, 0, 0, 0.4)` with backdrop blur).

## Shapes

- Rounded radii are intentional:
  - `rounded-[4px]`: Action buttons, badges, input fields.
  - `rounded-[14px]` to `rounded-[22px]`: Structural cards and demo panels.
  - `rounded-full`: Floating navigation pill.
- Avoid mixing thick directional borders with rounded corners (`border-b-2` on rounded elements).

## Components

- **Header Pill**: Floats at top 16px on desktop with `backdrop-filter: blur(12px)`.
- **Verdict Badges**: Monospace text pill with an explicit state label and accompanying icon.
- **Evidence Drawer**: Slide-over panel citing the exact document span and version.
- **Code Terminal**: Dark container with macOS traffic-light buttons and syntax-highlighted commands.

## Do's and Don'ts

### Do
- Treat a verdict as an explicit word, not just a color.
- Cite the exact source document, span, and validity dates for every contradiction.
- Use `text-wrap: pretty` to eliminate orphaned single words.
- Maintain high-contrast text ratios (≥ 4.5:1 for body copy).

### Don't
- Don't use decorative pulsing status dots to fake live AI thinking.
- Don't nest cards inside cards inside cards; flatten with spacing and dividers.
- Don't use small 40x40 icon tiles stacked on top of card headings.
- Don't use generic purple/blue gradients or generic Inter typography.
