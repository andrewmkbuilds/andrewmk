import {
  ecosystemProjects,
  featuredProjects,
  type Project,
} from "@/data/portfolio";

/**
 * The words on the ambient wall behind every page: **project names only**.
 *
 * The wall is a quiet echo of the portfolio itself — "here is what I built" —
 * so it never lists languages, frameworks or generic technical words. Every
 * name comes from `src/data/portfolio.ts`; nothing is invented here.
 *
 * Selection is derived from the records, not from a second hand-kept list, so
 * adding a project to the portfolio is enough for it to be considered:
 *
 * - the featured flagships come first, in the order the portfolio publishes
 *   them (`featuredProjects`);
 * - the ecosystem records are then ranked by the evidence a record actually
 *   carries — measured metrics, a vendored screenshot, published results, a
 *   walkthrough, a live URL — so a thin stub record stays off the wall until
 *   it has substance;
 * - the list is capped (`MAX_SCENE_PROJECTS`) rather than showing every
 *   project at once: the wall should read as a curated identity, not a
 *   directory. A new record enters on its own once it outranks the current
 *   tail.
 */
export type SceneProject = {
  slug: string;
  name: string;
};

const MAX_SCENE_PROJECTS = 10;

/** How much published work backs a record. Ordering only — never copy. */
function evidence(project: Project): number {
  return (
    (project.metrics ? 26 : 0) +
    (project.screenshot ? 22 : 0) +
    (project.results?.length ? 12 : 0) +
    (project.gallery?.length ? 10 : 0) +
    (project.challenges?.length ? 6 : 0) +
    (project.live ? 8 : 0) +
    (project.fullDescription ? 4 : 0)
  );
}

const ranked = ecosystemProjects
  .map((project, index) => ({ project, index, weight: evidence(project) }))
  .sort((a, b) => b.weight - a.weight || a.index - b.index)
  .map(({ project }) => project);

export const SCENE_PROJECTS: SceneProject[] = [...featuredProjects, ...ranked]
  .slice(0, MAX_SCENE_PROJECTS)
  .map((project) => ({ slug: project.slug, name: project.name }));
