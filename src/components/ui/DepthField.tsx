import { Suspense, lazy, useEffect, useState } from "react";

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
 * - the component stops its own loop when off-screen or when the tab is hidden.
 */
const Silk = lazy(() => import("@/components/reactbits/Silk"));

export function DepthField() {
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCompact(window.matchMedia("(hover: none)").matches);

    // Defer the shader until the first paint is done and the browser is idle.
    const timer = window.setTimeout(() => setMounted(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <div className="depth-field">
        <Silk
          color="#2a6496"
          sheenColor="#e2c078"
          speed={2.2}
          scale={1.15}
          depth={0.55}
          sheen={0.62}
          glow={0.28}
          ripple={0.5}
          wave={0.85}
          fade={0.24}
          noiseIntensity={1.1}
          interactionStrength={0.7}
          mouseInteraction={!compact}
          clickRipple={false}
          dpr={compact ? 1 : 1.5}
        />
      </div>
    </Suspense>
  );
}
