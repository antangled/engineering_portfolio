import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "motion/react";

type VTDocument = Document & {
  startViewTransition?: (cb: () => Promise<void> | void) => { finished: Promise<void> };
};

/** Resolve once `selector` exists (the lazy project page has rendered), or after `ms`. */
function waitFor(selector: string, ms = 700) {
  return new Promise<void>((resolve) => {
    const t0 = performance.now();
    const tick = () => {
      if (document.querySelector(selector) || performance.now() - t0 > ms) resolve();
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

/**
 * Click handler for a link whose image should morph into the next page's image
 * (View Transitions API). Browsers without it, modified clicks and reduced motion
 * fall through to a normal <Link> navigation.
 */
export function useMorphNavigate() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  return (to: string, name: string) => (e: React.MouseEvent) => {
    const doc = document as VTDocument;
    if (!doc.startViewTransition || reduced) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    doc.startViewTransition(async () => {
      flushSync(() => navigate(to));
      window.scrollTo(0, 0);
      await waitFor(`[data-vt="${name}"]`);
    });
  };
}
