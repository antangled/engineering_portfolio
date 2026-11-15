import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { HeroCallouts } from "./HeroCallouts";
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
 *   300 ms  the name rises in above "I build"
 *   450 ms  "I build" slides out of the photo's left edge
 *   600 ms  "products." rises into its line (both copies, same timing)
 *  1000 ms  caption, then buttons
 *  1450 ms  zoom callouts: a reticle locks onto the photo, dashed rays grow out,
 *           and each build zooms out of it and decodes (see HeroCallouts)
 *  3200 ms  scroll cue
 *
 * Every animation is a transform / clip-path / opacity string, so Motion runs it
 * on WAAPI (compositor).
 */

const T = { photo: 0, name: 0.3, build: 0.45, products: 0.6, caption: 1.0, buttons: 1.1, cue: 3.2 };

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
  const stageRef = useRef<HTMLDivElement>(null);
  // the scroll cue fades as soon as you start scrolling
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <section className="hero relative flex overflow-x-clip min-h-[100svh] flex-col items-center px-[4vw] pb-24 pt-24 lg:pt-[5.5rem]">
      <h1 className="sr-only">I build products.</h1>

      <div ref={stageRef} className="hero-stage relative w-full">
        {/* name, small, in the headline face, sitting on top of "I build" */}
        <motion.p
          data-reveal
          className="hero-name"
          initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(0.4em)" }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translateY(0em)" }}
          transition={{ duration: DUR.slow, ease: EASE, delay: T.name }}
        >
          {/* the underline runs under "Adam Tan" and stops before the g's loop */}
          <span className="hero-name-u">{profile.name.slice(0, -1)}</span>
          {profile.name.slice(-1)}
        </motion.p>

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

        {/* builds pinned around the portrait (desktop) */}
        {/* builds as magnified callouts from the portrait (desktop) */}
        <HeroCallouts stageRef={stageRef} reduced={reduced} />

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

          {/* scroll cue, inside the photo near its bottom edge */}
          <motion.div aria-hidden style={{ opacity: cueOpacity }} className="hero-cue pointer-events-none absolute inset-x-0 bottom-[4%] z-[3] flex justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.slow, ease: EASE, delay: T.cue }}
              className="flex flex-col items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]"
            >
              Scroll
              <span className="scroll-cue" />
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* caption + actions, centred under the photo */}
      <Rise delay={T.caption} reduced={reduced} className="mt-7 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-[0_1px_2px_rgba(21,23,27,0.12)] ring-1 ring-ink-900/10">
          <img src={withBase("/images/berkeley-seal.svg")} alt="UC Berkeley seal" className="h-full w-full" />
        </span>
        <span className="text-left">
          <span className="block text-base font-semibold tracking-tight text-ink-900 sm:text-lg">{profile.role}</span>
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

    </section>
  );
}
