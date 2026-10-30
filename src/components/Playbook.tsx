"use client";

import { Fragment, useState } from "react";
import { type CaseStudy, caseStudies } from "@/lib/content";

/**
 * Case-study index with the open case beside it on desktop, or opening
 * directly under its title on smaller screens.
 */
export default function Playbook() {
  const [activeId, setActiveId] = useState(caseStudies[0].id);
  const active = caseStudies.find((c) => c.id === activeId) ?? caseStudies[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
      <div className="flex flex-col gap-2">
        {caseStudies.map((c, i) => {
          const open = c.id === activeId;
          return (
            <Fragment key={c.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`case-${c.id}`}
                onClick={() => setActiveId(c.id)}
                className="option group flex items-center gap-4 px-4 py-3.5"
              >
                <span className="font-mono text-xs text-dim group-aria-expanded:text-lime">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-medium leading-snug">{c.title}</span>
                  <span className="label mt-0.5 block !text-[0.6875rem]">{c.tag}</span>
                </span>
                <span className="font-display text-base font-semibold tracking-tight text-muted group-aria-expanded:text-lime sm:text-lg">
                  {c.metric.value}
                </span>
              </button>
              {open && (
                <article id={`case-${c.id}`} className="panel overflow-hidden lg:hidden">
                  <CaseBody study={c} />
                </article>
              )}
            </Fragment>
          );
        })}
      </div>

      <article className="panel hidden flex-col overflow-hidden lg:flex" aria-live="polite">
        <CaseBody study={active} />
      </article>
    </div>
  );
}

function CaseBody({ study }: { study: CaseStudy }) {
  const rows: [string, React.ReactNode][] = [
    ["Problem", study.problem],
    ["What I did", study.build],
    [
      "How it landed",
      <>
        {study.landedDraft && (
          <span className="mr-2 rounded-[3px] border border-amber-300/50 px-1.5 py-0.5 align-middle font-mono text-[0.6875rem] uppercase tracking-wider text-amber-300">
            Draft
          </span>
        )}
        {study.landed}
      </>,
    ],
  ];

  return (
    <div key={study.id} className="fade-swap flex flex-1 flex-col">
      <div className="border-b border-line px-5 py-5 sm:px-8 sm:py-6">
        <p className="label label-lime">{study.tag}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{study.title}</h3>
      </div>

      <dl className="flex-1 divide-y divide-line">
        {rows.map(([term, text]) => (
          <div key={term} className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-8 sm:py-5">
            <dt className="label pt-0.5">{term}</dt>
            <dd className="text-[0.9375rem] leading-relaxed">{text}</dd>
          </div>
        ))}
        <div className="grid gap-2 px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6 sm:px-8 sm:py-5">
          <dt className="label pt-1">Stack</dt>
          <dd className="flex flex-wrap gap-1.5">
            {study.stack.map((s) => (
              <span key={s} className="rounded-[3px] border border-line-strong px-2 py-0.5 font-mono text-xs text-muted">
                {s}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="grid gap-3 border-t border-line bg-lime-soft px-5 py-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8 sm:px-8 sm:py-6">
        <div>
          <p className="font-display text-4xl font-semibold tracking-tight text-lime">{study.metric.value}</p>
          <p className="label">{study.metric.label}</p>
        </div>
        <p className="text-[0.9375rem] font-medium leading-relaxed">{study.result}</p>
      </div>
    </div>
  );
}
