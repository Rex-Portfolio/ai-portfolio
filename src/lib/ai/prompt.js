/**
 * @typedef {{ industry: string; teamSize: string; problem: string }} DiagnosisInput
 */

const RESPONSE_SCHEMA = `{
  "verdict": "string — concise overall assessment",
  "approach": "string — recommended transformation strategy",
  "opportunities": [{ "title": "string", "detail": "string" }],
  "quickWin": "string — actionable first step",
  "impact": "string — expected business impact",
  "watchout": "string — key risk or caveat"
}`;

/**
 * @param {DiagnosisInput} input
 * @returns {string}
 */
export function buildDiagnosisPrompt({ industry, teamSize, problem }) {
  return `You are a business transformation consultant. Analyse the workflow described below and return a structured transformation assessment.

Industry: ${industry}
Team size: ${teamSize}
Problem / workflow challenge: ${problem}

Return ONLY valid JSON (no markdown, no commentary) matching this schema:
${RESPONSE_SCHEMA}`;
}
