import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useInViewOnce, useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";

// The order a real split-flap drum rolls through. Each cell steps forward one
// flap at a time until it reaches its target, so cells settle at different times.
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:+-·./";
const STEP_MS = 34;

function drumIndex(c: string) {
  const i = DRUM.indexOf(c.toUpperCase());
  return i < 0 ? 0 : i;
}

/**
 * Departure-board status line. Cycles through `messages` every `hold` ms on
 * desktop; phones and reduced motion get the first message, static.
 * Screen readers get every message once, as plain text.
 */
export function SplitFlap({
  messages,
  hold = 4200,
  className,
}: {
  messages: string[];
  hold?: number;
  className?: string;
}) {
  const width = Math.max(...messages.map((m) => m.length));
  const pad = (s: string) => s.toUpperCase().padEnd(width, " ");
  const desktop = useIsDesktop(768);
  const reduced = useReducedMotion();
  const animated = desktop && !reduced;

  const [ref, seen] = useInViewOnce<HTMLDivElement>(0.5, "0px");
  const [cells, setCells] = useState(() => pad(messages[0]).split(""));
  const target = useRef(pad(messages[0]));
  const msgIndex = useRef(0);
  const shown = useRef(cells);

  useEffect(() => {
    if (!animated || !seen) return;
    let stepTimer = 0;
    let holdTimer = 0;

    const roll = () => {
      let moving = false;
      const next = shown.current.map((c, i) => {
        const goal = target.current[i];
        if (c === goal) return c;
        if (!DRUM.includes(goal)) return goal; // not on the drum: snap straight to it
        moving = true;
        return DRUM[(drumIndex(c) + 1) % DRUM.length];
      });
      shown.current = next;
      setCells(next);
      if (moving) stepTimer = window.setTimeout(roll, STEP_MS);
      else holdTimer = window.setTimeout(advance, hold);
    };
    const advance = () => {
      if (document.hidden) {
        holdTimer = window.setTimeout(advance, hold);
        return;
      }
      msgIndex.current = (msgIndex.current + 1) % messages.length;
      target.current = pad(messages[msgIndex.current]);
      roll();
    };

    // First arrival: roll in from blank so the board visibly "boots".
    shown.current = Array(width).fill(" ");
    setCells(shown.current);
    target.current = pad(messages[0]);
    msgIndex.current = 0;
    stepTimer = window.setTimeout(roll, 250);

    return () => {
      clearTimeout(stepTimer);
      clearTimeout(holdTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, seen, hold, messages.join("|")]);

  return (
    <div ref={ref} className={cn("inline-flex", className)}>
      <span className="sr-only">{messages.join(". ")}</span>
      <span aria-hidden className="flex gap-[2px] rounded-lg bg-black/55 p-1.5 ring-1 ring-white/10">
        {cells.map((c, i) => (
          <span
            key={i}
            className="relative flex h-[1.6em] w-[1.05em] items-center justify-center overflow-hidden rounded-[3px] bg-[#16181c] font-mono text-[0.7rem] font-medium leading-none text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] sm:text-xs"
          >
            {/* key = char, so each new flap replays the fold animation */}
            <span key={animated ? c + i : i} className={cn("block", animated && "animate-flap")}>
              {c === " " ? " " : c}
            </span>
            {/* the hinge line across the middle of every flap */}
            <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-px bg-black/70" />
          </span>
        ))}
      </span>
    </div>
  );
}
