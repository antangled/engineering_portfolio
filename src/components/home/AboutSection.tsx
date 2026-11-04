import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import {
  profile,
  education,
  aboutParagraphs,
  experience,
  leadership,
  awards,
  contact,
  type ExperienceEntry,
} from "../../data/profile";
import { withBase } from "../../lib/withBase";
import { SocialLinks } from "./SocialLinks";
import { CopyEmail } from "../CopyEmail";
import { SheetTicks } from "./SheetTicks";
import { cn } from "../../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Section heading inside the sheet: a real heading with a quiet count, not a tracked eyebrow. */
function SheetHeading({ children, meta }: { children: React.ReactNode; meta?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">{children}</h3>
      {meta && <span className="font-mono text-xs text-ink-500">{meta}</span>}
    </div>
  );
}

/** One stop on the experience timeline. The current role's node is filled orange and pulses. */
function TimelineItem({ exp, current }: { exp: ExperienceEntry; current?: boolean }) {
  // Phones show org, dates and role; the detail opens on tap. From sm up it's always shown.
  const [open, setOpen] = useState(false);
  return (
    <li className="relative pb-9 pl-9 last:pb-0">
      <span className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center" aria-hidden>
        {current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/40" />}
        <span
          className={cn(
            "relative h-[15px] w-[15px] rounded-full border-2",
            current ? "border-signal bg-signal" : "border-ink-400 bg-surface"
          )}
        />
      </span>

      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6">
        <p className="font-medium text-ink-900">
          {exp.org}
          <span className="mt-0.5 block text-sm font-medium text-signal-ink sm:ml-2 sm:mt-0 sm:inline">{exp.role}</span>
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-500 sm:text-right">
          {exp.period}
          {current && <span className="ml-2 rounded-full bg-signal/10 px-2 py-0.5 text-signal-ink">Now</span>}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-2 inline-flex items-center gap-1 py-1 font-mono text-xs uppercase tracking-wider text-ink-500 sm:hidden"
      >
        {open ? "Hide details" : "Details"}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <div className={open ? "block" : "hidden sm:block"}>
        <p className="mt-2 max-w-[68ch] text-pretty text-sm leading-relaxed text-ink-700">{exp.blurb}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {exp.tags?.map((t) => (
            <span key={t} className="rounded-md bg-ink-900/[0.05] px-2 py-1 font-mono text-xs text-ink-700">
              {t}
            </span>
          ))}
          {exp.slug && (
            <Link
              to={`/projects/${exp.slug}`}
              data-cursor="link"
              className="group ml-1 inline-flex items-center gap-1 py-1 text-sm font-medium text-ink-900 underline decoration-ink-900/20 underline-offset-4 transition-colors hover:text-signal-ink hover:decoration-signal"
            >
              See the project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-2.5">
      <dt className="pt-px font-mono text-xs uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-700">{children}</dd>
    </div>
  );
}

export function AboutSection() {
  const [lead, ...rest] = aboutParagraphs;
  return (
    <section id="about" className="relative mx-auto max-w-[1400px] px-[5vw] py-24 lg:py-32">
      {/* Soft depth behind the sheet: a warm signal wash top-left, a cool one bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 30% at 10% 30%, rgba(255,122,69,0.09), transparent 70%), radial-gradient(40% 30% at 92% 80%, rgba(59,63,70,0.07), transparent 70%)",
        }}
      />

      <div className="relative">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[0.98] tracking-tight text-ink-900">
            Built to ship — from the gearbox to the field.
          </h2>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-ink-900/10 bg-surface px-4 py-2 text-sm text-ink-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </p>
        </Reveal>

        {/* In the room: pitching Envoy */}
        <Reveal className="mt-10">
          <figure className="relative overflow-hidden rounded-4xl bg-ink-900/5 shadow-[0_30px_80px_-50px_rgba(21,23,27,0.45)]">
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
                Pitching <span className="font-medium text-ink-900">Envoy</span> at Berkeley SCET's Innovation
                Intelligence Hackathon — it won Best Enterprise Reinvention.
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {/* The datasheet: one white sheet on the blueprint grid, with drawing-style corner marks */}
        <Reveal className="mt-8">
          <div className="relative rounded-[2rem] border border-line bg-surface shadow-[0_1px_0_rgba(21,23,27,0.04),0_40px_90px_-60px_rgba(21,23,27,0.35)]">
            <SheetTicks />
            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,2fr)]">
              {/* Identity card (sticky on desktop) */}
              <aside className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="lg:sticky lg:top-28">
                  <div className="flex items-center gap-4">
                    <img
                      src={withBase("/images/avatar.jpg")}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-16 w-16 rounded-2xl object-cover ring-1 ring-ink-900/10"
                    />
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{profile.name}</h3>
                      <p className="mt-0.5 text-sm text-ink-500">{profile.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-pretty leading-relaxed text-ink-700">{profile.bio}</p>

                  <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper/70 px-4">
                    <Fact label="Degree">
                      {education.degree} · {education.minor}
                    </Fact>
                    <Fact label="School">
                      {education.school} · {education.graduation}
                    </Fact>
                    <Fact label="GPA">
                      <span className="font-mono text-ink-900">{education.gpa}</span>
                    </Fact>
                    <Fact label="Honors">{education.honors}</Fact>
                    <Fact label="Courses">{education.coursework}</Fact>
                  </dl>

                  <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {profile.location}
                  </p>

                  <SocialLinks className="mt-5" />

                  <div className="mt-5 space-y-1 font-mono text-xs text-ink-500">
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
                </div>
              </aside>

              {/* Story, then the record */}
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="max-w-[62ch] text-pretty text-lg leading-relaxed text-ink-900 sm:text-xl">{lead}</p>
                <div className="mt-5 max-w-[68ch] space-y-4">
                  {rest.map((p, i) => (
                    <p key={i} className="text-pretty leading-relaxed text-ink-700">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-12">
                  <SheetHeading meta={`${experience.length} roles`}>Experience</SheetHeading>
                  <ol className="relative mt-7 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line">
                    {experience.map((exp) => (
                      <TimelineItem key={exp.org} exp={exp} current={/present/i.test(exp.period)} />
                    ))}
                  </ol>
                </div>

                <div className="mt-12">
                  <SheetHeading>Leadership</SheetHeading>
                  <ol className="mt-7">
                    <TimelineItem exp={leadership} />
                  </ol>
                </div>

                <div className="mt-12">
                  <SheetHeading meta={`${awards.length}`}>Recognition</SheetHeading>
                  <ul className="divide-y divide-line">
                    {awards.map((a) => (
                      <li
                        key={a.text}
                        className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 py-3.5 sm:grid-cols-[7.5rem_1fr_auto]"
                      >
                        <span className="font-mono text-xs uppercase tracking-wider text-signal-ink">{a.kind}</span>
                        <span className="col-span-2 row-start-2 text-pretty text-sm leading-relaxed text-ink-900 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                          {a.text}
                        </span>
                        <span className="text-right font-mono text-xs text-ink-500 sm:col-start-3 sm:row-start-1">{a.year ?? ""}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
