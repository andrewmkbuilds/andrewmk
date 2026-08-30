/**
 * Local link-preview checker.
 *
 * Fetches every route from a running server (dev or preview) and reports the
 * og/twitter metadata each one actually serves, plus whether its og:image
 * resolves to a real, non-empty file.
 *
 * Usage:
 *   bun run preview:check                       # against http://localhost:8080
 *   bun run preview:check -- --base=http://localhost:4173
 *   bun run preview:check -- --json             # machine-readable output
 *   bun run preview:check -- --strict           # exit 1 on any problem
 */

import { routes, SITE_URL } from "../src/data/seo";

const args = process.argv.slice(2);
const arg = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const has = (name: string) => args.includes(`--${name}`);

const BASE = (arg("base") ?? "http://localhost:8080").replace(/\/$/, "");
const JSON_OUT = has("json");
const STRICT = has("strict");

interface RouteReport {
  path: string;
  status: number | null;
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  ogImageStatus?: number | null;
  ogImageBytes?: number | null;
  problems: string[];
}

const metaByName = (html: string, name: string) =>
  html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ??
  html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"))?.[1];

const metaByProperty = (html: string, property: string) =>
  html.match(
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
  )?.[1] ??
  html.match(
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, "i"),
  )?.[1];

async function checkRoute(path: string): Promise<RouteReport> {
  const report: RouteReport = { path, status: null, problems: [] };

  let html = "";
  try {
    const res = await fetch(`${BASE}${path}`, { headers: { accept: "text/html" } });
    report.status = res.status;
    html = await res.text();
  } catch (error) {
    report.problems.push(`request failed: ${(error as Error).message}`);
    return report;
  }
  if (report.status !== 200) {
    report.problems.push(`HTTP ${report.status}`);
    return report;
  }

  report.title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  report.description = metaByName(html, "description");
  report.ogTitle = metaByProperty(html, "og:title");
  report.ogDescription = metaByProperty(html, "og:description");
  report.ogType = metaByProperty(html, "og:type");
  report.ogUrl = metaByProperty(html, "og:url");
  report.ogImage = metaByProperty(html, "og:image");
  report.twitterCard = metaByName(html, "twitter:card");
  report.twitterTitle = metaByName(html, "twitter:title");
  report.twitterDescription = metaByName(html, "twitter:description");
  report.twitterImage = metaByName(html, "twitter:image");

  const required: [keyof RouteReport, string][] = [
    ["title", "<title>"],
    ["description", "meta description"],
    ["ogTitle", "og:title"],
    ["ogDescription", "og:description"],
    ["ogType", "og:type"],
    ["ogUrl", "og:url"],
    ["twitterCard", "twitter:card"],
  ];
  for (const [key, label] of required) {
    if (!report[key]) report.problems.push(`missing ${label}`);
  }

  const expectedUrl = `${SITE_URL}${path}`;
  if (report.ogUrl && report.ogUrl !== expectedUrl) {
    report.problems.push(`og:url is ${report.ogUrl} (expected ${expectedUrl})`);
  }

  if (report.ogImage) {
    if (report.twitterImage && report.twitterImage !== report.ogImage) {
      report.problems.push("twitter:image differs from og:image");
    }
    const imageUrl = report.ogImage.startsWith("http")
      ? report.ogImage.replace(SITE_URL, BASE)
      : `${BASE}${report.ogImage}`;
    try {
      const res = await fetch(imageUrl);
      report.ogImageStatus = res.status;
      const bytes = (await res.arrayBuffer()).byteLength;
      report.ogImageBytes = bytes;
      if (res.status !== 200) report.problems.push(`og:image HTTP ${res.status} (${imageUrl})`);
      else if (bytes < 1024) report.problems.push(`og:image suspiciously small (${bytes} bytes)`);
    } catch (error) {
      report.ogImageStatus = null;
      report.problems.push(`og:image fetch failed: ${(error as Error).message}`);
    }
  }

  return report;
}

const reports: RouteReport[] = [];
for (const route of routes) {
  reports.push(await checkRoute(route.path));
}

// Cross-route uniqueness
const seenTitles = new Map<string, string>();
const seenDescriptions = new Map<string, string>();
for (const report of reports) {
  if (report.title) {
    const clash = seenTitles.get(report.title);
    if (clash) report.problems.push(`duplicate title with ${clash}`);
    else seenTitles.set(report.title, report.path);
  }
  if (report.description) {
    const clash = seenDescriptions.get(report.description);
    if (clash) report.problems.push(`duplicate description with ${clash}`);
    else seenDescriptions.set(report.description, report.path);
  }
}

const problemCount = reports.reduce((n, r) => n + r.problems.length, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ base: BASE, problemCount, reports }, null, 2));
} else {
  console.log(`\nPreview check — ${BASE} (${reports.length} routes)\n`);
  for (const r of reports) {
    const mark = r.problems.length === 0 ? "PASS" : "FAIL";
    console.log(`[${mark}] ${r.path}  (HTTP ${r.status ?? "-"})`);
    console.log(`       title       : ${r.title ?? "—"}`);
    console.log(`       description : ${r.description ?? "—"}`);
    console.log(`       og:title    : ${r.ogTitle ?? "—"}`);
    console.log(`       og:desc     : ${r.ogDescription ?? "—"}`);
    console.log(`       og:type/url : ${r.ogType ?? "—"} · ${r.ogUrl ?? "—"}`);
    console.log(
      `       og:image    : ${r.ogImage ?? "—"}` +
        (r.ogImageStatus != null ? `  [HTTP ${r.ogImageStatus}, ${r.ogImageBytes ?? 0} bytes]` : ""),
    );
    console.log(`       twitter     : ${r.twitterCard ?? "—"} · ${r.twitterImage ?? "—"}`);
    for (const problem of r.problems) console.log(`       ! ${problem}`);
    console.log("");
  }
  console.log(
    problemCount === 0
      ? "All routes look good.\n"
      : `${problemCount} problem(s) found across ${reports.filter((r) => r.problems.length).length} route(s).\n`,
  );
}

if (STRICT && problemCount > 0) process.exit(1);
