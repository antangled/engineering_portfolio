import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "../../data/projects";
import { coverTransitionName } from "../../data/featured";
import { DUR, EASE as ease, useIsDesktop } from "../../lib/motion";
import { useMorphNavigate } from "../../lib/viewTransition";
import { cn } from "../../lib/utils";

function Monogram({ title }: { title: string }) {
  const letters = title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="bp-grid flex h-full w-full items-center justify-center bg-linear-to-br from-night-700 to-night-800">
      <span className="font-display text-[5rem] font-semibold text-mist/15">{letters}</span>
    </div>
  );
}

export function GalleryTile({
  project,
  index,
  dimmed,
  onHover,
}: {
  project: Project;
  index: number;
  dimmed: boolean;
  onHover: (slug: string | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasImage = !project.placeholder && project.cover;
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const morph = useMorphNavigate();
  const vt = coverTransitionName(project.slug);
  // Entrance plays when the tile scrolls into view; column-staggered.
  // Observe the unclipped outer tile: Chrome's IntersectionObserver honors the
  // frame's own clip-path, so a fully clipped frame would never count as visible.
  const tileRef = useRef<HTMLDivElement>(null);
  const shown = useInView(tileRef, { once: true, amount: 0.15 });
  const delay = (index % 2) * 0.09;

  // Slow parallax: the image drifts ~8% against the frame as the tile crosses the viewport.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-4%", "4%"]);

  // Gentle 3D tilt toward the pointer (desktop only).
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!desktop || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6);
  };

  const enter = () => {
    onHover(project.slug);
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const leave = () => {
    onHover(null);
    rx.set(0);
    ry.set(0);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={tileRef}
      layout={!reduced}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: !shown ? 0 : dimmed ? 0.55 : 1, y: shown ? 0 : 40 }}
      exit={{ opacity: 0, y: -16, transition: { duration: DUR.base * 0.6, ease } }}
      transition={{ duration: DUR.slow, ease, delay: dimmed ? 0 : delay }}
      className="group"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <Link
        to={`/projects/${project.slug}`}
        onClick={morph(`/projects/${project.slug}`, vt)}
        data-cursor="view"
        data-cursor-label="View"
        className="block"
      >
        <motion.div
          ref={frameRef}
          onPointerMove={tilt}
          style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
          // Image wipes up from the bottom edge as the tile first appears.
          initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={shown ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
          transition={{ duration: DUR.slow * 1.2, ease, delay: delay + 0.05 }}
          className="relative aspect-4/3 overflow-hidden rounded-3xl border border-mist/10 bg-night-800"
        >
          <motion.div
            style={{ y: drift }}
            initial={reduced ? false : { scale: 1.25 }}
            animate={shown ? { scale: 1.1 } : undefined}
            transition={{ duration: DUR.slow * 1.6, ease, delay }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-expo group-hover:scale-[1.04]">
              {hasImage ? (
                <img
                  src={project.cover}
                  alt={project.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  data-vt={vt}
                  style={{ viewTransitionName: vt }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Monogram title={project.title} />
              )}
              {project.coverVideo && (
                <video
                  ref={videoRef}
                  src={project.coverVideo}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </div>
          </motion.div>

          {/* gradient + meta overlays */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-night-900/70 via-transparent to-transparent opacity-80" />
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.65rem] text-mist-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.badge && (
              <span className="rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.65rem] text-mist">
                {project.badge}
              </span>
            )}
            {project.status === "active" && (
              <span className="flex items-center gap-1.5 rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.65rem] text-mist-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            )}
            {project.placeholder && (
              <span className="rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-signal-glow">
                Preview soon
              </span>
            )}
          </div>

          {/* Signals a hover-to-play demo (and tells touch users a video exists) */}
          {project.coverVideo && (
            <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-mist">
              <Play className="h-2.5 w-2.5 fill-current" aria-hidden />
              Demo
            </span>
          )}
        </motion.div>

        {/* caption row */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3
              className={cn(
                "font-display text-xl font-semibold tracking-tight text-mist transition-colors duration-300",
                "group-hover:text-signal",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-mist-dim">{project.tagline}</p>
          </div>
          <span className="mt-1 font-mono text-xs text-mist-faint">{project.year}</span>
        </div>

        {/* impact chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {project.impact.slice(0, 2).map((m) => (
            <span
              key={m}
              className="rounded-full border border-mist/10 px-2.5 py-1 font-mono text-[0.65rem] text-mist-dim"
            >
              {m}
            </span>
          ))}
          <ArrowUpRight className="h-4 w-4 text-mist-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        </div>
      </Link>
    </motion.div>
  );
}
