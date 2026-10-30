import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildDiagnosisPrompt } from "./prompt.js";

// Haiku keeps each run to a fraction of a cent. Set AI_MODEL (e.g. claude-sonnet-5-5) for deeper answers.
const MODEL = process.env.AI_MODEL || "claude-haiku-5-5";
// Room for the full sectioned answer; the prompt keeps each section short.
const MAX_TOKENS = 4000;

/**
 * @typedef {import("./prompt.js").DiagnosisInput} DiagnosisInput
 */

/**
 * Streams the diagnosis as plain text in the sectioned format from the prompt.
 * @param {DiagnosisInput} input
 * @param {AbortSignal} [signal]
 * @returns {AsyncGenerator<string>}
 */
export async function* streamDiagnosis(input, signal) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildDiagnosisPrompt(input) }],
    },
    { signal },
  );

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }

  const message = await stream.finalMessage();
  if (message.stop_reason === "refusal") {
    yield "\n## ERROR\nThe diagnostic can't help with that one. Try describing an operational problem in your business.\n";
  }
}
