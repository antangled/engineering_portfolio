import { useEffect, useMemo, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
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
 *   3. the card zooms out of the reticle along the funnel to full size, arriving
 *      as a field of binary that a scan line wipes away to reveal the image
 *   4. a dashed outline with corner handles settles on the card; its file name
 *      types out (Kokonut type-writer)
 *
 * Geometry is measured from the real layout (photo + card slots), so the lines
 * meet the corners exactly at any width. Desktop only (the slots are hidden on
 * smaller screens). Reduced motion: everything is drawn in its final state.
 */

type Box = { x: number; y: number; w: number; h: number };

const CALLOUTS = [
  {
    slot: "l1",
    slug: "internal-cycloidal-actuator",
    file: "cycloidal_actuator.mp4",
    video: true,
    // where on the photo it "zooms" from, as fractions of the photo: the folded hands
    src: { fx: 0.1, fy: 0.76, fw: 0.2 },
  },
  {
    slot: "r1",
    slug: "murex-rov",
    file: "mate_rov.jpg",
    video: false,
    // upper right of the photo, by the ear, clear of the headline
    src: { fx: 0.7, fy: 0.2, fw: 0.18 },
  },
] as const;

const ORANGE = "#ff5a1f";
const T0 = 1.45; // first callout starts after the caption and buttons
const STEP = 0.4; // second callout follows
const D = { reticle: 0.35, funnel: 0.55, zoom: 0.75, decode: 0.6 };

/** Deterministic 0/1 noise for the "decode" layer. */
function bits(n: number, seed: number) {
  let s = seed;
  let out = "";
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out += s % 7 === 0 ? " " : s % 2 ? "1" : "0";
  }
  return out;
}

const rel = (el: Element, origin: DOMRect): Box => {
  const r = el.getBoundingClientRect();
  return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
};

type Geo = { w: number; h: number; photo: Box; cards: Box[] };

function useGeometry(stageRef: RefObject<HTMLElement | null>) {
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
      if (cards.some((c) => c.w === 0)) return setGeo(null); // hidden (small screens)
      setGeo({ w: o.width, h: o.height, photo: rel(photo, o), cards });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [stageRef]);
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

const pts = (...p: readonly (readonly [number, number])[]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

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

      {/* funnel: hatching + a whisper of fill */}
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

      {/* reticle on the photo: dashed box + corner brackets */}
      <motion.g
        initial={anim ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={tr(t0, D.reticle)}
        style={{ transformOrigin: `${s.x + s.w / 2}px ${s.y + s.h / 2}px`, transformBox: "view-box" }}
      >
        <rect className="callout-dash" x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke={ORANGE} strokeWidth="1.5" />
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

      {/* dashed frame + selection handles around the card */}
      <motion.g
        initial={{ opacity: anim ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={tr(t0 + 0.45 + D.zoom, 0.3)}
      >
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

      {/* reticle readout (foreignObject keeps it in the same coordinate space) */}
      <foreignObject x={s.x} y={s.y - 22} width="160" height="20" style={{ overflow: "visible" }}>
        <motion.div
          initial={{ opacity: anim ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={tr(t0 + 0.15, 0.3)}
          className="callout-readout"
        >
          <GlitchText text={`ZOOM_0${i + 1} · ${zoom}×`} trigger="idle" intensity="subtle" accent={ORANGE} className="text-white" />
        </motion.div>
      </foreignObject>
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
  const binary = useMemo(() => bits(900, 17 + i * 31), [i]);
  const landed = (t0 + 0.45 + D.zoom) * 1000;

  return (
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

        {/* decode: binary field wiped away by a scan line once the card lands */}
        {!reduced && (
          <motion.span
            aria-hidden
            className="callout-decode"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(100% 0% 0% 0%)" }}
            transition={{ delay: t0 + 0.45 + D.zoom, duration: D.decode, ease: "linear" }}
          >
            <span className="callout-bits">{binary}</span>
            <motion.span
              className="callout-scan"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ delay: t0 + 0.45 + D.zoom, duration: D.decode, ease: "linear" }}
            />
          </motion.span>
        )}

        <span className="callout-label">
          <span className="text-signal">&gt;</span>
          {reduced ? (
            <span>{c.file}</span>
          ) : (
            <TypewriterTitle
              as="span"
              sequences={[{ text: c.file, deleteAfter: false }]}
              autoLoop={false}
              startDelay={landed + D.decode * 1000 - 250}
              typingSpeed={34}
              naturalVariance={false}
              className="inline-flex w-auto justify-start text-white dark:text-white [container-type:normal]!"
              textClassName="text-[0.7rem] leading-[1.2] @lg:text-[0.7rem] @2xl:text-[0.7rem] pr-0"
            />
          )}
        </span>
      </Link>
    </motion.div>
  );
}

export function HeroCallouts({ stageRef, reduced }: { stageRef: RefObject<HTMLElement | null>; reduced: boolean }) {
  const geo = useGeometry(stageRef);
  const [hot, setHot] = useState<number | null>(null);
  // after the entrance, geometry changes (resizes) apply instantly
  const [entered, setEntered] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setEntered(true), (T0 + STEP * (CALLOUTS.length - 1) + 0.45 + D.zoom + D.decode + 0.4) * 1000);
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
            <Callout
              key={c.slug}
              i={i}
              geo={geo}
              reduced={reduced}
              entered={entered}
              hot={hot === i}
            />
          ))}
        </svg>
      )}
    </>
  );
}
