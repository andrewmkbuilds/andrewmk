import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion()` that is only trusted after the first client render.
 *
 * Motion resolves the preference to `null` on the server, so any component
 * that branches on it while rendering (structure, inline styles, classNames)
 * sends different markup than the one the client hydrates — the class of
 * hydration mismatch this site used to log. Returning `false` until mount
 * keeps the first client render byte-identical to the SSR pass; the real
 * preference then applies on the next frame.
 */
export function useHydratedReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted && reduce === true;
}
