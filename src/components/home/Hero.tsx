import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin } from "lucide-react";
import { profile } from "../../data/profile";
import { withBase } from "../../lib/withBase";

const ease = [0.22, 1, 0.36, 1] as const;

/** Per-line mask reveal: each line rises into view from behind a clipped edge. */
function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="reveal-mask">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] pt-28 lg:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="relative overflow-hidden rounded-[2.5rem]"
        style={{ minHeight: "clamp(520px, 78vh, 680px)", background: "#878a8d" }}
      >
        {/* Hero photo (left) + a horizontally-mirrored copy (right). Because the
            mirror's edge pixels match the original's exactly, the studio-gray
            backdrop continues with no seam — and only the mirrored gray shows. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease }}
          className="absolute inset-0"
        >
          <img
            src={withBase("/images/feature-v3.jpg")}
            alt="Adam Tang"
            className="absolute inset-y-0 left-0 h-full w-full object-cover lg:w-[72%]"
            style={{ objectPosition: "center 30%" }}
          />
          <img
            src={withBase("/images/feature-v3.jpg")}
            alt=""
            aria-hidden
            className="absolute inset-y-0 left-[72%] hidden h-full w-[72%] object-cover lg:block"
            style={{ objectPosition: "center 30%", transform: "scaleX(-1)" }}
          />
        </motion.div>

        {/* Scrim — bottom-dark on mobile, right-dark on desktop, so white type reads */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/75" />

        {/* Text — bottom on mobile, right-of-center on desktop */}
        <div className="relative z-10 flex h-full min-h-[inherit] items-end p-8 sm:p-10 lg:items-center lg:justify-end lg:p-14 xl:p-16">
          <div className="w-full text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] lg:w-[52%]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-5 flex items-center gap-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 p-[3px] shadow-sm">
                <img src={withBase("/images/berkeley-seal.svg")} alt="UC Berkeley seal" className="h-full w-full" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/85">
                {profile.affiliation}
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
              <Line delay={0.05}>I build</Line>
              <Line delay={0.14}>
                products<span className="text-signal">.</span>
              </Line>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
            >
              <p className="mt-5 text-balance text-xl font-medium">{profile.role}</p>
              <p className="mt-3 max-w-md text-pretty text-[0.95rem] leading-relaxed text-white/85">
                From custom actuators to embedded field hardware to full-stack software — I turn hard
                problems into things that actually run.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/projects"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors duration-300 hover:bg-signal hover:text-white"
                >
                  View my work
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://www.linkedin.com/in/adam-tang-2374992a7"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors duration-300 hover:border-signal hover:bg-signal"
                >
                  <Linkedin className="h-[1.15rem] w-[1.15rem]" />
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs uppercase tracking-widest">
                {profile.disciplines.map((d) => (
                  <span key={d} className="rounded-full border border-white/30 px-3 py-2 text-white/90">
                    {d}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
