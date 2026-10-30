// Diagnostic Lab engine: scenario types and the simulation. Scenarios live in
// `./scenarios/`; everything in them is fictional and illustrative.

export type MetricFormat = "signedPct" | "pct" | "days" | "minutes" | "count";

export type MetricDef = {
  key: string;
  label: string;
  /** Plain-English definition, shown under the metric. */
  hint: string;
  start: number;
  better: "up" | "down";
  format: MetricFormat;
  /** Share of the score this metric drives (weights sum to 1). */
  weight: number;
  floor?: number;
  ceil?: number;
};

export type Verdict = "root" | "partial" | "symptom";

export type Hypothesis = { id: string; text: string; verdict: Verdict; feedback: string };

export type Area = {
  id: string;
  title: string;
  question: string;
  evidence: string[];
  hypotheses: Hypothesis[];
};

export type Phase = "Design" | "Transform" | "Optimise";

export type Intervention = {
  id: string;
  title: string;
  detail: string;
  cost: number; // $k
  people: number;
  phase: Phase;
  effect: Record<string, number>;
  kpi: string;
  lesson: string;
  /** Works properly only on top of another move; otherwise its gains are cut. */
  needs?: { id: string; factor: number; lesson: string };
};

export type Stakeholder = {
  id: string;
  name: string;
  role: string;
  quote: string;
  /** Labels for resisting / neutral / on board. */
  states: [string, string, string];
  /** How much this person's buy-in drives adoption. */
  weight: number;
};

export type ChangeMove = {
  id: string;
  title: string;
  hint: string;
  effect: Record<string, number>;
  /** Adoption lost later (compliance without commitment). */
  fade?: number;
  lesson: string;
  good: boolean;
};

export type Scenario = {
  id: string;
  name: string;
  /** Continues "You've inherited {name}, ..." */
  blurb: string;
  metrics: MetricDef[];
  symptoms: string[];
  areas: Area[];
  constraints: { budget: number; people: number; days: number };
  interventions: Intervention[];
  stakeholders: Stakeholder[];
  changeMoves: ChangeMove[];
  winVerdict: string;
  recommended: { picks: string[]; moves: string[]; reasoning: string; change: string };
};

export const CHANGE_CAPACITY = 2;
/** Above this adoption the change sticks and the full benefit lands. */
export const ADOPTION_STICKS = 75;

