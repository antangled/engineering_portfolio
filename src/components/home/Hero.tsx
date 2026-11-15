import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { withBase } from "@/lib/withBase";
import { DUR, EASE } from "@/lib/motion";
import { Linkedin } from "../icons/Linkedin";

/*
 * v4 hero, simplified: one narrow portrait in the middle, one huge line.
 *
 *     0 ms  the portrait opens upward from its bottom edge, the photo settling from 1.15×
 *   450 ms  "I build" slides out of the photo's left edge, "products." out of its right
 *   950 ms  role, then the buttons, fade up under the photo
 *
 * Everything animates a transform, opacity or clip-path string, so Motion hands it
 * to WAAPI and it runs on the compositor (no hitch if the page is busy).
 *
 * Layout: the words and the photo form one centred line sized to span ~95% of the
 * page. "I build" is 2.50 em and "products." 4.55 em in Clash Display at -0.04em,
 * so the font size is (95vw - photo - gaps) / 7.05 (see .hero in globals.css).
 */

const T = { photo: 0, words: 0.45, role: 0.95, buttons: 1.05 };

/** A word that slides out from behind the photo's edge (its box clips it). */
function Emerge({ children, from, reduced }: { children: React.ReactNode; from: "left" | "right"; reduced: boolean }) {
  const start = from === "left" ? "translateX(105%)" : "translateX(-105%)";
  return (
    <span className="hero-word block overflow-hidden">
      <motion.span
        data-reveal
        className="block"
        initial={reduced ? { opacity: 0 } : { transform: start }}
        animate={reduced ? { opacity: 1 } : { transform: "translateX(0%)" }}
        transition={{ duration: 1, ease: EASE, delay: T.words }}
      >
        {children}
      </motion.span>
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

  const photo = (
    <div className="hero-photo relative z-10 mx-auto overflow-hidden rounded-[1.75rem] bg-studio shadow-[0_40px_80px_-40px_rgba(21,23,27,0.45)]">
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
      </motion.div>
    </div>
  );

  const actions = (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/projects"
        data-cursor="link"
        className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-7 text-sm font-medium text-white transition-colors duration-[150ms] hover:bg-signal"
      >
        View my work
        <ArrowRight className="h-4 w-4 transition-transform duration-[400ms] ease-expo group-hover:translate-x-1" aria-hidden />
      </Link>
      <a
        href={profile.resume}
        target="_blank"
        rel="noreferrer"
        data-cursor="link"
        className="inline-flex h-12 items-center gap-2 rounded-full border border-ink-900/20 bg-surface px-6 text-sm font-medium text-ink-900 transition-colors duration-[150ms] hover:border-signal hover:text-signal-ink"
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
    </div>
  );

  const role = (
    <p className="text-center">
      <span className="block text-lg font-semibold tracking-tight text-ink-900 sm:text-xl">{profile.role}</span>
      <span className="mt-1 block font-mono text-xs uppercase tracking-[0.2em] text-ink-500">UC Berkeley · EECS</span>
    </p>
  );

  return (
    <section className="hero px-[2.5vw] pb-8 pt-24 lg:pt-28">
      <h1 className="sr-only">I build products.</h1>

      {/* Desktop: [I build] [photo] [products.] on one line, role + buttons under the photo */}
      <div className="hidden lg:grid lg:grid-cols-[auto_auto_auto] lg:justify-center lg:gap-x-[var(--hero-gap)]">
        <div aria-hidden className="hero-line self-center justify-self-end font-display font-semibold text-ink-900">
          <Emerge from="left" reduced={reduced}>
            I build
          </Emerge>
        </div>
        {photo}
        <div aria-hidden className="hero-line self-center font-display font-semibold text-ink-900">
          <Emerge from="right" reduced={reduced}>
            products<span className="text-signal">.</span>
          </Emerge>
        </div>
        {/* exactly the photo's width, so it never widens the column; its content
            overflows evenly both sides, centred under the photo */}
        <div className="hero-photo-w col-start-2 mt-7 flex justify-center">
          <div className="w-max shrink-0">
            <Rise delay={T.role} reduced={reduced}>
              {role}
            </Rise>
            <Rise delay={T.buttons} reduced={reduced} className="mt-5">
              {actions}
            </Rise>
          </div>
        </div>
      </div>

      {/* Phones and tablets: the line stacked above the photo */}
      <div className="flex flex-col items-center lg:hidden">
        <div
          aria-hidden
          className="hero-line-sm text-center font-display font-semibold leading-[0.88] tracking-[-0.04em] text-ink-900"
        >
          <Rise delay={T.words} reduced={reduced}>
            I build
          </Rise>
          <Rise delay={T.words + 0.08} reduced={reduced}>
            products<span className="text-signal">.</span>
          </Rise>
        </div>
        <div className="mt-6">{photo}</div>
        <Rise delay={T.role} reduced={reduced} className="mt-6">
          {role}
        </Rise>
        <Rise delay={T.buttons} reduced={reduced} className="mt-5">
          {actions}
        </Rise>
      </div>
    </section>
  );
}
