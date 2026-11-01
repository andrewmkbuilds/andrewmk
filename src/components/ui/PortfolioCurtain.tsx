import CurtainSlider from "@/components/annnimate/curtain-slider";
import { featuredProjects } from "@/data/portfolio";
import { projectPlate } from "@/lib/plate";

/**
 * The starter pack's curtain slider, filled with the portfolio's four featured
 * records. The portfolio publishes no product screenshots, so each slide is a
 * typographic plate generated from the project itself (see `lib/plate.ts`).
 */
export function PortfolioCurtain({ className = "" }: { className?: string }) {
  const slides = featuredProjects.map((project, index) => ({
    src: projectPlate(project.name, project.category, index + 1),
    alt: `${project.name} — ${project.category}`,
    title: project.name,
    label: project.category,
  }));

  return (
    <CurtainSlider
      className={`anm-curtain ${className}`.trim()}
      images={slides}
      columns={10}
      duration={1}
      auto={0}
      drag
    />
  );
}
