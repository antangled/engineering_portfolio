import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, Globe, Plus, RotateCw } from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import CardFlip from "@/components/kokonutui/card-flip";
import { Mark, MarkerText } from "@/components/kokonutui/marker-text";
import {
  aboutShort,
  awards,
  contact,
  experience,
  factsLine,
  leadership,
  profile,
  recognition,
  type ExperienceEntry,
} from "@/data/profile";
import { DUR, EASE } from "@/lib/motion";
import { withBase } from "@/lib/withBase";
import { cn } from "@/lib/utils";
import { Github, Linkedin } from "../icons/Linkedin";
import { Reveal } from "../motion/Reveal";

const SIGNAL = "#ff5a1f";

/* ------------------------------------------------------------------ intro */

function Paragraph() {
  return (
    <MarkerText as="p" className="text-pretty text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink-900">
      {aboutShort.map((seg, i) =>
        seg.to ? (
          <Link
            key={i}
            to={`/projects/${seg.to}`}
            data-cursor="link"
            className="text-ink-900 decoration-signal/60 underline-offset-4 transition-colors hover:text-signal-ink hover:underline"
          >
            <Mark type="highlight" color={`${SIGNAL}38`}>
              {seg.text}
            </Mark>
          </Link>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </MarkerText>
  );
}

/** Copy the email with Kokonut's particle button: spinner → check + burst. */
function CopyEmailBurst() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = contact.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
  };
  return (
    <ParticleButton
      onClick={copy}
      data-cursor="link"
      aria-label={`Copy email address ${contact.email}`}
      icon={<Copy className="h-4 w-4" aria-hidden />}
      successLabel={
        <>
          <Check className="h-4 w-4" aria-hidden /> Copied
        </>
      }
      className="h-11 rounded-full bg-ink-900 px-5 text-white hover:bg-signal"
    >
      {contact.email}
    </ParticleButton>
  );
}

function PitchPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Slow parallax, ~6% of the frame over the photo's whole pass through the viewport.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-3%", "3%"]);
  return (
    <figure ref={ref} className="relative h-full overflow-hidden rounded-[1.75rem] bg-ink-900/5">
      <motion.img
        src={withBase("/images/pitch-envoy.jpg")}
        alt="Adam pitching Envoy with a microphone to a room of judges and students"
        loading="lazy"
        decoding="async"
        style={{ y, scale: 1.1, objectPosition: "24% 50%" }}
        className="aspect-4/5 h-full w-full object-cover lg:aspect-auto"
      />
      <figcaption className="absolute inset-x-3 bottom-3">
        <span className="inline-block rounded-xl bg-surface/95 px-3 py-2 text-xs leading-snug text-ink-700">
          Pitching <span className="font-medium text-ink-900">Envoy</span> at Berkeley SCET
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------- experience */

function Row({ exp, current, open, onToggle }: { exp: ExperienceEntry; current?: boolean; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const id = `exp-${exp.org.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <motion.li layout={!reduced} transition={{ duration: DUR.base, ease: EASE }} className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        data-cursor="link"
        className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 py-5 text-left sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_12.5rem_auto]"
      >
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          {current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />}
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", current ? "bg-signal" : "bg-ink-900/20")} />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-signal-ink sm:text-xl">
          {exp.org}
        </span>
        <span className="col-start-2 row-start-2 text-sm text-ink-500 sm:col-start-3 sm:row-start-1">{exp.role}</span>
        <span className="col-start-3 row-start-1 hidden whitespace-nowrap text-right font-mono text-xs text-ink-500 sm:col-start-4 sm:inline">
          {exp.period}
          {current && <span className="ml-2 rounded-full bg-signal/10 px-1.5 py-0.5 text-signal-ink">NOW</span>}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: DUR.base, ease: EASE }}
          className="col-start-3 row-start-1 flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-700 transition-colors group-hover:border-signal group-hover:text-signal-ink sm:col-start-5"
          aria-hidden
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 pb-6 pl-[1.625rem] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <p className="font-mono text-xs text-ink-500 sm:hidden">{exp.period}</p>
                <p className="mt-1 max-w-[68ch] text-pretty leading-relaxed text-ink-700">{exp.blurb}</p>
                {exp.tags && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tags.map((t) => (
                      <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-700">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {exp.slug && (
                <Link
                  to={`/projects/${exp.slug}`}
                  data-cursor="link"
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal"
                >
                  See the project <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function Experience() {
  const rows = [...experience, leadership];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-ink-900 pb-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">Experience</h3>
        <span className="font-mono text-xs text-ink-500">{rows.length} roles</span>
      </div>
      <ul>
        {rows.map((exp) => (
          <Row
            key={exp.org}
            exp={exp}
            current={/present/i.test(exp.period)}
            open={open === exp.org}
            onToggle={() => setOpen((o) => (o === exp.org ? null : exp.org))}
          />
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------ recognition */

type Rec = (typeof recognition)[number];

function RecFront({ r }: { r: Rec }) {
  return (
    <div className="relative h-full w-full">
      {r.image ? (
        <img
          src={r.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: r.imagePosition }}
        />
      ) : (
        // No photo yet (COP28): a styled card that holds up on its own.
        <div className="absolute inset-0 bg-night-900">
          <div className="bp-grid absolute inset-0" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-signal/25 blur-3xl" />
          <Globe className="absolute right-6 top-14 h-24 w-24 text-white/10" strokeWidth={1} aria-hidden />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-signal px-2.5 py-1 font-mono text-xs font-medium text-white">{r.year}</span>
      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-white/80">
        <RotateCw className="h-3 w-3" aria-hidden /> Flip
      </span>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="font-display text-2xl font-semibold leading-tight tracking-tight">{r.title}</p>
        <p className="mt-1 text-sm text-white/75">{r.org}</p>
      </div>
    </div>
  );
}

function RecBack({ r }: { r: Rec }) {
  return (
    <div className="flex h-full flex-col bg-surface p-6 text-left">
      <span className="font-mono text-xs uppercase tracking-wider text-signal-ink">{r.year}</span>
      <p className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">{r.title}</p>
      <p className="mt-1 text-sm text-ink-500">{r.org}</p>
      <p className="mt-5 text-pretty leading-relaxed text-ink-700">{r.detail}</p>
      {r.slug && (
        <Link
          to={`/projects/${r.slug}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          data-cursor="link"
          className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-signal"
        >
          See the project <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

function Recognition() {
  const featured = new Set(["Award", "Competition", "Delegate"]);
  const rest = awards.filter((a) => !featured.has(a.kind));
  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-ink-900 pb-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">Recognition</h3>
        <span className="font-mono text-xs text-ink-500">Tap a card to flip it</span>
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recognition.map((r, i) => (
          <li key={r.title} className="flex justify-center">
            <Reveal delay={i * 0.08} className="w-full">
              <CardFlip
                label={`${r.title}, ${r.org}, ${r.year}`}
                front={<RecFront r={r} />}
                back={<RecBack r={r} />}
                className="aspect-4/5 w-full max-w-none"
                faceClassName="border-line bg-surface"
              />
            </Reveal>
          </li>
        ))}
      </ul>
      <ul className="mt-10 divide-y divide-line border-t border-line">
        {rest.map((a) => (
          <li key={a.text} className="grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-3 py-3 text-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-signal-ink">{a.kind}</span>
            <span className="text-pretty text-ink-900">{a.text}</span>
            <span className="font-mono text-xs text-ink-500">{a.year ?? ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ about */

/**
 * Phase 4: About, concise and bold. One paragraph whose proof phrases are drawn
 * on with a marker (Kokonut marker-text), a one-line facts strip, actions, an
 * experience accordion, and recognition as flip cards (Kokonut card-flip).
 */
export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-[5vw] py-24 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-ink-900">
          <Reveal kind="mask-line">About.</Reveal>
        </h2>
        <Reveal delay={0.1}>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-ink-900/10 bg-surface px-4 py-2 text-sm text-ink-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal kind="blur-in" className="lg:col-span-4">
          <div className="lg:h-full lg:min-h-[480px]">
            <PitchPhoto />
          </div>
        </Reveal>

        <div className="flex flex-col lg:col-span-8">
          <Paragraph />

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-wider text-ink-700 sm:text-sm">
              {factsLine.map((f, i) => (
                <li key={f} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-signal" aria-hidden />}
                  <span className={cn(f.includes("GPA") && "text-ink-900")}>{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="mt-auto pt-10">
            <div className="flex flex-wrap items-center gap-3">
              <CopyEmailBurst />
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-900/15 px-5 text-sm font-medium text-ink-900 transition-colors hover:border-signal hover:text-signal-ink"
              >
                <Download className="h-4 w-4" aria-hidden /> Résumé
              </a>
              <a
                href="https://www.linkedin.com/in/adam-tang-2374992a7"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                data-cursor="link"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition-colors hover:border-signal hover:bg-signal hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/antangled"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                data-cursor="link"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/15 text-ink-900 transition-colors hover:border-signal hover:bg-signal hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-24">
        <Experience />
      </div>

      <div className="mt-24">
        <Recognition />
      </div>
    </section>
  );
}
