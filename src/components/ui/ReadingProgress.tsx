import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";

/**
 * A two-pixel reading rule that follows the document.
 *
 * It subscribes to the app's single shared scroll listener and writes one CSS
 * variable per frame — no React state, no layout reads, no extra listener.
 * Decorative only: the position is already conveyed by the scrollbar, so it is
 * hidden from assistive tech.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribeScroll(() => {
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--read", String(progress));
    });
  }, []);

  return (
    <div className="read-bar" ref={ref} aria-hidden="true">
      <span />
    </div>
  );
}
