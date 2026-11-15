import { lazy, Suspense } from "react";
import { useNear } from "@/lib/useNear";
import { projects } from "@/data/projects";
import { tools } from "@/data/skills";
import { CountUp } from "../motion/CountUp";
import { Reveal } from "../motion/Reveal";

// Charts (Bklit + d3) are a separate chunk, fetched only when the section nears the viewport.
const SkillsCharts = lazy(() => import("./SkillsCharts"));

const firstYear = Math.min(...projects.map((p) => p.year));

/**
 * Phase 5, Plan A: data-backed skills on a night panel. Every number is counted
 * from the project pages (src/data/skills.ts), not self-rated.
 */
export function Skills() {
  const [ref, near] = useNear<HTMLDivElement>();
  const stats = [
    { value: String(projects.length), label: "projects on this site" },
    { value: String(tools.length), label: "tools, each tied to proof" },
    { value: String(new Date().getFullYear() - firstYear), label: "years of builds" },
  ];

  return (
    <section id="skills" className="mx-auto max-w-[1400px] px-[5vw] pb-24 lg:pb-32">
      <div className="dark relative overflow-hidden rounded-[2.5rem] bg-night-900 px-6 py-14 text-mist sm:px-10 lg:px-14 lg:py-20">
        <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-signal/15 blur-[120px]" />

        <div className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tight">
                <Reveal kind="mask-line">Toolchain.</Reveal>
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-[52ch] text-pretty text-lg leading-relaxed text-mist-dim">
                  Ranked by how many projects on this site used each tool. Counted from the project pages, not
                  self-rated. Hover a bar to see the projects; click it to open the proof.
                </p>
              </Reveal>
            </div>
            <dl className="grid grid-cols-3 gap-4 lg:col-span-5">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.1 + i * 0.06}>
                  <div className="border-l border-mist/15 pl-4">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-none text-mist">
                      <CountUp value={s.value} />
                    </dd>
                    <p aria-hidden className="mt-2 text-xs leading-snug text-mist-faint sm:text-sm">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <div ref={ref} className="mt-14 min-h-[520px]">
            {near && (
              <Suspense fallback={<div className="h-[520px] animate-pulse rounded-2xl bg-white/[0.03]" />}>
                <SkillsCharts />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
