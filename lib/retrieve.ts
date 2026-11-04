/** Stage 3 — lexical candidate retrieval. No embeddings, no index. */
import { facts } from "@/lib/seed";
import type { Fact } from "@/lib/schemas";

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "in", "on", "of", "to", "and", "or",
  "for", "with", "you", "your", "we", "it", "its", "this", "that", "be", "at", "by",
  "as", "it's", "plan", "flowdesk",
]);

export function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[₹$€£]/g, " ")
    .split(/[^a-z0-9%]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP.has(t));
  return new Set(tokens);
}

function factTokens(f: Fact): Set<string> {
  const attr = f.attribute.toLowerCase().split("_").join(" ");
  return tokenize(`${attr} ${f.value} ${f.display_value} ${f.unit} ${f.product_id}`);
}

/**
 * Score by token overlap on attribute + value + display tokens.
 * Approved facts only. Top 5. weight: attribute tokens 2, value/display/product 1.
 */
export function retrieveCandidates(claim: string, attributeHint?: string): Fact[] {
  const claimTokens = tokenize(claim + (attributeHint ? ` ${attributeHint.split("_").join(" ")}` : ""));
  const scored = facts
    .filter((f) => f.status === "approved")
    .map((f) => {
      const attrTokens = new Set(f.attribute.toLowerCase().split("_"));
      const rest = factTokens(f);
      let score = 0;
      for (const t of claimTokens) {
        if (attrTokens.has(t)) score += 2;
        else if (rest.has(t)) score += 1;
      }
      return { f, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.f.fact_id.localeCompare(b.f.fact_id))
    .slice(0, 5);
  return scored.map((s) => s.f);
}
