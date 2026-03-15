import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Phone, Download, Linkedin, Github, Youtube, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { FloatingShapes } from "./FloatingShapes";
import {
  heroImage,
  heroFeatureImage,
  aboutVideo as aboutVideoSrc,
  resumeFile,
  skillCategories,
  type ScrollState,
} from "../data/projects";

export function HomePage() {
  const { scrollY } = useScroll();
  const innerImageY = useTransform(scrollY, [0, 600], [0, 80]);
  const location = useLocation();
  const navigate = useNavigate();
  const aboutBoxRef = useRef<HTMLDivElement | null>(null);
  const aboutVideoRef = useRef<HTMLVideoElement | null>(null);
  const isAboutBoxInViewRef = useRef(false);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutBoxRef,
    offset: ["start end", "end start"],
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
      <main className="relative mt-12 flex flex-1 flex-col gap-8 lg:flex-row">
        <FloatingShapes />
        <motion.div
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex-[0.9] overflow-hidden rounded-[3.5rem] bg-[#78797c] shadow-[0_50px_120px_-70px_rgba(0,0,0,0.75)] lg:-ml-6"
        >
          <motion.div style={{ y: innerImageY }} className="absolute inset-[-20%_0_0_0]">
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
              <p className="text-sm uppercase tracking-[0.3em] text-white/75">
                Mechatronics · Embedded Systems · Sustainability
              </p>
              <div className="h-px w-16 bg-white/30" />
            </div>
            <div className="mt-6 space-y-3 text-base leading-relaxed text-white/75">
              <p>Hey, I'm Adam! I design systems and products that question the impossible.</p>
              <div className="h-px w-12 bg-white/30" />
              <p>
                My work stretches along electrical, mechanical, and computer engineering. If you're into
                cross-disciplinary builds, sharp design, and systems that don't just sit there looking
                pretty---check out the projects page. That's where the good stuff lives.
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
                  href="mailto:adamtang0715@gmail.com"
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
              <Button
                asChild
                className="w-full gap-2 rounded-full bg-white text-black hover:bg-white/90"
                size="lg"
                variant="default"
              >
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
                <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                  Building thoughtful, resilient systems.
                </h2>
              </div>
              <p className="text-base leading-relaxed text-white/70">
                I'm Adam Tang—an engineer passionate about crafting autonomous platforms, responsive hardware, and
                immersive product experiences. From prototyping intelligent robots to designing carbon-conscious
                solutions, my work focuses on translating complex problems into tangible yet elegant outcomes.
              </p>
              <p className="text-base leading-relaxed text-white/70">
                Outside the lab, you can find me documenting builds on Instagram or biking new trails. I thrive in
                cross-disciplinary teams where curiosity, empathy, and precise execution intersect.
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
              src={aboutVideoSrc}
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
              At UC Berkeley, I study Electrical Engineering & Computer Science with a minor in Bioengineering. I lead
              the engineering for Echeverri Lab's Solar-Powered Biodiversity Sensing Module — a rugged, satellite-IoT
              embedded field system for wildlife tracking. I'm also a solar engineer at CalSol, Berkeley's Solar Vehicle
              Team, where I optimize solar array layout and integration for our 11th-gen car.
            </p>
            <p className="mt-6">
              As much as I love to learn, I love to lead. Before Berkeley, I led the mechanical team of MUREX, our
              school's underwater robotics competition team, with our 6-DOF ROV gaining 6th place at World Finals, and
              led the design of a compact aquaponics unit with biofiltration and real-time ammonia and pH sensing — now
              deployed as a sustainable food solution for our dining hall.
            </p>
            <p className="mt-6">
              My engineering DNA is a mix of customer-centric builds, system-level thinking, and sustainability by
              design. I've been fortunate to receive awards from NASA, EPA, and ISEF for environmental tech research,
              and represented my work as a youth delegate at the UN Climate Conference (COP28) in Dubai. I want to
              continue making that sustainable, tech-driven impact wherever I go.
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
          <p className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Let's build something that matters.
          </p>
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
