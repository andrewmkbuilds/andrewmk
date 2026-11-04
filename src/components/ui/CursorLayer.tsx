import { useEffect, useRef } from "react";
import { subscribePointer } from "@/lib/pointer";

/**
 * Desktop custom cursor: a precise gold dot with a trailing ring.
 *
 * - One shared pointer subscription (`@/lib/pointer`) writes the transforms
 *   straight to two fixed elements — no React state, no renders, and no
 *   per-component listeners.
 * - The dot is positioned instantly; the ring trails via a short CSS
 *   transition on `transform`, so the smoothing happens on the compositor.
 * - Hover state comes from `data-cursor` on <html>, set by delegation, so
 *   links, cards and draggable surfaces change the cursor without any JS work
 *   per element.
 * - `pointer-events: none`, so it never blocks clicks or text selection. It
 *   is CSS-hidden on touch devices and under `prefers-reduced-motion`.
 */
export function CursorLayer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    return subscribePointer((x, y) => {
      const transform = `translate3d(${x}px, ${y}px, 0)`;
      dot.style.transform = transform;
      ring.style.transform = transform;
    });
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-core" />
      </div>
      <div ref={dotRef} className="cursor-dot">
        <span className="cursor-dot-core" />
      </div>
    </div>
  );
}
