import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { LIMITS } from "@/lib/diagnose-limits";

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

export async function POST(request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Rate limit exceeded. You can run up to 5 diagnostics per minute. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const input = parseRequestBody(body);
  if (!input) {
    return NextResponse.json(
      {
        error:
          `Invalid request. Fill in all fields (problem up to ${LIMITS.problem} characters).`,
      },
      { status: 400 },
    );
  }

  try {
    const generateDiagnosis = getAIProvider();
    const result = await generateDiagnosis(input);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    if (message.includes("not configured")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    if (
      message.includes("not valid JSON") ||
      message.includes("missing or invalid") ||
      message.includes("invalid opportunity") ||
      message.includes("startHere")
    ) {
      return NextResponse.json(
        { error: "Failed to parse model response", detail: message },
        { status: 502 },
      );
    }

    console.error("[diagnose]", error);
    return NextResponse.json(
      { error: "Failed to generate diagnosis" },
      { status: 500 },
    );
  }
}
