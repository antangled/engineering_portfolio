import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Phone, Download, Linkedin, Github, Youtube, Instagram } from "lucide-react";
import { Button } from "./components/ui/button";

type Project = {
  title: string;
  description: string;
  image: string;
  slug: string;
  content?: string;
};

type ScrollState = {
  scrollTarget?: string;
};

type SkillCategory = {
  title: string;
  skills: {
    name: string;
    level: number; // 0-1
  }[];
};

const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" }
];

const aboutVideo = withBase("/videos/video_2026-01-11_15-31-58.mov");
const polysynthVideo = withBase("/videos/polysynthshowcase.mp4");
const compliantShowcaseVideo = withBase("/videos/compliantshowcase.mp4");
const heroImage = withBase("/images/feature-v3.jpg");
const heroFeatureImage = withBase("/images/feature2.jpg");
const resumeFile = withBase("/AdamTang_Resume.pdf");

const projects: Project[] = [
  {
    slug: "eldaeon-passive-radar-system",
    title: "Eldaeon Passive Radar System",
    description:
      "Developing a passive radar system for low-cost, wide-area detection and tracking using ambient RF signals.",
    image: withBase("/images/projects/Eldaeon/Eldaeon.jpg"),
    content:
      "Project details coming soon. This page is a placeholder — check back for a full write-up on the Eldaeon Passive Radar System."
  },
  {
    slug: "polysynth-x-mpe-synth-keyboard",
    title: "PolySynth X",
    description:
      "Designed and built a fully custom hyper-expressive MPE keyboard, integrating real-time embedded firmware with hand-engineered compliant key mechanisms.",
    image: withBase("/images/projects/PolysynthX/polysynthx.jpg"),
    content:
      "Led end-to-end R&D of a fully custom hyper-expressive MPE keyboard, using subtractive hall sensors to measure key velocity, side-to-side pitch bend, and polyphonic aftertouch. Designed compliant mechanisms for each key to mimic the hammer action of upright pianos. Developed low-latency firmware on the Daisy Seed microcontroller (ARM Cortex-M7) to perform high-rate sensor readings and synthesizer outputs. Custom-built PCBs for precise hall sensor positioning and laser-cut acrylic light-up keys (in development still) for flashier performance. All in a super compact, portable package."
  },
  {
    slug: "low-cost-biodiversity-sensing-module",
    title: "Low-Cost AI-Powered Biodiversity-Sensing Module",
    description:
      "Designed fully-custom, modular, low-cost biodiversity sensor nodes, utilizing on-device AI to optimize data collection.",
    image: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"),
    content:
      "Led hardware design and firmware for a distributed sensor network that identifies wildlife activity using edge AI. Optimized power delivery with custom buck converters, added solar recharging, and trained lightweight audio models to run on an ESP32-S3."
  },
  {
    slug: "solar-array-optimization",
    title: "Solar Array Optimization",
    description:
      "Designed array telemetry and bypass-diode placement experiments for a solar race car; improved partial-shade output by 12%.",
    image: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"),
    content:
      "Collaborated with the CalSol race team to instrument the Excalibur array with custom telemetry, mapping cell mismatch under dynamic shading. Simulated bypass-diode placements, validated the best layout in a controlled track environment, and raised partial-shade efficiency by 12% while keeping thermal loads in check."
  },
  {
    slug: "compact-automated-aquaponics-system",
    title: "Compact Automated Aquaponics System",
    description:
      "Designed (CAD) and manufactured a fully automated aquaponics system that supplied our dining hall with fresh lettuce and fish, serving as multidisciplinary educational tool.",
    image: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"),
    content:
      "Architected an intelligent aquaponics platform with modular grow towers, nutrient balancing, and automated fish feeding. Designed the structure in Fusion 360, CNC-milled the frame, and built a sensor + control stack with Node-RED dashboards. The system now supplies produce to the dining hall and serves as a living lab."
  },
  {
    slug: "microplastics-dynamics-research",
    title: "Flume-Simulated + Field Microplastics Dynamics Research",
    description:
      "Investigated the movement and behavior of microscopic particles within the vertical water table and quantified the levels of microplastic pollution in local rivers.",
    image: withBase("/images/projects/Microplastics/Microplastics.jpg"),
    content:
      "Designed flume experiments and in-situ sampling campaigns to map microplastic transport across hydrologic zones. Built image-processing pipelines for particle classification, calibrated sensors for salinity and turbidity, and created open-access datasets that informed local mitigation policies."
  }
];

