import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Subtle magnetic pull towards the cursor. Desktop pointers only —
 * automatically inert on touch devices and with reduced-motion enabled.
 *
 * Only a couple of these exist on a page; each measures its own box on entry
 * rather than on every pointer move.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  radius = 90,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const box = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const handleEnter = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    box.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse" || !box.current) return;
    const { left, top, width, height } = box.current;
    const dx = e.clientX - (left + width / 2);
    const dy = e.clientY - (top + height / 2);
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / (radius + width / 2));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    box.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
