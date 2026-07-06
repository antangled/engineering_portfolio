import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { SmoothScroll } from "./components/SmoothScroll";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Home } from "./components/home/Home";
import { ProjectsGallery } from "./components/projects/ProjectsGallery";
import { ProjectDetail } from "./components/projects/ProjectDetail";

function RouteEffects() {
  const { pathname } = useLocation();
  const dark = pathname.startsWith("/projects");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("bg-night-900", dark);
    document.body.classList.toggle("bg-paper", !dark);
  }, [dark]);

  return null;
}

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion component honor
    // prefers-reduced-motion (disables transform/layout moves, keeps fades) —
    // the CSS media block alone can't gate JS-driven animation.
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Cursor />
        <Nav />
        <RouteEffects />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsGallery />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </SmoothScroll>
    </MotionConfig>
  );
}
