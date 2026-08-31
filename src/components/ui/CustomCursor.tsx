import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type CursorState = "default" | "link" | "view";

/**
 * Subtle desktop cursor companion: a small dot plus a ring that expands over
 * interactive surfaces and shows "View" over project cards.
 * Not rendered on touch/coarse pointers or with reduced motion enabled.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none-desktop");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const hit = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const explicit = hit?.dataset['cursor'] as CursorState | undefined;
      if (explicit) {
        setState(explicit);
        return;
      }
      setState(
        target?.closest?.("a, button, [role='button'], input, textarea, select") ? "link" : "default",
      );
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = state === "view" ? 64 : state === "link" ? 40 : 26;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 rounded-full bg-gold"
        style={{ x, y, width: 5, height: 5, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: state === "default" ? 1 : 0.4 }}
        transition={{ duration: 0.18 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-gold/50 backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          backgroundColor:
            state === "view" ? "color-mix(in oklab, var(--gold) 16%, transparent)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        <AnimatePresence>
          {state === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
