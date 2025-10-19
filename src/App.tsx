import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Phone, Download, Linkedin, Github, Youtube } from "lucide-react";
import { Button } from "./components/ui/button";

type Project = {
  title: string;
  description: string;
  image: string;
  slug: string;
  content?: string;
};

const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" }
];

const aboutImages = ["/images/about-1.jpg", "/images/about-2.jpg", "/images/about-3.jpg"].map(withBase);
const heroImage = withBase("/images/feature.jpg");
const resumeFile = withBase("/resume.pdf");

const projects: Project[] = [
  {
    slug: "low-cost-biodiversity-sensing-module",
    title: "Low-Cost AI-Powered Biodiversity-Sensing Module",
    description:
      "Designed fully-custom, modular, low-cost biodiversity sensor nodes, utilizing on-device AI to optimize data collection.",
    image: withBase("/images/projects/BiodiversityTech.jpg"),
    content:
      "Led hardware design and firmware for a distributed sensor network that identifies wildlife activity using edge AI. Optimized power delivery with custom buck converters, added solar recharging, and trained lightweight audio models to run on an ESP32-S3. Deployed pilots in remote preserves, cutting per-node costs by 68%."
  },
  {
    slug: "solar-array-optimization",
    title: "Solar Array Optimization",
    description:
      "Designed array telemetry and bypass-diode placement experiments for a solar race car; improved partial-shade output by 12%.",
    image: withBase("/images/projects/CalSol_Excalibur.jpg"),
    content:
      "Collaborated with the CalSol race team to instrument the Excalibur array with custom telemetry, mapping cell mismatch under dynamic shading. Simulated bypass-diode placements, validated the best layout in a controlled track environment, and raised partial-shade efficiency by 12% while keeping thermal loads in check."
  },
  {
    slug: "compact-automated-aquaponics-system",
    title: "Compact Automated Aquaponics System",
    description:
      "Designed (CAD) and manufactured a fully automated aquaponics system that supplied our dining hall with fresh lettuce and fish, serving as multidisciplinary educational tool.",
    image: withBase("/images/projects/AquaponicsDLab.jpg"),
    content:
      "Architected an intelligent aquaponics platform with modular grow towers, nutrient balancing, and automated fish feeding. Designed the structure in Fusion 360, CNC-milled the frame, and built a sensor + control stack with Node-RED dashboards. The system now supplies produce to the dining hall and serves as a living lab."
  },
  {
    slug: "microplastics-dynamics-research",
    title: "Flume-Simulated + Field Microplastics Dynamics Research",
    description:
      "Investigated the movement and behavior of microscopic particles within the vertical water table and quantified the levels of microplastic pollution in local rivers.",
    image: withBase("/images/projects/Microplastics.jpg"),
    content:
      "Designed flume experiments and in-situ sampling campaigns to map microplastic transport across hydrologic zones. Built image-processing pipelines for particle classification, calibrated sensors for salinity and turbidity, and created open-access datasets that informed local mitigation policies."
  }
];

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#15181d] text-white">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#1a1d23] via-[#161921] to-[#12141a]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-[5] opacity-25 mix-blend-screen bg-[linear-gradient(120deg,rgba(200,210,230,0.3)_1px,transparent_1px),linear-gradient(60deg,rgba(120,135,170,0.2)_1px,transparent_1px)] bg-[length:40px_64px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1300px] flex-col px-4 pb-20 pt-6 sm:px-8 lg:px-10">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage aboutImages={aboutImages} />} />
          <Route path="/projects" element={<ProjectsPage projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage projects={projects} />} />
        </Routes>
      </div>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const activePath = location.pathname;

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
        <a className="text-white/70 transition hover:text-white" href="/#about">
          About
        </a>
        <a className="text-white/70 transition hover:text-white" href="https://www.linkedin.com/in/adam-tang-2374992a7">
          Contact
        </a>
      </nav>
    </motion.header>
  );
}

function HomePage({ aboutImages }: { aboutImages: string[] }) {
  const { scrollY } = useScroll();
  const imageOffset = useTransform(scrollY, (value) => value * 0.1);
  const contentOffset = useTransform(scrollY, (value) => value * -0.1);

  const aboutImageList = useMemo(
    () => (aboutImages.length > 0 ? aboutImages : ["/images/about.jpg"]),
    [aboutImages]
  );
  const [aboutImageIndex, setAboutImageIndex] = useState(0);

  useEffect(() => {
    if (aboutImageList.length <= 1) return;
    const timer = setInterval(() => {
      setAboutImageIndex((prev) => (prev + 1) % aboutImageList.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [aboutImageList.length]);

  return (
    <>
      <main className="mt-12 flex flex-1 flex-col gap-8 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex-[0.9] overflow-hidden rounded-[3.5rem] bg-[#1d2027]/70 shadow-[0_50px_120px_-70px_rgba(0,0,0,0.75)] lg:-ml-6"
        >
          <motion.div style={{ y: imageOffset }} className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center"style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-black/15" />
          </motion.div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: contentOffset }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex w-full flex-[1.1] flex-col justify-center rounded-[3.5rem] border border-white/10 bg-[#20242c]/80 px-10 py-12 text-white shadow-[0_45px_120px_-70px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-16 lg:-mr-6"
        >
          <div className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.7em] text-white/35">Engineering Portfolio</p>
            <h1 className="font-display text-[3.6rem] font-semibold leading-none sm:text-[4.25rem]">Adam Tang</h1>
            <p className="text-sm uppercase tracking-[0.3em] text-white/75">Embedded Systems · Robotics · Sustainability</p>
            <div className="h-px w-16 bg-white/30" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-white/75">
            Embedded systems, green technology, and endless innovation. I design autonomous systems and build sustainable
            products that question the impossible.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              variant="default"
              className="gap-2 rounded-full bg-white px-6 text-black hover:bg-white/90"
            >
              <Link to="/projects">
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
        </motion.section>
      </main>

      <motion.div
        id="about"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-16 grid gap-8 text-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 p-10 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.5em] text-white/40">About Me</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Building thoughtful, resilient systems.</h2>
            </div>
            <p className="text-base leading-relaxed text-white/70">
              I’m Adam Tang—an engineer passionate about crafting autonomous platforms, responsive hardware, and immersive
              product experiences. From prototyping intelligent robots to designing carbon-conscious solutions, my work focuses
              on translating complex problems into tangible, elegant outcomes. 
            </p>
            <p className="text-base leading-relaxed text-white/70">
              Outside the lab, you can find me documenting builds on YouTube, mentoring younger makers, or exploring trails for
              inspiration. I thrive in cross-disciplinary teams where curiosity, empathy, and precise execution intersect.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/12 px-4 py-2">Rapid Prototyping</span>
              <span className="rounded-full border border-white/12 px-4 py-2">Autonomy</span>
              <span className="rounded-full border border-white/12 px-4 py-2">Sustainable Design</span>
            </div>
          </div>
        </div>
        <motion.div
          className="relative flex min-h-[360px] overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/60 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {aboutImageList.map((src, index) => (
            <motion.div
              key={`${src}-${index}`}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${src}')` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: aboutImageIndex === index ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      </motion.div>
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
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
            {project.title}
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
  );
}

export default App;
