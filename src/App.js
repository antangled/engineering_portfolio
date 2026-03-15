import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail, Phone, Download, Linkedin, Github, Youtube, Instagram } from "lucide-react";
import { Button } from "./components/ui/button";
const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
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
const projects = [
    {
        slug: "eldaeon-passive-radar-system",
        title: "Eldaeon Passive Radar System",
        description: "Developing a passive radar system for low-cost, wide-area detection and tracking using ambient RF signals.",
        image: withBase("/images/projects/Eldaeon/Eldaeon.jpg"),
        content: "Project details coming soon. This page is a placeholder — check back for a full write-up on the Eldaeon Passive Radar System."
    },
    {
        slug: "polysynth-x-mpe-synth-keyboard",
        title: "PolySynth X",
        description: "Designed and built a fully custom hyper-expressive MPE keyboard, integrating real-time embedded firmware with hand-engineered compliant key mechanisms.",
        image: withBase("/images/projects/PolysynthX/polysynthx.jpg"),
        content: "Led end-to-end R&D of a fully custom hyper-expressive MPE keyboard, using subtractive hall sensors to measure key velocity, side-to-side pitch bend, and polyphonic aftertouch. Designed compliant mechanisms for each key to mimic the hammer action of upright pianos. Developed low-latency firmware on the Daisy Seed microcontroller (ARM Cortex-M7) to perform high-rate sensor readings and synthesizer outputs. Custom-built PCBs for precise hall sensor positioning and laser-cut acrylic light-up keys (in development still) for flashier performance. All in a super compact, portable package."
    },
    {
        slug: "low-cost-biodiversity-sensing-module",
        title: "Low-Cost AI-Powered Biodiversity-Sensing Module",
        description: "Designed fully-custom, modular, low-cost biodiversity sensor nodes, utilizing on-device AI to optimize data collection.",
        image: withBase("/images/projects/BiodiversityTech/BiodiversityTech.jpg"),
        content: "Led hardware design and firmware for a distributed sensor network that identifies wildlife activity using edge AI. Optimized power delivery with custom buck converters, added solar recharging, and trained lightweight audio models to run on an ESP32-S3."
    },
    {
        slug: "solar-array-optimization",
        title: "Solar Array Optimization",
        description: "Designed array telemetry and bypass-diode placement experiments for a solar race car; improved partial-shade output by 12%.",
        image: withBase("/images/projects/CalSol/CalSol_Excalibur.jpg"),
        content: "Collaborated with the CalSol race team to instrument the Excalibur array with custom telemetry, mapping cell mismatch under dynamic shading. Simulated bypass-diode placements, validated the best layout in a controlled track environment, and raised partial-shade efficiency by 12% while keeping thermal loads in check."
    },
    {
        slug: "compact-automated-aquaponics-system",
        title: "Compact Automated Aquaponics System",
        description: "Designed (CAD) and manufactured a fully automated aquaponics system that supplied our dining hall with fresh lettuce and fish, serving as multidisciplinary educational tool.",
        image: withBase("/images/projects/Aquaponics/AquaponicsDLab.jpg"),
        content: "Architected an intelligent aquaponics platform with modular grow towers, nutrient balancing, and automated fish feeding. Designed the structure in Fusion 360, CNC-milled the frame, and built a sensor + control stack with Node-RED dashboards. The system now supplies produce to the dining hall and serves as a living lab."
    },
    {
        slug: "microplastics-dynamics-research",
        title: "Flume-Simulated + Field Microplastics Dynamics Research",
        description: "Investigated the movement and behavior of microscopic particles within the vertical water table and quantified the levels of microplastic pollution in local rivers.",
        image: withBase("/images/projects/Microplastics/Microplastics.jpg"),
        content: "Designed flume experiments and in-situ sampling campaigns to map microplastic transport across hydrologic zones. Built image-processing pipelines for particle classification, calibrated sensors for salinity and turbidity, and created open-access datasets that informed local mitigation policies."
    }
];
const skillCategories = [
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
    return (_jsxs("div", { className: "relative min-h-screen overflow-hidden bg-[#15181d] text-white", children: [_jsx("div", { className: "absolute inset-0 -z-20 bg-gradient-to-br from-[#1a1d23] via-[#161921] to-[#12141a]" }), _jsx("div", { className: "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" }), _jsx("div", { className: "pointer-events-none absolute inset-0 -z-[5] opacity-25 mix-blend-screen bg-[linear-gradient(120deg,rgba(200,210,230,0.3)_1px,transparent_1px),linear-gradient(60deg,rgba(120,135,170,0.2)_1px,transparent_1px)] bg-[length:40px_64px]" }), _jsxs("div", { className: "relative mx-auto flex min-h-screen w-full max-w-[1300px] flex-col px-4 pb-20 pt-6 sm:px-8 lg:px-10", children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsPage, { projects: projects }) }), _jsx(Route, { path: "/projects/:slug", element: _jsx(ProjectDetailPage, { projects: projects }) })] })] })] }));
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
    return (_jsxs(motion.header, { initial: { opacity: 0, y: -18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" }, className: "flex items-center justify-between rounded-full border border-white/10 bg-black/50 px-6 py-4 text-sm uppercase tracking-[0.3em]", children: [_jsx(Link, { to: "/", className: "text-lg font-semibold tracking-[0.6em] text-white transition hover:text-white/80", children: "Adam Tang" }), _jsxs("nav", { className: "hidden gap-6 text-xs sm:flex", children: [navLinks.map((link) => (_jsx(Link, { to: link.to, className: `transition-colors ${activePath === link.to ? "text-white" : "text-white/70 hover:text-white"}`, children: link.label }, link.to))), _jsx("button", { className: "bg-transparent text-white/70 transition hover:text-white focus:outline-none", onClick: handleAboutClick, type: "button", children: "ABOUT" }), _jsx("a", { className: "text-white/70 transition hover:text-white", href: "https://www.linkedin.com/in/adam-tang-2374992a7", children: "Contact" })] })] }));
}
function HomePage() {
    const { scrollY } = useScroll();
    const imageOffset = useTransform(scrollY, (value) => value * 0.3);
    const contentOffset = useTransform(scrollY, (value) => value * -0.1);
    const location = useLocation();
    const navigate = useNavigate();
    const aboutBoxRef = useRef(null);
    const aboutVideoRef = useRef(null);
    const isAboutBoxInViewRef = useRef(false);
    const { scrollYProgress: aboutScrollProgress } = useScroll({
        target: aboutBoxRef,
        offset: ["start end", "end start"]
    });
    useEffect(() => {
        const scrollTarget = location.state?.scrollTarget;
        if (scrollTarget === "about") {
            let timeoutId = null;
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
        if (!target)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            isAboutBoxInViewRef.current = entry.isIntersecting;
        }, { threshold: 0.25 });
        observer.observe(target);
        return () => observer.disconnect();
    }, []);
    useMotionValueEvent(aboutScrollProgress, "change", (value) => {
        if (!isAboutBoxInViewRef.current)
            return;
        const video = aboutVideoRef.current;
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0)
            return;
        const clampedProgress = Math.min(Math.max(value, 0), 1);
        const nextTime = clampedProgress * video.duration;
        if (Math.abs(nextTime - video.currentTime) < 0.005)
            return;
        video.currentTime = nextTime;
    });
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    return (_jsxs(_Fragment, { children: [_jsxs("main", { className: "mt-12 flex flex-1 flex-col gap-8 lg:flex-row", children: [_jsx(motion.div, { initial: { opacity: 0, x: -48 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.7, ease: "easeOut" }, className: "relative flex-[0.9] overflow-hidden rounded-[3.5rem] bg-[#78797c] shadow-[0_50px_120px_-70px_rgba(0,0,0,0.75)] lg:-ml-6", children: _jsxs(motion.div, { style: { y: imageOffset }, className: "absolute inset-0", children: [_jsx("img", { alt: "Hero", src: heroImage, fetchPriority: "high", className: "h-full w-full object-cover", style: { objectPosition: "30% 50%" } }), _jsx("div", { className: "absolute inset-0 bg-black/15" })] }) }), _jsxs(motion.section, { initial: { opacity: 0, x: 48 }, animate: { opacity: 1, x: 0 }, style: { y: contentOffset }, transition: { duration: 0.7, ease: "easeOut", delay: 0.1 }, className: "relative flex w-full flex-[1.1] flex-col justify-center overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#20242c]/65 px-10 py-12 text-white shadow-[0_45px_120px_-70px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-16 lg:-mr-6", children: [_jsxs("div", { className: "absolute inset-0 -z-10", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center blur-sm grayscale brightness-75 opacity-85", style: { backgroundImage: `url(${heroFeatureImage})` } }), _jsx("div", { className: "absolute inset-0 bg-[#20242c]/70" })] }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-[0.65rem] uppercase tracking-[0.7em] text-white/35", children: "Engineering Portfolio" }), _jsx("h1", { className: "font-display text-[3.6rem] font-semibold leading-none sm:text-[4.25rem]", children: "Adam Tang" }), _jsx("p", { className: "text-xs uppercase tracking-[0.45em] text-white/70", children: "UC Berkeley EECS" }), _jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-white/75", children: "Mechatronics \u00B7 Embedded Systems \u00B7 Sustainability" }), _jsx("div", { className: "h-px w-16 bg-white/30" })] }), _jsxs("div", { className: "mt-6 space-y-3 text-base leading-relaxed text-white/75", children: [_jsx("p", { children: "Hey, I'm Adam! I design systems and products that question the impossible." }), _jsx("div", { className: "h-px w-12 bg-white/30" }), _jsx("p", { children: "My work stretches along electrical, mechanical, and computer engineering. If you're into cross-disciplinary builds, sharp design, and systems that don't just sit there looking pretty---check out the projects page. That\u2019s where the good stuff lives." })] }), _jsx("div", { className: "mt-10 flex flex-wrap items-center gap-4", children: _jsx(Button, { asChild: true, size: "lg", variant: "default", className: "group relative overflow-visible gap-2 rounded-full bg-white px-6 text-black transition hover:scale-[1.03] hover:bg-white/90", children: _jsxs(Link, { to: "/projects", children: [_jsxs("span", { className: "pointer-events-none absolute -inset-4 -z-10 opacity-0 transition duration-200 group-hover:opacity-100", children: [_jsx("span", { className: "absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-[5px] transition duration-200 group-hover:scale-105" }), _jsx("span", { className: "absolute -left-2 top-1 h-6 w-6 rounded-full bg-white/55 blur-[3px] transition duration-200 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:scale-120" }), _jsx("span", { className: "absolute -right-3 top-4 h-5 w-5 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:scale-120" }), _jsx("span", { className: "absolute right-5 -bottom-3 h-7 w-7 rounded-full bg-white/40 blur-[3px] transition duration-200 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:scale-110" }), _jsx("span", { className: "absolute left-2 -bottom-2 h-4 w-4 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:-translate-x-1 group-hover:translate-y-2 group-hover:scale-115" }), _jsx("span", { className: "absolute left-8 -top-3 h-3 w-3 rounded-full bg-white/45 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:-translate-y-2 group-hover:scale-110" }), _jsx("span", { className: "absolute -right-1 top-9 h-3 w-3 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:scale-110" }), _jsx("span", { className: "absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110" }), _jsx("span", { className: "absolute left-5 bottom-6 h-2.5 w-2.5 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-110" }), _jsx("span", { className: "absolute -left-1 bottom-6 h-2 w-2 rounded-full bg-white/40 blur-[2px] transition duration-200 group-hover:-translate-x-1 group-hover:translate-y-1 group-hover:scale-110" })] }), "My Projects", _jsx(ArrowRight, { className: "ml-2 h-4 w-4" })] }) }) }), _jsxs("div", { className: "mt-10 space-y-3 text-sm text-white/80", children: [_jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("a", { className: "flex min-w-[180px] flex-1 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 py-3 transition hover:bg-white/10", href: "mailto:adam@example.com", children: [_jsx(Mail, { className: "h-4 w-4" }), "adamtang0715@gmail.com"] }), _jsxs("a", { className: "flex min-w-[180px] flex-1 items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 py-3 transition hover:bg-white/10", href: "tel:+13012756996", children: [_jsx(Phone, { className: "h-4 w-4" }), "(301) 275-6996"] })] }), _jsx(Button, { asChild: true, className: "w-full gap-2 rounded-full bg-white text-black hover:bg-white/90", size: "lg", variant: "default", children: _jsxs("a", { download: true, href: resumeFile, rel: "noopener", children: [_jsx(Download, { className: "h-4 w-4" }), "Download My Resume"] }) })] }), _jsxs("div", { className: "mt-8 flex items-center gap-4 text-white/70", children: [_jsx("a", { "aria-label": "LinkedIn", className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20", href: "https://www.linkedin.com/in/adam-tang-2374992a7", target: "_blank", rel: "noreferrer", children: _jsx(Linkedin, { className: "h-4 w-4" }) }), _jsx("a", { "aria-label": "Instagram", className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20", href: "https://www.instagram.com/atangled_studio/", target: "_blank", rel: "noreferrer", children: _jsx(Instagram, { className: "h-4 w-4" }) }), _jsx("a", { "aria-label": "GitHub", className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20", href: "https://github.com/antangled?tab=repositories", target: "_blank", rel: "noreferrer", children: _jsx(Github, { className: "h-4 w-4" }) }), _jsx("a", { "aria-label": "YouTube", className: "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20", href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", target: "_blank", rel: "noreferrer", children: _jsx(Youtube, { className: "h-4 w-4" }) })] })] })] })] }), _jsxs("section", { id: "about", className: "mt-16 space-y-12", children: [_jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 1, ease: "easeOut" }, className: "rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 px-10 py-4 text-center text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6", children: _jsx("p", { className: "text-[1.85rem] font-semibold uppercase tracking-[0.55em] sm:text-[2.15rem]", children: "About Me" }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 1, ease: "easeOut" }, className: "grid overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]", ref: aboutBoxRef, children: [_jsx("div", { className: "p-10", children: _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "space-y-2", children: _jsx("h2", { className: "font-display text-3xl font-semibold sm:text-4xl", children: "Building thoughtful, resilient systems." }) }), _jsx("p", { className: "text-base leading-relaxed text-white/70", children: "I\u2019m Adam Tang\u2014an engineer passionate about crafting autonomous platforms, responsive hardware, and immersive product experiences. From prototyping intelligent robots to designing carbon-conscious solutions, my work focuses on translating complex problems into tangible yet elegant outcomes." }), _jsx("p", { className: "text-base leading-relaxed text-white/70", children: "Outside the lab, you can find me documenting builds on Instagram or biking new trails. I thrive in cross-disciplinary teams where curiosity, empathy, and precise execution intersect." }), _jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-white/60", children: [_jsx("span", { className: "rounded-full border border-white/12 px-4 py-2", children: "Rapid Prototyping" }), _jsx("span", { className: "rounded-full border border-white/12 px-4 py-2", children: "Autonomy" }), _jsx("span", { className: "rounded-full border border-white/12 px-4 py-2", children: "Sustainable Design" })] })] }) }), _jsx("div", { className: "relative flex min-h-[360px]", children: _jsx("video", { ref: aboutVideoRef, className: "absolute inset-0 h-full w-full object-cover", src: aboutVideo, muted: true, playsInline: true, preload: "metadata" }) })] }), _jsxs("div", { className: "grid gap-8 text-white lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 1, ease: "easeOut" }, className: "rounded-[3.5rem] border border-white/10 bg-[#14171d]/65 p-10 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-ml-6", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.45em] text-white", children: "Skills" }), _jsx("div", { className: "mt-6 space-y-7", children: skillCategories.map((category) => (_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-white/50", children: category.title }), _jsx("div", { className: "mt-3 space-y-3", children: category.skills.map((skill) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-32 text-sm text-white/80", children: skill.name }), _jsxs("div", { className: "relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" }), _jsx(motion.div, { initial: { width: "0%" }, whileInView: { width: `${skill.level * 100}%` }, viewport: { once: true, amount: 0.5 }, transition: { duration: 1, ease: "easeOut" }, className: "absolute inset-y-0 left-0 rounded-full bg-white" })] })] }, skill.name))) })] }, category.title))) })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 1, ease: "easeOut" }, className: "relative overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#1c2028]/85 p-10 text-base leading-relaxed text-white/80 shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mr-6", children: [_jsx("h2", { className: "font-display text-3xl font-semibold sm:text-4xl", children: "My Background" }), _jsx("div", { className: "h-px w-12 bg-white/15" }), _jsx("p", { className: "mt-4", children: "At UC Berkeley, I study Electrical Engineering & Computer Science with a minor in Bioengineering. I lead the engineering for Echeverri Lab\u2019s Solar-Powered Biodiversity Sensing Module \u2014 a rugged, satellite-IoT embedded field system for wildlife tracking. I\u2019m also a solar engineer at CalSol, Berkeley\u2019s Solar Vehicle Team, where I optimize solar array layout and integration for our 11th-gen car." }), _jsx("p", { className: "mt-6", children: "As much as I love to learn, I love to lead. Before Berkeley, I led the mechanical team of MUREX, our school\u2019s underwater robotics competition team, with our 6-DOF ROV gaining 6th place at World Finals, and led the design of a compact aquaponics unit with biofiltration and real-time ammonia and pH sensing \u2014 now deployed as a sustainable food solution for our dining hall." }), _jsx("p", { className: "mt-6", children: "My engineering DNA is a mix of customer-centric builds, system-level thinking, and sustainability by design. I\u2019ve been fortunate to receive awards from NASA, EPA, and ISEF for environmental tech research, and represented my work as a youth delegate at the UN Climate Conference (COP28) in Dubai. I want to continue making that sustainable, tech-driven impact wherever I go." }), _jsxs("div", { className: "pointer-events-none absolute bottom-6 right-6 flex gap-3 opacity-60", children: [_jsx("div", { className: "h-[4.5rem] w-[4.5rem] rounded-[1.25rem] border border-white/25 bg-white/15" }), _jsx("div", { className: "mt-3 h-[3.5rem] w-[3.5rem] rounded-[1rem] border border-white/20 bg-white/12" })] })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 1, ease: "easeOut" }, className: "rounded-[3.5rem] border border-white/10 bg-[#1c2028]/90 px-10 py-16 text-center text-white shadow-[0_35px_120px_-70px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:-mx-6", children: _jsx("p", { className: "font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl", children: "Let\u2019s build something that matters." }) }), _jsx("footer", { className: "flex justify-center pt-6", children: _jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsxs(Link, { className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/80 transition hover:bg-white/10 hover:text-white", to: "/projects", children: ["My Projects", _jsx(ArrowRight, { className: "h-4 w-4" })] }), _jsxs("button", { className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10 hover:text-white", onClick: scrollToTop, type: "button", children: ["Back To Top", _jsx(ArrowRight, { className: "h-4 w-4 rotate-[-90deg]" })] })] }) })] })] }));
}
function ProjectsPage({ projects }) {
    return (_jsxs("section", { id: "projects", className: "mt-20 flex flex-1 flex-col text-white", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.5em] text-white/40", children: "Adam Tang" }), _jsx("h1", { className: "font-display text-3xl font-semibold sm:text-4xl", children: "Selected Engineering Projects" })] }), _jsx("p", { className: "max-w-lg text-sm text-white/60", children: "A collection of engineering projects ranging from green tech to embedded systems." })] }), _jsx("div", { className: "mt-12 grid gap-8 sm:grid-cols-2", children: projects.map((project, index) => (_jsx(ProjectCard, { delay: index * 0.05, project: project }, project.slug))) })] }));
}
function ProjectCard({ project, delay }) {
    const [cursor, setCursor] = useState(null);
    const [cursorVisible, setCursorVisible] = useState(false);
    return (_jsx(motion.article, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut", delay }, className: "group relative h-[320px] overflow-hidden rounded-[3rem] border border-white/10 bg-[#1d2027]/75 shadow-[0_30px_100px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl", onMouseMove: (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setCursor({ x, y });
        }, onMouseEnter: () => setCursorVisible(true), onMouseLeave: () => {
            setCursor(null);
            setCursorVisible(false);
        }, children: _jsxs(Link, { className: "absolute inset-0 block cursor-none focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40", to: `/projects/${project.slug}`, children: [_jsx("img", { alt: project.title, src: project.image, className: "absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-[0.55]" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50 opacity-0 transition group-hover:opacity-100" }), _jsxs("div", { className: "relative flex h-full flex-col items-center justify-center px-8 text-center", children: [_jsx("h3", { className: "text-2xl font-semibold tracking-tight text-shadow-soft transition-opacity duration-300 group-hover:opacity-0", children: _jsx("span", { className: "inline-flex rounded-full border border-white/15 bg-[#20242c]/65 px-4 py-2 backdrop-blur-sm", children: project.title }) }), _jsx("div", { className: "absolute inset-x-0 bottom-0 translate-y-6 px-8 pb-8 text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100", children: project.description })] }), cursor && cursorVisible && (_jsx(motion.div, { animate: { scale: cursorVisible ? 1 : 0 }, initial: { scale: 0 }, transition: { type: "spring", stiffness: 260, damping: 20 }, className: "pointer-events-none absolute flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#12141a] shadow-lg", style: { left: `calc(${cursor.x}px - 1.75rem)`, top: `calc(${cursor.y}px - 1.75rem)` }, children: _jsx(ArrowRight, { className: "h-5 w-5" }) }))] }) }));
}
function ProjectDetailPage({ projects }) {
    const { slug } = useParams();
    const project = projects.find((item) => item.slug === slug);
    if (!project) {
        return (_jsxs("div", { className: "mt-20 flex flex-1 flex-col items-center justify-center text-center text-white/70", children: [_jsx("p", { className: "text-lg", children: "Project not found." }), _jsx(Link, { className: "mt-6 text-white underline underline-offset-4 transition hover:text-white/70", to: "/projects", children: "Back to projects" })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "mt-16 grid flex-1 gap-8 text-white lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]", children: [_jsx(motion.div, { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl", children: _jsx("img", { alt: project.title, className: "h-full w-full object-cover", src: project.image }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 }, className: "flex flex-col justify-between rounded-[3.5rem] border border-white/10 bg-[#1d2027]/85 px-10 py-12 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-16", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.5em] text-white/45", children: "Project" }), _jsx("h1", { className: "font-display text-4xl font-semibold leading-tight sm:text-5xl", children: project.title }), _jsx("p", { className: "text-base leading-relaxed text-white/75", children: project.description }), project.content && _jsx("p", { className: "text-base leading-relaxed text-white/70", children: project.content })] }), _jsxs("div", { className: "mt-10 flex flex-wrap gap-4 text-sm", children: [_jsx(Link, { className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10", to: "/projects", children: "\u2190 Back to projects" }), _jsx(Link, { className: "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/10", to: "/", children: "\u2190 Home" })] })] })] }), project.slug === "polysynth-x-mpe-synth-keyboard" && (_jsxs(_Fragment, { children: [_jsxs(motion.div, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, className: "relative mt-8 overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl", children: [_jsx("div", { className: "pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm", children: "First Electrical Prototype" }), _jsx("video", { className: "w-full", controls: true, playsInline: true, preload: "metadata", children: _jsx("source", { src: polysynthVideo, type: "video/mp4" }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut", delay: 0.05 }, className: "relative mt-8 overflow-hidden rounded-[3.5rem] border border-white/10 bg-[#14171d]/70 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.6)] backdrop-blur-xl", children: [_jsx("div", { className: "pointer-events-none absolute left-6 top-6 z-10 rounded-full border border-white/15 bg-[#1d2027]/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm", children: "Compliant Mechanism Showcase" }), _jsx("video", { className: "w-full", controls: true, playsInline: true, preload: "metadata", children: _jsx("source", { src: compliantShowcaseVideo, type: "video/mp4" }) })] })] }))] }));
}
export default App;
