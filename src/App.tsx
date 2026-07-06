import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { SmoothScroll } from "./components/SmoothScroll";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Home } from "./components/home/Home";

// Code-split the dark /projects routes so the landing page doesn't ship them.
const ProjectsGallery = lazy(() =>
  import("./components/projects/ProjectsGallery").then((m) => ({ default: m.ProjectsGallery }))
);
const ProjectDetail = lazy(() =>
  import("./components/projects/ProjectDetail").then((m) => ({ default: m.ProjectDetail }))
);

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
        <Suspense fallback={<div className="min-h-screen bg-night-900" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsGallery />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </SmoothScroll>
    </MotionConfig>
  );
}
