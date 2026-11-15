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
  bio: "EECS at UC Berkeley. I design and build hardware end to end — actuators, sensor nodes, RF systems — and write the software that runs it.",
  availability: "Open to Spring + Summer 2027 co-ops and internships (up to 8 months)",
  resume: withBase("/AdamTang_Resume.pdf"),
};

/** Departure-board status line in the hero (v4). Keep each ≤ 30 characters. */
export const heroStatus = ["Now building: Kinema 6-DOF arm", "Open: Spring + Summer 2027"];

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

/**
 * v4 About: one ~60-word paragraph. Segments with `to` are proof phrases — drawn
 * on with a marker as the paragraph scrolls in, and linked to the project.
 */
export const aboutShort: { text: string; to?: string }[] = [
  { text: "I'm an EECS student at Berkeley who builds things that move, sense and run on their own. Right now that's Kinema, a camera arm on cycloidal actuators I designed. This year I built the " },
  { text: "drone-detection pipeline at Eldaeon", to: "eldaeon-passive-radar-system" },
  { text: ", and with Envoy my team of two " },
  { text: "won Best Enterprise Reinvention", to: "envoy" },
  { text: ". Before Berkeley, I led mechanical design for an ROV that placed " },
  { text: "6th in the world at MATE", to: "murex-rov" },
  { text: "." },
];

/** v4 About: the facts line that replaces the table. */
export const factsLine = ["B.S. EECS", "Minor Bioengineering", "3.91 GPA", "Tau Beta Pi", "HKN", "May 2028"];

/** v4 Recognition: three photo cards. */
export const recognition: {
  title: string;
  org: string;
  year: string;
  image?: string;
  imagePosition?: string;
  detail: string;
  slug?: string;
}[] = [
  {
    title: "Best Enterprise Reinvention",
    org: "Berkeley SCET Innovation Intelligence Hackathon",
    year: "2026",
    image: withBase("/images/software/envoy-award.jpg"),
    imagePosition: "50% 40%",
    detail: "Won the AI-Native Enterprise track with Envoy, an outreach assistant I built end to end with Jiwoo Jung.",
    slug: "envoy",
  },
  {
    title: "6th in the world",
    org: "MATE ROV World Championship",
    year: "2024",
    image: withBase("/images/projects/MUREX/murex-worlds-team.jpg"),
    imagePosition: "50% 45%",
    detail: "Mechanical lead on MUREX: a 6-DOF ROV and 7-DOF manipulator, with manufacturing cost cut 88% by bringing parts in-house.",
    slug: "murex-rov",
  },
  {
    title: "U.S. youth delegate",
    org: "COP28, Dubai",
    year: "2023",
    // Adam at the COP28 venue (Expo City Dubai), 30 Nov 2023; metadata stripped
    image: withBase("/images/about/cop28-selfie.jpg"),
    imagePosition: "35% 45%",
    detail: "Selected from 5,000 applicant NGOs after founding a climate nonprofit that became a UNFCCC observer organization.",
  },
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

export type Award = { kind: string; text: string; year?: string };

export const awards: Award[] = [
  { kind: "Award", text: "Winner, Best Enterprise Reinvention — Berkeley SCET Innovation Intelligence Hackathon", year: "2026" },
  { kind: "Honor", text: "Tau Beta Pi and Eta Kappa Nu (IEEE-HKN) engineering honor societies", year: "2026" },
  { kind: "Grant", text: "$1.5k Jacobs Ignite grant and CubeMars sponsorship for Kinema", year: "2026" },
  { kind: "Competition", text: "6th globally at the MATE ROV World Championship with MUREX", year: "2024" },
  { kind: "Delegate", text: "U.S. youth delegate to COP28, Dubai", year: "2023" },
  { kind: "Research", text: "Microplastics research recognized by NASA, the EPA and ISEF" },
];
