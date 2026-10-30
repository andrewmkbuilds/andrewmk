import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Travel in px across the element's full viewport pass. Positive moves the
   * element against the scroll (background layers); negative moves it with
   * the scroll (foreground layers). Keep it small — depth, not decoration.
   */
  distance?: number;
  /** Extra scale at the edges of the pass — subtle zoom, 0 disables. */
  scale?: number;
  /** Set on decorative wrappers only. */
  ariaHidden?: boolean;
}

/**
 * Scroll-linked depth. Only `transform` is animated, so it stays on the
 * compositor and never causes layout shift.
 *
 * Disabled for reduced-motion users (the child renders exactly as it would
 * outside the wrapper) and halved on narrow viewports so phones keep a light
 * motion budget.
 */
export function Parallax({
  children,
  className,
  distance = 40,
  scale = 0,
  ariaHidden = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [factor, setFactor] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setFactor(mq.matches ? 0.45 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = distance * factor;
  const rawY = useTransform(scrollYProgress, [0, 1], [travel, -travel]);
  const y = useSpring(rawY, { stiffness: 120, damping: 30, mass: 0.35 });
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1 + scale, 1],
  );

  return (
    <motion.div
      ref={ref}
      aria-hidden={ariaHidden || undefined}
      className={cn(className)}
      style={
        reduce
          ? undefined
          : { y, scale: scale ? rawScale : undefined, willChange: "transform" }
      }
    >
      {children}
    </motion.div>
  );
}
