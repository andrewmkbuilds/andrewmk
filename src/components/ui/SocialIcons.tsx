import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/portfolio";
import { SocialMark } from "./SocialMark";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialIconsProps {
  /** Which social ids to show, in order. Defaults to all. */
  ids?: string[];
  className?: string;
}

/** Compact social icon row with tooltips. All links open in a new tab. */
export function SocialIcons({ ids, className }: SocialIconsProps) {
  const links = ids
    ? ids.map((id) => socialLinks.find((s) => s.id === id)!).filter(Boolean)
    : socialLinks;

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("flex items-center gap-2", className)}>
        {links.map((link) => (
          <Tooltip key={link.id}>
            <TooltipTrigger asChild>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} profile (${link.handle})`}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold focus-ring motion-reduce:hover:translate-y-0"
              >
                <SocialMark
                  id={link.id}
                  size="md"
                  className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                />
              </a>
            </TooltipTrigger>
            <TooltipContent>{link.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
