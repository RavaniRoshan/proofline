import { expect, test } from "@playwright/test";

test.describe("Proofline core flow", () => {
  test("draft in → findings with evidence out → decision recorded → audit entry written", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("check-button")).toBeVisible();

    // The checker is the landing page, empty until told otherwise.
    await expect(page.getByTestId("draft-input")).toHaveValue("");

    await page.getByTestId("load-sample").click();
    await expect(page.getByTestId("draft-input")).toHaveValue(/₹4,999/);

    await page.getByTestId("check-button").click();

    // Findings render — the seeded contradiction cites F-021.
    const summary = page.getByTestId("summary");
    await expect(summary).toBeVisible({ timeout: 180_000 });
    const contradicted = page.locator('[data-testid="finding"][data-verdict="CONTRADICTED"]').first();
    await expect(contradicted).toBeVisible();
    await expect(contradicted).toContainText("F-021");
    await expect(contradicted).toContainText(/valid \d{4}-\d{2}-\d{2}/);

    // Record a decision with a reason on the first finding.
    const first = page.locator('[data-testid="finding"]').first();
    await first.getByTestId("decision-reject").click();
    await first.getByPlaceholder(/Why this decision/).fill("Price is stale against the v4 pricing sheet");
    await first.getByTestId("record-decision").click();
    await expect(first).toContainText("Decision: Reject");

    // The audit log carries the decision.
    await page.goto("/audit");
    await expect(page.getByTestId("audit-entries")).toContainText(
      "Price is stale against the v4 pricing sheet",
    );
    await expect(page.getByTestId("audit-entries")).toContainText("Reject");
  });

  test("Reset demo clears decisions previously recorded in this browser", async ({ page }) => {
    // Seed one decision through the UI.
    await page.goto("/");
    await page.getByTestId("load-sample").click();
    await page.getByTestId("check-button").click();
    await expect(page.getByTestId("summary")).toBeVisible({ timeout: 180_000 });
    const first = page.locator('[data-testid="finding"]').first();
    await first.getByTestId("decision-approve").click();
    await first.getByPlaceholder(/Why this decision/).fill("Verified against the v4 register");
    await first.getByTestId("record-decision").click();
    await expect(first).toContainText("Decision: Approve");

    await page.getByTestId("reset-demo").click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/audit");
    await expect(page.getByTestId("audit-entries")).toHaveCount(0);
    await expect(page.getByText("Nothing logged yet.")).toBeVisible();
  });

  test("every nav route answers 200 without sign-in", async ({ page }) => {
    for (const path of ["/", "/facts", "/audit", "/dashboard", "/about"]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(200);
    }
    // The register shows the seeded contradiction pair.
    await page.goto("/facts");
    await page.getByTestId("filter-conflicting").click();
    await expect(page.getByText("F-024").first()).toBeVisible();
  });
});
