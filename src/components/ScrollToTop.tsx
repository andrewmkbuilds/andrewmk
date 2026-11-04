import { useEffect, useRef } from "react";
import { useLocation } from "@/lib/router-compat";

/**
 * Reset the document to the top on a new route.
 *
 * Two things this has to get right:
 *
 * - `body { overflow-x: hidden }` makes `documentElement` the scroll container,
 *   so `window.scrollTo()` alone can silently do nothing and a new route opened
 *   at the previous page's scroll offset — landing mid-page, on whatever
 *   section happened to be there. Set the scrolling element directly, then
 *   `window` as a fallback.
 * - A history pop (Back/Forward) keeps its position: the browser is returning
 *   you to where you were, not opening a new page.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (popped.current) {
      popped.current = false;
      return;
    }
    const scroller = document.scrollingElement ?? document.documentElement;
    scroller.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
