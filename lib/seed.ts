import brandJson from "@/seed/brand.json";
import docsJson from "@/seed/source_documents.json";
import factsJson from "@/seed/facts.json";
import {
  BrandSchema,
  FactSchema,
  SourceDocumentSchema,
  type Brand,
  type Fact,
  type SourceDocument,
} from "@/lib/schemas";

// Parsed once at module scope. A bad fixture fails the build, loudly — never
// produces a half-loaded register.
export const brand: Brand = BrandSchema.parse(brandJson);
export const documents: SourceDocument[] = docsJson.map((d) =>
  SourceDocumentSchema.parse(d),
);
export const facts: Fact[] = factsJson.map((f) => FactSchema.parse(f));

export const documentsById: Map<string, SourceDocument[]> = (() => {
  const m = new Map<string, SourceDocument[]>();
  for (const d of documents) {
    const list = m.get(d.document_id) ?? [];
    list.push(d);
    m.set(d.document_id, list);
  }
  return m;
})();

export const documentsByVersionId: Map<string, SourceDocument> = new Map(
  documents.map((d) => [d.version_id, d]),
);

export const productNameById: Map<string, string> = new Map(
  brand.products.map((p) => [p.product_id, p.name]),
);

export function isActiveAt(fact: Fact, reviewDate: string): boolean {
  return fact.status === "approved" && fact.valid_from <= reviewDate && reviewDate <= fact.valid_until;
}

/** Approved facts for a (product, attribute), newest version first. */
export function approvedFactsFor(productId: string, attribute: string): Fact[] {
  return facts
    .filter((f) => f.product_id === productId && f.attribute === attribute && f.status === "approved")
    .sort((a, b) => b.version - a.version);
}

/** Approved facts for an attribute across every product (used when the claim names no product). */
export function approvedFactsForAnyProduct(attribute: string): Fact[] {
  return facts
    .filter((f) => f.attribute === attribute && f.status === "approved")
    .sort((a, b) => a.product_id.localeCompare(b.product_id) || b.version - a.version);
}

export function documentOf(fact: Fact): SourceDocument | undefined {
  return documentsByVersionId.get(fact.source_version_id);
}

/** All rows for a fact_id (every version), newest first. */
export function factVersionsById(factId: string): Fact[] {
  return facts
    .filter((f) => f.fact_id === factId)
    .sort((a, b) => b.version - a.version);
}

/** Resolve one specific fact version; undefined if it does not exist. */
export function findFact(factId: string, version?: number): Fact | undefined {
  const rows = factVersionsById(factId);
  if (version === undefined) return rows[0];
  return rows.find((r) => r.version === version);
}
