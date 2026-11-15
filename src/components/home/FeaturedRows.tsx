import type { FeaturedItem } from "../../data/featured";
import { cn } from "../../lib/utils";
import { Reveal } from "../motion/Reveal";
import { FeaturedBody, FeaturedLink, FeaturedMedia } from "./FeaturedCard";

/**
 * Fallback layout for Phase 3: alternating image/text rows (ayoungcho style),
 * same card content as the stack. Preview it with ?featured=rows.
 */
export function FeaturedRows({ items }: { items: FeaturedItem[] }) {
  return (
    <ul className="mt-12 space-y-16 lg:space-y-24">
      {items.map((item, i) => (
        <li key={item.slug}>
          <FeaturedLink item={item} className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-12">
            <Reveal kind="wipe" className={cn("lg:col-span-7", i % 2 === 1 && "lg:order-2")}>
              <FeaturedMedia
                item={item}
                className="aspect-4/3 rounded-[1.75rem] border border-line lg:aspect-auto lg:h-[min(62vh,540px)]"
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5 lg:py-4">
              <FeaturedBody item={item} index={i} total={items.length} />
            </Reveal>
          </FeaturedLink>
        </li>
      ))}
    </ul>
  );
}
