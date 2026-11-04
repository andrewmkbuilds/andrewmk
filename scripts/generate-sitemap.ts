// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Route metadata lives in src/data/seo.ts so runtime <head> and the sitemap can never drift.
// <lastmod> comes from the page's own source history in git, and is omitted when
// git history is unavailable (a shallow build checkout) rather than being
// stamped with the build time — an inaccurate lastmod is worse than none.

import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL, indexableRoutes } from "../src/data/seo";
import { allProjects } from "../src/data/portfolio";

const previousSitemapPath = resolve("public/sitemap.xml");

/** Source files whose last commit is the page's last content change. */
const ROUTE_SOURCES: Record<string, string[]> = {
  "/": ["src/pages/Home.tsx", "src/routes/index.tsx"],
  "/projects": ["src/pages/Projects.tsx", "src/routes/projects.index.tsx"],
  "/about": ["src/pages/About.tsx", "src/routes/about.tsx"],
  "/journey": ["src/pages/Journey.tsx", "src/routes/journey.tsx"],
  "/skills": ["src/pages/Skills.tsx", "src/routes/skills.tsx"],
  "/achievements": [
    "src/pages/Achievements.tsx",
    "src/routes/achievements.tsx",
  ],
  "/resume": ["src/pages/Resume.tsx", "src/routes/resume.tsx"],
  "/profile": ["src/pages/Profile.tsx", "src/routes/profile.tsx"],
  "/now": ["src/pages/Now.tsx", "src/routes/now.tsx"],
  "/press-kit": ["src/pages/PressKit.tsx", "src/routes/press-kit.tsx"],
  "/faq": ["src/pages/Faq.tsx", "src/routes/faq.tsx"],
  "/colophon": ["src/pages/Colophon.tsx", "src/routes/colophon.tsx"],
  "/sitemap": ["src/pages/Sitemap.tsx", "src/routes/sitemap.tsx"],
  "/developers": ["src/pages/Developers.tsx", "src/routes/developers.tsx"],
  "/contact": ["src/pages/Contact.tsx", "src/routes/contact.tsx"],
};

/** Every project page renders from the same record set and detail template. */
const PROJECT_SOURCES = [
  "src/data/portfolio.ts",
  "src/pages/ProjectDetail.tsx",
  "src/routes/projects.$slug.tsx",
];

function lastModified(paths: string[]): string | undefined {
  if (paths.length === 0) return undefined;
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...paths],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return /^\d{4}-\d{2}-\d{2}T/.test(out) ? out : undefined;
  } catch {
    return undefined;
  }
}

// Build hosts without git history (a local container run) keep the last
// known dates instead of dropping them: reusing a real date beats stamping the
// build time, and it keeps the committed sitemap stable across environments.
const previousLastmod = new Map<string, string>();
try {
  const existing = readFileSync(previousSitemapPath, "utf8");
  for (const match of existing.matchAll(
    /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g,
  )) {
    previousLastmod.set(match[1]!, match[2]!);
  }
} catch {
  // No previous sitemap — nothing to carry over.
}

