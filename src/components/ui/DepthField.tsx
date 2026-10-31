import { Suspense, lazy, useEffect, useRef, useState } from "react";

import { subscribeScroll } from "@/lib/scroll";

/**
 * Silk from the React Bits registry (`@react-bits` in `components.json`) — a
 * WebGL2 shader of folded satin that leans toward the pointer and ripples on
 * click. Vendored unchanged in `src/components/reactbits/Silk.tsx`.
 *
 * It is the site's dimensional background: navy folds, gold highlights, and a
 * light that answers the pointer. Everything about it is deliberately quiet —
 * slow flow, deep shadow, low opacity — so the paper surfaces stay legible.
 *
 * Cost control:
 * - the shader module is a lazy chunk, fetched only once the page is idle;
 * - it never mounts under `prefers-reduced-motion` (the CSS depth system
 *   already paints that case);
 * - touch devices get half the pixel ratio, no pointer interaction;
 * - the component stops its own loop when off-screen or when the tab is hidden;
 * - the whole field creeps up with the page through the shared scroll
 *   subscription (`src/lib/scroll.ts`) — transform only, no extra listener.
 */
const Silk = lazy(() => import("@/components/reactbits/Silk"));

const DRIFT_MAX = 72;

export function DepthField() {
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCompact(window.matchMedia("(hover: none)").matches);

    // Defer the shader until the first paint is done and the browser is idle.
    const timer = window.setTimeout(() => setMounted(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll parallax: the folds slide slower than the page, which is what sells
  // the depth. Clamped and transform-only, so it never triggers layout.
  useEffect(() => {
    if (!mounted) return;
    return subscribeScroll((y) => {
      const field = fieldRef.current;
      if (!field) return;
      field.style.transform = `translate3d(0, ${-Math.min(y * 0.06, DRIFT_MAX).toFixed(2)}px, 0)`;
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <div className="depth-field" ref={fieldRef}>
        <Silk
          color="#2a6496"
          sheenColor="#e2c078"
          speed={1.5}
          scale={1.9}
          depth={0.72}
          sheen={0.55}
          glow={0.2}
          ripple={0.55}
          wave={0.9}
          fade={0.34}
          noiseIntensity={1.1}
          interactionStrength={0.85}
          mouseInteraction={!compact}
          clickRipple={false}
          dpr={compact ? 1 : 1.5}
        />
      </div>
    </Suspense>
  );
}
