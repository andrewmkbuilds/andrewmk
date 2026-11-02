import { skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * One tone per tag, cycled in order: neutral, gold, outline, blue, muted.
 * Tones are colour only — every tag keeps the same box, padding and spacing,
 * so the cloud stays an even, predictable layout at every width.
 */
const TONES = [
  "border-border bg-card/80 text-foreground",
  "border-transparent bg-gold text-gold-foreground",
  "border-border bg-secondary/70 text-foreground",
  "border-transparent bg-primary text-primary-foreground",
  "border-border bg-background/70 text-muted-foreground",
] as const;

/**
 * The published capability taxonomy as a wrapped tag cloud. Every tag is a
 * plain inline pill inside a flex-wrap list — no absolute positioning and no
 * rotation — so the badges keep their own spacing and can never overlap the
 * cards around them. Each one links to /skills, where it is grouped and
 * explained.
 */
export function SkillCloud({ className = "" }: { className?: string }) {
  const seen = new Set<string>();
  const tags: { label: string; tone: string }[] = [];

  skillGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (seen.has(item)) return;
      seen.add(item);
      tags.push({
        label: item,
        tone: TONES[tags.length % TONES.length] ?? TONES[0],
      });
    });
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/30 p-4 sm:p-6",
        className,
      )}
    >
      <ul
        aria-label="Skills and focus areas"
        className="m-0 flex list-none flex-wrap gap-2 p-0 sm:gap-2.5"
      >
        {tags.map((tag) => (
          <li key={tag.label} className="min-w-0 max-w-full">
            <a
              href="/skills"
              className={cn(
                "focus-ring inline-flex max-w-full items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium leading-none transition-colors duration-200 hover:border-gold/60 sm:text-sm",
                tag.tone,
              )}
            >
              <span className="truncate">{tag.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
