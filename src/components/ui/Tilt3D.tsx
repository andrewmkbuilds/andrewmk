import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. Keep small — this should read as depth, not spin. */
  intensity?: number;
  /** Perspective depth in px. */
  perspective?: number;
  /** Light gliding across the surface as the pointer moves. */
  glare?: boolean;
}

/**
 * Pointer-driven 3D tilt wrapper.
 * Desktop mouse only: touch pointers, coarse pointers and reduced-motion users
 * get a plain static container so nothing feels laggy or gimmicky on mobile.
 *
 * Also publishes `--mx` / `--my` (pointer position within the element) so a
 * `.sheen` child can carry the key light across the surface.
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

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), spring);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    const rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={
        reduce
          ? {}
          : { rotateX, rotateY, transformPerspective: perspective, transformStyle: "preserve-3d" }
      }
      className={cn("group relative", className)}
    >
      {glare && <span aria-hidden="true" className="sheen" />}
      {children}
    </motion.div>
  );
}
