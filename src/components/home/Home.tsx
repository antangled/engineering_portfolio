import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hero } from "./Hero";
import { FeaturedWork } from "./FeaturedWork";
import { AboutSection } from "./AboutSection";
import { Skills } from "./Skills";
import { Footer } from "./Footer";

type ScrollState = { scrollTarget?: string } | null;

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();

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
      <AboutSection />
      <Skills />
      <Footer />
    </div>
  );
}
