import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useState } from "react";
import { ArrowRight, Download, Play } from "lucide-react";
import { profile } from "@/data/profile";
import { buildStrip, getProject } from "@/data/projects";
import { HoverClip } from "../motion/HoverClip";
import { withBase } from "@/lib/withBase";
import { DUR, EASE } from "@/lib/motion";
import { Linkedin } from "../icons/Linkedin";

/*
 * v4 hero: a large centred portrait, "I build" to its left, and "products."
 * stepped onto the next line, crossing the photo.
 *
 * Legibility where "products." crosses the photo: the word is drawn twice at the
 * same page coordinates. The ink copy sits behind the photo; a white copy lives
 * inside the photo frame (which clips it). So the word reads black on the page
 * and white on the photo, with no seam. All geometry is CSS variables on
 * .hero-stage (globals.css), so both copies always line up at any width.
 *
 *     0 ms  the photo opens upward, settling from 1.15×
 *   450 ms  "I build" slides out of the photo's left edge
 *   600 ms  "products." rises into its line (both copies, same timing)
 *  1000 ms  caption, then buttons; the scroll cue last
 *
 * Every animation is a transform / clip-path / opacity string, so Motion runs it
 * on WAAPI (compositor).
 */

const T = { photo: 0, build: 0.45, products: 0.6, tiles: 0.8, tileStep: 0.07, caption: 1.0, buttons: 1.1, cue: 1.6 };

type Build = (typeof buildStrip)[number];

/** The four builds in the hero, in Adam's order, with recruiter-facing names. */
const HERO_BUILDS: { slug: string; label: string }[] = [
  { slug: "internal-cycloidal-actuator", label: "Cycloidal actuator" },
  { slug: "eldaeon-passive-radar-system", label: "Eldaeon passive radar" },
  { slug: "biodiversity-sensing-module", label: "Biodiversity sensor" },
  { slug: "murex-rov", label: "MATE ROV" },
];
const heroBuilds: Build[] = HERO_BUILDS.map(({ slug, label }) => {
  const b = buildStrip.find((x) => x.slug === slug)!;
  return { ...b, label };
});

/** One build in the hero: opens upward like the photo, zooms + plays its clip on hover. */
function Tile({ b, i, reduced }: { b: Build; i: number; reduced: boolean }) {
  const [hot, setHot] = useState(false);
  const project = getProject(b.slug);
  const delay = T.tiles + i * T.tileStep;
  return (
    <motion.div
      data-reveal
      className="hero-tile"
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0% round 1rem)" }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0% round 1rem)" }}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
    >
      <Link
        to={`/projects/${b.slug}`}
        data-cursor="view"
        data-cursor-label={b.clip ? "Play" : "View"}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        className="group relative block h-full w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-900/10 transition-shadow duration-[400ms] ease-expo hover:ring-2 hover:ring-signal focus-visible:ring-2 focus-visible:ring-signal focus-visible:outline-none"
      >
        <motion.img
          src={b.src}
          alt={b.alt}
          width={640}
          height={480}
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-[800ms] ease-expo group-hover:scale-[1.07]"
          initial={reduced ? false : { transform: "scale(1.2)" }}
          animate={{ transform: "scale(1)" }}
          transition={{ duration: 1.2, ease: EASE, delay }}
        />
        {b.clip && <HoverClip src={b.clip} active={hot} className="transition-transform duration-[800ms] ease-expo group-hover:scale-[1.07]" />}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/75 via-black/20 to-transparent px-3 pb-2.5 pt-8 text-white">
          <span className="flex items-center gap-1.5 text-[0.8rem] font-medium leading-tight">
            {b.clip && <Play aria-hidden className="h-2.5 w-2.5 shrink-0 fill-current opacity-80" />}
            {b.label}
          </span>
          {project && <span className="font-mono text-[0.65rem] text-white/70">{project.year}</span>}
        </span>
      </Link>
    </motion.div>
  );
}

function Products({ reduced, light }: { reduced: boolean; light?: boolean }) {
  return (
    <span className={light ? "hero-products hero-products--light" : "hero-products"} aria-hidden>
      <span className="block overflow-hidden pb-[0.14em]">
        <motion.span
          data-reveal
          className="block"
          initial={reduced ? { opacity: 0 } : { transform: "translateY(105%)" }}
          animate={reduced ? { opacity: 1 } : { transform: "translateY(0%)" }}
          transition={{ duration: 1, ease: EASE, delay: T.products }}
        >
          products<span className="text-signal">.</span>
        </motion.span>
      </span>
    </span>
  );
}

