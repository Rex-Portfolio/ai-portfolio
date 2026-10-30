"use client";

import { useEffect, useState } from "react";

type Step = { name: string; flag?: string };

const views = {
  before: {
    steps: [
      { name: "Application received" },
      { name: "Manual document check", flag: "manual" },
      { name: "Re-key into spreadsheet", flag: "re-keyed" },
      { name: "Credit assessment", flag: "manual" },
      { name: "Manager sign-off", flag: "queue" },
      { name: "Decision" },
    ] as Step[],
    time: "Half a day",
  },
  after: {
    steps: [
      { name: "Application received" },
      { name: "Singpass / MyInfo verified data" },
      { name: "Automated scoring engine" },
      { name: "Decision" },
    ] as Step[],
    time: "< 2 mins",
  },
};

type View = keyof typeof views;

/** Hero panel: a real workflow, before and after. Cycles until someone takes over. */
export default function SystemMap() {
  const [view, setView] = useState<View>("before");
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setView((v) => (v === "before" ? "after" : "before")), 3800);
    return () => window.clearInterval(id);
  }, [auto]);

  const current = views[view];
  const after = view === "after";

  return (
    <div className="panel relative overflow-hidden bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="label">System / 001 · Credit underwriting</span>
        <span className="flex items-center gap-2">
          <span className="dot-live" aria-hidden="true" />
          <span className="label label-lime">Live</span>
        </span>
      </div>

      <div className="flex gap-1 border-b border-line p-1.5" role="tablist" aria-label="Workflow view">
        {(["before", "after"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => {
              setAuto(false);
              setView(v);
            }}
            className={`flex-1 rounded-[4px] py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
              view === v ? (v === "after" ? "bg-lime text-bg" : "bg-signal-soft text-signal") : "text-muted hover:text-ink"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5 pb-4" role="tabpanel">
        <ol key={view} className="fade-swap relative min-h-[17.5rem]">
          {current.steps.map((step, i) => (
            <li key={step.name} className="relative flex items-center gap-3 pb-3 last:pb-0">
              {i < current.steps.length - 1 && (
                <span
                  className={`absolute top-6 left-[0.6875rem] h-[calc(100%-0.75rem)] w-px ${
                    after ? "bg-lime/50" : "bg-line-strong"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[0.625rem] ${
                  after
                    ? "border-lime bg-lime-soft text-lime"
                    : step.flag
                      ? "border-signal/60 bg-signal-soft text-signal"
                      : "border-line-strong bg-surface-2 text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm">{step.name}</span>
              {step.flag && (
                <span className="rounded-[3px] border border-signal/40 px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-signal">
                  {step.flag}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-3 border-t border-line">
        <div className="col-span-2 border-r border-line px-5 py-3.5">
          <p className="label">Cycle time</p>
          <p
            key={view}
            className={`fade-swap font-display text-2xl font-semibold tracking-tight ${
              after ? "text-lime" : "text-signal"
            }`}
          >
            {current.time} <span className="text-sm font-normal text-muted">per application</span>
          </p>
        </div>
        <div className="px-5 py-3.5">
          <p className="label">Steps</p>
          <p className="font-display text-2xl font-semibold tracking-tight">{current.steps.length}</p>
        </div>
      </div>
    </div>
  );
}
