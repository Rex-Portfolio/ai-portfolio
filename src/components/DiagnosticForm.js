"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/diagnose-limits";

const initialForm = {
  industry: "",
  teamSize: "",
  problem: "",
};

export default function DiagnosticForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-md border border-line bg-bg px-4 py-3 text-sm leading-relaxed text-ink outline-none transition duration-200 placeholder:text-dim focus:border-lime focus:ring-2 focus:ring-lime/20";

  return (
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
            rows={4}
            maxLength={LIMITS.problem}
            value={form.problem}
            onChange={handleChange}
            placeholder="e.g. Our finance team manually compiles reports from 5 systems every month. It takes 3 people about a week, and errors slip through."
            className={`${inputClassName} resize-none`}
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-lime w-full">
          {loading ? "Running diagnostic..." : "Run Diagnostic"}
        </button>

        {error && (
          <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}
      </form>

      <div aria-live="polite" aria-busy={loading} className="panel flex min-h-[22rem] flex-col p-6 lg:min-h-0 lg:p-7">
        {loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div aria-hidden="true" className="h-7 w-7 animate-spin rounded-full border-2 border-lime border-t-transparent" />
            <p className="text-sm text-muted">Analysing your problem...</p>
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-1 flex-col justify-center">
            <p className="font-display text-sm font-semibold text-ink">
              Assessment results
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Submit a problem to receive a structured assessment.
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-5 overflow-y-auto">
            <div>
              <h3 className="label label-lime">The Real Problem</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">
                {result.realProblem}
              </p>
            </div>

            <div>
              <h3 className="label label-lime">Recommended Approach</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">{result.approach}</p>
            </div>

            <div>
              <h3 className="label label-lime">Where to Start</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/90">
                {result.startHere.lead}
              </p>
              <ul className="mt-3 space-y-2.5">
                {result.startHere.opportunities.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-md border border-line bg-bg p-4"
                  >
                    <p className="font-display text-sm font-medium text-ink">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-4">
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-amber-300">
                Considerations
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
                {result.considerations}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
