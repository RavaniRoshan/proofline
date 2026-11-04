import type { ClaimType } from "@/lib/types";

const CURRENCY_OR_DIGIT = /[₹$€£]|\d/;
const MONTHS =
  /\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?|nov(ember)?|dec(ember)?)\b/i;
const YEAR = /\b(19|20)\d{2}\b/;
const TEMPORAL_CUES = /\b(since|as of|until|effective|valid (until|from|through))\b/i;

/** Known product/feature/value names → ENTITY. Brand name alone is NOT enough (Flowdesk is everywhere). */
const ENTITY_KEYWORDS =
  /\b(starter|growth|legacy|sso|saml|india|support|cancel|soc\s?2)\b/i;

const DISCLAIMER =
  /\b(subject to change|terms (and conditions )?apply|terms apply|may change|see terms|prices? (are )?(subject|valid)|all prices)\b/i;

export function isDisclaimer(clause: string): boolean {
  return DISCLAIMER.test(clause.trim());
}

export function classifyClaim(clause: string): ClaimType {
  const text = clause.trim();
  if (text === "") return "not_a_claim";
  // A boilerplate disclaimer is never a checkable numeric claim, even with digits.
  if (isDisclaimer(text)) return "disclaimer";
  // Currency/digits win next so "SOC 2", "5 seats", "₹4,999" are numeric.
  if (CURRENCY_OR_DIGIT.test(text)) {
    // "SOC 2" is an entity keyword in this register, not a measurement.
    if (/\bsoc\s?2\b/i.test(text) && !/₹|price|per month|seat|gb|percent|%/i.test(text))
      return "entity";
    return "numeric";
  }
  if (MONTHS.test(text) || YEAR.test(text) || TEMPORAL_CUES.test(text))
    return "temporal";
  if (ENTITY_KEYWORDS.test(text)) return "entity";
  return "qualitative";
}
