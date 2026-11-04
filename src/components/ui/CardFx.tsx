import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * The interactive layer shared by every card on the site.
 *
 * `<CardFxTracker>` mounts once (in `Layout`) and drives `--mx` / `--my` — the
 * pointer position as a percentage — on whichever `.spotlight` card the cursor
 * is over. One delegated listener, one rectangle read per card entry, and the
 * style writes are coalesced into a single frame, so a sweep across a grid of
 * cards costs a couple of custom-property writes instead of a React render or a
 * `getBoundingClientRect()` per event.
 *
 * Cards themselves are styled in `src/styles.css` (`.spotlight`, `.edge-glow`,
 * `.fx-sheen`, `.fx-sparkle`). The light is a paint-time gradient, the border
 * arc only animates while hovered, and the lift is a transform — no tilt, no
 * per-frame JavaScript, and nothing that changes layout.
 *
 * Touch never reaches this: every event that is not `pointerType === "mouse"`
 * is ignored. Do not gate the listener on `(pointer: fine)` instead — that
 * query is false in embedded and automated browsers, where the light would
 * then never follow a real mouse. Touch devices still get the light, statically,
 * from CSS.
 */

const CARD_SELECTOR = ".spotlight";

export function CardFxTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let card: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let point: { x: number; y: number } | null = null;
    let frame = 0;

    const measure = () => {
      rect = card ? card.getBoundingClientRect() : null;
    };

    const paint = () => {
      frame = 0;
      if (!card || !rect || !point) return;
      const x = ((point.x - rect.left) / rect.width) * 100;
      const y = ((point.y - rect.top) / rect.height) * 100;
      card.style.setProperty(
        "--mx",
        `${Math.min(100, Math.max(0, x)).toFixed(2)}%`,
      );
      card.style.setProperty(
        "--my",
        `${Math.min(100, Math.max(0, y)).toFixed(2)}%`,
      );
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const target = event.target as Element | null;
      const next =
        target && typeof target.closest === "function"
          ? target.closest<HTMLElement>(CARD_SELECTOR)
          : null;

      if (next !== card) {
        card = next;
        measure();
      } else if (card && !rect) {
        measure();
      }
      if (!card || !rect) return;

      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };

    // A card's box moves with the page, so the cached rect is dropped on
    // scroll/resize rather than measured on every pointer move.
    const invalidate = () => {
      rect = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", invalidate, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", invalidate, true);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  return null;
}

type Spark = {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
  blue?: boolean;
};

/** Fixed positions keep SSR and hydration identical; no randomness. */
const SPARKS: Spark[] = [
  { x: 9, y: 16, size: 3, delay: 0, duration: 13, dx: 8, dy: -14 },
  {
    x: 91,
    y: 11,
    size: 2,
    delay: 3.2,
    duration: 15,
    dx: -10,
    dy: 12,
    blue: true,
  },
  { x: 95, y: 62, size: 2, delay: 1.6, duration: 12, dx: -6, dy: -10 },
  {
    x: 5,
    y: 70,
    size: 2,
    delay: 5.1,
    duration: 16,
    dx: 12,
    dy: -8,
    blue: true,
  },
  { x: 74, y: 89, size: 3, delay: 2.4, duration: 14, dx: -8, dy: -16 },
  { x: 32, y: 5, size: 2, delay: 6.8, duration: 17, dx: 10, dy: 9 },
];

/**
 * Restrained floating lights for a featured card only — a handful of
 * two-to-three-pixel dots drifting on a slow transform loop at low opacity.
 * Purely decorative (aria-hidden, pointer-events: none) and static under
 * `prefers-reduced-motion`.
 */
export function CardSparkles({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("fx-sparkles", className)}>
      {SPARKS.map((spark, index) => (
        <span
          key={index}
          className={cn("fx-sparkle", spark.blue && "fx-sparkle-blue")}
          style={
            {
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              "--fx-delay": `${spark.delay}s`,
              "--fx-dur": `${spark.duration}s`,
              "--fx-dx": `${spark.dx}px`,
              "--fx-dy": `${spark.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
