import ProcessRail from "@/components/annnimate/process-rail";
import { buildAreas } from "@/data/portfolio";
import { projectPlate } from "@/lib/plate";

/**
 * The starter pack's process rail, fed by the four build disciplines the site
 * already publishes. No stock photography: each step's media is the same
 * typographic plate the rest of the site uses.
 */
export function PortfolioRail({ className = "" }: { className?: string }) {
  const steps = buildAreas.slice(0, 4).map((area, index) => ({
    num: String(index + 1).padStart(2, "0"),
    title: area.title,
    text: area.description,
    image: projectPlate(area.title, "Discipline", index + 1),
    alt: `${area.title} plate`,
  }));

  return (
    <ProcessRail
      className={`anm-rail ${className}`.trim()}
      steps={steps}
      sticky={false}
      scrub={0.5}
    />
  );
}
