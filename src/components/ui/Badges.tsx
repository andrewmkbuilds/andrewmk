import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Briefcase,
  CircleDot,
  CircleCheck,
  Construction,
  FlaskConical,
  Lightbulb,
  Radio,
  Sparkles,
  Tag,
  Target,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { BrandLogo } from "./BrandLogo";
import { techIcon } from "./tech-icons";

/**
 * Semantic badges. Every category has its own icon, shape and interaction;
 * the shared parts (icon micro-motion, hover lift, border highlight) live in
 * `styles.css` so they stay consistent across the site.
 */

interface BaseProps {
  className?: string;
  size?: "sm" | "md";
}

function Glyph({ icon: Icon, spin }: { icon: LucideIcon; spin?: boolean }) {
  return (
    <Icon
      aria-hidden="true"
      className={cn("badge-icon", spin && "badge-icon-spin")}
    />
  );
}

/** Technology chip — squared mono chip with the technology's own icon. */
export function TechBadge({
  name,
  className,
  size,
}: BaseProps & { name: string }) {
  const Icon = techIcon(name);
  return (
    <Badge tone="tech" size={size} className={className}>
      <BrandLogo
        name={name}
        size={size === "sm" ? "xs" : "sm"}
        className="badge-brand"
        fallback={<Glyph icon={Icon} />}
      />
      <span className="badge-label">{name}</span>
    </Badge>
  );
}

type StatusKind =
  "live" | "building" | "built" | "concept" | "experiment" | "active";

/** Honest project status: only a genuinely live project pulses. */
export function statusKind(status: string): StatusKind {
  const s = status.toLowerCase();
  if (s.includes("live") || s.includes("deployed") || s.includes("shipped"))
    return "live";
  if (s.includes("build") || s.includes("develop")) return "building";
  if (s.includes("built") || s.includes("complete") || s.includes("done"))
    return "built";
  if (s.includes("concept") || s.includes("idea")) return "concept";
  if (s.includes("experiment")) return "experiment";
  return "active";
}

const statusIcons: Record<StatusKind, LucideIcon> = {
  live: Radio,
  building: Construction,
  built: CircleCheck,
  concept: Lightbulb,
  experiment: FlaskConical,
  active: CircleDot,
};

export function StatusBadge({
  status,
  className,
  size,
}: BaseProps & { status: string }) {
  const kind = statusKind(status);
  return (
    <Badge
      tone={kind === "live" ? "live" : "status"}
      size={size}
      className={cn(`badge-status-${kind}`, className)}
    >
      {kind === "live" ? (
        <span className="badge-pulse" aria-hidden="true" />
      ) : (
        <Glyph icon={statusIcons[kind]} spin={kind === "building"} />
      )}
      <span className="badge-label">{status}</span>
    </Badge>
  );
}

/** Achievement — gold award badge with a slow highlight sweep. */
export function AchievementBadge({
  label,
  className,
  size,
}: BaseProps & { label: string }) {
  return (
    <Badge tone="achievement" size={size} className={className}>
      <Glyph icon={Award} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** Certification — verified check with a hairline seal. */
export function CertificationBadge({
  label,
  className,
  size,
}: BaseProps & { label: string }) {
  return (
    <Badge tone="certification" size={size} className={className}>
      <Glyph icon={BadgeCheck} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** Skill — tool mark; a soft ring reads as a proficiency marker. */
export function SkillBadge({
  label,
  icon: Icon = Wrench,
  className,
  size,
}: BaseProps & { label: string; icon?: LucideIcon }) {
  return (
    <Badge tone="skill" size={size} className={className}>
      <BrandLogo
        name={label}
        size={size === "sm" ? "xs" : "sm"}
        className="badge-brand"
        fallback={<Glyph icon={Icon} />}
      />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** Role and discipline — the hero's "who I am" stickers. */
export function RoleBadge({
  label,
  icon: Icon = Briefcase,
  className,
  size,
}: BaseProps & { label: string; icon?: LucideIcon }) {
  return (
    <Badge tone="role" size={size} className={className}>
      <Glyph icon={Icon} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** Category — index mark used beside project names. */
export function CategoryBadge({
  label,
  className,
  size,
}: BaseProps & { label: string }) {
  return (
    <Badge tone="category" size={size} className={className}>
      <Glyph icon={Tag} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** External destination — the arrow travels on hover. */
export function ExternalBadge({
  label,
  href,
  className,
  size,
  ariaLabel,
}: BaseProps & { label: string; href: string; ariaLabel?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={ariaLabel ?? `${label} (opens in a new tab)`}
      className="focus-ring rounded-full"
    >
      <Badge
        tone="external"
        size={size}
        className={cn("badge-link", className)}
      >
        <span className="badge-label">{label}</span>
        <ArrowUpRight aria-hidden="true" className="badge-icon badge-arrow" />
      </Badge>
    </a>
  );
}

/** Featured — the one badge allowed a resting shimmer, kept very quiet. */
export function FeaturedBadge({
  label = "Featured",
  className,
  size,
}: BaseProps & { label?: string }) {
  return (
    <Badge tone="featured" size={size} className={className}>
      <Glyph icon={Sparkles} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}

/** Focus-area / principle marker with a target icon. */
export function FocusBadge({
  label,
  className,
  size,
}: BaseProps & { label: string }) {
  return (
    <Badge tone="skill" size={size} className={className}>
      <Glyph icon={Target} />
      <span className="badge-label">{label}</span>
    </Badge>
  );
}