function Rise({
  children,
  delay,
  reduced,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  reduced: boolean;
  className?: string;
}) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, transform: reduced ? "none" : "translateY(14px)" }}
      animate={{ opacity: 1, transform: reduced ? "none" : "translateY(0px)" }}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  // the scroll cue fades as soon as you start scrolling
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <section className="hero relative flex min-h-[100svh] flex-col items-center px-[4vw] pb-24 pt-24 lg:pt-[5.5rem]">
      <h1 className="sr-only">I build products.</h1>

      <div className="hero-stage relative w-full">
        {/* "I build": its right edge meets the photo; it slides out from behind it */}
        <span aria-hidden className="hero-build">
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              data-reveal
              className="block"
              initial={reduced ? { opacity: 0 } : { transform: "translateX(105%)" }}
              animate={reduced ? { opacity: 1 } : { transform: "translateX(0%)" }}
              transition={{ duration: 1, ease: EASE, delay: T.build }}
            >
              I build
            </motion.span>
          </span>
        </span>

        {/* builds in the two open corners: under "I build", and above "products." */}
        <nav aria-label="Builds" className="contents">
          <div className="hero-tiles hero-tiles--left">
            {heroBuilds.slice(0, 2).map((b, i) => (
              <Tile key={b.slug} b={b} i={i} reduced={reduced} />
            ))}
          </div>
          <div className="hero-tiles hero-tiles--right">
            {heroBuilds.slice(2).map((b, i) => (
              <Tile key={b.slug} b={b} i={i + 2} reduced={reduced} />
            ))}
          </div>
        </nav>

        {/* ink copy of "products." (behind the photo) */}
        <Products reduced={reduced} />

        {/* the photo, with the white copy of "products." clipped inside it */}
        <div className="hero-photo">
          <motion.div
            data-reveal
            className="absolute inset-0"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.9, ease: EASE, delay: T.photo }}
          >
            <motion.img
              src={withBase("/images/portrait-narrow.webp")}
              alt="Adam Tang"
              width={638}
              height={1100}
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
              initial={reduced ? false : { transform: "scale(1.15)" }}
              animate={{ transform: "scale(1)" }}
              transition={{ duration: 1.3, ease: EASE, delay: T.photo }}
            />
            {/* darkens the photo a touch behind the white word */}
            <div aria-hidden className="hero-photo-scrim" />
          </motion.div>
          <Products reduced={reduced} light />
        </div>
      </div>

      {/* caption + actions, centred under the photo */}
      <Rise delay={T.caption} reduced={reduced} className="mt-7 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(21,23,27,0.12)] ring-1 ring-ink-900/10">
          <img src={withBase("/images/berkeley-seal.svg")} alt="UC Berkeley seal" className="h-full w-full" />
        </span>
        <span className="text-left">
          <span className="block text-base tracking-tight text-ink-700 sm:text-lg">
            <span className="font-semibold text-ink-900">{profile.name}</span>
            <span aria-hidden className="mx-2 text-ink-900/25">/</span>
            {profile.role}
          </span>
          <span className="block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-500">UC Berkeley · EECS</span>
        </span>
      </Rise>
      <Rise delay={T.buttons} reduced={reduced} className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Link
          to="/projects"
          data-cursor="link"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm sm:px-7 font-medium text-white transition-colors duration-[150ms] hover:bg-signal"
        >
          View my work
          <ArrowRight className="h-4 w-4 transition-transform duration-[400ms] ease-expo group-hover:translate-x-1" aria-hidden />
        </Link>
        <a
          href={profile.resume}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-900/20 bg-surface px-4 text-sm sm:px-6 font-medium text-ink-900 transition-colors duration-[150ms] hover:border-signal hover:text-signal-ink"
        >
          <Download className="h-4 w-4" aria-hidden />
          Résumé
        </a>
        <a
          href="https://www.linkedin.com/in/adam-tang-2374992a7"
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          aria-label="LinkedIn"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-900/20 bg-surface text-ink-900 transition-colors duration-[150ms] hover:border-signal hover:bg-signal hover:text-white"
        >
          <Linkedin className="h-[1.1rem] w-[1.1rem]" />
        </a>
      </Rise>

      {/* phones and tablets: the builds as a grid under the buttons */}
      <nav aria-label="Builds" className="hero-tiles-sm mt-6 grid w-full max-w-xl grid-cols-2 gap-3 lg:hidden">
        {heroBuilds.map((b, i) => (
          <Tile key={b.slug} b={b} i={i} reduced={reduced} />
        ))}
      </nav>

      {/* scroll cue, centred under the buttons (desktop; phones see the builds instead) */}
      <motion.div aria-hidden style={{ opacity: cueOpacity }} className="pointer-events-none mt-6 hidden lg:block">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.slow, ease: EASE, delay: T.cue }}
          className="flex flex-col items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-ink-700"
        >
          Scroll
          <span className="scroll-cue" />
        </motion.span>
      </motion.div>
    </section>
  );
}
