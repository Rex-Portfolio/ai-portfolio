import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { LIMITS } from "@/lib/diagnose-limits";
import { checkRateLimit, getClientIp, takeDailyBudget } from "@/lib/rate-limit";

const CACHE_SIZE = 200;
/** Identical questions get the stored answer instead of a new model call. */
const answers = new Map();

/**
 * @param {unknown} body
 * @returns {{ industry: string; teamSize: string; problem: string } | null}
 */
function parseRequestBody(body) {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { industry, teamSize, problem } = /** @type {Record<string, unknown>} */ (
    body
  );

  if (
    typeof industry !== "string" ||
    !industry.trim() ||
    typeof teamSize !== "string" ||
    !teamSize.trim() ||
    typeof problem !== "string" ||
    !problem.trim() ||
    industry.length > LIMITS.industry ||
    teamSize.length > LIMITS.teamSize ||
    problem.length > LIMITS.problem
  ) {
    return null;
  }

  return {
    industry: industry.trim(),
    teamSize: teamSize.trim(),
    problem: problem.trim(),
  };
}

/**
 * @param {{ industry: string; teamSize: string; problem: string }} input
 */
function cacheKey({ industry, teamSize, problem }) {
  return [industry, teamSize, problem].map((s) => s.toLowerCase().replace(/\s+/g, " ")).join("|");
}

/**
 * @param {ReadableStream<Uint8Array> | string} body
 */
function textResponse(body) {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  // Honeypot: real visitors never see or fill this field.
  if (body && typeof body === "object" && body.website) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  const input = parseRequestBody(body);
  if (!input) {
    return NextResponse.json(
      {
        error: `Invalid request. Fill in all fields (problem up to ${LIMITS.problem} characters).`,
      },
      { status: 400 },
    );
  }

  const key = cacheKey(input);
  const cached = answers.get(key);
  if (cached) {
    return textResponse(cached);
  }

  const rateLimit = checkRateLimit(getClientIp(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `You can run up to 5 diagnostics per minute. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  if (!takeDailyBudget()) {
    return NextResponse.json(
      { error: "The live diagnostic has hit today's limit. Try one of the examples, or come back tomorrow." },
      { status: 429 },
    );
  }

  const streamDiagnosis = getAIProvider();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let full = "";
      try {
        for await (const chunk of streamDiagnosis(input, request.signal)) {
          full += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        if (!full.includes("## ERROR")) {
          if (answers.size >= CACHE_SIZE) answers.delete(answers.keys().next().value);
          answers.set(key, full);
        }
      } catch (error) {
        console.error("[diagnose]", error);
        controller.enqueue(
          encoder.encode("\n## ERROR\nThe diagnostic stopped partway. Please try again in a moment.\n"),
        );
      } finally {
        controller.close();
      }
    },
  });

  return textResponse(stream);
}
