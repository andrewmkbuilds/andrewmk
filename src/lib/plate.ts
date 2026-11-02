/**
 * Typographic plates.
 *
 * Project screenshots are real assets (`Project.screenshot`), so plates are only
 * for image slots that are not a project's own surface: the process rail, the
 * drawer cards and the feature dialog's status sheet. Each plate is a
 * self-contained SVG data URI built from the record: no network request, no
 * build step, no new asset to maintain.
 */

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function projectPlate(name: string, meta: string, index: number) {
  const n = String(index).padStart(2, "0");
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
    <path d="M72 88h64M72 88v64"/>
    <path d="M1528 912h-64M1528 912v-64"/>
  </g>
  <text x="72" y="196" fill="#d9b268" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="26" letter-spacing="7">${esc(meta.toUpperCase())}</text>
  <text x="72" y="860" fill="#f2f6fb" fill-opacity="0.92" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-style="italic">${esc(name)}</text>
  <text x="1500" y="900" text-anchor="end" fill="#f2f6fb" fill-opacity="0.16" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="300" letter-spacing="-12">${n}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
