/**
 * One scroll listener for the whole app.
 *
 * Every scroll-driven surface (header progress, parallax layers) subscribes
 * here instead of attaching its own listener, so a rapid scroll costs a single
 * passive listener and one batched write per frame — never one listener (or one
 * React render) per component.
 */

type ScrollCallback = (scrollY: number) => void;

const subscribers = new Set<ScrollCallback>();
let frame = 0;
let lastY = -1;

function flush() {
  frame = 0;
  const y = window.scrollY;
  if (y === lastY) return;
  lastY = y;
  for (const callback of subscribers) callback(y);
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

export function subscribeScroll(callback: ScrollCallback): () => void {
  if (subscribers.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  subscribers.add(callback);
  callback(window.scrollY);

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastY = -1;
    }
  };
}
