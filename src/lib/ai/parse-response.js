/**
 * @typedef {{
 *   verdict: string;
 *   approach: string;
 *   opportunities: Array<{ title: string; detail: string }>;
 *   quickWin: string;
 *   impact: string;
 *   watchout: string;
 * }} DiagnosisResult
 */

/**
 * @param {string} text
 * @returns {DiagnosisResult}
 */
export function parseDiagnosisResponse(text) {
  const trimmed = text.trim();

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (!fenced) {
      throw new Error("Model response was not valid JSON");
    }
    parsed = JSON.parse(fenced[1].trim());
  }

  validateDiagnosisResult(parsed);
  return parsed;
}

/**
 * @param {unknown} value
 * @returns {asserts value is DiagnosisResult}
 */
function validateDiagnosisResult(value) {
  if (!value || typeof value !== "object") {
    throw new Error("Model response was not a JSON object");
  }

  const result = /** @type {Record<string, unknown>} */ (value);
  const requiredStrings = ["verdict", "approach", "quickWin", "impact", "watchout"];

  for (const field of requiredStrings) {
    if (typeof result[field] !== "string" || !result[field].trim()) {
      throw new Error(`Model response missing or invalid field: ${field}`);
    }
  }

  if (!Array.isArray(result.opportunities) || result.opportunities.length === 0) {
    throw new Error("Model response missing or invalid field: opportunities");
  }

  for (const item of result.opportunities) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.title !== "string" ||
      !item.title.trim() ||
      typeof item.detail !== "string" ||
      !item.detail.trim()
    ) {
      throw new Error("Model response contains invalid opportunity entries");
    }
  }
}
