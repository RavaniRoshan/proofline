import { describe, expect, it } from "vitest";
import {
  compareScalar,
  parseNumber,
  scalarOf,
  unitDimension,
  unitsComparable,
} from "@/lib/normalize";

describe("parseNumber", () => {
  it("parses Indian-format thousands separators", () => {
    expect(parseNumber("₹4,999")).toBe(4999);
    expect(parseNumber("6,499")).toBe(6499);
    expect(parseNumber("14,999")).toBe(14999);
    expect(parseNumber("₹2,999 per month")).toBeNull(); // not a bare number
  });
  it("parses decimals and percentages", () => {
    expect(parseNumber("99.9%")).toBe(99.9);
    expect(parseNumber("99.9 percent")).toBe(99.9);
    expect(parseNumber("30")).toBe(30);
  });
  it("rejects non-numbers", () => {
    expect(parseNumber("days")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });
});

describe("unitDimension / unitsComparable", () => {
  it("treats business days as days", () => {
    expect(unitDimension("business days")).toBe(unitDimension("days"));
  });
  it("treats minutes and days as different dimensions", () => {
    expect(unitsComparable("minutes", "business days")).toBe(false);
    expect(unitsComparable("GB", "GB")).toBe(true);
    expect(unitsComparable("INR", "INR")).toBe(true);
  });
  it("treats unitless values as comparable", () => {
    expect(unitsComparable("", "seats")).toBe(true);
  });
});

describe("scalarOf / compareScalar", () => {
  it("compares enums by token-set entailment", () => {
    const claim = scalarOf("email,chat", "enum");
    const fact = scalarOf("email,chat", "enum");
    expect(compareScalar(claim, fact)).toBe("equal");
    const partial = scalarOf("email", "enum");
    expect(compareScalar(partial, fact)).toBe("equal"); // claim ⊆ fact → entailed
    const extra = scalarOf("email,sms", "enum");
    expect(compareScalar(extra, fact)).toBe("different");
  });
  it("normalises boolean strings", () => {
    expect(scalarOf("true", "boolean")).toEqual({ kind: "boolean", bool: true });
    expect(scalarOf("FALSE", "boolean")).toEqual({ kind: "boolean", bool: false });
  });
  it("detects different numbers", () => {
    expect(compareScalar(scalarOf("4999", "INR"), scalarOf("6499", "INR"))).toBe("different");
    expect(compareScalar(scalarOf("6499", "INR"), scalarOf("6499", "INR"))).toBe("equal");
  });
});
