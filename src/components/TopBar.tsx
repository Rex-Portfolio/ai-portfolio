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

        <nav aria-label="Sections" className="flex items-center gap-5 sm:gap-7">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-150 hover:text-lime ${
                i === 1 || i === 2 ? "hidden md:inline" : ""
              }`}
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
      </div>
    </header>
  );
}
