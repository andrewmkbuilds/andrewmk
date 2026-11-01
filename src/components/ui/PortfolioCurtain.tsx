import CurtainSlider from "@/components/annnimate/curtain-slider";
import { featuredProjects } from "@/data/portfolio";
import { projectPlate } from "@/lib/plate";

/**
 * The starter pack's curtain slider, filled with the portfolio's four featured
 * records. Each slide is the project's own screenshot when the record publishes
 * one (`Project.screenshot`, the same asset every other surface uses), and the
 * typographic plate generated from the record (see `lib/plate.ts`) when it does
 * not.
 */
export function PortfolioCurtain({ className = "" }: { className?: string }) {
  const slides = featuredProjects.map((project, index) => ({
    src:
      project.screenshot ??
      projectPlate(project.name, project.category, index + 1),
    alt: project.imageAlt ?? `${project.name} — ${project.category}`,
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
