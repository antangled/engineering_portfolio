import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { coverTransitionName, type FeaturedItem } from "../../data/featured";
import { useMorphNavigate } from "../../lib/viewTransition";
import { cn } from "../../lib/utils";
import { HoverClip } from "../motion/HoverClip";

/** Card media: still image, plus a muted loop that plays while on screen. */
export function FeaturedMedia({ item, className }: { item: FeaturedItem; className?: string }) {
  const name = coverTransitionName(item.slug);
  return (
    <div className={cn("relative overflow-hidden bg-paper", className)}>
      <img
        src={item.image}
        alt={item.project.title}
        loading="lazy"
        decoding="async"
        data-vt={name}
        style={{ viewTransitionName: name }}
        className={cn(
          "h-full w-full transition-transform duration-[800ms] ease-expo group-hover:scale-[1.03]",
          item.imageFit === "contain" ? "object-contain p-6" : "object-cover"
        )}
      />
      {item.clip && <HoverClip src={item.clip} mode="inview" />}
    </div>
  );
}

/** Text side of a card: index, badge, title, line, accent metric, tools. */
export function FeaturedBody({ item, index, total }: { item: FeaturedItem; index: number; total: number }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {item.project.badge && (
          <span className="rounded-full bg-signal/10 px-2.5 py-1 normal-case tracking-normal text-signal-ink">
            {item.project.badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.2vw,3rem)] font-semibold leading-[0.98] tracking-tight text-ink-900 transition-colors duration-[400ms] group-hover:text-signal-ink">
        {item.title}
      </h3>
      <p className="mt-3 max-w-[42ch] text-pretty leading-relaxed text-ink-700">{item.line}</p>

      <div className="mt-auto pt-8">
        <p className="font-display text-[clamp(2.4rem,4.4vw,4rem)] font-semibold leading-none tracking-tight text-signal-ink">
          {item.metric.value}
        </p>
        <p className="mt-2 max-w-[34ch] text-sm leading-snug text-ink-500">{item.metric.label}</p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <ul className="flex flex-wrap gap-2" aria-label="Tools">
            {item.tools.map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-700">
                {t}
              </li>
            ))}
          </ul>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white transition-colors duration-[400ms] group-hover:bg-signal">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

/** The whole card is one link; clicking morphs the image into the project page. */
export function FeaturedLink({
  item,
  className,
  children,
}: {
  item: FeaturedItem;
  className?: string;
  children: React.ReactNode;
}) {
  const morph = useMorphNavigate();
  const to = `/projects/${item.slug}`;
  return (
    <Link
      to={to}
      onClick={morph(to, coverTransitionName(item.slug))}
      data-cursor="view"
      data-cursor-label="Open"
      className={cn("group block", className)}
    >
      {children}
    </Link>
  );
}
