// Post-build prerender of the document <head> for every route.
//
// The app is a client-rendered SPA, so react-helmet-async only updates the head
// after JS runs — social crawlers (Slack, LinkedIn, Facebook, X) never see it.
// This script writes a static HTML file per route with the correct title,
// description, canonical, og:*, twitter:* and JSON-LD baked in, so crawlers get
// accurate per-page metadata without JS. The SPA still hydrates normally.

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  ogImagePath,
  routes,
  webPageJsonLd,
  type RouteMeta,
} from "../src/data/seo";

const DIST = resolve("dist");
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function headFor(route: RouteMeta) {
  const url = `${SITE_URL}${route.path}`;
  const image = `${SITE_URL}${ogImagePath(route.path)}`;
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${route.path === "/" ? "website" : "article"}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    route.noindex ? `<meta name="robots" content="noindex" />` : null,
    `<script type="application/ld+json">${JSON.stringify(webPageJsonLd(route))}</script>`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd(route))}</script>`,
  ].filter(Boolean);

  return tags.map((tag) => `    ${tag}`).join("\n");
}

function render(route: RouteMeta) {
  let html = template;

  // Drop the sitewide placeholders that the per-route tags replace.
  html = html
    .replace(/\s*<meta property="og:(title|description|type|url)"[\s\S]*?\/>/g, "")
    .replace(/\s*<meta name="twitter:(card|title|description)"[\s\S]*?\/>/g, "")
    .replace(/\s*<link rel="canonical"[^>]*\/>/g, "");

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
  );
  html = html.replace("</head>", `${headFor(route)}\n  </head>`);
  return html;
}

for (const route of routes) {
  const target =
    route.path === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${route.path}/index.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, render(route));
}

console.log(`prerendered head for ${routes.length} routes`);
