"use client";

import { useRef, useState } from "react";
import {
  type AreaId,
  type MetricKey,
  areas,
  company,
  constraints,
  interventions,
  metricMeta,
  recommended,
  simulate,
} from "@/lib/lab/scenario";

const METHOD = ["Assess", "Diagnose", "Strategise", "Design", "Transform", "Optimise"];
// How far along the methodology each stage lights up.
const METHOD_PROGRESS = [1, 2, 3, 6];
const METRIC_KEYS: MetricKey[] = ["margin", "utilisation", "cycle", "systems"];

export default function FixThisBusiness() {
  const [stage, setStage] = useState(0);
  const [areaId, setAreaId] = useState<AreaId | null>(null);
  const [hypothesisId, setHypothesisId] = useState<string | null>(null);
  const [picks, setPicks] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  const area = areas.find((a) => a.id === areaId) ?? null;
  const hypothesis = area?.hypotheses.find((h) => h.id === hypothesisId) ?? null;
  const spent = interventions
    .filter((i) => picks.includes(i.id))
    .reduce((acc, i) => ({ cost: acc.cost + i.cost, people: acc.people + i.people }), { cost: 0, people: 0 });
  const outcome = stage === 3 ? simulate(picks, Boolean(hypothesis?.root)) : null;

  function go(next: number) {
    setStage(next);
    // Keep the top of the module in view on small screens.
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function togglePick(id: string) {
    setPicks((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function restart() {
    setAreaId(null);
    setHypothesisId(null);
    setPicks([]);
    go(0);
  }

  return (
    <div ref={topRef} className="panel scroll-mt-20 overflow-hidden">
      {/* Header + methodology rail */}
      <div className="flex flex-col gap-4 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-3">
          <span className="label label-lime">Interactive</span>
          <span className="label">{String(stage + 1).padStart(2, "0")} / 04</span>
        </div>
        <ol className="flex flex-wrap gap-x-1 gap-y-1" aria-label="Transformation method">
          {METHOD.map((step, i) => {
            const active = i < METHOD_PROGRESS[stage];
            return (
              <li key={step} className="flex items-center gap-1">
                <span
                  className={`font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-colors duration-300 ${
                    active ? "text-lime" : "text-dim"
                  }`}
                >
                  {step}
                </span>
                {i < METHOD.length - 1 && <span className="text-dim">→</span>}
              </li>
            );
          })}
        </ol>
      </div>

      <div key={stage} className="fade-swap px-5 py-7 sm:px-7 sm:py-9" aria-live="polite">
        {stage === 0 && (
          <div>
            <h3 className="display text-4xl sm:text-6xl">Fix this business.</h3>
            <p className="mt-4 max-w-2xl text-muted">
              You&apos;ve inherited <span className="text-ink">{company.name}</span>. {company.blurb}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
              {METRIC_KEYS.map((key) => (
                <div key={key} className="bg-surface p-4 sm:p-5">
                  <dt className="label">{metricMeta[key].label}</dt>
                  <dd className="mt-2 font-display text-3xl font-semibold tracking-tight text-signal sm:text-4xl">
                    {metricMeta[key].format(company.start[key])}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 grid gap-x-8 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
              {company.symptoms.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>

            <p className="label mt-10">Where would you investigate first?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {areas.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={areaId === a.id}
                  onClick={() => setAreaId(a.id)}
                  className="option flex items-center gap-4 px-4 py-3.5"
                >
                  <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{a.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-dim">Illustrative simulation. The company and figures are fictional.</p>
              <button type="button" className="btn btn-lime" disabled={!areaId} onClick={() => go(1)}>
                Investigate this area <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 1 && area && (
          <div>
            <p className="label label-lime">Diagnose · {area.title}</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{area.question}</h3>

            <ol className="mt-6 space-y-2.5">
              {area.evidence.map((e, i) => (
                <li key={e} className="panel-2 flex gap-4 px-4 py-3.5">
                  <span className="font-mono text-xs leading-6 text-lime">E{i + 1}</span>
                  <span className="text-sm leading-6 sm:text-[0.9375rem]">{e}</span>
                </li>
              ))}
            </ol>

            <p className="label mt-9">What&apos;s the root cause?</p>
            <div className="mt-3 space-y-2.5">
              {area.hypotheses.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={hypothesisId === h.id}
                  onClick={() => setHypothesisId(h.id)}
                  className="option px-4 py-3.5 text-sm leading-6 sm:text-[0.9375rem]"
                >
                  {h.text}
                </button>
              ))}
            </div>

            {hypothesis && (
              <div
                key={hypothesis.id}
                className={`fade-swap mt-4 rounded-md border px-4 py-3.5 text-sm leading-6 ${
                  hypothesis.root ? "border-lime/40 bg-lime-soft" : "border-signal/40 bg-signal-soft"
                }`}
              >
                <span className={`label mr-2 ${hypothesis.root ? "label-lime" : "!text-signal"}`}>
                  {hypothesis.root ? "Root cause" : "Symptom"}
                </span>
                {hypothesis.feedback}
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-between gap-3">
              <button type="button" className="btn btn-ghost" onClick={() => go(0)}>
                ← Back
              </button>
              <button type="button" className="btn btn-lime" disabled={!hypothesis} onClick={() => go(2)}>
                {hypothesis?.root ? "Plan the fix" : "Plan anyway"} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div>
            <p className="label label-lime">Strategise · Design</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              You have ${constraints.budget}k, {constraints.people} people and {constraints.days} days.
            </h3>
            <p className="mt-2 text-sm text-muted">Pick your moves. Each one needs budget and someone to own it.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Budget label="Budget" used={spent.cost} max={constraints.budget} unit="k" prefix="$" />
              <Budget label="People" used={spent.people} max={constraints.people} />
            </div>

            <div className="mt-6 grid gap-2.5 md:grid-cols-2">
              {interventions.map((item) => {
                const picked = picks.includes(item.id);
                const fits =
                  spent.cost + item.cost <= constraints.budget && spent.people + item.people <= constraints.people;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={picked}
                    disabled={!picked && !fits}
                    onClick={() => togglePick(item.id)}
                    className="option flex flex-col gap-1.5 px-4 py-4 disabled:opacity-40"
                  >
                    <span className="flex w-full items-baseline justify-between gap-3">
                      <span className="font-medium">{item.title}</span>
                      <span className="shrink-0 font-mono text-xs text-muted">
                        ${item.cost}k · {item.people}p
                      </span>
                    </span>
                    <span className="text-sm leading-relaxed text-muted">{item.detail}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap justify-between gap-3">
              <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
                ← Back
              </button>
              <button type="button" className="btn btn-lime" disabled={picks.length === 0} onClick={() => go(3)}>
                Run 90 days <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 3 && outcome && (
          <div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="label label-lime">Transform · Optimise · Day 90</p>
                <h3 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {outcome.verdict}
                </h3>
              </div>
              <div className="shrink-0 text-left lg:text-right">
                <p className="label">Transformation score</p>
                <p className="font-display text-6xl font-semibold tracking-tight text-lime">{outcome.score}</p>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
              {METRIC_KEYS.map((key) => {
                const meta = metricMeta[key];
                const before = company.start[key];
                const after = outcome.after[key];
                const improved = meta.better === "up" ? after > before : after < before;
                const worse = meta.better === "up" ? after < before : after > before;
                return (
                  <div key={key} className="bg-surface p-4 sm:p-5">
                    <dt className="label">{meta.label}</dt>
                    <dd className="mt-2">
                      <span className="block font-mono text-xs text-dim line-through">{meta.format(before)}</span>
                      <span
                        className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${
                          improved ? "text-lime" : worse ? "text-signal" : "text-ink"
                        }`}
                      >
                        {meta.format(after)}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="label">What happened</p>
                <ul className="mt-3 space-y-2.5">
                  {outcome.notes.map((n) => (
                    <li key={n.id} className="panel-2 px-4 py-3.5">
                      <p className="flex items-center gap-2.5 font-medium">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            n.tone === "good" ? "bg-lime" : n.tone === "warn" ? "bg-amber-300" : "bg-signal"
                          }`}
                          aria-hidden="true"
                        />
                        {n.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{n.lesson}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="label">Roadmap</p>
                  <ol className="mt-3 space-y-2">
                    {(["Design", "Transform", "Optimise"] as const).map((phase, i) => (
                      <li key={phase} className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
                        <span className="font-mono text-xs leading-6 text-lime">
                          D{i * 30}–{(i + 1) * 30}
                        </span>
                        <span className="leading-6">
                          <span className="text-muted">{phase}: </span>
                          {outcome.roadmap[phase].join(", ") || "—"}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="label">KPIs to track</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {outcome.kpis.map((k) => (
                      <li key={k} className="flex gap-2.5">
                        <span className="text-lime">↳</span>
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-md border border-lime/30 bg-lime-soft px-5 py-4">
              <p className="label label-lime">How I&apos;d play it</p>
              <p className="mt-2 text-sm leading-relaxed sm:text-[0.9375rem]">
                <span className="font-medium">
                  {recommended.picks.map((id) => interventions.find((i) => i.id === id)?.title).join(" → ")}.
                </span>{" "}
                <span className="text-muted">{recommended.reasoning}</span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap justify-between gap-3">
              <button type="button" className="btn btn-ghost" onClick={() => go(2)}>
                ← Change the plan
              </button>
              <button type="button" className="btn btn-lime" onClick={restart}>
                Start over <span className="arrow">↺</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Budget({
  label,
  used,
  max,
  unit = "",
  prefix = "",
}: {
  label: string;
  used: number;
  max: number;
  unit?: string;
  prefix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-xs">
          <span className={used >= max ? "text-lime" : "text-ink"}>
            {prefix}
            {used}
            {unit}
          </span>
          <span className="text-dim">
            {" "}
            / {prefix}
            {max}
            {unit}
          </span>
        </span>
      </div>
      <div className="meter mt-2">
        <span style={{ width: `${Math.min(100, (used / max) * 100)}%` }} />
      </div>
    </div>
  );
}
