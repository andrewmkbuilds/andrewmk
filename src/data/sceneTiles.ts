import { allProjects } from "@/data/portfolio";

/**
 * The words on the ambient wall behind every page: **project names only**.
 *
 * The wall is a quiet echo of the portfolio itself — "here is what I built" —
 * so it never lists languages, frameworks or generic technical words. Every
 * name comes from `src/data/portfolio.ts`; nothing is invented here.
 *
 * The pool is the **whole** portfolio, deduplicated by slug — not a hand-kept
 * shortlist and not a ranked top ten. `lib/scene-selection.ts` draws a fresh
 * sample from it on every page load, so the wall is a different slice of the
 * work each visit; adding a record to `portfolio.ts` is enough to put it in
 * the draw. `sceneLane` groups records by the first segment of their own
 * `category` so one draw can span the portfolio's kinds (products, AI tools,
 * utilities, experiments) instead of clustering on the same few flagships.
 */
export type SceneProject = {
  slug: string;
  name: string;
  category: string;
};

const bySlug = new Map<string, SceneProject>();

for (const project of allProjects) {
  if (!project.slug || !project.name || bySlug.has(project.slug)) continue;
  bySlug.set(project.slug, {
    slug: project.slug,
    name: project.name,
    category: project.category,
  });
}

/** Every project on the site, in portfolio order. */
export const SCENE_PROJECT_POOL: SceneProject[] = [...bySlug.values()];

/**
 * The record's own leading category word — "Career Technology" from
 * "Career Technology · AI", "Education" from "Education / AI". Only ever used
 * to spread a draw across categories; nothing branches on a specific lane.
 */
export function sceneLane(project: { category: string }): string {
  const first = project.category.split(/[·/]/)[0] ?? "";
  return first.trim().toLowerCase() || "other";
}
