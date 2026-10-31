import { type ReactNode, useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Travel in px across the element's full viewport pass. Keep it small —
   * depth, not decoration.
   */
  distance?: number;
  /** Extra scale at the edges of the pass — subtle zoom, 0 disables. */
  scale?: number;
  /** Set on decorative wrappers only. */
  ariaHidden?: boolean;
}

/**
 * Scroll-linked depth with a strict budget: one shared scroll listener for the
 * whole page, transforms only, and work limited to elements actually on
 * screen. It never runs on phones (below 768px) or for reduced-motion users,
 * where the child simply renders in place.
 */
export function Parallax({
  children,
  className,
  distance = 40,
  scale = 0,
  ariaHidden = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones get a static composition: no scroll-linked work at all.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let visible = false;
    let top = 0;
    let height = 1;
    let viewport = window.innerHeight;
    let unsubscribe: (() => void) | undefined;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = Math.max(1, rect.height);
      viewport = window.innerHeight;
    };

    const apply = (y: number) => {
      if (!visible) return;
      const passed = y + viewport - top;
      const progress = Math.min(1, Math.max(0, passed / (viewport + height)));
      const offset = (0.5 - progress) * 2 * distance;
      el.style.transform =
        scale > 0
          ? `translate3d(0, ${offset.toFixed(2)}px, 0) scale(${(1 + (0.5 - Math.abs(progress - 0.5)) * scale).toFixed(4)})`
          : `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const start = () => {
      if (visible) return;
      visible = true;
      el.style.willChange = "transform";
      measure();
      unsubscribe = subscribeScroll(apply);
    };

    const stop = () => {
      visible = false;
      el.style.willChange = "";
      unsubscribe?.();
      unsubscribe = undefined;
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(el);

    const ro = new ResizeObserver(() => {
      if (visible) {
        measure();
        apply(window.scrollY);
      }
    });
    ro.observe(el);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.style.transform = "";
    };
  }, [distance, scale]);

  return (
    <div
      ref={ref}
      aria-hidden={ariaHidden || undefined}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
