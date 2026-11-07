/**
 * Empirical Stress Test Harness for Milestone 1
 * Challenger M1-1
 */

import React from "react";
import { renderToString } from "react-dom/server";
import {
  MOTION_DURATIONS,
  MOTION_DURATIONS_CSS,
  MOTION_EASINGS,
  MOTION_BEZIERS,
  SPRINGS,
  ANIME_SPRINGS,
  MOTION_TOKENS,
} from "../lib/motion-tokens";
import {
  usePrefersReducedMotion,
  useReducedMotion,
  getPrefersReducedMotion,
} from "../lib/use-reduced-motion";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, name: string, details: string) {
  reports.push({
    name,
    passed: !!condition,
    details: condition ? `PASS: ${details}` : `FAIL: ${details}`,
  });
  if (!condition) {
    console.error(`[FAIL] ${name}: ${details}`);
  } else {
    console.log(`[PASS] ${name}: ${details}`);
  }
}

// =========================================================================
// 1. MATHEMATICAL EVALUATION OF BÉZIER CURVES & SPRINGS
// =========================================================================

function evaluateCubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  t: number
): { x: number; y: number } {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const x = ((ax * t + bx) * t + cx) * t;
  const y = ((ay * t + by) * t + cy) * t;
  return { x, y };
}

console.log("\n=== 1. MATHEMATICAL STRESS TEST: BÉZIER CURVES ===");

// 1.1 Arrival Curve: cubic-bezier(0.16, 1, 0.3, 1)
{
  const [p1x, p1y, p2x, p2y] = MOTION_BEZIERS.arrival;
  let maxY = -Infinity;
  let minY = Infinity;
  let nonMonotonicCount = 0;
  let prevY = -1;
  const SAMPLES = 10000;

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const { x, y } = evaluateCubicBezier(p1x, p1y, p2x, p2y, t);
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (y < prevY - 1e-9) nonMonotonicCount++;
    prevY = y;
  }

  assert(
    maxY <= 1.000001,
    "Arrival Curve: Zero Overshoot",
    `Max y = ${maxY.toFixed(6)} across ${SAMPLES} samples (strictly <= 1.0)`
  );
  assert(
    minY >= -0.000001,
    "Arrival Curve: Zero Undershoot",
    `Min y = ${minY.toFixed(6)} across ${SAMPLES} samples (strictly >= 0.0)`
  );
  assert(
    nonMonotonicCount === 0,
    "Arrival Curve: Strict Monotonicity",
    `Non-monotonic decrements: ${nonMonotonicCount}`
  );

  const slopeT0 = p1y / p1x;
  assert(
    Math.abs(slopeT0 - 6.25) < 0.01,
    "Arrival Curve: Punchy Initial Velocity",
    `Initial slope dy/dx = ${slopeT0.toFixed(4)} (expected 6.25)`
  );
}

// 1.2 Departure Curve: cubic-bezier(0.4, 0, 1, 1)
{
  const [p1x, p1y, p2x, p2y] = MOTION_BEZIERS.departure;
  let maxY = -Infinity;
  let minY = Infinity;
  let nonMonotonicCount = 0;
  let prevY = -1;
  const SAMPLES = 10000;

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const { y } = evaluateCubicBezier(p1x, p1y, p2x, p2y, t);
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (y < prevY - 1e-9) nonMonotonicCount++;
    prevY = y;
  }

  assert(
    maxY <= 1.000001 && minY >= -0.000001,
    "Departure Curve: Bounded [0, 1]",
    `Min: ${minY.toFixed(6)}, Max: ${maxY.toFixed(6)}`
  );
  assert(
    nonMonotonicCount === 0,
    "Departure Curve: Strict Monotonicity",
    `Non-monotonic decrements: ${nonMonotonicCount}`
  );
}

// 1.3 Mechanical Curve: cubic-bezier(0.2, 0, 0, 1)
{
  const [p1x, p1y, p2x, p2y] = MOTION_BEZIERS.mechanical;
  let maxY = -Infinity;
  let minY = Infinity;
  const SAMPLES = 10000;

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const { y } = evaluateCubicBezier(p1x, p1y, p2x, p2y, t);
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
  }

  assert(
    maxY <= 1.000001 && minY >= -0.000001,
    "Mechanical Curve: Bounded [0, 1]",
    `Min: ${minY.toFixed(6)}, Max: ${maxY.toFixed(6)}`
  );
}

