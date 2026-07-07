import { withBase } from "../lib/withBase";

export type Media = {
  type: "image" | "video";
  src: string;
  caption?: string;
  /** Render as a mid-page feature (above Problem→Approach→Result) instead of in the media row. */
  feature?: boolean;
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  category: "hardware" | "software";
  title: string;
  /** One-line recruiter hook shown on the gallery tile + detail hero. */
  tagline: string;
  /** Concise, recruiter-optimized summary (≈2 sentences). */
  summary: string;
  /** Quantified, metric-forward impact bullets. */
  impact: string[];
  /** Gallery poster image. */
  cover: string;
  /** Optional muted loop that cross-fades in on hover (Baptiste pattern). */
  coverVideo?: string;
  /** Instagram reel embed URL (cycloidal actuator). */
  embedReel?: string;
  duration: string;
  year: number;
  order: number;
  status: "active" | "completed" | "concept";
  tags: string[];
  role?: string;
  problem?: string;
  approach?: string;
  results?: string;
  media?: Media[];
  links?: ProjectLink[];
  /** True when `cover` is a styled placeholder rather than a real asset. */
  placeholder?: boolean;
  /** Lead the detail page with the media rows (photos + captions) in place of the standalone cover hero. */
  mediaFirst?: boolean;
};

// ── Hardware ─────────────────────────────────────────────────────────────────
const hardware: Project[] = [
  {
    slug: "internal-cycloidal-actuator",
    category: "hardware",
    title: "Internal Cycloidal Actuator",
    tagline: "A compact, high-torque robotic actuator designed from the gearbox up.",
    summary:
      "Designed and built a fully custom internal cycloidal drive that integrates the motor, a 10:1 reduction stage, and absolute encoding into one compact housing — engineered for high torque density and near-zero backlash. My most recent and most ambitious mechatronics build.",
    // TODO(adam): confirm/replace the remaining placeholder specs with measured values.
    impact: [
      "10:1 cycloidal reduction",
      "Near-zero backlash (cycloidal vs. spur)",
      "~30% lighter than an equivalent harmonic drive",
      "Closed-loop position control with absolute encoding",
    ],
    cover: withBase("/images/projects/Cycloidal/cycloidal-main.jpg"),
    embedReel: "https://www.instagram.com/reel/DaE58a3O0D8/",
    duration: "2026 — Present",
    year: 2026,
    order: 1,
    status: "active",
    tags: ["Mechatronics", "CAD", "Robotics", "Control Systems"],
    role: "Sole designer & builder — mechanical design, motor selection, encoder integration, control firmware, fabrication & assembly.",
    problem:
      "Off-the-shelf robotic actuators force a trade between torque density, backlash, and cost. Harmonic drives are precise but expensive and heavy; planetary gearboxes are cheap but backlash-prone. I wanted a single integrated joint that delivers high torque with near-zero backlash in a package small enough for a humanoid-scale limb.",
    approach:
      "Engineered an internal cycloidal reduction with the motor, bearings, eccentric cam, cycloidal disc, and output stage packaged coaxially. Designed every component in CAD with DFM and tolerance stack-up in mind, integrated an absolute encoder for closed-loop control, and tuned position-control firmware. Iterated through printed and machined prototypes.",
    results:
      "A working, self-contained actuator running under closed-loop control (see the reel). Validates the integrated-cycloidal approach for compact, high-torque robotic joints. Next: this becomes the first joint of a 6-DOF cinema arm — six of these, rated to lift a 1 kg camera payload.",
    media: [
      {
        type: "image",
        src: withBase("/images/projects/Cycloidal/cycloidal-exploded.jpg"),
        caption: "Exploded CAD of the coaxial stack — output housing, cycloidal discs, eccentric cam, and cross-roller output bearing",
        feature: true,
      },
      {
        type: "video",
        src: withBase("/videos/cycloidal-pid.mp4"),
        caption: "Tuning the PID loop on the moteus r4.11 controller",
      },
    ],
  },
  {
    slug: "eldaeon-passive-radar-system",
    category: "hardware",
    title: "Eldaeon Passive Radar System",
    tagline: "Low-cost, wide-area detection from ambient RF — no transmitter required.",
    summary:
      "Developing a passive radar that exploits ambient RF (FM, cellular, Wi-Fi) for target detection and tracking, using custom SDR acquisition and cross-correlation pipelines. Conventional radar is expensive and power-hungry; this isn't.",
    impact: [
      "Zero dedicated transmitter — uses existing RF infrastructure",
      "Custom SDR acquisition + cross-correlation processing",
      "Targets wide-area coverage at a fraction of active-radar cost",
    ],
    cover: withBase("/images/projects/Eldaeon/Eldaeon.jpg"),
    duration: "Jan 2025 — Present",
    year: 2025,
    order: 2,
    status: "active",
    tags: ["RF Engineering", "Signal Processing", "Python", "SDR"],
    role: "Embedded / mechatronics intern — SDR pipeline, signal processing, hardware bring-up.",
    problem:
      "Conventional radar systems are expensive, power-hungry, and require dedicated transmitters. There's a real need for low-cost, wide-area detection that leverages RF signals already in the air.",
    approach:
      "Building a passive radar exploiting ambient RF signals for target detection and tracking, with custom SDR pipelines for signal acquisition and cross-correlation processing.",
    results: "In active development — characterization results coming soon.",
    media: [
      { type: "image", src: withBase("/images/projects/Eldaeon/Eldaeon1.jpg"), caption: "Signal-processing prototype" },
    ],
  },
  {
    slug: "polysynth-x",
    category: "hardware",
    title: "PolySynth X",
    tagline: "A hyper-expressive MPE keyboard with hand-engineered compliant keys.",
    summary:
      "Designed and built a fully custom MPE keyboard that pairs real-time embedded firmware with compliant key mechanisms for continuous, per-key control of pitch, pressure, and timbre. Captures expression that standard MIDI keyboards physically can't.",
    impact: [
      "Full MPE output: per-key pitch, pressure & polyphonic aftertouch",
      "Low-latency firmware on an ARM Cortex-M7",
      "Custom PCBs + compliant piano-action mechanisms",
    ],
    cover: withBase("/images/projects/PolysynthX/polysynthx.jpg"),
    coverVideo: withBase("/videos/polysynthshowcase.mp4"),
    duration: "Aug 2024 — Present",
    year: 2024,
    order: 3,
    status: "active",
    tags: ["Embedded Systems", "PCB Design", "C++", "CAD"],
    role: "Sole designer — compliant mechanism design, PCB layout, embedded firmware, assembly.",
    problem:
      "Traditional MIDI keyboards only capture note on/off and velocity. Musicians need continuous, per-key control over pitch, pressure, and timbre — in a portable package.",
    approach:
      "Designed compliant mechanisms mimicking piano hammer action, used hall sensors for velocity, pitch-bend, and polyphonic aftertouch, and wrote low-latency ARM Cortex-M7 firmware with custom PCBs for precise sensor positioning.",
    results:
      "Working prototype with full MPE output and validated compliant key mechanisms. Laser-cut acrylic light-up keys in development for live performance.",
    media: [
      { type: "video", src: withBase("/videos/polysynthshowcase.mp4"), caption: "First electrical prototype" },
      { type: "video", src: withBase("/videos/compliantshowcase.mp4"), caption: "Compliant mechanism showcase" },
    ],
  },
  {
    slug: "biodiversity-sensing-module",
    category: "hardware",
    title: "AI Biodiversity Sensing Module",
    tagline: "Solar-powered field nodes that classify wildlife on-device.",
    summary:
      "Led hardware for modular, low-cost biodiversity sensor nodes that run on-device AI to classify species and cut data-transmission costs. Built for autonomous, solar-powered operation in remote field conditions.",
    impact: [
      "On-device species classification on an ESP32-S3",
      "Custom buck converters + solar recharging for autonomous power",
      "Modular, low-cost nodes deployed in the field",
    ],
    cover: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"),
    duration: "Sep 2024 — Present",
    year: 2024,
    order: 4,
    status: "active",
    tags: ["Edge AI", "IoT", "Power Electronics", "ESP32"],
    role: "Lead hardware engineer — power design, enclosure, edge-AI integration.",
    problem:
      "Wildlife monitoring needs sensor networks that are affordable, solar-powered, and able to classify species on-device to reduce transmission costs in remote areas.",
    approach:
      "Led hardware design with custom buck converters for power delivery and solar recharging, and trained lightweight audio-classification models to run inference directly on an ESP32-S3.",
    results:
      "Sensor nodes operating autonomously in field conditions, with edge-AI models achieving reliable species classification at minimal power draw.",
    media: [
      { type: "image", src: withBase("/images/projects/BiodiversityTech/BiodiversityTech1.jpg"), caption: "Field deployment setup" },
      { type: "image", src: withBase("/images/projects/BiodiversityTech/BiodiversityTech2.jpg"), caption: "PCB and enclosure design" },
    ],
  },
  {
    slug: "solar-array-optimization",
    category: "hardware",
    title: "Solar Array Optimization",
    tagline: "Squeezed 12% more partial-shade output from a solar race car.",
    summary:
      "Instrumented and optimized the solar array for CalSol's race car — mapping cell mismatch under dynamic shading and validating the best bypass-diode layout. Raised partial-shade efficiency by 12% while keeping thermal loads in check.",
    impact: [
      "+12% partial-shade array output",
      "Custom telemetry mapping cell mismatch under shading",
      "Validated layout now on the 11th-gen vehicle",
    ],
    cover: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"),
    duration: "Jan 2025 — Present",
    year: 2025,
    order: 5,
    status: "active",
    tags: ["Solar Engineering", "Telemetry", "MATLAB", "Simulation"],
    role: "Solar engineer — telemetry design, shading experiments, layout validation.",
    problem:
      "Solar race cars lose significant energy under partial shading; suboptimal bypass-diode placement cascades power losses across the whole array.",
    approach:
      "Instrumented the array with custom telemetry to map cell mismatch under dynamic shading, simulated multiple bypass-diode configurations, and validated the best layout on a controlled track.",
    results:
      "Raised partial-shade efficiency by 12% with thermal loads in check. Telemetry system integrated into CalSol's 11th-gen vehicle.",
  },
  {
    slug: "compact-automated-aquaponics",
    category: "hardware",
    title: "Automated Aquaponics System",
    tagline: "A self-running farm that feeds a dining hall.",
    summary:
      "Designed (CAD) and manufactured a compact, fully automated aquaponics system with biofiltration and real-time ammonia/pH sensing. Now a permanent, sustainable food source supplying fresh lettuce and fish to our dining hall.",
    impact: [
      "Deployed & supplying fresh produce to a dining hall",
      "Real-time ammonia/pH sensing + automated nutrient balancing",
      "Modular grow towers, CNC-milled frame, Node-RED control",
    ],
    cover: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"),
    duration: "Sep 2022 — Jun 2024",
    year: 2022,
    order: 6,
    status: "completed",
    tags: ["CAD", "CNC", "Node-RED", "Sensors"],
    role: "Design lead — CAD, fabrication, control & sensing stack.",
    problem:
      "Our dining hall wanted a sustainable, local food source, but indoor farming wasn't viable and existing aquaponics systems were too large and manual.",
    approach:
      "Designed a compact platform in Fusion 360 with modular grow towers, CNC-milled the frame, and built a sensor + control stack with Node-RED dashboards for automated nutrient balancing and fish feeding.",
    results:
      "Deployed and supplying fresh produce to the dining hall, now a living lab for biology and engineering students.",
    media: [
      { type: "image", src: withBase("/images/projects/Aquaponics/AquaponicsDHall.jpg"), caption: "Deployed in the dining hall" },
    ],
  },
  {
    slug: "microplastics-research",
    category: "hardware",
    title: "Microplastics Dynamics Research",
    tagline: "Award-winning research on how microplastics move through water.",
    summary:
      "Designed flume experiments and field sampling to study microplastic movement in the vertical water table and quantify pollution in local rivers. Built image-processing pipelines for particle classification; recognized by NASA and the EPA.",
    impact: [
      "Open-access datasets that informed local mitigation policy",
      "Custom image-processing pipeline for particle classification",
      "Recognized with NASA & EPA awards",
    ],
    cover: withBase("/images/projects/Microplastics/Microplastics.jpg"),
    duration: "Jan 2022 — May 2023",
    year: 2022,
    order: 7,
    status: "completed",
    tags: ["Research", "Image Processing", "Python", "Environmental"],
    role: "Lead researcher — experiment design, sampling, data pipeline.",
    problem:
      "The movement of microplastics in natural water systems was poorly understood, limiting the effectiveness of mitigation strategies in local waterways.",
    approach:
      "Designed flume experiments and field-sampling campaigns, built image-processing pipelines for particle classification, and calibrated sensors for salinity and turbidity.",
    results:
      "Created open-access datasets that informed local mitigation policies; research recognized with awards from NASA and the EPA.",
  },
];

