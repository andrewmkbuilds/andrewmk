import { useRef } from "react";
import { useSceneDepth } from "./useSceneDepth";

/** The faces of the floating glass cube: front, three sides, lid. */
const CUBE_FACES = 5;

/**
 * The site's spatial background: a near-black navy room with real depth.
 *
 * Three planes hang in one CSS perspective space at different Z depths — a
 * distant field (light blooms, spheres, a far portal ring, star dust), a
 * midground of translucent glass architecture (slabs, a lit cube, tilted
 * rings, light shafts) and a foreground of out-of-focus glass edges and gold
 * rim light. Perspective scales and shades each plane, so the layers read as
 * distance rather than as stacked gradients.
 *
 * Everything is CSS: one perspective container, transforms, gradients and
 * inset shadows that paint volume. There is no canvas, no WebGL context and
 * no blur filter — a full-screen filter or a lost GL context is what turned
 * this background into an opaque plate in earlier rounds. Only `transform`
 * and `opacity` animate, so every moving part stays on the compositor.
 *
 * Interactivity is one shared driver (`useSceneDepth`) that writes `--px`,
 * `--py` and `--sy`; near layers move further than distant ones. Pointer
 * parallax is fine-pointer only and everything stops under reduced motion.
 *
 * Purely decorative: `aria-hidden`, `pointer-events-none`, fixed outside the
 * flow, and dropped by the print stylesheet.
 */
export function SceneBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSceneDepth(rootRef);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="scene pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* the room itself — near-black navy, lit from above */}
      <div className="scene-base" />

      <div className="scene-space">
        {/* ── far plane: the distance ─────────────────────────────────── */}
        <div className="scene-layer scene-far">
          <div className="scene-bloom scene-bloom-blue" />
          <div className="scene-bloom scene-bloom-gold" />

          <span className="scene-orb scene-orb-a" />
          <span className="scene-orb scene-orb-b" />
          <span className="scene-orb scene-orb-c" />

          <div className="scene-stars" />

          <div className="scene-portal scene-portal-far">
            <span className="scene-ring" />
            <span className="scene-ring scene-ring-b" />
          </div>
        </div>

        {/* ── middle plane: the architecture ─────────────────────────── */}
        <div className="scene-layer scene-mid">
          <div className="scene-slab scene-slab-a" />
          <div className="scene-slab scene-slab-b" />
          <div className="scene-slab scene-slab-c" />

          <div className="scene-portal scene-portal-mid">
            <span className="scene-ring" />
            <span className="scene-ring scene-ring-b" />
            <span className="scene-ring scene-ring-c" />
          </div>

          <div className="scene-cube-holder">
            <div className="scene-cube">
              {Array.from({ length: CUBE_FACES }, (_, i) => (
                <span key={i} className="scene-cube-face" />
              ))}
            </div>
          </div>

          {/* glass platforms laid flat in the room — the clearest read of floor */}
          <div className="scene-plate scene-plate-a" />
          <div className="scene-plate scene-plate-b" />

          <div className="scene-beam scene-beam-a" />
          <div className="scene-beam scene-beam-b" />
        </div>

        {/* ── near plane: out-of-focus glass and rim light ──────────── */}
        <div className="scene-layer scene-near">
          <div className="scene-shard scene-shard-a" />
          <div className="scene-shard scene-shard-b" />
          <div className="scene-arc" />
          <div className="scene-dust" />
        </div>
      </div>

      {/* the floor and its horizon — the light that seats the room */}
      <div className="scene-floor" />
      <div className="scene-horizon" />

      {/* atmosphere: vignette, then grain so gradients read as a surface */}
      <div className="scene-vignette" />
      <div className="ambient-grain" />
    </div>
  );
}
