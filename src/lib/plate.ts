/**
 * Typographic plates.
 *
 * Project screenshots are real assets (`Project.screenshot`), so plates are only
 * for image slots that are not a project's own surface: the process rail, the
 * drawer cards and the feature dialog's status sheet. Each plate is a
 * self-contained SVG data URI built from the record: no network request, no
 * build step, no new asset to maintain.
 *
 * Plates render in frames of every ratio — 16:10 in the rail, 4:3 in the drawer
 * poster, 1:1 in the drawer cards, fixed-height cells in the feature dialog — so
 * the copy lives inside a centred safe box that survives the tightest of those
 * crops. The background and the corner ticks may bleed past the frame; the title
 * and the number never do.
 */

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Breaks a label into at most two short lines, so a long name stays inside the
 * safe box instead of running past the plate's right edge.
 */
function titleLines(name: string, maxChars = 15) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= maxChars) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  if (lines.length > 2) {
    lines.splice(1, lines.length - 1, lines.slice(1).join(" "));
  }
  return lines.length ? lines : [name];
}

/** Safe box: crops from 16:9 down to about 5:6 all keep this visible. */
const SAFE = { left: 380, right: 1220, top: 186, bottom: 862 };
const TITLE_SIZE = 92;
const LINE_HEIGHT = 104;

export function projectPlate(name: string, meta: string, index: number) {
  const n = String(index).padStart(2, "0");
  const lines = titleLines(esc(name));
  const lastBaseline = SAFE.bottom - 40;
  const firstBaseline = lastBaseline - (lines.length - 1) * LINE_HEIGHT;
  const title = lines
    .map(
      (line, i) =>
        `<text x="${SAFE.left}" y="${firstBaseline + i * LINE_HEIGHT}" fill="#f2f6fb" fill-opacity="0.94" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${TITLE_SIZE}">${line}</text>`,
    )
    .join("\n  ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050d18"/>
      <stop offset="0.52" stop-color="#0b1c2f"/>
      <stop offset="1" stop-color="#123049"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.18" cy="0.12" r="0.95">
      <stop offset="0" stop-color="#3d9fe0" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#3d9fe0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gold" cx="0.86" cy="0.9" r="0.7">
      <stop offset="0" stop-color="#d9b268" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#d9b268" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <rect width="1600" height="1000" fill="url(#grid)"/>
  <rect width="1600" height="1000" fill="url(#glow)"/>
  <rect width="1600" height="1000" fill="url(#gold)"/>
  <g fill="none" stroke="#d9b268" stroke-opacity="0.55" stroke-width="2">
    <path d="M${SAFE.left - 16} ${SAFE.top + 16}h64M${SAFE.left - 16} ${SAFE.top + 16}v64"/>
    <path d="M${SAFE.right + 16} ${SAFE.bottom - 16}h-64M${SAFE.right + 16} ${SAFE.bottom - 16}v-64"/>
  </g>
  <text x="${SAFE.left - 16}" y="${SAFE.top + 4}" fill="#d9b268" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="26" letter-spacing="7">${esc(meta.toUpperCase())}</text>
  ${title}
  <text x="${SAFE.right}" y="${SAFE.bottom}" text-anchor="end" fill="#f2f6fb" fill-opacity="0.16" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="220" letter-spacing="-8">${n}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
