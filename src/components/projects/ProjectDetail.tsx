import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Linkedin, Mail, Play } from "lucide-react";
import {
  getProject,
  adjacentProjects,
  type Media,
  type Project,
} from "../../data/projects";
import { cn } from "../../lib/utils";
import { ProjectGallery } from "./ProjectGallery";
import { Lightbox } from "./Lightbox";
import { CopyEmail } from "../CopyEmail";
import { contact, profile, socialLinks } from "../../data/profile";
import { usePageTitle } from "../../lib/usePageTitle";

const ease = [0.22, 1, 0.36, 1] as const;

const STAT_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-mono text-xs uppercase tracking-[0.3em] text-signal-glow",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Resume-style bullet: the leading verb is emphasised so the list scans as "Built…, Designed…, Tuned…". */
function Highlight({ text }: { text: string }) {
  const cut = text.indexOf(" ");
  return (
    <li className="flex gap-3.5">
      <span
        className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
        aria-hidden
      />
      <p className="text-pretty leading-relaxed text-mist-dim">
        <span className="font-semibold text-mist">
          {cut > 0 ? text.slice(0, cut) : text}
        </span>
        {cut > 0 && text.slice(cut)}
      </p>
    </li>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wider text-mist-faint">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-mist/90">
        {children}
      </dd>
    </div>
  );
}

function BuildLogCard({
  item,
  n,
  onOpen,
  title,
}: {
  item: Media;
  n: number;
  onOpen: () => void;
  title: string;
}) {
  const isVideo = item.type === "video";
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="view"
      data-cursor-label={isVideo ? "Play" : "View"}
      aria-label={`Enlarge: ${item.caption || item.label || title}`}
      className="group block w-full text-left"
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-2xl border border-mist/10",
          item.onWhite ? "bg-white" : "bg-night-800",
        )}
      >
        {isVideo ? (
          <>
            <video
              src={`${item.src}#t=0.5`}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-night-900/80 text-mist transition-colors group-hover:bg-signal">
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
              </span>
            </span>
          </>
        ) : (
          <img
            src={item.src}
            alt={item.caption || title}
            loading="lazy"
            decoding="async"
            className={cn(
              "h-full w-full transition-transform duration-700 ease-expo group-hover:scale-[1.03]",
              item.fit === "contain"
                ? cn("object-contain", item.onWhite && "p-3")
                : "object-cover",
            )}
          />
        )}
      </div>
      <p className="mt-3 font-mono text-xs text-signal-glow">
        {String(n).padStart(2, "0")} ·{" "}
        {item.label ?? (isVideo ? "Video" : "Photo")}
      </p>
      {item.caption && (
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-mist-dim">
          {item.caption}
        </p>
      )}
    </button>
  );
}

function StageCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="h-full rounded-3xl border border-mist/10 bg-night-800/60 p-6">
      <p className="font-mono text-xs text-signal-glow">{n}</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-mist">
        {title}
      </h3>
      <p className="mt-2.5 text-pretty text-sm leading-relaxed text-mist-dim">
        {body}
      </p>
    </div>
  );
}

