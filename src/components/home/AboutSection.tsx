import { motion } from "framer-motion";
import { profile, aboutParagraphs, experience, awards, contact } from "../../data/profile";
import { withBase } from "../../lib/withBase";
import { SocialLinks } from "./SocialLinks";

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-[5vw] py-24 lg:py-32">
      <div className="lg:flex lg:gap-16">
        {/* Sticky identity column (Julien pattern) */}
        <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-[34%] lg:self-start">
          <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-3xl bg-ink-900/5 lg:aspect-square">
            <img
              src={withBase("/images/about-1.jpg")}
              alt="Adam Tang standing at a red torii gate"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{profile.name}</h2>
          <p className="mt-1 text-sm text-ink-500">{profile.role}</p>
          <p className="mt-5 text-pretty text-[0.95rem] leading-relaxed text-ink-700">{profile.bio}</p>

          <SocialLinks className="mt-6" />

          <div className="mt-6 space-y-1 font-mono text-xs text-ink-500">
            <a href={`mailto:${contact.email}`} data-cursor="link" className="block hover:text-signal-ink">
              {contact.email}
            </a>
            <a href={contact.phoneHref} data-cursor="link" className="block hover:text-signal-ink">
              {contact.phone}
            </a>
          </div>
        </aside>

        {/* Scrolling content */}
        <div className="mt-16 lg:mt-0 lg:w-[66%]">
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-[2.6rem]">
              Built to ship — from the gearbox to the field.
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-pretty text-[1.05rem] leading-relaxed text-ink-700">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* Experience */}
          <Reveal>
            <h3 className="mt-16 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
              <span className="h-px w-7 bg-ink-900/25" aria-hidden />
              Experience
            </h3>
          </Reveal>
          <div className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {experience.map((exp, i) => (
              <Reveal key={exp.org} delay={i * 0.04}>
                <div className="group grid gap-2 py-6 sm:grid-cols-[1fr_2fr] sm:gap-8">
                  <div>
                    <p className="font-medium text-ink-900">{exp.org}</p>
                    <p className="font-mono text-xs uppercase tracking-wider text-ink-500">{exp.period}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-signal-ink">{exp.role}</p>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-ink-700">{exp.blurb}</p>
                    {exp.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-ink-900/[0.04] px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-500"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Awards */}
          <Reveal>
            <h3 className="mt-16 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
              <span className="h-px w-7 bg-ink-900/25" aria-hidden />
              Recognition
            </h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {awards.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-surface px-4 py-3 text-sm text-ink-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
