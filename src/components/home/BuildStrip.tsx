import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { buildStrip } from "../../data/projects";
import { DUR, EASE as ease } from "../../lib/motion";
import { HoverClip } from "../motion/HoverClip";

type Build = (typeof buildStrip)[number];

function Thumb({ b }: { b: Build }) {
  const [hot, setHot] = useState(false);
  return (
    <Link
      to={`/projects/${b.slug}`}
      data-cursor="view"
      data-cursor-label={b.clip ? "Play" : "View"}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      className="group relative block aspect-4/3 overflow-hidden rounded-2xl border border-ink-900/10 bg-surface"
    >
      <img
        src={b.src}
        alt={b.alt}
        width={640}
        height={480}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[800ms] ease-expo group-hover:scale-[1.05]"
      />
      {b.clip && (
        <HoverClip
          src={b.clip}
          active={hot}
          className="transition-transform duration-[800ms] ease-expo group-hover:scale-[1.05]"
        />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-linear-to-t from-black/70 to-transparent px-3 pb-2 pt-6 font-mono text-xs text-white">
        {b.clip && <Play aria-hidden className="h-3 w-3 fill-current opacity-80" />}
        {b.label}
      </span>
    </Link>
  );
}

/**
 * Proof strip directly under the hero: real hardware photos, visible in the
 * first viewport, so "I build" is shown before anything is read. Six-up row on
 * desktop; a swipeable row on smaller screens.
 */
export function BuildStrip() {
  return (
    <nav aria-label="Builds" className="mx-auto max-w-[1400px] px-[5vw] pt-3">
      <ul
        data-lenis-prevent
        className="no-scrollbar mx-[-5vw] flex snap-x snap-mandatory scroll-px-[5vw] gap-3 overflow-x-auto px-[5vw] lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0"
      >
        {buildStrip.map((b, i) => (
          <motion.li
            key={b.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.slow, ease, delay: 0.9 + i * 0.05 }}
            className="w-[40%] shrink-0 snap-start sm:w-[28%] lg:w-auto"
          >
            <Thumb b={b} />
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
