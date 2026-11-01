import FeatureDialog from "@/components/annnimate/feature-dialog";
import { projectPlate } from "@/lib/plate";
import type { Project } from "@/data/portfolio";

/**
 * The starter pack's feature dialog, filled from one real project record.
 *
 * The tile is the project's typographic plate, the dialog carries that
 * project's own description, what it was built with and its published
 * results, and the primary action opens the full case study.
 */
export function FeatureSpotlight({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const plate = projectPlate(project.name, project.category, 1);
  const detailPlate = projectPlate(project.status, project.category, 2);

  return (
    <FeatureDialog
      className={`anm-feature ${className}`.trim()}
      label={project.category}
      title={project.name}
      tileImage={{ src: plate, alt: `${project.name} plate` }}
      sheetTitle={project.name}
      sheetText={project.fullDescription ?? project.description}
      actionLabel="Open the full case study"
      actionHref={`/projects/${project.slug}`}
      listItems={project.built.slice(0, 4)}
      mediaImages={[
        { src: plate, alt: `${project.name} plate` },
        { src: detailPlate, alt: `${project.name} status plate` },
      ]}
      stats={(project.results ?? []).slice(0, 3).map((result) => ({
        num: result.value,
        label: result.label,
      }))}
      sheetImage={{ src: detailPlate, alt: `${project.name} status plate` }}
      outro={project.status}
    />
  );
}
