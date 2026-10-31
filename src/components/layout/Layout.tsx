import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { AmbientLayers } from "@/components/ui/AmbientLayers";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <AmbientLayers />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative flex-1 pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
