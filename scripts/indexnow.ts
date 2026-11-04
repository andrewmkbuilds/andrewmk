// Submits the site's public URLs to IndexNow (Bing, Yandex, Seznam, Naver…).
//
// IndexNow is push-based: a page that changes is announced instead of waiting
// for a crawl. It runs on demand — never from `predev`/`prebuild` — so a build
// or a local dev start cannot spam the endpoint.
//
//   bunx tsx scripts/indexnow.ts                 # only URLs whose sitemap <lastmod> changed
//   bunx tsx scripts/indexnow.ts --all           # every public URL in the sitemap
//   bunx tsx scripts/indexnow.ts --dry-run       # show the payload, send nothing
//   bunx tsx scripts/indexnow.ts https://andrewmk.is-a.dev/now  # explicit URLs
//
// A removed page cannot be discovered from the current sitemap; submit it
// explicitly (`scripts/indexnow.ts <url>`) so engines drop it from the index.
//
// The key is public by design (published at /<key>.txt); see src/data/indexnow.ts.

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL } from "../src/data/seo";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KEY_PATH,
} from "../src/data/indexnow";

const SITEMAP = resolve("public/sitemap.xml");
/** Local memory of what was already announced, so a re-run sends nothing twice. */
const STATE_FILE = resolve(".indexnow-state.json");
const MAX_URLS_PER_REQUEST = 10_000;

/** Paths that must never be announced, whatever a sitemap or argument says. */
const PRIVATE_PREFIXES = ["/admin", "/auth", "/api", "/404"];

interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

function readSitemap(): SitemapEntry[] {
  if (!existsSync(SITEMAP)) {
    throw new Error(
      `No sitemap at ${SITEMAP} — run scripts/generate-sitemap.ts first.`,
    );
  }
  const xml = readFileSync(SITEMAP, "utf8");
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const block = match[1] ?? "";
    return {
      loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
      lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    };
  });
}

function readState(): Record<string, string> {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8")) as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

/** True only for an indexable page on this site — never a private route. */
function isPublicUrl(url: string): boolean {
  if (!url.startsWith(`${SITE_URL}/`)) return false;
  const path = url.slice(SITE_URL.length).split(/[?#]/)[0] ?? "/";
  return !PRIVATE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

async function submit(urlList: string[]): Promise<void> {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
      urlList,
    }),
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    throw new Error(`IndexNow answered ${response.status}: ${body}`);
  }
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const dryRun = args.includes("--dry-run");
const explicit = args.filter((arg) => !arg.startsWith("--"));

const state = readState();
const entries = readSitemap();
const changed = entries.filter(
  (entry) => entry.loc && (all || state[entry.loc] !== entry.lastmod),
);

const urlList = [
  ...new Set([
    ...explicit.filter(isPublicUrl),
    ...changed.map((entry) => entry.loc),
  ]),
];

const rejected = explicit.filter((url) => !isPublicUrl(url));
if (rejected.length > 0) {
  console.error("Refusing to submit non-public URLs:");
  for (const url of rejected) console.error(`  - ${url}`);
}

if (urlList.length === 0) {
  console.log("Nothing to submit — every public URL already announced.");
  process.exit(rejected.length > 0 ? 1 : 0);
}

console.log(
  `${dryRun ? "Would submit" : "Submitting"} ${urlList.length} URL(s):`,
);
for (const url of urlList.slice(0, 20)) console.log(`  ${url}`);
if (urlList.length > 20) console.log(`  … and ${urlList.length - 20} more`);

if (dryRun) process.exit(rejected.length > 0 ? 1 : 0);

let submitted = 0;
for (let i = 0; i < urlList.length; i += MAX_URLS_PER_REQUEST) {
  const chunk = urlList.slice(i, i + MAX_URLS_PER_REQUEST);
  // Leave the state file untouched when the request fails, so a retry resends.
  await submit(chunk);
  submitted += chunk.length;
  const lastmodOf = new Map(
    entries.map((entry) => [entry.loc, entry.lastmod] as const),
  );
  for (const url of chunk) {
    const lastmod = lastmodOf.get(url);
    if (lastmod) state[url] = lastmod;
  }
}

writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
console.log(`IndexNow accepted ${submitted} URL(s).`);
process.exit(rejected.length > 0 ? 1 : 0);
