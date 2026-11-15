import { lazy, Suspense, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hero } from "./Hero";
import { FeaturedWork } from "./FeaturedWork";
import { Skills } from "./Skills";
import { Footer } from "./Footer";
import { usePageTitle } from "../../lib/usePageTitle";

// About (Kokonut marker/flip/particle components) is below the fold: its own chunk,
// requested as soon as this module runs, so it's there long before anyone scrolls.
const aboutChunk = import("./About");
const About = lazy(() => aboutChunk.then((m) => ({ default: m.About })));

type ScrollState = { scrollTarget?: string } | null;

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  usePageTitle();

  // Honor "scroll to about" requests coming from the nav on other routes.
  useEffect(() => {
    const target = (location.state as ScrollState)?.scrollTarget;
    if (target !== "about") return;
    let tries = 0;
    const tick = () => {
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        navigate(location.pathname, { replace: true, state: null });
      } else if (tries++ < 20) {
        setTimeout(tick, 50);
      }
    };
    const id = setTimeout(tick, 60);
    return () => clearTimeout(id);
  }, [location, navigate]);

  return (
    <div className="paper-grid">
      <Hero />
      <FeaturedWork />
      <Suspense fallback={<section id="about" className="min-h-[1600px]" />}>
        <About />
      </Suspense>
      <Skills />
      <Footer />
    </div>
  );
}
