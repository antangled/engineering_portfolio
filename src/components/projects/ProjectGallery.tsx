import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import type { Media } from "../../data/projects";
import { cn } from "../../lib/utils";

type Placement = { gridColumn: string; gridRow: string };

/** Where each small tile sits beside the main image, by how many are visible (4-col × 2-row grid). */
const THUMB_LAYOUT: Record<number, Placement[]> = {
  1: [{ gridColumn: "span 2", gridRow: "span 2" }],
  2: [
    { gridColumn: "span 2", gridRow: "span 1" },
    { gridColumn: "span 2", gridRow: "span 1" },
  ],
  3: [
    { gridColumn: "span 1", gridRow: "span 1" },
    { gridColumn: "span 1", gridRow: "span 1" },
    { gridColumn: "span 2", gridRow: "span 1" },
  ],
  4: Array(4).fill({ gridColumn: "span 1", gridRow: "span 1" }),
};

function Tile({
  item,
  index,
  onOpen,
  className,
  style,
  extra = 0,
  eager = false,
  title,
}: {
  item: Media;
  index: number;
  onOpen: (i: number) => void;
  className?: string;
  style?: CSSProperties;
  extra?: number;
  eager?: boolean;
  title: string;
}) {
  const isVideo = item.type === "video";
  const label = extra > 0 ? `View all ${index + extra + 1} images` : `Enlarge: ${item.label || item.caption || title}`;
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={label}
      data-cursor="view"
      data-cursor-label={extra > 0 ? `+${extra}` : isVideo ? "Play" : "View"}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-mist/10",
        item.onWhite ? "bg-white" : "bg-night-800",
        className
      )}
      onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
      onMouseLeave={(e) => {
        const v = e.currentTarget.querySelector("video");
        if (v) v.pause();
      }}
    >
      {isVideo ? (
        <video
          src={`${item.src}#t=0.5`}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={item.src}
          alt={item.caption || title}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "h-full w-full transition-transform duration-700 ease-expo group-hover:scale-[1.03]",
            item.fit === "contain" ? cn("object-contain", item.onWhite && "p-4") : "object-cover"
          )}
        />
      )}

      {isVideo && (
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-night-900/85 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-mist">
          <Play className="h-3 w-3 fill-current" aria-hidden />
          Video
        </span>
      )}
      {item.label && extra === 0 && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8 text-left font-mono text-xs text-white">
          {item.label}
        </span>
      )}
      {extra > 0 && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-night-900/70 font-display text-3xl font-semibold text-mist">
          +{extra}
        </span>
      )}
    </button>
  );
}

/**
 * Visual-first project header (Airbnb/Instructables pattern): one hero image plus
 * up to four supporting shots, all opening the lightbox. Desktop shows a bento grid
 * (with the Instagram reel as a tall tile on the left when a project has one);
 * mobile shows a swipeable row.
 */
export function ProjectGallery({
  items,
  reel,
  title,
  onOpen,
  placeholder,
}: {
  /** cover first, then supporting media — same order the lightbox uses */
  items: Media[];
  reel?: string | null;
  title: string;
  onOpen: (i: number) => void;
  placeholder?: boolean;
}) {
  if (placeholder || items.length === 0) {
    return (
      <div className="bp-grid flex aspect-[16/7] w-full items-center justify-center rounded-4xl border border-mist/10 bg-gradient-to-br from-night-700 to-night-800">
        <p className="font-mono text-xs uppercase tracking-widest text-mist-faint">Visuals coming soon</p>
      </div>
    );
  }

  const [main, ...rest] = items;
  const maxThumbs = reel ? 3 : 4;
  const visible = rest.slice(0, maxThumbs);
  const extra = rest.length - visible.length;
  const n = visible.length;

  const reelFrame = reel && (
    <iframe
      src={reel}
      title={`${title} reel`}
      loading="lazy"
      allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
      allowFullScreen
      className="h-full w-full"
    />
  );

  return (
    <>
      {/* Desktop bento */}
      <div className="hidden gap-3 lg:flex lg:h-[clamp(360px,52vh,490px)]">
        {reel && (
          <div className="w-[326px] shrink-0 overflow-hidden rounded-3xl border border-mist/10 bg-night-800">
            {reelFrame}
          </div>
        )}
        <div
          className="grid min-w-0 flex-1 gap-3"
          style={
            reel
              ? { gridTemplateColumns: "repeat(3, minmax(0,1fr))", gridTemplateRows: `repeat(${Math.max(n, 1)}, minmax(0,1fr))` }
              : { gridTemplateColumns: "repeat(4, minmax(0,1fr))", gridTemplateRows: "repeat(2, minmax(0,1fr))" }
          }
        >
          <Tile
            item={main}
            index={0}
            onOpen={onOpen}
            eager
            title={title}
            style={
              reel
                ? { gridColumn: n ? "span 2" : "span 3", gridRow: `span ${Math.max(n, 1)}` }
                : { gridColumn: n ? "span 2" : "span 4", gridRow: "span 2" }
            }
          />
          {visible.map((m, i) => (
            <Tile
              key={m.src}
              item={m}
              index={i + 1}
              onOpen={onOpen}
              eager
              title={title}
              extra={i === n - 1 ? extra : 0}
              style={reel ? { gridColumn: "span 1", gridRow: "span 1" } : THUMB_LAYOUT[n][i]}
            />
          ))}
        </div>
      </div>

      {/* Mobile: swipeable row */}
      <div className="lg:hidden">
        <div
          data-lenis-prevent
          className="no-scrollbar -mx-[5vw] flex snap-x snap-mandatory scroll-px-[5vw] gap-3 overflow-x-auto px-[5vw]"
        >
          {items.map((m, i) => (
            <Tile
              key={m.src}
              item={m}
              index={i}
              onOpen={onOpen}
              eager={i < 2}
              title={title}
              className="aspect-[4/3] w-[86%] shrink-0 snap-start"
            />
          ))}
        </div>
        {items.length > 1 && (
          <p className="mt-2 font-mono text-xs text-mist-faint">Swipe for {items.length} images · tap to enlarge</p>
        )}
        {/* On small screens the reel is rendered further down the page (ProjectDetail) so it doesn't push the key numbers off-screen. */}
      </div>
    </>
  );
}
