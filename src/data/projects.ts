import { withBase } from "../lib/withBase";

export type Project = {
  title: string;
  description: string;
  image: string;
  slug: string;
  content?: string;
  duration: string;
  tags: string[];
  status: "active" | "completed";
  year: number;
  images?: { src: string; caption: string }[];
  videos?: { src: string; caption: string }[];
  problem?: string;
  approach?: string;
  results?: string;
};

export type ScrollState = {
  scrollTarget?: string;
};

export type SkillCategory = {
  title: string;
  skills: {
    name: string;
    level: number;
  }[];
};

export const aboutVideo = withBase("/videos/video_2026-01-11_15-31-58.mov");
export const polysynthVideo = withBase("/videos/polysynthshowcase.mp4");
export const compliantShowcaseVideo = withBase("/videos/compliantshowcase.mp4");
export const heroImage = withBase("/images/feature-v3.jpg");
export const heroFeatureImage = withBase("/images/feature2.jpg");
export const resumeFile = withBase("/AdamTang_Resume.pdf");

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
];

export const projects: Project[] = [
  {
    slug: "eldaeon-passive-radar-system",
    title: "Eldaeon Passive Radar System",
    description:
      "Developing a passive radar system for low-cost, wide-area detection and tracking using ambient RF signals.",
    image: withBase("/images/projects/Eldaeon/Eldaeon.jpg"),
    duration: "Jan 2025 – Present",
    tags: ["RF Engineering", "Signal Processing", "Python"],
    status: "active",
    year: 2025,
    images: [
      { src: withBase("/images/projects/Eldaeon/Eldaeon.jpg"), caption: "Passive radar system overview" },
      { src: withBase("/images/projects/Eldaeon/Eldaeon1.jpg"), caption: "Signal processing prototype" },
    ],
    problem: "Conventional radar systems are expensive, power-hungry, and require dedicated transmitters. There's a need for low-cost, wide-area detection that can leverage existing RF infrastructure.",
    approach: "Developing a passive radar that exploits ambient RF signals (FM radio, cellular, Wi-Fi) for target detection and tracking. Building custom SDR pipelines for signal acquisition and cross-correlation processing.",
    results: "Project in active development — check back for results.",
  },
  {
    slug: "polysynth-x-mpe-synth-keyboard",
    title: "PolySynth X",
    description:
      "Designed and built a fully custom hyper-expressive MPE keyboard, integrating real-time embedded firmware with hand-engineered compliant key mechanisms.",
    image: withBase("/images/projects/PolysynthX/polysynthx.jpg"),
    duration: "Aug 2024 – Present",
    tags: ["Embedded Systems", "PCB Design", "C++", "CAD"],
    status: "active",
    year: 2024,
    images: [
      { src: withBase("/images/projects/PolysynthX/polysynthx.jpg"), caption: "PolySynth X assembled prototype" },
    ],
    videos: [
      { src: polysynthVideo, caption: "First Electrical Prototype" },
      { src: compliantShowcaseVideo, caption: "Compliant Mechanism Showcase" },
    ],
    problem: "Traditional MIDI keyboards lack expressive control — they only capture note-on/off and velocity. Musicians need continuous, per-key control over pitch, pressure, and timbre in a portable package.",
    approach: "Designed compliant mechanisms mimicking piano hammer action, using subtractive hall sensors for velocity, pitch bend, and polyphonic aftertouch. Built low-latency ARM Cortex-M7 firmware and custom PCBs for precise sensor positioning.",
    results: "Working prototype with full MPE output. Compliant key mechanisms validated. Laser-cut acrylic light-up keys in development for live performance use.",
  },
  {
    slug: "low-cost-biodiversity-sensing-module",
    title: "Low-Cost AI-Powered Biodiversity-Sensing Module",
    description:
      "Designed fully-custom, modular, low-cost biodiversity sensor nodes, utilizing on-device AI to optimize data collection.",
    image: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"),
    duration: "Sep 2024 – Present",
    tags: ["Edge AI", "IoT", "Power Electronics", "ESP32"],
    status: "active",
    year: 2024,
    images: [
      { src: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"), caption: "Sensor node assembly" },
      { src: withBase("/images/projects/BiodiversityTech/BiodiversityTech1.jpg"), caption: "Field deployment setup" },
      { src: withBase("/images/projects/BiodiversityTech/BiodiversityTech2.jpg"), caption: "PCB and enclosure design" },
    ],
    problem: "Wildlife monitoring requires sensor networks that are affordable, solar-powered, and capable of on-device species classification to reduce data transmission costs in remote areas.",
    approach: "Led hardware design with custom buck converters for power delivery, solar recharging circuits, and trained lightweight audio classification models to run inference directly on an ESP32-S3 microcontroller.",
    results: "Deployed sensor nodes operating autonomously in field conditions. Edge AI models achieving reliable species classification with minimal power draw.",
  },
  {
    slug: "solar-array-optimization",
    title: "Solar Array Optimization",
    description:
      "Designed array telemetry and bypass-diode placement experiments for a solar race car; improved partial-shade output by 12%.",
    image: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"),
    duration: "Jan 2025 – Present",
    tags: ["Solar Engineering", "Telemetry", "MATLAB", "Simulation"],
    status: "active",
    year: 2025,
    images: [
      { src: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"), caption: "Excalibur solar race car" },
    ],
    problem: "Solar race cars lose significant energy under partial shading. Suboptimal bypass-diode placement leads to cascading power losses across the entire array.",
    approach: "Instrumented the Excalibur array with custom telemetry to map cell mismatch under dynamic shading. Simulated multiple bypass-diode configurations and validated the best layout on a controlled track.",
    results: "Raised partial-shade efficiency by 12% while keeping thermal loads in check. Telemetry system now integrated into CalSol's 11th-gen vehicle.",
  },
  {
    slug: "compact-automated-aquaponics-system",
    title: "Compact Automated Aquaponics System",
    description:
      "Designed (CAD) and manufactured a fully automated aquaponics system that supplied our dining hall with fresh lettuce and fish, serving as multidisciplinary educational tool.",
    image: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"),
    duration: "Sep 2022 – Jun 2024",
    tags: ["CAD", "CNC", "Node-RED", "Sensors"],
    status: "completed",
    year: 2022,
    images: [
      { src: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"), caption: "Aquaponics system in lab" },
      { src: withBase("/images/projects/Aquaponics/AquaponicsDHall.jpg"), caption: "Deployed in dining hall" },
    ],
    problem: "Our school dining hall wanted a sustainable, local food source. Traditional farming wasn't viable indoors, and existing aquaponics systems were too large and manual.",
    approach: "Designed a compact platform in Fusion 360 with modular grow towers, CNC-milled the frame, and built a sensor + control stack with Node-RED dashboards for automated nutrient balancing and fish feeding.",
    results: "System deployed and supplying fresh produce to the dining hall. Now serves as a living lab for biology and engineering students.",
  },
  {
    slug: "microplastics-dynamics-research",
    title: "Flume-Simulated + Field Microplastics Dynamics Research",
    description:
      "Investigated the movement and behavior of microscopic particles within the vertical water table and quantified the levels of microplastic pollution in local rivers.",
    image: withBase("/images/projects/Microplastics/Microplastics.jpg"),
    duration: "Jan 2022 – May 2023",
    tags: ["Research", "Image Processing", "Python", "Environmental"],
    status: "completed",
    year: 2022,
    images: [
      { src: withBase("/images/projects/Microplastics/Microplastics.jpg"), caption: "Flume experiment setup" },
    ],
    problem: "The movement patterns of microplastics in natural water systems were poorly understood, limiting the effectiveness of mitigation strategies in local waterways.",
    approach: "Designed flume experiments and field sampling campaigns. Built image-processing pipelines for particle classification, and calibrated sensors for salinity and turbidity measurement.",
    results: "Created open-access datasets that informed local mitigation policies. Research recognized with awards from NASA and EPA.",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    skills: [
      { name: "Python", level: 0.8 },
      { name: "Java", level: 0.9 },
      { name: "TypeScript", level: 0.6 },
      { name: "MATLAB", level: 0.5 },
    ],
  },
  {
    title: "CAD / Simulation",
    skills: [
      { name: "Fusion 360", level: 0.7 },
      { name: "Onshape", level: 0.9 },
      { name: "Solidworks", level: 0.6 },
      { name: "ANSYS", level: 0.5 },
      { name: "KiCad", level: 0.6 },
    ],
  },
  {
    title: "Fabrication / Prototyping",
    skills: [
      { name: "3D Printing", level: 0.9 },
      { name: "Machining & Manufacturing", level: 0.8 },
      { name: "Soldering / PCBs", level: 0.8 },
      { name: "Rapid Prototyping", level: 0.8 },
    ],
  },
];
