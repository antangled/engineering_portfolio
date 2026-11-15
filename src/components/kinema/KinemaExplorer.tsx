import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Box, Pause, Play } from "lucide-react";
import { useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { KinemaStage } from "./KinemaStage";

const btn =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal";

/**
 * Kinema project page: the RO80 drive as an interactive tile. Drag to turn it,
 * hover a part to name it, take it apart and put it back. The drive runs on its
 * own (shaft, discs and output at their real 10:1 relationship). Phones load the
 * 3D only when tapped; reduced motion gets a still render that the toggle snaps.
 */
export function KinemaExplorer({ poster }: { poster: string }) {
  const reduced = useReducedMotion() ?? false;
  const desktop = useIsDesktop(768);
  const [exploded, setExploded] = useState(false);
  const [running, setRunning] = useState(!reduced);
  const [tapped, setTapped] = useState(false);
  const load = desktop || tapped;

  return (
    <section aria-labelledby="kinema-3d" className="mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="kinema-3d" className="font-mono text-xs uppercase tracking-[0.3em] text-signal-glow">
            Explore the drive
          </h2>
          <p className="mt-3 max-w-[60ch] text-pretty text-mist-dim">
            The RO80 cycloidal drive, straight from my Onshape assembly. Drag to turn it, hover a part for its name.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={exploded}
            onClick={() => setExploded((v) => !v)}
            data-cursor="link"
            className={cn(
              btn,
              exploded
                ? "border-signal bg-signal text-white hover:bg-signal/90"
                : "border-mist/20 text-mist hover:border-signal hover:text-white"
            )}
          >
            <Box className="h-4 w-4" aria-hidden />
            {exploded ? "Put it back together" : "Take it apart"}
          </button>
          {!reduced && (
            <button
              type="button"
              aria-pressed={running}
              onClick={() => setRunning((v) => !v)}
              data-cursor="link"
              className={cn(btn, "border-mist/20 text-mist hover:border-signal hover:text-white")}
            >
              {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {running ? "Pause the drive" : "Run the drive"}
            </button>
          )}
        </div>
      </div>

      <KinemaStage
        poster={poster}
        posterFit="cover"
        load={load}
        explode={exploded ? 1 : 0}
        speed={running ? 1.4 : 0}
        interactive
        still={reduced}
        className="mt-6 aspect-[4/5] rounded-3xl border border-mist/10 bg-night-900 sm:aspect-[16/9]"
        backdrop={
          <>
            <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-70" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-signal/15 blur-[110px]"
            />
          </>
        }
      >
        {!load && (
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6">
            <button
              type="button"
              onClick={() => setTapped(true)}
              className={cn(btn, "border-white/20 bg-black/60 text-white backdrop-blur")}
            >
              <Box className="h-4 w-4" aria-hidden />
              View in 3D (0.7 MB)
            </button>
          </div>
        )}
        {load && (
          <p className="pointer-events-none absolute bottom-4 left-5 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/60 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Drag to rotate · hover a part
          </p>
        )}
      </KinemaStage>
    </section>
  );
}
