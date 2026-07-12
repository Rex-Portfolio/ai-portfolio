import { generateDiagnosis as anthropicGenerateDiagnosis } from "./anthropic.js";

/** @typedef {import("./prompt.js").DiagnosisInput} DiagnosisInput */
/** @typedef {import("./parse-response.js").DiagnosisResult} DiagnosisResult */

/** @type {Record<string, (input: DiagnosisInput) => Promise<DiagnosisResult>>} */
const providers = {
  anthropic: anthropicGenerateDiagnosis,
  // openai: openaiGenerateDiagnosis, // swap in when needed
};

/**
 * @param {string} [name]
 * @returns {(input: DiagnosisInput) => Promise<DiagnosisResult>}
 */
export function getAIProvider(name = process.env.AI_PROVIDER ?? "anthropic") {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${name}`);
  }
  return provider;
}
