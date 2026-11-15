import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { DUR, EASE, useInViewOnce } from "@/lib/motion";

/**
 * Counts the first number in `value` up from 0 once, when it scrolls into view.
 * The text is rendered in full first (screenshots, no-JS, reduced motion all see
 * the real value) and the count never overshoots it.
 *   <CountUp value="2 N·m" />  <CountUp value="$1.5k" />  <CountUp value="12" />
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>(0.6);
  const reduced = useReducedMotion();
  const done = useRef(false);

  const match = value.match(/-?\d+(?:[.,]\d+)?/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || !inView || reduced || done.current) return;
    done.current = true;
    const raw = match[0];
    const target = parseFloat(raw.replace(",", ""));
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
    const [before, after] = [value.slice(0, match.index), value.slice((match.index ?? 0) + raw.length)];
    const controls = animate(0, target, {
      duration: DUR.slow * 1.5,
      ease: EASE,
      onUpdate: (n) => {
        const clamped = Math.min(n, target);
        el.textContent = before + clamped.toFixed(decimals) + after;
      },
      onComplete: () => {
        el.textContent = value;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, match, ref]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {value}
    </span>
  );
}
