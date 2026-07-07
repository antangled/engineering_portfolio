import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, adjacentProjects } from "../../data/projects";
import { cn } from "../../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StageCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-mist/10 bg-night-800/60 p-7">
      <p className="font-mono text-xs text-signal-glow">{n}</p>
      <h2 className="mt-2 font-display text-lg font-semibold text-mist">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-mist-dim">{body}</p>
    </div>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-night-900 text-mist">
        <p className="text-lg">Project not found.</p>
        <Link to="/projects" data-cursor="link" className="mt-6 text-signal underline underline-offset-4">
          Back to all work
        </Link>
      </main>
    );
  }

  const { prev, next } = adjacentProjects(project.slug);
  const hasStages = project.problem || project.approach || project.results;
  const reelEmbed = project.embedReel
    ? `${project.embedReel.replace(/\/$/, "")}/embed`
    : null;
  const hasCover = !project.placeholder && project.cover;
  const featureMedia = (project.media ?? []).filter((m) => m.feature);
  const rowMedia = (project.media ?? []).filter((m) => !m.feature);
  // When mediaFirst, the media rows lead the page (replacing the cover hero) instead of trailing it.
  const mediaFirst = Boolean(project.mediaFirst) && rowMedia.length > 0;

  const mediaRows = rowMedia.length > 0 && (
    <div className={cn("space-y-14 lg:space-y-20", mediaFirst ? "mt-10" : "mt-16")}>
      {rowMedia.map((m, i) => {
        const flip = i % 2 === 1;
        const label = m.type === "video" ? "Demo" : "Detail";
        return (
          <Reveal key={i}>
            <figure
              className={cn(
                "grid items-center gap-6 lg:gap-12",
                flip ? "lg:grid-cols-[1fr_1.6fr]" : "lg:grid-cols-[1.6fr_1fr]"
              )}
            >
              <div
                className={cn(
                  "overflow-hidden rounded-4xl border border-mist/10",
                  m.type === "image" && "bg-night-800/40",
                  flip && "lg:order-2"
                )}
              >
                {m.type === "video" ? (
                  <video className="w-full" controls playsInline preload="metadata">
                    <source src={m.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={m.src}
                    alt={m.caption || project.title}
                    loading="lazy"
                    className="max-h-[440px] w-full object-cover"
                  />
                )}
              </div>
              {m.caption && (
                <figcaption className={cn(flip && "lg:order-1 lg:text-right")}>
                  <span className="font-mono text-xs text-signal-glow">
                    {String(i + 1).padStart(2, "0")} · {label}
                  </span>
                  <p className="mt-3 text-pretty text-lg leading-relaxed text-mist/90">{m.caption}</p>
                </figcaption>
              )}
            </figure>
          </Reveal>
        );
      })}
    </div>
  );

  return (
    <main className="relative min-h-screen bg-night-900 text-mist">
      <div className="pointer-events-none fixed inset-0 bp-grid opacity-40" />

      <article className="relative mx-auto max-w-[1100px] px-[5vw] pb-24 pt-28">
        {/* Back */}
        <Reveal>
          <Link
            to="/projects"
            data-cursor="link"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mist-dim transition-colors hover:text-signal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All work
          </Link>
        </Reveal>

        {/* Title block */}
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-mist-faint">
            <span className="rounded-full border border-mist/15 px-3 py-1 capitalize">{project.category}</span>
            <span>{project.duration}</span>
            {project.status === "active" && (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            )}
          </div>
          <h1 className="mt-5 text-balance font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-mist-dim">{project.tagline}</p>
        </Reveal>

        {/* Media-first projects lead with their photo+caption rows in place of a standalone cover hero */}
        {mediaFirst && mediaRows}

        {/* Cover — with the reel to its left when a project has one */}
        {!mediaFirst && (
        <Reveal delay={0.1}>
          {reelEmbed ? (
            <div className="mt-10 grid gap-5 lg:h-[540px] lg:grid-cols-[300px_1fr]">
              <div className="order-2 h-[520px] overflow-hidden rounded-3xl border border-mist/10 bg-night-900 lg:order-1 lg:h-full">
                <iframe
                  src={reelEmbed}
                  title={`${project.title} reel`}
                  loading="lazy"
                  allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="order-1 overflow-hidden rounded-4xl border border-mist/10 lg:order-2 lg:h-full">
                {hasCover ? (
                  <img src={project.cover} alt={project.title} className="h-[300px] w-full object-cover lg:h-full" />
                ) : (
                  <div className="bp-grid flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-night-700 to-night-800 lg:h-full">
                    <p className="font-mono text-xs uppercase tracking-widest text-mist-faint">Main visual — coming soon</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-10 overflow-hidden rounded-4xl border border-mist/10">
              {hasCover ? (
                <img src={project.cover} alt={project.title} className="max-h-[560px] w-full object-cover" />
              ) : (
                <div className="bp-grid flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-night-700 to-night-800">
                  <p className="font-mono text-xs uppercase tracking-widest text-mist-faint">Visuals coming soon</p>
                </div>
              )}
            </div>
          )}
        </Reveal>
        )}

        {/* Impact metrics — columns match the count so there's never an empty cell */}
        <Reveal delay={0.1}>
          <div
            className={cn(
              "mt-10 grid gap-px overflow-hidden rounded-3xl border border-mist/10 bg-mist/10 sm:grid-cols-2",
              project.impact.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            )}
          >
            {project.impact.map((m) => (
              <div key={m} className="bg-night-800 p-5">
                <p className="text-sm font-medium leading-snug text-mist">{m}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Overview + role */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-glow">Overview</p>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-mist/90">{project.summary}</p>
          </Reveal>
          {project.role && (
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-mist/10 bg-night-800/60 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-glow">My role</p>
                <p className="mt-3 text-sm leading-relaxed text-mist-dim">{project.role}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-mist/[0.06] px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-mist-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {project.links && project.links.length > 0 && (
                  <div className="mt-5 flex flex-col gap-2">
                    {project.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="link"
                        className="group inline-flex items-center justify-between rounded-full border border-mist/15 px-4 py-2 text-sm text-mist transition-colors hover:border-signal hover:text-signal"
                      >
                        {l.label}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {/* Feature visual — image on the right, text on the left; breaks the text run */}
        {featureMedia.map((m, i) => (
          <Reveal key={`feature-${i}`}>
            <figure className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
              <div className="overflow-hidden rounded-4xl border border-mist/10 bg-night-800/40 lg:order-2">
                <img
                  src={m.src}
                  alt={m.caption || project.title}
                  loading="lazy"
                  className="max-h-[460px] w-full object-contain"
                />
              </div>
              {m.caption && (
                <figcaption className="lg:order-1">
                  <span className="font-mono text-xs text-signal-glow">Detail</span>
                  <p className="mt-3 text-pretty text-lg leading-relaxed text-mist/90">{m.caption}</p>
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}

        {/* Problem → Approach → Result */}
        {hasStages && (
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {project.problem && (
              <Reveal>
                <StageCard n="01 — Problem" title="The problem" body={project.problem} />
              </Reveal>
            )}
            {project.approach && (
              <Reveal delay={0.06}>
                <StageCard n="02 — Approach" title="My approach" body={project.approach} />
              </Reveal>
            )}
            {project.results && (
              <Reveal delay={0.12}>
                <StageCard n="03 — Result" title="The result" body={project.results} />
              </Reveal>
            )}
          </div>
        )}

        {/* Media — alternating figure + caption rows (unless the project already led with them) */}
        {!mediaFirst && mediaRows}

        {/* Prev / Next */}
        <div className="mt-20 grid gap-4 border-t border-mist/10 pt-10 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/projects/${prev.slug}`}
              data-cursor="link"
              className="group rounded-3xl border border-mist/10 p-6 transition-colors hover:border-signal/50"
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mist-faint">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </span>
              <p className="mt-2 font-display text-lg font-semibold text-mist group-hover:text-signal">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/projects/${next.slug}`}
              data-cursor="link"
              className={cn(
                "group rounded-3xl border border-mist/10 p-6 text-right transition-colors hover:border-signal/50",
                !prev && "sm:col-start-2"
              )}
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mist-faint">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 font-display text-lg font-semibold text-mist group-hover:text-signal">{next.title}</p>
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}
