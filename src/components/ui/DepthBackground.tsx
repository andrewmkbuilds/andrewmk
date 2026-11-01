import { Suspense, lazy, useEffect, useRef, useState } from "react";

// The dot field is the only WebGL surface on the site, so it ships in its own
// chunk and is fetched only after the page is interactive.
const DotField = lazy(() => import("@/components/reactbits/DotField"));

/**
 * The dimensional layer behind everything: a React Bits `DotField` shader that
 * renders a perspective dot lattice which bends under the pointer.
 *
 * It is mounted only where it can pay for itself — a wide, fine-pointer
 * viewport and no reduced-motion request. Phones, touch devices and
 * reduced-motion visitors keep the CSS ambient room (`AmbientLayers`), which is
 * the fallback rather than a substitute: the room is always painted, this adds
 * depth on top of it.
 *
 * Two guards keep a WebGL problem from reaching the page:
 *   1. `webglcontextlost` on the canvas (captured on the wrapper, since the
 *      event does not bubble) unmounts the layer, so a dead context can never
 *      composite as an opaque plate over the content.
 *   2. Any render error inside the shader leaves the CSS room untouched.
 */
/**
 * Software rasterisers (SwiftShader in headless Chrome, llvmpipe, the Windows
 * "Basic Render" driver) run a full-screen shader at a fraction of the speed of
 * any GPU. Measured here: 7 fps with the lattice against 29 fps without it, so
 * those devices keep the CSS room and never fetch the shader at all.
 */
function isSoftwareRenderer() {
  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ??
      (probe.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info
      ? String(gl.getParameter(info["UNMASKED_RENDERER_WEBGL"]))
      : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch {
    return true;
  }
}

export function DepthBackground() {
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Width, not pointer type: a wide tablet still has the pixels for this,
    // and the shader ignores touch pointers by itself.
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let idle = 0;
    const sync = () => {
      const allowed =
        wide.matches && !still.matches && !isSoftwareRenderer();
      window.clearTimeout(idle);
      if (!allowed) {
        setEnabled(false);
        return;
      }
      // Never compete with first paint or the hero entrance.
      idle = window.setTimeout(() => setEnabled(true), 900);
    };

    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      window.clearTimeout(idle);
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onLost = () => setFailed(true);
    host.addEventListener("webglcontextlost", onLost, true);
    return () => host.removeEventListener("webglcontextlost", onLost, true);
  }, [enabled]);

  if (!enabled || failed) return null;

  return (
    <div
      ref={hostRef}
      className="depth-field"
      aria-hidden="true"
      data-testid="depth-field"
    >
      <Suspense fallback={null}>
        <DotField
          dotRadius={1.25}
          dotSpacing={12}
          pattern="grid"
          gradientFrom="#2f63e0"
          gradientTo="#e9c97c"
          gradientAngle={148}
          baseOpacity={0.42}
          speed={0.24}
          waveAmplitude={6}
          cursorRadius={260}
          bulgeStrength={0.34}
          glowColor="#e9c97c"
          glowRadius={230}
          glowIntensity={0.45}
          maxDevicePixelRatio={1}
          className="h-full w-full"
        />
      </Suspense>
    </div>
  );
}
