import { PointerLight } from "./PointerLight";

/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * The room is painted entirely in CSS: a navy base, one cold key light from
 * above, a restrained gold rim, a perspective horizon and a vignette. Every
 * layer is a radial gradient on its own compositor layer — no canvas and no
 * `filter: blur()` — so the slow drift costs one transform per layer and the
 * paper surfaces keep their contrast.
 *
 * A pointer-tracked gold light and a fine grain pass sit on top of the
 * vignette, which is what makes the space feel lit rather than painted.
 * Purely decorative — `aria-hidden`, `pointer-events-none`, and outside the
 * layout flow, so it costs no space and no tab stops.
 *
 * There is deliberately no WebGL layer here: the React Bits Silk shader was
 * removed at the owner's request, and a second canvas (Particles) lost its
 * WebGL context in the sandbox preview, where Chrome then composites the lost
 * canvas as an opaque light plate. Gradients cost a fraction of that and can
 * never fail that way.
 */
export function AmbientLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* background — the room: navy base with a cold top light */}
      <div className="ambient-base" />

      {/* midground — the room's single key light, drifting very slowly */}
      <div className="ambient-key" />

      {/* midground — gold rim light, the warm counterweight to the blue */}
      <div className="ambient-rim" />

      {/* background — horizon floor */}
      <div className="depth-floor absolute inset-x-0 bottom-0 h-[46vh]" />

      {/* foreground — vignette that seats the content inside the space */}
      <div className="ambient-vignette" />

      {/* interactive light — one element, transform only */}
      <PointerLight />

      {/* fine grain so the gradients read as a surface, not a wash */}
      <div className="ambient-grain" />
    </div>
  );
}
