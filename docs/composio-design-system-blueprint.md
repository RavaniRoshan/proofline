# Composio Design System & Component Architecture Blueprint

> **Source**: Reverse-engineered and extracted from live headless Chromium inspection of [https://composio.dev/](https://composio.dev/)  
> **Extraction Date**: November 2026  
> **Target Viewports**: Desktop (1440 × 900 @ 2x DPR) and Mobile (390 × 844 @ 2x DPR)  
> **Artifact Directory**: `docs/composio-reference/`

---

## Table of Contents
1. [Core Design Tokens & CSS Variables](#1-core-design-tokens--css-variables)
2. [Typography & Font System](#2-typography--font-system)
3. [Navigation Bar & Mega Menu Architecture](#3-navigation-bar--mega-menu-architecture)
   - [Desktop Floating Pill Navbar](#desktop-floating-pill-navbar)
   - [Dynamic Theme Switch (Dark-to-Light on Scroll)](#dynamic-theme-switch-dark-to-light-on-scroll)
   - [Mega-Menu Dropdowns (Products, Solutions, Resources)](#mega-menu-dropdowns-products-solutions-resources)
   - [Mobile Drawer & CSS Grid Accordion](#mobile-drawer--css-grid-accordion)
4. [Hero Section & CTA Mechanics](#4-hero-section--cta-mechanics)
   - [H1 Word Rotator with Ghost Sizing](#h1-word-rotator-with-ghost-sizing)
   - [Dual CTAs & Grid-Stabilized Button Stacking](#dual-ctas--grid-stabilized-button-stacking)
   - [Hero WebGL Canvas & Procedural Shader Architecture](#hero-webgl-canvas--procedural-shader-architecture)
5. [Section-by-Section Card Architecture (Bands 2–12)](#5-section-by-section-card-architecture-bands-212)
   - [Band 2: Interactive Dual-Pane Use Cases Card](#band-2-interactive-dual-pane-use-cases-card)
   - [Band 3: Any AI Card Grid](#band-3-any-ai-card-grid)
   - [Band 4: Harder Jobs Sticky Scroll & 520px Audit Card](#band-4-harder-jobs-sticky-scroll--520px-audit-card)
   - [Band 5: Teams Permissions Flow Diagram](#band-5-teams-permissions-flow-diagram)
   - [Band 6: Trust & Security Architecture](#band-6-trust--security-architecture)
   - [Band 7: Developer Platform Terminal Window](#band-7-developer-platform-terminal-window)
   - [Band 11: FAQ Smooth CSS-Grid Accordion](#band-11-faq-smooth-css-grid-accordion)
   - [Band 12: Bottom CTA Canvas Card](#band-12-bottom-cta-canvas-card)
6. [Summary of Reference Screenshots](#6-summary-of-reference-screenshots)

---

## 1. Core Design Tokens & CSS Variables

Composio uses an adaptive dual-theme token structure utilizing both exact hex codes and modern OKLCH color coordinates.

```css
:root {
  /* Layout & Radii */
  --radius: 0.625rem; /* 10px */
  --announcement-topbar-height: 0px;

  /* Surfaces (Light Base) */
  --background: #f6f6f6;
  --card: #ffffff;
  --popover: #fafafa;
  --panel: #ffffff;
  --foreground: #0f0f0f;
  --card-foreground: #0f0f0f;
  --popover-foreground: #0f0f0f;

  /* Borders & Dividers */
  --border: oklch(92.2% 0 0);           /* ~#eaeaea */
  --input: oklch(92.2% 0 0);
  --ring: oklch(70.8% 0 0);

  /* Primary Brand Accents */
  --brand: #51a2ff;                     /* Light-state brand accent */
  --brand-hover: #3590f5;
  --brand-active: #1f7ee8;
  --brand-readable: #0007cd;             /* High contrast navy */
  --highlight: #d4ff4a;                  /* Acid lime */
  --highlight-foreground: #0f0f0f;

  /* Neutrals */
  --primary: oklch(20.5% 0 0);          /* Near black */
  --primary-foreground: oklch(98.5% 0 0);
  --secondary: oklch(97% 0 0);
  --secondary-foreground: oklch(20.5% 0 0);
  --muted: oklch(97% 0 0);
  --muted-foreground: oklch(55.6% 0 0);
}

.dark {
  /* Surfaces (Dark Base) */
  --background: #0f0f0f;
  --card: #1e1e1e;
  --popover: #2a2a2a;
  --panel: #151515;
  --foreground: #ffffff;
  --card-foreground: #ffffff;
  --popover-foreground: #ffffff;

  /* Borders & Dividers */
  --border: #2c2c2c;
  --input: oklch(100% 0 0 / 0.15);
  --ring: oklch(55.6% 0 0);

  /* Primary Brand Accents */
  --brand: #0007cd;                     /* Deep electric blue */
  --brand-hover: #0009f0;
  --brand-active: #0005a8;
  --brand-readable: #51a2ff;
  --highlight: #c9f53a;                  /* Vivid neon lime */
  --highlight-foreground: #0f0f0f;

  /* Neutrals */
  --primary: oklch(92.2% 0 0);
  --primary-foreground: oklch(20.5% 0 0);
  --secondary: oklch(26.9% 0 0);
  --secondary-foreground: oklch(98.5% 0 0);
  --muted: oklch(26.9% 0 0);
  --muted-foreground: oklch(70.8% 0 0);
}
```

---

## 2. Typography & Font System

Three font families form the typographic identity of the site:

1. **Body & Display (`font-sans` / `text-display`):**
   - Font Family: `geistSans, "geistSans Fallback", ui-sans-serif, system-ui, sans-serif`
   - Hero Display H1: `font-size: 64px`, `line-height: 69.12px (1.08)`, `letter-spacing: -1.6px`, `font-weight: 400`
   - Section Headings H2: `font-size: clamp(2rem, 5vw, 3rem)`, `line-height: 1.15`, `letter-spacing: -0.03em`
   - Card Titles H3: `font-size: 16px–18px`, `font-weight: 500`, `letter-spacing: -0.01em`
   - Body Large: `font-size: 16px`, `line-height: 24px (1.5)`, `color: rgb(15, 15, 15)` or `rgb(255, 255, 255)`

2. **Technical Buttons, Badges, Tabs & CTAs (`font-mono`):**
   - Font Family: `"JetBrains Mono", "JetBrains Mono Fallback", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
   - Menu triggers & Buttons: `font-size: 14px (0.875rem)`, `letter-spacing: 0.04em`, `text-transform: uppercase`
   - Eyebrows & Column Headers: `font-size: 11px`, `letter-spacing: 0.08em`, `text-transform: uppercase`

3. **Terminal Code Blocks (`code`, `pre`):**
   - Font Family: `"Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace`
   - Font Size: `12px`, `line-height: 19.5px (1.625)`

---

## 3. Navigation Bar & Mega Menu Architecture

### Desktop Floating Pill Navbar

The desktop navbar is implemented as an elevated floating pill container fixed to the top viewport:

```html
<header class="fixed top-0 left-0 z-50 flex w-full flex-col items-center overflow-visible border-b px-3 py-2 transition-[background-color,border-color,color,translate] duration-300 md:top-4 md:left-1/2 md:w-[calc(100%-2rem)] md:max-w-page md:-translate-x-1/2 md:border md:px-2 md:py-[8px] dark border-white/10 bg-card text-white">
  <nav class="flex w-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
    <!-- Brand Logo Left -->
    <a href="/" class="flex shrink-0 items-center">...</a>
    
    <!-- Mega Menu Triggers Center -->
    <div class="flex items-center gap-1">
      <button class="flex items-center gap-1 px-2 font-mono text-sm leading-normal tracking-default transition-colors duration-300 text-white">
        PRODUCTS <svg class="size-3 transition-transform duration-200">...</svg>
      </button>
      <button class="flex items-center gap-1 px-2 font-mono text-sm leading-normal tracking-default transition-colors duration-300 text-white">
        SOLUTIONS <svg class="size-3 transition-transform duration-200">...</svg>
      </button>
      <button class="flex items-center gap-1 px-2 font-mono text-sm leading-normal tracking-default transition-colors duration-300 text-white">
        RESOURCES <svg class="size-3 transition-transform duration-200">...</svg>
      </button>
    </div>

    <!-- Right Actions -->
    <div class="flex shrink-0 items-center gap-2 lg:justify-self-end">
      <a href="https://dashboard.composio.dev/login" class="whitespace-nowrap border px-2 py-1.5 font-mono text-sm leading-normal tracking-default transition-[color,background-color,border-color,opacity,visibility] duration-300 border-white bg-white text-black">
        GET STARTED – FREE
      </a>
    </div>
  </nav>
</header>
```

#### Dimensions & Spacing:
- **Width**: `calc(100% - 2rem)` with max constraint `max-w-page` (1240px).
- **Position**: `fixed top-4 left-1/2 -translate-x-1/2`.
- **Border Radius**: Sharp `0px` border-radius (`rounded-none`).
- **Padding**: `8px 8px` on desktop, `8px 12px` on mobile.

---

### Dynamic Theme Switch (Dark-to-Light on Scroll)

The navbar contains an intelligent dynamic theme-switching engine based on page scroll coordinates:

| Scroll Position | Active Classes | Background | Border | Text Color | Dropdown Card |
|---|---|---|---|---|---|
| **Top / Hero (< 1000px)** | `dark border-white/10 bg-card text-white` | `rgb(30, 30, 30)` | `1px solid rgba(255, 255, 255, 0.1)` | `#ffffff` | `border border-white/10 bg-card shadow-[0_16px_48px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.35)]` |
| **Scrolled (>= 1000px)** | `border-border bg-white text-black` | `rgb(255, 255, 255)` | `1px solid oklch(0.922 0 0)` | `#000000` | `border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08)]` |

**Transition Timing**: `transition-[background-color,border-color,color,translate] duration-300 ease-in-out`.

---

### Mega-Menu Dropdowns (Products, Solutions, Resources)

The mega menu uses a **Morphing Spring Panel Architecture** driven by Framer Motion:

```
[ Ghost Off-Screen Sizer (top: 0, left: -10000px, opacity: 0) ]
       │  (Measures exact content widths & heights for PRODUCTS, SOLUTIONS, RESOURCES)
       ▼
[ Animated Popover Container (absolute top-full left-0 z-50 pt-2) ]
       │  style="transform: translateX(47.39px); width: 866px; height: 446px;"
       ▼
[ Outer Border Card (rounded-none, border-white/10 bg-card) ]
       │  grid-template-columns: repeat(3, minmax(280px, max-content))
       ▼
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Column 1: USE           │ Column 2: DEVELOP       │ Column 3: ENTERPRISE    │
│ (border-l-0)            │ (border-l border-white) │ (border-l border-white) │
│ - COMPOSIO FOR YOU      │ - DEVELOPER PLATFORM    │ - TRIGGERS              │
│ - CLI                   │ - MCP GATEWAY           │ - FIREWALL (NEW badge)  │
│                         │ - ENTERPRISE            │                         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

#### Key Implementation Details:
1. **Ghost Off-Screen Pre-Measurement**:
   ```html
   <div aria-hidden="true" class="pointer-events-none fixed top-0 left-[-10000px] opacity-0">
     <div class="w-max">
       <div class="grid gap-0" style="grid-template-columns: repeat(3, minmax(280px, max-content));">...</div>
     </div>
   </div>
   ```
   Renders all candidate menus off-screen at `left: -10000px` to continuously compute and cache client bounding rectangles.

2. **Morphing Outer Card**:
   - `width` and `height` dynamically morph via CSS/Framer Motion: `866px × 446px` (Products), `780px × 360px` (Solutions), `640px × 320px` (Resources).
   - Horizontal sliding: `transform: translateX(x_offset)`.
   - Card Border Radius: Strictly `0px` (`rounded-none`).

3. **Item Layout & Hover States**:
   - Link: `<a class="group flex w-full gap-3 px-5 py-4 transition-colors hover:bg-white/5" href="...">`
   - Category Eyebrow: `<div class="mb-1 pt-2 pb-0.5 font-mono text-[11px] uppercase tracking-wider text-white/40 px-5">`
   - Badge Pills:
     - Blue pill: `rounded-xs border px-1 py-0.5 font-medium text-[10px] leading-normal border-blue-400 text-blue-400`
     - New / highlight pill: `border-amber-400 text-amber-400`

---

### Mobile Drawer & CSS Grid Accordion

On viewports `< 1024px` (`lg:hidden`), the navigation switches to a slide-down accordion drawer.

```html
<!-- Hamburger Button -->
<button aria-label="Toggle menu" class="flex size-8 flex-col items-center justify-center gap-[5px] lg:hidden" type="button">
  <span class="h-[2px] w-5 origin-center transition-all duration-300 bg-white"></span>
  <span class="h-[2px] w-5 transition-all duration-300 bg-white"></span>
  <span class="h-[2px] w-5 origin-center transition-all duration-300 bg-white"></span>
</button>
```

#### The Zero-JS Smooth Height Accordion Trick:
Rather than JavaScript height calculations, the mobile menu accordion items animate using CSS Grid:

```html
<!-- Closed State: grid-rows-[0fr] -->
<!-- Open State: grid-rows-[1fr] -->
<div class="grid transition-[grid-template-rows] duration-200 grid-rows-[1fr]" id="_R_m7audb_">
  <div class="min-h-0 overflow-hidden">
    <div class="px-4 pt-3 pb-1 font-mono text-[11px] uppercase tracking-wider text-white/40">Use</div>
    <div class="grid grid-cols-2">
      <a class="flex flex-col gap-2.5 py-3 transition-colors duration-300 px-4 text-white/70" href="/for-you">
        ...
      </a>
    </div>
  </div>
</div>
```

---

## 4. Hero Section & CTA Mechanics

### H1 Word Rotator with Ghost Sizing

The H1 headline features an animated word cycler that seamlessly animates word widths without layout shift.

```html
<h1 class="text-balance text-center text-display text-white leading-[1.08] max-md:text-[clamp(2rem,11vw,2.75rem)]">
  <span class="block">Give your AI secure access</span>
  <span class="flex flex-wrap items-baseline justify-center gap-x-[0.25em] gap-y-[0.12em]">
    <span>to</span>
    
    <!-- Word Rotator Sizing Wrapper -->
    <span class="relative -my-[0.12em] inline-flex justify-center overflow-hidden py-[0.12em] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none" style="width: 270.609px;">
      
      <!-- Active Animated Word -->
      <span class="inline-block shrink-0 whitespace-nowrap" style="opacity: 1; transform: none;">
        a browser
      </span>

      <!-- Ghost Sizing Element for Exact Pre-Layout -->
      <span aria-hidden="true" class="pointer-events-none invisible absolute top-0 left-0 flex w-max">
        <span class="shrink-0 whitespace-nowrap">1,500+ apps</span>
        <span class="shrink-0 whitespace-nowrap">a browser</span>
        <span class="shrink-0 whitespace-nowrap">a sandbox</span>
        <span class="shrink-0 whitespace-nowrap">skills</span>
      </span>
    </span>

    <span aria-hidden="true" class="basis-full md:hidden"></span>
    <span class="inline-block bg-brand px-[0.2em] text-white leading-none">in minutes</span>
  </span>
</h1>
```

#### Mathematical Animation Profile:
- **Container Width Morphing**: `transition-[width] duration-500 ease-[cubic-bezier(0.22, 1, 0.36, 1)]`
- **Cycle Interval**: ~2500ms per word
- **Exit Motion**: `opacity: 1 -> 0`, `transform: translateX(0) -> translateX(103.14%)`
- **Enter Motion**: `opacity: 0 -> 1`, `transform: translateX(-103.14%) -> translateX(0)`
- **Highlight Badge**: `bg-brand` (`#0007cd`) with `px-[0.2em] text-white leading-none`.

---

### Dual CTAs & Grid-Stabilized Button Stacking

The Hero secondary CTA contains a clever CSS grid stabilization technique to prevent jitter during copy testing and active state switching:

```html
<div class="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
  <!-- Primary Solid CTA -->
  <a href="https://dashboard.composio.dev/login" 
     class="relative z-10 bg-white px-4 py-3 text-center font-mono text-black text-sm leading-normal tracking-default md:px-6">
    GET STARTED FOR FREE
  </a>

  <!-- Secondary Grid-Stabilized CTA -->
  <a href="/contact" 
     class="relative z-10 inline-grid border border-white/30 bg-transparent px-4 py-3 font-mono text-sm text-white/60 leading-normal tracking-default transition-colors hover:bg-white/10 hover:text-white md:px-6">
    
    <!-- Ghost Sizing Element occupying Grid Cell [1,1] -->
    <span aria-hidden="true" class="invisible col-start-1 row-start-1 flex items-center justify-center gap-3 whitespace-nowrap">
      CONNECT YOUR AI <span class="w-[70px]"></span>
    </span>
    
    <!-- Visible Copy occupying the exact same Grid Cell [1,1] -->
    <span class="col-start-1 row-start-1 flex items-center justify-center gap-3 whitespace-nowrap">
      GET A DEMO
    </span>
  </a>
</div>
```

#### Why `inline-grid` with `col-start-1 row-start-1`?
The secondary button reserves the width of its longest alternate variant (`CONNECT YOUR AI` + 70px spacer) without hardcoded pixel widths (`199.7px`). This guarantees that dynamic text swaps or multilingual translations never cause the sibling Primary CTA to shift on screen.

---

### Hero WebGL Canvas & Procedural Shader Architecture

Behind the hero copy sits an active WebGL2 canvas wrapped in a radial mask:

```html
<div aria-hidden="true" class="absolute inset-0 -z-10 size-full [mask-image:radial-gradient(closest-side,black_35%,transparent)]">
  <div class="absolute inset-0 bg-center bg-cover transition-opacity duration-700 ease-out" 
       style="background-image:url(/images/instant-gradient-fallback.jpg); opacity: 1;"></div>
  <canvas class="absolute inset-0 h-full w-full transition-opacity duration-700 ease-out"></canvas>
</div>
```

#### Extracted GLSL Vertex Shader (`hero-tunnel`):
```glsl
#version 300 es
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 aOffset;
attribute vec2 aScale;
attribute float aSpeed;
uniform float uTime;
uniform float uBaseSpeed;
uniform float uShrink;
uniform float uVertical;

varying float vFade;

void main() {
  vec2 scaled = position.xy * aScale;
  float totalDepth = 100.0;
  float zOffset = mod(aOffset.z - uTime * uBaseSpeed * aSpeed, totalDepth);
  float centerZ = -(zOffset - 6.0);
  float z = centerZ + scaled.x;

  // S-curve pinch — gradual at ends, steep in middle
  float centerDepth = max(0.0, -centerZ);
  float t = smoothstep(0.0, 94.0, centerDepth);
  float pinch = mix(1.0, 0.4, t);

  float shrinkScale = 1.0 - uShrink * 0.3;
  float minGap = 18.0 * shrinkScale;

  vec3 center;
  vec3 local;

  if (uVertical > 0.5) {
    // Mobile viewport: top/bottom walls
    center.x = aOffset.x * pinch * shrinkScale;
    center.y = aOffset.y * pinch * shrinkScale + sign(aOffset.y) * minGap;
    center.z = centerZ;
    local.x = scaled.y * pinch;
    local.y = 0.0;
    local.z = scaled.x;
  } else {
    // Desktop viewport: left/right walls
    center.x = aOffset.x * pinch * shrinkScale + sign(aOffset.x) * minGap;
    center.y = aOffset.y * pinch * shrinkScale;
    center.z = centerZ;
    local.x = 0.0;
    local.y = scaled.y * pinch;
    local.z = scaled.x;
  }

  vec3 wallPos = center + local;
  vFade = smoothstep(1.0, 0.7, zOffset / totalDepth);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(wallPos, 1.0);
}
```

#### Extracted GLSL Fragment Shading Features:
1. **Oklab Color Space Interpolation**: Color gradients are mixed in linear Oklab color space before being converted to Display P3:
   ```glsl
   vec3 lab = mix(mix(uLab[0], uLab[1], t1), mix(uLab[2], uLab[3], t1), t2);
   vec3 p3 = mat3(
     0.8224621, 0.0331941, 0.0170826,
     0.177538,  0.9668058, 0.0723974,
     0.0,        0.0,       0.9105199
   ) * oklabToLinear(lab);
   ```
2. **Procedural Grid Lines**:
   ```glsl
   float lineFilter(float p, float w, float n) {
     float a = p + w * 0.5;
     float b = p - w * 0.5;
     return (floor(a) + min(fract(a) * n, 1.0) - floor(b) - min(fract(b) * n, 1.0)) / (n * w);
   }
   ```
3. **Procedural Film Grain Hash**:
   ```glsl
   float hash12(vec2 p) {
     uvec2 u = floatBitsToUint(p * vec2(141421356.0, 2718281828.0));
     return float((u.x ^ u.y) * 3141592653u) / 4294967295.0;
   }
   ```

---

## 5. Section-by-Section Card Architecture (Bands 2–12)

### Band 2: Interactive Dual-Pane Use Cases Card
- **Selector / Anchor**: `#use-cases`
- **Heading**: `"Make your AI finish what you ask"`
- **Layout**: `grid md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]`
- **Main Card Dimensions**: `height: 458px`, `border-radius: 24px`
- **Card Surface**:
  - `background-color: var(--card)` (`#ffffff` light, `#1e1e1e` dark)
  - `border: 1px solid color-mix(in oklab, var(--foreground) 8%, transparent)`
- **Checklist Pills (Asymmetric Radii)**:
  - Tools pill: `rounded-tl-[25px] rounded-md`
  - Skills pill: `rounded-t-md rounded-b-[28px]`
  - Instant Tools: `rounded-t-[28px] rounded-b-md`
  - Log pill: `rounded-t-md rounded-b-[25px]`
- **Interactive Controls**:
  - Circular Pause Demo Button: `size-8 rounded-full border border-foreground/10 bg-card text-foreground/45`
  - Horizontal connector line: `<span class="absolute top-1/2 left-0 h-px bg-foreground/15">`
  - Right pane mask: `md:[mask-image:linear-gradient(to_right,transparent,black_12%)]`

---

### Band 3: Any AI Card Grid
- **Selector / Anchor**: `#agents`
- **Heading**: `"Works with any AI"`
- **Grid Configuration**: `grid grid-cols-2 gap-3 md:grid-cols-4` (Width: 1158px, Gap: 12px)
- **Cards (Claude, ChatGPT, Codex, Cursor, Grok Bot, Hermes, OpenClaw, Any MCP client)**:
  - Container: `border: 1px solid oklch(92.2% 0 0)` (light) / `border-white/10` (dark)
  - Padding: `4px 0px 0px 0px`
  - Icon Specifications: `size-7 shrink-0 object-contain` (28px × 28px)
  - Title Typography: `font-sans text-base font-normal`
  - Hover Action: `scale-[1.02] border-foreground/30`
- **Sub-link**: `"See the guide for each"` with `underline decoration-foreground/30 hover:decoration-foreground`.

---

### Band 4: Harder Jobs Sticky Scroll & 520px Audit Card
- **Selector / Anchor**: `#harder-jobs`
- **Heading**: `"Don’t settle for AI that stops halfway"`
- **Total Section Height**: `2807px`
- **Sticky Mechanism**:
  ```html
  <div class="sticky top-[5.5rem] flex items-center h-[788px]">
  ```
  Pinning occurs at `top: 5.5rem (88px)`.
- **Left 3-Step Timeline**:
  1. `Tested skills for recurring work`
  2. `A computer for the heavy work`
  3. `Instant tools, no sign-ups`
  - Step transitions interpolate `opacity: 0.35` (inactive) -> `opacity: 1.0` (active) based on vertical scroll distance.
- **Right 520px Visual Card (Receipt / CSV Audit Ledger)**:
  - Width: `547px` (desktop), Height: `680px`
  - Border Radius: `32px` (`rounded-[32px]`)
  - Border: `1px solid oklab(0.168 0 0 / 0.1)`
  - Internal Padding: `p-8 md:p-12` (48px)
  - Content: Tabular CSV audit ledger with execution status indicators (`bg-emerald-500/10 text-emerald-600`), monospace timing stamps, and token cost breakdown.

---

### Band 5: Teams Permissions Flow Diagram
- **Selector / Anchor**: `#teams`
- **Heading**: `"One setup for your whole team"`
- **Sub-Cards Grid**: 3 Column Cards
  1. `Shared Accounts` (`375px × 368px`)
  2. `Shared Skills` (`375px × 368px`)
  3. `Shared Budget` (`375px × 368px`)
- **Card Tokens**:
  - `border-radius: 22px` (`rounded-3xl`)
  - `border: 1px solid oklab(0.168 0 0 / 0.1)`
  - `background-color: var(--card)`
- **Permissions Flow Architecture**:
  - SVG node connectors linking organizational roles (`Admin`, `Developer`, `Agent`) to connected apps (Slack, GitHub, HubSpot, Stripe).
  - Badge Pills: `rounded-full px-2.5 py-1 font-mono text-xs` with color-coded RBAC permission status (`Read`, `Execute`, `Write`).

---

### Band 6: Trust & Security Architecture
- **Selector / Anchor**: `#trust`
- **Heading**: `"Secure access, always in your control"`
- **Cards**:
  1. `Your accounts, your rules`
  2. `Prompt injections get blocked`
  3. `Every action on record`
- **Card Tokens**: `rounded-2xl border border-foreground/10 bg-card p-6`
- **Enterprise Badges**: Certified SOC 2 Type II, HIPAA, ISO 27001, and GDPR compliance seals.

---

### Band 7: Developer Platform Terminal Window
- **Selector / Anchor**: `#build`
- **Heading**: `"Build it into your agent"`
- **Theme**: Always pinned to `.dark` theme (`dark bg-background text-foreground`).
- **Terminal Shell**:
  - Outer Container: `rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl`
  - Window Header:
    - 3 macOS Control Dots (`size-[9px] rounded-full`):
      - Close: `#ff5f56` (`rgb(255, 95, 86)`)
      - Minimize: `#febc2e` (`rgb(254, 188, 46)`)
      - Expand: `#28c840` (`rgb(40, 200, 64)`)
  - Language Tabs: `Python`, `TypeScript`, `cURL`
  - Code Typography: `"Geist Mono"`, `font-size: 12px`, `line-height: 19.5px`
  - Syntax Highlighting: Shiki-rendered tokens for imports, tool decorators, and agent action executions.

---

### Band 11: FAQ Smooth CSS-Grid Accordion
- **Selector / Anchor**: Section with H2 `"Frequently asked questions"`
- **Item Trigger**:
  ```html
  <button aria-expanded="true" class="flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left md:py-6">
    <span class="text-body-lg text-foreground">Do I have to switch to a new AI to use Composio?</span>
    <span aria-hidden="true" class="shrink-0 font-mono text-base leading-snug transition-colors duration-300 text-foreground">−</span>
  </button>
  ```
- **Expansion Mechanism**:
  ```html
  <div class="grid transition-[grid-template-rows,visibility] duration-300 ease-in-out visible grid-rows-[1fr]">
    <div class="min-h-0 overflow-hidden">
      <p class="pb-6 text-foreground/70 text-base leading-relaxed">...</p>
    </div>
  </div>
  ```
  - Closed: `grid-rows-[0fr]` + `invisible`
  - Open: `grid-rows-[1fr]` + `visible`
  - Icon: Monospace `+` character flipping smoothly to `−`.

---

### Band 12: Bottom CTA Canvas Card
- **Selector / Anchor**: Section with H2 `"Give your AI what it needs to finish the job"`
- **Card Dimensions**: `1158px × 462px`
- **Border Radius**: `32px` (`rounded-[32px]`)
- **Border**: `1px solid oklab(0.168 0 0 / 0.1)`
- **Background**: Dynamic mesh canvas backdrop with radial falloff.
- **CTAs**:
  1. Primary Solid Black Button:
     - Text: `"CONNECT YOUR AI"`
     - Classes: `inline-flex items-center justify-center gap-2 bg-foreground px-5 py-3 font-mono text-background text-sm uppercase tracking-default hover:bg-foreground/85 active:scale-[0.98]`
     - Border Radius: Sharp `0px` (`rounded-none`).
  2. Secondary Outlined Button:
     - Text: `"SEE IT WORK"`
     - Classes: `inline-flex items-center justify-center gap-2 border border-foreground/15 bg-card px-5 py-3 font-mono text-foreground text-sm uppercase tracking-default hover:border-foreground/30 active:scale-[0.98]`
     - Target: `#use-cases` (smooth scrolls back to Band 2).

---

## 6. Summary of Reference Screenshots

All component screenshots were captured at 2x Device Pixel Ratio and are saved in `docs/composio-reference/`:

| Filename | Description | Resolution |
|---|---|---|
| `01-navbar-default.png` | Default floating pill navbar in dark hero state | 1440 × 160 @ 2x |
| `01-navbar-light-scrolled.png` | Scrolled navbar dynamically transitioned to white light state | 1440 × 160 @ 2x |
| `01-megamenu-products.png` | PRODUCTS 3-column mega dropdown with morphing card border | 1440 × 650 @ 2x |
| `01-megamenu-solutions.png` | SOLUTIONS mega dropdown | 1440 × 650 @ 2x |
| `01-megamenu-resources.png` | RESOURCES mega dropdown | 1440 × 650 @ 2x |
| `01-megamenu-products-light-state.png` | PRODUCTS mega dropdown in light scrolled state | 1440 × 650 @ 2x |
| `01-navbar-mobile-closed.png` | Mobile viewport (390px) header with 3-line hamburger | 390 × 120 @ 2x |
| `01-navbar-mobile-open.png` | Mobile viewport drawer open | 390 × 844 @ 2x |
| `01-navbar-mobile-accordion-open.png` | Mobile drawer with PRODUCTS accordion expanded via CSS grid | 390 × 844 @ 2x |
| `02-hero-section.png` | Hero section with H1 word rotator and WebGL perspective canvas | 1440 × 900 @ 2x |
| `03-band2-use-cases.png` | Band 2 interactive dual-pane card with 8-stage checklist | 1440 × 934 @ 2x |
| `04-band3-agents-grid.png` | Band 3 8-agent card grid with brand icons | 1440 × 552 @ 2x |
| `05-band4-sticky-timeline.png` | Band 4 sticky scroll timeline and 520px audit card | 1440 × 900 @ 2x |
| `06-band5-permissions-diagram.png` | Band 5 Teams permissions diagram and RBAC pills | 1440 × 900 @ 2x |
| `07-band6-trust-security.png` | Band 6 Trust & compliance security cards | 1440 × 900 @ 2x |
| `08-band7-terminal-card.png` | Band 7 dark mode terminal card with macOS window dots | 1440 × 900 @ 2x |
| `09-band11-faq-accordion.png` | Band 11 FAQ accordion with expanded item | 1440 × 900 @ 2x |
| `10-band12-bottom-cta.png` | Band 12 1158px bottom CTA banner with dual action buttons | 1440 × 700 @ 2x |

---

*Document compiled by Playwright headless reverse-engineering extraction pipeline.*
