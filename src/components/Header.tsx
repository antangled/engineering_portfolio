import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { navLinks } from "../data/projects";

export function Header() {
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
