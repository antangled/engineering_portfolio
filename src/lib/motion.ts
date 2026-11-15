import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * v4 motion tokens. One easing curve, three durations — every animation on the
 * site picks from these so the whole page moves with one rhythm.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const DUR = { fast: 0.15, base: 0.4, slow: 0.8 } as const;

/** True once the element has scrolled into view (never flips back). */
export function useInViewOnce<T extends Element>(amount: number = 0.2, margin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount, margin: margin as never });
  return [ref, inView] as const;
}

/** Desktop-class pointer + wide viewport (pinned scroll, cursor effects, hover video). */
export function useIsDesktop(minWidth = 1024) {
  const query = `(min-width: ${minWidth}px) and (hover: hover) and (pointer: fine)`;
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return desktop;
}

/** Pinned / scroll-linked effects run only on desktop with motion allowed. */
export function useRichMotion(minWidth = 1024) {
  const desktop = useIsDesktop(minWidth);
  const reduced = useReducedMotion();
  return desktop && !reduced;
}
