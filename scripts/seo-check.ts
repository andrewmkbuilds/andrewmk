// CI/build guard: verifies canonical tags, metadata uniqueness, og:image wiring,
// sitemap coverage and robots.txt correctness against the built output.
// Run with: bunx tsx scripts/seo-check.ts
//
// Only the routes in src/data/prerender.ts have an HTML file in `dist/`.
// `/projects` and `/404` are rendered by the server on demand (their metadata
// comes from the database at request time), so this check fetches them from a
// running server when one is given with `--base=http://localhost:4173` and
// otherwise reports them as skipped — it never demands a static file for a route
// the build is not supposed to prerender.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import {
  SITE_URL,
  indexableRoutes,
  ogImagePath,
  routes,
  routeSlug,
} from "../src/data/seo";
import { isPrerendered } from "../src/data/prerender";

const args = process.argv.slice(2);
const BASE = (
  args.find((a) => a.startsWith("--base="))?.split("=")[1] ?? ""
).replace(/\/$/, "");
// The deploy build (`cloudflare-module`) writes its prerendered pages to
// `.output/public/`; the Pages target writes `dist/`. Check whichever this
// checkout actually produced, and let `--dir=` name it explicitly.
const DIST = resolve(
  args.find((a) => a.startsWith("--dir="))?.split("=")[1] ??
    (existsSync(resolve(".output/public/index.html"))
      ? ".output/public"
      : "dist"),
);
const errors: string[] = [];
const fail = (message: string) => errors.push(message);
const skipped: string[] = [];

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, "utf8") : null;

/** Fetch a route from the server given with `--base`, if there is one. */
async function fetchHtml(path: string) {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "user-agent": "seo-check" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function loadHtml(path: string) {
  const file =
    path === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, `.${path}/index.html`);
  const local = read(file);
  if (local) return local;
  const remote = await fetchHtml(path);
  if (remote) return remote;
  return null;
}

const titles = new Map<string, string>();
const descriptions = new Map<string, string>();

for (const route of routes) {
  const html = await loadHtml(route.path);
  if (!html) {
    if (isPrerendered(route.path))
      fail(`${route.path}: no prerendered HTML at dist and no --base`);
    else skipped.push(route.path);
    continue;
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html
    .match(/<meta name="description" content="([^"]*)"/)?.[1]
    ?.trim();
  const canonicals = [
    ...html.matchAll(/<link rel="canonical" href="([^"]*)"/g),
  ].map((m) => m[1]);
  const ogUrls = [
    ...html.matchAll(/<meta property="og:url" content="([^"]*)"/g),
  ].map((m) => m[1]);
  const ogImages = [
    ...html.matchAll(/<meta property="og:image" content="([^"]*)"/g),
  ].map((m) => m[1]);
  const expected = `${SITE_URL}${route.path}`;

  if (!title) fail(`${route.path}: missing <title>`);
  if (!description) fail(`${route.path}: missing meta description`);
  if (title && /Lovable App/i.test(title))
    fail(`${route.path}: default template title`);
  if (description && /Lovable Generated Project/i.test(description)) {
    fail(`${route.path}: default template description`);
  }

  if (title) {
    const clash = titles.get(title);
    if (clash) fail(`${route.path}: duplicate title with ${clash}`);
    titles.set(title, route.path);
  }
  if (description) {
    const clash = descriptions.get(description);
    if (clash) fail(`${route.path}: duplicate description with ${clash}`);
    descriptions.set(description, route.path);
  }

  if (canonicals.length !== 1)
    fail(`${route.path}: expected 1 canonical, found ${canonicals.length}`);
  else if (canonicals[0] !== expected)
    fail(`${route.path}: canonical is ${canonicals[0]}`);

  if (ogUrls.length !== 1)
    fail(`${route.path}: expected 1 og:url, found ${ogUrls.length}`);
  else if (ogUrls[0] !== expected)
    fail(`${route.path}: og:url is ${ogUrls[0]}`);

  if (ogImages.length !== 1)
    fail(`${route.path}: expected 1 og:image, found ${ogImages.length}`);
  const imageFile = resolve(DIST, `.${ogImagePath(route.path)}`);
  if (!existsSync(imageFile))
    fail(`${route.path}: og image missing (${routeSlug(route.path)}.png)`);

  const hasNoindex = /<meta name="robots" content="noindex"/.test(html);
  if (Boolean(route.noindex) !== hasNoindex) {
    fail(
      `${route.path}: noindex mismatch (expected ${Boolean(route.noindex)})`,
    );
  }
  if (!/"@type":"BreadcrumbList"/.test(html))
    fail(`${route.path}: missing BreadcrumbList JSON-LD`);
}

// Sitemap
const sitemap =
  read(resolve(DIST, "sitemap.xml")) ??
  (BASE
    ? await fetch(`${BASE}/sitemap.xml`)
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null)
    : null);
if (!sitemap) fail("sitemap.xml missing from dist");
else {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const route of indexableRoutes) {
    if (!locs.includes(`${SITE_URL}${route.path}`))
      fail(`sitemap: missing ${route.path}`);
  }
  for (const route of routes.filter((r) => r.noindex)) {
    if (locs.includes(`${SITE_URL}${route.path}`))
      fail(`sitemap: noindex route listed (${route.path})`);
  }
  if (new Set(locs).size !== locs.length)
    fail("sitemap: duplicate <loc> entries");
  // <lastmod> comes from git history in scripts/generate-sitemap.ts, so it may be
  // present — but it must be a real W3C date and never stamped with the build time.
  const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(
    (m) => m[1]!,
  );
  for (const lastmod of lastmods) {
    if (
      !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(
        lastmod,
      )
    ) {
      fail(`sitemap: invalid <lastmod> (${lastmod})`);
    }
  }
}

// robots.txt
const robots =
  read(resolve(DIST, "robots.txt")) ??
  (BASE
    ? await fetch(`${BASE}/robots.txt`)
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null)
    : null);
if (!robots) fail("robots.txt missing from dist");
else {
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots))
    fail("robots.txt: site-wide Disallow: /");
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`))
    fail("robots.txt: sitemap directive missing");
}

if (skipped.length) {
  console.log(
    `Server-rendered, not in dist: ${skipped.join(", ")}` +
      (BASE ? "" : " — pass --base=<url> to check them too"),
  );
}

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`SEO check passed (${routes.length - skipped.length} routes)`);
