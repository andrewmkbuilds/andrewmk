// Generates one 1200x630 og:image per route into public/og/.
// Runs before dev and build so every route has an accurate social preview.

import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";
import { routes, routeSlug, SITE_URL } from "../src/data/seo";

const BG = "#0C1216";
const SURFACE = "#131C21";
const BORDER = "#243036";
const ACCENT = "#31B584";
const TEXT = "#EDF3F1";
const MUTED = "#9AAAA6";

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[c]};`);

/** Naive wrap tuned for the 58px headline size. */
function wrap(text: string, maxChars: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function svg(label: string, headline: string, description: string) {
  const headlineLines = wrap(headline, 30, 3);
  const descLines = wrap(description, 62, 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.16"/>
      <stop offset="60%" stop-color="${BG}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#veil)"/>
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="${SURFACE}" stroke="${BORDER}"/>
  <rect x="40" y="40" width="1120" height="6" rx="3" fill="${ACCENT}"/>
  <g font-family="'DejaVu Sans Mono', 'Liberation Mono', monospace">
    <text x="88" y="140" font-size="22" letter-spacing="4" fill="${ACCENT}">${escapeXml(
      label.toUpperCase(),
    )}</text>
  </g>
  <g font-family="'DejaVu Sans', 'Liberation Sans', Arial, sans-serif" fill="${TEXT}" font-weight="bold" font-size="58">
    ${headlineLines
      .map((line, i) => `<text x="88" y="${240 + i * 70}">${escapeXml(line)}</text>`)
      .join("\n    ")}
  </g>
  <g font-family="'DejaVu Sans', 'Liberation Sans', Arial, sans-serif" fill="${MUTED}" font-size="26">
    ${descLines
      .map(
        (line, i) =>
          `<text x="88" y="${250 + headlineLines.length * 70 + i * 38}">${escapeXml(line)}</text>`,
      )
      .join("\n    ")}
  </g>
  <g font-family="'DejaVu Sans Mono', 'Liberation Mono', monospace" font-size="24">
    <text x="88" y="540" fill="${ACCENT}">/</text>
    <text x="102" y="540" fill="${TEXT}">Andrew Mathews</text>
    <text x="1112" y="540" fill="${MUTED}" text-anchor="end">${escapeXml(
      SITE_URL.replace("https://", ""),
    )}</text>
  </g>
</svg>`;
}

const outDir = resolve("public/og");
mkdirSync(outDir, { recursive: true });

const run = async () => {
  for (const route of routes) {
    const markup = svg(route.label, route.ogHeadline, route.description);
    const png = await sharp(Buffer.from(markup)).png().toBuffer();
    writeFileSync(resolve(outDir, `${routeSlug(route.path)}.png`), png);
  }
  console.log(`og images written (${routes.length})`);
};

run();
