/**
 * Optical sizing for brand marks — the single rule every logo on the site
 * follows.
 *
 * `BrandLogo` renders every mark in one fixed slot (see `SIZES`), with the
 * artwork `contain`-fitted and centred. Equal boxes are not equal size,
 * though, and neither is "same ink bounding box":
 *
 * 1. **Full-bleed tiles.** Logo.dev serves several brands as an opaque square
 *    tile (Claude, TypeScript, Java, Swift, Tailwind, Go, Node.js …). The tile
 *    paints the whole slot, so at one shared span it reads far heavier than a
 *    glyph of the same width — that is the "the headline logos look bigger"
 *    report.
 * 2. **Artwork padded inside its canvas.** Supabase ships a near-black tile
 *    with a small green glyph on it; the tile vanishes into the navy pill, so
 *    the mark that actually reads is the glyph, a fraction of the canvas.
 *
 * So the tables below record what a mark actually *shows*: the visible
 * artwork's bounding box (`w` / `h`, as a fraction of the canvas) and the
 * fraction of the canvas it paints (`coverage`). Both are measured against
 * the pill surface — a near-black navy — by rasterising the file, compositing
 * it on that surface and taking the bounds of the pixels that differ from it.
 * Alpha alone is not enough: it calls a near-black tile "100 % ink".
 *
 * One formula then balances every mark, so a new logo needs its measurements
 * added here (or gets the shared default) and nothing else:
 *
 *   weight = clamp((0.55 / coverage) ** 0.34, 0.86, 1)
 *                                              → artwork that paints more of
 *                                                its slot than an average mark
 *                                                is trimmed, because a solid
 *                                                block reads heavier than a
 *                                                glyph of the same width
 *   air    = clamp(0.95 / √(w × h), 0.9, 1)     → artwork with no transparent
 *                                                margin gets a little of it
 *                                                back, so a full-bleed mark
 *                                                does not sit edge to edge
 *   span   = 0.60 × weight × air                → the visible artwork's long
 *                                                side, as a fraction of the slot
 *   scale  = min(span / max(w, h), 1)           → applied inside that slot,
 *                                                never enlarged past it
 *
 * Rendered in the ribbon's 18 px slot that is 8.8 px for a solid tile and
 * ~10.4 px for glyph art — one optical size, measured per mark rather than
 * assumed from its CSS box. A solid tile is smaller in extent on purpose: at
 * equal extent it reads ~15 % heavier than a glyph, which is the defect this
 * corrects.
 */

/** Visible ink bounding box and painted coverage, as fractions of the canvas. */
export interface InkMetrics {
  /** Visible ink width as a fraction of the canvas width. */
  w: number;
  /** Visible ink height as a fraction of the canvas height. */
  h: number;
  /** Visible painted fraction of the canvas; stands in for stroke weight. */
  coverage: number;
}

/**
 * Visible span (long side) of an average-weight mark, as a fraction of its
 * slot. Measured against the rendered ribbon: the glyph marks that already
 * read correctly sit at ~0.60.
 */
const TARGET_SPAN = 0.6;
/** Painted coverage treated as "normal weight" artwork. */
const TARGET_COVERAGE = 0.55;
/** Ink-box / canvas ratio treated as "normal" artwork; above it, art trims. */
const TARGET_FILL = 0.95;
/**
 * How strongly weight trims a mark, and how far it may pull. A dense mark
 * gives up at most ~14 % of its extent — enough to balance a solid tile
 * against a glyph, never enough to make it look like a different size class.
 */
const DENSITY_EXPONENT = 0.34;
const DENSITY_MIN = 0.86;
/** How much of its margin a full-bleed mark has to earn back, at most. */
const FILL_MIN = 0.9;
/** Hard ceiling: a mark is never enlarged past its own slot. */
const SCALE_MAX = 1;

/**
 * Measured ink metrics for the vendored marks (`/public/brands/<slug>.svg`),
 * keyed by file name. These files are monochrome masks painted in
 * `currentColor`, so their alpha bounds are their visible bounds. Every file
 * in that directory is listed, including the Base44 PNG, so no mark on the
 * site is left unmeasured.
 */
