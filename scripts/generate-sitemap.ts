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

const urls = indexableRoutes.map((route) => {
  const lastmod = lastmodFor(
    `${SITE_URL}${route.path}`,
    ROUTE_SOURCES[route.path] ?? [],
  );
  return [
    `  <url>`,
    `    <loc>${SITE_URL}${route.path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    route.changefreq
      ? `    <changefreq>${route.changefreq}</changefreq>`
      : null,
    route.priority ? `    <priority>${route.priority}</priority>` : null,
    `  </url>`,
  ]
    .filter(Boolean)
    .join("\n");
});

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
  const loc = `${SITE_URL}/projects/${slug}`;
  const projectLastmod = lastmodFor(loc, PROJECT_SOURCES);
  urls.push(
    [
      `  <url>`,
      `    <loc>${loc}</loc>`,
      projectLastmod ? `    <lastmod>${projectLastmod}</lastmod>` : null,
      `    <changefreq>monthly</changefreq>`,
      `    <priority>0.7</priority>`,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

const blogLastmod = lastmodFor(`${SITE_URL}/blog`, [
  "src/pages/Blog.tsx",
  "src/routes/blog.index.tsx",
]);

urls.push(
  [
    `  <url>`,
    `    <loc>${SITE_URL}/blog</loc>`,
    blogLastmod ? `    <lastmod>${blogLastmod}</lastmod>` : null,
    `    <changefreq>weekly</changefreq>`,
    `    <priority>0.8</priority>`,
    `  </url>`,
  ]
    .filter(Boolean)
    .join("\n"),
);

// Published blog posts, when build-time database credentials are available.
// Cloudflare builds without them simply ship the static routes above.
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
    if (res.ok) {
      const posts = (await res.json()) as {
        slug: string;
        updated_at?: string;
      }[];
      for (const post of posts) {
        urls.push(
          [
            `  <url>`,
            `    <loc>${SITE_URL}/blog/${encodeURIComponent(post.slug)}</loc>`,
            post.updated_at
              ? `    <lastmod>${post.updated_at}</lastmod>`
              : null,
            `    <changefreq>monthly</changefreq>`,
            `    <priority>0.6</priority>`,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );
      }
    }
  }
} catch (error) {
  console.warn("sitemap: skipped blog posts —", (error as Error).message);
}

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${urls.length} entries)`);
