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
  bio: "I'm an EECS engineer at UC Berkeley who designs across mechanical, electrical, and software — from custom actuators to embedded field hardware. I turn hard, cross-disciplinary problems into things that actually run.",
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
  // TODO(adam): replace with your real YouTube channel URL.
  { label: "YouTube", href: "https://www.youtube.com/", kind: "youtube", note: "placeholder" },
  { label: "Email", href: "mailto:adamtang0715@gmail.com", kind: "email" },
];

export const contact = {
  email: "adamtang0715@gmail.com",
  phone: "(301) 275-6996",
  phoneHref: "tel:+13012756996",
};

// Long-form about, broken into skimmable paragraphs.
export const aboutParagraphs: string[] = [
  "At UC Berkeley I study Electrical Engineering & Computer Science with a minor in Bioengineering. I lead the engineering for Echeverri Lab's solar-powered Biodiversity Sensing Module — a rugged, satellite-IoT field system for wildlife tracking — and design solar array integration for CalSol, Berkeley's 11th-generation solar race car.",
  "As much as I love to learn, I love to lead. Before Berkeley I led the mechanical team for MUREX, our 6-DOF underwater ROV that placed 6th at the World Finals, and led a compact aquaponics unit with biofiltration and real-time ammonia/pH sensing — now a permanent food source for our dining hall.",
  "My engineering DNA is customer-centric builds, system-level thinking, and sustainability by design. I've received awards from NASA, the EPA, and ISEF for environmental-tech research, and represented my work as a youth delegate at the UN Climate Conference (COP28) in Dubai.",
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
