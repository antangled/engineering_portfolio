import { useState } from "react";
import { motion } from "framer-motion";
import { getProjects, type Project } from "../../data/projects";
import { GalleryTile } from "./GalleryTile";
import { cn } from "../../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
type Category = "hardware" | "software";

export function ProjectsGallery() {
  const [category, setCategory] = useState<Category>("hardware");
  const [hovered, setHovered] = useState<string | null>(null);
  const list: Project[] = getProjects(category);

  return (
    <main className="min-h-screen bg-night-900 text-mist">
      {/* faint blueprint backdrop */}
      <div className="pointer-events-none fixed inset-0 bp-grid opacity-50" />

      <div className="relative mx-auto max-w-[1400px] px-[5vw] pb-28 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col justify-between gap-8 border-b border-mist/10 pb-10 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-glow">Selected work</p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight">
              Things I've built.
            </h1>
            <p className="mt-4 max-w-lg text-pretty text-mist-dim">
              Hardware systems and software products — each with the problem it solves, my role, and
              the measured result.
            </p>
          </div>

          {/* Hardware / Software toggle */}
          <div className="inline-flex rounded-full border border-mist/15 bg-night-800/60 p-1 font-mono text-xs uppercase tracking-wider backdrop-blur">
            {(["hardware", "software"] as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                data-cursor="link"
                onClick={() => {
                  setCategory(c);
                  setHovered(null);
                }}
                className={cn(
                  "relative rounded-full px-5 py-2.5 transition-colors duration-300",
                  category === c ? "text-night-900" : "text-mist-dim hover:text-mist"
                )}
              >
                {category === c && (
                  <motion.span
                    layoutId="toggle-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-signal"
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery grid */}
        <div
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-2 lg:gap-x-12"
          onMouseLeave={() => setHovered(null)}
        >
          {list.map((project, index) => (
            <div key={project.slug} className={cn(index % 2 === 1 && "lg:mt-24")}>
              <GalleryTile
                project={project}
                index={index}
                dimmed={hovered !== null && hovered !== project.slug}
                onHover={setHovered}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
