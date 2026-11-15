import { useRef } from "react";
import { useInView } from "motion/react";
import SplitFlapText from "@/components/kokonutui/split-flap-text";
import { useIsDesktop } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Hero status line. Desktop: Kokonut's departure board cycling through
 * `messages` (it handles reduced motion itself). Phones: one static line, since
 * 30 flap tiles don't fit a 375 px card.
 */
export function SplitFlap({ messages, hold = 4200, className }: { messages: string[]; hold?: number; className?: string }) {
  const desktop = useIsDesktop(768);
  // Only flip while on screen: 30 tiles re-rendering off screen cost scroll frames.
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref);

  if (!desktop) {
    return (
      <p className={cn("inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-white/85", className)}>
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
        {messages[0]}
      </p>
    );
  }

  return (
    <div ref={ref} className={cn("inline-flex rounded-lg bg-black/55 p-1.5 ring-1 ring-white/10", className)}>
      <span className="sr-only">{messages.join(". ")}</span>
      <SplitFlapText
        words={messages}
        interval={hold}
        paused={!onScreen}
        className="gap-[2px] font-mono text-[0.95rem] font-medium"
        tileClassName="bg-[#16181c] text-white"
      />
    </div>
  );
}
