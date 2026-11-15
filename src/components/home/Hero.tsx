import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import AttractButton from "@/components/kokonutui/attract-button";
import { profile, heroStatus } from "@/data/profile";
import { buildStrip } from "@/data/projects";
import { withBase } from "@/lib/withBase";
import { DUR, EASE, useRichMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Linkedin } from "../icons/Linkedin";

/*
 * v4 hero: Adam in the centre, his builds orbiting him.
 *
 * Entrance (one sequence, ms):
 *     0  card fades up
 *   100  portrait rises and settles
 *   350  "I build" slides in from the left, "products." from the right
 *   750  the six builds spiral in from the side, one every 90 ms, and hand off
 *        into the orbit with no jump
 *  1100  kicker, role, status and buttons
 *  1500  the statement wipes in along the bottom, left to right
 *
 * The orbit is a CSS 3D scene: the ring turns on a compositor keyframe (no JS
 * per frame, so it stays smooth while the page is busy), each card counter-
 * rotates to keep facing you, and the portrait sits in the same 3D context so
 * the browser hides the cards that pass behind him. Hover or focus pauses it;
 * it also pauses off screen.
 */

const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
const T = { portrait: 0.1, words: 0.35, cards: 750, cardStep: 90, ui: 1.1, statement: 1.5 };
/** Portrait geometry, measured from the cutout: head centre at 39.9% across. */
const HEAD_X = 39.9;

const PARTS: { text: string; slug?: string }[] = [
  { text: "From" },
  { text: "cycloidal actuators", slug: "internal-cycloidal-actuator" },
  { text: "to" },
  { text: "satellite-IoT field sensors", slug: "biodiversity-sensing-module" },
  { text: "and" },
  { text: "RF drone detection", slug: "eldaeon-passive-radar-system" },
];

