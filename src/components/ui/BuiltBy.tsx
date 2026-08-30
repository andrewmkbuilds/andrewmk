import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks, type Project } from "@/data/portfolio";
import { getSocialIcon } from "@/components/ui/SocialIcons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BuiltByProps {
  project: Project;
  className?: string;
  /** Show the "Built by Andrew" label alongside the links. */
  showLabel?: boolean;
}

interface Entry {
  key: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getEntries(project: Project): Entry[] {
  const entries: Entry[] = [];

  if (project.github) {
    entries.push({
      key: "github",
      href: project.github,
      label: `${project.name} on GitHub`,
      icon: getSocialIcon("github"),
    });
  }
  if (project.live) {
    entries.push({
      key: "live",
      href: project.live,
      label: `${project.name} live app`,
      icon: ExternalLink,
    });
  }
  // Platform profile only when the project was actually built on that platform.
  if (project.platform) {
    const social = socialLinks.find((s) => s.id === project.platform);
    if (social) {
      entries.push({
        key: social.id,
        href: social.url,
        label: `Built with ${social.label} — ${social.handle}`,
        icon: getSocialIcon(social.id),
      });
    }
  }

  return entries;
}

/** Subtle "Built with Base44/Lovable" badge linking to Andrew's profile on that platform. */
export function PlatformBadge({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.platform) return null;
  const social = socialLinks.find((s) => s.id === project.platform);
  if (!social) return null;
  const Icon = getSocialIcon(social.id);

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — built with ${social.label}, view Andrew's ${social.label} profile (opens in a new tab)`}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary transition-colors hover:border-primary/60 hover:bg-primary/15 focus-ring",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      Built with {social.label}
    </a>
  );
}

/** Platform options derived from the "Built by Andrew" attribution. */
export const platformFilters = ["All", "GitHub", "Lovable", "Base44"];

/** Platforms a project is actually attributed to, matching the BuiltBy links. */
export function getProjectPlatforms(project: Project): string[] {
  const labels: Record<string, string> = { github: "GitHub", lovable: "Lovable", base44: "Base44" };
  return getEntries(project)
    .map((entry) => labels[entry.key])
    .filter((label): label is string => Boolean(label));
}

/** Small "Built by Andrew" attribution row with only the links relevant to a project. */
export function BuiltBy({ project, className, showLabel = false }: BuiltByProps) {
  const entries = getEntries(project);
  if (entries.length === 0) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("flex items-center gap-1.5", className)}>
        {showLabel && (
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Built by Andrew
          </span>
        )}
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <Tooltip key={entry.key}>
              <TooltipTrigger asChild>
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${entry.label} (opens in a new tab)`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-ring"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>{entry.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
