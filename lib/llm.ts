/**
 * Stage 3 — LLM access. One interface, three providers.
 *
 *   LLM_PROVIDER=auto    (default) openai-compatible if LLM_API_KEY is set,
 *                                  else local Ollama if reachable, else null.
 *   LLM_PROVIDER=openai  POST {LLM_BASE_URL}/chat/completions (default OpenAI),
 *                                  model pinned by LLM_MODEL (default gpt-4o-mini-2024-07-18).
 *   LLM_PROVIDER=ollama  POST {LLM_OLLAMA_URL}/api/chat, think:false, format:json.
 *                                  No API key — same code path as production, local weights.
 *   LLM_PROVIDER=mock    Deterministic fake for tests. LLM_MOCK_RESPONSE (JSON string)
 *                                  overrides the canned response.
 *
 * The key is server-side only. Never logged, never sent to the browser.
 */
import { ModelResponseSchema, type ModelResponse } from "@/lib/schemas";
import type { Fact } from "@/lib/schemas";

export class LlmParseError extends Error {}

export interface ReviewInput {
  claim: string;
  claimType: string;
  candidates: Fact[];
}

export const PROMPT_VERSION = "v1";

export interface LlmClient {
  name: string;
  /** The model id this client targets, when known. */
  model?: string;
  reviewClaim(input: ReviewInput): Promise<ModelResponse>;
}

const SYSTEM = [
  "You are a strict claim checker for brand governance.",
  "Judge the claim ONLY against the supplied approved facts. Never invent a fact, a value, a date or a source.",
  "Relations: 'supports' = a fact entails the claim; 'contradicts' = a fact rules the claim out (seat/price/limit mismatch); 'unrelated' = no fact bears on the claim; 'insufficient' = cannot tell from the facts.",
  "Experiential or emotional phrasing with no measurable predicate ('feels different', 'a delight', 'loved by teams') is never 'supports' — answer 'insufficient'.",
  "candidate_fact_ids must come from the supplied fact_ids, or be empty.",
  "Reply with STRICT JSON and nothing else, using EXACTLY these keys: claim_type, candidate_fact_ids, relation, confidence, reason, suggested_correction.",
  "reason: one sentence, no citation text. suggested_correction: one replacement sentence, or null.",
].join(" ");

function userPayload(input: ReviewInput): string {
  const facts = input.candidates.map((f) => ({
    fact_id: f.fact_id,
    attribute: f.attribute,
    product_id: f.product_id,
    value: f.value,
    unit: f.unit,
    display_value: f.display_value,
  }));
  return [
    `Claim: "${input.claim}"`,
    `claim_type: ${input.claimType}`,
    `Facts: ${JSON.stringify(facts)}`,
    "",
    'Return ONLY the JSON verdict. Example shape: {"claim_type":"qualitative","candidate_fact_ids":[],"relation":"unrelated","confidence":0.9,"reason":"one sentence","suggested_correction":null}',
  ].join("\n");
}

function parseModelJson(raw: string): ModelResponse {
  // Lenient extraction, strict parsing: strip code fences, take the outer JSON object.
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new LlmParseError("model returned no JSON object");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch (e) {
    throw new LlmParseError(`model returned invalid JSON: ${(e as Error).message}`);
  }
  const result = ModelResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new LlmParseError(`model JSON failed schema: ${result.error.issues[0]?.message ?? "unknown"}`);
  }
  return result.data;
}

function keepSuppliedIds(resp: ModelResponse, candidates: Fact[]): ModelResponse {
  const supplied = new Set(candidates.map((c) => c.fact_id));
  return {
    ...resp,
    candidate_fact_ids: [...new Set(resp.candidate_fact_ids.filter((id) => supplied.has(id)))],
  };
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postJson(url: string, body: unknown, headers: Record<string, string>, timeoutMs: number): Promise<string> {
  const delays = [2000, 5000]; // 429/5xx retries — free-tier rate limits are bursty
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.text();
      if (res.ok) return text;
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < delays.length) {
        const retryAfter = Number(res.headers.get("retry-after"));
        await sleepMs(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : delays[attempt]!);
        continue;
      }
      throw new Error(`LLM endpoint ${res.status}: ${text.slice(0, 300)}`);
    } catch (e) {
      // Timeout/network: retryable too, unless it is the last attempt.
      const isHttpError = e instanceof Error && e.message.startsWith("LLM endpoint");
      if (isHttpError || attempt >= delays.length) throw e;
      lastError = e as Error;
      await sleepMs(delays[attempt]!);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError ?? new Error("LLM endpoint failed");
}

