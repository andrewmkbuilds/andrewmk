import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { brandFor, brandForIssuer, type Brand } from "@/data/brands";
import { logoDevOpticalScale, vendoredOpticalScale } from "@/data/brandOptics";

/**
 * A brand mark, rendered at a fixed size so a failed request can never move
 * the layout.
 *
 * Two sources, in order:
 * 1. Logo.dev (`img.logo.dev`) when `VITE_LOGO_DEV_TOKEN` is configured — the
 *    documented publishable-token URL pattern, never a third-party scrape.
 * 2. The official monochrome SVG vendored in `/public/brands`, painted with
 *    `currentColor` through a CSS mask, so one file reads correctly on both
 *    light and dark surfaces and costs no extra request.
 *
 * If the Logo.dev request fails (offline, quota, unknown domain) the component
 * falls straight back to the local mark, then to the caller's `fallback` (its
 * Lucide glyph) when the brand has no vendored mark either. Nothing shifts,
 * because the caller always reserves the same box.
 *
 * Equal boxes are not equal size: a square glyph fills its 24×24 box while a
 * flat wordmark only fills a strip of it, so both look different at the same
 * width. Every vendored mark therefore also carries an optical scale
 * (`@/data/brandOptics`) inside the same slot, which is what keeps Base44,
 * OpenAI/ChatGPT, Lovable and Claude from reading larger than their neighbours.
 */

const LOGO_DEV_TOKEN = (
  import.meta.env["VITE_LOGO_DEV_TOKEN"] as string | undefined
)?.trim();

/** True when Logo.dev can supply marks for brands with no vendored SVG. */
export const logoDevEnabled = Boolean(LOGO_DEV_TOKEN);

/** Logo.dev image URL — the pattern Logo.dev publishes for brand logos. */
function logoDevUrl(domain: string, size = 64) {
  const params = new URLSearchParams({
    token: LOGO_DEV_TOKEN ?? "",
    size: String(size),
    format: "png",
    retina: "true",
    fallback: "404",
    // The site paints on dark surfaces, so ask Logo.dev for the light-on-dark
    // variant: without it the monochrome marks (GitHub, X, Next.js, Vercel …)
    // arrive near-black and disappear into the card.
    theme: "dark",
  });
  return `https://img.logo.dev/${domain}?${params.toString()}`;
}

const SIZES = { xs: 12, sm: 14, md: 18, lg: 22 } as const;

interface BrandLogoProps {
  /** Name exactly as written in the content, e.g. "Python". */
  name: string;
  size?: keyof typeof SIZES;
  className?: string | undefined;
  /**
   * Accessible name when the mark stands alone. Leave unset for decorative
   * marks that sit beside their own text label.
   */
  label?: string | undefined;
  /** Resolve the name as a certificate issuer ("FIRST LEGO League UAE …"). */
  issuer?: boolean;
  /** Rendered when no logo source can serve this brand. */
  fallback?: ReactNode;
}

export function BrandLogo({
  name,
  size = "sm",
  className,
  label,
  issuer,
  fallback = null,
}: BrandLogoProps) {
  const brand: Brand | undefined = issuer
    ? brandForIssuer(name)
    : brandFor(name);
  const [remoteFailed, setRemoteFailed] = useState(false);
  const px = SIZES[size];
  if (!brand) return fallback;

  /** One slot for every brand: identical box, artwork balanced inside it. */
  const slot: CSSProperties = {
    width: px,
    height: px,
    ["--brand-scale" as string]: vendoredOpticalScale(brand),
    // Keeps `object-fit: contain` artwork centred in the slot, whatever its
    // aspect ratio and internal margins are.
    objectFit: "contain",
    objectPosition: "center",
  };

  if (logoDevEnabled && !remoteFailed) {
    return (
      <img
        src={logoDevUrl(brand.domain, px * 3)}
        width={px}
        height={px}
        alt={label ?? ""}
        title={brand.label}
        loading="lazy"
        decoding="async"
        onError={() => setRemoteFailed(true)}
        // `brand-mark` paints a plate behind a mask; a real image must not
        // receive it, or the pill shows a solid block around the logo.
        className={cn("brand-mark-img", className)}
        style={{
          width: px,
          height: px,
          ["--brand-scale" as string]: logoDevOpticalScale(brand),
        }}
        aria-hidden={label ? undefined : true}
      />
    );
  }

  // No vendored vector: fall back to the brand's own published icon (Base44)
  // before giving up on a real mark.
  if (!brand.slug) {
    if (!brand.image) return fallback;
    return (
      <img
        src={brand.image}
        width={px}
        height={px}
        alt={label ?? ""}
        title={brand.label}
        loading="lazy"
        decoding="async"
        className={cn("brand-mark-img", className)}
        style={slot}
        aria-hidden={label ? undefined : true}
      />
    );
  }

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      title={brand.label}
      className={cn("brand-mark", className)}
      style={{
        ...slot,
        ["--brand-mark" as string]: `url(/brands/${brand.slug}.svg)`,
      }}
    />
  );
}
