import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { coverTransitionName } from "../../data/featured";
import { KinemaStage } from "../kinema/KinemaStage";
import type { FeaturedItem } from "../../data/featured";
import { useRichMotion } from "../../lib/motion";
import { Reveal } from "../motion/Reveal";
import { FeaturedBody, FeaturedLink, FeaturedMedia } from "./FeaturedCard";

const PEEK = 26; // px of each earlier card left showing above the next
const SHRINK = 0.94;

const cardShell =
  "overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_1px_0_rgba(21,23,27,0.04),0_40px_90px_-50px_rgba(21,23,27,0.45)]";

/**
 * Kinema's card media: the real RO80 drive in 3D. `s` runs 0→1 while the card
 * slides up, 1→2 while it's pinned and the next card covers it. The parts come
 * apart as it arrives, hold with their names while pinned, and go back together
 * as the next card slides over. Scrolling also turns the input shaft.
 */
function KinemaMedia({ item, s }: { item: FeaturedItem; s: MotionValue<number> }) {
  const explode = useTransform(s, [0.5, 1.1, 1.55, 2], [0, 1, 1, 0.1]);
  const turn = useTransform(s, (v) => v * Math.PI * 2.4);
  const yaw = useTransform(s, [0, 2], [0.28, -0.22]);
  const [active, setActive] = useState(false);
  useMotionValueEvent(s, "change", (v) => setActive(v > 0.05 && v < 2.3));
  const name = coverTransitionName(item.slug);

  return (
    <KinemaStage
      poster={item.image ?? ""}
      posterFit="cover"
      // the CAD is the card: no photo first (the project page has the photos);
      // load well ahead (after the hero entrance) so it's already drawn when
      // the card slides in
      posterFallbackOnly
      preloadMargin="1600px 0px"
      preloadAfterMs={3500}
      explode={explode}
      turn={turn}
      yaw={yaw}
      speed={0.9}
      active={active}
      data-vt={name}
      className="col-span-7 h-full bg-night-900"
      style={{ viewTransitionName: name }}
      backdrop={
        <>
          <div aria-hidden className="bp-grid pointer-events-none absolute inset-0 opacity-70" />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-signal/20 blur-[90px]"
          />
        </>
      }
    >
      <p className="pointer-events-none absolute bottom-5 left-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        Live CAD · RO80 drive · scroll to take it apart
      </p>
    </KinemaStage>
  );
}

function StackCard({
  item,
  i,
  n,
  progress,
  approach,
}: {
  item: FeaturedItem;
  i: number;
  n: number;
  progress: MotionValue<number>;
  approach: MotionValue<number>;
}) {
  // Card i is covered while card i+1 slides up over it: scroll [i, i+1] of (n-1).
  // The last card is never covered; its range must still stay inside [0, 1]
  // (Motion runs these on a native scroll timeline, which rejects other offsets).
  const last = i === n - 1;
  const from = last ? 0 : i / (n - 1);
  const to = last ? 1 : (i + 1) / (n - 1);
  const scale = useTransform(progress, [from, to], [1, last ? 1 : SHRINK]);
  const dim = useTransform(progress, [from, to], [0, last ? 0 : 0.22]);
  // The photo settles from 1.18x while this card slides up into place.
  const enterFrom = i === 0 ? 0 : (i - 1) / (n - 1);
  const enterTo = i === 0 ? 0.001 : i / (n - 1);
  const zoom = useTransform(progress, [enterFrom, enterTo], [i === 0 ? 1 : 1.18, 1]);
  // this card's own clock: 0→1 sliding up, 1→2 pinned until the next card covers it
  const s = useTransform([approach, progress], ([a, p]: number[]) => (i === 0 ? a : 1) + p * (n - 1) - i);
  const kinema = item.slug === "internal-cycloidal-actuator";

  return (
    <div className="sticky top-0 flex h-screen items-center">
      <motion.div
        style={{ scale, top: `calc(${i * PEEK}px - 2vh)` }}
        className="relative w-full origin-top will-change-transform"
      >
        <FeaturedLink item={item} className={cardShell}>
          <div className="grid h-[min(70vh,600px)] grid-cols-12">
            {kinema ? (
              <KinemaMedia item={item} s={s} />
            ) : (
              <FeaturedMedia item={item} zoom={zoom} className="col-span-7 h-full" />
            )}
            <div className="col-span-5 p-8 xl:p-10">
              <FeaturedBody item={item} index={i} total={n} />
            </div>
          </div>
        </FeaturedLink>
        {/* dims the card as the next one covers it */}
        <motion.div
          aria-hidden
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-ink-900"
        />
      </motion.div>
    </div>
  );
}

/** Phones, tablets and reduced motion: the same cards as a plain list. */
function CardList({ items }: { items: FeaturedItem[] }) {
  return (
    <ul className="mt-10 grid gap-6 md:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.slug}>
          <Reveal>
            <FeaturedLink item={item} className={`${cardShell} h-full`}>
              <FeaturedMedia item={item} className="aspect-4/3" />
              <div className="p-6 sm:p-7">
                <FeaturedBody item={item} index={i} total={items.length} />
              </div>
            </FeaturedLink>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/**
 * Phase 3: featured work as stacking cards. Each card pins; the next slides up
 * over it while the one underneath shrinks to 0.94 and dims.
 */
export function FeaturedStack({ items }: { items: FeaturedItem[] }) {
  const rich = useRichMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // the first card's approach, before the stack pins
  const { scrollYProgress: approach } = useScroll({ target: ref, offset: ["start end", "start start"] });

  if (!rich) return <CardList items={items} />;

  return (
    <div ref={ref} className="relative -mt-[6vh]">
      {items.map((item, i) => (
        <StackCard key={item.slug} item={item} i={i} n={items.length} progress={scrollYProgress} approach={approach} />
      ))}
    </div>
  );
}
