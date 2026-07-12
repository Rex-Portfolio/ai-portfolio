"use client";

import { useState } from "react";

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
    "w-full rounded-xl border border-dark-border bg-dark-bg px-4 py-3 text-sm leading-relaxed text-dark-text outline-none transition duration-200 placeholder:text-dark-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
      <form onSubmit={handleSubmit} className="card-dark space-y-5 p-6 lg:p-7">
        <div>
          <label htmlFor="industry" className="mb-1.5 block text-sm font-medium text-dark-text">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            required
            value={form.industry}
            onChange={handleChange}
            placeholder="e.g. B2B SaaS, Healthcare, Logistics"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="teamSize" className="mb-1.5 block text-sm font-medium text-dark-text">
            Team size
          </label>
          <input
            id="teamSize"
            name="teamSize"
            type="text"
            required
            value={form.teamSize}
            onChange={handleChange}
            placeholder="e.g. 15, 50-100"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="problem" className="mb-1.5 block text-sm font-medium text-dark-text">
            Describe a problem
          </label>
          <textarea
            id="problem"
            name="problem"
            required
            rows={4}
            value={form.problem}
            onChange={handleChange}
            placeholder="e.g. Our finance team manually compiles reports from 5 systems every month. It takes 3 people about a week, and errors slip through."
            className={`${inputClassName} resize-none`}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary-dark w-full">
          {loading ? "Running diagnostic..." : "Run Diagnostic"}
        </button>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-300">
            {error}
          </p>
        )}
      </form>

      <div className="card-dark flex min-h-[22rem] flex-col p-6 lg:min-h-0 lg:p-7">
        {loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-dark-muted">Analysing your problem...</p>
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-1 flex-col justify-center">
            <p className="font-heading text-sm font-semibold text-dark-text">
              Assessment results
            </p>
            <p className="mt-2 text-sm leading-relaxed text-dark-muted">
              Submit a problem to receive a structured assessment.
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-5 overflow-y-auto">
            <div>
              <h3 className="section-label section-label-dark">The Real Problem</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-text/90">
                {result.realProblem}
              </p>
            </div>

            <div>
              <h3 className="section-label section-label-dark">Recommended Approach</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-text/90">{result.approach}</p>
            </div>

            <div>
              <h3 className="section-label section-label-dark">Where to Start</h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-text/90">
                {result.startHere.lead}
              </p>
              <ul className="mt-3 space-y-2.5">
                {result.startHere.opportunities.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-dark-border bg-dark-bg p-4"
                  >
                    <p className="font-heading text-sm font-medium text-dark-text">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-dark-muted">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
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
