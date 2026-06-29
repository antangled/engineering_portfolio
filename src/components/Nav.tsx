import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dark = location.pathname.startsWith("/projects");

  const goAbout = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTarget: "about" } });
      return;
    }
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkBase = "text-sm transition-colors duration-300 data-[active=true]:font-medium";
  const linkColor = dark
    ? "text-mist-dim hover:text-mist data-[active=true]:text-mist"
    : "text-ink-500 hover:text-ink-900 data-[active=true]:text-ink-900";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between px-[5vw] py-5 backdrop-blur-md transition-colors duration-500",
          dark ? "text-mist" : "text-ink-900"
        )}
      >
        <Link
          to="/"
          data-cursor="link"
          className="font-display text-base font-semibold tracking-tight"
        >
          Adam Tang<span className="text-signal">.</span>
        </Link>

        <nav className="flex items-center gap-7">
          <Link to="/projects" data-active={dark} data-cursor="link" className={cn(linkBase, linkColor)}>
            Work
          </Link>
          <button onClick={goAbout} data-cursor="link" className={cn(linkBase, linkColor)} type="button">
            About
          </button>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className={cn(
              "group inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm transition-colors duration-300",
              dark
                ? "border-mist/20 text-mist hover:border-signal hover:text-signal"
                : "border-ink-900/15 text-ink-900 hover:border-signal hover:text-signal-ink"
            )}
          >
            Resume
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
