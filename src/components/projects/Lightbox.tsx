import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "../../data/projects";

/**
 * Full-screen viewer for a project's images and videos. Keyboard: ←/→ to move,
 * Esc to close. Page scroll (Lenis + native) is paused while open, and focus
 * returns to whatever opened it.
 */
export function Lightbox({
  items,
  index,
  title,
  onClose,
  onIndex,
}: {
  items: Media[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const count = items.length;

  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + count) % count);
    },
    [index, count, onIndex]
  );

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  const item = index !== null ? items[index] : undefined;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${index! + 1} of ${count}`}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex flex-col bg-night-900/[0.96] text-mist"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-mist-faint">
              {index! + 1} / {count}
            </p>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              data-cursor="link"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20 text-mist transition-colors hover:border-signal hover:text-signal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[74vh] max-w-full rounded-2xl bg-black"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.caption || title}
                  className={`max-h-[74vh] max-w-full rounded-2xl object-contain ${item.onWhite ? "bg-white" : ""}`}
                />
              )}
            </motion.div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous"
                  data-cursor="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-mist/20 bg-night-800/80 text-mist transition-colors hover:border-signal hover:text-signal sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  data-cursor="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-mist/20 bg-night-800/80 text-mist transition-colors hover:border-signal hover:text-signal sm:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="mx-auto w-full max-w-3xl px-5 pb-6 pt-4 text-center sm:pb-8" onClick={(e) => e.stopPropagation()}>
            {item.caption && <p className="text-pretty text-sm leading-relaxed text-mist/90 sm:text-base">{item.caption}</p>}
            {count > 1 && (
              <div className="mt-4 flex justify-center gap-3 sm:hidden">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => step(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => step(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
