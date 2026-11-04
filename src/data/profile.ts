import { withBase } from "../lib/withBase";

export const profile = {
  name: "Adam Tang",
  // Pop-out hero line (Julien-style) + scannable role subtitle.
  heroLine: "I build machines.",
  role: "Mechatronics & Embedded Systems Engineer",
  affiliation: "UC Berkeley · EECS",
  disciplines: ["Mechatronics", "Embedded Systems", "Sustainability"],
  location: "Berkeley, CA",
  // Concise sticky-column bio — recruiters skim; keep it 2–3 sentences.
  bio: "EECS at UC Berkeley. I design and build hardware end to end — actuators, sensor nodes, RF systems — and write the software that runs it.",
  availability: "Open to Spring + Summer 2027 co-ops and internships (up to 8 months)",
  resume: withBase("/AdamTang_Resume.pdf"),
};

export const education = {
  school: "UC Berkeley",
  degree: "B.S. Electrical Engineering and Computer Sciences",
  minor: "Minor in Bioengineering",
  gpa: "3.91 / 4.00",
  graduation: "May 2028",
  honors: "Tau Beta Pi · Eta Kappa Nu (IEEE-HKN)",
  coursework: "EECS 16B (circuits, LTspice) · EECS 16A (signals) · CS 61C (computer architecture, C) · CS 61A (Python)",
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
  "I'm an EECS student at UC Berkeley who likes building things that move, sense and run on their own. Right now that's Kinema, a 6-DOF camera arm built on cycloidal actuators I designed, and BEACN, where I lead a team evaluating battery storage for a multi-hundred-site rollout. I also led hardware for Echeverri Lab's solar-powered, satellite-IoT biodiversity sensor.",
  "Most recently I interned at Eldaeon, an RF-sensing startup, building the drone-detection pipeline, antenna mount and power plan for a passive radar node. Before Berkeley, I was mechanical lead on MUREX, whose ROV placed 6th in the world at MATE 2024.",
  "Outside engineering, I founded a climate nonprofit that became a UNFCCC observer organization and sent me to COP28 in Dubai as a U.S. youth delegate. I'm looking for an engineering co-op or internship for Spring and Summer 2027.",
];

export type ExperienceEntry = {
  org: string;
  role: string;
  period: string;
  blurb: string;
  tags?: string[];
  /** Project page to link to, if there is one. */
  slug?: string;
};

export const experience: ExperienceEntry[] = [
  {
    org: "Eldaeon",
    role: "Embedded Systems & Hardware Integration Intern",
    period: "Dec 2025 — Aug 2026",
    blurb:
      "Built a real-time drone-detection pipeline on Raspberry Pi that cross-correlates RF Doppler returns with ADS-B and AIS tracks, designed a self-calibrating antenna pan-tilt, and wrote a power-sequencing daemon that cut projected draw 30.2% to fit a 15.4 W PoE budget.",
    tags: ["Python", "Raspberry Pi", "SDR", "Mechanism design"],
    slug: "eldaeon-passive-radar-system",
  },
  {
    org: "BEACN — UC Berkeley consulting",
    role: "Technical Project Manager & Systems Modeling Engineer",
    period: "Feb 2026 — Present",
    blurb:
      "Lead a 5-person team evaluating LFP, NMC and sodium-ion battery storage for GridPoint's multi-hundred-site rollout. Built a statistical energy model and GIS analysis that set efficiency targets against PUE for data-center firm Vigilent. Built BeacnReach, the form the club's PMs use for weekly client outreach.",
    tags: ["Energy modeling", "GIS", "Battery storage", "Team lead"],
    slug: "beacnreach",
  },
  {
    org: "CalSol — Berkeley Solar Racing",
    role: "Solar Engineering Project Manager",
    period: "Sep 2025 — May 2026",
    blurb:
      "Designed the solar array and bypass-diode layout for a projected +12% partial-shade efficiency gain, and the MPPT charge-controller enclosures in SolidWorks.",
    tags: ["Solar", "MPPT", "SolidWorks"],
    slug: "solar-array-optimization",
  },
  {
    org: "MUREX Exeter — MATE ROV",
    role: "Mechanical Lead",
    period: "Nov 2021 — Jun 2024",
    blurb:
      "Led a 6-person team building a 6-DOF underwater ROV and 7-DOF manipulator. Cut manufacturing cost 88% by moving outsourced parts to in-house CNC machining and 3D printing; placed 6th globally at MATE 2024 and set 10 records.",
    tags: ["CAD", "CNC", "Robotics", "Leadership"],
    slug: "murex-rov",
  },
];

export const leadership: ExperienceEntry = {
  org: "Innovation Towards the Future",
  role: "Founder & President — climate nonprofit",
  period: "Sep 2020 — Jun 2025",
  blurb:
    "Founded and ran the organization for five years: admitted as a UNFCCC observer organization, 3+ corporate partnerships, and selected from 5,000 applicant NGOs as a U.S. youth delegate to COP28 in Dubai.",
};

export type SkillGroup = { title: string; items: string[] };

// Mirrors the resume's skills block — every item is backed by a project or role on this site.
export const skillGroups: SkillGroup[] = [
  {
    title: "Mechanical",
    items: ["SolidWorks", "Fusion 360", "Onshape", "FEA", "Tolerance stack-ups", "Actuator design", "Compliant mechanisms", "DFM / DFA"],
  },
  {
    title: "Electrical",
    items: ["KiCad PCB design", "Board bring-up", "Analog signal conditioning", "BLDC drivers", "Encoders", "SDR", "MPPT"],
  },
  {
    title: "Embedded & software",
    items: ["C++", "Python", "Java", "Verilog", "TypeScript / React", "STM32H7", "ESP32-S3", "Raspberry Pi", "Real-time DSP", "AWS"],
  },
  {
    title: "Fabrication & test",
    items: ["CNC machining", "3D printing", "Rapid prototyping", "Assembly", "Bench and field testing", "Power budgeting"],
  },
];

export const awards: string[] = [
  "Winner, Best Enterprise Reinvention — Berkeley SCET Innovation Intelligence Hackathon (2026)",
  "Tau Beta Pi and Eta Kappa Nu (IEEE-HKN) engineering honor societies (2026)",
  "$1.5k Jacobs Ignite grant and CubeMars sponsorship for Kinema",
  "6th globally at MATE 2024 with MUREX",
  "U.S. youth delegate, COP28 (Dubai)",
  "Research recognized by NASA, the EPA and ISEF",
];
