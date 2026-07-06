import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile, socialLinks, contact } from "../../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-night-900 text-mist">
      <div className="pointer-events-none absolute inset-0 bp-grid opacity-40" />
      <div className="relative mx-auto max-w-[1400px] px-[5vw] py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-glow">Let's talk</p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2.4rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
            Let's build something that matters.
          </h2>
          <a
            href={`mailto:${contact.email}`}
            data-cursor="link"
            className="group mt-8 inline-flex items-center gap-3 text-xl text-mist transition-colors hover:text-signal sm:text-2xl"
          >
            {contact.email}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </motion.div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-mist/10 pt-8">
          {socialLinks.map((l) => (
            <a
              key={l.kind}
              href={l.href}
              target={l.kind === "email" ? undefined : "_blank"}
              rel="noreferrer"
              data-cursor="link"
              className="inline-flex items-center py-2 font-mono text-xs uppercase tracking-wider text-mist-dim transition-colors hover:text-signal"
            >
              {l.label}
            </a>
          ))}
          <span className="ml-auto font-mono text-xs text-mist-faint">
            © {profile.name} · Built in React
          </span>
        </div>
      </div>
    </footer>
  );
}
