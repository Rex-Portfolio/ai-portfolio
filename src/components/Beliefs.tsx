"use client";

import { useState } from "react";
import { beliefs } from "@/lib/content";

/** "Things I strongly believe in": click a card for the unfiltered version. */
export default function Beliefs() {
  const [flipped, setFlipped] = useState<number[]>([]);
  const allFlipped = flipped.length === beliefs.length;

  function toggle(i: number) {
    setFlipped((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label label-lime">Things I strongly believe in</p>
        <button
          type="button"
          className="label -my-2 py-2 transition-colors hover:text-lime"
          onClick={() => setFlipped(allFlipped ? [] : beliefs.map((_, i) => i))}
        >
          {allFlipped ? "← Polite mode" : "Unfiltered mode →"}
        </button>
      </div>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {beliefs.map((b, i) => {
          const isFlipped = flipped.includes(i);
          return (
            <li key={b.polite} className={i === beliefs.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <button
                type="button"
                aria-pressed={isFlipped}
                aria-label={isFlipped ? b.blunt : b.polite}
                onClick={() => toggle(i)}
                className="flip block h-full w-full text-left sm:min-h-[11rem]"
              >
                <span className="flip-inner">
                  <span className="flip-face panel flex flex-col justify-between p-5" aria-hidden="true">
                    <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-3 font-display text-lg font-medium leading-snug tracking-tight sm:mt-4">{b.polite}</span>
                    <span className="label mt-4 !text-[0.6875rem]">Tap for the unfiltered version</span>
                  </span>
                  <span
                    className="flip-face flip-back flex flex-col justify-between rounded-md bg-lime p-5 text-bg"
                    aria-hidden="true"
                  >
                    <span className="font-mono text-xs font-semibold">UNFILTERED</span>
                    <span className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight">{b.blunt}</span>
                    <span className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">Tap to be polite</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
