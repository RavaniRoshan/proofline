import { z } from "zod";
import { verifyDraft } from "@/lib/verify";
import { LlmParseError } from "@/lib/llm";

const RequestSchema = z.object({
  draft: z.string().min(1, "draft is required").max(200_000, "draft is too large"),
  review_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "review_date must be YYYY-MM-DD")
    .optional(),
});

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
    const result = await verifyDraft(parsed.data.draft, {
      reviewDate: parsed.data.review_date,
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
