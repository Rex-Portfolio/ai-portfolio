// Parses the sectioned diagnosis text. Works on partial text, so the form can
// render each section as it streams in.

/**
 * @typedef {"PROCESS" | "AUTOMATION" | "AI"} VerdictLevel
 * @typedef {{
 *   problem?: string;
 *   verdict?: { level: VerdictLevel | null; reason: string };
 *   fixFirst?: string;
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
  if (raw.plan) {
    result.plan = lines("plan").map((l) => {
      const m = l.match(/^(30|60|90)\s*:\s*(.*)$/);
      return m ? { day: m[1], text: m[2] } : { day: "", text: l };
    });
  }
  if (raw.changeRisk) result.changeRisk = body("changeRisk");
  if (raw.kpis) result.kpis = lines("kpis").map((l) => l.replace(/^[-*•]\s*/, ""));
  if (raw.watchOut) result.watchOut = body("watchOut");
  if (raw.error) result.error = body("error");
  return result;
}
