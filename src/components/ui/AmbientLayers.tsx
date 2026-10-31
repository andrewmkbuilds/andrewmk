import { PointerLight } from "./PointerLight";

/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * Two slowly drifting light fields sit behind an atmospheric wash and a
 * vignette. Everything is painted with plain radial gradients — no
 * `filter: blur()` on a full-screen layer — so the compositor keeps the whole
 * environment cheap while it drifts, and phones keep the same look.
 *
 * A pointer-tracked gold light and a fine grain pass sit on top of the
 * vignette, which is what makes the space feel lit rather than painted.
 * Purely decorative — `aria-hidden`, `pointer-events-none`, and outside the
 * layout flow, so it costs no space and no tab stops.
 */
export function AmbientLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* background — atmospheric wash from the brand blue */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_-10%,hsl(207_70%_24%/.55),transparent_62%)]" />

      {/* midground — ambient light */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />

      {/* background — horizon floor */}
      <div className="depth-floor absolute inset-x-0 bottom-0 h-[46vh]" />

      {/* foreground — vignette that seats the content inside the space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(216_46%_5%/.92)_100%)]" />

      {/* interactive light — one element, transform only */}
      <PointerLight />

      {/* fine grain so the gradients read as a surface, not a wash */}
      <div className="ambient-grain" />
    </div>
  );
}
