/**
 * @typedef {{ industry: string; teamSize: string; problem: string }} DiagnosisInput
 */

const RESPONSE_SCHEMA = `{
  "realProblem": "1-2 sentences reframing the underlying problem beneath what the user described. Diagnose, don't just restate.",
  "approach": "2-3 sentences on the recommended technical approach. Be specific about which type of solution fits (rules-based automation, classical ML, LLM/GenAI, AI agents, or a hybrid) and why.",
  "startHere": {
    "lead": "1 sentence on the single highest-ROI first move.",
    "opportunities": [
      {"title": "short title", "detail": "one concise sentence"},
      {"title": "...", "detail": "..."},
      {"title": "...", "detail": "..."}
    ]
  },
  "considerations": "1-2 sentences on governance, data readiness, compliance, or human oversight. Honest and practical."
}`;

/**
 * @param {DiagnosisInput} input
 * @returns {string}
 */
export function buildDiagnosisPrompt({ industry, teamSize, problem }) {
  return `You are a business transformation consultant. Analyse the problem described below and return a structured transformation assessment.

Industry: ${industry}
Team size: ${teamSize}
Problem: ${problem}

Return ONLY valid JSON with no markdown, no backticks, and no commentary. Match this schema exactly:
${RESPONSE_SCHEMA}

Rules:
- Give exactly 3 opportunities in startHere.opportunities, ordered by priority (highest first).
- Keep every field tight, concrete, and specific to the user's input. No filler, no generic advice.
- Do NOT use em dashes anywhere in the response. Use commas, full stops, or restructure the sentence. Write plain, direct, natural English that does not read as AI-generated. Avoid filler words like "leverage", "seamless", "robust", "empower", and constructions like "not just X but Y".
- Default to a Singapore business context unless the user's input clearly indicates otherwise. When referencing regulation, compliance, or governance, use Singapore-relevant frameworks (PDPA for data privacy, MAS guidelines for financial services, PDPC/IMDA Model AI Governance Framework) rather than foreign regulations like GDPR or HIPAA, unless the described context is clearly international. Keep compliance points practical and proportionate, not alarmist.`;
}
