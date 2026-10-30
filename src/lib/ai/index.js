import { streamDiagnosis as anthropicStreamDiagnosis } from "./anthropic.js";

/** @typedef {import("./prompt.js").DiagnosisInput} DiagnosisInput */
/** @typedef {(input: DiagnosisInput, signal?: AbortSignal) => AsyncGenerator<string>} DiagnosisStream */

/** @type {Record<string, DiagnosisStream>} */
const providers = {
  anthropic: anthropicStreamDiagnosis,
};

/**
 * @param {string} [name]
 * @returns {DiagnosisStream}
 */
export function getAIProvider(name = process.env.AI_PROVIDER ?? "anthropic") {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${name}`);
  }
  return provider;
}
