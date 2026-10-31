import type { ReactNode } from "react";
import { useLocation } from "@/lib/router-compat";

/**
 * Route transition: a short CSS fade on the compositor. No animation library,
 * no inline styles, and it never delays reading the content.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fade-in">
      {children}
    </div>
  );
}
