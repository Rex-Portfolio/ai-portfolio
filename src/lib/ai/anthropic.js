import Anthropic from "@anthropic-ai/sdk";
import { buildDiagnosisPrompt } from "./prompt.js";
import { parseDiagnosisResponse } from "./parse-response.js";

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1000;

/**
 * @typedef {import("./prompt.js").DiagnosisInput} DiagnosisInput
 * @typedef {import("./parse-response.js").DiagnosisResult} DiagnosisResult
 */

/**
 * @param {DiagnosisInput} input
 * @returns {Promise<DiagnosisResult>}
 */
export async function generateDiagnosis(input) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildDiagnosisPrompt(input);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Model returned no text content");
  }

  return parseDiagnosisResponse(textBlock.text);
}
