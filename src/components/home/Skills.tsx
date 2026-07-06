import { motion } from "framer-motion";
import { skillGroups } from "../../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

export function Skills() {
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal-ink">Toolchain</p>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-ink-900">
          What I work with.
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease, delay: i * 0.06 }}
            className="rounded-3xl border border-ink-900/10 bg-surface p-6"
          >
            <p className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-500">{group.title}</p>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-[0.95rem] text-ink-700">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
