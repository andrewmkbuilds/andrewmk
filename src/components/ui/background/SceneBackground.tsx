import GridMotion from "@/components/reactbits/GridMotion";
import { SCENE_TILES } from "@/data/sceneTiles";

/**
 * The site's ambient background: a near-black navy room with one dimensional
 * field hanging in it.
 *
 * Back to front: `.scene-base` (a `#080d19 → #050914` room lit from above) →
 * two soft light blooms → the React Bits **GridMotion** wall (a leaned plane
 * of drifting tiles that follows the pointer) → `.scene-vignette` →
 * `.ambient-grain`.
 *
 * GridMotion replaced the hand-built CSS 3D scene on 2026-11-01: its slab /
 * cube / ring geometry resolved at inconsistent perceived depths (the same
 * object read differently at different viewport heights, because three
 * hand-tuned `translateZ` planes never agreed on a single horizon). The tile
 * wall gets its depth from one perspective and one lean, so it recedes
 * predictably at every size.
 *
 * Still no canvas and no WebGL: GridMotion is DOM plus a single rAF loop that
 * writes row transforms and one custom property. Under reduced motion it
 * paints one static frame and never schedules another.
 *
 * Purely decorative: `aria-hidden`, `pointer-events-none`, fixed outside the
 * flow, and dropped by the print stylesheet.
 */
export function SceneBackground() {
  return (
    <div
      aria-hidden="true"
      className="scene pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* the room itself — near-black navy, lit from above */}
      <div className="scene-base" />

      {/* distant light, behind the wall */}
      <div className="scene-bloom scene-bloom-blue" />
      <div className="scene-bloom scene-bloom-gold" />

      {/* the depth field */}
      <GridMotion
        className="scene-grid"
        items={SCENE_TILES}
        rows={8}
        gap={16}
        aspectRatio={1.8}
        angle={-16}
        tilt={30}
        speed={7}
        direction="alternate"
        parallax={0.3}
        spotlight={0.5}
        dim={0.58}
      />

      {/* atmosphere: vignette, then grain so gradients read as a surface */}
      <div className="scene-vignette" />
      <div className="ambient-grain" />
    </div>
  );
}
