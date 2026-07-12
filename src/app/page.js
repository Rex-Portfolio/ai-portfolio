import AnimatedSection, { AnimatedReveal } from "@/components/AnimatedSection";
import DiagnosticForm from "@/components/DiagnosticForm";
import StickyNav from "@/components/StickyNav";

const LINKEDIN_URL = "https://linkedin.com/in/rexmondlim";
const RESUME_URL = "/Rexmond%20Lim%20-%20Resume.pdf";
const EMAIL = "rexmondlim7@gmail.com";

const stats = [
  {
    label: "Reporting turnaround",
    before: "1 week",
    after: "10 mins",
  },
  {
    label: "Customer onboarding",
    before: "Half a day",
    after: "90 secs",
  },
  {
    label: "Credit underwriting",
    before: "Half a day",
    after: "2 mins",
  },
  {
    label: "Operational cost",
    before: "Baseline",
    after: "96% lower",
  },
];

const services = [
  {
    title: "Business Transformation",
    description:
      "Map current workflows, find bottlenecks, and design roadmaps that teams can actually follow.",
  },
  {
    title: "AI Automation",
    description:
      "Build LLM-powered tools that cut manual work without losing transparency, explainability, or human oversight.",
  },
  {
    title: "Full Stack Build",
    description:
      "Ship production web apps from API design and data pipelines through to the front end.",
  },
];

const projects = [
  {
    title: "ChopNow Platform, Full Stack Build",
    description:
      "Built all three portals (Admin, Merchant, Customer) from scratch for a live BNPL platform serving Singapore.",
    tools: "React.js, Vercel, AWS, NeonDB, Singpass/MyInfo API",
    result:
      "Customer onboarding cut from half a day to under 90 seconds. Merchant setup from 4 hours to under 30 minutes.",
  },
  {
    title: "AI Customer Support Automation",
    description:
      "Deployed a 24/7 OpenAI-powered WhatsApp servicing workflow, replacing manual agent operations entirely.",
    tools: "OpenAI API, WhatsApp Business API, N8N",
    result:
      "Operational costs cut by 96%, removing the need for extra hires at the same volume.",
  },
  {
    title: "Collections & Repayment Automation",
    description:
      "Replaced half-day daily manual reconciliation with automated repayment tracking tied to loan schedules.",
    tools: "Workato, QR payment infrastructure, LMS integration",
    result:
      "Freed 2.5 days of manual ops effort per week, with zero reconciliation mismatches since deployment.",
  },
  {
    title: "Credit Scoring & Underwriting Engine",
    description:
      "Designed and built automated credit scoring logic replacing half-day manual underwriting per application.",
    tools: "Singpass/MyInfo API, proprietary LMS, React.js",
    result: "Underwriting time cut from half a day to under 2 minutes per application.",
  },
  {
    title: "Group Financial Reporting Automation",
    description:
      "Automated group-wide financial statement consolidation, removing manual Excel dependency across the group.",
    tools: "JavaScript, Macros, Workato",
    result:
      "Reporting turnaround cut from 1 week to under 10 minutes, enabling real-time management decisions.",
  },
  {
    title: "Group-wide Business Process Re-engineering",
    description:
      "Led full BPR across all departments, redesigning workflows to cut manual touchpoints and improve throughput.",
    tools: "Workato, AI Agents, Google Suite",
    result:
      "Reduced manual intervention across finance, ops, onboarding, and reporting group-wide.",
  },
];

/**
 * @param {{ label: string; title: string; description?: string; dark?: boolean }} props
 */
function SectionHeading({ label, title, description, supporting, dark = false }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className={`section-label ${dark ? "section-label-dark" : ""}`}>{label}</p>
      <h2
        className={`font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight ${
          dark ? "text-dark-text" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-dark-muted" : "text-muted"
          }`}
        >
          {description}
        </p>
      )}
      {supporting && (
        <p
          className={`mt-3 text-sm leading-relaxed ${
            dark ? "text-dark-muted/70" : "text-muted/80"
          }`}
        >
          {supporting}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <StickyNav />

      {/* Hero */}
      <section className="hero-mesh relative flex min-h-[82vh] flex-col justify-center text-dark-text sm:min-h-[88vh]">
        <div className="section-inner hero-inner w-full text-center sm:text-left">
          <h1 className="font-heading text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-[5.25rem] lg:leading-[1.05]">
            Rexmond Lim
          </h1>
          <p className="section-label section-label-dark mt-4 sm:mt-5">
            AI & Business Transformation
          </p>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-dark-muted sm:mx-0 sm:mt-6 sm:text-xl">
            I bridge strategy and hands-on AI delivery, helping teams replace manual
            workflows with systems that deliver measurable results.
          </p>
          <p className="mx-auto mt-4 max-w-md text-base italic leading-relaxed text-dark-muted/75 sm:mx-0 sm:max-w-lg">
            Somewhere along the way I stopped waiting for engineers and started building
            myself. In a team of three, you figure it out.
          </p>
          <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-2.5 sm:mx-0 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-dark w-full sm:w-auto"
            >
              LinkedIn
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-dark w-full sm:w-auto"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="section-inner stats-strip-inner !py-0">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stats-item">
                <p className="stats-label">{stat.label}</p>
                <div className="stats-contrast">
                  <span className="stats-before">{stat.before}</span>
                  <span className="stats-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="stats-after">{stat.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What I Do */}
      <AnimatedSection className="border-b border-border">
        <div className="section-inner">
          <SectionHeading label="Services" title="What I Do" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <AnimatedReveal key={service.title} delay={index * 0.06}>
                <div className="card-surface h-full p-7">
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                    {service.description}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Transformation Projects */}
      <AnimatedSection id="work" className="border-b border-border bg-surface/50">
        <div className="section-inner">
          <SectionHeading
            label="Portfolio"
            title="Transformation Projects"
            description="Selected work where strategy met execution. Each project delivered a measurable outcome."
          />
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <AnimatedReveal key={project.title} delay={index * 0.05} className="h-full">
                <article className="card-surface flex h-full flex-col p-7">
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-heading min-h-[2.75rem] text-lg font-semibold tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="section-label">Tools</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                      {project.tools}
                    </p>
                    <p className="mt-4 border-t border-border pt-4 text-sm font-medium leading-relaxed text-foreground">
                      {project.result}
                    </p>
                  </div>
                </article>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Live Demo */}
      <AnimatedSection id="demo" className="demo-mesh text-dark-text">
        <div className="section-inner">
          <SectionHeading
            dark
            label="Interactive"
            title="Live Demo: AI Transformation Diagnostic"
            description="Describe a real business workflow and get a structured assessment. Same approach I use with clients."
            supporting="Every assessment is generated transparently, with reasoning you can trace, not a black-box score."
          />
          <DiagnosticForm />
        </div>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection id="contact" className="border-t border-border">
        <div className="section-inner">
          <SectionHeading
            label="Get in touch"
            title="Contact"
            description="Open to roles in AI and business transformation across Singapore and the region. Always happy to connect."
          />
          <div className="grid gap-5 sm:grid-cols-2 sm:max-w-xl">
            <div className="card-surface p-7">
              <p className="section-label">Email</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-2 inline-block text-base text-foreground transition-colors duration-200 hover:text-accent"
              >
                {EMAIL}
              </a>
            </div>
            <div className="card-surface p-7">
              <p className="section-label">LinkedIn</p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-base text-foreground transition-colors duration-200 hover:text-accent"
              >
                linkedin.com/in/rexmondlim
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Rexmond Lim. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
