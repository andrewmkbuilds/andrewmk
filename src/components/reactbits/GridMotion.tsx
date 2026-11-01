/**
 * GridMotion — a tilted wall of drifting tiles that slides with the pointer
 * and lights up where the cursor rests.
 *
 * Adapted from the React Bits registry (`https://reactbits.dev/r/GridMotion-TS-TW`).
 * Vendored, not copied verbatim: the demo's Tailwind utility strings are
 * replaced by the classes in `src/styles/grid-motion.css` so the navy/gold
 * palette stays in one place, and the component now stops completely under
 * `prefers-reduced-motion` (one static frame, no rAF loop, no pointer
 * listeners) instead of keeping a loop alive to hold a still image.
 *
 * The site uses it as the ambient depth field behind every route (see
 * `ui/background/SceneBackground.tsx`). It is decorative: the root is
 * `pointer-events-none`, `aria-hidden`, and the whole thing is dropped by the
 * print stylesheet.
 *
 * Per frame it writes exactly two things — each row's `transform` and each
 * lit tile's `--spot` custom property. No React state changes on move, no
 * layout reads inside the loop beyond one cached `getBoundingClientRect`.
 */
import {
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type GridMotionDirection = "alternate" | "left" | "right";

export type GridMotionProps = {
  /** Tile content. Strings render as text plinths, elements render as given. */
  items?: ReactNode[];
  rows?: number;
  aspectRatio?: number;
  gap?: number;
  /** Rotation of the whole wall, in degrees. */
  angle?: number;
  /** Lean of the wall into the screen, in degrees. `0` renders it flat. */
  tilt?: number;
  /** Pixels per second each row drifts. */
  speed?: number;
  direction?: GridMotionDirection;
  /** How far a row follows the pointer, as a fraction of a tile. */
  parallax?: number;
  /** Strength of the light that follows the pointer across the tiles. */
  spotlight?: number;
  /** How dark a tile is when the pointer light is not on it. */
  dim?: number;
  className?: string;
};

type Tile =
  | { kind: "empty" }
  | { kind: "node"; node: ReactNode }
  | { kind: "text"; text: string };

type Motion = {
  offsets: number[];
  shifts: number[];
  intro: number;
  pointer: { x: number; y: number; active: boolean };
};

const INERTIA = [0.42, 0.32, 0.26, 0.22];
const PACE = [1, 0.86, 1.12, 0.94];
const EMPTY: Tile = { kind: "empty" };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const wrap = (value: number, total: number) =>
  ((value % total) + total) % total;

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const toTile = (item: ReactNode): Tile => {
  if (item === null || item === undefined || item === false) return EMPTY;
  if (isValidElement(item)) return { kind: "node", node: item };
  const text = String(item).trim();
  return text ? { kind: "text", text } : EMPTY;
};

const TileFace = ({ tile }: { tile: Tile }) => (
  <div className="gm-tile">
    {tile.kind === "text" && <span>{tile.text}</span>}
    {tile.kind === "node" && tile.node}
  </div>
);

export default function GridMotion({
  items = [],
  rows = 4,
  aspectRatio = 1.33,
  gap = 16,
  angle = -12,
  tilt = 0,
  speed = 24,
  direction = "alternate",
  parallax = 0.5,
  spotlight = 0.6,
  dim = 0.35,
  className = "",
}: GridMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<Motion>({
    offsets: [],
    shifts: [],
    intro: 0,
    pointer: { x: 0, y: 0, active: false },
  });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const rowCount = clamp(Math.round(rows), 1, 12);
  const aspect = clamp(aspectRatio, 0.3, 4);
  const spacing = Math.max(0, gap);
  const leanDeg = clamp(tilt, 0, 75);
  const spotStrength = clamp(spotlight, 0, 1);
  const dimStrength = clamp(dim, 0, 1);
  const follow = clamp(parallax, 0, 1);

  const settingsRef = useRef({ speed, direction, follow, spotStrength, leanDeg });
  settingsRef.current = { speed, direction, follow, spotStrength, leanDeg };

  const layout = useMemo(() => {
    const { width, height } = size;
    if (!width || !height) return null;

    const turn = (angle * Math.PI) / 180;
    const lean = (leanDeg * Math.PI) / 180;
    const cos = Math.abs(Math.cos(turn));
    const sin = Math.abs(Math.sin(turn));

    // A turned and leaned plane covers more than the viewport, so the wall is
    // sized from the rotated bounds rather than from the box it sits in.
    const planeHeight =
      ((width * sin + height * cos) / Math.max(0.3, Math.cos(lean))) * 1.12;
    const planeWidth =
      (width * cos + height * sin) * (1 + Math.sin(lean) * 0.9) * 1.12;

    const tileHeight = Math.max(16, (planeHeight - spacing * (rowCount - 1)) / rowCount);
    const tileWidth = tileHeight * aspect;
    const step = tileWidth + spacing;
    const perRow = Math.ceil(planeWidth / step) + 1;
    const period = perRow * step;

    return {
      planeWidth,
      planeHeight,
      tileWidth,
      tileHeight,
      step,
      perRow,
      period,
      copies: Math.ceil(planeWidth / period) + 2,
      top:
        (planeHeight - rowCount * tileHeight - (rowCount - 1) * spacing) / 2,
      perspective: Math.max(width, height) * 1.5,
    };
  }, [size, angle, leanDeg, rowCount, spacing, aspect]);

  const tiles = useMemo(() => items.map(toTile), [items]);

  // Sizing and pointer capture. Both are inert under reduced motion: the loop
  // below never schedules a second frame, so nothing would consume them.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new ResizeObserver(() => {
      const width = Math.round(root.clientWidth);
      const height = Math.round(root.clientHeight);
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    });
    observer.observe(root);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return () => observer.disconnect();
    }

    const motion = motionRef.current;
    const onMove = (event: PointerEvent) => {
      motion.pointer.x = event.clientX;
      motion.pointer.y = event.clientY;
      motion.pointer.active = true;
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") motion.pointer.active = false;
    };
    const onLeave = () => {
      motion.pointer.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane || !layout) return undefined;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const motion = motionRef.current;
    const rowEls = Array.from(plane.children) as HTMLElement[];
    const tileEls = rowEls.map((row) => Array.from(row.children) as HTMLElement[]);
    const spots = tileEls.map((list) => new Float32Array(list.length));
    const written = tileEls.map((list) => new Float32Array(list.length));

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;

    if (reduce || motion.intro >= 1) plane.style.opacity = "1";

    const frame = (now: number) => {
      raf = 0;
      if (!alive) return;

      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      if (!reduce && motion.intro < 1) {
        motion.intro = Math.min(1, motion.intro + dt / 0.9);
        plane.style.opacity = String(1 - (1 - motion.intro) ** 3);
      }

      const rect = root.getBoundingClientRect();
      const scale = rect.width ? root.clientWidth / rect.width : 1;
      const halfWidth = root.clientWidth / 2 || 1;
      const halfHeight = root.clientHeight / 2 || 1;
      const px = (motion.pointer.x - rect.left) * scale - halfWidth;
      const py = (motion.pointer.y - rect.top) * scale - halfHeight;
      const inside =
        !reduce &&
        motion.pointer.active &&
        Math.abs(px) <= halfWidth &&
        Math.abs(py) <= halfHeight;

      // Project the pointer onto the leaned plane, then onto the row axis, so
      // the light lands on the tile the cursor actually appears to cover.
      const lean = (s.leanDeg * Math.PI) / 180;
      const turn = (angle * Math.PI) / 180;
      const depth = layout.perspective;
      let flatY = py;
      let flatX = px;
      if (lean > 0.0001) {
        flatY = (py * depth) / (depth * Math.cos(lean) + py * Math.sin(lean));
        flatX = (px * (depth - flatY * Math.sin(lean))) / depth;
      }
      const planeX = flatX * Math.cos(turn) + flatY * Math.sin(turn);
      const planeY = -flatX * Math.sin(turn) + flatY * Math.cos(turn);
      const nudge = inside ? clamp(px / halfWidth, -1, 1) : 0;
      const reach =
        (0.6 + 2.2 * s.spotStrength) *
        Math.max(layout.tileWidth, layout.tileHeight);
      const settle = 1 - Math.exp(-dt / 0.22);

      rowEls.forEach((row, r) => {
        const drift =
          s.direction === "left" ? -1 : s.direction === "right" ? 1 : r % 2 ? 1 : -1;

        if (motion.offsets[r] === undefined) {
          motion.offsets[r] = r * layout.step * 0.37;
          motion.shifts[r] = 0;
        }

        if (!reduce) {
          motion.offsets[r] =
            (motion.offsets[r] ?? 0) +
            s.speed * drift * (PACE[r % PACE.length] ?? 1) * dt;
        }

        const target =
          s.follow * layout.tileWidth * 1.2 * nudge * (r % 2 ? -1 : 1);
        motion.shifts[r] =
          (motion.shifts[r] ?? 0) +
          (target - (motion.shifts[r] ?? 0)) *
            (1 - Math.exp(-dt / (INERTIA[r % INERTIA.length] ?? 0.3)));

        const x =
          -layout.period + wrap((motion.offsets[r] ?? 0) + (motion.shifts[r] ?? 0), layout.period);
        row.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

        const rowY =
          layout.top +
          r * (layout.tileHeight + spacing) +
          layout.tileHeight / 2 -
          layout.planeHeight / 2;
        const left = x - layout.planeWidth / 2 + layout.tileWidth / 2;
        const list = tileEls[r] ?? [];
        const values = spots[r] ?? new Float32Array(0);
        const marks = written[r] ?? new Float32Array(0);

        for (let k = 0; k < list.length; k++) {
          let wanted = 0;
          if (inside && s.spotStrength > 0) {
            const distance =
              Math.hypot(left + k * layout.step - planeX, rowY - planeY) / reach;
            wanted = 1 - smoothstep(0.25, 1, distance);
          }
          values[k] = (values[k] ?? 0) + (wanted - (values[k] ?? 0)) * settle;
          const current = values[k] ?? 0;
          const mark = marks[k] ?? 0;
          if (Math.abs(current - mark) > 0.004 || (wanted === 0 && current < 0.004 && mark !== 0)) {
            marks[k] = current < 0.004 ? 0 : current;
            list[k]?.style.setProperty("--spot", (marks[k] ?? 0).toFixed(3));
          }
        }
      });

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible && !raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    visibility.observe(root);
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
    };
  }, [layout, tiles, angle]);

  const rowTiles = layout
    ? Array.from({ length: rowCount }, (_, r) =>
        Array.from({ length: layout.perRow }, (_, j) =>
          tiles.length
            ? tiles[(r * layout.perRow + j) % tiles.length] ?? EMPTY
            : EMPTY,
        ),
      )
    : [];

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className ? `gm ${className}` : "gm"}
      style={
        {
          "--gm-dim": dimStrength,
          perspective: layout && leanDeg > 0 ? `${layout.perspective}px` : undefined,
        } as CSSProperties
      }
    >
      {layout && (
        <div
          ref={planeRef}
          className="gm-plane"
          style={
            {
              width: layout.planeWidth,
              height: layout.planeHeight,
              // `--gm-drift` is the page-scroll offset the scene writes on an
              // ancestor; everything else is the fixed lean and turn. (Local
              // addition, see grid-motion.css.)
              transform: `translate(-50%, calc(-50% + var(--gm-drift, 0px))) rotateX(${leanDeg}deg) rotateZ(${angle}deg)`,
              "--gm-gap": `${spacing}px`,
              "--gm-tile-w": `${layout.tileWidth}px`,
              "--gm-tile-h": `${layout.tileHeight}px`,
              "--gm-font": `${clamp(layout.tileHeight * 0.12, 12, 30)}px`,
            } as CSSProperties
          }
        >
          {rowTiles.map((sequence, r) => (
            <div
              key={r}
              className="gm-row"
              style={{ top: layout.top + r * (layout.tileHeight + spacing) }}
            >
              {Array.from(
                { length: layout.copies * layout.perRow },
                (_, k) => (
                  <TileFace
                    key={k}
                    tile={sequence[k % layout.perRow] ?? EMPTY}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
