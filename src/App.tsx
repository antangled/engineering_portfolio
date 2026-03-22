import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { projects, heroImage, heroFeatureImage } from "./data/projects";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#15181d] text-white">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#1a1d23] via-[#161921] to-[#12141a]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-[5] opacity-25 mix-blend-screen bg-[linear-gradient(120deg,rgba(200,210,230,0.3)_1px,transparent_1px),linear-gradient(60deg,rgba(120,135,170,0.2)_1px,transparent_1px)] bg-[length:40px_64px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1300px] flex-col px-4 pb-20 pt-6 sm:px-8 lg:px-10">
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage projects={projects} />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage projects={projects} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
