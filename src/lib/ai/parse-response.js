// Parses the sectioned diagnosis text. Works on partial text, so the form can
// render each section as it streams in.

/**
 * @typedef {"PROCESS" | "AUTOMATION" | "AI"} VerdictLevel
 * @typedef {{
 *   problem?: string;
 *   verdict?: { level: VerdictLevel | null; reason: string };
 *   fixFirst?: string;
 *   flow?: Array<{ actor: "AI" | "System" | "Person" | null; text: string }>;
 *   plan?: Array<{ day: string; text: string }>;
 *   changeRisk?: string;
 *   kpis?: string[];
 *   watchOut?: string;
 *   error?: string;
 * }} Diagnosis
 */

const KEYS = /** @type {const} */ ({
  PROBLEM: "problem",
  VERDICT: "verdict",
  "FIX FIRST": "fixFirst",
  "HOW IT WORKS": "flow",
  PLAN: "plan",
  "CHANGE RISK": "changeRisk",
  KPIS: "kpis",
  "WATCH OUT": "watchOut",
  ERROR: "error",
});

/**
 * @param {string} text
 * @returns {string}
 */
function stripEmDashes(text) {
  return text
    .replace(/\s*\u2014\s*/g, ", ")
    .replace(/\*\*|__/g, "")
    .replace(/,\s*,/g, ",")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * @param {string} text
 * @returns {Diagnosis}
 */
export function parseDiagnosis(text) {
  /** @type {Record<string, string[]>} */
  const raw = {};
  let current = null;
  for (const line of text.split("\n")) {
    const heading = line.match(/^##\s+([A-Z ]+?)\s*$/);
    if (heading && heading[1] in KEYS) {
      current = KEYS[/** @type {keyof typeof KEYS} */ (heading[1])];
      raw[current] = [];
    } else if (current) {
      raw[current].push(line);
    }
  }

  const body = (key) => (raw[key] ? stripEmDashes(raw[key].join("\n")) : undefined);
  const lines = (key) =>
    (raw[key] ?? []).map((l) => stripEmDashes(l)).filter(Boolean);

  /** @type {Diagnosis} */
  const result = {};
  if (raw.problem) result.problem = body("problem");
  if (raw.verdict) {
    const [first = "", ...rest] = lines("verdict");
    const level = first.toUpperCase().match(/\b(PROCESS|AUTOMATION|AI)\b/)?.[1] ?? null;
    result.verdict = {
      level: /** @type {VerdictLevel | null} */ (level),
      reason: (level ? rest : [first, ...rest]).join(" "),
    };
  }
  if (raw.fixFirst) result.fixFirst = body("fixFirst");
  if (raw.flow) {
    result.flow = lines("flow").map((l) => {
      const step = l.replace(/^\d+[.)]\s*/, "");
      const tag = step.match(/^(AI|System|Person)\s*:\s*/i);
      const actor = tag ? /** @type {"AI" | "System" | "Person"} */ (tag[1].toUpperCase() === "AI" ? "AI" : tag[1][0].toUpperCase() + tag[1].slice(1).toLowerCase()) : null;
      return { actor, text: tag ? step.slice(tag[0].length) : step };
    });
  }
  if (raw.plan) {
    // Accepts "30:", "31-60:", "Days 61-90:" or "60 days:"; the phase is the last number.
    /** @type {Array<{ day: string; text: string }>} */
    const plan = [];
    for (const l of lines("plan")) {
      const m = l.match(/^(?:days?\s*)?(?:\d+\s*-\s*)?(30|60|90)\s*(?:days?)?\s*:\s*(.*)$/i);
      if (m) plan.push({ day: m[1], text: m[2] });
      else if (plan.length) plan[plan.length - 1].text += " " + l;
      else plan.push({ day: "", text: l });
    }
    result.plan = plan;
  }
  if (raw.changeRisk) result.changeRisk = body("changeRisk");
  if (raw.kpis) result.kpis = lines("kpis").map((l) => l.replace(/^[-*•]\s*/, ""));
  if (raw.watchOut) result.watchOut = body("watchOut");
  if (raw.error) result.error = body("error");
  return result;
}
