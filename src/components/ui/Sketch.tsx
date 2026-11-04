import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "./Reveal";

/**
 * Hand-drawn marks — the site's recurring gold ink signature.
 *
 * Every mark is a small inline SVG whose strokes are animated with
 * `stroke-dashoffset` (one compositor-friendly property) the first time the
 * mark scrolls into view, using the shared IntersectionObserver from
 * `Reveal`. Nothing here is interactive: the marks are `aria-hidden` and
 * `pointer-events: none`, so they only ever guide the eye.
 *
 * Under `prefers-reduced-motion` the marks render fully drawn (see
 * `styles.css`), so the personality survives without the movement.
 */

interface SketchProps {
  className?: string;
  /** Stroke weight in the SVG's own units. */
  weight?: number;
}

function SketchFrame({
  children,
  className,
  viewBox,
  fill = "none",
}: {
  children: ReactNode;
  className?: string;
  viewBox: string;
  fill?: string;
}) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className={cn("sketch", className)}>
      <svg
        viewBox={viewBox}
        fill={fill}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {children}
      </svg>
    </span>
  );
}

/** Loose marker underline — draws itself from left to right. */
export function SketchUnderline({ className, weight = 2.4 }: SketchProps) {
  return (
    <SketchFrame
      className={cn("sketch-underline", className)}
      viewBox="0 0 200 12"
    >
      <path
        data-draw="1"
        pathLength={1}
        d="M3 8.5C40 3.5 78 2.5 116 4.5c26 1.4 52 3 81 1.6"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
      <path
        data-draw="1"
        pathLength={1}
        d="M12 11.2c44-2.4 90-2.8 134-1.4"
        stroke="currentColor"
        strokeWidth={weight * 0.45}
        strokeLinecap="round"
        opacity="0.55"
      />
    </SketchFrame>
  );
}

/** Hand-drawn loop circling a word — the emphasis mark of the editorial voice. */
export function SketchCircle({ className, weight = 2 }: SketchProps) {
  return (
    <SketchFrame
      className={cn("sketch-circle", className)}
      viewBox="0 0 220 90"
    >
      <path
        data-draw="1"
        pathLength={1}
        d="M186 16C164 4 122 1 84 6 42 11 8 28 6 46c-2 19 36 33 84 34 44 1 88-8 106-22 16-13 8-28-16-38"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </SketchFrame>
  );
}

/** Curved annotation arrow — used beside hand-written margin notes. */
export function SketchArrow({
  className,
  weight = 1.8,
  flip = false,
}: SketchProps & { flip?: boolean }) {
  return (
    <SketchFrame
      className={cn("sketch-arrow", flip && "sketch-flip", className)}
      viewBox="0 0 56 22"
    >
      <path
        data-draw="1"
        pathLength={1}
        d="M2 17C13 6 28 2 50 8"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
      <path
        data-draw="1"
        pathLength={1}
        d="M39 2.5 51 7.6 43 17"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SketchFrame>
  );
}

/** Four-point sketch sparkle — pops in with a scale, then rests. */
export function SketchStar({ className, weight = 1.8 }: SketchProps) {
  return (
    <SketchFrame className={cn("sketch-star", className)} viewBox="0 0 24 24">
      <path
        data-draw="1"
        pathLength={1}
        d="M12 2.5c.7 5.3 3.5 8.4 9 9.5-5.5 1.1-8.3 4.2-9 9.5-.7-5.3-3.5-8.4-9-9.5 5.5-1.1 8.3-4.2 9-9.5Z"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SketchFrame>
  );
}

/** Hand-drawn bracket that hugs a phrase. */
export function SketchBracket({ className, weight = 1.9 }: SketchProps) {
  return (
    <SketchFrame
      className={cn("sketch-bracket", className)}
      viewBox="0 0 22 60"
    >
      <path
        data-draw="1"
        pathLength={1}
        d="M16 3C7 8 5 18 5.5 30 6 42 8 52 16 57"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </SketchFrame>
  );
}

/** Irregular marker rule between sections — replaces a flat hairline. */
export function SketchSeparator({ className, weight = 1.6 }: SketchProps) {
  return (
    <SketchFrame
      className={cn("sketch-separator", className)}
      viewBox="0 0 640 14"
    >
      <path
        data-draw="1"
        pathLength={1}
        d="M2 8c46-4 92 4 138 1s90-6 136-2 90 7 138 2 88-7 134-3 60 4 90 1"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </SketchFrame>
  );
}

/** Small hand-written note with an arrow, for margins. */
export function SketchNote({
  children,
  className,
  flip = false,
}: {
  children: ReactNode;
  className?: string;
  flip?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2",
        flip && "flex-row-reverse",
        className,
      )}
    >
      <SketchArrow
        className={cn("h-3 w-9 shrink-0", flip && "scale-x-[-1]")}
        flip={flip}
      />
      <span className="note-hand text-base leading-none">{children}</span>
    </p>
  );
}
