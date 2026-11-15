import { Component, lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNear } from "@/lib/useNear";
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
 * `posterFallbackOnly` (home card): no photo-to-CAD crossfade. Only the backdrop
 * shows until the CAD is in, and the photo appears only if 3D can't run.
 */
export function KinemaStage({
  poster,
  posterFit = "contain",
  load = true,
  posterFallbackOnly = false,
  preloadMargin,
  preloadAfterMs = 0,
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
  /**
   * Load earlier than the usual 600px: within this margin, once `preloadAfterMs`
   * has passed and the main thread is idle (so it never lands on an entrance).
   */
  preloadMargin?: string;
  preloadAfterMs?: number;
  /** Drawn behind the poster and the canvas. */
  backdrop?: ReactNode;
  children?: ReactNode;
}) {
  const [ref, near] = useNear<HTMLDivElement>("600px 0px");
  const [farRef, nearish] = useNear<HTMLDivElement>(preloadMargin ?? "600px 0px");
  const [early, setEarly] = useState(false);
  useEffect(() => {
    if (!preloadMargin) return;
    let idle = 0;
    const t = window.setTimeout(() => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setEarly(true), { timeout: 1500 })
        : window.setTimeout(() => setEarly(true), 0);
    }, preloadAfterMs);
    return () => {
      window.clearTimeout(t);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
    };
  }, [preloadMargin, preloadAfterMs]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const webgl = useMemo(() => (typeof window === "undefined" ? false : hasWebGL()), []);
  const mount = (near || (early && nearish)) && load && webgl;
  // the prerendered HTML keeps the poster (the no-JS view); it's dropped right
  // after hydration, so the first client render matches the HTML
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const showPoster = !posterFallbackOnly || !hydrated || !webgl || failed;

  return (
    <div ref={ref} data-vt={vt} style={style} className={cn("relative overflow-hidden", className)}>
      {/* a second, wider observer target for the early preload */}
      <span ref={farRef} aria-hidden className="pointer-events-none absolute inset-0" />
      {backdrop}
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
                "absolute inset-0 transition-opacity duration-[800ms] ease-expo",
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
