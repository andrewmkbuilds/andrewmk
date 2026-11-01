import { useEffect, type RefObject } from "react";
import { subscribeScroll } from "@/lib/scroll";

/** How far the background can drift over a full page scroll. */
const MAX_SCROLL_SHIFT = 240;

/**
 * Drives the 3D background's parallax.
 *
 * Two custom properties are written on the scene root and nothing else:
 *
 *   --px / --py   pointer position, normalised to -1…1 and eased
 *   --sy          scroll offset in px, clamped
 *
 * The three depth layers consume them in CSS (`calc()`), so each layer moves
 * by its own amount from a single style write per frame. No React state, no
 * per-object work, no listener per object: one passive `pointermove` and the
 * shared scroll subscription from `@/lib/scroll`.
 *
 * Disabled entirely under `prefers-reduced-motion`. Only events with
 * `pointerType === "mouse"` move the scene, so touch devices pay nothing but
 * the clamped scroll drift.
 */
export function useSceneDepth(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let unsubscribeScroll: (() => void) | undefined;

    const tick = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      root.style.setProperty("--px", currentX.toFixed(4));
      root.style.setProperty("--py", currentY.toFixed(4));

      // Keep easing until the pointer has effectively settled, then stop the
      // loop so an idle page costs no frames.
      if (
        Math.abs(targetX - currentX) > 0.0015 ||
        Math.abs(targetY - currentY) > 0.0015
      ) {
        frame = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      targetX = targetY = currentX = currentY = 0;
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
    };

    const sync = () => {
      window.removeEventListener("pointermove", onPointerMove);
      unsubscribeScroll?.();
      unsubscribeScroll = undefined;
      reset();
      root.style.setProperty("--sy", "0px");

      if (reduceQuery.matches) return;

      // Touch and pen never drive the parallax (they have no hover position);
      // the handler itself ignores them rather than gating on a media query,
      // which is unreliable in embedded and automated browsers.
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      unsubscribeScroll = subscribeScroll((y) => {
        const shift = Math.max(-MAX_SCROLL_SHIFT, -y * 0.16);
        root.style.setProperty("--sy", `${shift.toFixed(1)}px`);
      });
    };

    sync();
    reduceQuery.addEventListener("change", sync);

    return () => {
      reset();
      window.removeEventListener("pointermove", onPointerMove);
      unsubscribeScroll?.();
      root.style.setProperty("--sy", "0px");
      reduceQuery.removeEventListener("change", sync);
    };
  }, [rootRef]);
}
