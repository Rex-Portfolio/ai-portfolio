// Pre-written diagnoses shown without calling the model, one per verdict.

export const EXAMPLES = [
  {
    id: "process",
    label: "Accounting firm, slow month-end",
    input: {
      industry: "Accounting and bookkeeping",
      teamSize: "25",
      problem:
        "Our month-end close takes 8 working days. Each accountant reconciles their clients in their own Excel template, and partners review everything at the end.",
    },
    output: `## PROBLEM
The close isn't slow because the work is hard. It's slow because every accountant works a different way and all review piles up on the partners in the last two days.

## VERDICT
PROCESS
There's no shared method or review rhythm yet, so any tool would just automate eight different ways of working.

## FIX FIRST
Agree one reconciliation template and a checklist with the senior accountants, and move partner review to rolling daily slots instead of one final pile.

## PLAN
30: Map the current close with two accountants and design one standard template and checklist.
60: Run the next close on the new template with daily partner review slots, and track where time goes.
90: Automate the bank feed matching that the standard template now makes possible.

## CHANGE RISK
Senior accountants will defend their own templates. Build the standard from their best one and let them own it, so it reads as their method rather than a new rule.

## KPIS
- Working days to close
- Reconciliations passing partner review first time
- Partner review hours in the final two days

## WATCH OUT
Client financial data in shared templates still falls under PDPA, so keep access by client and log who changes what.`,
  },
  {
    id: "automation",
    label: "Logistics, \"where is my order\" emails",
    input: {
      industry: "Logistics and last-mile delivery",
      teamSize: "60",
      problem:
        "Our 6-person service team spends most of the day answering 'where is my order' emails. The answer is always in our tracking system, they just look it up and reply.",
    },
    output: `## PROBLEM
Customers are asking for information you already have, because nothing tells them proactively. The team has become a manual lookup service.

## VERDICT
AUTOMATION
The question is the same every time and the answer sits in structured tracking data, so rules and integrations will do. No AI needed.

## FIX FIRST
Send automatic status updates by email or SMS at each tracking milestone, with a self-serve tracking link.

## PLAN
30: Pull three months of enquiries to confirm what share are status questions, and pick the milestones customers care about.
60: Switch on milestone notifications and the tracking link for one major client and measure enquiry volume.
90: Roll out to all clients and add an auto-reply to the inbox that answers status questions from the tracking number.

## CHANGE RISK
The service team may worry the automation replaces them. Show them the freed time goes to delivery exceptions and key accounts, the work that actually needs a person.

## KPIS
- Status enquiries per 100 deliveries
- First-response time on non-status emails
- Customer satisfaction on delivery updates

## WATCH OUT
Notification messages carry names and addresses, so confirm consent and keep the content minimal under PDPA.`,
  },
  {
    id: "ai",
    label: "Insurance broker, claim forms",
    input: {
      industry: "Insurance broking",
      teamSize: "40",
      problem:
        "We receive about 300 claim documents a week as scanned PDFs, photos and emails, in different formats from different insurers. Staff read each one and retype the details into our system.",
    },
    output: `## PROBLEM
The bottleneck is reading messy, inconsistent documents. The retyping is just where the cost shows up.

## VERDICT
AI
The inputs are unstructured and vary by insurer, the volume is high, and a person can check each extraction in seconds, which is where AI earns its place.

## FIX FIRST
Standardise the target fields and the review step first, then use AI to extract claim details into a draft that staff approve before it enters the system.

## PLAN
30: Agree the 15 fields that matter, collect 200 sample documents, and measure today's handling time and error rate.
60: Pilot AI extraction with human approval on one insurer's claims, comparing accuracy and time against the manual baseline.
90: Extend to the other insurers that pass the accuracy bar, keeping human approval on every claim.

## CHANGE RISK
Claims staff need to trust the drafts before they stop re-checking everything. Let them see accuracy numbers from the pilot and keep the final approval in their hands.

## KPIS
- Minutes of handling per claim
- Extraction accuracy on approved claims
- Claims processed within 24 hours

## WATCH OUT
Claims contain personal and health data, so check where documents are processed and follow PDPA and the IMDA Model AI Governance Framework on human oversight.`,
  },
];
