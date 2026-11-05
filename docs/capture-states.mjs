import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("docs/states", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function shot(name) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: `docs/states/${name}.png` });
  console.log("captured", name);
}

// Start on checker
await page.goto("http://localhost:3000/check", { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="load-sample"]', { timeout: 30000 });
await page.waitForTimeout(1000);

// Phase 2/submit prep: load sample draft
await page.getByTestId("load-sample").click();
await page.waitForTimeout(500);
await shot("02_submit");

// Phase 3: press Check, capture thinking
await page.getByTestId("check-button").click();
await page.waitForTimeout(800);
await shot("03_thinking");

// Phase 4: findings (wait)
await page.waitForSelector('[data-testid="findings-list"]', { timeout: 30000 });
await page.waitForTimeout(1000);
await shot("04_findings");

// Phase 1 cold open: use findings as cold open too (same state) but capture after settle
await page.waitForTimeout(500);
await shot("01_cold");

// Phase 5: marked draft view (mobile tab) - on desktop marked draft already visible; scroll a bit
await page.evaluate(() => window.scrollTo(0, 0));
await shot("05_marked");

// Phase 6: open evidence drawer
const inspect = page.getByText("Inspect evidence").first();
if (await inspect.isVisible().catch(() => false)) {
  await inspect.click();
  await page.waitForTimeout(500);
}
await shot("06_evidence");

// close drawer
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// Phase 7: audit page
await page.goto("http://localhost:3000/audit", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await shot("07_audit");

// Phase 8: dashboard end card
await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await shot("08_end");

await browser.close();
console.log("done");
