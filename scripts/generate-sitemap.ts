// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Route metadata lives in src/data/seo.ts so runtime <head> and the sitemap can never drift.
// No <lastmod>: the project has no authoritative per-page change timestamp.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL, indexableRoutes } from "../src/data/seo";

const urls = indexableRoutes.map((route) =>
  [
    `  <url>`,
    `    <loc>${SITE_URL}${route.path}</loc>`,
    route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>` : null,
    route.priority ? `    <priority>${route.priority}</priority>` : null,
    `  </url>`,
  ]
    .filter(Boolean)
    .join("\n"),
);

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${indexableRoutes.length} entries)`);
