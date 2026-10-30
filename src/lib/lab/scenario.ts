// "Fix this business": a fictional company for the Diagnostic Lab.
// Everything here is illustrative. The point is the reasoning, not the numbers.

export type MetricKey = "margin" | "utilisation" | "cycle" | "systems";

export type Metrics = Record<MetricKey, number>;

export const metricMeta: Record<
  MetricKey,
  { label: string; format: (v: number) => string; better: "up" | "down" }
> = {
  margin: { label: "Operating margin", format: (v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}%`, better: "up" },
  utilisation: { label: "Staff on value work", format: (v) => `${v}%`, better: "up" },
  cycle: { label: "Order processing time", format: (v) => `${v.toFixed(1)} days`, better: "down" },
  systems: { label: "Disconnected systems", format: (v) => `${v}`, better: "down" },
};

export const company = {
  name: "Kestrel Supply Co.",
  blurb: "A 120-person B2B distributor. Revenue is up 24% this year. Somehow, everything else is worse.",
  start: { margin: -18, utilisation: 42, cycle: 3.8, systems: 6 } satisfies Metrics,
  symptoms: [
    "Revenue is growing but profitability is declining",
    "Customer acquisition costs are rising",
    "Operating costs are ballooning",
    "Employee productivity is falling",
    "Management can't see performance until weeks later",
  ],
};

export type AreaId = "process" | "workforce" | "technology" | "financial";

export type Hypothesis = { id: string; text: string; root: boolean; feedback: string };

export type Area = {
  id: AreaId;
  title: string;
  question: string;
  evidence: string[];
  hypotheses: Hypothesis[];
};

const ROOT_FEEDBACK =
  "That's it. The people and the tools aren't the problem: the order flow is. Every order is re-keyed across disconnected systems, so growth multiplies manual work instead of profit.";

export const areas: Area[] = [
  {
    id: "process",
    title: "Process inefficiencies",
    question: "How does an order actually move through the business?",
    evidence: [
      "An order passes through 11 manual handoffs before it ships.",
      "38% of orders are reworked at least once.",
      "Nobody owns the order-to-cash process end to end.",
    ],
    hypotheses: [
      { id: "p1", text: "The team needs stricter SOPs and more training.", root: false, feedback: "Training people to follow a broken process just makes them better at the broken process." },
      { id: "p2", text: "Orders are re-keyed across disconnected steps with no owner, so every handoff adds delay and errors.", root: true, feedback: ROOT_FEEDBACK },
      { id: "p3", text: "Customers keep changing their orders.", root: false, feedback: "Some do, but that doesn't explain why 38% of orders need rework internally." },
    ],
  },
  {
    id: "workforce",
    title: "Workforce and resource allocation",
    question: "Where does the team's time actually go?",
    evidence: [
      "Ops headcount grew 30% in a year. Throughput grew 6%.",
      "58% of ops time goes to re-keying data and chasing updates.",
      "Two senior staff are the only people who can unstick a stuck order.",
    ],
    hypotheses: [
      { id: "w1", text: "Staff are underperforming. Tighten targets.", root: false, feedback: "58% of their time is spent on data entry the system forces on them. Targets won't change that." },
      { id: "w2", text: "We're understaffed for this growth. Hire more.", root: false, feedback: "Headcount already grew 30% for 6% more throughput. More people feed the same bottleneck." },
      { id: "w3", text: "The process forces skilled people to do manual data work, so capacity is wasted, not missing.", root: true, feedback: ROOT_FEEDBACK },
    ],
  },
  {
    id: "technology",
    title: "Technology and system fragmentation",
    question: "What does the tech stack look like from an order's point of view?",
    evidence: [
      "6 systems, 0 integrations: CRM, ERP, warehouse, invoicing and two spreadsheets.",
      "Each order is typed in 4 separate times.",
      "Software spend is up 40% after two new tools were bought last year.",
    ],
    hypotheses: [
      { id: "t1", text: "The ERP is outdated. Replace it with a modern all-in-one platform.", root: false, feedback: "They bought two tools last year and things got worse. A new platform on the same process is the same problem, more expensive." },
      { id: "t2", text: "The systems don't share one order record, so people act as the integration layer.", root: true, feedback: ROOT_FEEDBACK },
      { id: "t3", text: "Staff need better training on the existing tools.", root: false, feedback: "Knowing the tools well doesn't help when the same order has to be typed into four of them." },
    ],
  },
  {
    id: "financial",
    title: "Financial and commercial performance",
    question: "Where is the margin leaking?",
    evidence: [
      "Revenue is up 24%, but cost to serve each order is up 31%.",
      "Discounting to win deals has grown; acquisition cost is up 27%.",
      "Management reports arrive three weeks after month-end.",
    ],
    hypotheses: [
      { id: "f1", text: "Cut costs across the board by 15%.", root: false, feedback: "Blanket cuts hit the people holding a broken process together. Costs come back, and so does the rework." },
      { id: "f2", text: "Cost to serve rises with every order because the order flow is manual, and late reports hide it.", root: true, feedback: ROOT_FEEDBACK },
      { id: "f3", text: "Sales is discounting too much. Freeze discounts.", root: false, feedback: "Discounting is a real leak, but it's not why cost to serve grows 31%. It's a second fix, not the first." },
    ],
  },
];

export type Phase = "Design" | "Transform" | "Optimise";

export type Intervention = {
  id: string;
  title: string;
  detail: string;
  cost: number; // $k
  people: number;
  phase: Phase;
  effect: Partial<Metrics>;
  kpi: string;
  lesson: string;
};

export const constraints = { budget: 60, people: 3, days: 90 };

export const interventions: Intervention[] = [
  {
    id: "redesign",
    title: "Redesign order-to-cash",
    detail: "Map the flow, cut handoffs from 11 to 4, give one person end-to-end ownership.",
    cost: 5,
    people: 1,
    phase: "Design",
    effect: { margin: 8, utilisation: 14, cycle: -1.6 },
    kpi: "Order cycle time and first-time-right rate",
    lesson: "Fixing the process first. Cheap, unglamorous, and it makes everything after it work better.",
  },
  {
    id: "integrate",
    title: "Integrate CRM → ERP → invoicing",
    detail: "One order record that flows through the stack. No more re-keying.",
    cost: 30,
    people: 1,
    phase: "Transform",
    effect: { margin: 6, utilisation: 12, cycle: -1.2, systems: -3 },
    kpi: "Manual touches per order",
    lesson: "Automation on top of a fixed process. This is where the compounding gains come from.",
  },
  {
    id: "pricing",
    title: "Price by cost to serve",
    detail: "Stop blanket discounting. Set discount guardrails by order profitability.",
    cost: 2,
    people: 1,
    phase: "Optimise",
    effect: { margin: 7 },
    kpi: "Gross margin per order",
    lesson: "A commercial fix that costs almost nothing. Margin is a pricing decision as much as a cost one.",
  },
  {
    id: "dashboard",
    title: "Weekly ops scorecard",
    detail: "Cost to serve, cycle time and rework, every Monday instead of three weeks late.",
    cost: 3,
    people: 1,
    phase: "Optimise",
    effect: { margin: 3, utilisation: 4 },
    kpi: "Report lag (target: under 1 day)",
    lesson: "Visibility doesn't fix anything by itself, but it stops problems hiding for a month.",
  },
  {
    id: "hire",
    title: "Hire 10 more ops staff",
    detail: "Add capacity to clear the backlog.",
    cost: 45,
    people: 1,
    phase: "Transform",
    effect: { margin: -6, utilisation: -6, cycle: -0.4 },
    kpi: "Orders per ops FTE",
    lesson: "More headcount isn't always the answer. You've added cost to a process that wastes 58% of people's time.",
  },
  {
    id: "erp",
    title: "Buy a new all-in-one ERP",
    detail: "Replace the stack with one big platform.",
    cost: 55,
    people: 2,
    phase: "Transform",
    effect: { margin: -3, cycle: 0.3, systems: 1 },
    kpi: "Go-live date",
    lesson: "Buying software isn't transformation. In 90 days you get a migration, not a better business.",
  },
];

// ---------- Land the change ----------

export type StakeholderId = "dana" | "team" | "cfo";

export type Stakeholder = {
  id: StakeholderId;
  name: string;
  role: string;
  quote: string;
  /** Labels for resisting / neutral / on board. */
  states: [string, string, string];
  /** How much this person's buy-in drives adoption. */
  weight: number;
};

export const stakeholders: Stakeholder[] = [
  {
    id: "dana",
    name: "Dana",
    role: "Ops lead, 12 years",
    quote: "We tried a redesign in 2022. It made things worse.",
    states: ["Resisting", "Curious", "On board"],
    weight: 25,
  },
  {
    id: "team",
    name: "Order team",
    role: "40 people",
    quote: "Integration means layoffs. Everyone knows it.",
    states: ["Anxious", "Wary", "On board"],
    weight: 20,
  },
  {
    id: "cfo",
    name: "CFO",
    role: "Holds the budget",
    quote: "Show me it works before I fund the rest.",
    states: ["Sceptical", "Listening", "On board"],
    weight: 15,
  },
];

export type ChangeMove = {
  id: string;
  title: string;
  hint: string;
  effect: Partial<Record<StakeholderId, number>>;
  /** Adoption lost later (compliance without commitment). */
  fade?: number;
  lesson: string;
  good: boolean;
};

export const changeCapacity = 2;

export const changeMoves: ChangeMove[] = [
  {
    id: "codesign",
    title: "Co-design it with Dana as process owner",
    hint: "Make the loudest sceptic the owner.",
    effect: { dana: 3, team: 1 },
    lesson: "The person who knows where the bodies are buried now owns the fix. Her credibility carries the team.",
    good: true,
  },
  {
    id: "pilot",
    title: "Pilot one product line, publish weekly numbers",
    hint: "Let results do the persuading.",
    effect: { cfo: 3, dana: 1 },
    lesson: "A small, visible win beats a big promise. The numbers made the case for the rest of the rollout.",
    good: true,
  },
  {
    id: "commit",
    title: "Commit publicly: freed time goes to customers, not redundancies",
    hint: "Name the fear out loud.",
    effect: { team: 3 },
    lesson: "People resist what they think change will do to them. Removing the threat removed most of the resistance.",
    good: true,
  },
  {
    id: "mandate",
    title: "CEO mandate: \"This is happening\"",
    hint: "Fast, top-down.",
    effect: { dana: 1, team: 1, cfo: 1 },
    fade: 15,
    lesson: "You got compliance, not commitment. Usage looked fine for a month, then the workarounds came back.",
    good: false,
  },
  {
    id: "email",
    title: "Email the new SOP and run an all-hands",
    hint: "Tell everyone clearly.",
    effect: {},
    lesson: "Communication isn't change management. Nobody's mind changed because of a slide.",
    good: false,
  },
  {
    id: "bigbang",
    title: "Big-bang go-live Monday, mandatory training",
    hint: "Rip the plaster off.",
    effect: { dana: -1, team: -1, cfo: -1 },
    lesson: "Everything changed at once and nothing had been proven. The first bad week became the story.",
    good: false,
  },
];

/** Stakeholder stance after the chosen moves: 0 resisting, 1 neutral, 2 on board. */
export function stances(moves: string[]): Record<StakeholderId, 0 | 1 | 2> {
  const out = {} as Record<StakeholderId, 0 | 1 | 2>;
  for (const s of stakeholders) {
    const v = changeMoves
      .filter((m) => moves.includes(m.id))
      .reduce((sum, m) => sum + (m.effect[s.id] ?? 0), -1);
    out[s.id] = v >= 1 ? 2 : v === 0 ? 1 : 0;
  }
  return out;
}

/** Share of people actually working the new way (%). */
export function adoption(moves: string[]): number {
  const st = stances(moves);
  let total = 30;
  for (const s of stakeholders) total += st[s.id] === 2 ? s.weight : st[s.id] === 1 ? s.weight * 0.4 : 0;
  total -= changeMoves.filter((m) => moves.includes(m.id)).reduce((sum, m) => sum + (m.fade ?? 0), 0);
  return Math.max(10, Math.min(95, Math.round(total)));
}

/** Above this adoption the change sticks and the full benefit lands. */
export const ADOPTION_STICKS = 75;

// ---------- Outcome ----------

export type Outcome = {
  after: Metrics;
  adoption: number;
  notes: { id: string; title: string; lesson: string; tone: "good" | "bad" | "warn" }[];
  changeNotes: { id: string; title: string; lesson: string; good: boolean }[];
  score: number;
  verdict: string;
  roadmap: Record<Phase, string[]>;
  kpis: string[];
};

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Apply the chosen interventions and change moves to the starting metrics. */
export function simulate(selected: string[], foundRoot: boolean, moves: string[] = []): Outcome {
  const chosen = interventions.filter((i) => selected.includes(i.id));
  const redesigned = selected.includes("redesign");
  const adopted = adoption(moves);
  // A solution nobody uses delivers nothing: gains scale with adoption until the change sticks.
  const realised = Math.min(1, adopted / ADOPTION_STICKS);
  const after: Metrics = { ...company.start };
  const notes: Outcome["notes"] = [];

  for (const item of chosen) {
    // Automating a broken process only gets you half the benefit.
    const halved = item.id === "integrate" && !redesigned;
    const factor = halved ? 0.5 : 1;
    for (const [key, value] of Object.entries(item.effect) as [MetricKey, number][]) {
      // Costs (negative effects) land in full whether or not people adopt the change.
      const scale = value > 0 === (metricMeta[key].better === "up") ? realised : 1;
      after[key] += key === "systems" ? Math.round(value * (halved ? 0.67 : 1) * scale) : value * factor * scale;
    }
    const bad = item.effect.margin !== undefined && item.effect.margin < 0;
    notes.push({
      id: item.id,
      title: item.title,
      lesson: halved
        ? "Automating a broken process just gives you a faster broken process. Half the benefit, without the redesign."
        : item.lesson,
      tone: bad ? "bad" : halved ? "warn" : "good",
    });
  }

  after.margin = Math.round(after.margin);
  after.utilisation = Math.max(0, Math.min(95, Math.round(after.utilisation)));
  after.cycle = Math.max(0.5, round1(after.cycle));
  after.systems = Math.max(1, after.systems);

  // Score: share of the best achievable improvement, plus a bonus for the right diagnosis.
  const best = { margin: 21, utilisation: 26, cycle: 2.8, systems: 3 };
  const start = company.start;
  const part = (gain: number, max: number) => Math.max(-0.5, Math.min(1, gain / max));
  const raw =
    part(after.margin - start.margin, best.margin) * 40 +
    part(after.utilisation - start.utilisation, best.utilisation) * 20 +
    part(start.cycle - after.cycle, best.cycle) * 20 +
    part(start.systems - after.systems, best.systems) * 10 +
    (foundRoot ? 10 : 0);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const verdict =
    realised < 0.6 && score < 60
      ? "A solution nobody uses delivers nothing. The plan was fine on paper; the people never came with it."
      : score >= 85
        ? "Back in profit inside 90 days, without hiring or buying a platform. That's a transformation."
        : score >= 60
          ? "Real progress. A different combination would have gone further for the same budget."
          : score >= 30
            ? "Some gains, but most of the budget went on symptoms rather than the cause."
            : "The business is more expensive and not much faster. The process is still the problem.";

  const roadmap: Outcome["roadmap"] = { Design: [], Transform: [], Optimise: [] };
  for (const item of chosen) roadmap[item.phase].push(item.title);

  const changeNotes = changeMoves
    .filter((m) => moves.includes(m.id))
    .map((m) => ({ id: m.id, title: m.title, lesson: m.lesson, good: m.good }));

  return { after, adoption: adopted, notes, changeNotes, score, verdict, roadmap, kpis: chosen.map((i) => i.kpi) };
}

/** What Rex would pick, shown after a run. */
export const recommended = {
  picks: ["redesign", "integrate", "pricing"],
  moves: ["codesign", "pilot"],
  reasoning:
    "Fix the flow first, then automate it, then stop the commercial leak. $37k, three people, no new hires and no new platform.",
  change:
    "Make the loudest sceptic the owner, then let a pilot's numbers do the persuading. The team's fear gets answered by Dana, not by a memo.",
};
