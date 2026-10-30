/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * Three layers, back to front: an atmospheric wash, slowly drifting aurora
 * light (the midground), and a perspective floor that gives the page a
 * horizon. Purely decorative — `aria-hidden`, `pointer-events-none`, and
 * outside the layout flow, so it costs no space and no tab stops.
 *
 * Mobile gets a lighter environment (fewer blobs, tighter blur) via the
 * `.aurora` media query in styles.css; reduced motion freezes the drift.
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
      <div className="aurora aurora-3" />

      {/* background — horizon floor */}
      <div className="depth-floor absolute inset-x-0 bottom-0 h-[46vh]" />

      {/* foreground — vignette that seats the content inside the space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,hsl(216_46%_5%/.92)_100%)]" />
    </div>
  );
}
