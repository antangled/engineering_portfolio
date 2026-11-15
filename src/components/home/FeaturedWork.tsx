import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredItems } from "../../data/featured";
import { Reveal } from "../motion/Reveal";
import { useRichMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { FeaturedStack } from "./FeaturedStack";
import { FeaturedRows } from "./FeaturedRows";

/**
 * "Recent builds": four featured projects. Stacking cards by default; the
 * alternating-rows fallback is one query param away (?featured=rows) so both can
 * be reviewed on the preview before one is chosen.
 */
export function FeaturedWork() {
  const items = featuredItems();
  const [params] = useSearchParams();
  const rows = params.get("featured") === "rows";
  const stacked = useRichMotion() && !rows;

  return (
    <section id="work" className="mx-auto max-w-[1400px] px-[5vw] pb-20 pt-4 lg:pb-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-balance font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[0.98] tracking-tight text-ink-900">
          <Reveal kind="mask-line">Recent builds.</Reveal>
        </h2>
        <Reveal delay={0.1}>
          <Link
            to="/projects"
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-signal hover:text-signal-ink"
          >
            See all work
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      {rows ? <FeaturedRows items={items} /> : <FeaturedStack items={items} />}

      {/* right under the last card: the way on to everything else. In the stack
          the last card sits centred in a full-height sticky frame (h-[min(70vh,600px)],
          nudged down by 3×26px - 2vh), so pull the button up to ~2rem below it. */}
      <div
        className={cn(
          "flex justify-center",
          stacked ? "mt-[calc(2rem-(100vh-min(70vh,600px))/2+78px-2vh)]" : "mt-10"
        )}
      >
        <Link
          to="/projects"
          data-cursor="link"
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink-900 px-7 text-sm font-medium text-white transition-colors duration-[150ms] hover:bg-signal"
        >
          See more projects
          <ArrowRight className="h-4 w-4 transition-transform duration-[400ms] ease-expo group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
