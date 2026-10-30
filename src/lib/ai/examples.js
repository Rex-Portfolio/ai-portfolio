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
30: Two senior accountants map the current close and turn their best template into the standard one, with a 20-item checklist; move on once both partners sign it off.
60: Run the next close on the standard template with daily 30-minute partner review slots; move on if the close finishes in 6 days or fewer.
90: With every client on one template, set up automatic bank feed matching in the accounting software; keep it only if matching errors stay under 2%.

## CHANGE RISK
Senior accountants will defend their own templates. Build the standard from their best one and let them own it, so it reads as their method rather than a new rule.

## KPIS
- Working days to close, from 8 to 5
- Reconciliations passing partner review first time, above 90%
- Partner review hours in the final two days, down by half

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
Send automatic status updates by SMS or email at each tracking milestone, with a self-serve tracking link.

## HOW IT WORKS
1. System: Each tracking milestone (picked up, out for delivery, delivered, failed attempt) fires an event from the tracking system.
2. System: The event sends the customer an SMS or email with the new status and a tracking link.
3. System: Any incoming email containing a tracking number gets an instant auto-reply with the live status.
4. Person: Emails with no tracking number, complaints and failed deliveries go to the service team queue.

## PLAN
30: The service lead tags 3 months of enquiries to confirm the share that are status questions and picks 4 milestones to notify; go ahead if status questions are over 50% of volume.
60: Ops switches on milestone notifications for the largest client; move on if that client's status enquiries drop by at least 40%.
90: Roll out to all clients and add the tracking-number auto-reply; keep it if wrong-status replies stay under 1%.

## CHANGE RISK
The service team may worry the automation replaces them. Show them the freed time goes to delivery exceptions and key accounts, the work that actually needs a person.

## KPIS
- Status enquiries per 100 deliveries, down by 60%
- First-response time on non-status emails, under 2 hours
- Customer satisfaction on delivery updates, above 4.5 out of 5

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
Pulling the same 15 fields out of 300 scanned forms a week, in a dozen insurer layouts, is the one step rules can't do; everything around it stays rules-based or with a person.

## FIX FIRST
Agree the 15 fields every claim needs and the approval step, then use AI only to read the documents into a draft that a claims officer approves.

## HOW IT WORKS
1. System: Claim documents from email and the upload portal land in one intake queue, tagged with the policy number.
2. AI: Reads each scanned PDF or photo (text recognition plus a language model) and extracts 15 named fields, such as claimant, incident date, amount and insurer reference, into a draft record with a confidence score per field.
3. System: Checks the draft against the policy database (policy active, amount within cover) and flags any field below 90% confidence or any mismatch.
4. Person: A claims officer reviews the draft beside the original document, corrects flagged fields and approves; nothing enters the claims system without approval.
5. System: The approved record is pushed into the claims system and the insurer's submission format.

## PLAN
30: The ops lead and two claims officers label 200 recent claims across insurers with the correct 15 fields and record today's handling time and error rate as the baseline.
60: Run AI extraction on those 200 claims offline and go ahead only if field accuracy is at least 95%; then pilot live on one insurer with approval on every claim.
90: Add insurers one at a time once each passes the same 95% bar, keep approval on every claim, and review the flagged-field rate weekly.

## CHANGE RISK
Claims officers need to trust the drafts before they stop re-checking everything. Show them the pilot accuracy numbers and keep the final approval in their hands.

## KPIS
- Handling time per claim, from 12 minutes to under 4
- Field accuracy on approved claims, above 98%
- Claims processed within 24 hours, above 90%

## WATCH OUT
Claims contain personal and health data, so confirm where documents are processed and follow PDPA and the IMDA Model AI Governance Framework on human oversight.`,
  },
];