function NeighborCard({
  project,
  dir,
}: {
  project: Project;
  dir: "prev" | "next";
}) {
  const hasCover = !project.placeholder && project.cover;
  return (
    <Link
      to={`/projects/${project.slug}`}
      data-cursor="link"
      className={cn(
        "group flex items-center gap-4 rounded-3xl border border-mist/10 p-3 transition-colors hover:border-signal/50",
        dir === "next" && "flex-row-reverse text-right",
      )}
    >
      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-night-800">
        {hasCover && (
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 px-2">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mist-faint">
          {dir === "prev" ? (
            <>
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </>
          ) : (
            <>
              Next <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </span>
        <p className="mt-1 truncate font-display text-lg font-semibold text-mist group-hover:text-signal">
          {project.title}
        </p>
      </div>
    </Link>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => setLightbox(null), [slug]);
  usePageTitle(project?.title ?? "Project not found");

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-night-900 text-mist">
        <p className="text-lg">Project not found.</p>
        <Link
          to="/projects"
          data-cursor="link"
          className="mt-6 text-signal underline underline-offset-4"
        >
          Back to all work
        </Link>
      </main>
    );
  }

  const { prev, next } = adjacentProjects(project.slug);
  const hasCover = !project.placeholder && !!project.cover;
  const media = project.media ?? [];
  // Cover first, then supporting media — one list shared by the gallery, build log and lightbox.
  const items: Media[] = [
    ...(project.featureVideo ? [project.featureVideo] : []),
    ...(hasCover
      ? [
          {
            type: "image" as const,
            src: project.cover,
            caption: project.coverCaption,
            fit: project.coverFit,
          },
        ]
      : []),
    ...media,
  ];
  const mediaOffset = (project.featureVideo ? 1 : 0) + (hasCover ? 1 : 0);
  const stats = project.stats ?? [];
  const hasStages = project.problem || project.approach || project.results;

  return (
    <main className="relative min-h-screen bg-night-900 text-mist">
      <div className="pointer-events-none fixed inset-0 bp-grid opacity-40" />

      <article className="relative mx-auto max-w-[1240px] px-[5vw] pb-24 pt-24">
        <Link
          to="/projects"
          data-cursor="link"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mist-dim transition-colors hover:text-signal"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All work
        </Link>

        {/* Header: what it is, in one line, with the artifacts one click away */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-mist-faint">
              <span className="rounded-full border border-mist/15 px-3 py-1 capitalize">
                {project.category}
              </span>
              <span>{project.duration}</span>
              {project.status === "active" && (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                  Active
                </span>
              )}
            </div>
            <h1 className="mt-4 text-balance font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1] tracking-tight">
              {project.title}
            </h1>
            <p className="mt-3 max-w-3xl text-pretty text-lg leading-relaxed text-mist-dim">
              {project.tagline}
            </p>
          </div>
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 rounded-full border border-mist/20 px-4 py-2.5 text-sm text-mist transition-colors hover:border-signal hover:text-signal"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          )}
        </motion.header>

        {/* Visuals first (skipped entirely when a project has none yet — an empty frame reads worse than no frame) */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="mt-8"
          >
            <ProjectGallery
              items={items}
              title={project.title}
              onOpen={setLightbox}
            />
          </motion.div>
        )}

        {/* Key numbers */}
        {stats.length > 0 && (
          <Reveal>
            <dl
              className={cn(
                "mt-6 grid gap-px overflow-hidden rounded-3xl border border-mist/10 bg-mist/10",
                STAT_COLS[Math.min(stats.length, 4)],
              )}
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-night-800 px-5 py-5 sm:px-6">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-none tracking-tight text-mist">
                      {s.value}
                    </span>
                    <span className="mt-2 block text-sm leading-snug text-mist-dim">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {/* Overview + what I did | at a glance */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-mist/90">
              {project.summary}
            </p>
            {project.highlights && project.highlights.length > 0 && (
              <>
                <Eyebrow className="mt-10">What I did</Eyebrow>
                <ul className="mt-5 space-y-3.5">
                  {project.highlights.map((h) => (
                    <Highlight key={h} text={h} />
                  ))}
                </ul>
              </>
            )}
          </Reveal>

          <Reveal delay={0.05}>
            <aside className="rounded-3xl border border-mist/10 bg-night-800/60 p-6">
              <Eyebrow>At a glance</Eyebrow>
              <dl className="mt-5 space-y-5">
                {project.role && <Fact label="Role">{project.role}</Fact>}
                {project.team && <Fact label="Team">{project.team}</Fact>}
                <Fact label="Timeline">{project.duration}</Fact>
                <Fact label="Tools">
                  <span className="mt-0.5 flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-mist/[0.07] px-2.5 py-1 font-mono text-xs text-mist-dim"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </Fact>
              </dl>
            </aside>
          </Reveal>
        </div>

        {/* Build log: every image with a caption that says what it shows */}
        {media.length >= 2 && (
          <section className="mt-16">
            <Reveal>
              <Eyebrow>Build log</Eyebrow>
            </Reveal>
            <ol className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((m, i) => (
                <motion.li
                  key={m.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease, delay: (i % 3) * 0.05 }}
                >
                  <BuildLogCard
                    item={m}
                    n={i + 1}
                    title={project.title}
                    onOpen={() => setLightbox(i + mediaOffset)}
                  />
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {/* Context, kept short */}
        {hasStages && (
          <section className="mt-16">
            <Reveal>
              <Eyebrow>Behind the build</Eyebrow>
            </Reveal>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {project.problem && (
                <Reveal>
                  <StageCard
                    n="01 — Problem"
                    title="The problem"
                    body={project.problem}
                  />
                </Reveal>
              )}
              {project.approach && (
                <Reveal delay={0.05}>
                  <StageCard
                    n="02 — Approach"
                    title="The approach"
                    body={project.approach}
                  />
                </Reveal>
              )}
              {project.results && (
                <Reveal delay={0.1}>
                  <StageCard
                    n="03 — Result"
                    title="The result"
                    body={project.results}
                  />
                </Reveal>
              )}
            </div>
          </section>
        )}

        {/* Contact, so a convinced reader doesn't have to scroll back up */}
        <Reveal>
          <section
            aria-labelledby="contact-me"
            className="mt-20 flex flex-col gap-6 rounded-3xl border border-mist/10 bg-night-800/60 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h2 id="contact-me" className="font-display text-2xl font-semibold tracking-tight">
                Contact me
              </h2>
              <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-mist-dim">
                {profile.availability}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full bg-mist px-5 py-2.5 text-sm font-medium text-night-900 transition-colors hover:bg-signal hover:text-white"
              >
                <Download className="h-4 w-4" aria-hidden />
                Resume
              </a>
              <a
                href={`mailto:${contact.email}`}
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-mist/20 px-5 py-2.5 text-sm text-mist transition-colors hover:border-signal hover:text-signal"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {contact.email}
              </a>
              <CopyEmail />
              <a
                href={socialLinks.find((l) => l.kind === "linkedin")?.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-mist/20 px-5 py-2.5 text-sm text-mist transition-colors hover:border-signal hover:text-signal"
              >
                <Linkedin className="h-4 w-4" aria-hidden />
                LinkedIn
              </a>
            </div>
          </section>
        </Reveal>

        {/* Keep going */}
        <nav
          aria-label="More projects"
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {prev ? <NeighborCard project={prev} dir="prev" /> : <span />}
          {next && <NeighborCard project={next} dir="next" />}
        </nav>
      </article>

      <Lightbox
        items={items}
        index={lightbox}
        title={project.title}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </main>
  );
}
