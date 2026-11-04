import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { AmbientLayers } from "@/components/ui/AmbientLayers";
import { CursorLayer } from "@/components/ui/CursorLayer";
import { CardFxTracker } from "@/components/ui/CardFx";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // overflow-x-clip, not overflow-x-hidden: hidden turns this wrapper into a
  // scroll container, which silently disables `position: sticky` for every
  // descendant (the journey chapter stack pins on it). clip still stops
  // sideways overflow without creating a scrollport.
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <AmbientLayers />
      <CursorLayer />
      <CardFxTracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      {/* tabIndex -1 makes the skip link actually move focus into the page:
          without it the browser only moves the scroll position. */}
      <main
        id="main"
        tabIndex={-1}
        className="relative flex-1 pt-16 focus:outline-none"
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
