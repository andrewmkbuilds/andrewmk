import { cn } from "@/lib/utils";
import { TechBadge } from "./Badges";

interface TechTagProps {
  children: string;
  className?: string;
}

/**
 * Technology tag used across project cards, case studies and the hero collage.
 * Renders the shared technology badge, so every tag on the site carries its
 * own icon and the same hover behaviour from one place.
 */
export function TechTag({ children, className }: TechTagProps) {
  return <TechBadge name={children} size="sm" className={cn(className)} />;
}
