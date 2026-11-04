import { describe, expect, it } from "vitest";
import { resolveAttributes } from "@/lib/resolve";

describe("resolveAttributes", () => {
  it("resolves a plain price claim with Indian formatting", () => {
    const r = resolveAttributes("Flowdesk starts at ₹4,999 per month.");
    expect(r).toEqual([
      { attribute: "price_monthly", productId: null, claimValue: "4,999", unit: "INR" },
    ]);
  });

  it("resolves product-scoped seat limits", () => {
    const r = resolveAttributes("The Starter plan includes 5 seats.");
    expect(r).toEqual([
      { attribute: "seat_limit", productId: "P-starter", claimValue: "5", unit: "seats" },
    ]);
  });

  it("scopes legacy claims to legacy attributes", () => {
    const r = resolveAttributes(
      "The Legacy plan starts at ₹2,999 per month for teams that need 3 seats.",
    );
    const attrs = r.map((x) => x.attribute).sort();
    expect(attrs).toEqual(["legacy_plan_price", "legacy_seat_limit"]);
    expect(r.every((x) => x.productId === "P-starter")).toBe(true);
  });

  it("resolves storage claims", () => {
    const r = resolveAttributes("Every account includes 500 GB of storage.");
    expect(r).toEqual([
      { attribute: "storage_gb", productId: null, claimValue: "500", unit: "GB" },
    ]);
  });

  it("resolves support channel enums", () => {
    const r = resolveAttributes("Support is available by email and chat.");
    expect(r).toEqual([
      { attribute: "support_channel", productId: null, claimValue: "email,chat", unit: "enum" },
    ]);
  });

  it("resolves India data residency to IN", () => {
    const r = resolveAttributes("Data is stored in India.");
    expect(r).toEqual([
      { attribute: "data_residency", productId: null, claimValue: "IN", unit: "region" },
    ]);
  });

  it("resolves onboarding with business days", () => {
    const r = resolveAttributes("Onboarding takes 3 business days for mid-market accounts.");
    expect(r).toEqual([
      { attribute: "onboarding_days", productId: null, claimValue: "3", unit: "business days" },
    ]);
  });

  it("resolves Growth seats + SSO from one clause", () => {
    const r = resolveAttributes("The Growth plan includes 25 seats and SSO.");
    const byAttr = Object.fromEntries(r.map((x) => [x.attribute, x]));
    expect(byAttr["seat_limit"]?.claimValue).toBe("25");
    expect(byAttr["sso_included"]?.claimValue).toBe("true");
    expect(byAttr["sso_included"]?.productId).toBe("P-growth");
  });

  it("resolves cancel-anytime", () => {
    const r = resolveAttributes("You can cancel anytime.");
    expect(r).toEqual([
      { attribute: "cancellation", productId: null, claimValue: "anytime", unit: "enum" },
    ]);
  });

  it("does not resolve attributes for vague superlatives", () => {
    expect(resolveAttributes("Flowdesk is the most trusted platform.")).toEqual([]);
  });

  it("does not treat a dedicated success manager as an onboarding fact", () => {
    expect(
      resolveAttributes("The Growth plan includes a dedicated success manager in Pune."),
    ).toEqual([]);
  });
});
