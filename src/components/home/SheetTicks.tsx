import { cn } from "../../lib/utils";

const CORNERS = [
  "-left-2.5 -top-2.5 border-l border-t",
  "-right-2.5 -top-2.5 border-r border-t",
  "-bottom-2.5 -left-2.5 border-b border-l",
  "-bottom-2.5 -right-2.5 border-b border-r",
];

/**
 * Registration marks just outside a panel's corners, like the crop marks on an
 * engineering drawing sheet. Purely decorative; hidden from assistive tech.
 */
export function SheetTicks({ className }: { className?: string }) {
  return (
    <>
      {CORNERS.map((c) => (
        <span
          key={c}
          aria-hidden
          className={cn("pointer-events-none absolute hidden h-3.5 w-3.5 border-ink-400/70 sm:block", c, className)}
        />
      ))}
    </>
  );
}
