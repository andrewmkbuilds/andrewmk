/**
 * Optical sizing for brand marks — the single rule every logo on the site
 * follows.
 *
 * `BrandLogo` renders every mark in one fixed slot (see `SIZES`), with the
 * artwork `contain`-fitted and centred. That alone is not enough: equal boxes
 * are not equal size. The 24×24 Simple Icons canvases carry wildly different
 * amounts of ink — JavaScript fills 87% of its canvas while Java fills 16% —
 * so at one shared scale a solid mark reads much larger than an outline one.
 * A whole-canvas glyph (Base44, OpenAI/ChatGPT, Claude, Lovable) fills its slot
 * edge to edge while a flat mark such as Tailwind's wave leaves 40% of the
 * height empty.
 *
 * The table below is the *measurement* that fixes it: for every vendored file
 * in `/public/brands` it records the ink bounding box (`w`/`h`, as a fraction
 * of the canvas) and the painted coverage (`coverage`, a stroke-weight proxy).
 * Measured by rasterising each file at 240×240 and taking the alpha bounds;
 * the PNG is measured the same way. Re-measure a brand only when its artwork
 * actually changes.
 *
 * One formula then balances every mark, so a new logo needs its measurements
 * added here (or gets the shared default) and nothing else:
 *
 *   density = clamp((0.34 / coverage) ^ 0.3, 0.94, 1)
 *                                              → a solid/full-bleed mark
 *                                                (Claude, Base44, Lovable,
 *                                                TypeScript …) is trimmed just
 *                                                enough, because a filled square
 *                                                reads heavier than a glyph of
 *                                                the same width
 *   span    = 0.63 × density                   → the ink's long side, as a
 *                                                fraction of the fixed slot
 *   scale   = min(span / max(inkW, inkH), 1)   → applied inside that slot
 *
 * So every mark's visible artwork lands in 0.59–0.63 of its slot — one shared
 * optical size, measured per mark rather than assumed from its CSS box. The
 * band used to run 0.62–0.8, which let the airiest artwork (GitHub, OpenAI,
 * Rust, React) render up to 20 % larger than its neighbours on the same pill.
 * Nothing is ever enlarged beyond its own slot.
 */

/** Ink bounding box and painted coverage, as fractions of the mark's canvas. */
export interface InkMetrics {
  /** Ink width as a fraction of the canvas width. */
  w: number;
  /** Ink height as a fraction of the canvas height. */
  h: number;
  /** Painted fraction of the canvas; stands in for stroke weight. */
  coverage: number;
}

/**
 * Ink span (long side) every mark is balanced to, as a fraction of its slot.
 * Measured against the rendered ribbon: the marks that already read correctly
 * sit at ~0.63, so that is the shared size.
 */
const TARGET_SPAN = 0.63;
/** Painted coverage treated as "normal weight" artwork. */
const TARGET_COVERAGE = 0.34;
/**
 * How strongly density trims a mark, and how far it may pull. A narrow range:
 * coverage decides only the last few percent, because the rendered artwork is
 * normalised to one span — a solid tile must not end up a different size from
 * the glyph beside it.
 */
const DENSITY_EXPONENT = 0.3;
const DENSITY_MIN = 0.94;
/** Hard ceiling: a mark is never enlarged past its own slot. */
const SCALE_MAX = 1;

/**
 * Measured ink metrics for the vendored marks (`/public/brands/<slug>.svg`),
 * keyed by file name. Every file in that directory is listed, including the
 * Base44 PNG, so no mark on the site is left unmeasured.
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
  const density = clamp(
    (TARGET_COVERAGE / Math.max(ink.coverage, 0.001)) ** DENSITY_EXPONENT,
    DENSITY_MIN,
    1,
  );
  const span = TARGET_SPAN * density;
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
 * domain. Logo.dev does not crop consistently: some marks arrive as a glyph on
 * transparency (GitHub, OpenAI, Next.js) and others as an opaque full-canvas
 * brand tile (Claude, Base44, TypeScript, Tailwind), while a few keep internal
 * padding (Rust fills 74% of its canvas). Measured the same way as the vendored
 * table, at `?size=128&retina=true&theme=dark`, for every domain the registry
 * can request.
 */
