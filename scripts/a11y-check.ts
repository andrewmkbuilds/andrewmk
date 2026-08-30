/**
 * Static accessibility regression check.
 *
 * Fetches every indexable route's server-rendered HTML and asserts the basics
 * that regress most often in this codebase:
 *   - exactly one <h1>, no skipped heading levels
 *   - <html lang> present
 *   - a <main> landmark
 *   - every <img> has an alt attribute
 *   - every link/button whose content is icon-only carries an accessible name
 *   - every <input>/<textarea>/<select> has a label, aria-label or aria-labelledby
 *
 * Usage: bun run a11y:check -- --base=http://localhost:8080
 */

import { routes } from "../src/data/seo";

const args = process.argv.slice(2);
const argValue = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const BASE = (argValue("base") ?? "http://localhost:8080").replace(/\/$/, "");

const failures: string[] = [];
const fail = (route: string, msg: string) => failures.push(`${route}: ${msg}`);

const stripHidden = (html: string) => html.replace(/<template[\s\S]*?<\/template>/gi, "");

function checkHeadings(route: string, html: string) {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) fail(route, `expected exactly one <h1>, found ${h1s}`);
  let previous = 0;
  for (const level of levels) {
    if (previous && level > previous + 1) {
      fail(route, `heading order jumps from h${previous} to h${level}`);
      break;
    }
    previous = level;
  }
}

function checkImages(route: string, html: string) {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt\s*=/.test(tag)) fail(route, `<img> without alt: ${tag.slice(0, 90)}`);
  }
}

function checkControls(route: string, html: string) {
  const labelledIds = new Set(
    [...html.matchAll(/<label[^>]+for="([^"]+)"/gi)].map((m) => m[1]!),
  );
  for (const [tag] of html.matchAll(/<(?:input|textarea|select)\b[^>]*>/gi)) {
    if (/type="(hidden|submit|button)"/i.test(tag)) continue;
    const id = /\sid="([^"]+)"/i.exec(tag)?.[1];
    const named =
      /aria-label(?:ledby)?\s*=/.test(tag) || (id ? labelledIds.has(id) : false);
    if (!named) fail(route, `form control without accessible name: ${tag.slice(0, 90)}`);
  }
}

function checkIconOnlyControls(route: string, html: string) {
  const pattern = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(pattern)) {
    const attrs = match[2] ?? "";
    const inner = match[3] ?? "";
    if (/aria-hidden="true"/.test(attrs)) continue;
    const text = inner.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    if (text.length > 0) continue;
    const hasSrOnly = /sr-only/.test(inner);
    if (/aria-label(?:ledby)?\s*=|\stitle\s*=/.test(attrs) || hasSrOnly) continue;
    if (!/<svg|<img/i.test(inner)) continue;
    fail(route, `icon-only <${match[1]}> without accessible name: ${match[0].slice(0, 110)}`);
  }
}

async function run() {
  for (const route of routes) {
    const url = `${BASE}${route.path}`;
    let html: string;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        fail(route.path, `HTTP ${response.status}`);
        continue;
      }
      html = stripHidden(await response.text());
    } catch (error) {
      fail(route.path, `request failed: ${(error as Error).message}`);
      continue;
    }

    if (!/<html[^>]+lang="/i.test(html)) fail(route.path, "<html> is missing a lang attribute");
    if (!/<main[\s>]/i.test(html)) fail(route.path, "no <main> landmark");
    checkHeadings(route.path, html);
    checkImages(route.path, html);
    checkControls(route.path, html);
    checkIconOnlyControls(route.path, html);
  }

  if (failures.length) {
    console.error(`\n✗ Accessibility check failed (${failures.length} issue(s)):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`✓ Accessibility check passed across ${routes.length} routes.`);
}

run();
