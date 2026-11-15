import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { FeaturedItem } from "../../data/featured";
import { useRichMotion } from "../../lib/motion";
import { Reveal } from "../motion/Reveal";
import { FeaturedBody, FeaturedLink, FeaturedMedia } from "./FeaturedCard";

const PEEK = 26; // px of each earlier card left showing above the next
const SHRINK = 0.94;

const cardShell =
  "overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_1px_0_rgba(21,23,27,0.04),0_40px_90px_-50px_rgba(21,23,27,0.45)]";

function StackCard({
  item,
  i,
  n,
  progress,
}: {
  item: FeaturedItem;
  i: number;
  n: number;
  progress: MotionValue<number>;
}) {
  // Card i is covered while card i+1 slides up over it: scroll [i, i+1] of (n-1).
  // The last card is never covered; its range must still stay inside [0, 1]
  // (Motion runs these on a native scroll timeline, which rejects other offsets).
  const last = i === n - 1;
  const from = last ? 0 : i / (n - 1);
  const to = last ? 1 : (i + 1) / (n - 1);
  const scale = useTransform(progress, [from, to], [1, last ? 1 : SHRINK]);
  const dim = useTransform(progress, [from, to], [0, last ? 0 : 0.22]);

  return (
    <div className="sticky top-0 flex h-screen items-center">
      <motion.div
        style={{ scale, top: `calc(${i * PEEK}px - 2vh)` }}
        className="relative w-full origin-top will-change-transform"
      >
        <FeaturedLink item={item} className={cardShell}>
          <div className="grid h-[min(70vh,600px)] grid-cols-12">
            <FeaturedMedia item={item} className="col-span-7 h-full" />
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

  if (!rich) return <CardList items={items} />;

  return (
    <div ref={ref} className="relative -mt-[6vh]">
      {items.map((item, i) => (
        <StackCard key={item.slug} item={item} i={i} n={items.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
