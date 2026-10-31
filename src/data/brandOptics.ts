/**
 * Optical scale for brand marks.
 *
 * Every mark renders in the same fixed slot, but equal boxes are not equal
 * size: a square glyph fills its artwork while a wordmark or a flat shape only
 * fills a strip of it. `mask-size: contain` / `object-fit: contain` give both
 * the same *width*, which is why the square marks (Claude, OpenAI/ChatGPT,
 * Lovable, Base44) used to read visibly larger than their neighbours.
 *
 * Each factor below was measured from the artwork that actually renders (the
 * alpha bounds of the file), then normalised towards one target ink area:
 *
 *   scale = clamp(sqrt(0.86 / (inkWidth × inkHeight)), 0.86, 1.15)
 *
 * `BrandLogo` applies the factor as the `scale` property inside the fixed slot,
 * so the container never changes and only the artwork inside it is balanced.
 * Nothing is enlarged past 1.15, so no mark can overflow its slot.
 *
 * Two tables because the two sources ship different artwork:
 * - `VENDORED_SCALE` — the monochrome SVGs in `/public/brands` (used when
 *   Logo.dev is not configured or a request fails), measured per file.
 * - `LOGO_DEV_SCALE` — Logo.dev crops every mark to its own bounds, so almost
 *   all of them arrive as a full-canvas square and share one inset; only the
 *   marks it crops flatter or narrower are listed. Measurements taken
 *   2026-10-31; re-measure if Logo.dev changes a mark.
 */
const VENDORED_SCALE: Record<string, number> = {
  androidstudio: 1.02,
  anthropic: 1.1,
  arduino: 1.15,
  claude: 0.93,
  cplusplus: 0.98,
  credly: 1.15,
  css: 0.93,
  datacamp: 1.06,
  docker: 1.09,
  espressif: 0.93,
  figma: 1.1,
  firebase: 1.03,
  first: 1.07,
  flutter: 1.03,
  framer: 1.14,
  git: 0.93,
  github: 0.94,
  go: 1.15,
  google: 0.94,
  googlecloud: 1.03,
  googlegemini: 0.95,
  hackerrank: 0.93,
  html5: 0.99,
  instagram: 0.93,
  java: 1.03,
  javascript: 0.93,
  kotlin: 0.93,
  linktree: 1.02,
  lovable: 0.93,
  mediapipe: 0.93,
  mongodb: 1.15,
  nextdotjs: 0.93,
  nodedotjs: 0.98,
  openai: 0.93,
  opencv: 0.96,
  postgresql: 0.94,
  postman: 0.93,
  python: 0.93,
  react: 0.98,
  rust: 0.93,
  stripe: 1.09,
  supabase: 0.94,
  swift: 0.93,
  tailwindcss: 1.15,
  typescript: 0.93,
  unity: 0.98,
  vercel: 0.99,
  vite: 0.95,
  vue: 0.99,
  x: 0.94,
  xcode: 0.93,
  youtube: 1.1,
  // Full-colour raster (the brand publishes no monochrome vector): colour
  // reads heavier than ink at the same size, so it sits below the square inset.
  base44: 0.88,
};

/** Logo.dev already crops to the mark, so one inset covers nearly all brands. */
const LOGO_DEV_DEFAULT = 0.93;

const LOGO_DEV_SCALE: Record<string, number> = {
  "developer.android.com": 1.15,
  "rust-lang.org": 1.15,
  "figma.com": 1.13,
  "docker.com": 1.04,
  "developer.apple.com": 1.03,
  "python-pillow.org": 1.03,
  "nextjs.org": 1.01,
  "mediapipe.dev": 1,
  "unity.com": 1,
  // Colour mark: reads heavier than the monochrome marks around it.
  "base44.com": 0.88,
};

/** Scale for the vendored monochrome SVG (keyed by its file name). */
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
  return (key && VENDORED_SCALE[key]) || 1;
}

/** Scale for the mark Logo.dev serves (keyed by the brand's domain). */
export function logoDevOpticalScale(brand: { domain: string }): number {
  return LOGO_DEV_SCALE[brand.domain] ?? LOGO_DEV_DEFAULT;
}
