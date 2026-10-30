"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#lab", label: "Lab" },
  { href: "#playbook", label: "Playbook" },
  { href: "#human", label: "Human" },
  { href: "#contact", label: "Contact" },
];

function sgTime() {
  return new Intl.DateTimeFormat("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Singapore",
  }).format(new Date());
}

export default function TopBar() {
  const [time, setTime] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setTime(sgTime());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="wrap flex h-14 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 font-mono text-xs font-semibold tracking-[0.14em] text-lime">
          <span className="grid h-4 w-4 place-items-center border border-lime" aria-hidden="true">
            <span className="h-1.5 w-1.5 bg-lime" />
          </span>
          REXMOND / SYSTEMS
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-150 hover:text-lime"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <span className="flex items-center gap-2">
            <span className="dot-live" aria-hidden="true" />
            <span className="label text-ink">Open to roles</span>
          </span>
          <span className="label w-[5.5rem] text-right tabular-nums">{time ? `${time} SGT` : ""}</span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 items-center gap-2 px-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted md:hidden"
        >
          {open ? "Close" : "Menu"}
          <span className="flex w-4 flex-col gap-[3px]" aria-hidden="true">
            <span className={`h-px bg-current transition-transform ${open ? "translate-y-[2px] rotate-45" : ""}`} />
            <span className={`h-px bg-current transition-transform ${open ? "-translate-y-[2px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Sections" className="border-t border-line md:hidden">
          <ul className="wrap divide-y divide-line">
            {links.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3.5 font-display text-lg font-semibold tracking-tight"
                >
                  {link.label}
                  <span className="font-mono text-xs text-dim">{String(i + 2).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="wrap flex items-center justify-between border-t border-line py-3">
            <span className="flex items-center gap-2">
              <span className="dot-live" aria-hidden="true" />
              <span className="label text-ink">Open to roles</span>
            </span>
            <span className="label tabular-nums">{time ? `${time} SGT` : ""}</span>
          </div>
        </nav>
      )}
    </header>
  );
}