const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    skills: [
      { name: "Python", level: 0.8 },
      { name: "Java", level: 0.9 },
      { name: "TypeScript", level: 0.6 },
      { name: "MATLAB", level: 0.5 }
    ]
  },
  {
    title: "CAD / Simulation",
    skills: [
      { name: "Fusion 360", level: 0.7 },
      { name: "Onshape", level: 0.9 },
      { name: "Solidworks", level: 0.6 },
      { name: "ANSYS", level: 0.5 },
      { name: "KiCad", level: 0.6 }
    ]
  },
  {
    title: "Fabrication / Prototyping",
    skills: [
      { name: "3D Printing", level: 0.9 },
      { name: "Machining & Manufacturing", level: 0.8 },
      { name: "Soldering / PCBs", level: 0.8 },
      { name: "Rapid Prototyping", level: 0.8 }
    ]
  }
];

function App() {
  useEffect(() => {
    [heroImage, heroFeatureImage].forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#15181d] text-white">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#1a1d23] via-[#161921] to-[#12141a]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-[5] opacity-25 mix-blend-screen bg-[linear-gradient(120deg,rgba(200,210,230,0.3)_1px,transparent_1px),linear-gradient(60deg,rgba(120,135,170,0.2)_1px,transparent_1px)] bg-[length:40px_64px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1300px] flex-col px-4 pb-20 pt-6 sm:px-8 lg:px-10">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage projects={projects} />} />
        </Routes>
      </div>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAboutClick = () => {
    if (activePath !== "/") {
      navigate("/", { state: { scrollTarget: "about" } });
      return;
    }
    scrollToAbout();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-4 text-sm uppercase tracking-[0.3em]"
    >
      <Link to="/" className="text-lg font-semibold tracking-[0.6em] text-white transition hover:text-white/80">
        Adam Tang
      </Link>
      <nav className="hidden gap-6 text-xs sm:flex">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`transition-colors ${
              activePath === link.to ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          className="bg-transparent text-white/70 transition hover:text-white focus:outline-none"
          onClick={handleAboutClick}
          type="button"
        >
          ABOUT
        </button>
        <a className="text-white/70 transition hover:text-white" href="https://www.linkedin.com/in/adam-tang-2374992a7">
          Contact
        </a>
      </nav>
    </motion.header>
  );
}

function HomePage() {
  const { scrollY } = useScroll();
  const imageOffset = useTransform(scrollY, (value) => value * 0.3);
  const contentOffset = useTransform(scrollY, (value) => value * -0.1);
  const location = useLocation();
  const navigate = useNavigate();
  const aboutBoxRef = useRef<HTMLDivElement | null>(null);
  const aboutVideoRef = useRef<HTMLVideoElement | null>(null);
  const isAboutBoxInViewRef = useRef(false);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutBoxRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const scrollTarget = (location.state as ScrollState | null)?.scrollTarget;
    if (scrollTarget === "about") {
      let timeoutId: number | null = null;

      const scrollToSection = () => {
        const section = document.getElementById(scrollTarget);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          navigate(location.pathname, { replace: true, state: null });
          return;
        }
        timeoutId = window.setTimeout(scrollToSection, 50);
      };

      timeoutId = window.setTimeout(scrollToSection, 0);

      return () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [location, navigate]);

  useEffect(() => {
    const target = aboutBoxRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isAboutBoxInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(aboutScrollProgress, "change", (value) => {
    if (!isAboutBoxInViewRef.current) return;
    const video = aboutVideoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const clampedProgress = Math.min(Math.max(value, 0), 1);
    const nextTime = clampedProgress * video.duration;
    if (Math.abs(nextTime - video.currentTime) < 0.005) return;
    video.currentTime = nextTime;
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <main className="mt-12 flex flex-1 flex-col gap-8 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex-[0.9] overflow-hidden rounded-[3.5rem] bg-[#78797c] shadow-[0_50px_120px_-70px_rgba(0,0,0,0.75)] lg:-ml-6"
        >
          <motion.div style={{ y: imageOffset }} className="absolute inset-0">
            <img
              alt="Hero"
              src={heroImage}
              fetchPriority="high"
              className="h-full w-full object-cover"
              style={{ objectPosition: "30% 50%" }}
            />
            <div className="absolute inset-0 bg-black/15" />
          </motion.div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: contentOffset }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex w-full flex-[1.1] flex-col justify-center overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#20242c]/65 px-10 py-12 text-white shadow-[0_45px_120px_-70px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-16 lg:-mr-6"
        >
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm grayscale brightness-75 opacity-85"
              style={{ backgroundImage: `url(${heroFeatureImage})` }}
            />
            <div className="absolute inset-0 bg-[#20242c]/70" />
          </div>
          <div className="relative z-10">
            <div className="space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.7em] text-white/35">Engineering Portfolio</p>
              <h1 className="font-display text-[3.6rem] font-semibold leading-none sm:text-[4.25rem]">Adam Tang</h1>
              <p className="text-xs uppercase tracking-[0.45em] text-white/70">UC Berkeley EECS</p>
              <p className="text-sm uppercase tracking-[0.3em] text-white/75">Mechatronics · Embedded Systems · Sustainability</p>
              <div className="h-px w-16 bg-white/30" />
            </div>
            <div className="mt-6 space-y-3 text-base leading-relaxed text-white/75">
              <p>Hey, I'm Adam! I design systems and products that question the impossible.</p>
              <div className="h-px w-12 bg-white/30" />
              <p>
                My work stretches along electrical, mechanical, and computer engineering. If you're into cross-disciplinary builds, sharp
                design, and systems that don't just sit there looking pretty---check out the projects page. That’s where the good stuff
                lives.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                variant="default"
                className="group relative overflow-visible gap-2 rounded-full bg-white px-6 text-black transition hover:scale-[1.03] hover:bg-white/90"
              >
                <Link to="/projects">
                  <span className="pointer-events-none absolute -inset-4 -z-10 opacity-0 transition duration-200 group-hover:opacity-100">
                    <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-[5px] transition duration-200 group-hover:scale-105" />
                    <span className="absolute -left-2 top-1 h-6 w-6 rounded-full bg-white/55 blur-[3px] transition duration-200 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:scale-120" />
                    <span className="absolute -right-3 top-4 h-5 w-5 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:scale-120" />
                    <span className="absolute right-5 -bottom-3 h-7 w-7 rounded-full bg-white/40 blur-[3px] transition duration-200 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:scale-110" />
                    <span className="absolute left-2 -bottom-2 h-4 w-4 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:-translate-x-1 group-hover:translate-y-2 group-hover:scale-115" />
                    <span className="absolute left-8 -top-3 h-3 w-3 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:-translate-y-2 group-hover:scale-110" />
                    <span className="absolute -right-1 top-9 h-3 w-3 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:scale-110" />
                    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" />
                    <span className="absolute left-5 bottom-6 h-2.5 w-2.5 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-110" />
                    <span className="absolute -left-1 bottom-6 h-2 w-2 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:scale-110" />
                  </span>
                  My Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 space-y-3 text-sm text-white/80">
              <div className="flex flex-wrap gap-3">
                <a
                  className="flex min-w-[180px] flex-1 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                  href="mailto:adam@example.com"
                >
                  <Mail className="h-4 w-4" />
                  adamtang0715@gmail.com
                </a>
                <a
                  className="flex min-w-[180px] flex-1 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                  href="tel:+13012756996"
                >
                  <Phone className="h-4 w-4" />
                  (301) 275-6996
                </a>
              </div>
              <Button asChild className="w-full gap-2 rounded-full bg-white text-black hover:bg-white/90" size="lg" variant="default">
                <a download href={resumeFile} rel="noopener">
                  <Download className="h-4 w-4" />
                  Download My Resume
                </a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-white/70">
              <a
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                href="https://www.linkedin.com/in/adam-tang-2374992a7"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                href="https://www.instagram.com/atangled_studio/"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                href="https://github.com/antangled?tab=repositories"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noreferrer"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <section id="about" className="mt-16 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 px-10 py-4 text-center text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6"
        >
          <p className="text-[1.85rem] font-semibold uppercase tracking-[0.55em] sm:text-[2.15rem]">About Me</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
          ref={aboutBoxRef}
        >
          <div className="p-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-semibold sm:text-4xl">Building thoughtful, resilient systems.</h2>
              </div>
              <p className="text-base leading-relaxed text-white/70">
                I’m Adam Tang—an engineer passionate about crafting autonomous platforms, responsive hardware, and immersive
                product experiences. From prototyping intelligent robots to designing carbon-conscious solutions, my work focuses
                on translating complex problems into tangible yet elegant outcomes. 
              </p>
              <p className="text-base leading-relaxed text-white/70">
                Outside the lab, you can find me documenting builds on Instagram or biking new trails. I thrive in cross-disciplinary teams where curiosity, empathy, and precise execution intersect.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/12 px-4 py-2">Rapid Prototyping</span>
                <span className="rounded-full border border-white/12 px-4 py-2">Autonomy</span>
                <span className="rounded-full border border-white/12 px-4 py-2">Sustainable Design</span>
              </div>
            </div>
          </div>
          <div className="relative flex min-h-[360px]">
            <video
              ref={aboutVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={aboutVideo}
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </motion.div>

        <div className="grid gap-8 text-white lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="rounded-[3.5rem] border border-white/10 bg-[#14171d]/65 p-10 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-ml-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.45em] text-white">Skills</p>
            <div className="mt-6 space-y-7">
              {skillCategories.map((category) => (
                <div key={category.title}>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">{category.title}</p>
                  <div className="mt-3 space-y-3">
                    {category.skills.map((skill) => (
                      <div className="flex items-center gap-4" key={skill.name}>
                        <div className="w-32 text-sm text-white/80">{skill.name}</div>
                        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                          <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: `${skill.level * 100}%` }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 rounded-full bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 p-10 text-base leading-relaxed text-white/80 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mr-6"
          >
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">My Background</h2>
            <div className="h-px w-12 bg-white/15" />
            <p className="mt-4">
              At UC Berkeley, I study Electrical Engineering & Computer Science with a minor in Bioengineering. I lead the
              engineering for Echeverri Lab’s Solar-Powered Biodiversity Sensing Module — a rugged, satellite-IoT embedded field
              system for wildlife tracking. I’m also a solar engineer at CalSol, Berkeley’s Solar Vehicle Team, where I optimize
              solar array layout and integration for our 11th-gen car.
            </p>
            <p className="mt-6">
              As much as I love to learn, I love to lead. Before Berkeley, I led the mechanical team of MUREX, our school’s
              underwater robotics competition team, with our 6-DOF ROV gaining 6th place at World Finals, and led the design of a
              compact aquaponics unit with biofiltration and real-time ammonia and pH sensing — now deployed as a sustainable food
              solution for our dining hall.
            </p>
            <p className="mt-6">
              My engineering DNA is a mix of customer-centric builds, system-level thinking, and sustainability by design. I’ve
              been fortunate to receive awards from NASA, EPA, and ISEF for environmental tech research, and represented my work as
              a youth delegate at the UN Climate Conference (COP28) in Dubai. I want to continue making that sustainable,
              tech-driven impact wherever I go.
            </p>
            <div className="pointer-events-none absolute bottom-6 right-6 flex gap-3 opacity-60">
              <div className="h-[4.5rem] w-[4.5rem] rounded-[1.25rem] border border-white/25 bg-white/15" />
              <div className="mt-3 h-[3.5rem] w-[3.5rem] rounded-[1rem] border border-white/20 bg-white/12" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-[3.5rem] border border-white/10 bg-[#1c2028]/90 px-10 py-16 text-center text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6"
        >
          <p className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Let’s build something that matters.</p>
        </motion.div>

        <footer className="flex justify-center pt-6">
          <div className="flex flex-col items-center gap-4">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/80 transition hover:bg-white/10 hover:text-white"
              to="/projects"
            >
              My Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10 hover:text-white"
              onClick={scrollToTop}
              type="button"
            >
              Back To Top
              <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
            </button>
          </div>
        </footer>
      </section>
    </>
  );
}

function ProjectsPage({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mt-20 flex flex-1 flex-col text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-white/40">Adam Tang</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Selected Engineering Projects</h1>
        </div>
        <p className="max-w-lg text-sm text-white/60">
          A collection of engineering projects ranging from green tech to embedded systems.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} delay={index * 0.05} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="group relative h-[320px] overflow-hidden rounded-[3rem] border border-white/10 bg-[#1d2027]/75 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCursor({ x, y });
      }}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => {
        setCursor(null);
        setCursorVisible(false);
      }}
    >
      <Link
        className="absolute inset-0 block cursor-none focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        to={`/projects/${project.slug}`}
      >
        <img
          alt={project.title}
          src={project.image}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50 opacity-0 transition group-hover:opacity-100" />
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-shadow-soft transition-opacity duration-300 group-hover:opacity-0">
            <span className="inline-flex rounded-full border border-white/15 bg-[#20242c]/65 px-4 py-2 backdrop-blur-sm">
              {project.title}
            </span>
          </h3>
          <div className="absolute inset-x-0 bottom-0 translate-y-6 px-8 pb-8 text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            {project.description}
          </div>
        </div>
        {cursor && cursorVisible && (
          <motion.div
            animate={{ scale: cursorVisible ? 1 : 0 }}
            initial={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-none absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#12141a] shadow-lg"
            style={{ left: `calc(${cursor.x}px - 1.75rem)`, top: `calc(${cursor.y}px - 1.75rem)` }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        )}
      </Link>
    </motion.article>
  );
}

function ProjectDetailPage({ projects }: { projects: Project[] }) {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="mt-20 flex flex-1 flex-col items-center justify-center text-center text-white/70">
        <p className="text-lg">Project not found.</p>
        <Link className="mt-6 text-white underline underline-offset-4 transition hover:text-white/70" to="/projects">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="mt-16 grid flex-1 gap-8 text-white lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        >
          <img alt={project.title} className="h-full w-full object-cover" src={project.image} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col justify-between rounded-[3.5rem] border border-white/10 bg-[#1d2027]/85 px-10 py-12 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-16"
        >
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.5em] text-white/45">Project</p>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{project.title}</h1>
            <p className="text-base leading-relaxed text-white/75">{project.description}</p>
            {project.content && <p className="text-base leading-relaxed text-white/70">{project.content}</p>}
          </div>
          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10"
              to="/projects"
            >
              ← Back to projects
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10"
              to="/"
            >
              ← Home
            </Link>
          </div>
        </motion.div>
      </section>
      {project.slug === "polysynth-x-mpe-synth-keyboard" && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mt-8 overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
              First Electrical Prototype
            </div>
            <video className="w-full" controls playsInline preload="metadata">
              <source src={polysynthVideo} type="video/mp4" />
            </video>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="relative mt-8 overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
              Compliant Mechanism Showcase
            </div>
            <video className="w-full" controls playsInline preload="metadata">
              <source src={compliantShowcaseVideo} type="video/mp4" />
            </video>
          </motion.div>
        </>
      )}
    </>
  );
}

export default App;
