import {
  SCENE_PROJECT_POOL,
  sceneLane,
  type SceneProject,
} from "@/data/sceneTiles";

/**
 * Which projects the ambient wall shows on **this** page load.
 *
 * Called once, from a mount effect in `ui/background/SceneBackground.tsx`: the
 * result lives in component state, so React re-renders never reshuffle it and
 * a client-side route change keeps the same wall. A fresh document load draws
 * again — the wall is a different slice of the portfolio each visit.
 *
 * The only thing remembered across loads is the previous draw's signature, in
 * `sessionStorage` (per tab, never a permanent selection): if the new draw
 * happens to match it exactly, it is redrawn, and as a last resort one project
 * is swapped so two consecutive loads can never show the same wall.
 */

/**
 * Projects per wall. Comfortably above one row's tile count, so a row's names
 * are always distinct and the wall does not read as a four-name loop.
 */
export const SCENE_PROJECT_COUNT = 12;

const STORAGE_KEY = "ambient-wall:selection";

function shuffle<T>(list: readonly T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = current;
  }
  return copy;
}

/** Order-independent, so two draws with the same names count as a repeat. */
function signature(projects: readonly SceneProject[]): string {
  return projects
    .map((project) => project.slug)
    .sort()
    .join("|");
}

function readPrevious(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function remember(value: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    // private mode / blocked storage: the draw still works, just unremembered
  }
}

/**
 * One draw: shuffle the pool into per-category lanes, then take from each lane
 * in turn. Every project can appear, no project appears twice, and the sample
 * spreads across categories rather than filling up with four flagships.
 */
function sample(count: number): SceneProject[] {
  const lanes = new Map<string, SceneProject[]>();
  for (const project of SCENE_PROJECT_POOL) {
    const lane = sceneLane(project);
    const bucket = lanes.get(lane);
    if (bucket) bucket.push(project);
    else lanes.set(lane, [project]);
  }

  const buckets = shuffle([...lanes.values()].map(shuffle));
  const picked: SceneProject[] = [];

  for (let round = 0; picked.length < count; round += 1) {
    let added = false;
    for (const bucket of buckets) {
      if (picked.length >= count) break;
      const project = bucket[round];
      if (!project) continue;
      picked.push(project);
      added = true;
    }
    if (!added) break;
  }

  return shuffle(picked);
}

/**
 * The draw for this document.
 *
 * `Layout` — and with it the scene — remounts on every client-side route
 * change, so a bare draw would reshuffle the wall and rebuild every tile on
 * each navigation. The sample is therefore taken once per page load and reused
 * for the rest of the document's life; a genuine reload draws again.
 */
let documentDraw: { count: number; projects: SceneProject[] } | null = null;

export function chooseSceneProjects(
  count: number = SCENE_PROJECT_COUNT,
): SceneProject[] {
  if (documentDraw && documentDraw.count === count) {
    return documentDraw.projects;
  }

  const target = Math.max(1, Math.min(count, SCENE_PROJECT_POOL.length));
  const previous = readPrevious();

  let picked = sample(target);

  for (let attempt = 0; attempt < 4; attempt += 1) {
    if (!previous || signature(picked) !== previous) break;
    picked = sample(target);
  }

  if (previous && signature(picked) === previous) {
    const chosen = new Set(picked.map((project) => project.slug));
    const outsider = SCENE_PROJECT_POOL.find(
      (project) => !chosen.has(project.slug),
    );
    if (outsider) picked = [...picked.slice(1), outsider];
  }

  remember(signature(picked));
  documentDraw = { count, projects: picked };
  return picked;
}
