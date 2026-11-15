import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { buildStrip, getProject } from "@/data/projects";
import { HoverClip } from "../motion/HoverClip";

const COPIES = 3; // enough copies that the loop never shows an edge
const DRIFT = 26; // px/s when idle
const SCROLL_COUPLE = 0.45; // page scroll speed that carries into the reel
const FRICTION = 4.5; // per second, for the throw after a drag

type Build = (typeof buildStrip)[number];

function Card({ b, hidden }: { b: Build; hidden?: boolean }) {
  const [hot, setHot] = useState(false);
  const project = getProject(b.slug);
  return (
    <Link
      to={`/projects/${b.slug}`}
      draggable={false}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      data-cursor="view"
      data-cursor-label={b.clip ? "Play" : "View"}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      className="reel-card group relative block shrink-0 overflow-hidden rounded-2xl bg-surface ring-1 ring-ink-900/10"
    >
      <img
        src={b.src}
        alt={hidden ? "" : b.alt}
        width={640}
        height={480}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-[800ms] ease-expo group-hover:scale-[1.06]"
      />
      {b.clip && (
        <HoverClip src={b.clip} active={hot} className="transition-transform duration-[800ms] ease-expo group-hover:scale-[1.06]" />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/75 via-black/25 to-transparent px-4 pb-3 pt-10 text-white">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {b.clip && <Play aria-hidden className="h-3 w-3 fill-current opacity-80" />}
          {b.label}
        </span>
        {project && <span className="font-mono text-[0.68rem] text-white/70">{project.year}</span>}
      </span>
    </Link>
  );
}

/**
 * Builds reel: the six builds on an endless belt. It drifts on its own, picks up
 * speed from page scrolling, can be dragged and thrown, and stops while you
 * hover a card (whose clip then plays). One transform per frame, written
 * straight to the DOM (no React renders); paused off screen.
 */
export function BuildReel() {
  const reduced = useReducedMotion() ?? false;
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const st = useRef({ x: 0, v: 0, hover: 0, hovering: false, drag: null as null | { px: number; t: number; vx: number }, moved: 0 });

  useEffect(() => {
    const el = track.current;
    const box = wrap.current;
    if (!el || !box) return;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    const setW = () => el.scrollWidth / COPIES;
    const s = st.current;
    s.x = -setW();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      s.hover += ((s.hovering ? 1 : 0) - s.hover) * (1 - Math.exp(-8 * dt));
      if (!s.drag) {
        const lenisV = window.__lenis?.velocity ?? 0;
        const drift = reduced ? 0 : -DRIFT * (1 - s.hover);
        s.x += (drift + s.v) * dt - (reduced ? 0 : lenisV * SCROLL_COUPLE);
        s.v *= Math.exp(-FRICTION * dt);
      }
      const w = setW();
      if (w > 0) {
        while (s.x > -w * 0.5) s.x -= w;
        while (s.x < -w * 1.5) s.x += w;
      }
      // lean slightly into fast motion (a throw or a quick scroll)
      const speed = s.v * 0.0025 - (window.__lenis?.velocity ?? 0) * 0.12;
      const lean = reduced ? 0 : Math.max(-5, Math.min(5, -speed));
      el.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0) skewX(${lean.toFixed(2)}deg)`;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(box);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // drag + throw
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const s = st.current;
    s.drag = { px: e.clientX, t: performance.now(), vx: 0 };
    s.moved = 0;
    s.v = 0;
  };
  const onMove = (e: React.PointerEvent) => {
    const s = st.current;
    const d = s.drag;
    if (!d) return;
    const now = performance.now();
    const dx = e.clientX - d.px;
    s.moved += Math.abs(dx);
    // capture only once it's really a drag, so a plain click still reaches the card
    if (s.moved > 6 && !(e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    d.vx = (dx / Math.max(1, now - d.t)) * 1000 * 0.6 + d.vx * 0.4;
    s.x += dx;
    d.px = e.clientX;
    d.t = now;
  };
  const onUp = () => {
    const s = st.current;
    if (s.drag) s.v = Math.max(-3000, Math.min(3000, s.drag.vx));
    s.drag = null;
  };

  return (
    <section aria-label="Builds" className="pb-6 pt-2">
      <div className="mx-auto mb-4 flex max-w-[1400px] items-end justify-between px-[5vw] font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-500">
        <span>Builds · drag to explore</span>
        <span>{String(buildStrip.length).padStart(2, "0")}</span>
      </div>
      <div
        ref={wrap}
        className="reel cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => (st.current.hovering = true)}
        onPointerLeave={() => {
          st.current.hovering = false;
          onUp();
        }}
        // a drag shouldn't also open the project under the pointer
        onClickCapture={(e) => {
          if (st.current.moved > 6) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div ref={track} className="flex w-max gap-4 will-change-transform">
          {Array.from({ length: COPIES }, (_, c) =>
            buildStrip.map((b) => <Card key={`${c}-${b.slug}`} b={b} hidden={c !== 1} />)
          )}
        </div>
      </div>
    </section>
  );
}
