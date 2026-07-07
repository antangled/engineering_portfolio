import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "../../data/projects";
import { cn } from "../../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function Monogram({ title }: { title: string }) {
  const letters = title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="bp-grid flex h-full w-full items-center justify-center bg-gradient-to-br from-night-700 to-night-800">
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
  const hasImage = !project.placeholder && project.cover;

  const enter = () => {
    onHover(project.slug);
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const leave = () => {
    onHover(null);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease, delay: (index % 2) * 0.08 }}
      animate={{ opacity: dimmed ? 0.55 : 1 }}
      className="group"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <Link
        to={`/projects/${project.slug}`}
        data-cursor="view"
        data-cursor-label="View"
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-mist/10 bg-night-800">
          <div className="absolute inset-0 transition-transform duration-700 ease-expo group-hover:scale-[1.04]">
            {hasImage ? (
              <img
                src={project.cover}
                alt={project.title}
                loading={index < 2 ? "eager" : "lazy"}
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

          {/* gradient + meta overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-900/70 via-transparent to-transparent opacity-80" />
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-[0.65rem] text-mist-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
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
        </div>

        {/* caption row */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3
              className={cn(
                "font-display text-xl font-semibold tracking-tight text-mist transition-colors duration-300",
                "group-hover:text-signal"
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
