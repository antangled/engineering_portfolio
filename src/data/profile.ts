import { withBase } from "../lib/withBase";

export const profile = {
  name: "Adam Tang",
  // Pop-out hero line (Julien-style) + scannable role subtitle.
  heroLine: "I build products.",
  role: "Mechatronics & Embedded Systems Engineer",
  affiliation: "UC Berkeley · EECS",
  disciplines: ["Mechatronics", "Embedded Systems", "Sustainability"],
  location: "Berkeley, CA",
  // Concise sticky-column bio — recruiters skim; keep it 2–3 sentences.
  // (Deliberately distinct from the hero supporting line — no overlap.)
  bio: "EECS at UC Berkeley. Right now I lead hardware for a solar-powered field sensor and Berkeley's solar race car — and build my own actuators and software in between.",
  resume: withBase("/AdamTang_Resume.pdf"),
};

export type SocialLink = {
  label: string;
  href: string;
  kind: "resume" | "linkedin" | "github" | "instagram" | "youtube" | "email";
  note?: string;
};

export const socialLinks: SocialLink[] = [
  { label: "Resume", href: profile.resume, kind: "resume" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/adam-tang-2374992a7", kind: "linkedin" },
  { label: "GitHub", href: "https://github.com/antangled", kind: "github" },
  { label: "Studio Instagram", href: "https://www.instagram.com/atangled_studio/", kind: "instagram" },
  // TODO(adam): re-add YouTube here once you have a real channel URL:
  // { label: "YouTube", href: "https://www.youtube.com/@yourchannel", kind: "youtube" },
  { label: "Email", href: "mailto:adamtang0715@gmail.com", kind: "email" },
];

export const contact = {
  email: "adamtang0715@gmail.com",
  phone: "(301) 275-6996",
  phoneHref: "tel:+13012756996",
};

// Long-form about, broken into skimmable paragraphs.
export const aboutParagraphs: string[] = [
  "I study EECS at UC Berkeley (minor: Bioengineering). I lead engineering for Echeverri Lab's solar-powered Biodiversity Sensing Module — a satellite-IoT wildlife tracker built to survive the field — and run solar-array integration for CalSol's 11th-gen race car.",
  "I lead as much as I build. I took MUREX's 6-DOF underwater ROV to a 6th-place World Finals finish as mechanical lead, and led a compact aquaponics unit with real-time ammonia/pH sensing that's now a permanent food source for our dining hall.",
  "The throughline: customer-centric, system-level, sustainable builds. My environmental-tech research has been recognized by NASA, the EPA, and ISEF — and I represented it as a youth delegate at COP28 in Dubai.",
];

export type ExperienceEntry = {
  org: string;
  role: string;
  period: string;
  blurb: string;
  tags?: string[];
};

export const experience: ExperienceEntry[] = [
  {
    org: "Eldaeon",
    role: "Embedded / Mechatronics Intern",
    period: "2025 — Present",
    blurb:
      "Build low-cost passive-radar hardware and custom SDR signal-processing pipelines for wide-area detection and tracking using ambient RF signals.",
    tags: ["Embedded", "RF", "Signal Processing"],
  },
  {
    org: "Echeverri Lab — UC Berkeley",
    role: "Lead Hardware Engineer",
    period: "2024 — Present",
    blurb:
      "Lead the embedded + power design of a solar-powered, satellite-IoT biodiversity sensor deployed autonomously in the field, running on-device AI for species classification.",
    tags: ["Embedded", "Power Electronics", "Edge AI"],
  },
  {
    org: "CalSol — Berkeley Solar Vehicle Team",
    role: "Solar Engineer",
    period: "2025 — Present",
    blurb:
      "Optimize solar-array layout, telemetry, and bypass-diode placement for the 11th-gen race car — raised partial-shade output by 12%.",
    tags: ["Solar", "Telemetry", "Simulation"],
  },
  {
    org: "MUREX Underwater Robotics",
    role: "Mechanical Team Lead",
    period: "2021 — 2023",
    blurb:
      "Led mechanical design of a 6-DOF competition ROV to a 6th-place finish at the World Finals.",
    tags: ["CAD", "Robotics", "Leadership"],
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Mechanical / CAD",
    items: ["Onshape", "Fusion 360", "SolidWorks", "ANSYS", "DFM / Tolerancing"],
  },
  {
    title: "Electrical / Embedded",
    items: ["KiCad PCB", "ARM Cortex-M", "ESP32", "Power Electronics", "C / C++"],
  },
  {
    title: "Software / Tools",
    items: ["Python", "TypeScript / React", "MATLAB", "Signal Processing", "Edge AI"],
  },
  {
    title: "Fabrication",
    items: ["3D Printing", "CNC Machining", "Soldering / Rework", "Rapid Prototyping"],
  },
];

export const awards: string[] = [
  "NASA — environmental-tech research award",
  "U.S. EPA — research recognition",
  "ISEF — international science & engineering fair",
  "COP28 — youth delegate, UN Climate Conference (Dubai)",
];
