import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
