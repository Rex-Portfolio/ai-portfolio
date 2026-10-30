"use client";

import { useRef, useState } from "react";
import { EXAMPLES } from "@/lib/ai/examples";
import { parseDiagnosis } from "@/lib/ai/parse-response";
import { LIMITS } from "@/lib/diagnose-limits";

const initialForm = {
  industry: "",
  teamSize: "",
  problem: "",
  website: "", // honeypot, hidden from people
};

const ACTOR_STYLE = {
  AI: "border-lime bg-lime text-bg",
  System: "border-line-strong text-ink",
  Person: "border-line text-muted",
};

const LEVELS = [
  { id: "PROCESS", label: "Fix the process" },
  { id: "AUTOMATION", label: "Simple automation" },
  { id: "AI", label: "AI" },
];

export default function DiagnosticForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(/** @type {"idle" | "loading" | "streaming" | "done"} */ ("idle"));
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [exampleId, setExampleId] = useState(null);
  const abortRef = useRef(/** @type {AbortController | null} */ (null));

  const result = parseDiagnosis(text);
  const busy = status === "loading" || status === "streaming";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function showExample(example) {
    abortRef.current?.abort();
    setForm({ ...initialForm, ...example.input });
    setError(null);
    setExampleId(example.id);
    setText(example.output);
    setStatus("done");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);
    setText("");
    setExampleId(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setText(full);
      }
      setStatus("done");
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  const inputClassName =
    "w-full rounded-md border border-line bg-bg px-4 py-3 text-sm leading-relaxed text-ink outline-none transition duration-200 placeholder:text-dim focus:border-lime focus:ring-2 focus:ring-lime/20";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label mr-1">Try an example</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            aria-pressed={exampleId === example.id}
            onClick={() => showExample(example)}
            className="min-h-10 rounded-full border border-line px-3.5 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink aria-pressed:border-lime aria-pressed:bg-lime-soft aria-pressed:text-ink"
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6 lg:p-7">
          <div>
            <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-ink">
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              required
              value={form.industry}
              onChange={handleChange}
              maxLength={LIMITS.industry}
              placeholder="e.g. B2B SaaS, Healthcare, Logistics"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="teamSize" className="mb-1.5 block text-sm font-medium text-ink">
              Team size
            </label>
            <input
              id="teamSize"
              name="teamSize"
              type="text"
              required
              value={form.teamSize}
              onChange={handleChange}
              maxLength={LIMITS.teamSize}
              placeholder="e.g. 15, 50-100"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="problem" className="mb-1.5 block text-sm font-medium text-ink">
              Describe a problem
            </label>
            <textarea
              id="problem"
              name="problem"
              required
              rows={5}
              maxLength={LIMITS.problem}
              value={form.problem}
              onChange={handleChange}
              placeholder="e.g. Our finance team manually compiles reports from 5 systems every month. It takes 3 people about a week, and errors slip through."
              className={`${inputClassName} resize-none`}
            />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
          </div>

          <button type="submit" disabled={busy} className="btn btn-lime w-full">
            {busy ? "Running diagnostic..." : "Run diagnostic"}
          </button>

          {error && (
            <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300">
              {error}
            </p>
          )}
        </form>

        <div
          aria-live="polite"
          aria-busy={busy}
          className="panel flex min-h-[22rem] flex-col p-6 lg:min-h-0 lg:p-7"
        >
          {status === "loading" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div aria-hidden="true" className="h-7 w-7 animate-spin rounded-full border-2 border-lime border-t-transparent" />
              <p className="text-sm text-muted">Reading your problem...</p>
            </div>
          )}

          {status === "idle" && (
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-display text-sm font-semibold text-ink">Assessment</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Describe a problem, or open an example. You&apos;ll get the real problem, an honest call on whether it
                needs AI, a 90-day plan and the people risks.
              </p>
            </div>
          )}

          {(status === "streaming" || status === "done") && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="label label-lime">{exampleId ? "Example assessment" : "Your assessment"}</span>
                {status === "streaming" && <span className="label animate-pulse">Writing...</span>}
              </div>

              {result.problem && (
                <Section title="The real problem">
                  <p>{result.problem}</p>
                </Section>
              )}

              {result.verdict && (
                <Section title="Does this need AI?">
                  <div className="grid grid-cols-3 gap-1.5">
                    {LEVELS.map((level) => (
                      <span
                        key={level.id}
                        className={`rounded-md border px-2 py-2 text-center font-mono text-[0.6875rem] uppercase tracking-wider ${
                          result.verdict.level === level.id
                            ? "border-lime bg-lime text-bg"
                            : "border-line text-dim"
                        }`}
                      >
                        {level.label}
                      </span>
                    ))}
                  </div>
                  {result.verdict.reason && <p className="mt-2.5">{result.verdict.reason}</p>}
                </Section>
              )}

              {result.fixFirst && (
                <Section title="Fix first">
                  <p>{result.fixFirst}</p>
                </Section>
              )}

              {result.flow && result.flow.length > 0 && (
                <Section title="How it works">
                  <ol className="space-y-2.5">
                    {result.flow.map((step, i) => (
                      <li key={i} className="grid grid-cols-[1.25rem_4.25rem_1fr] items-start gap-2">
                        <span className="font-mono text-xs leading-6 text-dim">{i + 1}</span>
                        <span
                          className={`mt-0.5 rounded-[3px] border px-1.5 py-0.5 text-center font-mono text-[0.6875rem] uppercase tracking-wider ${
                            ACTOR_STYLE[step.actor] ?? "border-line text-dim"
                          }`}
                        >
                          {step.actor ?? "Step"}
                        </span>
                        <span>{step.text}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {result.plan && result.plan.length > 0 && (
                <Section title="90-day plan">
                  <ol className="space-y-2">
                    {result.plan.map((step, i) => (
                      <li key={i} className="grid grid-cols-[3.75rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr]">
                        <span className="font-mono text-xs leading-6 text-lime">{step.day ? `Day ${step.day}` : ""}</span>
                        <span>{step.text}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {result.changeRisk && (
                <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-4">
                  <h3 className="label !text-amber-300">People and change</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/90">{result.changeRisk}</p>
                </div>
              )}

              {result.kpis && result.kpis.length > 0 && (
                <Section title="KPIs to track">
                  <ul className="space-y-1.5">
                    {result.kpis.map((kpi) => (
                      <li key={kpi} className="flex gap-2.5">
                        <span className="text-lime">↳</span>
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {result.watchOut && (
                <Section title="Watch out">
                  <p>{result.watchOut}</p>
                </Section>
              )}

              {result.error && (
                <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ title: string; children: React.ReactNode }} props
 */
function Section({ title, children }) {
  return (
    <div className="fade-swap">
      <h3 className="label">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}
