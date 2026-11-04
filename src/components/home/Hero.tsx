import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Linkedin } from "lucide-react";
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
    <section className="mx-auto max-w-[1400px] px-[5vw] pt-[4.5rem] lg:pt-24">
      {/* Height leaves room for the build strip below to land in the first viewport */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 lg:min-h-[clamp(460px,62vh,600px)] lg:bg-studio"
      >
        {/* Hero photo (left) + a horizontally-mirrored copy (right). Because the
            mirror's edge pixels match the original's exactly, the studio-gray
            backdrop continues with no seam — and only the mirrored gray shows.
            Below lg the photo is a head-and-shoulders band with the text underneath,
            so the copy never sits on the face. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease }}
          className="relative h-[clamp(210px,31vh,300px)] lg:absolute lg:inset-0 lg:h-auto"
        >
          <img
            src={withBase("/images/feature-v3.jpg")}
            alt="Adam Tang"
            decoding="async"
            className="absolute inset-y-0 left-0 h-full w-full object-cover object-[34%_22%] lg:w-[72%] lg:object-[center_30%]"
          />
          <img
            src={withBase("/images/feature-v3.jpg")}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-y-0 left-[72%] hidden h-full w-[72%] object-cover lg:block"
            style={{ objectPosition: "center 30%", transform: "scaleX(-1)" }}
          />

          {/* Small screens: fade the photo into the text panel below */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900 to-transparent lg:hidden" />
        </motion.div>

        {/* Desktop scrim — right-dark, so white type reads over the mirrored backdrop */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-black/20 to-black/75 lg:block" />

        {/* Text — bottom on mobile, right-of-center on desktop */}
        <div className="relative z-10 -mt-6 px-6 pb-7 sm:px-10 sm:pb-10 lg:mt-0 lg:flex lg:h-full lg:min-h-[inherit] lg:items-center lg:justify-end lg:px-14 lg:py-10 xl:px-16 xl:py-12">
          <div className="w-full text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] lg:w-[52%]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-4 flex items-center gap-2.5 lg:mb-5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 p-[3px] shadow-sm">
                <img src={withBase("/images/berkeley-seal.svg")} alt="UC Berkeley seal" className="h-full w-full" />
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.25em]">
                <span className="font-semibold text-white">{profile.name}</span>
                <span className="text-white/55"> · {profile.affiliation}</span>
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
              <Line delay={0.05}>I build</Line>
              <Line delay={0.14}>
                machines<span className="text-signal">.</span>
              </Line>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
            >
              <p className="mt-4 text-balance text-xl font-medium lg:mt-5">{profile.role}</p>
              <p className="mt-2 max-w-md text-pretty text-base leading-relaxed text-white/90 lg:mt-3 lg:text-lg">
                From cycloidal actuators to satellite-IoT field sensors and RF drone detection — EECS
                at Berkeley, open to Spring + Summer 2027 co-ops.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/projects"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink-900 transition-colors duration-300 hover:bg-signal hover:text-white"
                >
                  View my work
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/45 px-5 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-signal hover:text-signal"
                >
                  <Download className="h-4 w-4" />
                  Résumé
                </a>
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

              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[0.65rem] uppercase tracking-wider sm:text-xs sm:tracking-widest">
                {profile.disciplines.map((d) => (
                  <span key={d} className="rounded-full border border-white/30 px-2.5 py-1.5 text-white/90 sm:px-3 sm:py-2">
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
