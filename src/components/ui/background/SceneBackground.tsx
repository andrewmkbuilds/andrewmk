import { useEffect, useMemo, useRef } from "react";
import GridMotion from "@/components/reactbits/GridMotion";
import { ProjectTile } from "./ProjectTile";
import { SCENE_PROJECTS } from "@/data/sceneTiles";
import { subscribeScroll } from "@/lib/scroll";

/**
 * The site's ambient background: a near-black navy room with one dimensional
 * field hanging in it.
 *
 * Back to front: `.scene-base` (a `#080d19 → #050914` room lit from above) →
 * two soft light blooms → the React Bits **GridMotion** wall (a leaned plane
 * of drifting tile faces that follows the pointer) → `.scene-vignette` →
 * `.ambient-grain`.
 *
 * The wall carries **project names, not technologies**: every tile is a real
 * record from `src/data/sceneTiles.ts` (which reads `src/data/portfolio.ts`),
 * rendered by `ProjectTile` in a few editorial registers — plinth labels,
 * off-centre captions and large serif names that spill across their
 * neighbours (styles in `src/styles/scene-names.css`). The wall is the site's
 * identity statement: this is a portfolio of things that were actually built.
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
  const rootRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      SCENE_PROJECTS.map((project, index) => (
        <ProjectTile key={project.slug} project={project} index={index} />
      )),
    [],
  );

  // Scroll depth: the wall drifts against the page a little as it scrolls, so
  // it sits in the room instead of being pinned to the viewport. One write per
  // scroll frame from the shared listener, transform-only, and nothing at all
  // under reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    return subscribeScroll((y) => {
      const drift = Math.max(-130, Math.min(130, -y * 0.07));
      root.style.setProperty("--gm-drift", `${drift.toFixed(1)}px`);
    });
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="scene pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* the room itself — near-black navy, lit from above */}
      <div className="scene-base" />

      {/* distant light, behind the wall */}
      <div className="scene-bloom scene-bloom-blue" />
      <div className="scene-bloom scene-bloom-gold" />

      {/* the depth field — real project names only */}
      <GridMotion
        className="scene-grid"
        items={items}
        rows={8}
        gap={16}
        aspectRatio={1.8}
        angle={-16}
        tilt={30}
        speed={7}
        direction="alternate"
        parallax={0.3}
        spotlight={0.5}
        dim={0.5}
      />

      {/* atmosphere: vignette, then grain so gradients read as a surface */}
      <div className="scene-vignette" />
      <div className="ambient-grain" />
    </div>
  );
}
