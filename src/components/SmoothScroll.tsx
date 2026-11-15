import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling (Baptiste/Julien feel). Respects reduced-motion by
 * skipping initialization entirely so native scrolling stays available.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // lerp-based (not duration-based) so the viewport tracks input closely and
    // settles fast — avoids the long post-input "glide" that reads as scroll lag,
    // especially on macOS trackpads where it stacks on the trackpad's own momentum.
    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    // Exposed so overlays (the project lightbox) can pause page scrolling.
    window.__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
