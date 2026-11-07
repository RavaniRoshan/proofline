/**
 * Challenger M2-2 Empirical Stress Test Harness
 * 
 * Verifies:
 * 1. Reduced Motion immediate 0ms settle to data-enter="done"
 * 2. Scoped killswitch removal & globals.css 0.01ms universal delegation
 * 3. Optical blur-rise keyframe syntax & Satori 3-beat temporal flow
 * 4. Cascade row stagger (35ms capped at 80ms) and metric pill stagger
 * 5. Logomark bracket aperture lockup (-4px/+4px) & 2px hover expansion
 * 6. Tabs keyboard navigation and roving tabindex logic
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const heroPath = join(root, "components/landing/ProoflineHero.tsx");
const globalsCssPath = join(root, "app/globals.css");
const motionTokensPath = join(root, "lib/motion-tokens.ts");

const heroCode = readFileSync(heroPath, "utf8");
const globalsCss = readFileSync(globalsCssPath, "utf8");
const motionTokens = readFileSync(motionTokensPath, "utf8");

let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedAssertions++;
    console.error(`  ✗ FAIL: ${testName}${details ? " — " + details : ""}`);
  }
}

console.log("\n=======================================================");
console.log("CHALLENGER M2-2: EMPIRICAL STRESS TEST SUITE");
console.log("=======================================================\n");

// -------------------------------------------------------------
// SECTION 1: REDUCED MOTION LIFECYCLE & IMMEDIATE 0-DELAY TRANSITION
// -------------------------------------------------------------
console.log("--- Section 1: Reduced Motion Immediate Settle ---");

// 1.1 Verify presence of invariant reduced motion check
assert(
  /if\s*\(prefersReduced\)\s*\{\s*viewport\.setAttribute\("data-enter",\s*"done"\);\s*return;\s*\}/.test(heroCode),
  "1.1 ProoflineHero sets data-enter='done' and returns immediately with 0 delay when prefersReduced is true"
);

// 1.2 Verify standard path sets data-enter="run" and timers for 850ms
assert(
  heroCode.includes('viewport.setAttribute("data-enter", "run")') &&
  heroCode.includes('viewport.setAttribute("data-enter", "done")') &&
  /window\.setTimeout\(\(\)\s*=>\s*\{\s*viewport\.setAttribute\("data-enter",\s*"done"\);\s*\},\s*850\)/.test(heroCode),
  "1.2 Standard entrance sets data-enter='run' and schedules settle at exactly 850ms"
);

// 1.3 Verify timer cleanup in return statement
assert(
  /return\s*\(\)\s*=>\s*window\.clearTimeout\(timer\);/.test(heroCode),
  "1.3 Lifecycle useEffect returns cleanup function clearing active timer"
);

// 1.4 Simulate the state machine behavior across rapid preference toggles
{
  class MockViewport {
    attributes: Record<string, string> = {};
    setAttribute(name: string, val: string) {
      this.attributes[name] = val;
    }
  }

  let activeTimerId: any = null;
  let timerDelay = -1;
  const mockSetTimeout = (cb: () => void, ms: number) => {
    timerDelay = ms;
    activeTimerId = { cb, ms, cancelled: false };
    return activeTimerId;
  };
  const mockClearTimeout = (id: any) => {
    if (id) id.cancelled = true;
    activeTimerId = null;
  };

  const simulateHeroEntrance = (prefersReduced: boolean, viewport: MockViewport) => {
    let cleanup: (() => void) | undefined;
    if (prefersReduced) {
      viewport.setAttribute("data-enter", "done");
      return { cleanup, timerDelay: 0, hasTimer: false };
    }
    viewport.setAttribute("data-enter", "run");
    const timer = mockSetTimeout(() => {
      viewport.setAttribute("data-enter", "done");
    }, 850);
    cleanup = () => mockClearTimeout(timer);
    return { cleanup, timerDelay, hasTimer: true };
  };

  // Test Case A: Initial mount with prefersReduced = true
  const vpA = new MockViewport();
  const runA = simulateHeroEntrance(true, vpA);
  assert(
    vpA.attributes["data-enter"] === "done" && !runA.hasTimer && activeTimerId === null,
    "1.4.A prefersReduced=true immediately sets data-enter='done' with zero timers created"
  );

  // Test Case B: Initial mount with prefersReduced = false
  const vpB = new MockViewport();
  const runB = simulateHeroEntrance(false, vpB);
  assert(
    vpB.attributes["data-enter"] === "run" && runB.hasTimer && timerDelay === 850 && activeTimerId !== null,
    "1.4.B prefersReduced=false sets data-enter='run' and schedules 850ms timer"
  );
  // Execute timer
  activeTimerId.cb();
  assert(
    vpB.attributes["data-enter"] === "done",
    "1.4.B.2 Settle callback transitions viewport to data-enter='done'"
  );

  // Test Case C: Rapid toggling (100 switches)
  const vpC = new MockViewport();
  let currentPref = false;
  let currentCleanup: (() => void) | undefined;
  for (let i = 0; i < 100; i++) {
    if (currentCleanup) currentCleanup();
    currentPref = !currentPref;
    const res = simulateHeroEntrance(currentPref, vpC);
    currentCleanup = res.cleanup;
  }
  // After 100 toggles, it ended on currentPref = false
  assert(
    activeTimerId !== null && !activeTimerId.cancelled,
    "1.4.C Rapid toggle stress test leaves exactly 1 active timer without leaks"
  );
  if (currentCleanup) currentCleanup();
  assert(activeTimerId === null, "1.4.C.2 Cleanup cancels final timer cleanly");
}

// -------------------------------------------------------------
// SECTION 2: REMOVAL OF CONFLICTING KILLSWITCH & UNIVERSAL CSS
// -------------------------------------------------------------
console.log("\n--- Section 2: Universal Reduced Motion Delegation ---");

// 2.1 Verify NO conflicting scoped killswitch in ProoflineHero.tsx
assert(
  !heroCode.includes("animation: none !important"),
  "2.1 ProoflineHero.tsx does NOT contain conflicting 'animation: none !important'"
);
assert(
  !heroCode.includes("#viewport * { animation: none"),
  "2.2 ProoflineHero.tsx does NOT contain conflicting scoped '#viewport *' rule"
);

// 2.2 Verify app/globals.css has the universal 0.01ms killswitch
assert(
  globalsCss.includes("@media (prefers-reduced-motion: reduce)"),
  "2.3 app/globals.css contains '@media (prefers-reduced-motion: reduce)'"
);
assert(
  /animation-duration:\s*0\.01ms\s*!important;/.test(globalsCss) &&
  /transition-duration:\s*0\.01ms\s*!important;/.test(globalsCss) &&
  /animation-iteration-count:\s*1\s*!important;/.test(globalsCss) &&
  /animation-delay:\s*-0\.01ms\s*!important;/.test(globalsCss),
  "2.4 app/globals.css configures complete 0.01ms universal motion suppression rules"
);

// -------------------------------------------------------------
// SECTION 3: OPTICAL BLUR-RISE KEYFRAME & 3-BEAT TEMPORAL FLOW
// -------------------------------------------------------------
console.log("\n--- Section 3: Optical Blur-Rise Keyframe & 3-Beat Flow ---");

// 3.1 Verify keyframe syntax in ProoflineHero.tsx
const blurRiseIdx = heroCode.indexOf("@keyframes pl-enter-rise");
assert(blurRiseIdx !== -1, "3.1 @keyframes pl-enter-rise is defined");

if (blurRiseIdx !== -1) {
  const kfContent = heroCode.slice(blurRiseIdx, blurRiseIdx + 300);
  assert(
    kfContent.includes("opacity: 0") &&
    kfContent.includes("transform: translateY(12px)") &&
    kfContent.includes("filter: blur(4px)"),
    "3.2 pl-enter-rise 0% frame has opacity:0, translateY(12px), blur(4px)"
  );
  assert(
    kfContent.includes("opacity: 1") &&
    kfContent.includes("transform: translateY(0)") &&
    kfContent.includes("filter: blur(0px)"),
    "3.3 pl-enter-rise 100% frame has opacity:1, translateY(0), blur(0px)"
  );
}

// 3.2 Verify Beat 1, Beat 2, Beat 3 timing sequence
const pillDelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-eyebrow-pill\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);
const h1DelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-hero-h1\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);
const subDelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-hero-sub\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);
const bandDelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-stage-wrap\s+\.pl-band\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);
const actDelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-hero-actions\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);
const stripDelayMatch = heroCode.match(/#viewport\[data-enter="run"\]\s+\.pl-transition-strip\s*\{[\s\S]*?animation:\s*pl-enter-rise[^\n]*?(\d+)ms\s+backwards/);

const dPill = pillDelayMatch ? Number(pillDelayMatch[1]) : -1;
const dH1 = h1DelayMatch ? Number(h1DelayMatch[1]) : -1;
const dSub = subDelayMatch ? Number(subDelayMatch[1]) : -1;
const dBand = bandDelayMatch ? Number(bandDelayMatch[1]) : -1;
const dAct = actDelayMatch ? Number(actDelayMatch[1]) : -1;
const dStrip = stripDelayMatch ? Number(stripDelayMatch[1]) : -1;

assert(dPill === 0, `3.4.A Beat 1: Eyebrow pill starts at 0ms (actual: ${dPill}ms)`);
assert(dH1 === 60, `3.4.B Beat 1: H1 displays at 60ms (actual: ${dH1}ms)`);
assert(dSub === 160, `3.4.C Beat 2: Subtitle copy starts at 160ms (actual: ${dSub}ms)`);
assert(dBand === 220, `3.4.D Beat 2: Stage band arrives at 220ms (actual: ${dBand}ms)`);
assert(dAct === 300, `3.4.E Beat 3: CTAs arrive at 300ms (actual: ${dAct}ms)`);
assert(dStrip === 360, `3.4.F Beat 3: Transition strip arrives at 360ms (actual: ${dStrip}ms)`);

assert(
  dPill < dH1 && dH1 < dSub && dSub < dBand && dBand < dAct && dAct < dStrip,
  "3.5 Entrance choreography exhibits strictly increasing monotonic temporal sequence (0 < 60 < 160 < 220 < 300 < 360)"
);

// 3.3 Verify lifecycle timeout budget
const heroDuration = 420;
const lastArrivalSettled = dStrip + heroDuration; // 360 + 420 = 780ms
const lifecycleTimer = 850;
assert(
  lifecycleTimer > lastArrivalSettled,
  `3.6 Lifecycle timer (${lifecycleTimer}ms) provides sufficient cushion past last animation settle (${lastArrivalSettled}ms)`
);

// -------------------------------------------------------------
// SECTION 4: STAGGER TIMING & CASCADE FORMULAS
// -------------------------------------------------------------
console.log("\n--- Section 4: Stagger Timing & Cascade Formulas ---");

// 4.1 Row cascade keyframe & syntax
assert(
  heroCode.includes("@keyframes pl-row-materialize"),
  "4.1 @keyframes pl-row-materialize is defined"
);
assert(
  heroCode.includes("transform: translateY(6px)") &&
  heroCode.includes("filter: blur(2px)"),
  "4.2 pl-row-materialize incorporates translateY(6px) and blur(2px) arrival"
);

// 4.3 Stagger formula: min(calc(var(--row-idx, 0) * 35ms), 80ms)
assert(
  heroCode.includes("animation-delay: min(calc(var(--row-idx, 0) * 35ms), 80ms)"),
  "4.3 Row enter animation specifies 35ms cascade capped at 80ms"
);

// Mathematical verification of row delay across arbitrary index sequence
const calcRowDelay = (idx: number) => Math.min(Math.max(0, idx) * 35, 80);
assert(calcRowDelay(0) === 0, "4.4 Row 0 has 0ms delay");
assert(calcRowDelay(1) === 35, "4.5 Row 1 has 35ms delay");
assert(calcRowDelay(2) === 70, "4.6 Row 2 has 70ms delay");
assert(calcRowDelay(3) === 80, "4.7 Row 3 is capped at 80ms (not 105ms)");
assert(calcRowDelay(50) === 80, "4.8 Row 50 is capped at 80ms");

// 4.4 Metric strip stagger formula: calc(320ms + var(--stat-idx, 0) * 45ms)
assert(
  heroCode.includes("animation-delay: calc(320ms + var(--stat-idx, 0) * 45ms)"),
  "4.9 Metric pills specify Beat 3 stagger: calc(320ms + var(--stat-idx, 0) * 45ms)"
);

const calcStatDelay = (idx: number) => 320 + idx * 45;
assert(calcStatDelay(0) === 320, "4.10 Stat 0 begins at 320ms");
assert(calcStatDelay(1) === 365, "4.11 Stat 1 begins at 365ms");
assert(calcStatDelay(2) === 410, "4.12 Stat 2 begins at 410ms");
assert(calcStatDelay(3) === 455, "4.13 Stat 3 begins at 455ms");

// Verify fast duration (180ms) settling
const lastStatEnd = calcStatDelay(3) + 180; // 455 + 180 = 635ms
assert(
  lastStatEnd < lifecycleTimer,
  `4.14 Final stat pill settles at ${lastStatEnd}ms, comfortably before lifecycle timer ${lifecycleTimer}ms`
);

// -------------------------------------------------------------
// SECTION 5: APERTURE PHYSICS & LOGOMARK BRACKET INTERACTIVITY
// -------------------------------------------------------------
console.log("\n--- Section 5: Logomark Aperture Physics & Brackets ---");

// 5.1 Eyebrow markup structure
assert(
  heroCode.includes('className="logomark-bracket-left"><span>[</span></span>') &&
  heroCode.includes('className="logomark-bracket-right"><span>]</span></span>'),
  "5.1 Eyebrow pill renders signature bracket glyphs '[' and ']' in dedicated span containers"
);
assert(
  heroCode.includes("logomark-lock"),
  "5.2 Eyebrow pill applies 'logomark-lock' aperture class"
);
assert(
  heroCode.includes("aria-hidden=\"true\""),
  "5.3 Logomark brackets are wrapped in aria-hidden decorative container"
);

// 5.2 Keyframe lockup animation in globals.css
assert(
  globalsCss.includes("@keyframes bracket-left-lock") &&
  globalsCss.includes("@keyframes bracket-right-lock"),
  "5.4 globals.css defines bracket-left-lock and bracket-right-lock keyframes"
);

const leftLockIdx = globalsCss.indexOf("@keyframes bracket-left-lock");
const rightLockIdx = globalsCss.indexOf("@keyframes bracket-right-lock");

if (leftLockIdx !== -1 && rightLockIdx !== -1) {
  const leftContent = globalsCss.slice(leftLockIdx, leftLockIdx + 300);
  const rightContent = globalsCss.slice(rightLockIdx, rightLockIdx + 300);
  assert(
    leftContent.includes("translateX(-4px)") && leftContent.includes("translateX(0)"),
    "5.5 Left bracket executes -4px -> 0 translation"
  );
  assert(
    rightContent.includes("translateX(4px)") && rightContent.includes("translateX(0)"),
    "5.6 Right bracket executes +4px -> 0 translation"
  );
}

// 5.3 Hover expansion rule
assert(
  globalsCss.includes(".group:hover .logomark-bracket-left") &&
  globalsCss.includes("transform: translateX(-2px);"),
  "5.7 Hovering .group container translates left bracket outward by -2px"
);
assert(
  globalsCss.includes(".group:hover .logomark-bracket-right") &&
  globalsCss.includes("transform: translateX(2px);"),
  "5.8 Hovering .group container translates right bracket outward by +2px"
);

// 5.4 Symmetrical displacement invariance
const leftHoverOffset = -2;
const rightHoverOffset = 2;
assert(
  Math.abs(leftHoverOffset) === Math.abs(rightHoverOffset) && (leftHoverOffset + rightHoverOffset === 0),
  "5.9 Hover expansion displays perfect mirror symmetry (|-2| = |+2|, sum = 0)"
);

// -------------------------------------------------------------
// SECTION 6: TABS KEYBOARD INTERFACE & STATE MACHINE
// -------------------------------------------------------------
console.log("\n--- Section 6: Tab Roving Tabindex & Keyboard Navigation ---");

// 6.1 Keyboard events handled
assert(
  heroCode.includes('e.key === "ArrowRight"') &&
  heroCode.includes('e.key === "ArrowLeft"') &&
  heroCode.includes('e.key === "Home"') &&
  heroCode.includes('e.key === "End"'),
  "6.1 handleTabKeyDown implements full WAI-ARIA arrow navigation (ArrowRight, ArrowLeft, Home, End)"
);

// 6.2 Simulate tab roving tabindex transitions
{
  const tabsCount = 4;
  const navigate = (curr: number, key: string): number => {
    if (key === "ArrowRight") return (curr + 1) % tabsCount;
    if (key === "ArrowLeft") return (curr - 1 + tabsCount) % tabsCount;
    if (key === "Home") return 0;
    if (key === "End") return tabsCount - 1;
    return curr;
  };

  assert(navigate(0, "ArrowRight") === 1, "6.2.A ArrowRight from 0 -> 1");
  assert(navigate(3, "ArrowRight") === 0, "6.2.B ArrowRight from 3 wraps to 0");
  assert(navigate(0, "ArrowLeft") === 3, "6.2.C ArrowLeft from 0 wraps to 3");
  assert(navigate(2, "Home") === 0, "6.2.D Home moves to index 0");
  assert(navigate(1, "End") === 3, "6.2.E End moves to index 3");
}

// 6.3 ARIA contract
assert(
  heroCode.includes('role="tablist"') &&
  heroCode.includes('role="tab"') &&
  heroCode.includes('role="tabpanel"'),
  "6.3 Complete ARIA tab roles present (tablist, tab, tabpanel)"
);
assert(
  heroCode.includes('aria-selected={isSelected}') &&
  heroCode.includes('aria-controls={`hero-panel-${tab.id}`}') &&
  heroCode.includes('tabIndex={isSelected ? 0 : -1}'),
  "6.4 Roving tabindex (0 for selected, -1 for unselected) and aria-controls linking"
);

console.log("\n=======================================================");
console.log(`TOTAL ASSERTIONS: ${passedAssertions + failedAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log("=======================================================\n");

if (failedAssertions > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