function OrbitCard({ b, i, n }: { b: (typeof buildStrip)[number]; i: number; n: number }) {
  return (
    <div className="orbit-slot" style={{ ["--theta" as string]: `${(360 / n) * i}deg` }}>
      <div className="orbit-fly" data-fly={i}>
        <Link
          to={`/projects/${b.slug}`}
          data-cursor="view"
          data-cursor-label="View"
          className="orbit-face group"
          aria-label={`${b.label}: open project`}
        >
          <span className="orbit-card" data-card={i}>
            <img src={b.src} alt="" width={640} height={480} decoding="async" draggable={false} />
            <span className="orbit-label">{b.label}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

function Statement() {
  return (
    <p className="text-balance font-display text-[clamp(1.35rem,5.4vw,2rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-white lg:text-[min(2.5cqw,4.6cqh)]">
      {PARTS.map((p, i) => {
        const sep = i < PARTS.length - 1 ? " " : "";
        return p.slug ? (
          <span key={i}>
            <Link
              to={`/projects/${p.slug}`}
              data-cursor="link"
              className="whitespace-nowrap text-signal underline decoration-signal/40 decoration-[0.06em] underline-offset-[0.16em] transition-colors hover:decoration-signal"
            >
              {p.text}
            </Link>
            {sep}
          </span>
        ) : (
          <span key={i}>
            {p.text}
            {sep}
          </span>
        );
      })}
      <span className="text-signal">.</span>
    </p>
  );
}

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const rich = useRichMotion();
  const navigate = useNavigate();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  // Scroll out (desktop): the ring tips back a little and the scene recedes. Transform-only, no pin.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const tilt = useTransform(scrollYProgress, [0, 1], rich ? [-8, -24] : [-8, -8]);
  const recede = useTransform(scrollYProgress, [0, 1], rich ? [1, 0.92] : [1, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], rich ? ["0%", "-18%"] : ["0%", "0%"]);

  // Spiral entrance: each card starts 170° behind its slot at 1.9× the radius and
  // winds in. In the slot's frame that is translateZ(-R) rotateY(e) translateZ(r)
  // rotateY(-e), which is the identity at e = 0, r = R, so it hands off seamlessly.
  useEffect(() => {
    const el = stage.current;
    if (!el || reduced) return;
    const R = el.clientWidth * (rich ? 0.4 : 0.46);
    const anims: Animation[] = [];
    el.querySelectorAll<HTMLElement>("[data-fly]").forEach((fly) => {
      const i = Number(fly.dataset.fly);
      const delay = T.cards + i * T.cardStep;
      anims.push(
        fly.animate(
          [
            { transform: `translateZ(${-R}px) rotateY(-170deg) translateZ(${R * 1.9}px) rotateY(170deg)` },
            { transform: `translateZ(${-R}px) rotateY(0deg) translateZ(${R}px) rotateY(0deg)` },
          ],
          { duration: 1600, delay, easing: EASE_CSS, fill: "backwards" }
        )
      );
      const card = el.querySelector<HTMLElement>(`[data-card="${i}"]`);
      if (card) {
        anims.push(card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay, easing: EASE_CSS, fill: "backwards" }));
      }
    });
    return () => anims.forEach((a) => a.cancel());
  }, [reduced, rich]);

  // Pause the orbit while it's off screen (it costs little, but nothing is better).
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = (from: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : // full transform strings, not x/y shorthands: Motion hands these to WAAPI, so
        // they run on the compositor and never hitch when the page renders mid-entrance
        { initial: { opacity: 0, transform: `translateX(${from}vw)` }, animate: { opacity: 1, transform: "translateX(0vw)" } };

  return (
    <section ref={section} className="mx-auto max-w-[1400px] px-[5vw] pb-16 pt-18 lg:pb-24 lg:pt-[5.25rem]">
      <motion.div
        initial={{ opacity: 0, transform: reduced ? "none" : "translateY(16px)" }}
        animate={{ opacity: 1, transform: reduced ? "none" : "translateY(0px)" }}
        transition={{ duration: DUR.slow, ease: EASE }}
        className="hero-card dark relative overflow-hidden rounded-[2.5rem] bg-night-900 text-white lg:h-[calc(100svh-7rem)] lg:max-h-[940px] lg:min-h-[620px]"
      >
        {/* backdrop: studio falloff, a warm glow behind him, a faint grid */}
        <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0" />

        {/* top bar: who + status (left), actions (right) */}
        <motion.div
          initial={{ opacity: 0, transform: reduced ? "none" : "translateY(-8px)" }}
          animate={{ opacity: 1, transform: reduced ? "none" : "translateY(0px)" }}
          transition={{ duration: DUR.slow, ease: EASE, delay: T.ui }}
          data-reveal
          className="relative z-30 flex flex-col gap-5 px-6 pt-6 sm:px-10 sm:pt-8 lg:absolute lg:inset-x-0 lg:top-0 lg:flex-row lg:items-start lg:justify-between lg:px-[3.4cqw] lg:pt-[3cqw]"
        >
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 p-[3px]">
                <img src={withBase("/images/berkeley-seal.svg")} alt="UC Berkeley seal" className="h-full w-full" />
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.25em]">
                <span className="font-semibold">{profile.name}</span>
                <span className="text-white/55"> · {profile.affiliation}</span>
              </span>
            </div>
            <p className="mt-3 text-lg font-medium text-white/90">{profile.role}</p>
            <p className="mt-2 inline-flex items-center gap-2.5 font-mono text-[0.68rem] uppercase tracking-wider text-white/70">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              {heroStatus[0]} · Open to Spring + Summer 2027 co-ops
            </p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <AttractButton
              onClick={() => navigate("/projects")}
              data-cursor="link"
              radius={56}
              inkClassName="text-signal/55 dark:text-signal/55"
              icon={<ArrowRight className="size-4 shrink-0" aria-hidden />}
              className="h-11 rounded-full bg-white px-6 text-ink-900 hover:bg-signal hover:text-white dark:bg-white dark:text-ink-900 dark:hover:bg-signal dark:hover:text-white"
            >
              View my work
            </AttractButton>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 px-5 text-sm font-medium transition-colors duration-[150ms] hover:border-signal hover:text-signal"
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 transition-colors duration-[150ms] hover:border-signal hover:bg-signal"
            >
              <Linkedin className="h-[1.1rem] w-[1.1rem]" />
            </a>
          </div>
        </motion.div>

        {/* headline: the two halves land either side of his head (desktop), stacked on phones */}
        <motion.h1
          style={{ y: lift }}
          className="hero-headline relative z-0 mt-8 flex flex-col items-center px-6 font-display font-semibold leading-[0.9] tracking-[-0.035em] lg:absolute lg:inset-x-0 lg:mt-0 lg:grid lg:grid-cols-[1fr_var(--gap)_1fr] lg:items-center lg:px-[3cqw]"
        >
          <motion.span
            data-reveal
            {...words(-45)}
            transition={{ duration: DUR.slow * 1.15, ease: EASE, delay: T.words }}
            className="block whitespace-nowrap lg:text-right"
          >
            I build
          </motion.span>
          <span aria-hidden className="hidden lg:block" />
          <motion.span
            data-reveal
            {...words(45)}
            transition={{ duration: DUR.slow * 1.15, ease: EASE, delay: T.words + 0.06 }}
            className="block whitespace-nowrap lg:text-left"
          >
            products<span className="text-signal">.</span>
          </motion.span>
        </motion.h1>

        {/* the scene: portrait + orbit, one 3D rendering context */}
        <div
          ref={stage}
          data-paused={offscreen ? "" : undefined}
          className="orbit-stage relative z-10 -mt-4 h-[min(122vw,540px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
        >
          <motion.div style={{ scale: recede }} className="orbit-world">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(40px) scale(1.04)" }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
              transition={{ duration: DUR.slow * 1.2, ease: EASE, delay: T.portrait }}
              data-reveal
              className="orbit-portrait"
            >
              <img
                src={withBase("/images/adam-cutout.webp")}
                alt="Adam Tang"
                decoding="async"
                fetchPriority="high"
                draggable={false}
                style={{ transform: `translateX(-${HEAD_X}%)` }}
              />
            </motion.div>
            <motion.div style={{ rotateX: tilt }} className="orbit-tilt">
              <div className="orbit-ring">
                {buildStrip.map((b, i) => (
                  <OrbitCard key={b.slug} b={b} i={i} n={buildStrip.length} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* statement fills the bottom, left to right */}
        <div className="relative z-20 px-6 pb-7 pt-2 sm:px-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-[3.4cqw] lg:pb-[3cqw] lg:pt-[9cqh]">
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-linear-to-t from-black/80 via-black/45 to-transparent lg:block" />
          <motion.div
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 100% 0% 0%)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.1, ease: EASE, delay: T.statement }}
            data-reveal
            className="relative lg:max-w-[86cqw]"
          >
            <Statement />
          </motion.div>
          {/* phones: actions under the statement */}
          <div className="relative mt-6 flex flex-wrap items-center gap-3 lg:hidden">
            <Link
              to="/projects"
              data-cursor="link"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-ink-900"
            >
              View my work <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 px-5 text-sm font-medium"
            >
              <Download className="h-4 w-4" aria-hidden /> Résumé
            </a>
            <a
              href="https://www.linkedin.com/in/adam-tang-2374992a7"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={cn("flex h-11 w-11 items-center justify-center rounded-full border border-white/35")}
            >
              <Linkedin className="h-[1.1rem] w-[1.1rem]" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