export function formatMetric(def: MetricDef, v: number): string {
  switch (def.format) {
    case "signedPct":
      return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}%`;
    case "pct":
      return `${v}%`;
    case "days":
      return `${v.toFixed(1)} days`;
    case "minutes":
      return `${v} min`;
    case "count":
      return `${v}`;
  }
}

export function isBetter(def: MetricDef, after: number): boolean {
  return def.better === "up" ? after > def.start : after < def.start;
}

export function isWorse(def: MetricDef, after: number): boolean {
  return def.better === "up" ? after < def.start : after > def.start;
}

// ---------- change ----------

/** Stakeholder stance after the chosen moves: 0 resisting, 1 neutral, 2 on board. */
export function stances(scenario: Scenario, moves: string[]): Record<string, 0 | 1 | 2> {
  const chosen = scenario.changeMoves.filter((m) => moves.includes(m.id));
  const out: Record<string, 0 | 1 | 2> = {};
  for (const s of scenario.stakeholders) {
    const v = chosen.reduce((sum, m) => sum + (m.effect[s.id] ?? 0), -1);
    out[s.id] = v >= 1 ? 2 : v === 0 ? 1 : 0;
  }
  return out;
}

/** Share of people actually working the new way (%). */
export function adoption(scenario: Scenario, moves: string[]): number {
  const st = stances(scenario, moves);
  let total = 30;
  for (const s of scenario.stakeholders) total += st[s.id] === 2 ? s.weight : st[s.id] === 1 ? s.weight * 0.4 : 0;
  total -= scenario.changeMoves.filter((m) => moves.includes(m.id)).reduce((sum, m) => sum + (m.fade ?? 0), 0);
  return Math.max(10, Math.min(95, Math.round(total)));
}

// ---------- plan maths ----------

type Metrics = Record<string, number>;

function roundFor(def: MetricDef, v: number): number {
  const r = def.format === "days" ? Math.round(v * 10) / 10 : Math.round(v);
  return Math.max(def.floor ?? -Infinity, Math.min(def.ceil ?? Infinity, r));
}

/** Metrics after a plan, with gains scaled by how much of the change was realised. */
function applyPlan(scenario: Scenario, picks: string[], realised: number): Metrics {
  const after: Metrics = Object.fromEntries(scenario.metrics.map((m) => [m.key, m.start]));
  for (const item of scenario.interventions.filter((i) => picks.includes(i.id))) {
    const factor = item.needs && !picks.includes(item.needs.id) ? item.needs.factor : 1;
    for (const [key, value] of Object.entries(item.effect)) {
      const def = scenario.metrics.find((m) => m.key === key);
      if (!def) continue;
      // Gains need people to adopt the change; costs land either way.
      const improves = value > 0 === (def.better === "up");
      after[key] += value * (improves ? factor * realised : 1);
    }
  }
  for (const def of scenario.metrics) after[def.key] = roundFor(def, after[def.key]);
  return after;
}

function feasiblePlans(scenario: Scenario): string[][] {
  const items = scenario.interventions;
  const plans: string[][] = [];
  for (let mask = 1; mask < 1 << items.length; mask++) {
    const plan = items.filter((_, i) => mask & (1 << i));
    const cost = plan.reduce((sum, i) => sum + i.cost, 0);
    const people = plan.reduce((sum, i) => sum + i.people, 0);
    if (cost <= scenario.constraints.budget && people <= scenario.constraints.people) plans.push(plan.map((i) => i.id));
  }
  return plans;
}

type Calibration = { scale: Metrics; best: number; ranked: { picks: string[]; value: number }[] };
const calibrations = new Map<string, Calibration>();

/** Largest achievable gain per metric and the best plan value, found by trying every feasible plan. */
function calibrate(scenario: Scenario): Calibration {
  const cached = calibrations.get(scenario.id);
  if (cached) return cached;
  const plans = feasiblePlans(scenario).map((picks) => ({ picks, after: applyPlan(scenario, picks, 1) }));
  const scale: Metrics = {};
  for (const def of scenario.metrics) {
    const gains = plans.map((p) => gain(def, p.after[def.key]));
    scale[def.key] = Math.max(1e-6, ...gains);
  }
  const ranked = plans
    .map((p) => ({ picks: p.picks, value: planValue(scenario, p.after, scale) }))
    .sort((a, b) => b.value - a.value);
  const result = { scale, best: ranked[0]?.value ?? 1, ranked };
  calibrations.set(scenario.id, result);
  return result;
}

function gain(def: MetricDef, after: number): number {
  return (after - def.start) * (def.better === "up" ? 1 : -1);
}

function planValue(scenario: Scenario, after: Metrics, scale: Metrics): number {
  return scenario.metrics.reduce(
    (sum, def) => sum + def.weight * Math.max(-0.5, Math.min(1, gain(def, after[def.key]) / scale[def.key])),
    0,
  );
}

// ---------- outcome ----------

export type Outcome = {
  after: Metrics;
  adoption: number;
  notes: { id: string; title: string; lesson: string; tone: "good" | "bad" | "warn" }[];
  changeNotes: { id: string; title: string; lesson: string; good: boolean }[];
  score: number;
  verdict: string;
  roadmap: Record<Phase, string[]>;
  kpis: string[];
  /** Other plans that would also have done well: there's more than one good answer. */
  alternatives: string[][];
};

const DIAGNOSIS_BONUS: Record<Verdict, number> = { root: 10, partial: 5, symptom: 0 };

export function simulate(scenario: Scenario, picks: string[], diagnosis: Verdict | null, moves: string[]): Outcome {
  const adopted = adoption(scenario, moves);
  const realised = Math.min(1, adopted / ADOPTION_STICKS);
  const after = applyPlan(scenario, picks, realised);
  const { scale, best, ranked } = calibrate(scenario);

  const value = planValue(scenario, after, scale);
  const score = Math.max(
    0,
    Math.min(100, Math.round((90 * value) / best) + (diagnosis ? DIAGNOSIS_BONUS[diagnosis] : 0)),
  );

  const chosen = scenario.interventions.filter((i) => picks.includes(i.id));
  const notes: Outcome["notes"] = chosen.map((item) => {
    const missing = item.needs && !picks.includes(item.needs.id);
    const hurt = Object.entries(item.effect)
      .map(([key, v]) => ({ def: scenario.metrics.find((m) => m.key === key), v }))
      .filter(({ def, v }) => def && v > 0 !== (def.better === "up"));
    const hurtsMajor = hurt.some(({ def }) => def && def.weight >= 0.25);
    return {
      id: item.id,
      title: item.title,
      lesson: missing && item.needs ? item.needs.lesson : item.lesson,
      tone: hurtsMajor ? "bad" : missing || hurt.length ? "warn" : "good",
    };
  });

  const verdict =
    realised < 0.6 && score < 60
      ? "A solution nobody uses delivers nothing. The plan was fine on paper; the people never came with it."
      : score >= 85
        ? scenario.winVerdict
        : score >= 60
          ? "Real progress. A different combination would have gone further for the same budget."
          : score >= 30
            ? "Some gains, but most of the budget went on symptoms rather than the cause."
            : "More expensive, not much better. The real problem is still there.";

  const roadmap: Outcome["roadmap"] = { Design: [], Transform: [], Optimise: [] };
  for (const item of chosen) roadmap[item.phase].push(item.title);

  const key = [...picks].sort().join(",");
  const alternatives = ranked
    .filter((p) => p.value >= best * 0.85 && [...p.picks].sort().join(",") !== key)
    .slice(0, 2)
    .map((p) => p.picks);

  return {
    after,
    adoption: adopted,
    notes,
    changeNotes: scenario.changeMoves
      .filter((m) => moves.includes(m.id))
      .map((m) => ({ id: m.id, title: m.title, lesson: m.lesson, good: m.good })),
    score,
    verdict,
    roadmap,
    kpis: chosen.map((i) => i.kpi),
    alternatives,
  };
}
