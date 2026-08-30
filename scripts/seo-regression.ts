/**
 * Automated SEO regression check.
 *
 * Verifies, for every registered route, that the served HTML contains:
 *   - a unique, non-default <title> and meta description
 *   - exactly one self-referencing canonical and og:url
 *   - a reachable, non-empty og:image (plus twitter:image parity)
 *   - valid JSON-LD: WebPage + BreadcrumbList everywhere, and an ItemList of
 *     SoftwareApplication entries (with build platform + stack) on /projects
 *   - sitemap.xml coverage and a robots.txt that does not block crawlers
 *
 * Sources:
 *   --source=server (default)  fetch a running server (dev or `vite preview`)
 *   --source=dist              read prerendered files from dist/
 *
 * Usage:
 *   bun run seo:regression
 *   bun run seo:regression -- --base=http://localhost:4173
 *   bun run seo:regression -- --source=dist
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { SITE_URL, indexableRoutes, ogImagePath, routes } from "../src/data/seo";

const args = process.argv.slice(2);
const argValue = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const BASE = (argValue("base") ?? "http://localhost:8080").replace(/\/$/, "");
const SOURCE = argValue("source") === "dist" ? "dist" : "server";
const DIST = resolve("dist");

const failures: string[] = [];
const notes: string[] = [];
const fail = (route: string, msg: string) => failures.push(`${route}: ${msg}`);

const attr = (html: string, tag: RegExp) => [...html.matchAll(tag)].map((m) => m[1]!);
const metaProp = (html: string, prop: string) =>
  attr(html, new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]*)"`, "gi"));
const metaName = (html: string, name: string) =>
  attr(html, new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, "gi"));

function decode(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function loadHtml(path: string): Promise<{ html: string; status: number } | null> {
  if (SOURCE === "dist") {
    const file = path === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${path}/index.html`);
    if (!existsSync(file)) return null;
    return { html: readFileSync(file, "utf8"), status: 200 };
  }
  try {
    const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "seo-regression" } });
    return { html: await res.text(), status: res.status };
  } catch {
    return null;
  }
}

async function assetOk(path: string): Promise<{ ok: boolean; detail: string }> {
  if (SOURCE === "dist") {
    const file = resolve(DIST, `.${path}`);
    const publicFile = resolve("public", `.${path}`);
    const target = existsSync(file) ? file : existsSync(publicFile) ? publicFile : null;
    if (!target) return { ok: false, detail: "missing file" };
    const bytes = statSync(target).size;
    return { ok: bytes > 1024, detail: `${bytes} bytes` };
  }
  try {
    const res = await fetch(`${BASE}${path}`);
    const bytes = (await res.arrayBuffer()).byteLength;
    return { ok: res.ok && bytes > 1024, detail: `${res.status}, ${bytes} bytes` };
  } catch (error) {
    return { ok: false, detail: (error as Error).message };
  }
}

function parseJsonLd(html: string, route: string) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]!.trim());

  const parsed: Record<string, unknown>[] = [];
  for (const block of blocks) {
    try {
      parsed.push(JSON.parse(decode(block)) as Record<string, unknown>);
    } catch {
      fail(route, "invalid JSON-LD block");
    }
  }
  return parsed;
}

async function checkRoute(route: (typeof routes)[number]) {
  const loaded = await loadHtml(route.path);
  if (!loaded) {
    fail(route.path, `could not load HTML (source=${SOURCE})`);
    return;
  }
  const { html, status } = loaded;
  const expectedStatus = route.noindex ? [200, 404] : [200];
  if (!expectedStatus.includes(status)) fail(route.path, `unexpected status ${status}`);

  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "");
  const description = decode(metaName(html, "description")[0] ?? "");
  const canonical = attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/gi);
  const ogUrl = metaProp(html, "og:url");
  const ogImage = metaProp(html, "og:image");
  const twitterImage = metaName(html, "twitter:image");
  const expectedUrl = `${SITE_URL}${route.path}`;

  if (!title) fail(route.path, "missing <title>");
  if (title.length > 70) fail(route.path, `title too long (${title.length} chars)`);
  if (/Lovable App/i.test(title)) fail(route.path, "default template title");
  if (!description) fail(route.path, "missing meta description");
  if (description.length > 165) fail(route.path, `description too long (${description.length})`);
  if (/Lovable Generated Project/i.test(description)) fail(route.path, "default description");

  seenTitles.set(title, [...(seenTitles.get(title) ?? []), route.path]);
  seenDescriptions.set(description, [...(seenDescriptions.get(description) ?? []), route.path]);

  if (canonical.length !== 1) fail(route.path, `expected 1 canonical, found ${canonical.length}`);
  else if (canonical[0] !== expectedUrl) fail(route.path, `canonical is ${canonical[0]}`);

  if (ogUrl.length !== 1) fail(route.path, `expected 1 og:url, found ${ogUrl.length}`);
  else if (ogUrl[0] !== expectedUrl) fail(route.path, `og:url is ${ogUrl[0]}`);

  const expectedImage = `${SITE_URL}${ogImagePath(route.path)}`;
  if (ogImage.length !== 1) fail(route.path, `expected 1 og:image, found ${ogImage.length}`);
  else if (ogImage[0] !== expectedImage) fail(route.path, `og:image is ${ogImage[0]}`);
  if (twitterImage[0] !== ogImage[0]) fail(route.path, "twitter:image does not match og:image");
  if (!metaName(html, "twitter:card")[0]) fail(route.path, "missing twitter:card");

  const image = await assetOk(ogImagePath(route.path));
  if (!image.ok) fail(route.path, `og:image asset unusable (${image.detail})`);

  if (route.noindex && !/name="robots"[^>]+content="[^"]*noindex/i.test(html)) {
    fail(route.path, "expected robots noindex");
  }
  if (!route.noindex && /name="robots"[^>]+content="[^"]*noindex/i.test(html)) {
    fail(route.path, "unexpected robots noindex");
  }

  const blocks = parseJsonLd(html, route.path);
  const types = blocks.map((b) => String(b["@type"]));
  if (!types.includes("WebPage")) fail(route.path, "missing WebPage JSON-LD");
  if (!types.includes("BreadcrumbList")) fail(route.path, "missing BreadcrumbList JSON-LD");
  for (const block of blocks) {
    if (block["@context"] !== "https://schema.org") {
      fail(route.path, `JSON-LD block missing @context (${String(block["@type"])})`);
    }
  }

  if (route.path === "/projects" || route.path === "/") {
    const list = blocks.find((b) => b["@type"] === "ItemList") as
      | { itemListElement?: { item?: Record<string, unknown> }[]; numberOfItems?: number }
      | undefined;
    if (!list) {
      fail(route.path, "missing project ItemList JSON-LD");
    } else {
      const items = list.itemListElement ?? [];
      if (items.length === 0) fail(route.path, "project ItemList has no items");
      if (list.numberOfItems !== items.length) fail(route.path, "ItemList numberOfItems mismatch");
      for (const entry of items) {
        const item = entry.item ?? {};
        const name = String(item["name"] ?? "(unnamed)");
        if (item["@type"] !== "SoftwareApplication") {
          fail(route.path, `${name}: item is not SoftwareApplication`);
        }
        if (!item["description"]) fail(route.path, `${name}: item missing description`);
        const props = (item["additionalProperty"] ?? []) as { name?: string; value?: string }[];
        if (!props.some((p) => p.name === "Stack" && p.value)) {
          fail(route.path, `${name}: item missing Stack property`);
        }
      }
      notes.push(`${route.path}: ItemList with ${items.length} projects`);
    }
  }
}

const seenTitles = new Map<string, string[]>();
const seenDescriptions = new Map<string, string[]>();

async function checkSitemapAndRobots() {
  const sitemap =
    SOURCE === "dist"
      ? existsSync(resolve(DIST, "sitemap.xml"))
        ? readFileSync(resolve(DIST, "sitemap.xml"), "utf8")
        : null
      : await fetch(`${BASE}/sitemap.xml`)
          .then((r) => (r.ok ? r.text() : null))
          .catch(() => null);

  if (!sitemap) failures.push("sitemap.xml: not found");
  else {
    for (const route of indexableRoutes) {
      if (!sitemap.includes(`${SITE_URL}${route.path}<`) && !sitemap.includes(`${SITE_URL}${route.path}`)) {
        failures.push(`sitemap.xml: missing ${route.path}`);
      }
    }
    for (const route of routes.filter((r) => r.noindex)) {
      if (sitemap.includes(`<loc>${SITE_URL}${route.path}</loc>`)) {
        failures.push(`sitemap.xml: includes noindex route ${route.path}`);
      }
    }
  }

  const robots =
    SOURCE === "dist"
      ? existsSync(resolve(DIST, "robots.txt"))
        ? readFileSync(resolve(DIST, "robots.txt"), "utf8")
        : null
      : await fetch(`${BASE}/robots.txt`)
          .then((r) => (r.ok ? r.text() : null))
          .catch(() => null);

  if (!robots) failures.push("robots.txt: not found");
  else {
    if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) failures.push("robots.txt: blocks the whole site");
    if (!robots.includes(`${SITE_URL}/sitemap.xml`)) {
      failures.push("robots.txt: missing Sitemap directive");
    }
  }
}

async function main() {
  console.log(`SEO regression — source=${SOURCE}${SOURCE === "server" ? ` base=${BASE}` : ""}\n`);

  for (const route of routes) {
    await checkRoute(route);
  }

  for (const [title, paths] of seenTitles) {
    if (paths.length > 1) failures.push(`duplicate title "${title}" on ${paths.join(", ")}`);
  }
  for (const [description, paths] of seenDescriptions) {
    if (paths.length > 1) {
      failures.push(`duplicate description on ${paths.join(", ")} — "${description.slice(0, 48)}…"`);
    }
  }

  await checkSitemapAndRobots();

  for (const note of notes) console.log(`  · ${note}`);

  if (failures.length > 0) {
    console.error(`\n✗ ${failures.length} SEO regression(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log(`\n✓ ${routes.length} routes passed SEO regression checks.`);
}

void main();
