import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin } from "lucide-react";
import { profile } from "../../data/profile";
import { getProject } from "../../data/projects";
import { withBase } from "../../lib/withBase";

const ease = [0.22, 1, 0.36, 1] as const;

// Studio-gray gradient sampled from the hero photo's backdrop so the image
// blends seamlessly into the extended banner background (no crop, no outpaint).
const GRAY_BG =
  "linear-gradient(150deg,#94989a 0%,#8a8d90 38%,#7e8084 70%,#727478 100%)";

const cycloidal = getProject("internal-cycloidal-actuator");
const reelEmbed = cycloidal?.embedReel
  ? `${cycloidal.embedReel.replace(/\/$/, "")}/embed`
  : null;

/** Per-line mask reveal: each line rises into view from behind a clipped edge. */
function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="reveal-mask">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** UC Berkeley badge — California Gold star on Berkeley Blue. */
function BerkeleyMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden role="img">
      <circle cx="16" cy="16" r="16" fill="#002676" />
      <path
        fill="#FDB515"
        d="M16 6.5l2.6 6.3 6.8.5-5.2 4.4 1.7 6.6L16 21.1l-5.9 3.7 1.7-6.6-5.2-4.4 6.8-.5z"
      />
    </svg>
  );
}

function IconRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href="https://www.linkedin.com/in/adam-tang-2374992a7"
        target="_blank"
        rel="noreferrer"
        data-cursor="link"
        aria-label="LinkedIn"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-paper transition-transform duration-300 hover:scale-105 hover:bg-signal"
      >
        <Linkedin className="h-[1.15rem] w-[1.15rem]" />
      </a>
      <a
        href="https://eecs.berkeley.edu/"
        target="_blank"
        rel="noreferrer"
        data-cursor="link"
        aria-label="UC Berkeley — EECS"
        className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-ink-900/15 transition-transform duration-300 hover:scale-105"
      >
        <BerkeleyMark className="h-11 w-11" />
      </a>
    </div>
  );
}

function ReelCard({ className = "", delay = 0.55 }: { className?: string; delay?: number }) {
  if (!reelEmbed) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      className={`overflow-hidden rounded-[1.4rem] border border-white/40 bg-night-900 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] ${className}`}
    >
      <iframe
        src={reelEmbed}
        title="Internal Cycloidal Actuator — reel"
        loading="eager"
        allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </motion.div>
  );
}

function HeadlineBlock({ onGray }: { onGray?: boolean }) {
  const ink = onGray ? "text-ink-900" : "text-ink-900";
  const sub = onGray ? "text-ink-900/80" : "text-ink-500";
  return (
    <div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] ${onGray ? "text-ink-700" : "text-ink-500"}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        {profile.affiliation}
      </motion.p>

      <h1 className={`font-display text-[clamp(2.6rem,6.6vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.03em] ${ink}`}>
        <Line delay={0.05}>I build</Line>
        <Line delay={0.14}>
          products<span className="text-signal">.</span>
        </Line>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.5 }}
        className="mt-6 max-w-md"
      >
        <p className={`text-balance text-xl font-medium ${ink}`}>{profile.role}</p>
        <p className={`mt-3 text-pretty text-[0.95rem] leading-relaxed ${sub}`}>
          From custom actuators to embedded field hardware to full-stack software — I turn hard
          problems into things that actually run.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            to="/projects"
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal"
          >
            View my work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <IconRow />
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] pt-28 lg:pt-32">
      {/* ── Desktop: full-width banner, text on the photo's extended gray ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="relative hidden overflow-hidden rounded-[2.75rem] lg:block"
        style={{ background: GRAY_BG, minHeight: "clamp(580px, 84vh, 780px)" }}
      >
        {/* Photo anchored right, feathered into the gray on its left edge */}
        <motion.img
          src={withBase("/images/feature-v3.jpg")}
          alt="Adam Tang"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease }}
          className="absolute right-0 top-0 h-full w-[52%] object-cover"
          style={{
            objectPosition: "50% 28%",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
            maskImage: "linear-gradient(to right, transparent 0%, #000 26%)",
          }}
        />

        {/* Left column on the gray: text up top, reel anchored at the bottom */}
        <div className="relative z-10 flex h-full min-h-[inherit] max-w-[54%] flex-col justify-between gap-8 p-12 xl:p-16">
          <HeadlineBlock onGray />
          <div className="flex items-end gap-5">
            <ReelCard className="h-[clamp(300px,38vh,380px)] w-[264px] shrink-0" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mb-1 hidden items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-ink-700 xl:flex"
            >
              <span className="h-px w-8 bg-ink-700/50" />
              Latest build — internal cycloidal actuator
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile / tablet: stacked, legible ── */}
      <div className="lg:hidden">
        <HeadlineBlock />
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease }}
          className="relative mt-10 overflow-hidden rounded-3xl"
          style={{ background: GRAY_BG }}
        >
          <img
            src={withBase("/images/feature-v3.jpg")}
            alt="Adam Tang"
            className="h-full max-h-[440px] w-full object-cover"
            style={{ objectPosition: "50% 22%" }}
          />
        </motion.div>
        <ReelCard className="mx-auto mt-5 h-[480px] w-full max-w-[320px]" delay={0.3} />
      </div>
    </section>
  );
}
