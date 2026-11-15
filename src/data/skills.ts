import { projects, type Project } from "./projects";

/**
 * Skills, v4 Plan A: every number is computed from the project pages on this site.
 * A tool's count = how many projects list one of its `match` tags. Nothing here is
 * self-rated, and every `proof` line points at a project that shows the work.
 */

export const DOMAINS = ["Mechanical", "Electrical", "Embedded & software", "Fabrication & test"] as const;
export type Domain = (typeof DOMAINS)[number];

type ToolDef = {
  name: string;
  domain: Domain;
  /** Project tags that count as using this tool (case-insensitive, exact). */
  match: string[];
  proof: string;
  proofSlug: string;
};

const TOOL_DEFS: ToolDef[] = [
  // Mechanical
  { name: "SolidWorks", domain: "Mechanical", match: ["SolidWorks"], proof: "Kinema's actuator housing, validated with FEA", proofSlug: "internal-cycloidal-actuator" },
  { name: "Onshape", domain: "Mechanical", match: ["Onshape"], proof: "PolySynth X's compliant keybed", proofSlug: "polysynth-x" },
  { name: "Mechanism design", domain: "Mechanical", match: ["Mechanism design", "Manipulator design", "Compliant mechanisms"], proof: "A self-calibrating antenna pan-tilt at Eldaeon", proofSlug: "eldaeon-passive-radar-system" },
  { name: "Fusion 360", domain: "Mechanical", match: ["Fusion 360"], proof: "The dining-hall aquaponics system", proofSlug: "compact-automated-aquaponics" },
  { name: "FEA", domain: "Mechanical", match: ["FEA"], proof: "Kinema's housing, checked before machining", proofSlug: "internal-cycloidal-actuator" },
  { name: "Tolerance stack-ups", domain: "Mechanical", match: ["Tolerance stack-ups"], proof: "Cycloid and pin fits for Kinema's 10:1 reduction", proofSlug: "internal-cycloidal-actuator" },

  // Electrical
  { name: "Power systems", domain: "Electrical", match: ["Power budgeting", "Solar power", "Buck converters", "MPPT", "Solar arrays", "Bypass diodes"], proof: "A power plan for a 15.4 W PoE budget at Eldaeon", proofSlug: "eldaeon-passive-radar-system" },
  { name: "Sensor integration", domain: "Electrical", match: ["Sensors", "Sensor integration"], proof: "The biodiversity node's field sensor suite", proofSlug: "biodiversity-sensing-module" },
  { name: "SDR / RF", domain: "Electrical", match: ["SDR", "Passive radar (blah2)", "ADS-B / AIS"], proof: "Drone detection from RF Doppler at Eldaeon", proofSlug: "eldaeon-passive-radar-system" },
  { name: "KiCad PCB", domain: "Electrical", match: ["KiCad"], proof: "PolySynth X's board, 3+ revisions", proofSlug: "polysynth-x" },
  { name: "Motor control", domain: "Electrical", match: ["BLDC control", "Absolute encoders"], proof: "BLDC drive and absolute encoders on Kinema's joint", proofSlug: "internal-cycloidal-actuator" },

  // Embedded & software
  { name: "TypeScript", domain: "Embedded & software", match: ["TypeScript"], proof: "Envoy, end to end", proofSlug: "envoy" },
  { name: "React / Next.js", domain: "Embedded & software", match: ["React", "React 19", "Next.js 16"], proof: "Envoy's app and this site", proofSlug: "envoy" },
  { name: "Python", domain: "Embedded & software", match: ["Python"], proof: "Fantom Finder's radar fusion service", proofSlug: "fantom-finder" },
  { name: "Databases", domain: "Embedded & software", match: ["Drizzle + Postgres", "Supabase", "SQLite"], proof: "Envoy's Postgres schema", proofSlug: "envoy" },
  { name: "ESP32", domain: "Embedded & software", match: ["ESP32", "ESP32-S3"], proof: "On-device species ID on an ESP32-S3", proofSlug: "biodiversity-sensing-module" },
  { name: "LLM APIs", domain: "Embedded & software", match: ["Claude API", "Gemini"], proof: "Envoy's research and drafting steps", proofSlug: "envoy" },
  { name: "C++ / STM32", domain: "Embedded & software", match: ["C++", "STM32H7"], proof: "Real-time DSP firmware for PolySynth X", proofSlug: "polysynth-x" },
  { name: "Raspberry Pi", domain: "Embedded & software", match: ["Raspberry Pi"], proof: "Eldaeon's detection pipeline", proofSlug: "eldaeon-passive-radar-system" },

  // Fabrication & test
  { name: "3D printing", domain: "Fabrication & test", match: ["3D printing"], proof: "7+ Kinema prototypes", proofSlug: "internal-cycloidal-actuator" },
  { name: "CNC machining", domain: "Fabrication & test", match: ["CNC machining"], proof: "MUREX parts brought in-house, 88% cheaper", proofSlug: "murex-rov" },
  { name: "Closed-loop control", domain: "Fabrication & test", match: ["Closed-loop control"], proof: "Fish and plant health in the aquaponics system", proofSlug: "compact-automated-aquaponics" },
  { name: "Experiment design", domain: "Fabrication & test", match: ["Experiment design"], proof: "The microplastics field study", proofSlug: "microplastics-research" },
];

