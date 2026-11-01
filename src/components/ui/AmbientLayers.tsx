/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * Six CSS layers, back to front: a navy base with a cold wash from above →
 * one wide blue key light → the gold rim light → the horizon glow and the
 * perspective floor → the vignette that seats the content → a fine grain
 * pass. Every layer is a radial or linear gradient painted once on its own
 * compositor layer; the only motion is the key light's 90 s transform drift.
 *
 * There is no canvas, no WebGL context and no JavaScript in this layer at
 * all — the earlier Silk shader, the dot lattice and the mote canvas each
 * cost a full-screen paint per frame, and the Silk context could composite as
 * an opaque plate. Static gradients plus one drifting light read as a lit
 * room and cost nothing on the main thread.
 *
 * Purely decorative — `aria-hidden`, `pointer-events-none`, outside the
 * layout flow, and removed entirely from the print stylesheet.
 */
export function AmbientLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* background — the room: navy base with a cold light from above */}
      <div className="ambient-base" />

      {/* midground — the room's single key light, drifting very slowly */}
      <div className="ambient-key" />

      {/* midground — gold rim light, the warm counterweight to the blue */}
      <div className="ambient-rim" />

      {/* midground — horizon glow and perspective floor */}
      <div className="depth-floor absolute inset-x-0 bottom-0 h-[46vh]" />
      <div className="ambient-horizon" />

      {/* foreground — vignette that seats the content inside the space */}
      <div className="ambient-vignette" />

      {/* fine grain so the gradients read as a surface, not a wash */}
      <div className="ambient-grain" />
    </div>
  );
}
