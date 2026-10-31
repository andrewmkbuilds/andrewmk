import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useLocation } from "@/lib/router-compat";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

/** Fast, restrained page transition — never delays reading the content. */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduce = useHydratedReducedMotion();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