const REMOTE_INK: Record<string, InkMetrics> = {
  "anthropic.com": { w: 1, h: 1, coverage: 1 },
  "arduino.cc": { w: 1, h: 1, coverage: 1 },
  "base44.com": { w: 1, h: 1, coverage: 0.668 },
  "claude.com": { w: 1, h: 1, coverage: 1 },
  "cloud.google.com": { w: 0.98, h: 1, coverage: 0.52 },
  "credly.com": { w: 1, h: 1, coverage: 1 },
  "datacamp.com": { w: 1, h: 1, coverage: 1 },
  "developer.android.com": { w: 1, h: 0.56, coverage: 0.56 },
  "developer.apple.com": { w: 0.81, h: 1, coverage: 0.53 },
  "docker.com": { w: 1, h: 0.8, coverage: 0.41 },
  "dotnet.microsoft.com": { w: 1, h: 1, coverage: 1 },
  "espressif.com": { w: 1, h: 1, coverage: 1 },
  "expressjs.com": { w: 1, h: 1, coverage: 1 },
  "figma.com": { w: 0.68, h: 1, coverage: 0.5 },
  "firebase.google.com": { w: 0.98, h: 1, coverage: 0.52 },
  "firstinspires.org": { w: 1, h: 1, coverage: 1 },
  "flutter.dev": { w: 1, h: 1, coverage: 1 },
  "framer.com": { w: 1, h: 1, coverage: 1 },
  "gemini.google.com": { w: 0.98, h: 1, coverage: 0.52 },
  "git-scm.com": { w: 1, h: 1, coverage: 0.52 },
  "github.com": { w: 1, h: 0.98, coverage: 0.45 },
  "go.dev": { w: 1, h: 1, coverage: 1 },
  "google.com": { w: 0.98, h: 1, coverage: 0.52 },
  "hackerrank.com": { w: 1, h: 1, coverage: 1 },
  "instagram.com": { w: 1, h: 1, coverage: 0.96 },
  "isocpp.org": { w: 1, h: 1, coverage: 1 },
  "java.com": { w: 1, h: 1, coverage: 1 },
  "javascript.com": { w: 1, h: 1, coverage: 1 },
  "kotlinlang.org": { w: 1, h: 1, coverage: 0.75 },
  "linkedin.com": { w: 1, h: 1, coverage: 0.99 },
  "linktr.ee": { w: 1, h: 1, coverage: 0.96 },
  "lovable.dev": { w: 1, h: 1, coverage: 0.764 },
  "mediapipe.dev": { w: 0.93, h: 0.93, coverage: 0.67 },
  "mongodb.com": { w: 1, h: 1, coverage: 1 },
  "nextjs.org": { w: 0.99, h: 0.86, coverage: 0.44 },
  "nodejs.org": { w: 1, h: 1, coverage: 1 },
  "nuxt.com": { w: 1, h: 1, coverage: 1 },
  "openai.com": { w: 0.99, h: 1, coverage: 0.437 },
  "openexchangerates.org": { w: 1, h: 1, coverage: 1 },
  "opencv.org": { w: 1, h: 1, coverage: 1 },
  "php.net": { w: 1, h: 1, coverage: 1 },
  "postgresql.org": { w: 0.98, h: 1, coverage: 0.72 },
  "postman.com": { w: 1, h: 1, coverage: 0.8 },
  "python-pillow.org": { w: 0.833, h: 0.958, coverage: 0.522 },
  "python.org": { w: 0.98, h: 0.98, coverage: 0.647 },
  "react.dev": { w: 1, h: 0.92, coverage: 0.36 },
  "reactnative.dev": { w: 1, h: 0.88, coverage: 0.32 },
  "ruby-lang.org": { w: 1, h: 1, coverage: 0.85 },
  "rust-lang.org": { w: 0.74, h: 0.74, coverage: 0.31 },
  "stripe.com": { w: 1, h: 1, coverage: 1 },
  "supabase.com": { w: 1, h: 1, coverage: 1 },
  "swift.org": { w: 1, h: 1, coverage: 1 },
  "tailwindcss.com": { w: 1, h: 1, coverage: 1 },
  "typescriptlang.org": { w: 1, h: 1, coverage: 1 },
  "unity.com": { w: 0.86, h: 1, coverage: 0.5 },
  "vercel.com": { w: 1, h: 0.86, coverage: 0.44 },
  "vitejs.dev": { w: 0.96, h: 0.96, coverage: 0.45 },
  "vuejs.org": { w: 1, h: 0.86, coverage: 0.42 },
  "w3.org": { w: 1, h: 1, coverage: 0.8 },
  "x.com": { w: 0.99, h: 0.92, coverage: 0.36 },
  "youtube.com": { w: 1, h: 1, coverage: 1 },
};

/**
 * Scale for the mark Logo.dev serves, keyed by the brand's domain; a domain
 * that has not been measured gets the shared target span.
 */
export function logoDevOpticalScale(brand: { domain: string }): number {
  return opticalScale(REMOTE_INK[brand.domain]);
}
