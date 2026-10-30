import AnimatedSection, { AnimatedReveal } from "@/components/AnimatedSection";
import Beliefs from "@/components/Beliefs";
import DiagnosticForm from "@/components/DiagnosticForm";
import FixThisBusiness from "@/components/lab/FixThisBusiness";
import Playbook from "@/components/Playbook";
import SystemMap from "@/components/SystemMap";
import TopBar from "@/components/TopBar";
import { exploring, outcomes, principles } from "@/lib/content";
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "@/lib/site";

function SectionHead({
  index,
  name,
  title,
  description,
}: {
  index: string;
  name: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[14rem_1fr]">
      <p className="label label-lime pt-2">
        {index} / {name}
      </p>
      <div className="max-w-3xl">
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>
    </div>
  );
}

const contacts = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, external: false },
  { label: "LinkedIn", value: "in/rexmondlim", href: LINKEDIN_URL, external: true },
  { label: "Resume", value: "Download PDF", href: RESUME_URL, external: true },
];

export default function Home() {
  return (
    <div id="top" className="min-h-full">
      <TopBar />

      <main>
        {/* 01 / The Operator */}
        <section className="relative overflow-hidden">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-lime/[0.07] blur-3xl"
            aria-hidden="true"
          />

          <div className="wrap relative grid gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-24 lg:pb-24">
            <div>
              <p className="label label-lime">01 / The Operator · Singapore</p>
              <h1 className="display mt-6 text-[2.75rem] sm:text-7xl lg:text-[4rem] xl:text-[4.75rem]">
                Every business has a system.
                <span className="mt-2 block text-lime">Not every system works.</span>
              </h1>
              <p className="mt-8 max-w-xl font-display text-xl leading-snug tracking-tight sm:text-2xl">
                I don&apos;t just fix problems. I question why they exist in the first place.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                I work where business, operations and technology meet. I find what&apos;s broken, challenge the
                assumptions behind it, bring people with the change, and use technology (AI included) only where it
                earns its place.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#lab" className="btn btn-lime">
                  See how I think <span className="arrow">→</span>
                </a>
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Resume <span className="arrow">↗</span>
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-3 text-center text-sm text-muted transition-colors hover:text-lime sm:text-left"
                >
                  LinkedIn <span className="arrow">↗</span>
                </a>
              </div>
            </div>

            <SystemMap />
          </div>

          {/* Principles */}
          <div className="relative border-t border-line">
            <ol className="wrap grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
              {principles.map((p) => (
                <li key={p.index} className="group py-7 md:px-7 md:first:pl-0 md:last:pr-0">
                  <p className="font-mono text-xs text-dim transition-colors group-hover:text-lime">{p.index}</p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Outcomes strip */}
        <section aria-label="Measured outcomes" className="border-t border-line bg-surface">
          <div className="wrap py-8 sm:py-10">
            <p className="label">Measured, not claimed</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
              {outcomes.map((o) => (
                <div key={o.label}>
                  <dt className="label min-h-[2.4em] !text-[0.6875rem] leading-tight">{o.label}</dt>
                  <dd className="mt-2">
                    <span className="block font-mono text-xs text-dim line-through">{o.before}</span>
                    <span className="font-display text-3xl font-semibold tracking-tight text-lime sm:text-4xl">
                      {o.after}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 02 / The Diagnostic Lab */}
        <AnimatedSection id="lab" className="section">
          <div className="wrap">
            <SectionHead
              index="02"
              name="The Diagnostic Lab"
              title={
                <>
                  Don&apos;t take my word for it.
                  <br />
                  <span className="text-lime">Diagnose something.</span>
                </>
              }
              description="A struggling company, a tight budget, sceptical people and 90 days. Find the real problem, make your moves, land the change, and see what happens. This is how I approach every engagement."
            />
            <FixThisBusiness />

            <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-[14rem_1fr]">
              <p className="label pt-2">02.b / Bring your own</p>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Got a real problem? Run it through the diagnostic.
                </h3>
                <p className="mt-3 max-w-2xl text-muted">
                  AI is one tool in the kit, used when it earns its place. Here it earns it: describe a business
                  problem and get a structured assessment, with the reasoning shown step by step.
                </p>
                <div className="mt-8">
                  <DiagnosticForm />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 03 / The Transformation Playbook */}
        <AnimatedSection id="playbook" className="section">
          <div className="wrap">
            <SectionHead
              index="03"
              name="The Playbook"
              title="Problems I've actually fixed."
              description="Real projects, real numbers. What wasn't working, what I did about it, how the people came with it, and what changed."
            />
            <Playbook />
          </div>
        </AnimatedSection>

        {/* 04 / The Human Behind the Systems */}
        <AnimatedSection id="human" className="section">
          <div className="wrap">
            <SectionHead index="04" name="The Human" title="The person behind the systems." />

            <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
              <div className="hidden lg:block" />
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-5 text-[1.0625rem] leading-relaxed text-muted">
                  <p className="font-display text-2xl leading-snug tracking-tight text-ink sm:text-[1.75rem]">
                    I learned to build because I had to. In a small team, you don&apos;t wait for engineering
                    bandwidth. You figure it out.
                  </p>
                  <p>
                    I&apos;ve built a lending operation&apos;s platforms from scratch, automated the work nobody wanted
                    to do, and redesigned how whole departments run. Most of it happened with limited resources, which
                    turned out to be the best teacher: when you can&apos;t throw money or headcount at a problem, you
                    have to fix the actual problem.
                  </p>
                  <p>
                    I&apos;m happiest with a hard, messy operational problem and the freedom to take it apart. I care
                    about efficiency, but mostly I care about understanding why something is broken before anyone starts
                    buying software to fix it.
                  </p>
                </div>

                <AnimatedReveal className="panel self-start">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <span className="label">Currently exploring</span>
                    <span className="flex items-center gap-2">
                      <span className="dot-live" aria-hidden="true" />
                      <span className="label label-lime">Live journal</span>
                    </span>
                  </div>
                  <ul className="divide-y divide-line">
                    {exploring.map((item, i) => (
                      <li key={item} className="flex items-center gap-4 px-5 py-3.5">
                        <span className="font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[0.9375rem]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedReveal>
              </div>
            </div>

            <div className="mt-16 lg:mt-20">
              <Beliefs />
            </div>
          </div>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection id="contact" className="section relative overflow-hidden">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="wrap relative">
            <p className="label label-lime">05 / Contact</p>
            <h2 className="display mt-6 text-[2.5rem] sm:text-6xl xl:text-7xl">
              Got a system that doesn&apos;t work?
              <span className="mt-2 block text-lime">Let&apos;s take it apart.</span>
            </h2>
            <p className="mt-6 max-w-xl text-muted">
              Open to roles in AI and business transformation across Singapore and the region. Always happy to talk
              shop with operators and founders.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-4 bg-surface px-5 py-5 transition-colors hover:bg-surface-2"
                >
                  <span className="min-w-0">
                    <span className="label block">{c.label}</span>
                    <span className="mt-1 block truncate text-[0.9375rem] transition-colors group-hover:text-lime">
                      {c.value}
                    </span>
                  </span>
                  <span className="arrow text-muted group-hover:text-lime">{c.external ? "↗" : "→"}</span>
                </a>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="border-t border-line">
        <div className="wrap flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="label label-lime">Business / Technology / Operations</span>
          <span className="label hidden md:inline">Singapore</span>
          <span className="label">© {new Date().getFullYear()} Rexmond Lim</span>
        </div>
      </footer>
    </div>
  );
}
