import CurtainSlider from "@/components/annnimate/curtain-slider";
import { featuredProjects } from "@/data/portfolio";

/**
 * The starter pack's curtain slider, filled with the portfolio's four featured
 * records. Each slide is the project's own screenshot — the same asset every
 * other surface renders through `ui/ProjectShot.tsx`.
 */
export function PortfolioCurtain({ className = "" }: { className?: string }) {
  const slides = featuredProjects.map((project) => ({
    src: project.screenshot,
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
