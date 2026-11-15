import { useEffect, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "motion/react";
import TypewriterTitle from "@/components/kokonutui/type-writer";
import GlitchText from "@/components/kokonutui/glitch-text";
import { buildStrip } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { HoverClip } from "../motion/HoverClip";

/*
 * Hero "zoom callouts": each build is a magnified view of a spot on the
 * portrait, drawn like a technical-diagram inset with a spy/terminal edge.
 *
 *   1. a dashed orange reticle locks onto a spot on the photo (+ ZOOM readout)
 *   2. two dashed lines grow from the reticle's near edge to the card's near
 *      corners; the funnel between them fills with faint orange hatching
 *   3. the card zooms out of the reticle along the funnel to full size
 *   4. a dashed outline with corner handles settles on the card; its file name
 *      types out (Kokonut type-writer)
 *
 * Geometry is measured from the real layout (photo + card slots), so the lines
 * meet the corners exactly at any width. Desktop only (the slots are hidden on
 * smaller screens). Reduced motion: everything is drawn in its final state.
 *
 * Scroll handoff (desktop): over the first scroll the diagram retracts (frames
 * fade, rays fold back into the reticles, reticles close), the MATE ROV card
 * zooms toward you and fades, and the cycloidal card flies down, tilting, and
 * shrinks exactly onto its thumbnail in the statement line below, which then
 * takes over. It is scrubbed by the scroll position, so scrolling back up
 * rewinds it. All of it is transform / clip-path / opacity, written straight to
 * the elements once per scroll frame (no React renders).
 */

type Box = { x: number; y: number; w: number; h: number };

const CALLOUTS = [
  {
    slot: "l1",
    slug: "internal-cycloidal-actuator",
    file: "cycloidal_actuator.mp4",
    video: true,
    // where on the photo it "zooms" from, as fractions of the photo: the folded
    // hands, low enough to stay clear of the "p" in "products."
    src: { fx: 0.1, fy: 0.81, fw: 0.14 },
  },
  {
    slot: "r1",
    slug: "murex-rov",
    file: "mate_rov.jpg",
    video: false,
    // the plain backdrop in the photo's top-right corner, clear of the head
    src: { fx: 0.79, fy: 0.07, fw: 0.13 },
  },
] as const;

const ORANGE = "#ff5a1f";
const T0 = 1.45; // first callout starts after the caption and buttons
const STEP = 0.4; // second callout follows
const D = { reticle: 0.35, funnel: 0.55, zoom: 0.75 };

const rel = (el: Element, origin: DOMRect): Box => {
  const r = el.getBoundingClientRect();
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
};

/** Where the flying card lands: the statement thumbnail, in stage coordinates. */
type Handoff = { el: HTMLElement; box: Box; radius: number; range: number };
type Geo = { w: number; h: number; photo: Box; cards: Box[]; handoff: Handoff | null };

const HANDOFF_SLUG = "internal-cycloidal-actuator";
/** the card lands when the thumbnail's top is this far down the screen */
const LAND_AT = 0.4;

function useGeometry(stageRef: RefObject<HTMLElement | null>, reduced: boolean) {
  const [geo, setGeo] = useState<Geo | null>(null);
  // useEffect, not useLayoutEffect: the stage is our parent, and React attaches a
  // parent's ref only after its children's layout effects have run.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const photo = stage.querySelector(".hero-photo");
      const slots = CALLOUTS.map((c) => stage.querySelector(`.hero-float--${c.slot}`));
      if (!photo || slots.some((s) => !s)) return;
      const o = stage.getBoundingClientRect();
      const cards = slots.map((s) => rel(s!, o));
      const thumb = document.querySelector<HTMLElement>(`[data-handoff-slug="${HANDOFF_SLUG}"]`);
      if (cards.some((c) => c.w === 0)) {
        // hidden (small screens): the thumbnail keeps its own pop-in
        if (thumb) {
          delete thumb.dataset.handoff;
          thumb.style.opacity = "";
        }
        return setGeo(null);
      }
      let handoff: Handoff | null = null;
      if (thumb && !reduced) {
        // switch off the thumb's pop-in transform first, so we measure its real box
        thumb.dataset.handoff = "on";
        const box = rel(thumb, o);
        const range = o.top + window.scrollY + box.y - window.innerHeight * LAND_AT;
        if (box.w > 0 && range > 200) {
          handoff = { el: thumb, box, radius: parseFloat(getComputedStyle(thumb).borderTopLeftRadius) || 0, range };
        } else {
          delete thumb.dataset.handoff;
        }
      }
      setGeo({ w: o.width, h: o.height, photo: rel(photo, o), cards, handoff });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    // the statement re-wraps when its font loads or the page resizes
    const para = document.querySelector(`[data-handoff-slug="${HANDOFF_SLUG}"]`)?.closest("p");
    if (para) ro.observe(para);
    window.addEventListener("resize", measure);
    // the display font loading re-flows the statement (moving the thumbnail
    // sideways) without resizing it, so re-measure once fonts are in
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      alive = false;
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [stageRef, reduced]);
  return geo;
}

