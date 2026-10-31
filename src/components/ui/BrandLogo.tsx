import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { brandFor, brandForIssuer, type Brand } from "@/data/brands";

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
  });
  return `https://img.logo.dev/${domain}?${params.toString()}`;
}

const SIZES = { xs: 12, sm: 14, md: 18, lg: 22 } as const;

interface BrandLogoProps {
  /** Name exactly as written in the content, e.g. "Python". */
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
  /**
   * Accessible name when the mark stands alone. Leave unset for decorative
   * marks that sit beside their own text label.
   */
  label?: string;
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
        className={cn("brand-mark brand-mark-img", className)}
        style={{ width: px, height: px }}
        aria-hidden={label ? undefined : true}
      />
    );
  }

  // No vendored mark and no (working) Logo.dev: let the caller keep its icon,
  // so a brand never renders as an empty gap.
  if (!brand.slug) return fallback;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      title={brand.label}
      className={cn("brand-mark", className)}
      style={{
        width: px,
        height: px,
        ["--brand-mark" as string]: `url(/brands/${brand.slug}.svg)`,
      }}
    />
  );
}
