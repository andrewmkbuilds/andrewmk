import type { CSSProperties } from "react";
import type { SceneProject } from "@/data/sceneTiles";

/**
 * One project name on the ambient wall.
 *
 * GridMotion paints the tile shell (`.gm-tile`); this component paints the
 * name inside it, in one of a few editorial registers so the wall reads as a
 * composed surface instead of a uniform grid:
 *
 * - `plinth`  — a labelled tile face, the wall's resting texture
 * - `edge`    — the same label pushed off-centre on a slight angle
 * - `display` — no tile face at all: a large serif italic that spills over its
 *               neighbours (styles in `src/styles/scene-names.css`)
 * - `whisper` — a small mono caption, almost a watermark
 *
 * Positions, scales and angles are a deterministic hash of the index, so the
 * server and the client paint the same wall and no project ever jumps.
 */
type Variant = "plinth" | "edge" | "display" | "whisper";
type Tone = "slate" | "azure" | "gold";

/**
 * A nine-tile rhythm: four resting labels, two editorial names, two captions
 * and a single watermark. The older twelve-tile cycle put three display names
 * and three turned labels in every run, which read as noise rather than
 * composition at this tile count.
 */
const PATTERN: Variant[] = [
  "plinth",
  "display",
  "edge",
  "plinth",
  "whisper",
  "plinth",
  "display",
  "edge",
  "plinth",
];

/** Blue holds the wall; gold and azure are punctuation. */
const TONES: Tone[] = ["slate", "azure", "slate", "gold", "slate", "azure"];

/** Stable 0…1 from two integers — no Math.random, no hydration drift. */
function spread(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function ProjectTile({
  project,
  index,
}: {
  project: SceneProject;
  index: number;
}) {
  const variant = PATTERN[index % PATTERN.length] ?? "plinth";
  const tone = TONES[index % TONES.length] ?? "slate";
  const drift = variant === "display" || variant === "whisper";

  // Tight offsets: a tile is a plate, not a scatter. Drift and rotation stay
  // small enough that the wall still reads as a grid.
  const style = {
    "--name-x": `${((spread(index, 1) - 0.5) * (drift ? 18 : 8)).toFixed(2)}%`,
    "--name-y": `${((spread(index, 2) - 0.5) * (drift ? 20 : 10)).toFixed(2)}%`,
    "--name-rot": `${((spread(index, 3) - 0.5) * (drift ? 4 : 1.6)).toFixed(2)}deg`,
    "--name-scale": (drift
      ? 0.94 + spread(index, 4) * 0.12
      : 0.96 + spread(index, 4) * 0.08
    ).toFixed(3),
  } as CSSProperties;

  return (
    <span
      className={`scene-name scene-name--${variant} scene-name--${tone}`}
      style={style}
    >
      {project.name}
    </span>
  );
}
