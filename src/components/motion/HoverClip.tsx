import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A short muted loop layered over a still. The <video> isn't even created until
 * it's needed, so the clip costs nothing for visitors who never trigger it.
 *   mode="hover":  plays while `active` (the parent's hover/focus state), desktop only
 *   mode="inview": plays while on screen (stacking cards), every device
 * Reduced motion never plays.
 */
export function HoverClip({
  src,
  active = false,
  mode = "hover",
  className,
}: {
  src: string;
  active?: boolean;
  mode?: "hover" | "inview";
  className?: string;
}) {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const holder = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  // In-view mode: watch visibility with a margin so the clip is warm on arrival.
  useEffect(() => {
    if (mode !== "inview" || !holder.current) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(holder.current);
    return () => io.disconnect();
  }, [mode]);

  const wantPlay = !reduced && (mode === "hover" ? desktop && active : onScreen);

  useEffect(() => {
    if (wantPlay) setMounted(true);
    const v = ref.current;
    if (!v) return;
    if (wantPlay) v.play().catch(() => {});
    else {
      v.pause();
      if (mode === "hover") v.currentTime = 0;
    }
  }, [wantPlay, mounted, mode]);

  return (
    <span ref={holder} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {mounted && (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setReady(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-[400ms] ease-expo",
            ready && wantPlay ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </span>
  );
}
