import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { type Project } from "../../data/projects";

interface TimelineCardProps {
  project: Project;
  index: number;
  isLeft: boolean;
}

export function TimelineCard({ project, index, isLeft }: TimelineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      className="group relative"
    >
      {/* Connector line from card edge to timeline — desktop only */}
      <div
        className="pointer-events-none absolute top-10 hidden lg:flex items-center"
        style={{
          width: 50,
          ...(isLeft ? { right: -50 } : { left: -50 }),
        }}
      >
        {/* Line + arrowhead pointing toward timeline */}
        <svg
          width="50"
          height="12"
          viewBox="0 0 50 12"
          fill="none"
          className="w-full"
          style={isLeft ? undefined : { transform: "scaleX(-1)" }}
        >
          {/* Horizontal line */}
          <line
            x1="0"
            y1="6"
            x2="40"
            y2="6"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Arrowhead */}
          <path
            d="M 38 2 L 48 6 L 38 10"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <Link
        to={`/projects/${project.slug}`}
        className="block overflow-hidden rounded-[2rem] border border-white/10 bg-[#1d2027]/75 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_30px_100px_-50px_rgba(0,0,0,0.7)]"
      >
        {/* Project Image */}
        <div className="relative h-[200px] overflow-hidden">
          <img
            alt={project.title}
            src={project.image}
            loading={index < 2 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d2027] via-transparent to-transparent" />

          {/* Status indicator */}
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-[#1d2027]/70 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.3em] backdrop-blur-sm">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                project.status === "active" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" : "bg-white/40"
              }`}
            />
            {project.status === "active" ? "Active" : "Completed"}
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-3 px-6 pb-6 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug">{project.title}</h3>
          </div>

          {/* Duration */}
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">{project.duration}</p>

          {/* Description */}
          <p className="text-sm leading-relaxed text-white/65">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View Details */}
          <div className="flex items-center gap-1.5 pt-1 text-xs uppercase tracking-[0.3em] text-white/40 transition group-hover:text-white/70">
            View Details
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
