import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjects, type Project } from "../../data/projects";

const ease = [0.22, 1, 0.36, 1] as const;

// Anchor first, then a couple of strong supporting builds.
const FEATURED_SLUGS = ["internal-cycloidal-actuator", "polysynth-x", "biodiversity-sensing-module", "oski-leases"];

function featured(): Project[] {
  const all = [...getProjects("hardware"), ...getProjects("software")];
  return FEATURED_SLUGS.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Project[];
}

function LightMonogram({ title }: { title: string }) {
  const letters = title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-900/[0.04] to-ink-900/[0.09]">
      <span className="font-display text-[4rem] font-semibold text-ink-900/15">{letters}</span>
    </div>
  );
}

function Card({ project, large }: { project: Project; large?: boolean }) {
  const hasImage = !project.placeholder && project.cover;
  return (
    <Link
      to={`/projects/${project.slug}`}
      data-cursor="view"
      data-cursor-label="View"
      className="group block"
    >
      <div className={`relative overflow-hidden rounded-3xl border border-ink-900/10 bg-surface ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {hasImage ? (
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
          />
        ) : (
          <LightMonogram title={project.title} />
        )}
        {project.placeholder && (
          <span className="absolute left-4 top-4 rounded-full bg-surface/95 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-signal-ink">
            Preview soon
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-signal-ink">
            {project.title}
          </h3>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-500">{project.tagline}</p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-ink" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.impact.slice(0, large ? 3 : 1).map((m) => (
          <span key={m} className="rounded-full bg-ink-900/[0.04] px-2.5 py-1 font-mono text-[0.65rem] text-ink-500">
            {m}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function FeaturedWork() {
  const items = featured();
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] py-20 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-ink">Selected work</p>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[0.98] tracking-tight text-ink-900">
            Recent builds.
          </h2>
        </div>
        <Link
          to="/projects"
          data-cursor="link"
          className="group inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-signal hover:text-signal-ink"
        >
          See all work
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Anchor large, then a 3-up row */}
      <div className="mt-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
        >
          <Card project={items[0]} large />
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(1).map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
            >
              <Card project={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
