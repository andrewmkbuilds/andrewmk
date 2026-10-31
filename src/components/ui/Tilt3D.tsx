import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees. Keep small — this should read as depth, not spin. */
  intensity?: number;
  /** Perspective depth in px. */
  perspective?: number;
  /** Light gliding across the surface as the pointer moves. */
  glare?: boolean;
}

/**
 * Pointer-driven 3D tilt wrapper for desktop mice only.
 *
 * The element's box is measured once per pointer entry (not per move) and the
 * style writes are coalesced into one frame, so a fast sweep across the card
 * costs a couple of transforms instead of a layout read for every event.
 * Touch, coarse pointers and reduced-motion users get a static container.
 */
export function Tilt3D({
  children,
  className,
  intensity = 6,
  perspective = 1100,
  glare = false,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rect = useRef<DOMRect | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const paint = () => {
    frame.current = 0;
    const el = ref.current;
    const point = pending.current;
    if (!el || !point) return;
    el.style.transform = `perspective(${perspective}px) rotateX(${(-(point.y - 0.5) * intensity * 2).toFixed(2)}deg) rotateY(${((point.x - 0.5) * intensity * 2).toFixed(2)}deg)`;
    el.style.setProperty("--mx", `${(point.x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(point.y * 100).toFixed(1)}%`);
  };

  const handleEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    rect.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const box = rect.current;
    if (!box) return;
    pending.current = {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  };

  const reset = () => {
    rect.current = null;
    pending.current = null;
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("tilt-3d group relative", className)}
    >
      {glare && <span aria-hidden="true" className="sheen" />}
      {children}
    </div>
  );
}
