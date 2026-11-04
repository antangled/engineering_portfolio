import { withBase } from "../lib/withBase";

export type Media = {
  type: "image" | "video";
  src: string;
  /** Full caption, shown in the lightbox and the build log. State a finding, not just a name. */
  caption?: string;
  /** Short tile label (1–3 words) shown over the thumbnail. */
  label?: string;
  /** "contain" shows the whole image (diagrams, screenshots, CAD) instead of cropping to fill. */
  fit?: "cover" | "contain";
  /** Render on white (CAD renders exported on a white background). */
  onWhite?: boolean;
};

export type ProjectLink = { label: string; href: string };

/** One headline number for the at-a-glance strip under the gallery. */
export type Stat = { value: string; label: string };

export type Project = {
  slug: string;
  category: "hardware" | "software";
  title: string;
  /** One-line recruiter hook shown on the gallery tile + detail header. */
  tagline: string;
  /** Two-to-three sentence overview (the TL;DR). */
  summary: string;
  /** Short chips for gallery/home cards. */
  impact: string[];
  /** Big numbers shown under the project gallery. */
  stats?: Stat[];
  /** "What I did" bullets, resume-style: each starts with a verb. */
  highlights?: string[];
  /** Gallery poster image. */
  cover: string;
  /** Lightbox caption for the cover image. */
  coverCaption?: string;
  /** "contain" for diagram/screenshot covers that must not be cropped on the project page. */
  coverFit?: "cover" | "contain";
  /** Optional muted loop that cross-fades in on hover (Baptiste pattern). */
  coverVideo?: string;
  /** Instagram reel embed URL (cycloidal actuator). */
  embedReel?: string;
  duration: string;
  year: number;
  order: number;
  status: "active" | "completed" | "concept";
  /** Tools and skills used (shown as chips). */
  tags: string[];
  role?: string;
  team?: string;
  problem?: string;
  approach?: string;
  results?: string;
  media?: Media[];
  links?: ProjectLink[];
  /** True when `cover` is a styled placeholder rather than a real asset. */
  placeholder?: boolean;
  /** Extra images shown beside the cover in the home-page "Recent builds" anchor card. */
  previewImages?: { src: string; alt: string; fit?: "cover" | "contain" }[];
};

