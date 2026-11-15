import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Cpu, Hammer, Wrench, Zap } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { Grid } from "@/components/charts/grid";
import { useChartHover } from "@/components/charts/chart-context";
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from "@/components/charts/heatmap";
import SmoothTab from "@/components/kokonutui/smooth-tab";
import { DOMAINS, buildCalendar, datedProjectCount, tools, toolsByDomain, type Domain, type Tool } from "@/data/skills";
import { DUR, EASE, useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ICONS: Record<Domain, typeof Cpu> = {
  Mechanical: Wrench,
  Electrical: Zap,
  "Embedded & software": Cpu,
  "Fabrication & test": Hammer,
};

/* ------------------------------------------------------------ ranking */

/** Reports the hovered bar index up to the detail panel. */
function HoverReport({ onIndex }: { onIndex: (i: number) => void }) {
  const { tooltipData } = useChartHover();
  const i = tooltipData?.index;
  useEffect(() => {
    if (i != null) onIndex(i);
  }, [i, onIndex]);
  return null;
}

function Detail({ tool }: { tool: Tool }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tool.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: DUR.fast * 1.5, ease: EASE }}
        className="flex h-full flex-col"
      >
        <p className="font-mono text-xs uppercase tracking-wider text-mist-faint">{tool.domain}</p>
        <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-mist">{tool.name}</p>
        <p className="mt-1 text-sm text-mist-dim">
          <span className="font-mono text-signal">{tool.count}</span> project{tool.count === 1 ? "" : "s"} on this site
        </p>
        <p className="mt-5 text-pretty text-sm leading-relaxed text-mist/90">
          <span className="text-mist-faint">Proof: </span>
          {tool.proof}
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {tool.projects.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                data-cursor="link"
                onPointerDown={(e) => e.stopPropagation()}
                className="group flex items-center justify-between gap-3 rounded-xl border border-mist/10 px-3 py-2 text-sm text-mist transition-colors hover:border-signal hover:text-white"
              >
                <span className="truncate">{p.title}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-mist-faint transition-colors group-hover:text-signal" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}

function Ranking({ domain }: { domain: Domain }) {
  const list = toolsByDomain(domain);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const data = useMemo(() => list.map((t) => ({ name: t.name, count: t.count })), [list]);
  const tool = list[active] ?? list[0];
  const wide = useIsDesktop(640);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
      <div
        role="img"
        aria-label={`${domain} tools by number of projects: ${list.map((t) => `${t.name} ${t.count}`).join(", ")}`}
        className={cn("cursor-pointer", wide ? "[--bar-label-width:150px]" : "[--bar-label-width:112px]")}
        onClick={() => navigate(`/projects/${tool.proofSlug}`)}
        data-cursor="view"
        data-cursor-label="Open"
      >
        <BarChart
          data={data}
          xDataKey="name"
          orientation="horizontal"
          aspectRatio={wide ? `10 / ${Math.max(2.6, list.length * 0.72)}` : `10 / ${Math.max(5, list.length * 1.7)}`}
          margin={{ left: wide ? 160 : 118, right: wide ? 24 : 8, top: 8, bottom: 8 }}
          barGap={0.32}
        >
          <Grid vertical />
          <Bar
            dataKey="count"
            fill="var(--chart-line-primary)"
            lineCap={6}
            showValue
            valueLabelPosition="top"
            valueLabelFormatter={(v) => `${v}`}
            fadedOpacity={0.35}
          />
          <BarYAxis />
          <HoverReport onIndex={setActive} />
        </BarChart>
      </div>
      <div className="rounded-2xl border border-mist/10 bg-night-900/60 p-5">
        <Detail tool={tool} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- calendar */

const MONTH = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const SHORT_DOMAIN = ["Mechanical", "Electrical", "Embedded & SW", "Fab & test"];
// Signal-orange ramp on night; 0 = an empty well.
const LEVELS = ["#1a1d23", "#5a2a17", "#9a3b14", "#d84c14", "#ff5a1f", "#ff8a5a"];

function BuildCalendar() {
  const cols = useMemo(() => buildCalendar(), []);
  const { data, lookup } = useMemo(() => {
    const lookup = new Map<string, (typeof cols)[number][number]>();
    const data = cols.map((col, c) => ({
      bin: c,
      bins: col.map((cell, r) => {
        lookup.set(`${cell.y}-${cell.m}-${r}`, cell);
        return { bin: r, count: cell.projects.length, date: new Date(cell.y, cell.m, r + 1) };
      }),
    }));
    return { data, lookup };
  }, [cols]);
  const cellAt = (d: Date) => lookup.get(`${d.getFullYear()}-${d.getMonth()}-${d.getDate() - 1}`);
  const color = (n: number | null | undefined) => LEVELS[Math.min(n ?? 0, LEVELS.length - 1)];
  const activeMonths = cols.filter((c) => c.some((x) => x.projects.length)).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-mist">Build calendar</h3>
          <p className="mt-1 max-w-[56ch] text-sm text-mist-dim">
            Active builds per month and discipline, from the dates on {datedProjectCount} project pages.{" "}
            <span className="text-mist">
              {activeMonths} of {cols.length} months
            </span>{" "}
            had something on the bench.
          </p>
        </div>
      </div>
      <div data-lenis-prevent className="no-scrollbar -mx-2 mt-6 overflow-x-auto px-2">
        <div className="min-w-[760px]">
          <HeatmapInteractionProvider>
            <HeatmapInteractionBoundary>
              <div className="flex w-full flex-col items-stretch gap-3">
                <HeatmapChart
                  className="w-full"
                  data={data}
                  layout="fluid"
                  gap={3}
                  margin={{ left: 104, top: 22, right: 0, bottom: 0 }}
                  aspectRatio="59 / 6.2"
                >
                  <HeatmapCells colorScale={color} cornerRadius={3} hideGhostCells={false} />
                  <HeatmapXAxis tickLabel={(d) => (d.getMonth() === 0 ? String(d.getFullYear()) : null)} className="font-mono" />
                  <HeatmapYAxis labels={SHORT_DOMAIN} className="font-mono" />
                  <HeatmapTooltip
                    formatTitle={(d) => MONTH.format(d)}
                    formatSubtitle={(d) => DOMAINS[d.getDate() - 1]}
                    formatLabel={(count, d) => {
                      const cell = cellAt(d);
                      if (!count || !cell) return "Nothing on the bench";
                      return (
                        <span className="block">
                          <span className="font-medium">
                            {count} build{count === 1 ? "" : "s"}
                          </span>
                          <span className="mt-1 block text-xs text-chart-tooltip-muted">
                            {cell.projects.map((p) => p.title.split(":")[0]).join(" · ")}
                          </span>
                        </span>
                      );
                    }}
                  />
                </HeatmapChart>
                <HeatmapLegend colorScale={color} lessLabel="0" moreLabel="5 builds" />
              </div>
            </HeatmapInteractionBoundary>
          </HeatmapInteractionProvider>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ all tools */

function AllTools() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-cursor="link"
        className="inline-flex items-center gap-2 rounded-full border border-mist/20 px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:border-signal hover:text-white"
      >
        {open ? "Hide the full list" : `Show all ${tools.length} tools, with proof`}
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: DUR.base, ease: EASE }} aria-hidden>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid gap-x-10 gap-y-8 pt-8 md:grid-cols-2">
              {DOMAINS.map((d) => (
                <div key={d}>
                  <p className="font-mono text-xs uppercase tracking-wider text-mist-faint">{d}</p>
                  <ul className="mt-3 divide-y divide-mist/10 border-t border-mist/10">
                    {toolsByDomain(d).map((t) => (
                      <li key={t.name}>
                        <Link
                          to={`/projects/${t.proofSlug}`}
                          data-cursor="link"
                          className="group grid grid-cols-[9.5rem_1fr_auto] items-baseline gap-3 py-2.5 text-sm"
                        >
                          <span className="font-medium text-mist">{t.name}</span>
                          <span className="text-pretty text-mist-dim transition-colors group-hover:text-mist">{t.proof}</span>
                          <span className="font-mono text-xs text-signal">×{t.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------------- export */

export default function SkillsCharts() {
  const items = DOMAINS.map((d) => ({ id: d, title: d, icon: ICONS[d], content: <Ranking domain={d} /> }));
  return (
    <div className="space-y-16">
      <SmoothTab
        items={items}
        label="Tool groups"
        activeColor="bg-signal"
        activeTextColor="text-white"
        className={cn("max-w-none gap-6")}
      />
      <BuildCalendar />
      <AllTools />
    </div>
  );
}
