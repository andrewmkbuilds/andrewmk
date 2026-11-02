import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/data/seo";
import { PROFILE_IDENTITY } from "@/data/portfolio";

import appCss from "../styles.css?url";

// ported from index.html — sitewide JSON-LD
const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR,
  url: `${SITE_URL}/`,
  jobTitle: PROFILE_IDENTITY,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  homeLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  },
  workLocation: {
    "@type": "Place",
    name: "Dubai, United Arab Emirates",
  },
  nationality: { "@type": "Country", name: "United Arab Emirates" },
  knowsAbout: [
    "Artificial intelligence",
    "Robotics",
    "Web development",
    "STEM competitions in the UAE",
  ],
  sameAs: [
    "https://github.com/andrewmkbuilds",
    "https://x.com/Andrew444884",
    "https://www.instagram.com/andrewmkbuilds/",
    "https://lovable.dev/@andrewbuilds",
    "https://app.base44.com/@andrewmkbuilds",
    "https://linktr.ee/andrewmkbuilds",
  ],
});

const websiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  author: { "@type": "Person", name: AUTHOR },
});

// Inject the public Supabase config (URL + publishable key) from server-side
// process.env into the browser at runtime, so the client works even when the
// VITE_ build-time variables aren't set (e.g. in a preview sandbox).
const supabaseBootstrap = (() => {
  try {
    const url = process.env["SUPABASE_URL"] || "";
    const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"] || "";
    if (!url || !publishableKey) return "";
    return `window.__SUPABASE_CONFIG__=${JSON.stringify({ url, publishableKey })};`;
  } catch {
    return "";
  }
})();

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        {
          title:
            "Andrew Mathews | Student Developer, AI Builder & Robotics Engineer",
        },
        {
          name: "description",
          content:
            "Andrew Mathews is a student developer and technology builder from Dubai, UAE, creating AI applications, robotics projects, web apps, and innovative technology solutions.",
        },
        { name: "author", content: AUTHOR },
        {
          name: "google-site-verification",
          content: "N0LjBnLEMo8ZqJ1lwaVLoswy8UkfIXMwgdfk35YEY-s",
        },
        {
          name: "Google-Site-Verification",
          content: "uEoWQOpt1nytKyk_9WlQU6iTrvkXo7Peuln1-OrCufs",
        },
      ],
      links: [
        // Brand marks come from img.logo.dev when a publishable token is
        // configured (src/components/ui/BrandLogo.tsx). The ribbon and social
        // rows request them immediately, so opening the connection with the
        // document saves a DNS + TLS round trip on the first mark. Read from the
        // env directly: importing `logoDevEnabled` would pull the whole brand
        // registry into the entry chunk.
        ...(import.meta.env["VITE_LOGO_DEV_TOKEN"]
          ? [{ rel: "preconnect", href: "https://img.logo.dev" }]
          : []),
        // Fonts are self-hosted (src/styles/fonts.css). Preloading the two faces
        // that set the first screen — the Sora display headline and the Inter
        // body text — starts them with the stylesheet instead of after it, so
        // the LCP text does not wait for a second round trip. `crossOrigin` is
        // required on font preloads even for same-origin files.
        {
          rel: "preload",
          href: "/fonts/sora-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "preload",
          href: "/fonts/inter-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/favicon.png" },
      ],
      scripts: [
        ...(supabaseBootstrap
          ? [{ type: "text/javascript", children: supabaseBootstrap }]
          : []),
        { type: "application/ld+json", children: personJsonLd },
        { type: "application/ld+json", children: websiteJsonLd },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFound,
    errorComponent: RootErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  console.error(error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Error
        </p>
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          This page didn't load
        </h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong on our end. You can try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            className="font-mono"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="outline" className="font-mono">
            <a href="/">Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