// ── Hardware ─────────────────────────────────────────────────────────────────
const hardware: Project[] = [
  {
    slug: "internal-cycloidal-actuator",
    category: "hardware",
    title: "Kinema Cycloidal Actuator",
    tagline: "A 10:1 cycloidal actuator packed inside a frameless motor, built as the first joint of a 6-DOF camera arm.",
    summary:
      "Kinema is a 6-DOF camera arm you teach by hand, which then replays the shot smoothly. Its joints need high torque and low backlash at a fraction of industrial-arm cost, so I designed a custom internal cycloidal actuator and have taken it through 7+ machined and printed prototypes to closed-loop control.",
    impact: ["10:1 cycloidal reduction", "Bench-tested to 2 N·m", "7+ prototypes", "$1.5k Jacobs Ignite grant"],
    stats: [
      { value: "10:1", label: "cycloidal reduction" },
      { value: "2 N·m", label: "bench-tested output torque" },
      { value: "7+", label: "CNC-machined and 3D-printed prototypes" },
      { value: "$1.5k", label: "Jacobs Ignite grant, plus a CubeMars sponsorship" },
    ],
    highlights: [
      "Designed a 10:1 internal cycloidal stage packaged coaxially inside a frameless BLDC (10.4 N·m peak motor torque).",
      "Ran tolerance stack-ups on the cycloid and pin fits, selected the bearings, and validated the housing with FEA in SolidWorks.",
      "Built 7+ CNC-machined and 3D-printed prototypes, then brought up the motor driver and absolute encoder for closed-loop position control.",
      "Tuned the position loop on a moteus r4.11 controller and bench-tested the joint to 2 N·m.",
      "Won a CubeMars motor sponsorship and a $1.5k Jacobs Ignite grant to build the full arm.",
    ],
    cover: withBase("/images/projects/Cycloidal/cycloidal-main.jpg"),
    coverCaption: "Shoulder-joint prototype, with the mjbots moteus controller mounted on the rear housing.",
    previewImages: [
      { src: withBase("/images/projects/Cycloidal/cycloidal-proto-v2.jpg"), alt: "Cycloidal actuator prototype v2, assembled" },
      { src: withBase("/images/projects/Cycloidal/cycloidal-exploded.jpg"), alt: "Exploded CAD of the cycloidal actuator", fit: "contain" },
    ],
    embedReel: "https://www.instagram.com/reel/DaE58a3O0D8/",
    duration: "Jun 2026 — Present",
    year: 2026,
    order: 1,
    status: "active",
    tags: ["SolidWorks", "FEA", "Tolerance stack-ups", "CNC machining", "3D printing", "BLDC control", "Absolute encoders"],
    role: "Mechanical and electrical design: actuator CAD, FEA, fabrication, motor and encoder bring-up, control tuning.",
    team: "With Jacob Leung (software and ML)",
    problem:
      "Arms smooth enough to film a shot cost $10k–$100k+ and need every keyframe programmed by hand, while cheaper arms flex and vibrate. Kinema needs stiff, high-torque, low-backlash joints a student team can afford to build.",
    approach:
      "Nest a cycloidal reduction inside a frameless motor so each joint stays short and stiff. I sized the cycloid, pins and bearings with tolerance stack-ups, checked the housing in FEA, and iterated between printed and machined parts.",
    results:
      "The joint runs under closed-loop position control and holds 2 N·m on the bench. Next: scale it to all six joints of an arm with 0.8 m reach carrying a 1 kg camera.",
    media: [
      {
        type: "image",
        src: withBase("/images/projects/Cycloidal/cycloidal-exploded.jpg"),
        label: "Exploded CAD",
        fit: "contain",
        onWhite: true,
        caption: "Exploded CAD of the coaxial stack: output housing, cycloidal discs, eccentric cam and cross-roller output bearing.",
      },
      {
        type: "image",
        src: withBase("/images/projects/Cycloidal/cycloidal-proto-v2.jpg"),
        label: "Prototype v2",
        caption: "Prototype v2, assembled: the next housing iteration after the white print.",
      },
      {
        type: "video",
        src: withBase("/videos/cycloidal-pid.mp4"),
        label: "PID tuning",
        caption: "Tuning the position loop on the moteus r4.11 controller.",
      },
    ],
  },
  {
    slug: "eldaeon-passive-radar-system",
    category: "hardware",
    title: "Eldaeon Passive Radar",
    tagline: "A Raspberry Pi pipeline that spots drones in RF Doppler returns and flags anything that isn't a known aircraft or ship.",
    summary:
      "At Eldaeon, an RF-sensing startup, I worked across the detection software, antenna mechanism and power system of a passive radar node. It listens to existing transmitters instead of emitting its own, and alerts on targets that don't match public aircraft and ship tracks.",
    impact: ["Drone detection from RF Doppler + ADS-B/AIS", "Projected 30.2% power cut, under 15.4 W PoE"],
    stats: [
      { value: "30.2%", label: "projected power cut, bringing the node under its 15.4 W PoE limit" },
      { value: "±10°", label: "self-calibrating antenna sweep" },
      { value: "3+", label: "outdoor field campaigns, plus an SF boat-detection run" },
    ],
    highlights: [
      "Built a real-time drone and UAP detection pipeline in Python on Raspberry Pi that cross-correlates RF Doppler returns with ADS-B aircraft and AIS ship tracks.",
      "Surfaced uncorrelated targets on a live dashboard, with phone alerts through AWS and Twilio.",
      "Designed the antenna pan-tilt mechanism and wrote calibration firmware that sweeps ±10° to lock onto the strongest local transmitter, for the clearest Doppler signal.",
      "Mapped each component's power draw from datasheets and wrote a sequencing daemon (DPOL) that keeps servo moves and SDR bursts from overlapping, cutting projected draw 30.2% to fit the 15.4 W PoE budget.",
    ],
    cover: withBase("/images/projects/Eldaeon/Eldaeon.jpg"),
    coverCaption: "A radar node on its tripod: weatherproof case below, antenna on the pan-tilt mount.",
    duration: "Dec 2025 — Aug 2026",
    year: 2026,
    order: 2,
    status: "completed",
    tags: ["Python", "Raspberry Pi", "SDR", "ADS-B / AIS", "AWS", "Twilio", "Mechanism design", "Power budgeting"],
    role: "Embedded Systems and Hardware Integration Intern: detection software, antenna mechanism, calibration firmware, power budgeting.",
    problem:
      "Drones are small and slow, and a detector that alarms on every airliner is useless. The node also had to run on the 15.4 W a single PoE cable supplies.",
    approach:
      "Use ambient transmitters as the illuminator, cross-correlate Doppler returns against public ADS-B and AIS feeds, and alert only on what's left. A pan-tilt mount calibrates itself to the strongest transmitter, and a daemon schedules power-hungry tasks so they never overlap.",
    results:
      "Field-tested over 3+ outdoor campaigns and an SF boat-detection run, with uncorrelated targets reaching a live dashboard and phones. The power plan projects a 30.2% cut, enough to stay under the PoE limit (projected from datasheets, not measured on the bench).",
    media: [
      {
        type: "image",
        src: withBase("/images/projects/Eldaeon/Eldaeon1.jpg"),
        label: "Pan-tilt mount",
        caption: "The antenna on its pan-tilt mount, above the node's weatherproof case.",
      },
    ],
  },
  {
    slug: "polysynth-x",
    category: "hardware",
    title: "PolySynth X",
    tagline: "A 12-key MPE keyboard and synth where every key bends its own pitch.",
    summary:
      "A playable 12-key MPE (MIDI Polyphonic Expression) keyboard with its own synth engine. Two hall-effect sensors sit under each key, so every key reports its own pitch bend, which a standard keyboard can't do.",
    impact: ["12 keys, per-key pitch bend", "7+ key iterations, 3+ PCB revisions"],
    stats: [
      { value: "12", label: "MPE keys with independent pitch bend" },
      { value: "7+", label: "iterations of the compliant hammer-action key" },
      { value: "3+", label: "hall-effect sensor PCB revisions" },
      { value: "STM32H7", label: "real-time C++ DSP on a Daisy Seed" },
    ],
    highlights: [
      "Iterated compliant hammer-action keys 7+ times in Onshape and 3D print until the touch was accurate.",
      "Designed hall-effect sensor PCBs in KiCad over 3+ revisions.",
      "Wrote real-time C++ DSP firmware on an STM32H7 (Daisy Seed) that differences the two hall-effect sensors under each key through the ADC, giving every key independent pitch bend.",
      "Built an onboard synth engine into the keyboard.",
    ],
    cover: withBase("/images/projects/PolysynthX/polysynthx.jpg"),
    coverCaption: "The sensor PCB, display and 3D-printed compliant keybed.",
    coverVideo: withBase("/videos/polysynthshowcase.mp4"),
    duration: "Nov 2025 — Jun 2026",
    year: 2025,
    order: 3,
    status: "completed",
    tags: ["STM32H7", "C++", "Real-time DSP", "KiCad", "Onshape", "Compliant mechanisms", "3D printing"],
    role: "Solo: key mechanism, PCB layout, firmware and assembly.",
    problem:
      "A standard MIDI keyboard sends note-on, note-off and velocity. Bending one note inside a chord, the way a guitarist can, isn't possible.",
    approach:
      "Each key is a 3D-printed compliant flexure that mimics hammer action. Two hall-effect sensors read its motion, and the firmware differences them into a per-key pitch-bend signal.",
    results: "A working 12-key keyboard with an onboard synth where every key bends independently, after 7+ key iterations and 3+ PCB revisions.",
    media: [
      { type: "video", src: withBase("/videos/polysynthshowcase.mp4"), label: "First prototype", caption: "The first electrical prototype." },
      { type: "video", src: withBase("/videos/compliantshowcase.mp4"), label: "Compliant keys", caption: "The compliant key mechanism in motion." },
    ],
  },
  {
    slug: "biodiversity-sensing-module",
    category: "hardware",
    title: "Biodiversity Sensing Module",
    tagline: "A weatherproof, solar-powered field node that identifies species on-device.",
    summary:
      "As hardware lead, I designed a modular sensor node that runs entirely on solar power and identifies wildlife with an on-device AI model, reporting each species with a confidence score. The first node is deployed in the field.",
    impact: ["Fully solar-powered, weatherproof", "On-device species ID with confidence scores"],
    stats: [
      { value: "100%", label: "solar powered" },
      { value: "3", label: "sensing modes: camera, acoustic, thermal" },
      { value: "1st", label: "node deployed in the field" },
    ],
    highlights: [
      "Designed the buck-converter power system so the node runs entirely on solar.",
      "Integrated camera, acoustic and thermal sensors into a weatherproof, modular build.",
      "Ran an on-device AI model on an ESP32-S3 that identifies species and reports a confidence score for each.",
      "Deployed the first node in the field.",
    ],
    cover: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"),
    coverCaption: "Prototype sensing board, built around a Seeed XIAO ESP32-S3.",
    duration: "Oct 2025 — Jun 2026",
    year: 2025,
    order: 4,
    status: "completed",
    tags: ["ESP32-S3", "Edge AI", "Solar power", "Buck converters", "Sensor integration"],
    role: "Hardware lead: power system, sensor integration, enclosure.",
    problem:
      "Ecologists want to know what lives where, but sending raw camera and audio data from remote sites is expensive, and swapping batteries means repeat trips.",
    approach:
      "Do the work on the node: an ESP32-S3 runs the species-ID model locally so only results leave the site, and solar power removes battery swaps.",
    results: "A weatherproof node with camera, acoustic and thermal sensing that identifies species on-device. The first unit is deployed in the field.",
    media: [
      {
        type: "image",
        src: withBase("/images/projects/BiodiversityTech/BiodiversityTech1.jpg"),
        label: "At the bench",
        caption: "Holding the sensing board at my bench.",
      },
      {
        type: "image",
        src: withBase("/images/projects/BiodiversityTech/BiodiversityTech2.jpg"),
        label: "ESP32-S3",
        caption: "The Seeed XIAO ESP32-S3 module that runs the species-ID model.",
      },
    ],
  },
  {
    slug: "solar-array-optimization",
    category: "hardware",
    title: "CalSol Solar Array",
    tagline: "Laying out a solar race car's array so it keeps charging in partial shade.",
    summary:
      "As Solar Engineering Project Manager on CalSol, UC Berkeley's solar racing team, I designed the array and bypass-diode layout so the battery keeps charging when some panels are shaded, a projected +12% partial-shade efficiency gain. I also designed the MPPT charge-controller enclosures.",
    impact: ["Projected +12% partial-shade efficiency", "MPPT enclosures in SolidWorks"],
    stats: [
      { value: "+12%", label: "projected partial-shade efficiency" },
      { value: "MPPT", label: "charge-controller enclosures, designed in SolidWorks" },
    ],
    highlights: [
      "Designed the solar array and bypass-diode layout so the battery keeps charging when panels are partially shaded, a projected +12% partial-shade efficiency gain.",
      "Designed the MPPT charge-controller enclosures in SolidWorks.",
      "Integrated the enclosures into the car's wiring layout alongside the batteries.",
    ],
    cover: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"),
    coverCaption: "CalSol's solar car on track.",
    duration: "Sep 2025 — May 2026",
    year: 2025,
    order: 5,
    status: "completed",
    tags: ["Solar arrays", "Bypass diodes", "MPPT", "SolidWorks", "Wiring layout"],
    role: "Solar Engineering Project Manager: array layout, bypass diodes, MPPT enclosures.",
    problem:
      "On a solar car, one shaded cell can drag down a whole string of panels, so a tree or building on the course costs far more power than the area it covers.",
    approach:
      "Lay out the strings and bypass diodes so a shaded section is routed around instead of limiting the rest, and package the MPPT controllers to fit cleanly into the wiring with the batteries.",
    results: "A layout projected to raise partial-shade efficiency by 12%, plus MPPT enclosures designed in SolidWorks and integrated into the car's wiring.",
  },
  {
    slug: "compact-automated-aquaponics",
    category: "hardware",
    title: "Automated Aquaponics System",
    tagline: "A compact aquaponics system that grew lettuce and raised fish for a campus dining hall.",
    summary:
      "I designed a compact aquaponics system in Fusion 360, hand-built it, and added a sensor and control stack that monitors fish and plant health. It was deployed on campus, supplying the dining hall with fresh lettuce and fish.",
    impact: ["Deployed in a campus dining hall", "Sensors + control for fish and plant health"],
    highlights: [
      "Designed the system in Fusion 360 and hand-built it.",
      "Built a sensor and control stack that monitors fish and plant health.",
      "Deployed it on campus, where it supplied the dining hall with fresh lettuce and fish.",
      "Used it as a hands-on teaching tool across biology and engineering.",
    ],
    cover: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"),
    coverCaption: "The system during the build, in the lab.",
    duration: "Dec 2023 — Jun 2025",
    year: 2023,
    order: 6,
    status: "completed",
    tags: ["Fusion 360", "Sensors", "Closed-loop control", "Fabrication"],
    role: "Design and build lead: CAD, fabrication, sensing and control.",
    problem: "The dining hall wanted fresh, local food, but most aquaponics setups are too big and need daily manual care.",
    approach: "A compact frame designed in Fusion 360, with sensors and control logic watching water and plant conditions so the system needs less hands-on attention.",
    results: "Deployed on campus and supplying the dining hall with fresh lettuce and fish.",
    media: [
      {
        type: "image",
        src: withBase("/images/projects/Aquaponics/AquaponicsDHall.jpg"),
        label: "Deployed",
        caption: "Deployed in the dining hall.",
      },
    ],
  },
  {
    slug: "microplastics-research",
    category: "hardware",
    title: "Microplastics Dynamics Research",
    tagline: "Research on how microplastics move through water, recognized by NASA and the EPA.",
    summary:
      "I designed flume experiments and field sampling to study how microplastics move through the water column and to measure pollution in local rivers, and built an image-processing pipeline to classify particles.",
    impact: ["Open-access datasets used in local policy", "Recognized by NASA and the EPA"],
    highlights: [
      "Designed flume experiments and field-sampling campaigns to track how microplastics move in water.",
      "Built an image-processing pipeline in Python to classify particles.",
      "Calibrated salinity and turbidity sensors for the field work.",
      "Published open-access datasets that informed local mitigation policy; the work was recognized by NASA and the EPA.",
    ],
    cover: withBase("/images/projects/Microplastics/Microplastics.jpg"),
    coverCaption: "The flume used to simulate how microplastics move through water.",
    duration: "Jan 2022 — May 2023",
    year: 2022,
    order: 7,
    status: "completed",
    tags: ["Experiment design", "Python", "Image processing", "Sensors"],
    role: "Lead researcher: experiment design, sampling, data pipeline.",
    problem: "How microplastics move through rivers and the water column was poorly understood, which limited what local mitigation could target.",
    approach: "Flume experiments to control the variables, field sampling to measure the real rivers, and an image-processing pipeline to count and classify the particles.",
    results: "Open-access datasets that informed local mitigation policy; the research was recognized by NASA and the EPA.",
  },
];

