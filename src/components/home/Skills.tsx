import { motion } from "framer-motion";
import { CircuitBoard, Cog, Cpu, Wrench, type LucideIcon } from "lucide-react";
import { skillGroups } from "../../data/profile";
import { SheetTicks } from "./SheetTicks";
import { cn } from "../../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  Mechanical: Cog,
  Electrical: CircuitBoard,
  "Embedded & software": Cpu,
  "Fabrication & test": Wrench,
};

export function Skills() {
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
  return (
    <section className="mx-auto max-w-[1400px] px-[5vw] pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease }}
        className="flex items-baseline justify-between gap-6"
      >
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-ink-900">What I work with.</h2>
        <span className="font-mono text-xs text-ink-500">{total} tools &amp; skills</span>
      </motion.div>

      {/* One panel, four quadrants divided by hairlines — a spec panel, not a card grid */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
        className="relative mt-8 rounded-[2rem] border border-line bg-surface shadow-[0_1px_0_rgba(21,23,27,0.04),0_40px_90px_-60px_rgba(21,23,27,0.35)]"
      >
        <SheetTicks />
        <div className="grid sm:grid-cols-2">
          {skillGroups.map((group, i) => {
            const Icon = ICONS[group.title] ?? Cog;
            return (
              <div
                key={group.title}
                className={cn(
                  "p-6 sm:p-8",
                  i > 0 && "border-t border-line",
                  i === 1 && "sm:border-t-0",
                  i % 2 === 1 && "sm:border-l"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="flex items-center gap-2.5 font-medium text-ink-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal-ink">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {group.title}
                  </h3>
                  <span className="font-mono text-xs text-ink-500">{String(group.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-line bg-paper/70 px-3 py-1.5 text-sm text-ink-700 transition-colors hover:border-signal/40 hover:text-ink-900"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
