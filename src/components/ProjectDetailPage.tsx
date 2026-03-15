import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { type Project } from "../data/projects";

function SectionCard({
  label,
  title,
  children,
  delay = 0,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="rounded-[2.5rem] border border-white/10 bg-[#1d2027]/75 p-8 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10"
    >
      <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/35">{label}</p>
      <h3 className="mt-2 font-display text-xl font-semibold">{title}</h3>
      <div className="mt-4 text-sm leading-relaxed text-white/70">{children}</div>
    </motion.div>
  );
}

export function ProjectDetailPage({ projects }: { projects: Project[] }) {
  const { slug } = useParams();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : undefined;

  if (!project) {
    return (
      <div className="mt-20 flex flex-1 flex-col items-center justify-center text-center text-white/70">
        <p className="text-lg">Project not found.</p>
        <Link className="mt-6 text-white underline underline-offset-4 transition hover:text-white/70" to="/projects">
          Back to projects
        </Link>
      </div>
    );
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  const hasStructuredContent = project.problem || project.approach || project.results;
  const extraImages = (project.images || []).filter((img) => img.src !== project.image);

  return (
    <section className="mt-12 flex flex-1 flex-col gap-8 text-white">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)]"
      >
        <div className="relative h-[300px] sm:h-[400px]">
          <img
            alt={project.title}
            className="h-full w-full object-cover"
            src={project.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15181d] via-[#15181d]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/45">Project</p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">
              {project.title}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex flex-wrap items-center gap-3"
      >
        <span className="flex items-center gap-2 rounded-full border border-white/12 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              project.status === "active" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-white/40"
            }`}
          />
          {project.duration}
        </span>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        className="rounded-[2.5rem] border border-white/10 bg-[#1d2027]/75 p-8 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10"
      >
        <p className="text-base leading-relaxed text-white/75">{project.description}</p>
        {project.content && !hasStructuredContent && (
          <p className="mt-4 text-base leading-relaxed text-white/65">{project.content}</p>
        )}
      </motion.div>

      {/* Problem → Approach → Results */}
      {hasStructuredContent && (
        <div className="grid gap-6 lg:grid-cols-3">
          {project.problem && (
            <SectionCard label="01" title="Problem" delay={0}>
              {project.problem}
            </SectionCard>
          )}
          {project.approach && (
            <SectionCard label="02" title="Approach" delay={0.08}>
              {project.approach}
            </SectionCard>
          )}
          {project.results && (
            <SectionCard label="03" title="Results" delay={0.16}>
              {project.results}
            </SectionCard>
          )}
        </div>
      )}

      {/* Image Gallery */}
      {extraImages.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {extraImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.5)]"
            >
              <img
                alt={img.caption}
                src={img.src}
                loading="lazy"
                className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Videos */}
      {project.videos && project.videos.length > 0 && (
        <div className="space-y-6">
          {project.videos.map((vid, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
                {vid.caption}
              </div>
              <video className="w-full" controls playsInline preload="metadata">
                <source src={vid.src} type="video/mp4" />
              </video>
            </motion.div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 pt-4">
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10"
            to="/projects"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Projects
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10"
            to="/"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>

        <div className="flex gap-3 text-sm">
          {prevProject && (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/60 transition hover:bg-white/10 hover:text-white/90"
              to={`/projects/${prevProject.slug}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {prevProject.title}
            </Link>
          )}
          {nextProject && (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/60 transition hover:bg-white/10 hover:text-white/90"
              to={`/projects/${nextProject.slug}`}
            >
              {nextProject.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
