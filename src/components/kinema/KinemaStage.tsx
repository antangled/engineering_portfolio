import { Component, lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNear } from "@/lib/useNear";
import { KINEMA_MODEL } from "@/data/kinema";
import { cn } from "@/lib/utils";
import type { KinemaViewerProps } from "./KinemaViewer";

// three.js + react-three-fiber + the model: their own chunk, fetched only near the viewport.
const KinemaViewer = lazy(() => import("./KinemaViewer"));

/** If WebGL or the chunk fails, the poster simply stays (or appears). */
class Fallback extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Poster first, 3D on top once it's ready. The poster (a real image) is what
 * shows without JS, without WebGL, or while the model streams in.
 *
 * `posterFallbackOnly` (home card): no photo-to-CAD crossfade. The photo appears
 * only if 3D can't run.
 *
 * `stillImage`: a render of the CAD from the viewer's own camera at its opening
 * pose, shown from the first paint. Pass the same pose as `startPose`: the
 * canvas's first frame is drawn in it, so canvas and still swap in one commit,
 * and the model then eases to wherever the scroll has got to. The still is drawn
 * at the aspect where the viewer's width and height fits meet, so
 * `object-contain` frames it exactly like the canvas at any panel size.
 */
export function KinemaStage({
  poster,
  posterFit = "contain",
  load = true,
  posterFallbackOnly = false,
  stillImage,
  eager = false,
  className,
  children,
  backdrop,
  style,
  "data-vt": vt,
  ...viewer
}: KinemaViewerProps & {
  style?: React.CSSProperties;
  "data-vt"?: string;
  poster: string;
  posterFit?: "contain" | "cover";
  /** false = wait (phones: load on tap). */
  load?: boolean;
  /** show the poster only when 3D is unavailable or fails */
  posterFallbackOnly?: boolean;
  /** transparent still of the CAD, shown until the live canvas is in */
  stillImage?: string;
  /**
   * Load at once instead of when near the viewport: the viewer's code and the
   * model download in parallel from page load, and the first frame is drawn off
   * screen, so the CAD is live (and follows the scroll) before it's reached.
   */
  eager?: boolean;
  /** Drawn behind the poster and the canvas. */
  backdrop?: ReactNode;
  children?: ReactNode;
}) {
  const [ref, near] = useNear<HTMLDivElement>("600px 0px");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const webgl = useMemo(() => (typeof window === "undefined" ? false : hasWebGL()), []);
  const mount = (near || eager) && load && webgl;
  // eager: start the model download alongside the viewer's code (the loader
  // would otherwise only ask for it once that code has run); the loader's own
  // request then comes from the HTTP cache
  useEffect(() => {
    if (eager && load && webgl) fetch(KINEMA_MODEL).catch(() => {});
  }, [eager, load, webgl]);
  // the prerendered HTML keeps the poster (the no-JS view); it's dropped right
  // after hydration, so the first client render matches the HTML
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const noLive = hydrated && (!webgl || failed);
  const showPoster = !posterFallbackOnly || (stillImage ? noLive : !hydrated || !webgl || failed);
  // the canvas's first frame is drawn in the still's pose (startPose), so the
  // two swap in one commit: no crossfade, no double image
  const showStill = !!stillImage && !noLive && !ready;

  return (
    <div ref={ref} data-vt={vt} style={style} className={cn("relative overflow-hidden", className)}>
      {backdrop}
      {showStill && (
        <img
          src={stillImage}
          alt=""
          aria-hidden
          decoding="async"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
      )}
      {showPoster && (
        <img
          src={poster}
          alt="Exploded CAD of Kinema's cycloidal actuator"
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-[800ms] ease-expo",
            posterFit === "contain" ? "object-contain p-8" : "object-cover",
            ready && !failed && "opacity-0",
          )}
        />
      )}
      {mount && (
        <Fallback onFail={() => setFailed(true)}>
          <Suspense fallback={null}>
            <div
              className={cn(
                "absolute inset-0",
                !stillImage && "transition-opacity duration-[800ms] ease-expo",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              <KinemaViewer {...viewer} onReady={() => setReady(true)} />
            </div>
          </Suspense>
        </Fallback>
      )}
      {children}
    </div>
  );
}