// ── Software ─────────────────────────────────────────────────────────────────
const software: Project[] = [
  {
    slug: "envoy",
    category: "software",
    title: "Envoy",
    tagline: "An AI outreach assistant that turns a plain-English goal into researched companies, the right contacts and source-linked emails you approve before they send.",
    summary:
      "Envoy turns a goal like “who do I want to work with?” into researched organizations, the right contacts and a personalized email where every claim about the company links to its source. Jiwoo Jung and I built it in about two days, and it won Best Enterprise Reinvention at Berkeley SCET's Innovation Intelligence Hackathon.",
    impact: [
      "Winner — Best Enterprise Reinvention, AI-Native Enterprise track",
      "Every quoted phrase verified word for word against its source",
      "~$0.05 per company researched and drafted",
    ],
    stats: [
      { value: "Winner", label: "Best Enterprise Reinvention, AI-Native Enterprise track" },
      { value: "~2 days", label: "from idea to winning demo" },
      { value: "9/10 → 0/5", label: "needless model escalations, after the cost-ledger fix" },
      { value: "~$0.05", label: "per company researched and drafted" },
    ],
    highlights: [
      "Built the full stack (Next.js, Postgres, Claude, Exa, Hunter, Gmail API) in about two days with Claude Code.",
      "Restricted the model's evidence IDs to the pages it was actually given, then checked in code that every citation exists and every quote appears word for word.",
      "Built a per-campaign cost ledger that showed 9 of 10 briefs escalating to the bigger model unnecessarily; after the fix, 0 of 5 did, at about $0.05 per company.",
      "Shipped a demo-only public mode with fictional companies and simulated sending, so the live site can't spend API credits.",
    ],
    cover: withBase("/images/software/envoy-award.jpg"),
    coverCaption: "Receiving Best Enterprise Reinvention (AI-Native Enterprise track) at Berkeley SCET's Innovation Intelligence Hackathon, October 2026.",
    duration: "Oct 2026",
    year: 2026,
    order: 0,
    status: "active",
    tags: ["Next.js 16", "TypeScript", "Claude API", "Exa", "Hunter", "Gmail API", "Drizzle + Postgres", "Vercel"],
    role: "Owned the full technical stack, front end and back end, built with Claude Code. Jiwoo Jung led the pitch.",
    team: "With Jiwoo Jung (pitch)",
    problem:
      "Client outreach for my consulting club (BEACN) took more than an hour per company across Apollo, spreadsheets, Claude and GMass: research the company, find the right person, tailor the email, mail-merge it.",
    approach:
      "Turn the goal into checkable criteria, find companies with Exa, read their sites and news, then write a fit brief and the email's personal lines in one structured Claude call that can only cite documents it was given. Code checks every citation and quote; only briefs that fail escalate to a stronger model.",
    results:
      "Won Best Enterprise Reinvention, built in about two days. The cost ledger cut needless escalations from 9/10 to 0/5, holding cost near $0.05 per company. The public demo runs on fictional sample companies with simulated sending.",
    media: [
      {
        type: "image",
        src: withBase("/images/software/envoy-hero.jpg"),
        label: "Landing page",
        caption: "Describe who you want to reach, and Envoy finds organizations that fit, reads their sites and news, finds the right people, and drafts an email with a source behind every sentence.",
      },
      {
        type: "image",
        src: withBase("/images/software/envoy-brief.jpg"),
        label: "Cited brief",
        caption: "Each company gets a fit score and a brief checked against your criteria. Every supported claim carries a superscript citation to the page it came from.",
      },
      {
        type: "image",
        src: withBase("/images/software/envoy-verify.jpg"),
        label: "Claim checks",
        caption: "Claims are labeled Supported, Evidenced or Inferred, and anything the sources don't back moves to “Still unknown” instead of staying in the email.",
      },
      {
        type: "image",
        src: withBase("/images/software/envoy-draft.jpg"),
        label: "Draft",
        caption: "A personalized draft per recipient, with each company-specific line traceable to a source. Every draft is editable, and nothing sends until the user approves it.",
      },
      {
        type: "image",
        src: withBase("/images/software/envoy-send.jpg"),
        label: "Send controls",
        caption: "Sending runs through the user's own Gmail with send-only permission: one email per recipient, randomized spacing, hourly and daily caps, business hours, an opt-out footer and no tracking pixels.",
      },
      {
        type: "image",
        src: withBase("/images/pitch-envoy.jpg"),
        label: "Pitch",
        caption: "Pitching Envoy to the judges and the room at Berkeley SCET.",
      },
      {
        type: "image",
        src: withBase("/images/software/envoy-demo.jpg"),
        label: "Demo table",
        caption: "Demoing Envoy at the Innovation Intelligence Hackathon.",
      },
    ],
    links: [
      { label: "Live demo", href: "https://envoy-one-brown.vercel.app" },
      { label: "GitHub", href: "https://github.com/antangled/Envoy" },
    ],
  },
  {
    slug: "beacn-outreach",
    category: "software",
    title: "BEACN Outreach",
    tagline: "Two tools that turn a LinkedIn profile or a company name into a sourced, ready-to-review outreach email for Berkeley's consulting club.",
    summary:
      "BEACN, a student consulting group at UC Berkeley, wins clients through cold outreach. I built it two tools: Talon, a Chrome extension that turns a LinkedIn profile into a row in the team's mail-merge sheet, and a research pipeline that turns a company name into a draft email whose every quoted claim is checked against the company's own website. It came before Envoy and tackles the same problem.",
    impact: ["Every quoted claim checked verbatim against the source", "~5 min from company name to sourced draft"],
    stats: [
      { value: "~5 min", label: "per company, from name to sourced draft" },
      { value: "$0/mo", label: "marginal cost, on tools the club already pays for" },
      { value: "20/day", label: "hard send cap; nothing sends without approval" },
    ],
    highlights: [
      "Built Talon, a Chrome extension: one click on a LinkedIn profile sends the page to a Google Apps Script backend, where Claude structures the fields and writes the personal lines, Apollo finds the work email, and a row lands in the mail-merge sheet.",
      "Kept every API key in Apps Script, never in the extension, and limited Talon to profiles the user opens, one at a time.",
      "Built a Python pipeline that finds and reads a company's own documents, has Claude pick one real gap, then drafts with a second Claude call that gets no tools, only the verified research as JSON.",
      "Made verification a hard gate: every quote must appear verbatim on a page of the company's own domain, or no email is written.",
    ],
    cover: withBase("/images/software/beacn-pipeline.jpg"),
    coverFit: "contain",
    coverCaption: "How the two tools fit together. Both write into the sheet BEACN already sends from, and a person approves every email.",
    duration: "Jun — Aug 2026",
    year: 2026,
    order: 1,
    status: "active",
    tags: ["Chrome extension (MV3)", "Google Apps Script", "Python", "Claude", "Apollo API", "Google Sheets", "GMass"],
    role: "Sole developer. Designed and built both tools for BEACN's client-acquisition team.",
    problem:
      "Outreach meant copying names from LinkedIn into a spreadsheet, hunting for emails and writing a personal line for each person — more than an hour per company.",
    approach:
      "Talon automates capture. The pipeline automates research and drafting, with a hard boundary between them: the drafting model sees only verified research as JSON and has no tools, so text on a scraped page can't steer what it writes.",
    results:
      "Both tools write into the sheet the club already sends from, and a person still reviews and approves every email. A company goes from name to sourced draft in about five minutes, at no extra monthly cost.",
    media: [
      {
        type: "image",
        src: withBase("/images/software/beacn-run.jpg"),
        label: "A real run",
        fit: "contain",
        caption: "A real pipeline run on Rivian: five documents read, six quoted claims verified against the source, and a draft flagged for review because it ran 259 words against a 200–250 target.",
      },
    ],
  },
  {
    slug: "oski-leases",
    category: "software",
    title: "Oski Leases",
    tagline: "A trust-first student-housing marketplace for UC Berkeley.",
    summary:
      "A React 19 + TypeScript marketplace for Berkeley sublets and leases, with an interactive MapLibre map, smart pricing, rent-compliance checks and a trust layer of verification badges, trust scores, vouching and scam detection.",
    impact: ["75+ source files", "MapLibre geospatial search + cost calculators", "Trust scoring and scam detection"],
    stats: [
      { value: "75+", label: "source files — my largest software build" },
    ],
    highlights: [
      "Built the marketplace in React 19 + TypeScript on a Supabase backend.",
      "Added an interactive MapLibre map, smart pricing, rent-compliance checks and total-cost calculators.",
      "Designed a trust layer: verification badges, trust scores, vouching, shared-affiliation matching and scam detection.",
    ],
    cover: withBase("/images/software/oski.jpg"),
    duration: "2025",
    year: 2025,
    order: 2,
    status: "active",
    tags: ["React 19", "TypeScript", "MapLibre", "Supabase"],
    role: "Solo full-stack developer.",
    problem:
      "Berkeley's sublet market runs on group chats and Facebook posts: no pricing transparency, no way to vet a stranger, and real scam risk for students signing from across the country.",
    approach: "One flow — search on a live map, vet the lister, calculate the true monthly cost, generate an agreement — with trust signals built into every step.",
    results: "An end-to-end marketplace with the trust layer Berkeley's group-chat market lacks, at 75+ source files.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/Oski-Leases" }],
  },
  {
    slug: "builddash",
    category: "software",
    title: "BuildDash",
    tagline: "A marketplace matching part designs to local makers.",
    summary:
      "A full-stack Next.js 16 marketplace where buyers upload a 3D model, get an instant preview and price quote, and are matched to nearby fabricators by distance, backed by a Python pricing engine for the platform's unit economics.",
    impact: ["330+ machines across 6 processes", "Three.js STL viewer + Leaflet matching", "Python pricing engine"],
    stats: [
      { value: "330+", label: "machines modeled" },
      { value: "6", label: "processes: FDM, SLA, CNC, laser, plasma, waterjet" },
    ],
    highlights: [
      "Built a two-sided Next.js 16 marketplace with separate buyer and seller dashboards.",
      "Added STL upload with an instant Three.js preview and an automated quote.",
      "Matched buyers to nearby fabricators by distance with Leaflet.",
      "Wrote a standalone Python engine modeling per-process cost and platform commission.",
    ],
    cover: withBase("/images/software/builddash.jpg"),
    duration: "2026",
    year: 2026,
    order: 3,
    status: "active",
    tags: ["Next.js 16", "Three.js", "Leaflet", "Supabase", "Python"],
    role: "Solo full-stack developer.",
    problem:
      "Getting one custom part made means cold-emailing shops, guessing at price and waiting days for a quote, while capable printers and CNC machines sit idle a few blocks away.",
    approach: "Upload → preview → quote → match, in one flow, with a pricing engine behind it so the platform's margins are modeled, not guessed.",
    results: "An end-to-end flow across 330+ machines and 6 processes, with separate buyer and seller earnings dashboards.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/BuildDash" }],
  },
  {
    slug: "graded",
    category: "software",
    title: "Graded",
    tagline: "Tells you exactly what you need on the final.",
    summary:
      "A Svelte grade calculator that recomputes weighted grades on every keystroke and back-solves the score needed for each letter grade, with Berkeley-style exam clobber and curved (z-score) tests, at $0 to run.",
    impact: ["~10 KB runtime bundle", "$0 hosting", "Clobber + curve grade math"],
    stats: [
      { value: "~10 KB", label: "runtime bundle" },
      { value: "$0", label: "to run at any scale — static + localStorage" },
    ],
    highlights: [
      "Built a Svelte SPA that recomputes weighted grades on every keystroke.",
      "Back-solved the score needed on the final for each letter-grade cutoff.",
      "Implemented Berkeley-specific exam clobber and curved (z-score) test math.",
      "Kept it fully client-side (localStorage), so it costs nothing to operate.",
    ],
    cover: withBase("/images/software/graded.jpg"),
    duration: "2025",
    year: 2025,
    order: 4,
    status: "active",
    tags: ["Svelte", "Vite", "Applied math"],
    role: "Solo developer and product designer.",
    problem: "Every time a score posts, students recompute their grade by hand and still can't answer the question that matters: what do I need on the final?",
    approach: "Do the math on every keystroke, in the browser, with the course's real rules (clobber, curves) built in.",
    results: "A ~10 KB app that answers the question instantly, with no login, no backend and no running cost.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/Graded" }],
  },
  {
    slug: "this-portfolio",
    category: "software",
    title: "This Portfolio",
    tagline: "The site you're reading — rebuilt from scratch three times.",
    summary:
      "Designed and built this portfolio in React — three ground-up rebuilds, from a Next.js template to a dark-glass phase to this custom light-hero / dark-gallery system, iterated with audits for accessibility, performance and the ever-important “does this look AI-made” test.",
    impact: ["3 ground-up rebuilds", "Custom design system, audited to WCAG AA", "React + Vite + Framer Motion"],
    stats: [
      { value: "3", label: "ground-up rebuilds" },
      { value: "AA", label: "WCAG contrast target across both themes" },
    ],
    highlights: [
      "Rebuilt the site three times, each from a blank repo.",
      "Designed a light-to-dark system with a single signal-orange accent.",
      "Audited each pass against UX heuristics, WCAG AA and Core Web Vitals.",
      "Deployed on GitHub Pages with a client-side router and deep-link fallback.",
    ],
    cover: withBase("/images/software/portfolio-triptych.jpg"),
    coverCaption: "v1, v2 and v3, stacked.",
    duration: "2025 — Present",
    year: 2026,
    order: 5,
    status: "active",
    tags: ["React", "Vite", "TypeScript", "Framer Motion", "Tailwind CSS"],
    role: "Sole designer and developer: design system, every component, content and deploy.",
    problem:
      "My first portfolio was a Next.js template: a circle-cropped hiking photo, a friendly “Hi, I'm Adam Tang!” and two buttons. Recruiters decide in about five seconds, and a template doesn't win them.",
    approach:
      "v2 went all-in on dark glassmorphism and a Playfair serif — and Every Noun Became Title Case. v3 is a ground-up rebuild: custom hero, one cohesive system, one accent, and audits instead of vibes.",
    results: "The site you're on now. Three versions, each one a lesson in restraint.",
    media: [
      {
        type: "image",
        src: withBase("/images/software/portfolio-v1.jpg"),
        label: "v1 home",
        caption: "v1 — “Hi, I'm Adam Tang!” A circle-cropped hiking photo on a Next.js template. This pic is from so long ago it got chopped. We all start somewhere.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-v2.jpg"),
        label: "v2 home",
        caption: "v2 — the dark-glass era. Glassmorphism, a Playfair serif, and the conviction that Every Word Deserves Capital Letters. At least I got a real headshot.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-v3.jpg"),
        label: "v3 home",
        caption: "v3 — the one you're reading. Custom mirror-hero, cohesive system, one orange accent, and the hard-won lesson that restraint is a feature.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v1.jpg"),
        label: "v1 projects",
        caption: "v1's projects page: a tidy grid of template cards. Perfectly readable, perfectly forgettable.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v2.jpg"),
        label: "v2 projects",
        caption: "v2's zig-zag timeline. Slick in a screenshot, but your eyes had to slalom left-right-left to compare two projects.",
      },
      {
        type: "image",
        src: withBase("/images/software/portfolio-projects-v3.jpg"),
        label: "v3 projects",
        caption: "v3 — same work, finally on one axis: a two-column grid, a Hardware / Software toggle, and tiles that play a demo on hover.",
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
      "A Node/Express + SQLite backend, a Chrome extension and a Tauri/Rust desktop app that ingest curated tech sources and LLM-summarize them into 3–7 ranked daily headlines on a schedule.",
    impact: ["Monitors 30–75 curated sources", "Ingest → cluster → score → summarize", "3 surfaces"],
    stats: [
      { value: "30–75", label: "curated sources monitored" },
      { value: "3–7", label: "ranked headlines a day" },
      { value: "3", label: "surfaces: backend, extension, desktop" },
    ],
    highlights: [
      "Built a scheduled pipeline that ingests a curated whitelist, then clusters, scores and LLM-summarizes it.",
      "Shipped the digest to three surfaces: a Node/Express + SQLite backend, a Chrome extension and a Tauri/Rust desktop app.",
    ],
    cover: "",
    placeholder: true,
    duration: "2026",
    year: 2026,
    order: 6,
    status: "active",
    tags: ["TypeScript", "Node", "SQLite", "LLM", "Tauri / Rust"],
    role: "Solo developer: backend, extension and desktop app.",
    problem: "Tech news is a scroll trap: high noise, low signal. I wanted the day's real headlines delivered passively, not another feed.",
    approach: "Curate the sources, let a scheduled pipeline cluster and rank them, and push only the top few as one-line summaries.",
    results: "One passive daily digest across three surfaces, distilling 30–75 sources into a handful of headlines.",
    links: [{ label: "GitHub", href: "https://github.com/antangled/NewsFlash" }],
  },
];

