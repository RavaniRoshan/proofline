import { z } from "zod";

export const FactSchema = z.object({
  fact_id: z.string().min(1),
  version: z.number().int().positive(),
  product_id: z.string().min(1),
  attribute: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().min(1),
  display_value: z.string().optional().default(""),
  source_document_id: z.string().min(1),
  source_version_id: z.string().min(1),
  source_span: z.string().regex(/^\[.*\]$/),
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  supersedes_fact_id: z.string().nullable().optional(),
  status: z.enum(["approved", "superseded", "rejected"]),
  approved_by: z.string().min(1),
  approved_at: z.string().min(1),
});

export const SourceDocumentSchema = z.object({
  document_id: z.string().min(1),
  version_id: z.string().min(1),
  title: z.string().min(1),
  kind: z.string().min(1),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pages: z.number().int().positive(),
  uploaded_by: z.string(),
  char_length: z.number().int().nonnegative(),
});

export const BrandSchema = z.object({
  brand_id: z.string().min(1),
  brand_name: z.string().min(1),
  products: z.array(
    z.object({
      product_id: z.string().min(1),
      name: z.string().min(1),
      status: z.enum(["active", "retired"]),
    }),
  ),
});

export type Fact = z.infer<typeof FactSchema>;
export type SourceDocument = z.infer<typeof SourceDocumentSchema>;
export type Brand = z.infer<typeof BrandSchema>;

/** DATA.md §4 — the model may only return this shape. */
export const ModelResponseSchema = z.object({
  claim_type: z.enum([
    "numeric",
    "temporal",
    "entity",
    "qualitative",
    "disclaimer",
    "not_a_claim",
  ]),
  candidate_fact_ids: z.array(z.string()).default([]),
  relation: z.enum(["supports", "contradicts", "unrelated", "insufficient"]),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(1),
  suggested_correction: z.string().nullable(),
});

export type ModelResponse = z.infer<typeof ModelResponseSchema>;
