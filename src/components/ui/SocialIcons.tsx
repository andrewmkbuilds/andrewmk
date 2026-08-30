import { Github, Instagram, Twitter, Heart, Hexagon, Share2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/portfolio";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const socialIconMap: Record<string, LucideIcon> = {
  github: Github,
  x: Twitter,
  instagram: Instagram,
  lovable: Heart,
  base44: Hexagon,
  linktree: Share2,
};

/** Safe lookup — falls back to a generic mark for unknown ids. */
export function getSocialIcon(id: string): LucideIcon {
  return socialIconMap[id] ?? Hexagon;
}

interface SocialIconsProps {
  /** Which social ids to show, in order. Defaults to all. */
  ids?: string[];
  className?: string;
}

/** Compact social icon row with tooltips. All links open in a new tab. */
export function SocialIcons({ ids, className }: SocialIconsProps) {
  const links = ids ? ids.map((id) => socialLinks.find((s) => s.id === id)!).filter(Boolean) : socialLinks;

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("flex items-center gap-2", className)}>
        {links.map((link) => {
          const Icon = getSocialIcon(link.id);
          return (
            <Tooltip key={link.id}>
              <TooltipTrigger asChild>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} profile (${link.handle})`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-ring motion-reduce:hover:translate-y-0"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>{link.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
