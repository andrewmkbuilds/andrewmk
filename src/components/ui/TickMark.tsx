import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "./Reveal";

/**
 * A checkmark that draws itself on when its list scrolls into view.
 *
 * The icon is passed in unchanged — same glyph, size and colour — and this
 * wrapper only schedules the paint: the tick's own stroke is walked in with
 * `stroke-dashoffset` (CSS in the "Tick reveal" block of `styles.css`)
 * while the mark fades and settles from 0.86.
 *
 * The observer is the shared reveal one, so a page full of ticks still costs
 * one IntersectionObserver and one class toggle per tick; it unobserves after
 * the first intersection, so scrolling back never replays the sequence.
 * Surrounding text is never hidden or delayed.
 */

/** Gap between ticks inside one list. */
const STAGGER_MS = 180;

interface TickMarkProps {
  children: ReactNode;
  className?: string;
  /** Position inside its list — drives the sequential reveal. */
  index?: number;
}

export function TickMark({ children, className, index = 0 }: TickMarkProps) {
  const ref = useReveal<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={cn("tick", className)}
      style={
        {
          "--tick-delay": `${Math.min(index, 7) * STAGGER_MS}ms`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
