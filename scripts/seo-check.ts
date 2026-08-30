// CI/build guard: verifies canonical tags, metadata uniqueness, og:image wiring,
// sitemap coverage and robots.txt correctness against the built output.
// Run with: bunx tsx scripts/seo-check.ts  (wired into `postbuild`).

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL, indexableRoutes, ogImagePath, routes, routeSlug } from "../src/data/seo";

const DIST = resolve("dist");
const errors: string[] = [];
const fail = (message: string) => errors.push(message);

const read = (path: string) => (existsSync(path) ? readFileSync(path, "utf8") : null);

const titles = new Map<string, string>();
const descriptions = new Map<string, string>();

for (const route of routes) {
  const file =
    route.path === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${route.path}/index.html`);
  const html = read(file);
  if (!html) {
    fail(`${route.path}: no prerendered HTML at ${file}`);
    continue;
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  const ogUrls = [...html.matchAll(/<meta property="og:url" content="([^"]*)"/g)].map((m) => m[1]);
  const ogImages = [...html.matchAll(/<meta property="og:image" content="([^"]*)"/g)].map(
    (m) => m[1],
  );
  const expected = `${SITE_URL}${route.path}`;

  if (!title) fail(`${route.path}: missing <title>`);
  if (!description) fail(`${route.path}: missing meta description`);
  if (title && /Lovable App/i.test(title)) fail(`${route.path}: default template title`);
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

  if (canonicals.length !== 1) fail(`${route.path}: expected 1 canonical, found ${canonicals.length}`);
  else if (canonicals[0] !== expected) fail(`${route.path}: canonical is ${canonicals[0]}`);

  if (ogUrls.length !== 1) fail(`${route.path}: expected 1 og:url, found ${ogUrls.length}`);
  else if (ogUrls[0] !== expected) fail(`${route.path}: og:url is ${ogUrls[0]}`);

  if (ogImages.length !== 1) fail(`${route.path}: expected 1 og:image, found ${ogImages.length}`);
  const imageFile = resolve(DIST, `.${ogImagePath(route.path)}`);
  if (!existsSync(imageFile)) fail(`${route.path}: og image missing (${routeSlug(route.path)}.png)`);

  const hasNoindex = /<meta name="robots" content="noindex"/.test(html);
  if (Boolean(route.noindex) !== hasNoindex) {
    fail(`${route.path}: noindex mismatch (expected ${Boolean(route.noindex)})`);
  }
  if (!/"@type":"BreadcrumbList"/.test(html)) fail(`${route.path}: missing BreadcrumbList JSON-LD`);
}

// Sitemap
const sitemap = read(resolve(DIST, "sitemap.xml"));
if (!sitemap) fail("sitemap.xml missing from dist");
else {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const route of indexableRoutes) {
    if (!locs.includes(`${SITE_URL}${route.path}`)) fail(`sitemap: missing ${route.path}`);
  }
  for (const route of routes.filter((r) => r.noindex)) {
    if (locs.includes(`${SITE_URL}${route.path}`)) fail(`sitemap: noindex route listed (${route.path})`);
  }
  if (new Set(locs).size !== locs.length) fail("sitemap: duplicate <loc> entries");
  if (/<lastmod>/.test(sitemap)) fail("sitemap: <lastmod> present without an authoritative source");
}

// robots.txt
const robots = read(resolve(DIST, "robots.txt"));
if (!robots) fail("robots.txt missing from dist");
else {
  if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt: site-wide Disallow: /");
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt: sitemap directive missing");
}

if (errors.length) {
  console.error(`SEO check failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`SEO check passed (${routes.length} routes)`);
