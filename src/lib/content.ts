// Site copy and portfolio data. Figures here are real outcomes from past work;
// the Diagnostic Lab's fictional company lives in `src/lib/lab/scenario.ts`.

export const principles = [
  {
    index: "01",
    title: "Think in systems",
    line: "Symptoms show up in one team. Causes usually live in the handoffs between them.",
  },
  {
    index: "02",
    title: "Build with constraints",
    line: "No budget and a small team is a design brief, not an excuse.",
  },
  {
    index: "03",
    title: "Measure what matters",
    line: "Outcomes, not activity. If it doesn't move a number someone cares about, it's decoration.",
  },
];

export const outcomes = [
  { label: "Credit underwriting", before: "Half a day", after: "2 mins" },
  { label: "Customer onboarding", before: "Half a day", after: "90 secs" },
  { label: "Support operating cost", before: "Baseline", after: "−96%" },
  { label: "Group reporting", before: "1 week", after: "10 mins" },
];

export type CaseStudy = {
  id: string;
  title: string;
  tag: string;
  problem: string;
  build: string;
  stack: string[];
  result: string;
  /** How people adopted the change. */
  landed: string;
  /** True until Rex has confirmed the "landed" wording; shows a DRAFT tag. */
  landedDraft?: boolean;
  metric: { value: string; label: string };
};

export const caseStudies: CaseStudy[] = [
  {
    id: "chopnow",
    title: "ChopNow platform",
    tag: "Full stack build",
    problem:
      "A live BNPL platform needed Admin, Merchant and Customer portals, and onboarding took half a day per customer.",
    build:
      "Built all three portals from scratch, with Singpass/MyInfo pulling verified customer data straight into onboarding.",
    stack: ["React.js", "Vercel", "AWS", "NeonDB", "Singpass/MyInfo API"],
    result:
      "Customer onboarding cut from half a day to under 90 seconds. Merchant setup from 4 hours to under 30 minutes.",
    landed: "Onboarded merchants in small batches and fixed what they raised before scaling, so the portals earned trust instead of being imposed.",
    landedDraft: true,
    metric: { value: "90s", label: "customer onboarding" },
  },
  {
    id: "underwriting",
    title: "Credit scoring & underwriting engine",
    tag: "Decision automation",
    problem: "Every application went through half a day of manual underwriting.",
    build: "Designed and built automated credit scoring logic on top of verified MyInfo data and the loan system.",
    stack: ["Singpass/MyInfo API", "Proprietary LMS", "React.js"],
    result: "Underwriting time cut from half a day to under 2 minutes per application.",
    landed: "Ran the automated scores alongside manual underwriting until the credit team agreed with the engine's calls, then made it the default.",
    landedDraft: true,
    metric: { value: "<2 min", label: "per application" },
  },
  {
    id: "support",
    title: "AI customer support automation",
    tag: "AI operations",
    problem: "Customer servicing ran on manual agents, and volume growth meant more hires.",
    build: "Deployed a 24/7 OpenAI-powered WhatsApp servicing workflow that replaced manual agent operations.",
    stack: ["OpenAI API", "WhatsApp Business API", "n8n"],
    result: "Operational costs cut by 96%, with no extra hires needed at the same volume.",
    landed: "Kept a human escalation path from day one, so the team saw the AI as taking the repetitive work, not their judgement.",
    landedDraft: true,
    metric: { value: "−96%", label: "operating cost" },
  },
  {
    id: "collections",
    title: "Collections & repayment automation",
    tag: "Workflow automation",
    problem: "Repayments were reconciled by hand every day, taking half a day each time.",
    build: "Automated repayment tracking tied directly to loan schedules and QR payment infrastructure.",
    stack: ["Workato", "QR payments", "LMS integration"],
    result: "Freed 2.5 days of ops effort per week, with zero reconciliation mismatches since deployment.",
    landed: "Ran the automated reconciliation in parallel with the manual one until finance trusted the numbers, then retired the spreadsheet.",
    landedDraft: true,
    metric: { value: "2.5 days", label: "freed per week" },
  },
  {
    id: "reporting",
    title: "Group financial reporting",
    tag: "Finance automation",
    problem: "Group-wide statement consolidation depended on manual Excel work and took a week.",
    build: "Automated consolidation across the group, removing the Excel dependency.",
    stack: ["JavaScript", "Macros", "Workato"],
    result: "Reporting turnaround cut from 1 week to under 10 minutes, enabling real-time management decisions.",
    landed: "Delivered the automated statements in the format finance already used, so the switch changed the speed, not the habits.",
    landedDraft: true,
    metric: { value: "10 min", label: "reporting turnaround" },
  },
  {
    id: "bpr",
    title: "Group-wide process re-engineering",
    tag: "Operating model",
    problem: "Manual touchpoints across every department were capping throughput.",
    build: "Led business process re-engineering across all departments, redesigning workflows end to end.",
    stack: ["Workato", "AI agents", "Google Workspace"],
    result: "Reduced manual intervention across finance, ops, onboarding and reporting, group-wide.",
    landed: "Mapped each department's workflow with the people doing the work, so the redesign came from their pain points, not a top-down mandate.",
    landedDraft: true,
    metric: { value: "All depts", label: "redesigned" },
  },
];

/** Each belief has a polite version and an unfiltered one (the card flips). */
export const beliefs = [
  {
    polite: "Don't optimise a broken process. Fix the process.",
    blunt:
      "If your process needs five people to manually fix what one broken system produces, you have a process problem.",
  },
  {
    polite: "Targets without resources are just wishful thinking.",
    blunt: "A target without a resource plan is an aspiration.",
  },
  {
    polite: "Technology should solve problems, not create new ones.",
    blunt: "Digital transformation isn't buying software and calling it innovation.",
  },
  {
    polite: "Measure outcomes, not activity.",
    blunt: "Busy is not a KPI.",
  },
  {
    polite: "If a system depends on one person constantly firefighting, the system is broken.",
    blunt: "More headcount isn't always the answer. Sometimes the operating model is just terrible.",
  },
];

export const exploring = [
  "AI and intelligent automation",
  "Business process optimisation",
  "Enterprise transformation",
  "Building independent digital products",
];
