import type Lenis from "lenis";

declare global {
  interface Window {
    /** Set by SmoothScroll; absent under reduced motion. */
    __lenis?: Lenis;
  }
}

export {};