export const projects: Project[] = [...hardware, ...software];

/** Home-page proof strip: one hands-on photo per build, shown directly under the hero. */
export const buildStrip: { slug: string; label: string; alt: string; src: string }[] = [
  { slug: "internal-cycloidal-actuator", label: "Cycloidal actuator", alt: "Cycloidal actuator prototype v2 held in hand", src: withBase("/images/strip/cycloidal.jpg") },
  { slug: "eldaeon-passive-radar-system", label: "Passive radar", alt: "Eldaeon passive radar rig on a tripod in the lab", src: withBase("/images/strip/radar.jpg") },
  { slug: "biodiversity-sensing-module", label: "Sensing module", alt: "Custom biodiversity sensing PCB held in hand", src: withBase("/images/strip/biodiversity.jpg") },
  { slug: "polysynth-x", label: "PolySynth X", alt: "PolySynth X circuit board and 3D-printed keybed", src: withBase("/images/strip/polysynth.jpg") },
  { slug: "solar-array-optimization", label: "Solar race car", alt: "CalSol solar race car on track", src: withBase("/images/strip/calsol.jpg") },
  { slug: "compact-automated-aquaponics", label: "Aquaponics", alt: "Automated aquaponics system in a dining hall", src: withBase("/images/strip/aquaponics.jpg") },
];

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
