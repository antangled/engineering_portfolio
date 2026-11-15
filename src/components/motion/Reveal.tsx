import { createContext, useContext, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { DUR, EASE, useInViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type RevealKind = "fade-up" | "blur-in" | "mask-line" | "wipe";

const variants: Record<RevealKind, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0 },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(10px)", scale: 1.02 },
    shown: { opacity: 1, filter: "blur(0px)", scale: 1 },
  },
  // The child rises from behind the wrapper's clipped edge (wrapper is overflow-hidden).
  "mask-line": {
    hidden: { y: "110%" },
    shown: { y: "0%" },
  },
  "wipe": {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    shown: { clipPath: "inset(0 0% 0 0)" },
  },
};

/** Set by <Stagger>: children reveal when the group enters view, offset by index. */
const StaggerCtx = createContext<{ inView: boolean } | null>(null);

type RevealProps = {
  children: ReactNode;
  kind?: RevealKind;
  delay?: number;
  duration?: number;
  className?: string;
  /** Animate on mount instead of on scroll (hero entrance). */
  immediate?: boolean;
  as?: "div" | "span" | "li" | "p";
};

/**
 * Progressive-enhancement reveal. The content is real, in-flow DOM from the first
 * render; the animation only plays it in. Reduced motion renders the final state,
 * and print CSS (globals.css, [data-reveal]) forces everything visible.
 */
export function Reveal({
  children,
  kind = "fade-up",
  delay = 0,
  duration = DUR.slow,
  className,
  immediate,
  as = "div",
}: RevealProps) {
  const group = useContext(StaggerCtx);
  const [ref, selfInView] = useInViewOnce<HTMLElement>(0.15);
  const reduced = useReducedMotion();
  const inView = immediate || (group ? group.inView : selfInView);

  const v = reduced ? { hidden: { opacity: 0 }, shown: { opacity: 1 } } : variants[kind];
  // A mask line sits inside a <span> wrapper, so it must be a span itself.
  const Comp = (kind === "mask-line" ? motion.span : motion[as]) as typeof motion.div;
  const inner = (
    <Comp
      ref={kind === "mask-line" ? undefined : (ref as never)}
      data-reveal
      className={cn(kind === "mask-line" && "block", kind !== "mask-line" && className)}
      variants={v}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
      transition={{ duration: reduced ? DUR.base : duration, ease: EASE, delay: reduced ? 0 : delay }}
    >
      {children}
    </Comp>
  );

  if (kind !== "mask-line") return inner;
  return (
    <span ref={ref as never} className={cn("block overflow-hidden", className)}>
      {inner}
    </span>
  );
}

/** Reveals its <Reveal> children together when the group enters view. */
export function Stagger({
  children,
  className,
  immediate,
}: {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.15);
  return (
    <StaggerCtx.Provider value={{ inView: immediate || inView }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerCtx.Provider>
  );
}
