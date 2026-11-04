// The routes the deploy build freezes into static HTML.
//
// Kept in its own module with no runtime imports so both the Vite config
// (`tanstackStart.prerender`) and scripts/seo-check.ts read the same list: the
// check must know which routes have an HTML file in `dist/` and which are
// rendered on demand by the server.
//
// Routes deliberately left out, and why:
// - `/projects`: its loader reads the published catalogue from the database at
//   request time, so a project an admin publishes appears without a rebuild.
// - `/projects/$slug`: per-project metadata comes from that same runtime
//   catalogue, so it stays SSR and answers with its own title/OG tags at once.
// - `/blog`, `/blog/$slug`, `/auth`, `/admin/*`, `/404`: request-dependent
//   (database, session, `ssr: false`).
export const PRERENDERED_ROUTES = [
  "/",
  "/about",
  "/journey",
  "/skills",
  "/achievements",
  "/resume",
  "/profile",
  "/now",
  "/press-kit",
  "/faq",
  "/colophon",
  "/sitemap",
  "/developers",
  "/contact",
] as const;

const PRERENDERED = new Set<string>(PRERENDERED_ROUTES);

/** True when the deploy build writes `dist/<path>/index.html` for this route. */
export function isPrerendered(path: string) {
  return PRERENDERED.has(path);
}
