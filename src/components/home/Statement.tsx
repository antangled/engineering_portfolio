import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getProject } from "@/data/projects";
import { useInViewOnce } from "@/lib/motion";

/** The v3 supporting line. Each proof phrase carries a thumbnail of the build it names. */
const PARTS: { text: string; slug?: string }[] = [
  { text: "From" },
  { text: "cycloidal actuators", slug: "internal-cycloidal-actuator" },
  { text: "to" },
  { text: "satellite-IoT field sensors", slug: "biodiversity-sensing-module" },
  { text: "and" },
  { text: "RF drone detection", slug: "eldaeon-passive-radar-system" },
];

const STEP = 45; // ms between words

/**
 * The statement, full width under the hero: it reads left to right across the page. When it
 * enters view the words rise from a mask one after another, each thumbnail pops
 * in, and the proof phrases turn orange as an underline draws under them. It
 * plays once, on CSS transitions only (no per-scroll-frame work). The text is in
 * the HTML from the start; the hidden state only applies once JS has armed it.
 */
export function Statement() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInViewOnce<HTMLParagraphElement>(0.4);
  // Arm (hide) only after mount, so the prerendered HTML always shows the text.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const state = !mounted || reduced || inView ? "in" : "armed";

  let w = 0;
  const words = (text: string) =>
    text.split(" ").map((word, i, a) => {
      const delay = w++ * STEP;
      // The space sits outside the clipped box: trailing spaces inside an inline-block collapse.
      return [
        <span key={i} className="st-mask">
          <span className="st-word" style={{ transitionDelay: `${delay}ms` }}>
            {word}
          </span>
        </span>,
        i < a.length - 1 ? " " : "",
      ];
    });

  return (
    <section aria-label="What I build" className="mx-auto max-w-[1400px] px-[5vw] py-16 sm:py-24">
      <div>
        <p
          ref={ref}
          data-st={state}
          className="statement text-balance font-display text-[clamp(2.2rem,5.6vw,5.75rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-ink-900"
        >
          {PARTS.map((part, pi) => {
            const sep = pi < PARTS.length - 1 ? " " : "";
            if (!part.slug) return [words(part.text), sep];
            const project = getProject(part.slug);
            const at = w * STEP;
            return [
              <Link
                key={part.slug}
                to={`/projects/${part.slug}`}
                data-cursor="link"
                className="st-proof group"
                style={{ ["--st-at" as string]: `${at}ms` }}
              >
                <span aria-hidden className="st-thumb">
                  {project?.cover && <img src={project.cover} alt="" loading="lazy" decoding="async" />}
                </span>
                <span className="st-line">{words(part.text)}</span>
                {/* zero-width slot so the hover arrow never shifts the text */}
                <span aria-hidden className="relative inline-block w-0">
                  <ArrowUpRight className="absolute bottom-[0.5em] left-[0.04em] h-[0.45em] w-[0.45em] text-signal opacity-0 transition-all duration-[400ms] ease-expo group-hover:translate-x-[0.06em] group-hover:opacity-100" />
                </span>
              </Link>,
              sep,
            ];
          })}
          <span className="st-mask">
            <span className="st-word text-signal" style={{ transitionDelay: `${w * STEP}ms` }}>
              .
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
