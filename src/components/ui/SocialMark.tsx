import {
  AtSign,
  Github,
  Heart,
  Hexagon,
  Instagram,
  Linkedin,
  Share2,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";

/**
 * Social ids as `socialLinks` writes them → brand names in `@/data/brands`.
 *
 * Every platform Andrew actually links to is rendered as its official mark
 * (Logo.dev when a token is configured, the vendored vector otherwise) — never
 * as a Lucide stand-in. The glyphs below are only the last resort for an id
 * that has no official mark at all, so a link never renders as an empty gap.
 */
const SOCIAL_BRANDS: Record<string, string> = {
  github: "GitHub",
  base44: "Base44",
  lovable: "Lovable",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  linktree: "Linktree",
};

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  x: AtSign,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  lovable: Heart,
  linktree: Share2,
};

interface SocialMarkProps {
  /** Social id, e.g. "github", "x", "base44". */
  id: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Accessible name when the mark stands alone. */
  label?: string;
}

/** One social platform's official brand mark, at a fixed size. */
export function SocialMark({
  id,
  size = "md",
  className,
  label,
}: SocialMarkProps) {
  const name = SOCIAL_BRANDS[id];
  const Fallback = FALLBACK_ICONS[id] ?? Hexagon;

  if (!name) {
    return <Fallback aria-hidden="true" className={cn("h-4 w-4", className)} />;
  }

  return (
    <BrandLogo
      name={name}
      size={size}
      className={className}
      label={label}
      fallback={
        <Fallback aria-hidden="true" className={cn("h-4 w-4", className)} />
      }
    />
  );
}
