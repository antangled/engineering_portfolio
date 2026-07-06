import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../data/profile";
import { cn } from "../lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dark = location.pathname.startsWith("/projects");
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const goAbout = () => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTarget: "about" } });
      return;
    }
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkBase =
    "inline-flex items-center py-2 text-sm transition-colors duration-300 data-[active=true]:font-medium";
  const linkColor = dark
    ? "text-mist-dim hover:text-mist data-[active=true]:text-mist"
    : "text-ink-500 hover:text-ink-900 data-[active=true]:text-ink-900";

  const resumeClass = cn(
    "group inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
    dark ? "bg-mist text-night-900 hover:bg-signal hover:text-white" : "bg-ink-900 text-paper hover:bg-signal"
  );

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between px-[5vw] py-5 backdrop-blur-md transition-colors duration-500",
          dark ? "text-mist" : "text-ink-900"
        )}
      >
        <Link to="/" data-cursor="link" className="font-display text-base font-semibold tracking-tight">
          Adam Tang<span className="text-signal">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 sm:flex">
          <Link to="/projects" data-active={dark} data-cursor="link" className={cn(linkBase, linkColor)}>
            Work
          </Link>
          <button onClick={goAbout} data-cursor="link" className={cn(linkBase, linkColor)} type="button">
            About
          </button>
          <a href={profile.resume} target="_blank" rel="noreferrer" data-cursor="link" className={resumeClass}>
            Resume
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-cursor="link"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border sm:hidden",
            dark ? "border-mist/20 text-mist" : "border-ink-900/15 text-ink-900"
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className={cn(
              "mx-[5vw] flex flex-col gap-1 rounded-3xl border p-4 backdrop-blur-xl sm:hidden",
              dark ? "border-mist/10 bg-night-800/90 text-mist" : "border-ink-900/10 bg-surface/95 text-ink-900"
            )}
          >
            <Link
              to="/projects"
              data-cursor="link"
              className={cn("rounded-2xl px-4 py-3 text-sm", dark ? "hover:bg-mist/10" : "hover:bg-ink-900/5")}
            >
              Work
            </Link>
            <button
              type="button"
              onClick={goAbout}
              data-cursor="link"
              className={cn(
                "rounded-2xl px-4 py-3 text-left text-sm",
                dark ? "hover:bg-mist/10" : "hover:bg-ink-900/5"
              )}
            >
              About
            </button>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              data-cursor="link"
              className={cn(resumeClass, "mt-1 justify-center")}
            >
              Resume
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
