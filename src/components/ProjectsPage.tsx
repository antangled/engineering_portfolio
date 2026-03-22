import { type Project } from "../data/projects";
import { TimelinePath } from "./timeline/TimelinePath";
import { TimelineCard } from "./timeline/TimelineCard";
import { motion } from "framer-motion";

export function ProjectsPage({ projects }: { projects: Project[] }) {
  const segmentHeight = 260;

  // Sort projects by explicit display order
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="mt-16 flex flex-1 flex-col text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16"
      >
        <p className="text-xs uppercase tracking-[0.5em] text-white/40">Adam Tang</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Selected Engineering Projects</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/50">
          Mechatronics · Embedded Systems · Sustainability
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Desktop: 3-column grid with SVG path in center */}
        <div className="hidden lg:block">
          <div className="relative" style={{ minHeight: sorted.length * segmentHeight + 400 }}>
            {/* SVG wavy line in center */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ height: sorted.length * segmentHeight + 400 }}>
              <TimelinePath segmentCount={sorted.length} segmentHeight={segmentHeight} />
            </div>

            {/* Project cards alternating left/right */}
            {sorted.map((project, index) => {
              const isLeft = index % 2 === 0;
              const topOffset = index * segmentHeight;

              // Check if this is the first project of a new year
              const isFirstOfYear = index === 0 || sorted[index - 1].year !== project.year;

              return (
                <div key={project.slug}>
                  {/* Year marker */}
                  {isFirstOfYear && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: topOffset - 36 }}
                    >
                      <span className="rounded-full border border-white/15 bg-[#1d2027]/80 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-white/50 backdrop-blur-sm">
                        {project.year}
                      </span>
                    </motion.div>
                  )}

                  {/* Card positioned left or right */}
                  <div
                    className="absolute w-[calc(50%-50px)]"
                    style={{
                      top: topOffset + 20,
                      ...(isLeft ? { left: 0 } : { right: 0 }),
                    }}
                  >
                    <TimelineCard project={project} index={index} isLeft={isLeft} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: single column with simple vertical line */}
        <div className="lg:hidden">
          <div className="relative border-l-2 border-white/10 pl-8">
            {sorted.map((project, index) => {
              const isFirstOfYear = index === 0 || sorted[index - 1].year !== project.year;

              return (
                <div key={project.slug} className="relative pb-12">
                  {/* Node dot on the line */}
                  <div className="absolute -left-[calc(2rem+5px)] top-6 h-2.5 w-2.5 rounded-full border border-white/30 bg-white/15" />

                  {/* Year marker */}
                  {isFirstOfYear && (
                    <div className="mb-4">
                      <span className="rounded-full border border-white/15 bg-[#1d2027]/80 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/50">
                        {project.year}
                      </span>
                    </div>
                  )}

                  <TimelineCard project={project} index={index} isLeft={false} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
