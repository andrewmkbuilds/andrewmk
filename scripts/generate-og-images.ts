// Generates one 1200x630 og:image per route into public/og/.
// Runs before dev and build so every route has an accurate social preview.

import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { routes, ogImagePath, SITE_URL } from "../src/data/seo";

// Text is drawn by librsvg, which resolves families through fontconfig — and a
// sandbox or CI image can ship no fonts at all, in which case every glyph came
// out as a tofu box. Point fontconfig at the brand faces committed beside this
// script (SIL OFL, licence files alongside) so a card renders the same wherever
// it is built.
const FONT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "og-fonts");
const FONT_CONFIG_DIR = join(tmpdir(), "og-fontconfig");

mkdirSync(join(FONT_CONFIG_DIR, "cache"), { recursive: true });
writeFileSync(
  join(FONT_CONFIG_DIR, "fonts.conf"),
  `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <dir>${FONT_DIR}</dir>
  <cachedir>${join(FONT_CONFIG_DIR, "cache")}</cachedir>
</fontconfig>
`,
);

/** Two words that cannot render alike unless the font really loaded. */
async function fontsAvailable() {
  const probe = (text: string) =>
    sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="4" y="28" font-size="24" font-family="Sora" fill="#fff">${text}</text></svg>`,
      ),
    )
      .png()
      .raw()
      .toBuffer();
  const [a, b] = await Promise.all([probe("Andrew"), probe("IIIIII")]);
  return !a.equals(b);
}

/**
 * librsvg reads FONTCONFIG_PATH from the process environment as it starts, so a
 * runtime `process.env` assignment is too late. Re-run this script once in a
 * child process that carries it — only when the host really has no font, so a
 * machine with fonts (CI, Cloudflare) builds exactly as before.
 */
function rerunWithFontConfig() {
  const child = spawnSync(
    process.execPath,
    [...process.execArgv, ...process.argv.slice(1)],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        FONTCONFIG_PATH: FONT_CONFIG_DIR,
        OG_FONT_CONFIG: "1",
      },
    },
  );
  process.exit(child.status ?? 1);
}

// The site's own navy / blue / gold tokens (src/styles.css), so a shared link
// previews in the same palette as the page it points at.
const BG = "#0B131E";
const SURFACE = "#121C29";
const BORDER = "#22303F";
const ACCENT = "#2A97DF";
const GOLD = "#D6A75B";
const TEXT = "#F2F6F9";
const MUTED = "#9AA6B5";

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (c) =>
      `&${{ "<": "lt", ">": "gt", "&": "amp", "'": "apos", '"': "quot" }[c]};`,
  );

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
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[,;:]$/, "")}…`;
    return kept;
  }
  return lines;
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
  <rect x="40" y="40" width="1120" height="6" rx="3" fill="${GOLD}"/>
  <g font-family="'JetBrains Mono', monospace">
    <text x="88" y="140" font-size="22" letter-spacing="4" fill="${ACCENT}">${escapeXml(
      label.toUpperCase(),
    )}</text>
  </g>
  <g font-family="'Sora', sans-serif" fill="${TEXT}" font-weight="bold" font-size="58">
    ${headlineLines
      .map(
        (line, i) =>
          `<text x="88" y="${240 + i * 70}">${escapeXml(line)}</text>`,
      )
      .join("\n    ")}
  </g>
  <g font-family="'Sora', sans-serif" fill="${MUTED}" font-size="26">
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

const run = async () => {
  if (!(await fontsAvailable())) {
    if (process.env.OG_FONT_CONFIG !== "1") rerunWithFontConfig();
    console.warn("og images: no font found, text will not render");
  }

  for (const route of routes) {
    const markup = svg(
      route.ogLabel ?? route.label,
      route.ogHeadline,
      route.ogDescription ?? route.description,
    );
    const png = await sharp(Buffer.from(markup)).png().toBuffer();
    const target = resolve("public", ogImagePath(route.path).slice(1));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, png);
  }
  console.log(`og images written (${routes.length})`);
};

run();
