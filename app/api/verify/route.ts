import { z } from "zod";
import { verifyDraft } from "@/lib/verify";
import { applyFactOverrides } from "@/lib/seed";
import { FactSchema } from "@/lib/schemas";
import { LlmParseError } from "@/lib/llm";

const RequestSchema = z.object({
  draft: z.string().min(1, "draft is required").max(200_000, "draft is too large"),
  review_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "review_date must be YYYY-MM-DD")
    .optional(),
  /**
   * The caller's locally approved register rows (from this browser's
   * localStorage). Applied in-process for this request only, so the verdict
   * pipeline sees the same register the judge sees. Never persisted.
   */
  register_overrides: z.array(FactSchema).max(50).optional(),
});

/**
 * Overrides are spliced into the shared register in place, so checks must not
 * overlap — one request sees a stable register at a time. Single-tenant demo:
 * serialising requests is the whole fix.
 */
let verifyQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = verifyQueue.then(task);
  verifyQueue = result.catch(() => undefined);
  return result;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request.", issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).slice(0, 5) },
      { status: 400 },
    );
  }
  try {
    const result = await enqueue(async () => {
      const restore = applyFactOverrides(parsed.data.register_overrides ?? []);
      try {
        return await verifyDraft(parsed.data.draft, {
          reviewDate: parsed.data.review_date,
        });
      } finally {
        restore();
      }
    });
    return Response.json(result);
  } catch (e) {
    if (e instanceof LlmParseError) {
      return Response.json(
        { error: `The language model returned unusable output (${e.message}). Nothing was published; try again.` },
        { status: 502 },
      );
    }
    if (e instanceof Error && e.message.startsWith("Evidence gate")) {
      return Response.json({ error: e.message }, { status: 500 });
    }
    return Response.json({ error: "Verification failed unexpectedly." }, { status: 500 });
  }
}

export function GET() {
  return Response.json({ error: "Use POST." }, { status: 405 });
}
