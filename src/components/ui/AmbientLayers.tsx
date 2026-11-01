import { SceneBackground } from "./background/SceneBackground";

/**
 * The site's shared depth environment, mounted once behind every route.
 *
 * The scene itself lives in `background/SceneBackground.tsx` and the CSS in
 * `src/styles/scene-3d.css`: a near-black navy room with three parallax
 * planes of CSS 3D geometry (see "The ambient background" in AGENTS.md).
 * This wrapper only places it: fixed, behind the layout, out of the flow,
 * decorative, and never interactive.
 */
export function AmbientLayers() {
  return <SceneBackground />;
}
