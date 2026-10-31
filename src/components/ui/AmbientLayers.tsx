import type { CSSProperties } from "react";
import { PointerLight } from "./PointerLight";

/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * The room is painted entirely in CSS, back to front: a navy base with a cold
 * light from above → two silk light sheets drifting across it → the blue key
 * light → the gold rim → the horizon glow → a perspective floor → the vignette
 * that seats the content → a pointer-tracked gold light → a field of drifting
 * motes → a fine grain pass.
 *
 * Every layer is a gradient or a dot on its own compositor layer, blended with
 * `screen` so it adds light instead of covering the page. No canvas, no WebGL
 * context, no `filter: blur()`: a shader background here lost its context and
 * Chrome composited it as an opaque light plate, and cost ~3× the paint of
 * these gradients. The room itself is `-z-10`, so it always sits behind the
 * content and never intercepts a pointer.
 *
 * Purely decorative — `aria-hidden`, `pointer-events-none`, outside the layout
 * flow, and removed entirely from the print stylesheet.
 */

/** Deterministic motes (server and client render the same field). */
const MOTES = [
  { x: "5%", size: 3, dur: 34, delay: -7, drift: 22, op: 0.5 },
  { x: "12%", size: 2, dur: 41, delay: -24, drift: -16, op: 0.42 },
  { x: "18%", size: 4, dur: 29, delay: -14, drift: 12, op: 0.55 },
  { x: "24%", size: 2, dur: 46, delay: -33, drift: 26, op: 0.4 },
  { x: "29%", size: 3, dur: 37, delay: -3, drift: -22, op: 0.6 },
  { x: "34%", size: 5, dur: 44, delay: -19, drift: 18, op: 0.35 },
  { x: "39%", size: 2, dur: 31, delay: -28, drift: -12, op: 0.45 },
  { x: "44%", size: 3, dur: 39, delay: -11, drift: 24, op: 0.52 },
  { x: "49%", size: 4, dur: 27, delay: -36, drift: -18, op: 0.48 },
  { x: "53%", size: 2, dur: 43, delay: -1, drift: 14, op: 0.38 },
  { x: "57%", size: 3, dur: 35, delay: -21, drift: -26, op: 0.58 },
  { x: "61%", size: 5, dur: 48, delay: -40, drift: 20, op: 0.33 },
  { x: "65%", size: 2, dur: 33, delay: -9, drift: -14, op: 0.46 },
  { x: "69%", size: 3, dur: 40, delay: -26, drift: 28, op: 0.5 },
  { x: "73%", size: 4, dur: 30, delay: -16, drift: -20, op: 0.42 },
  { x: "77%", size: 2, dur: 45, delay: -5, drift: 16, op: 0.36 },
  { x: "81%", size: 3, dur: 36, delay: -30, drift: -24, op: 0.54 },
  { x: "85%", size: 4, dur: 28, delay: -12, drift: 22, op: 0.44 },
  { x: "89%", size: 2, dur: 42, delay: -35, drift: -18, op: 0.4 },
  { x: "93%", size: 3, dur: 32, delay: -8, drift: 26, op: 0.56 },
  { x: "96%", size: 2, dur: 47, delay: -23, drift: -16, op: 0.34 },
  { x: "8%", size: 4, dur: 26, delay: -18, drift: 20, op: 0.4 },
  { x: "46%", size: 2, dur: 38, delay: -31, drift: -28, op: 0.44 },
  { x: "63%", size: 3, dur: 50, delay: -2, drift: 18, op: 0.38 },
];

export function AmbientLayers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* background — the room: navy base with a cold top light */}
      <div className="ambient-base" />

      {/* midground — the two silk light sheets that make the room visible */}
      <div className="ambient-silk" />
      <div className="ambient-silk-b" />

      {/* midground — the room's single key light, drifting very slowly */}
      <div className="ambient-key" />

      {/* midground — gold rim light, the warm counterweight to the blue */}
      <div className="ambient-rim" />

      {/* midground — horizon glow and perspective floor */}
      <div className="depth-floor absolute inset-x-0 bottom-0 h-[46vh]" />
      <div className="ambient-horizon" />

      {/* foreground — vignette that seats the content inside the space */}
      <div className="ambient-vignette" />

      {/* interactive light — one element, transform only */}
      <PointerLight />

      {/* foreground — motes drifting up through the room */}
      <div className="dust-field">
        {MOTES.map((mote, i) => (
          <span
            key={i}
            className="dust"
            style={
              {
                "--dust-x": mote.x,
                "--dust-size": `${mote.size}px`,
                "--dust-dur": `${mote.dur}s`,
                "--dust-delay": `${mote.delay}s`,
                "--dust-drift": `${mote.drift}px`,
                "--dust-op": mote.op,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* fine grain so the gradients read as a surface, not a wash */}
      <div className="ambient-grain" />
    </div>
  );
}