export type Tool = Omit<ToolDef, "match"> & { projects: Project[]; count: number };

const norm = (s: string) => s.trim().toLowerCase();

export const tools: Tool[] = TOOL_DEFS.map(({ match, ...t }) => {
  const keys = new Set(match.map(norm));
  const used = projects.filter((p) => p.tags.some((tag) => keys.has(norm(tag))));
  return { ...t, projects: used, count: used.length };
}).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export const toolsByDomain = (d: Domain) => tools.filter((t) => t.domain === d);

/** Domains each project touches, through the tools it lists. */
const projectDomains = new Map<string, Set<Domain>>();
for (const t of tools) for (const p of t.projects) {
  if (!projectDomains.has(p.slug)) projectDomains.set(p.slug, new Set());
  projectDomains.get(p.slug)!.add(t.domain);
}

// ---- Build calendar ------------------------------------------------------

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** "Present" resolves to the build month. */
const NOW = new Date();

type YM = { y: number; m: number };

/** Parse "Jun 2026 — Present", "Oct 2026", "Mar — May 2026". Year-only dates return null (no month precision). */
export function parseDuration(d: string): { start: YM; end: YM } | null {
  const parts = d.split(/[—–-]/).map((s) => s.trim()).filter(Boolean);
  const read = (s: string): { m?: number; y?: number; present?: boolean } => {
    if (/present/i.test(s)) return { present: true };
    const mm = s.match(/([A-Za-z]{3})[a-z]*/);
    const yy = s.match(/(\d{4})/);
    return { m: mm ? MONTHS.indexOf(mm[1].toLowerCase()) : undefined, y: yy ? +yy[1] : undefined };
  };
  const a = read(parts[0]);
  const b = parts[1] ? read(parts[1]) : a;
  const end: YM | null = b.present ? { y: NOW.getFullYear(), m: NOW.getMonth() } : b.m != null && b.m >= 0 && b.y ? { y: b.y, m: b.m } : null;
  if (!end || a.m == null || a.m < 0) return null;
  const start = { y: a.y ?? end.y, m: a.m };
  return { start, end };
}

const idx = ({ y, m }: YM) => y * 12 + m;

export const CALENDAR_START: YM = { y: 2022, m: 0 };
export const CALENDAR_END: YM = { y: NOW.getFullYear(), m: NOW.getMonth() };

export type CalendarCell = { y: number; m: number; domain: Domain; projects: Project[] };

/** One column per month, one row per domain: which builds were active, using that discipline. */
export function buildCalendar(): CalendarCell[][] {
  const dated = projects
    .map((p) => ({ p, r: parseDuration(p.duration) }))
    .filter((x): x is { p: Project; r: { start: YM; end: YM } } => x.r !== null);
  const cols: CalendarCell[][] = [];
  for (let i = idx(CALENDAR_START); i <= idx(CALENDAR_END); i++) {
    const y = Math.floor(i / 12);
    const m = i % 12;
    cols.push(
      DOMAINS.map((domain) => ({
        y,
        m,
        domain,
        projects: dated
          .filter(({ p, r }) => idx(r.start) <= i && i <= idx(r.end) && projectDomains.get(p.slug)?.has(domain))
          .map(({ p }) => p),
      }))
    );
  }
  return cols;
}

/** Projects with month-precise dates (the ones the calendar can place). */
export const datedProjectCount = projects.filter((p) => parseDuration(p.duration)).length;