function lastmodFor(loc: string, paths: string[]): string | undefined {
  return lastModified(paths) ?? previousLastmod.get(loc);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Absolute canonical URL for a site path, percent-encoded per segment. */
function locFor(path: string): string {
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return escapeXml(`${SITE_URL}${encoded}`);
}

/** Locs already emitted, so the same page can never appear twice. */
const seenLocs = new Set<string>();
let duplicateCount = 0;

interface UrlEntry {
  loc: string;
  lastmod?: string | undefined;
  changefreq?: string | undefined;
  priority?: string | undefined;
}

/** A `<url>` block, or null when its loc was already emitted by an earlier entry. */
function urlEntry(entry: UrlEntry): string | null {
  if (seenLocs.has(entry.loc)) {
    duplicateCount += 1;
    return null;
  }
  seenLocs.add(entry.loc);
  return [
    `  <url>`,
    `    <loc>${entry.loc}</loc>`,
    entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
    entry.changefreq
      ? `    <changefreq>${entry.changefreq}</changefreq>`
      : null,
    entry.priority ? `    <priority>${entry.priority}</priority>` : null,
    `  </url>`,
  ]
    .filter(Boolean)
    .join("\n");
}

const urls = indexableRoutes
  .map((route) => {
    const loc = locFor(route.path);
    return urlEntry({
      loc,
      lastmod: lastmodFor(loc, ROUTE_SOURCES[route.path] ?? []),
      changefreq: route.changefreq,
      priority: route.priority,
    });
  })
  .filter((entry): entry is string => entry !== null);

// Project case-study pages: published rows from the content dashboard when the
// database is reachable at build time, otherwise the bundled portfolio data.
let projectSlugs = allProjects.map((p) => p.slug);
const dbUrl = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
const dbKey =
  process.env["SUPABASE_PUBLISHABLE_KEY"] ??
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
if (dbUrl && dbKey) {
  try {
    const res = await fetch(
      `${dbUrl}/rest/v1/projects?select=slug&published=eq.true&archived=eq.false&order=sort_order.asc`,
      { headers: { apikey: dbKey } },
    );
    if (res.ok) {
      const rows = (await res.json()) as { slug: string }[];
      if (rows.length > 0) projectSlugs = rows.map((r) => r.slug);
    }
  } catch (error) {
    console.warn(
      "sitemap: falling back to bundled projects —",
      (error as Error).message,
    );
  }
}

for (const slug of projectSlugs) {
  const loc = locFor(`/projects/${slug}`);
  const entry = urlEntry({
    loc,
    lastmod: lastmodFor(loc, PROJECT_SOURCES),
    changefreq: "monthly",
    priority: "0.7",
  });
  if (entry) urls.push(entry);
}

// Blog: the index and its articles come from Supabase. A listing with no
// published article is a thin page, so it is only advertised once it has one —
// and every published article is listed alongside it.
interface BlogPostRow {
  slug: string;
  updated_at?: string;
}

let blogPosts: BlogPostRow[] = [];
try {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (url && key) {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true&order=published_at.desc`,
      { headers: { apikey: key } },
    );
    if (res.ok) blogPosts = (await res.json()) as BlogPostRow[];
  }
} catch (error) {
  console.warn("sitemap: skipped blog posts —", (error as Error).message);
}

if (blogPosts.length === 0) {
  console.log("sitemap: /blog omitted — no published articles yet");
} else {
  const blogLoc = locFor("/blog");
  const postDates = blogPosts
    .map((post) => post.updated_at)
    .filter((date): date is string => Boolean(date))
    .sort();
  const blogLastmod =
    postDates[postDates.length - 1] ??
    lastmodFor(blogLoc, ["src/pages/Blog.tsx", "src/routes/blog.index.tsx"]);

  const indexEntry = urlEntry({
    loc: blogLoc,
    lastmod: blogLastmod,
    changefreq: "weekly",
    priority: "0.8",
  });
  if (indexEntry) urls.push(indexEntry);

  for (const post of blogPosts) {
    const entry = urlEntry({
      loc: locFor(`/blog/${post.slug}`),
      lastmod: post.updated_at,
      changefreq: "monthly",
      priority: "0.6",
    });
    if (entry) urls.push(entry);
  }
}

/**
 * Sitemap-protocol guard. The build fails instead of publishing a file a crawler
 * would reject: one <urlset> root, one <loc> per <url>, canonical HTTPS locs,
 * no duplicates, well-formed lastmod/changefreq/priority values.
 */
function sitemapProblems(xml: string): string[] {
  const problems: string[] = [];
  const changefreqs = new Set([
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ]);
  const lastmodPattern =
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

  if (!xml.startsWith(`<?xml version="1.0" encoding="UTF-8"?>`)) {
    problems.push("missing XML declaration");
  }
  if (
    !xml.includes(
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    )
  ) {
    problems.push("missing sitemaps.org 0.9 urlset root");
  }
  if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i.test(xml)) {
    problems.push("unescaped ampersand");
  }

  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  if ((xml.match(/<url>/g) ?? []).length !== blocks.length) {
    problems.push("unclosed <url> element");
  }

  const locs: string[] = [];
  for (const block of blocks) {
    const loc = block[1]?.match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (!loc) {
      problems.push("a <url> has no <loc>");
      continue;
    }
    locs.push(loc);
    if (!loc.startsWith(`${SITE_URL}/`)) {
      problems.push(`${loc} is not on the canonical domain ${SITE_URL}`);
    }
    if (!loc.startsWith("https://")) {
      problems.push(`${loc} is not HTTPS`);
    }
    if (loc.length > 2048) problems.push(`${loc} exceeds 2048 characters`);
    if (/[\s<>]/.test(loc))
      problems.push(`${loc} contains whitespace or markup`);

    const lastmod = block[1]?.match(/<lastmod>([^<]*)<\/lastmod>/)?.[1];
    if (lastmod && !lastmodPattern.test(lastmod)) {
      problems.push(`${loc} has an invalid <lastmod> (${lastmod})`);
    }
    const changefreq = block[1]?.match(
      /<changefreq>([^<]*)<\/changefreq>/,
    )?.[1];
    if (changefreq && !changefreqs.has(changefreq)) {
      problems.push(`${loc} has an invalid <changefreq> (${changefreq})`);
    }
    const priority = block[1]?.match(/<priority>([^<]*)<\/priority>/)?.[1];
    if (priority) {
      const value = Number(priority);
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        problems.push(`${loc} has an invalid <priority> (${priority})`);
      }
    }
  }

  const duplicates = locs.filter((loc, index) => locs.indexOf(loc) !== index);
  if (duplicates.length > 0) {
    problems.push(`duplicate locs: ${[...new Set(duplicates)].join(", ")}`);
  }
  if (locs.length === 0) problems.push("no <url> entries");
  if (locs.length > 50_000) problems.push(`${locs.length} URLs exceeds 50,000`);
  if (Buffer.byteLength(xml, "utf8") > 52_428_800) {
    problems.push("file exceeds the 50 MB uncompressed limit");
  }

  return problems;
}

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
].join("\n");

const problems = sitemapProblems(xml);
if (problems.length > 0) {
  console.error(`sitemap.xml failed validation:\n- ${problems.join("\n- ")}`);
  throw new Error("sitemap.xml failed sitemap-protocol validation");
}

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(
  `sitemap.xml written (${urls.length} URLs${
    duplicateCount > 0 ? `, ${duplicateCount} duplicate(s) skipped` : ""
  })`,
);
