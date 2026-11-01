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

const PATTERN: Variant[] = [
  "plinth",
  "display",
  "edge",
  "plinth",
  "whisper",
  "display",
  "edge",
  "plinth",
  "display",
  "whisper",
  "plinth",
  "edge",
];

const TONES: Tone[] = ["slate", "gold", "azure", "slate"];

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

  const style = {
    "--name-x": `${((spread(index, 1) - 0.5) * 26).toFixed(2)}%`,
    "--name-y": `${((spread(index, 2) - 0.5) * 30).toFixed(2)}%`,
    "--name-rot": `${((spread(index, 3) - 0.5) * (drift ? 7 : 3)).toFixed(2)}deg`,
    "--name-scale": (0.9 + spread(index, 4) * (drift ? 0.55 : 0.2)).toFixed(3),
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
