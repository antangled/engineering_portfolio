import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { useNear } from "@/lib/useNear";
import { cn } from "@/lib/utils";
import type { KinemaViewerProps } from "./KinemaViewer";

// three.js + react-three-fiber + the model: their own chunk, fetched only near the viewport.
const KinemaViewer = lazy(() => import("./KinemaViewer"));

/** If WebGL or the chunk fails, the poster simply stays. */
class Fallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
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
 */
export function KinemaStage({
  poster,
  posterFit = "contain",
  load = true,
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
  /** Drawn behind the poster and the canvas. */
  backdrop?: ReactNode;
  children?: ReactNode;
}) {
  const [ref, near] = useNear<HTMLDivElement>("600px 0px");
  const [ready, setReady] = useState(false);
  const webgl = useMemo(() => (typeof window === "undefined" ? false : hasWebGL()), []);
  const mount = near && load && webgl;

  return (
    <div ref={ref} data-vt={vt} style={style} className={cn("relative overflow-hidden", className)}>
      {backdrop}
      <img
        src={poster}
        alt="Exploded CAD of Kinema's cycloidal actuator"
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-[800ms] ease-expo",
          posterFit === "contain" ? "object-contain p-8" : "object-cover",
          ready && "opacity-0"
        )}
      />
      {mount && (
        <Fallback>
          <Suspense fallback={null}>
            <div className={cn("absolute inset-0 transition-opacity duration-[800ms] ease-expo", ready ? "opacity-100" : "opacity-0")}>
              <KinemaViewer {...viewer} onReady={() => setReady(true)} />
            </div>
          </Suspense>
        </Fallback>
      )}
      {children}
    </div>
  );
}
