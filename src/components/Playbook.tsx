"use client";

import { useState } from "react";
import { caseStudies } from "@/lib/content";

/** Case-study index on the left, the open case on the right (stacked on mobile). */
export default function Playbook() {
  const [activeId, setActiveId] = useState(caseStudies[0].id);
  const active = caseStudies.find((c) => c.id === activeId) ?? caseStudies[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
      <div role="tablist" aria-label="Case studies" aria-orientation="vertical" className="flex flex-col gap-2">
        {caseStudies.map((c, i) => (
          <button
            key={c.id}
            id={`case-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={c.id === activeId}
            aria-controls="case-panel"
            onClick={() => setActiveId(c.id)}
            className="option group flex items-center gap-4 px-4 py-3.5"
          >
            <span className="font-mono text-xs text-dim group-aria-selected:text-lime">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <span className="block font-medium leading-snug">{c.title}</span>
              <span className="label mt-0.5 block !text-[0.625rem]">{c.tag}</span>
            </span>
            <span className="hidden font-display text-lg font-semibold tracking-tight text-muted group-aria-selected:text-lime sm:block">
              {c.metric.value}
            </span>
          </button>
        ))}
      </div>

      <article
        id="case-panel"
        role="tabpanel"
        aria-labelledby={`case-tab-${active.id}`}
        className="panel flex flex-col overflow-hidden"
      >
        <div key={active.id} className="fade-swap flex flex-1 flex-col">
          <div className="border-b border-line px-6 py-6 sm:px-8">
            <p className="label label-lime">{active.tag}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{active.title}</h3>
          </div>

          <dl className="flex-1 divide-y divide-line">
            {[
              ["Problem", active.problem],
              ["What I did", active.build],
            ].map(([term, text]) => (
              <div key={term} className="grid gap-1 px-6 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-8">
                <dt className="label pt-0.5">{term}</dt>
                <dd className="text-[0.9375rem] leading-relaxed">{text}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-6 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-8">
              <dt className="label pt-0.5">How it landed</dt>
              <dd className="text-[0.9375rem] leading-relaxed">
                {active.landedDraft && (
                  <span className="mr-2 rounded-[3px] border border-amber-300/50 px-1.5 py-0.5 align-middle font-mono text-[0.625rem] uppercase tracking-wider text-amber-300">
                    Draft
                  </span>
                )}
                {active.landed}
              </dd>
            </div>
            <div className="grid gap-2 px-6 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-8">
              <dt className="label pt-1">Stack</dt>
              <dd className="flex flex-wrap gap-1.5">
                {active.stack.map((s) => (
                  <span key={s} className="rounded-[3px] border border-line-strong px-2 py-0.5 font-mono text-xs text-muted">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="grid gap-4 border-t border-line bg-lime-soft px-6 py-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:px-8">
            <div>
              <p className="font-display text-4xl font-semibold tracking-tight text-lime">{active.metric.value}</p>
              <p className="label">{active.metric.label}</p>
            </div>
            <p className="text-[0.9375rem] font-medium leading-relaxed">{active.result}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
