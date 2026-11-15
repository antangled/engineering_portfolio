import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRichMotion } from "@/lib/motion";

/** The v3 supporting line, set large. Linked phrases point at the proof. */
const PARTS: { text: string; to?: string }[] = [
  { text: "From" },
  { text: "cycloidal actuators", to: "/projects/internal-cycloidal-actuator" },
  { text: "to" },
  { text: "satellite-IoT field sensors", to: "/projects/biodiversity-sensing-module" },
  { text: "and" },
  { text: "RF drone detection", to: "/projects/eldaeon-passive-radar-system" },
];

const INK = "#15171b";
const SIGNAL = "#d33e08"; // signal-ink: AA on the light register
const DIM = 0.14;

type Word = { word: string; to?: string; first: boolean; last: boolean };
const WORDS: Word[] = PARTS.flatMap((p) => {
  const ws = p.text.split(" ");
  return ws.map((word, i) => ({ word, to: p.to, first: i === 0, last: i === ws.length - 1 }));
});

// max-w in ch must live on the element with the big font-size (ch = that font's "0").
const headline = "max-w-[19ch] text-balance font-display text-[clamp(2.3rem,6.2vw,6.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]";

/** One word whose opacity (and, for proof words, color) is driven by scroll. */
function ScrollWord({ w, i, progress }: { w: Word; i: number; progress: MotionValue<number> }) {
  // Words land across 8%–70% of the pinned scroll, the rest is a short hold.
  const start = 0.08 + (i / WORDS.length) * 0.62;
  const end = start + 0.62 / WORDS.length;
  const opacity = useTransform(progress, [start, end], [DIM, 1]);
  const color = useTransform(progress, [end - 0.01, end + 0.04], [INK, w.to ? SIGNAL : INK]);
  return (
    <motion.span style={{ opacity, color }} className="inline">
      {w.word}
    </motion.span>
  );
}

/** Render words, wrapping each linked phrase in one <Link>. */
function Sentence({ progress }: { progress?: MotionValue<number> }) {
  const out: React.ReactNode[] = [];
  let group: React.ReactNode[] = [];
  WORDS.forEach((w, i) => {
    const node = progress ? (
      <ScrollWord key={i} w={w} i={i} progress={progress} />
    ) : (
      <span key={i} className={w.to ? "text-signal-ink" : undefined}>
        {w.word}
      </span>
    );
    const space = i < WORDS.length - 1 ? " " : "";
    if (!w.to) {
      out.push(node, space);
      return;
    }
    group.push(node, w.last ? "" : " ");
    if (w.last) {
      out.push(
        <Link
          key={`l${i}`}
          to={w.to}
          data-cursor="link"
          className="rounded-md decoration-[0.06em] underline-offset-[0.14em] hover:underline focus-visible:underline"
        >
          {group}
        </Link>,
        space
      );
      group = [];
    }
  });
  return (
    <p className={headline}>
      {out}
      <span className="text-signal">.</span>
    </p>
  );
}

/**
 * Phase 2: the line from the hero, set large and read in word by word as you
 * scroll. Desktop pins it briefly; phones and reduced motion get the same text,
 * fully visible, with the proof phrases already orange.
 */
export function Statement() {
  const rich = useRichMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (!rich) {
    return (
      <section aria-label="What I build" className="mx-auto max-w-[1400px] px-[5vw] py-20 text-ink-900 sm:py-28">
        <Sentence />
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="What I build" className="relative h-[210vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-[1400px] px-[5vw] text-ink-900">
          <Sentence progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