// 1.4 Drawer Curve: cubic-bezier(0.32, 0.72, 0, 1)
{
  const [p1x, p1y, p2x, p2y] = MOTION_BEZIERS.drawer;
  let maxY = -Infinity;
  let minY = Infinity;
  let nonMonotonicCount = 0;
  let prevY = -1;
  const SAMPLES = 10000;

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const { y } = evaluateCubicBezier(p1x, p1y, p2x, p2y, t);
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (y < prevY - 1e-9) nonMonotonicCount++;
    prevY = y;
  }

  assert(
    maxY <= 1.000001 && minY >= -0.000001,
    "Drawer Curve: Bounded [0, 1]",
    `Min: ${minY.toFixed(6)}, Max: ${maxY.toFixed(6)}`
  );
  assert(
    nonMonotonicCount === 0,
    "Drawer Curve: Strict Monotonicity",
    `Non-monotonic decrements: ${nonMonotonicCount}`
  );
}

// 1.5 Spring Physics & Damping Ratio Analysis
console.log("\n=== 1.5 SPRING PHYSICS & DAMPING RATIO ANALYSIS ===");

function calcZeta(k: number, c: number, m: number): number {
  return c / (2 * Math.sqrt(k * m));
}

// Standard Spring: stiffness 380, damping 30, mass 1, bounce 0
{
  const { stiffness, damping, mass, bounce } = SPRINGS.standard;
  const zeta = calcZeta(stiffness, damping, mass);
  assert(
    bounce === 0,
    "Standard Spring: Zero Bounce Contract",
    `bounce = ${bounce}`
  );
  assert(
    zeta > 0.75 && zeta < 1.0,
    "Standard Spring: Critical Damping Domain",
    `zeta = ${zeta.toFixed(4)} (near-critical damping, settling without ringing)`
  );
}

// Micro Spring: stiffness 500, damping 32, mass 0.8, bounce 0
{
  const { stiffness, damping, mass, bounce } = SPRINGS.micro;
  const zeta = calcZeta(stiffness, damping, mass);
  assert(
    bounce === 0,
    "Micro Spring: Zero Bounce Contract",
    `bounce = ${bounce}`
  );
  assert(
    Math.abs(zeta - 0.8) < 0.001,
    "Micro Spring: Precision Damping Ratio",
    `zeta = ${zeta.toFixed(4)} (exact 0.80 ratio)`
  );
}

// =========================================================================
// 2. SSR SAFETY STRESS TEST FOR `lib/use-reduced-motion.ts`
// =========================================================================
console.log("\n=== 2. SSR SAFETY STRESS TEST ===");

// 2.1 Pure Node environment (window is undefined)
{
  let errorCaught = false;
  let imperativeResult: boolean | null = null;
  try {
    imperativeResult = getPrefersReducedMotion();
  } catch (e) {
    errorCaught = true;
  }
  assert(
    !errorCaught && imperativeResult === false,
    "SSR Safety: getPrefersReducedMotion in Node (window undefined)",
    `Returned ${imperativeResult}, errorCaught=${errorCaught}`
  );
}

// 2.2 React SSR renderToString execution
{
  let errorCaught = false;
  let html = "";

  function TestComponent() {
    const prefersReduced = usePrefersReducedMotion();
    return React.createElement(
      "div",
      { "data-reduced": prefersReduced ? "true" : "false" },
      "SSR Render Target"
    );
  }

  try {
    html = renderToString(React.createElement(TestComponent));
  } catch (e: any) {
    errorCaught = true;
    console.error("renderToString failed:", e);
  }

  assert(
    !errorCaught && html.includes('data-reduced="false"'),
    "SSR Safety: React.renderToString with usePrefersReducedMotion",
    `Rendered HTML: ${html}, errorCaught=${errorCaught}`
  );
}