// ── Software ─────────────────────────────────────────────────────────────────
const software: Project[] = [
  {
    slug: "oski-leases",
    category: "software",
    title: "Oski Leases",
    tagline: "A trust-first student-housing marketplace for UC Berkeley.",
    summary:
      "Built a React 19 + TypeScript marketplace for Berkeley sublets and leases with an interactive MapLibre map, smart pricing, rent-compliance checks, and a deep trust layer — verification badges, trust scores, vouching, and scam detection.",
    impact: [
      "75+ source files — largest build in the set",
      "MapLibre geospatial search + total-cost calculators",
      "Trust scoring, verification & scam detection",
    ],
    cover: withBase("/images/software/oski.jpg"),
    duration: "2025",
    year: 2025,
    order: 1,
    status: "active",
    tags: ["React 19", "TypeScript", "MapLibre", "Supabase"],
    role: "Solo full-stack developer.",
    problem:
      "Berkeley's sublet market runs on scattered group chats and Facebook posts — no pricing transparency, no way to vet a stranger, and constant scam risk for students signing leases from across the country.",
    approach:
      "Built a React 19 + TypeScript marketplace with an interactive MapLibre map, smart pricing, rent-compliance checks, and total-cost calculators — plus a deep trust layer (verification badges, trust scores, vouching, shared-affiliation matching, and scam detection) on a Supabase backend.",
    results:
      "A full flow — search on a live map, vet a lister, calculate true monthly cost, and generate an agreement — with the trust layer Berkeley's group-chat market lacks. The largest build in my software set at 75+ source files.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/Oski-Leases" }],
  },
  {
    slug: "builddash",
    category: "software",
    title: "BuildDash",
    tagline: "A marketplace matching part designs to local makers.",
    summary:
      "Full-stack Next.js 16 marketplace where buyers upload 3D models, get instant 3D previews and automated price quotes, and match to nearby fabricators by distance — backed by a Python pricing engine for platform unit economics.",
    impact: [
      "330+ machines across 6 processes: FDM, SLA, CNC, laser, plasma, waterjet",
      "Three.js STL viewer + Leaflet distance matching",
      "Python pricing/commission engine",
    ],
    cover: withBase("/images/software/builddash.jpg"),
    duration: "2026",
    year: 2026,
    order: 2,
    status: "active",
    tags: ["Next.js 16", "Three.js", "Supabase", "Python"],
    role: "Solo full-stack developer.",
    problem:
      "Getting one custom part made means cold-emailing shops, guessing at price, and waiting days for a quote — while capable printers and CNC machines sit idle a few blocks away.",
    approach:
      "Built a two-sided Next.js 16 marketplace: buyers upload an STL, get an instant Three.js preview and an automated quote, and are matched to nearby fabricators by distance (Leaflet). A standalone Python engine models per-process cost and platform commission for the unit economics.",
    results:
      "An end-to-end flow — upload → preview → quote → match — spanning 330+ machines across 6 processes (FDM, SLA, CNC, laser, plasma, waterjet), with separate buyer and seller earnings dashboards.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/BuildDash" }],
  },
  {
    slug: "graded",
    category: "software",
    title: "Graded",
    tagline: "Tells you exactly what you need on the final.",
    summary:
      "A Svelte grade calculator that recomputes weighted grades on every keystroke and projects the score needed for each letter grade — with Berkeley exam clobber and curved (z-score) test support, at $0 infrastructure cost.",
    impact: [
      "~10 KB runtime bundle",
      "$0 hosting — static + localStorage only",
      "Clobber + curve (z-score) grade math",
    ],
    cover: withBase("/images/software/graded.jpg"),
    duration: "2025",
    year: 2025,
    order: 3,
    status: "active",
    tags: ["Svelte", "Vite", "Applied Math"],
    role: "Solo developer & product designer.",
    problem:
      "Every time a score posts, students recompute their grade by hand — and still can't answer the one question that matters: what do I actually need on the final?",
    approach:
      "A Svelte SPA that recomputes weighted grades on every keystroke and back-solves the score needed for each letter-grade cutoff — with Berkeley-specific exam clobber and curved (z-score) test support. It runs entirely client-side (localStorage), so it costs $0 to operate at any scale.",
    results:
      "A ~10 KB app that answers 'what do I need on the final' instantly — no login, no backend, and free to run for any number of students.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/Graded" }],
  },
  {
    slug: "this-portfolio",
    category: "software",
    mediaFirst: true,
    title: "This Portfolio",
    tagline: "The site you're reading — rebuilt from scratch three times.",
    summary:
      "Designed and built this portfolio in React — three ground-up rebuilds, from a Next.js template to a dark-glass phase to this custom light-hero / dark-gallery system. Iterated with an audit-driven workflow for accessibility, performance, and the ever-important 'does this look AI-made' test.",
    impact: [
      "3 ground-up rebuilds (Next.js → dark glass → this)",
      "Custom design system, audited to WCAG AA",
      "React + Vite + Framer Motion, live on GitHub Pages",
    ],
    cover: withBase("/images/software/portfolio-triptych.jpg"),
    duration: "2025 — Present",
    year: 2026,
    order: 4,
    status: "active",
    tags: ["React", "Vite", "TypeScript", "Framer Motion"],
    role: "Sole designer & developer — design system, every component, content, and deploy.",
    problem:
      "My first portfolio was a Next.js template: a circle-cropped candid from a hiking trip, a friendly 'Hi, I'm Adam Tang!', and two buttons. Honest work — but recruiters decide in about five seconds, and a template doesn't win those seconds.",
    approach:
      "So I rebuilt it. v2 went all-in on dark mode, glassmorphism, and a Playfair serif — ambitious, but it leaned generic-dark and somehow every noun became Title Case. v3 — this site — is a ground-up rebuild: a custom hero, one cohesive light-to-dark system, a single signal-orange accent, and a design process I actually audited against UX heuristics, accessibility, and performance.",
    results:
      "The site you're on right now. Built in React + Vite + Framer Motion, deployed on GitHub Pages, and iterated with an audit-driven workflow (WCAG AA, Core Web Vitals, and a hard look at whether any of it reads as AI-made). Three versions — each one a lesson in restraint.",
    media: [
      {
        type: "image",
        src: withBase("/images/software/portfolio-v1.jpg"),
        caption:
          "v1 — 'Hi, I'm Adam Tang!' A circle-cropped hiking photo and a Next.js template. Wow, this pic is from so long ago it got chopped. We all start somewhere.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-v2.jpg"),
        caption:
          "v2 — the dark-glass era. Discovered glassmorphism, a Playfair serif, and the conviction that Every Word Deserves Capital Letters. At least I got a real headshot.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-v3.jpg"),
        caption:
          "v3 — the one you're reading. Custom mirror-hero, cohesive system, one orange accent, and the hard-won lesson that restraint is a feature.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v1.jpg"),
        caption:
          "The homepage was only half the story — here's where the work actually lived. v1's projects page: a tidy grid of template cards. Perfectly readable, perfectly forgettable, every card the same and politely waiting its turn.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v2.jpg"),
        caption:
          "v2 got ambitious — a vertical timeline with year markers and cards zig-zagging down a curvy connector. Looked slick frozen in a screenshot, but your eyes had to slalom left-right-left just to compare two projects.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v3.jpg"),
        caption:
          "v3 — same work, finally on a single axis. A two-column grid, a Hardware / Software toggle, and tiles that play a demo clip on hover. Turns out you can just… put the projects in a line.",
      },
    ],
    links: [
      { label: "Live site", href: "https://antangled.github.io/engineering_portfolio/" },
      { label: "GitHub", href: "https://github.com/antangled/engineering_portfolio" },
    ],
  },
  {
    slug: "newsflash",
    category: "software",
    title: "NewsFlash",
    tagline: "High-signal tech news, delivered passively.",
    summary:
      "A multi-surface system — Node/Express + SQLite backend, a Chrome MV3 extension, and a Tauri/Rust desktop app — that ingests curated tech sources and LLM-summarizes them into 3–7 ranked daily headlines via a scheduled pipeline.",
    impact: [
      "Monitors 30–75 curated sources",
      "Ingest → cluster → score → summarize cron pipeline",
      "3 surfaces: backend, browser extension & desktop",
    ],
    cover: "",
    placeholder: true,
    duration: "2026",
    year: 2026,
    order: 5,
    status: "active",
    tags: ["TypeScript", "Node", "LLM", "Tauri / Rust"],
    role: "Solo developer — backend, extension & desktop.",
    problem:
      "Tech news is a scroll trap: high noise, low signal, and a time sink. I wanted the day's real headlines delivered passively — not another feed to doom-scroll.",
    approach:
      "A multi-surface system — Node/Express + SQLite backend, a Chrome MV3 extension, and a Tauri/Rust desktop app — running a scheduled pipeline that ingests a curated whitelist of high-signal accounts, then clusters, scores, and LLM-summarizes them into 3–7 ranked one-line headlines a day.",
    results:
      "One passive daily digest across three surfaces, distilling 30–75 curated sources down to a handful of ranked headlines — read in seconds, no scrolling.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/NewsFlash" }],
  },
];

export const projects: Project[] = [...hardware, ...software];

export function getProjects(category: "hardware" | "software"): Project[] {
  return projects.filter((p) => p.category === category).sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const project = getProject(slug);
  if (!project) return { prev: undefined, next: undefined };
  const list = getProjects(project.category);
  const i = list.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i < list.length - 1 ? list[i + 1] : undefined,
  };
}
