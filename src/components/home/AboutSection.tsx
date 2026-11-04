import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { profile, education, aboutParagraphs, experience, leadership, awards, contact, type ExperienceEntry } from "../../data/profile";
import { withBase } from "../../lib/withBase";
import { SocialLinks } from "./SocialLinks";
import { CopyEmail } from "../CopyEmail";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
      <span className="h-px w-7 bg-ink-900/25" aria-hidden />
      {children}
    </h3>
  );
}

function ExperienceRow({ exp }: { exp: ExperienceEntry }) {
  // Phones show org, dates and role; the detail opens on tap. From sm up it's always shown.
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[1fr_2fr] sm:gap-8">
      <div>
        <p className="font-medium text-ink-900">{exp.org}</p>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-ink-500">{exp.period}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-signal-ink">{exp.role}</p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1 py-1 font-mono text-xs uppercase tracking-wider text-ink-500 sm:hidden"
        >
          {open ? "Hide details" : "Details"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        <div className={open ? "block" : "hidden sm:block"}>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-ink-700">{exp.blurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {exp.tags?.map((t) => (
            <span key={t} className="rounded-full bg-ink-900/[0.05] px-2.5 py-1 font-mono text-xs text-ink-500">
              {t}
            </span>
          ))}
          {exp.slug && (
            <Link
              to={`/projects/${exp.slug}`}
              data-cursor="link"
              className="group inline-flex items-center gap-1 rounded-full px-1 py-1 text-sm font-medium text-ink-900 underline decoration-ink-900/20 underline-offset-4 transition-colors hover:text-signal-ink hover:decoration-signal"
            >
              See the project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-2.5">
      <dt className="font-mono text-xs uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-700">{children}</dd>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-[5vw] py-24 lg:py-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-ink">About</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[0.98] tracking-tight text-ink-900">
            Built to ship — from the gearbox to the field.
          </h2>
        </div>
        <p className="inline-flex items-center gap-2.5 rounded-full border border-ink-900/10 bg-surface px-4 py-2 text-sm text-ink-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {profile.availability}
        </p>
      </Reveal>

      {/* In the room: pitching Envoy */}
      <Reveal className="mt-10">
        <figure className="relative overflow-hidden rounded-4xl bg-ink-900/5">
          <img
            src={withBase("/images/pitch-envoy.jpg")}
            alt="Adam Tang pitching Envoy with a microphone to a room of judges and students"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
            style={{ objectPosition: "28% 58%" }}
          />
          <figcaption className="absolute bottom-4 left-4 right-4 sm:right-auto">
            <span className="inline-block rounded-2xl bg-surface/95 px-4 py-2.5 text-sm text-ink-700 shadow-sm">
              Pitching <span className="font-medium text-ink-900">Envoy</span> at Berkeley SCET's Innovation Intelligence Hackathon — it won Best Enterprise Reinvention.
            </span>
          </figcaption>
        </figure>
      </Reveal>

      <div className="mt-14 lg:flex lg:gap-16">
        {/* Identity + quick facts (sticky on desktop) */}
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-[34%] lg:self-start">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{profile.name}</h3>
          <p className="mt-1 text-sm text-ink-500">{profile.role}</p>
          <p className="mt-5 text-pretty leading-relaxed text-ink-700">{profile.bio}</p>

          <dl className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
            <Fact label="Education">
              {education.degree}, {education.school} · {education.minor} · {education.graduation}
            </Fact>
            <Fact label="GPA">{education.gpa}</Fact>
            <Fact label="Honors">{education.honors}</Fact>
            <Fact label="Courses">{education.coursework}</Fact>
            <Fact label="Based in">{profile.location}</Fact>
          </dl>

          <SocialLinks className="mt-6" />

          <div className="mt-6 space-y-1 font-mono text-xs text-ink-500">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href={`mailto:${contact.email}`} data-cursor="link" className="block py-1 hover:text-signal-ink">
                {contact.email}
              </a>
              <CopyEmail tone="light" className="px-2.5 py-1" />
            </span>
            <a href={contact.phoneHref} data-cursor="link" className="block py-1 hover:text-signal-ink">
              {contact.phone}
            </a>
          </div>
        </aside>

        {/* Story, then the record */}
        <div className="mt-14 lg:mt-0 lg:w-[66%]">
          <div className="space-y-5">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-pretty text-lg leading-relaxed text-ink-700">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <SectionLabel>Experience</SectionLabel>
          </Reveal>
          <div className="mt-4 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {experience.map((exp, i) => (
              <Reveal key={exp.org} delay={i * 0.04}>
                <ExperienceRow exp={exp} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <SectionLabel>Leadership</SectionLabel>
            <div className="mt-4 border-y border-ink-900/10">
              <ExperienceRow exp={leadership} />
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <SectionLabel>Recognition</SectionLabel>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {awards.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-surface px-4 py-3 text-sm text-ink-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