// 2.3 Simulated degraded client (window defined but matchMedia undefined)
{
  const originalWindow = (globalThis as any).window;
  let imperativeResult: boolean | null = null;
  let ssrHtml = "";
  let errorCaught = false;

  try {
    (globalThis as any).window = {}; // window exists, but no matchMedia
    imperativeResult = getPrefersReducedMotion();

    function TestComponentDegraded() {
      const prefersReduced = useReducedMotion();
      return React.createElement("span", null, prefersReduced ? "reduced" : "standard");
    }

    ssrHtml = renderToString(React.createElement(TestComponentDegraded));
  } catch (e) {
    errorCaught = true;
  } finally {
    if (originalWindow !== undefined) {
      (globalThis as any).window = originalWindow;
    } else {
      delete (globalThis as any).window;
    }
  }

  assert(
    !errorCaught && imperativeResult === false && ssrHtml.includes("standard"),
    "SSR Safety: window defined without matchMedia (degraded environment)",
    `Result=${imperativeResult}, HTML=${ssrHtml}, errorCaught=${errorCaught}`
  );
}

// =========================================================================
// 3. TAILWIND CSS V4 UTILITY RESOLUTION & APP/GLOBALS.CSS VERIFICATION
// =========================================================================
console.log("\n=== 3. TAILWIND CSS V4 & GLOBALS.CSS VERIFICATION ===");

const rootDir = process.cwd();
const globalsCssPath = join(rootDir, "app/globals.css");
assert(existsSync(globalsCssPath), "globals.css exists", globalsCssPath);

const globalsCss = readFileSync(globalsCssPath, "utf8");

// 3.1 Durations in :root and @theme inline
assert(
  globalsCss.includes("--motion-duration-micro: 120ms;"),
  "CSS Token: --motion-duration-micro declared",
  "--motion-duration-micro: 120ms"
);
assert(
  globalsCss.includes("--duration-micro: var(--motion-duration-micro);"),
  "Tailwind v4 Theme: --duration-micro mapped in @theme inline",
  "--duration-micro: var(--motion-duration-micro)"
);
assert(
  globalsCss.includes("--ease-arrival: var(--ease-arrival);"),
  "Tailwind v4 Theme: --ease-arrival mapped in @theme inline",
  "--ease-arrival: var(--ease-arrival)"
);

// 3.2 Tactile utility class .btn-proofline-tactile
assert(
  globalsCss.includes(".btn-proofline-tactile {"),
  "Tactile Utility: .btn-proofline-tactile defined",
  "Found .btn-proofline-tactile definition"
);
assert(
  globalsCss.includes("active:scale-[0.97]") ||
    globalsCss.includes("transform: scale(0.97);"),
  "Tactile Utility: Active scale 0.97 defined",
  "Scale 0.97 active compression present"
);

// 3.3 Universal Reduced-Motion Killswitch
assert(
  globalsCss.includes("@media (prefers-reduced-motion: reduce)"),
  "A11y Killswitch: prefers-reduced-motion media query present",
  "Universal media query present"
);
assert(
  globalsCss.includes("animation-duration: 0.01ms !important;") &&
    globalsCss.includes("transition-duration: 0.01ms !important;"),
  "A11y Killswitch: 0.01ms !important duration clamp",
  "Animations and transitions clamped to 0.01ms !important"
);

// 3.4 Button component integration
const buttonPath = join(rootDir, "components/ui/button.tsx");
const buttonCode = readFileSync(buttonPath, "utf8");
assert(
  buttonCode.includes("duration-micro") &&
    buttonCode.includes("ease-arrival") &&
    buttonCode.includes("active:scale-[0.97]"),
  "Component Integration: buttonVariants incorporates tactile tokens",
  "button.tsx applies duration-micro, ease-arrival, and active:scale-[0.97]"
);

// =========================================================================
// SUMMARY
// =========================================================================
console.log("\n=== EMPIRICAL STRESS TEST SUMMARY ===");
const total = reports.length;
const passed = reports.filter((r) => r.passed).length;
const failed = reports.filter((r) => !r.passed).length;
console.log(`Total tests: ${total} | Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.error("FAILURES DETECTED!");
  process.exit(1);
} else {
  console.log("ALL EMPIRICAL CHECKS PASSED!");
  process.exit(0);
}
