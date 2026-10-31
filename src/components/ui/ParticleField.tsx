import { Suspense, lazy, useEffect, useState } from "react";

/**
 * Particles from the React Bits registry (`@react-bits` in `components.json`) —
 * a drifting 3D cloud with depth of field, glow and a pointer parallax. It is
 * the foreground dust of the depth environment: sparse, warm and cold motes
 * floating in front of the silk folds, so the space reads as a lit room rather
 * than a painted backdrop. Vendored unchanged in
 * `src/components/reactbits/Particles.tsx`.
 *
 * Cost control mirrors `DepthField`:
 * - its own lazy chunk, fetched after the first paint;
 * - never mounted under `prefers-reduced-motion`;
 * - sparse count and half the pixel ratio on touch, and no rotation there;
 * - the component stops its own loop when off-screen or when the tab is hidden.
 */
const Particles = lazy(() => import("@/components/reactbits/Particles"));

export function ParticleField() {
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCompact(window.matchMedia("(hover: none)").matches);

    const timer = window.setTimeout(() => setMounted(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <div className="particle-field">
        <Particles
          particleCount={compact ? 70 : 160}
          particleSpread={16}
          speed={0.12}
          particleColors={["#9dc4e0", "#e2c078", "#ffffff"]}
          particleBaseSize={42}
          sizeRandomness={0.75}
          cameraDistance={22}
          moveParticlesOnHover={!compact}
          hoverEffect="parallax"
          particleHoverFactor={0.55}
          glow={0.45}
          twinkle={0.65}
          depthOfField={0.4}
          drift="up"
          driftSpeed={0.3}
          opacity={0.55}
          disableRotation={compact}
          clickBurst={false}
          dpr={compact ? 1 : 1.5}
        />
      </div>
    </Suspense>
  );
}
