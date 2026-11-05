import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("docs", { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 800, height: 500 },
  recordVideo: { dir: "docs", size: { width: 800, height: 500 } },
});

await context.addInitScript(() => {
  const cursor = document.createElement("div");
  cursor.id = "pw-cursor";
  cursor.style.cssText =
    "position:fixed;width:18px;height:18px;border-radius:50%;background:rgba(30,30,30,0.85);border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.4);pointer-events:none;z-index:2147483647;transform:translate(-50%,-50%);transition:left 120ms ease,top 120ms ease;";
  const mount = () => document.body && document.body.appendChild(cursor);
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
});

const page = await context.newPage();
await page.goto("http://localhost:3000/check", { waitUntil: "networkidle" });

// 0-2 cold open
await page.waitForTimeout(2000);

// 2-4 load sample draft
await page.getByTestId("load-sample").click();
await page.waitForTimeout(2000);

// 4-10 press Check; findings arrive
await page.getByTestId("check-button").click();
await page.waitForTimeout(6000);

// 10-15 open evidence drawer on first finding
const inspect = page.getByText("Inspect evidence").first();
if (await inspect.isVisible().catch(() => false)) {
  await inspect.click();
  await page.waitForTimeout(5000);
} else {
  await page.waitForTimeout(5000);
}

// close drawer
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

// 15-20 record a decision
const approve = page.getByTestId("decision-approve").first();
if (await approve.isVisible().catch(() => false)) {
  await approve.click();
  await page.waitForTimeout(300);
  const input = page.locator('input[placeholder^="Why this decision"]').first();
  await input.fill("Verified against register.");
  await page.waitForTimeout(300);
  await page.getByTestId("record-decision").first().click();
  await page.waitForTimeout(4000);
} else {
  await page.waitForTimeout(4000);
}

// 20-24 hold on clean end state
await page.waitForTimeout(4000);

const videoPath = await page.video().path();
await context.close();
await browser.close();
console.log("VIDEO_PATH=" + videoPath);
