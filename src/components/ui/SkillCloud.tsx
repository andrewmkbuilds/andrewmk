import MagneticTagCloud from "@/components/annnimate/magnetic-tag-cloud";
import { skillGroups } from "@/data/portfolio";

const TONES = ["white", "signal", "white", "cobalt", "stone", "white"] as const;

/**
 * The starter pack's magnetic tag cloud, filled with every capability the
 * skills taxonomy publishes. Tags carry the pack's pointer physics (they are
 * knocked outward and pulled home); each one links to the Skills page where
 * the capability is grouped and explained.
 */
export function SkillCloud({ className = "" }: { className?: string }) {
  const seen = new Set<string>();
  const tags: { label: string; href: string; color: string }[] = [];

  skillGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (seen.has(item)) return;
      seen.add(item);
      tags.push({
        label: item,
        href: "/skills",
        color: TONES[tags.length % TONES.length] ?? "white",
      });
    });
  });

  return (
    <div className={className}>
      <MagneticTagCloud
        className="anm-cloud"
        tags={tags.slice(0, 32)}
        maxRows={4}
        hoverRadius={86}
        repelRadius={104}
        stiffness={190}
        /* Phones get the same tags as a static, wrapping row: the physics
           would fight vertical scrolling under a thumb. */
        disable="mobile"
      />
    </div>
  );
}
