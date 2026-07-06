import { motion } from "framer-motion";
import { skillGroups } from "../../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

export function Skills() {
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] pb-8">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
        className="text-balance font-display text-3xl font-semibold tracking-tight text-ink-900"
      >
        What I work with.
      </motion.h2>

      {/* Spec-sheet rows (not a card grid): category label + skill chips, hairline-divided. */}
      <div className="mt-10 divide-y divide-ink-900/10 border-y border-ink-900/10">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease, delay: i * 0.05 }}
            className="grid gap-4 py-6 sm:grid-cols-[minmax(0,0.26fr)_1fr] sm:items-center sm:gap-10"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-ink-500">{group.title}</p>
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-ink-900/12 bg-surface px-3.5 py-1.5 text-sm text-ink-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
