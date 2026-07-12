/**
 * @typedef {{
 *   realProblem: string;
 *   approach: string;
 *   startHere: {
 *     lead: string;
 *     opportunities: Array<{ title: string; detail: string }>;
 *   };
 *   considerations: string;
 * }} DiagnosisResult
 */

/**
 * @param {string} text
 * @returns {string}
 */
function stripEmDashes(text) {
  return text
    .replace(/\s*—\s*/g, ", ")
    .replace(/—/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * @param {DiagnosisResult} result
 * @returns {DiagnosisResult}
 */
function sanitizeDiagnosisResult(result) {
  return {
    realProblem: stripEmDashes(result.realProblem),
    approach: stripEmDashes(result.approach),
    startHere: {
      lead: stripEmDashes(result.startHere.lead),
      opportunities: result.startHere.opportunities.map((item) => ({
        title: stripEmDashes(item.title),
        detail: stripEmDashes(item.detail),
      })),
    },
    considerations: stripEmDashes(result.considerations),
  };
}

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
  return sanitizeDiagnosisResult(parsed);
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
  const requiredStrings = ["realProblem", "approach", "considerations"];

  for (const field of requiredStrings) {
    if (typeof result[field] !== "string" || !result[field].trim()) {
      throw new Error(`Model response missing or invalid field: ${field}`);
    }
  }

  if (!result.startHere || typeof result.startHere !== "object") {
    throw new Error("Model response missing or invalid field: startHere");
  }

  const startHere = /** @type {Record<string, unknown>} */ (result.startHere);

  if (typeof startHere.lead !== "string" || !startHere.lead.trim()) {
    throw new Error("Model response missing or invalid field: startHere.lead");
  }

  if (!Array.isArray(startHere.opportunities) || startHere.opportunities.length !== 3) {
    throw new Error("Model response missing or invalid field: startHere.opportunities");
  }

  for (const item of startHere.opportunities) {
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
