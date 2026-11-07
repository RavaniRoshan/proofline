import { readFileSync } from "fs";
import { resolve } from "path";

let passed = 0;
let failed = 0;

function assert(condition: boolean, desc: string) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${desc}`);
  } else {
    failed++;
    console.error(`  FAIL: ${desc}`);
  }
}

console.log("===============================================================================");
console.log("Forensic Auditor M3: Adversarial Integrity & Stress Suite");
console.log("===============================================================================\n");

const root = process.cwd();

// Load target files
const faqAccordion = readFileSync(resolve(root, "components/landing/FaqAccordion.tsx"), "utf-8");
const dualPane = readFileSync(resolve(root, "components/landing/UseCasesDualPane.tsx"), "utf-8");
const cmdPalette = readFileSync(resolve(root, "components/CommandPalette.tsx"), "utf-8");
const findingCard = readFileSync(resolve(root, "components/FindingCard.tsx"), "utf-8");
const checker = readFileSync(resolve(root, "components/Checker.tsx"), "utf-8");
const globalsCss = readFileSync(resolve(root, "app/globals.css"), "utf-8");

// Section 1: FaqAccordion Forensic Checks
console.log("1. FaqAccordion Forensic Checks:");
assert(!faqAccordion.includes("{isOpen && ("), "FaqAccordion must NOT use conditional rendering unmounting");
assert(faqAccordion.includes("grid-rows-[0fr]") && faqAccordion.includes("grid-rows-[1fr]"), "FaqAccordion implements CSS Grid 0fr -> 1fr height expansion");
assert(faqAccordion.includes("min-h-0") && faqAccordion.includes("overflow-hidden"), "FaqAccordion includes zero-CLS overflow-hidden min-h-0 wrappers");
assert(faqAccordion.includes("rotate-45") && faqAccordion.includes("rotate-0"), "FaqAccordion implements 45-degree rotation indicator");
assert(faqAccordion.includes("--motion-duration-fast") || faqAccordion.includes("180ms"), "FaqAccordion indicator uses fast motion duration token");
assert(faqAccordion.includes("sr-only") && faqAccordion.includes('{isOpen ? "−" : "+"}'), "FaqAccordion maintains screen reader accessible contract");
assert(faqAccordion.includes("aria-expanded={isOpen}"), "FaqAccordion preserves aria-expanded attribute");
assert(faqAccordion.includes("aria-controls={panelId}") && faqAccordion.includes("aria-labelledby={triggerId}"), "FaqAccordion preserves ARIA relationship attributes");

// Section 2: UseCasesDualPane Forensic Checks
console.log("\n2. UseCasesDualPane Forensic Checks:");
assert(dualPane.includes("dualpane-signal-packet"), "UseCasesDualPane attaches kinetic data packet pulse class");
assert(dualPane.includes("dualpane-pulse-gradient"), "UseCasesDualPane defines SVG linearGradient pulse conduit");
assert(dualPane.includes("scenario-pane-crossfade"), "UseCasesDualPane applies scenario-pane-crossfade animation");
assert(dualPane.includes("scenario-step-enter"), "UseCasesDualPane applies scenario-step-enter to tool steps");
assert(dualPane.includes("active:scale-[0.97]") || dualPane.includes("active:scale-95"), "UseCasesDualPane buttons have tactile press response");
assert(dualPane.includes("setDecisionMap"), "UseCasesDualPane maintains interactive reviewer decision map");
assert(dualPane.includes("activeIdx") && dualPane.includes("setActiveIdx"), "UseCasesDualPane maintains interactive scenario switching");
assert(dualPane.includes("paused") && dualPane.includes("setPaused"), "UseCasesDualPane maintains interactive pause/play control");

// Section 3: CommandPalette Forensic Checks
console.log("\n3. CommandPalette Modal Scale & Decoupled Exit Physics:");
assert(cmdPalette.includes("cmd-modal-enter") && cmdPalette.includes("cmd-modal-exit"), "CommandPalette binds modal scale enter and exit animations");
assert(cmdPalette.includes("cmd-backdrop-enter") && cmdPalette.includes("cmd-backdrop-exit"), "CommandPalette binds backdrop fade enter and exit animations");
assert(cmdPalette.includes("closing") && cmdPalette.includes("setClosing"), "CommandPalette decouples closing lifecycle state");
assert(cmdPalette.includes("usePrefersReducedMotion"), "CommandPalette consumes usePrefersReducedMotion hook");
assert(cmdPalette.includes("triggerRef.current?.focus()"), "CommandPalette restores focus on close");
assert(cmdPalette.includes('role="dialog"') && cmdPalette.includes('aria-modal="true"'), "CommandPalette preserves dialog role and aria-modal");
assert(cmdPalette.includes("items.filter"), "CommandPalette performs authentic dynamic query filtering");

// Section 4: FindingCard & Checker Materialize & Tactile Physics
console.log("\n4. FindingCard & Checker Materialize & Tactile Physics:");
assert(findingCard.includes("finding-card-enter"), "FindingCard has finding-card-enter class");
assert(findingCard.includes("btn-proofline-tactile"), "FindingCard decision buttons use tactile utility");
assert(findingCard.includes("active:scale-[0.97]"), "FindingCard buttons implement 3% mechanical compression");
assert(!/setTimeout\s*\([^)]*setPending/.test(findingCard), "Keyboard shortcuts (a, r, e) dispatch with 0ms delay (no setTimeout on setPending)");
assert(checker.includes("btn-proofline-tactile"), "Checker uses tactile utility on interactive buttons");
assert(checker.includes("active:scale-[0.97]"), "Checker check button implements active:scale-[0.97]");

// Section 5: CSS Motion Architecture & Keyframes in globals.css
console.log("\n5. CSS Keyframes and Utility Contract Invariants:");
assert(globalsCss.includes("@keyframes proofline-materialize-in"), "globals.css defines proofline-materialize-in keyframe");
assert(globalsCss.includes("@keyframes scenario-crossfade"), "globals.css defines scenario-crossfade keyframe");
assert(globalsCss.includes("@keyframes dualpane-pulse-travel"), "globals.css defines dualpane-pulse-travel keyframe");
assert(globalsCss.includes("@keyframes cmd-modal-scale-in"), "globals.css defines cmd-modal-scale-in keyframe");
assert(globalsCss.includes("@keyframes cmd-modal-scale-out"), "globals.css defines cmd-modal-scale-out keyframe");
assert(globalsCss.includes("@keyframes drawer-rail-enter") && globalsCss.includes("@keyframes drawer-rail-exit"), "globals.css defines drawer deceleration keyframes");
assert(globalsCss.includes(".accordion-content-grid"), "globals.css defines .accordion-content-grid utility");
assert(globalsCss.includes("scale(0.96)"), "CommandPalette enter scale is calibrated at 0.96");
assert(globalsCss.includes("scale(0.98)"), "CommandPalette exit scale is calibrated at 0.98");
assert(globalsCss.includes("blur(2px)"), "Materialize entrance uses subtle blur(2px)");

// Section 6: Reduced-Motion Killswitch Completeness
console.log("\n6. Reduced-Motion Killswitch Completeness:");
assert(globalsCss.includes("@media (prefers-reduced-motion: reduce)"), "globals.css contains prefers-reduced-motion killswitch");
assert(globalsCss.includes("animation-duration: 0.01ms !important") || globalsCss.includes("animation-duration:0.01ms !important"), "Universal animation duration clamp is 0.01ms !important");
assert(globalsCss.includes("transition-duration: 0.01ms !important") || globalsCss.includes("transition-duration:0.01ms !important"), "Universal transition duration clamp is 0.01ms !important");

// Section 7: Anti-Facade & Anti-Cheat Inspection
console.log("\n7. Anti-Facade & Anti-Cheat Inspection:");
const checkForbidden = (fileContent: string, fileName: string) => {
  const forbiddenPatterns = [
    "/* mock */",
    "// pass test",
    "// bypass",
    "return true; // test",
    "vi.mock",
    "describe.skip",
    "test.skip",
    "it.skip"
  ];
  for (const pat of forbiddenPatterns) {
    assert(!fileContent.includes(pat), `${fileName} does not contain shortcut pattern '${pat}'`);
  }
};

checkForbidden(faqAccordion, "FaqAccordion.tsx");
checkForbidden(dualPane, "UseCasesDualPane.tsx");
checkForbidden(cmdPalette, "CommandPalette.tsx");
checkForbidden(findingCard, "FindingCard.tsx");
checkForbidden(checker, "Checker.tsx");

console.log("\n===============================================================================");
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("===============================================================================");

if (failed > 0) {
  process.exit(1);
}