const INK: Record<string, InkMetrics> = {
  androidstudio: { w: 0.825, h: 1, coverage: 0.574 },
  anthropic: { w: 1, h: 0.708, coverage: 0.349 },
  arduino: { w: 1, h: 0.492, coverage: 0.244 },
  base44: { w: 1, h: 1, coverage: 0.671 },
  claude: { w: 1, h: 1, coverage: 0.409 },
  cplusplus: { w: 0.892, h: 1, coverage: 0.507 },
  credly: { w: 1, h: 0.5, coverage: 0.167 },
  css: { w: 1, h: 1, coverage: 0.849 },
  datacamp: { w: 0.767, h: 1, coverage: 0.227 },
  docker: { w: 1, h: 0.717, coverage: 0.385 },
  espressif: { w: 1, h: 1, coverage: 0.542 },
  figma: { w: 0.7, h: 1, coverage: 0.266 },
  firebase: { w: 0.8, h: 1, coverage: 0.258 },
  first: { w: 1, h: 0.75, coverage: 0.277 },
  flutter: { w: 0.808, h: 1, coverage: 0.35 },
  framer: { w: 0.667, h: 1, coverage: 0.391 },
  git: { w: 1, h: 1, coverage: 0.464 },
  github: { w: 1, h: 0.975, coverage: 0.436 },
  go: { w: 1, h: 0.375, coverage: 0.186 },
  google: { w: 0.975, h: 1, coverage: 0.387 },
  googlecloud: { w: 1, h: 0.808, coverage: 0.445 },
  googlegemini: { w: 0.967, h: 0.975, coverage: 0.219 },
  hackerrank: { w: 1, h: 1, coverage: 0.857 },
  html5: { w: 0.875, h: 1, coverage: 0.559 },
  instagram: { w: 1, h: 1, coverage: 0.432 },
  java: { w: 0.808, h: 1, coverage: 0.162 },
  javascript: { w: 1, h: 1, coverage: 0.869 },
  kotlin: { w: 1, h: 1, coverage: 0.752 },
  linktree: { w: 0.817, h: 1, coverage: 0.374 },
  lovable: { w: 0.983, h: 1, coverage: 0.75 },
  mediapipe: { w: 1, h: 1, coverage: 0.636 },
  mongodb: { w: 0.45, h: 1, coverage: 0.27 },
  nextdotjs: { w: 1, h: 1, coverage: 0.698 },
  nodedotjs: { w: 0.892, h: 1, coverage: 0.31 },
  openai: { w: 1, h: 0.992, coverage: 0.382 },
  opencv: { w: 1, h: 0.933, coverage: 0.379 },
  postgresql: { w: 0.967, h: 1, coverage: 0.207 },
  postman: { w: 1, h: 1, coverage: 0.72 },
  python: { w: 1, h: 1, coverage: 0.641 },
  react: { w: 1, h: 0.892, coverage: 0.308 },
  rust: { w: 1, h: 1, coverage: 0.539 },
  stripe: { w: 0.717, h: 1, coverage: 0.488 },
  supabase: { w: 0.975, h: 1, coverage: 0.406 },
  swift: { w: 1, h: 1, coverage: 0.762 },
  tailwindcss: { w: 1, h: 0.6, coverage: 0.209 },
  typescript: { w: 1, h: 1, coverage: 0.821 },
  unity: { w: 0.892, h: 1, coverage: 0.494 },
  vercel: { w: 1, h: 0.867, coverage: 0.436 },
  vite: { w: 1, h: 0.958, coverage: 0.476 },
  vue: { w: 1, h: 0.867, coverage: 0.303 },
  x: { w: 0.975, h: 1, coverage: 0.254 },
  xcode: { w: 0.992, h: 1, coverage: 0.555 },
  youtube: { w: 1, h: 0.708, coverage: 0.63 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The one rule. Unknown artwork gets the shared target, never a guess. */
function opticalScale(ink: InkMetrics | undefined): number {
  if (!ink) return TARGET_SPAN;
  // Dense artwork reads heavier, so it gives up extent.
  const weight = clamp(
    (TARGET_COVERAGE / Math.max(ink.coverage, 0.001)) ** DENSITY_EXPONENT,
    DENSITY_MIN,
    1,
  );
  // Artwork with no transparent margin at all gets a little of it back.
  const fill = Math.sqrt(Math.max(ink.w, 0.001) * Math.max(ink.h, 0.001));
  const air = clamp(TARGET_FILL / fill, FILL_MIN, 1);
  const span = TARGET_SPAN * weight * air;
  const fit = span / Math.max(ink.w, ink.h, 0.001);
  return Number(clamp(fit, 0, SCALE_MAX).toFixed(3));
}

/**
 * Scale for a vendored mark, keyed by its file. A brand with no measured
 * artwork (no vendored mark yet) falls back to the shared target span.
 */
export function vendoredOpticalScale(brand: {
  slug?: string | undefined;
  image?: string | undefined;
}): number {
  const key =
    brand.slug ??
    brand.image
      ?.split("/")
      .pop()
      ?.replace(/\.\w+$/, "");
  return opticalScale(key ? INK[key] : undefined);
}

/**
 * Measured ink metrics for the marks Logo.dev serves, keyed by the brand's
 * domain. Logo.dev crops inconsistently — some marks arrive as a glyph on
 * transparency (GitHub, OpenAI, Next.js) and others as an opaque tile, which
 * may be a saturated block (Claude, TypeScript), a light block (Java,
 * Tailwind, Node.js) or a near-black one that disappears into the pill
 * (Supabase). Measured at `?size=128&retina=true&theme=dark` by compositing
 * each file on the pill surface and taking the bounds of what differs from
 * it, for every domain the registry can request (2026-11-01).
 */
const REMOTE_INK: Record<string, InkMetrics> = {
  "anthropic.com": { w: 1, h: 1, coverage: 0.91 },
  "arduino.cc": { w: 1, h: 1, coverage: 1 },
  "base44.com": { w: 1, h: 1, coverage: 0.66 },
  "claude.com": { w: 1, h: 1, coverage: 1 },
  "cloud.google.com": { w: 0.98, h: 1, coverage: 0.51 },
  "credly.com": { w: 1, h: 1, coverage: 1 },
  "datacamp.com": { w: 1, h: 1, coverage: 0.9 },
  "developer.android.com": { w: 1, h: 0.56, coverage: 0.56 },
  "developer.apple.com": { w: 0.81, h: 1, coverage: 0.52 },
  "docker.com": { w: 1, h: 0.79, coverage: 0.4 },
  "dotnet.microsoft.com": { w: 1, h: 1, coverage: 1 },
  "espressif.com": { w: 1, h: 1, coverage: 1 },
  "expressjs.com": { w: 0.78, h: 0.57, coverage: 0.12 },
  "figma.com": { w: 0.67, h: 1, coverage: 0.49 },
  "firebase.google.com": { w: 0.98, h: 1, coverage: 0.51 },
  "firstinspires.org": { w: 1, h: 1, coverage: 0.92 },
  "flutter.dev": { w: 1, h: 1, coverage: 1 },
  "framer.com": { w: 1, h: 1, coverage: 1 },
  "gemini.google.com": { w: 0.98, h: 1, coverage: 0.51 },
  "git-scm.com": { w: 1, h: 1, coverage: 0.51 },
  "github.com": { w: 1, h: 0.98, coverage: 0.44 },
  "go.dev": { w: 1, h: 1, coverage: 0.99 },
  "google.com": { w: 0.98, h: 1, coverage: 0.51 },
  "hackerrank.com": { w: 0.55, h: 0.34, coverage: 0.15 },
  "instagram.com": { w: 1, h: 1, coverage: 0.96 },
  "isocpp.org": { w: 1, h: 1, coverage: 1 },
  "java.com": { w: 1, h: 1, coverage: 1 },
  "javascript.com": { w: 1, h: 1, coverage: 1 },
  "kotlinlang.org": { w: 1, h: 1, coverage: 0.75 },
  "linkedin.com": { w: 1, h: 1, coverage: 0.99 },
  "linktr.ee": { w: 1, h: 1, coverage: 0.95 },
  "lovable.dev": { w: 0.98, h: 1, coverage: 0.75 },
  "mediapipe.dev": { w: 0.93, h: 0.93, coverage: 0.67 },
  "mongodb.com": { w: 0.33, h: 0.69, coverage: 0.13 },
  "nextjs.org": { w: 0.99, h: 0.86, coverage: 0.43 },
  "nodejs.org": { w: 1, h: 1, coverage: 1 },
  "nuxt.com": { w: 1, h: 1, coverage: 1 },
  "openai.com": { w: 0.98, h: 0.99, coverage: 0.4 },
  "openexchangerates.org": { w: 0.93, h: 0.92, coverage: 0.29 },
  "opencv.org": { w: 1, h: 1, coverage: 1 },
  "php.net": { w: 1, h: 1, coverage: 0.99 },
  "postgresql.org": { w: 0.96, h: 1, coverage: 0.69 },
  "postman.com": { w: 1, h: 1, coverage: 0.79 },
  "python-pillow.org": { w: 0.84, h: 0.85, coverage: 0.49 },
  "python.org": { w: 0.96, h: 0.96, coverage: 0.6 },
  "react.dev": { w: 1, h: 0.91, coverage: 0.33 },
  "reactnative.dev": { w: 1, h: 0.87, coverage: 0.29 },
  "ruby-lang.org": { w: 1, h: 1, coverage: 0.84 },
  "rust-lang.org": { w: 0.73, h: 0.73, coverage: 0.29 },
  "stripe.com": { w: 1, h: 1, coverage: 1 },
  "supabase.com": { w: 0.59, h: 0.61, coverage: 0.15 },
  "swift.org": { w: 1, h: 1, coverage: 1 },
  "tailwindcss.com": { w: 1, h: 1, coverage: 1 },
  "typescriptlang.org": { w: 1, h: 1, coverage: 1 },
  "unity.com": { w: 0.86, h: 1, coverage: 0.48 },
  "vercel.com": { w: 1, h: 0.87, coverage: 0.44 },
  "vitejs.dev": { w: 0.96, h: 0.96, coverage: 0.45 },
  "vuejs.org": { w: 1, h: 0.86, coverage: 0.41 },
  "w3.org": { w: 1, h: 1, coverage: 0.79 },
  "x.com": { w: 1, h: 0.9, coverage: 0.34 },
  "youtube.com": { w: 1, h: 1, coverage: 1 },
};

/**
 * Scale for the mark Logo.dev serves, keyed by the brand's domain; a domain
 * that has not been measured gets the shared target span.
 */
export function logoDevOpticalScale(brand: { domain: string }): number {
  return opticalScale(REMOTE_INK[brand.domain]);
}
