import { withBase } from "../lib/withBase";
import { getProject, type Project } from "./projects";

/**
 * Home "Recent builds" cards (v4). One takeaway per card: media, one line, the
 * role badge, three tools and ONE accent metric. Every metric must be one Adam
 * can defend from the project page (see the resume notes in projects.ts).
 */
export type FeaturedCard = {
  slug: string;
  /** Short display title (the project page keeps the long one). */
  title: string;
  line: string;
  metric: { value: string; label: string };
  tools: [string, string, string];
  /** Card still. Defaults to the project's cover. */
  image?: string;
  imageFit?: "cover" | "contain";
  /** Short muted loop that plays while the card is on screen. */
  clip?: string;
};

const cards: FeaturedCard[] = [
  {
    slug: "internal-cycloidal-actuator",
    title: "Kinema",
    line: "A 6-DOF camera arm that learns a shot by hand and replays it, built on a cycloidal actuator I designed.",
    metric: { value: "2 N·m", label: "bench-tested output torque" },
    tools: ["SolidWorks", "FEA", "BLDC control"],
    clip: withBase("/videos/clips/kinema-loop.mp4"),
  },
  {
    slug: "envoy",
    title: "Envoy",
    line: "An AI outreach assistant: a plain-English goal in, researched contacts and source-linked emails out.",
    metric: { value: "Winner", label: "Best Enterprise Reinvention, Berkeley SCET hackathon" },
    tools: ["Next.js", "Claude API", "Postgres"],
    image: withBase("/images/software/envoy-award.jpg"),
  },
  {
    slug: "polysynth-x",
    title: "PolySynth X",
    line: "A 12-key MPE keyboard and synth where every key bends its own pitch.",
    metric: { value: "12 keys", label: "each with its own pitch bend" },
    tools: ["STM32H7", "C++ DSP", "KiCad"],
    clip: withBase("/videos/clips/polysynth-loop.mp4"),
  },
  {
    slug: "biodiversity-sensing-module",
    title: "Biodiversity Sensing Module",
    line: "A weatherproof field node that identifies species on-device, built for UC Berkeley's Echeverri Lab.",
    metric: { value: "Solar", label: "powered, reporting over satellite IoT" },
    tools: ["ESP32-S3", "Edge AI", "Satellite IoT"],
  },
];

export type FeaturedItem = FeaturedCard & { project: Project };

export function featuredItems(): FeaturedItem[] {
  return cards
    .map((c) => {
      const project = getProject(c.slug);
      return project ? { ...c, project, image: c.image ?? project.cover } : null;
    })
    .filter(Boolean) as FeaturedItem[];
}

/** Shared-element name: the card image morphs into the project page's main tile. */
export const coverTransitionName = (slug: string) => `cover-${slug}`;