function srcBox(photo: Box, f: { fx: number; fy: number; fw: number }, card: Box): Box {
  const w = photo.w * f.fw;
  const h = w * (card.h / card.w); // same aspect as the card: a true magnification
  return { x: photo.x + photo.w * f.fx, y: photo.y + photo.h * f.fy, w, h };
}

/** The funnel joins the reticle's edge that faces the card to the card's facing edge. */
function funnel(s: Box, c: Box) {
  const left = c.x + c.w / 2 < s.x + s.w / 2;
  const sx = left ? s.x : s.x + s.w;
  const cx = left ? c.x + c.w : c.x;
  return { a: [sx, s.y], b: [cx, c.y], c2: [cx, c.y + c.h], d: [sx, s.y + s.h] } as const;
}

const pts = (...p: readonly (readonly [number, number])[]) =>
  p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function Callout({
  i,
  geo,
  reduced,
  entered,
  hot,
}: {
  i: number;
  geo: Geo;
  reduced: boolean;
  entered: boolean;
  hot: boolean;
}) {
  const c = CALLOUTS[i];
  const card = geo.cards[i];
  const s = srcBox(geo.photo, c.src, card);
  const f = funnel(s, card);
  const t0 = T0 + i * STEP;
  const anim = !reduced && !entered;
  const tr = (delay: number, duration: number) => (anim ? { delay, duration, ease: EASE } : { duration: 0 });
  const zoom = (card.w / s.w).toFixed(1);
  const id = `hatch-${i}`;

  // collapsed funnel = all four points on the reticle's facing edge
  const collapsed = pts(f.a, f.a, f.d, f.d);
  const full = pts(f.a, f.b, f.c2, f.d);

  return (
    <g className={hot ? "callout callout--hot" : "callout"}>
      <defs>
        <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={ORANGE} strokeWidth="1.4" strokeOpacity="0.38" />
        </pattern>
      </defs>

      {/* funnel: hatching + a whisper of fill + the rays; on scroll it folds back
          into the reticle's facing edge */}
      <g data-co-funnel={i} style={{ transformBox: "view-box", transformOrigin: `${f.a[0]}px ${s.y + s.h / 2}px` }}>
        <motion.polygon
          initial={{ points: anim ? collapsed : full, opacity: anim ? 0 : 1 }}
          animate={{ points: full, opacity: 1 }}
          transition={tr(t0 + 0.25, D.funnel)}
          fill={`url(#${id})`}
        />
        <motion.polygon
          initial={{ points: anim ? collapsed : full }}
          animate={{ points: full }}
          transition={tr(t0 + 0.25, D.funnel)}
          fill={ORANGE}
          fillOpacity={0.05}
        />

        {/* the two dashed rays */}
        {(
          [
            [f.a, f.b],
            [f.d, f.c2],
          ] as const
        ).map(([p, q], k) => (
          <motion.line
            key={k}
            className="callout-dash"
            x1={p[0]}
            y1={p[1]}
            initial={{ x2: anim ? p[0] : q[0], y2: anim ? p[1] : q[1] }}
            animate={{ x2: q[0], y2: q[1] }}
            transition={tr(t0 + 0.25, D.funnel)}
            stroke={ORANGE}
            strokeWidth="1.5"
          />
        ))}
      </g>

      {/* reticle on the photo (+ its readout); on scroll it closes */}
      <g
        data-co-reticle={i}
        style={{ transformBox: "view-box", transformOrigin: `${s.x + s.w / 2}px ${s.y + s.h / 2}px` }}
      >
        <motion.g
          initial={anim ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={tr(t0, D.reticle)}
          style={{ transformOrigin: `${s.x + s.w / 2}px ${s.y + s.h / 2}px`, transformBox: "view-box" }}
        >
          <rect
            className="callout-dash"
            x={s.x}
            y={s.y}
            width={s.w}
            height={s.h}
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.5"
          />
          {[
            [s.x, s.y, 1, 1],
            [s.x + s.w, s.y, -1, 1],
            [s.x, s.y + s.h, 1, -1],
            [s.x + s.w, s.y + s.h, -1, -1],
          ].map(([x, y, dx, dy], k) => (
            <path
              key={k}
              d={`M${x} ${y + 9 * dy} V${y} H${x + 9 * dx}`}
              fill="none"
              stroke={ORANGE}
              strokeWidth="2.5"
              strokeLinecap="square"
            />
          ))}
          <circle cx={s.x + s.w / 2} cy={s.y + s.h / 2} r="2" fill={ORANGE} />
        </motion.g>

        {/* reticle readout (foreignObject keeps it in the same coordinate space) */}
        <foreignObject x={s.x} y={s.y - 22} width="160" height="20" style={{ overflow: "visible" }}>
          <motion.div
            initial={{ opacity: anim ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={tr(t0 + 0.15, 0.3)}
            className="callout-readout"
          >
            <GlitchText
              text={`ZOOM_0${i + 1} · ${zoom}×`}
              trigger="idle"
              intensity="subtle"
              accent={ORANGE}
              className="text-white"
            />
          </motion.div>
        </foreignObject>
      </g>

      {/* dashed frame + selection handles around the card; fades as you scroll */}
      <g data-co-frame={i}>
        <motion.g initial={{ opacity: anim ? 0 : 1 }} animate={{ opacity: 1 }} transition={tr(t0 + 0.45 + D.zoom, 0.3)}>
          <rect
            className="callout-dash"
            x={card.x - 5}
            y={card.y - 5}
            width={card.w + 10}
            height={card.h + 10}
            fill="none"
            stroke={ORANGE}
            strokeWidth="1.5"
          />
          {[
            [card.x - 5, card.y - 5],
            [card.x + card.w / 2, card.y - 5],
            [card.x + card.w + 5, card.y - 5],
            [card.x - 5, card.y + card.h / 2],
            [card.x + card.w + 5, card.y + card.h / 2],
            [card.x - 5, card.y + card.h + 5],
            [card.x + card.w / 2, card.y + card.h + 5],
            [card.x + card.w + 5, card.y + card.h + 5],
          ].map(([x, y], k) => (
            <rect key={k} x={x - 3.5} y={y - 3.5} width="7" height="7" fill="#fff" stroke={ORANGE} strokeWidth="1.5" />
          ))}
        </motion.g>
      </g>
    </g>
  );
}

function CalloutCard({
  i,
  geo,
  reduced,
  hot,
  setHot,
}: {
  i: number;
  geo: Geo;
  reduced: boolean;
  hot: boolean;
  setHot: (v: boolean) => void;
}) {
  const c = CALLOUTS[i];
  const b = buildStrip.find((x) => x.slug === c.slug)!;
  const card = geo.cards[i];
  const s = srcBox(geo.photo, c.src, card);
  const t0 = T0 + i * STEP;
  // FLIP: start exactly on the reticle, then zoom out to the slot
  const dx = s.x + s.w / 2 - (card.x + card.w / 2);
  const dy = s.y + s.h / 2 - (card.y + card.h / 2);
  const k = s.w / card.w;
  const landed = (t0 + 0.45 + D.zoom) * 1000;

  return (
    // the scroll handoff transforms this layer; the entrance FLIP runs inside it
    <div data-fly={i} className="absolute inset-0" style={{ transformOrigin: "0 0" }}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? { opacity: 1 } : { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${k})` }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translate(0px, 0px) scale(1)" }}
        transition={{ delay: t0 + 0.45, duration: D.zoom, ease: EASE, opacity: { delay: t0 + 0.45, duration: 0.15 } }}
      >
        <Link
          to={`/projects/${c.slug}`}
          data-cursor="view"
          data-cursor-label={c.video ? "Play" : "View"}
          aria-label={b.label}
          onMouseEnter={() => setHot(true)}
          onMouseLeave={() => setHot(false)}
          onFocus={() => setHot(true)}
          onBlur={() => setHot(false)}
          className="callout-card group"
        >
          <img src={b.src} alt="" width={640} height={480} decoding="async" draggable={false} />
          {b.clip && (c.video ? <HoverClip src={b.clip} mode="inview" /> : <HoverClip src={b.clip} active={hot} />)}

          <span className="callout-label" data-fly-label={i}>
            <span className="text-signal">&gt;</span>
            {reduced ? (
              <span>{c.file}</span>
            ) : (
              <TypewriterTitle
                as="span"
                sequences={[{ text: c.file, deleteAfter: false }]}
                autoLoop={false}
                startDelay={landed - 150}
                typingSpeed={34}
                naturalVariance={false}
                className="inline-flex w-auto justify-start text-white dark:text-white [container-type:normal]!"
                textClassName="text-[0.7rem] leading-[1.2] @lg:text-[0.7rem] @2xl:text-[0.7rem] pr-0"
              />
            )}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const CARD_RADIUS = 9.6; // .callout-card border-radius (0.6rem)

/**
 * Scroll-scrubbed handoff. p runs 0 → 1 over the scroll that brings the
 * statement thumbnail up to LAND_AT. The flying card's visible box is lerped from
 * its slot to the thumbnail in page coordinates (so once landed it scrolls with
 * the page); a uniform scale keeps the video undistorted and a vertical
 * clip-path trims 4:3 down to the thumbnail's wider shape.
 */
function useHandoff(stageRef: RefObject<HTMLElement | null>, geo: Geo | null) {
  const { scrollY } = useScroll();
  useEffect(() => {
    const stage = stageRef.current;
    const h = geo?.handoff;
    if (!stage || !geo || !h) return;
    const q = <T extends Element>(sel: string) => stage.querySelector<T & ElementCSSInlineStyle>(sel);
    const fly = q<HTMLElement>('[data-fly="0"]');
    const label = q<HTMLElement>('[data-fly-label="0"]');
    const pop = q<HTMLElement>('[data-fly="1"]');
    const funnels = [0, 1].map((i) => q<SVGGElement>(`[data-co-funnel="${i}"]`));
    const reticles = [0, 1].map((i) => q<SVGGElement>(`[data-co-reticle="${i}"]`));
    const frames = [0, 1].map((i) => q<SVGGElement>(`[data-co-frame="${i}"]`));
    if (!fly || !pop) return;

    const C = geo.cards[0];
    const T = h.box;
    const k = T.w / C.w; // final uniform scale
    const ci = Math.max(0, (C.h - T.h / k) / 2); // final top/bottom trim, in card px

    const update = (y: number) => {
      const p = clamp01(y / h.range);
      const idle = p === 0;

      // the diagram retracts first
      const fr = clamp01(p / 0.08);
      const fu = easeInOut(clamp01(p / 0.22));
      const re = clamp01((p - 0.12) / 0.16);
      for (let i = 0; i < 2; i++) {
        const fe = frames[i],
          fn = funnels[i],
          rt = reticles[i];
        if (fe) fe.style.opacity = idle ? "" : String(1 - fr);
        if (fn) {
          fn.style.transform = idle ? "" : `scale(${1 - fu})`;
          fn.style.opacity = idle ? "" : String(1 - fu);
        }
        if (rt) {
          rt.style.transform = idle ? "" : `scale(${1 - 0.5 * re})`;
          rt.style.opacity = idle ? "" : String(1 - re);
        }
      }

      // MATE ROV: zooms toward you and fades
      const pe = clamp01(p / 0.35);
      pop.style.transform = idle ? "" : `scale(${1 + 0.45 * pe * pe})`;
      pop.style.opacity = idle ? "" : String(1 - pe);
      pop.style.visibility = pe >= 1 ? "hidden" : "";

      // cycloidal: flies into the thumbnail
      // position moves linearly with the scroll, so on screen the card just
      // hangs there while the statement rises to meet it; the shrink is eased
      const e = easeInOut(p);
      const sc = 1 + (k - 1) * e;
      const clip = ci * e;
      const tx = (T.x - C.x) * p;
      const ty = (T.y - C.y) * p - sc * clip; // keeps the *visible* top on the lerp
      const rot = -7 * Math.sin(Math.PI * p);
      const cx = tx + (sc * C.w) / 2;
      const cy = ty + (sc * C.h) / 2;
      const radius = CARD_RADIUS + (h.radius / k - CARD_RADIUS) * e;
      fly.style.transform = idle
        ? ""
        : `translate(${cx}px, ${cy}px) rotate(${rot}deg) translate(${-cx}px, ${-cy}px) translate(${tx}px, ${ty}px) scale(${sc})`;
      fly.style.clipPath = idle ? "" : `inset(${clip}px 0px ${clip}px 0px round ${radius}px)`;
      // last 10%: the real thumbnail fades in under it, then takes over
      const swap = clamp01((p - 0.9) / 0.1);
      fly.style.opacity = idle ? "" : String(1 - swap);
      fly.style.visibility = p >= 1 ? "hidden" : "";
      h.el.style.opacity = String(swap);
      if (label) label.style.opacity = idle ? "" : String(1 - clamp01(p / 0.12));
    };

    update(scrollY.get());
    const off = scrollY.on("change", update);
    return () => {
      off();
      for (const el of [fly, pop, label, h.el, ...funnels, ...reticles, ...frames]) {
        if (!el) continue;
        el.style.transform = el.style.opacity = el.style.clipPath = el.style.visibility = "";
      }
    };
  }, [stageRef, geo, scrollY]);
}

export function HeroCallouts({ stageRef, reduced }: { stageRef: RefObject<HTMLElement | null>; reduced: boolean }) {
  const geo = useGeometry(stageRef, reduced);
  useHandoff(stageRef, geo);
  const [hot, setHot] = useState<number | null>(null);
  // after the entrance, geometry changes (resizes) apply instantly
  const [entered, setEntered] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setEntered(true), (T0 + STEP * (CALLOUTS.length - 1) + 0.45 + D.zoom + 0.6) * 1000);
    return () => clearTimeout(id);
  }, [reduced]);

  return (
    <>
      {/* card slots (always rendered, so the layout can be measured) */}
      <nav aria-label="Builds" className="contents">
        {CALLOUTS.map((c, i) => (
          <div key={c.slug} className={`hero-float hero-float--${c.slot}`}>
            {geo && (
              <CalloutCard i={i} geo={geo} reduced={reduced} hot={hot === i} setHot={(v) => setHot(v ? i : null)} />
            )}
          </div>
        ))}
      </nav>

      {/* the diagram layer: above the photo, never takes pointer events */}
      {geo && (
        <svg
          aria-hidden
          className="hero-callouts pointer-events-none absolute left-0 top-0 z-[11] hidden overflow-visible lg:block"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          {CALLOUTS.map((c, i) => (
            <Callout key={c.slug} i={i} geo={geo} reduced={reduced} entered={entered} hot={hot === i} />
          ))}
        </svg>
      )}
    </>
  );
}
