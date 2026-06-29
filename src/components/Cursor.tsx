import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "default" | "link" | "view";

/**
 * Custom pointer follower (Baptiste pattern). Springs toward the cursor and
 * swells into a "View" pill over gallery tiles. Pointer-fine devices only.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("View");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (el) {
        const next = (el.dataset.cursor as CursorMode) || "default";
        setMode(next);
        if (next === "view") setLabel(el.dataset.cursorLabel || "View");
      } else {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-signal font-mono uppercase tracking-widest text-white"
        animate={{
          width: mode === "view" ? 84 : mode === "link" ? 36 : 10,
          height: mode === "view" ? 84 : mode === "link" ? 36 : 10,
          opacity: mode === "link" ? 0.35 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{ x: "-50%", y: "-50%" }}
      >
        <AnimatePresence>
          {mode === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[10px]"
            >
              {label} →
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
