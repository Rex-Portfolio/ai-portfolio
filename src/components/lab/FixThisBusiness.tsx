"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADOPTION_STICKS,
  CHANGE_CAPACITY,
  type Scenario,
  type Verdict,
  adoption,
  formatMetric,
  isBetter,
  isWorse,
  simulate,
  stances,
} from "@/lib/lab/engine";
import { scenarios } from "@/lib/lab/scenarios";

const METHOD = ["Assess", "Diagnose", "Strategise", "Design", "Adopt", "Transform", "Optimise"];
// How far along the methodology each stage lights up.
const METHOD_PROGRESS = [1, 2, 4, 5, 7];
const STAGE_NAMES = ["Assess", "Diagnose", "Strategise", "Adopt", "Results"];

const VERDICT_STYLE: Record<Verdict, { label: string; box: string; text: string }> = {
  root: { label: "Root cause", box: "border-lime/40 bg-lime-soft", text: "label-lime" },
  partial: { label: "Part of it", box: "border-amber-300/40 bg-amber-300/10", text: "!text-amber-300" },
  symptom: { label: "Symptom", box: "border-signal/40 bg-signal-soft", text: "!text-signal" },
};

function randomOther(currentId?: string): Scenario {
  const pool = scenarios.filter((s) => s.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function FixThisBusiness() {
  const [scenario, setScenario] = useState<Scenario>(scenarios[0]);
  const [stage, setStage] = useState(0);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [hypothesisId, setHypothesisId] = useState<string | null>(null);
  const [picks, setPicks] = useState<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // A different company each visit. Picked after mount so server and client markup match.
  useEffect(() => {
    const pick = () => setScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
    pick();
  }, []);

  const area = scenario.areas.find((a) => a.id === areaId) ?? null;
  const hypothesis = area?.hypotheses.find((h) => h.id === hypothesisId) ?? null;
  const { budget, people, days } = scenario.constraints;
  const spent = scenario.interventions
    .filter((i) => picks.includes(i.id))
    .reduce((acc, i) => ({ cost: acc.cost + i.cost, people: acc.people + i.people }), { cost: 0, people: 0 });
  const stance = stances(scenario, moves);
  const adopted = adoption(scenario, moves);
  const outcome = stage === 4 ? simulate(scenario, picks, hypothesis?.verdict ?? null, moves) : null;
  const title = (id: string) => scenario.interventions.find((i) => i.id === id)?.title ?? id;

  function go(next: number) {
    setStage(next);
    // Keep the top of the module in view on small screens.
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const toggle = (setter: typeof setPicks) => (id: string) =>
    setter((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  const togglePick = toggle(setPicks);
  const toggleMove = toggle(setMoves);

  function restart(next: Scenario) {
    setScenario(next);
    setAreaId(null);
    setHypothesisId(null);
    setPicks([]);
    setMoves([]);
    go(0);
  }

  return (
    <div ref={topRef} className="panel scroll-mt-20 overflow-hidden">
      {/* Header + methodology rail */}
      <div className="flex flex-col gap-4 border-b border-line px-4 py-3.5 sm:flex-row sm:px-7 sm:py-4 sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <span className="label label-lime">{scenario.name}</span>
          <span className="label">
            {String(stage + 1).padStart(2, "0")} / 05<span className="text-ink sm:hidden">{` · ${STAGE_NAMES[stage]}`}</span>
          </span>
        </div>
        <ol className="hidden flex-wrap gap-x-1 gap-y-1 sm:flex" aria-label="Transformation method">
          {METHOD.map((step, i) => (
            <li key={step} className="flex items-center gap-1">
              <span
                className={`font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-colors duration-300 ${
                  i < METHOD_PROGRESS[stage] ? "text-lime" : "text-dim"
                }`}
              >
                {step}
              </span>
              {i < METHOD.length - 1 && <span className="text-dim">→</span>}
            </li>
          ))}
        </ol>
      </div>

      <div key={`${scenario.id}-${stage}`} className="fade-swap px-4 py-6 sm:px-7 sm:py-9" aria-live="polite">
        {stage === 0 && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h3 className="display text-4xl sm:text-6xl">Fix this business.</h3>
              <button
                type="button"
                className="label -my-1 inline-flex min-h-10 items-center transition-colors hover:text-lime sm:pt-2"
                onClick={() => restart(randomOther(scenario.id))}
              >
                Different company ↻
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-muted">
              You&apos;ve inherited <span className="text-ink">{scenario.name}</span>, {scenario.blurb}
            </p>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {scenario.metrics.map((m) => (
                <div key={m.key} className="grid grid-cols-[1fr_auto] gap-x-4 bg-surface p-4 sm:block sm:p-5">
                  <dt className="label">{m.label}</dt>
                  <dd className="col-start-2 row-span-2 row-start-1 self-center font-display text-3xl font-semibold tracking-tight text-signal sm:mt-2 sm:text-4xl">
                    {formatMetric(m, m.start)}
                  </dd>
                  <dd className="mt-1.5 text-xs leading-relaxed text-dim sm:mt-2">{m.hint}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 grid gap-x-8 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
              {scenario.symptoms.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span className="mt-[0.55rem] h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>

            <p className="label mt-10">Where would you investigate first?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {scenario.areas.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={areaId === a.id}
                  onClick={() => {
                    setAreaId(a.id);
                    setHypothesisId(null);
                  }}
                  className="option flex items-center gap-4 px-4 py-3.5"
                >
                  <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{a.title}</span>
                </button>
              ))}
            </div>

            <div className="actions mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-dim">
                Illustrative simulation with fictional companies and figures. There&apos;s more than one good answer.
              </p>
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

            <p className="label mt-9">What&apos;s really going on?</p>
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
                className={`fade-swap mt-4 rounded-md border px-4 py-3.5 text-sm leading-6 ${VERDICT_STYLE[hypothesis.verdict].box}`}
              >
                <span className={`label mr-2 ${VERDICT_STYLE[hypothesis.verdict].text}`}>
                  {VERDICT_STYLE[hypothesis.verdict].label}
                </span>
                {hypothesis.feedback}
              </div>
            )}

            <div className="actions mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => go(0)}>
                ← Back
              </button>
              <button type="button" className="btn btn-lime" disabled={!hypothesis} onClick={() => go(2)}>
                {hypothesis?.verdict === "symptom" ? "Plan anyway" : "Plan the fix"} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div>
            <p className="label label-lime">Strategise · Design</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {`You have $${budget}k, ${people} people and ${days} days.`}
            </h3>
            <p className="mt-2 text-sm text-muted">
              Pick your moves. Each one needs budget and someone to own it. Some only work on top of others.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Budget label="Budget" used={spent.cost} max={budget} unit="k" prefix="$" />
              <Budget label="People" used={spent.people} max={people} />
            </div>

            <div className="mt-6 grid gap-2.5 md:grid-cols-2">
              {scenario.interventions.map((item) => {
                const picked = picks.includes(item.id);
                const fits = spent.cost + item.cost <= budget && spent.people + item.people <= people;
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

            <div className="actions mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
                ← Back
              </button>
              <button type="button" className="btn btn-lime" disabled={picks.length === 0} onClick={() => go(3)}>
                Plan the rollout <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div>
            <p className="label label-lime">Adopt · Land the change</p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Your plan is ready. Your people aren&apos;t.
            </h3>
            <p className="mt-2 text-sm text-muted">
              {`You have the capacity for ${CHANGE_CAPACITY} change moves. Choose how you'll bring people with you.`}
            </p>

            <ul className="mt-6 grid gap-2.5 md:grid-cols-3">
              {scenario.stakeholders.map((person) => {
                const level = stance[person.id];
                return (
                  <li
                    key={person.id}
                    className={`rounded-md border px-4 py-4 transition-colors duration-300 ${
                      level === 2
                        ? "border-lime/50 bg-lime-soft"
                        : level === 1
                          ? "border-line-strong bg-surface-2"
                          : "border-signal/40 bg-signal-soft"
                    }`}
                  >
                    <p className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                      <span className="font-medium">{person.name}</span>
                      <span className="label !text-[0.6875rem] sm:text-right">{person.role}</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">&ldquo;{person.quote}&rdquo;</p>
                    <p
                      className={`label mt-3 flex items-center gap-2 ${
                        level === 2 ? "label-lime" : level === 1 ? "" : "!text-signal"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          level === 2 ? "bg-lime" : level === 1 ? "bg-muted" : "bg-signal"
                        }`}
                        aria-hidden="true"
                      />
                      {person.states[level]}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 grid gap-2.5 md:grid-cols-2">
              {scenario.changeMoves.map((move) => {
                const picked = moves.includes(move.id);
                return (
                  <button
                    key={move.id}
                    type="button"
                    aria-pressed={picked}
                    disabled={!picked && moves.length >= CHANGE_CAPACITY}
                    onClick={() => toggleMove(move.id)}
                    className="option flex flex-col gap-1 px-4 py-3.5 disabled:opacity-40"
                  >
                    <span className="font-medium leading-snug">{move.title}</span>
                    <span className="text-sm text-muted">{move.hint}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <span className="label">Adoption</span>
                <span className="font-mono text-xs">
                  <span className={adopted >= ADOPTION_STICKS ? "text-lime" : "text-ink"}>{adopted}%</span>
                  <span className="text-dim">{` · sticks at ${ADOPTION_STICKS}%`}</span>
                </span>
              </div>
              <div className="meter mt-2">
                <span style={{ width: `${adopted}%` }} className={adopted >= ADOPTION_STICKS ? "" : "!bg-signal"} />
              </div>
              <p className="mt-2 text-xs text-dim">A solution nobody uses delivers nothing. Results scale with adoption.</p>
            </div>

            <div className="actions mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => go(2)}>
                ← Back
              </button>
              <button type="button" className="btn btn-lime" onClick={() => go(4)}>
                {`Run ${days} days`} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {stage === 4 && outcome && (
          <div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="label label-lime">{`Transform · Optimise · Day ${days}`}</p>
                <h3 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {outcome.verdict}
                </h3>
              </div>
              <div className="flex shrink-0 gap-8 text-left lg:text-right">
                <div>
                  <p className="label">Adoption</p>
                  <p
                    className={`font-display text-5xl font-semibold tracking-tight sm:text-6xl ${
                      outcome.adoption >= ADOPTION_STICKS ? "text-ink" : "text-signal"
                    }`}
                  >
                    {outcome.adoption}%
                  </p>
                </div>
                <div>
                  <p className="label">Transformation score</p>
                  <p className="font-display text-5xl font-semibold tracking-tight text-lime sm:text-6xl">{outcome.score}</p>
                </div>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
              {scenario.metrics.map((m) => {
                const after = outcome.after[m.key];
                return (
                  <div key={m.key} className="bg-surface p-4 sm:p-5">
                    <dt className="label" title={m.hint}>
                      {m.label}
                    </dt>
                    <dd className="mt-2">
                      <span className="block font-mono text-xs text-dim line-through">{formatMetric(m, m.start)}</span>
                      <span
                        className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${
                          isBetter(m, after) ? "text-lime" : isWorse(m, after) ? "text-signal" : "text-ink"
                        }`}
                      >
                        {formatMetric(m, after)}
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
                  {outcome.changeNotes.map((n) => (
                    <li key={n.id} className="panel-2 border-dashed px-4 py-3.5">
                      <p className="flex items-center gap-2.5 font-medium">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${n.good ? "bg-lime" : "bg-signal"}`}
                          aria-hidden="true"
                        />
                        <span className="label !text-[0.6875rem]">Change</span>
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
                      <li key={phase} className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
                        <span className="font-mono text-xs leading-6 text-lime">{`Day ${i * 30}-${(i + 1) * 30}`}</span>
                        <span className="leading-6">
                          <span className="text-muted">{phase}: </span>
                          {outcome.roadmap[phase].join(", ") || "Nothing planned"}
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
                {outcome.alternatives.length > 0 && (
                  <div>
                    <p className="label">Also strong</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted">
                      {outcome.alternatives.map((plan) => (
                        <li key={plan.join()} className="flex gap-2.5">
                          <span className="text-lime">↳</span>
                          {plan.map(title).join(" + ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-md border border-lime/30 bg-lime-soft px-5 py-4">
              <p className="label label-lime">One way I&apos;d play it</p>
              <p className="mt-2 text-sm leading-relaxed sm:text-[0.9375rem]">
                <span className="font-medium">{scenario.recommended.picks.map(title).join(" → ")}.</span>{" "}
                <span className="text-muted">{scenario.recommended.reasoning}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed sm:text-[0.9375rem]">
                <span className="font-medium">
                  {scenario.recommended.moves
                    .map((id) => scenario.changeMoves.find((m) => m.id === id)?.title)
                    .join(" + ")}
                  .
                </span>{" "}
                <span className="text-muted">{scenario.recommended.change}</span>
              </p>
              <p className="mt-3 text-xs text-muted">
                There&apos;s no single right answer. If you&apos;d have done it differently, I&apos;d like to hear why.
              </p>
            </div>

            <div className="actions mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => go(3)}>
                ← Change the rollout
              </button>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" className="btn btn-ghost" onClick={() => restart(scenario)}>
                  Try again <span className="arrow">↺</span>
                </button>
                <button type="button" className="btn btn-lime" onClick={() => restart(randomOther(scenario.id))}>
                  New company <span className="arrow">→</span>
                </button>
              </div>
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
          <span className={used >= max ? "text-lime" : "text-ink"}>{`${prefix}${used}${unit}`}</span>
          <span className="text-dim">{` / ${prefix}${max}${unit}`}</span>
        </span>
      </div>
      <div className="meter mt-2">
        <span style={{ width: `${Math.min(100, (used / max) * 100)}%` }} />
      </div>
    </div>
  );
}