function openAiClient(apiKey: string, baseUrl: string, model: string): LlmClient {
  return {
    name: `openai-compatible:${model}`,
    model,
    async reviewClaim(input) {
      const raw = await postJson(
        `${baseUrl.replace(/\/$/, "")}/chat/completions`,
        {
          model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userPayload(input) },
          ],
        },
        { authorization: `Bearer ${apiKey}` },
        30_000,
      );
      const envelope = JSON.parse(raw) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = envelope.choices?.[0]?.message?.content;
      if (typeof content !== "string") throw new LlmParseError("missing choices[0].message.content");
      return keepSuppliedIds(parseModelJson(content), input.candidates);
    },
  };
}

function ollamaClient(url: string, model: string): LlmClient {
  return {
    name: `ollama:${model}`,
    model,
    async reviewClaim(input) {
      const raw = await postJson(
        `${url.replace(/\/$/, "")}/api/chat`,
        {
          model,
          stream: false,
          think: false,
          format: "json",
          options: { temperature: 0 },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userPayload(input) },
          ],
        },
        {},
        120_000,
      );
      const envelope = JSON.parse(raw) as { message?: { content?: string } };
      const content = envelope.message?.content;
      if (typeof content !== "string") throw new LlmParseError("missing message.content");
      return keepSuppliedIds(parseModelJson(content), input.candidates);
    },
  };
}

const MOCK_DEFAULT: ModelResponse = {
  claim_type: "qualitative",
  candidate_fact_ids: [],
  relation: "insufficient",
  confidence: 0.5,
  reason: "mock provider: no fact bears on this claim",
  suggested_correction: null,
};

function mockClient(): LlmClient {
  return {
    name: "mock",
    model: "mock",
    async reviewClaim(input) {
      const fromEnv = process.env.LLM_MOCK_RESPONSE;
      const parsed = fromEnv ? ModelResponseSchema.safeParse(JSON.parse(fromEnv)) : null;
      const resp = parsed?.success ? parsed.data : MOCK_DEFAULT;
      return keepSuppliedIds(resp, input.candidates);
    },
  };
}

let ollamaReachableCache: boolean | null = null;

async function ollamaReachable(url: string): Promise<boolean> {
  if (ollamaReachableCache !== null) return ollamaReachableCache;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${url.replace(/\/$/, "")}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    ollamaReachableCache = res.ok;
  } catch {
    ollamaReachableCache = false;
  }
  return ollamaReachableCache;
}

export async function getLlmClient(): Promise<LlmClient | null> {
  const provider = (process.env.LLM_PROVIDER ?? "auto").toLowerCase();
  const ollamaUrl = process.env.LLM_OLLAMA_URL ?? "http://localhost:11434";

  if (provider === "mock") return mockClient();
  if (provider === "ollama") return ollamaClient(ollamaUrl, process.env.LLM_MODEL ?? "qwen3:4b");
  if (provider === "openai") {
    const key = process.env.LLM_API_KEY;
    if (!key) throw new Error("LLM_PROVIDER=openai but LLM_API_KEY is not set");
    return openAiClient(key, process.env.LLM_BASE_URL ?? "https://api.openai.com/v1", process.env.LLM_MODEL ?? "gpt-4o-mini-2024-07-18");
  }
  // auto
  const key = process.env.LLM_API_KEY;
  if (key) {
    return openAiClient(key, process.env.LLM_BASE_URL ?? "https://api.openai.com/v1", process.env.LLM_MODEL ?? "gpt-4o-mini-2024-07-18");
  }
  if (await ollamaReachable(ollamaUrl)) {
    return ollamaClient(ollamaUrl, process.env.LLM_MODEL ?? "qwen3:4b");
  }
  return null;
}

export const __test = { parseModelJson, keepSuppliedIds };
