import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Reveal, useReveal } from "./Reveal";
import type { Slice } from "@/data/visuals";

/**
 * Small, dependency-free charts.
 *
 * The site already ships enough JavaScript; these draw with SVG and CSS and
 * carry no library. Each one is a `<figure>` whose numbers are also written out
 * as text, so the data is readable (and printed) without the graphic, and the
 * colour is never the only channel.
 */

const PALETTE = [
  "var(--gold)",
  "var(--primary)",
  "color-mix(in oklab, var(--gold) 55%, var(--primary))",
  "color-mix(in oklab, var(--primary) 55%, var(--foreground))",
  "color-mix(in oklab, var(--gold) 65%, var(--muted-foreground))",
  "color-mix(in oklab, var(--border) 55%, var(--foreground))",
];

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ChartProps {
  data: Slice[];
  title: string;
  caption?: string;
  className?: string;
}

export function DonutChart({
  data,
  title,
  caption,
  centerLabel = "records",
  className,
}: ChartProps & { centerLabel?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let offset = 0;
  const slices = data.map((slice, index) => {
    const length = total > 0 ? (slice.value / total) * CIRCUMFERENCE : 0;
    const entry = {
      ...slice,
      index,
      length,
      offset,
      color: PALETTE[index % PALETTE.length] ?? PALETTE[0]!,
    };
    offset += length;
    return entry;
  });

  const current = active === null ? null : slices[active];

  return (
    <figure className={cn("chart", className)}>
      <figcaption className="grid gap-0.5">
        <span className="chart-title">{title}</span>
        {caption && <span className="chart-caption">{caption}</span>}
      </figcaption>

      <div className="chart-body chart-body--donut">
        <div className="chart-donut">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="chart-track" cx="50" cy="50" r={RADIUS} />
            {slices.map((slice) => (
              <circle
                key={slice.label}
                className={cn(
                  "chart-slice",
                  active !== null &&
                    active !== slice.index &&
                    "chart-slice--dim",
                  active === slice.index && "chart-slice--on",
                )}
                cx="50"
                cy="50"
                r={RADIUS}
                stroke={slice.color}
                strokeDasharray={`${slice.length} ${CIRCUMFERENCE - slice.length}`}
                strokeDashoffset={-slice.offset}
                onMouseEnter={() => setActive(slice.index)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </svg>
          <div className="chart-center">
            <span className="chart-center-value">
              {current ? current.value : total}
            </span>
            <span className="chart-center-label">
              {current ? current.label : centerLabel}
            </span>
          </div>
        </div>

        <ul className="chart-legend">
          {slices.map((slice) => (
            <li
              key={slice.label}
              className="chart-legend-row"
              onMouseEnter={() => setActive(slice.index)}
              onMouseLeave={() => setActive(null)}
            >
              <span
                className="chart-swatch"
                style={{ background: slice.color }}
                aria-hidden="true"
              />
              <span className="chart-legend-label">{slice.label}</span>
              <span className="chart-legend-value">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function BarChart({
  data,
  title,
  caption,
  unit,
  className,
}: ChartProps & { unit?: string }) {
  const ref = useReveal<HTMLElement>();
  const max = Math.max(1, ...data.map((slice) => slice.value));

  return (
    <figure ref={ref} className={cn("chart reveal", className)}>
      <figcaption className="grid gap-0.5">
        <span className="chart-title">{title}</span>
        {caption && <span className="chart-caption">{caption}</span>}
      </figcaption>

      <ul className="chart-bars mt-4">
        {data.map((slice) => (
          <li key={slice.label} className="chart-bar">
            <span className="chart-bar-label">{slice.label}</span>
            <span className="chart-bar-track" aria-hidden="true">
              <span
                className="chart-bar-fill"
                style={{ "--bar": slice.value / max } as CSSProperties}
              />
            </span>
            <span className="chart-bar-value">
              {slice.value}
              {unit ? ` ${unit}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function Meter({
  value,
  total,
  label,
  note,
  className,
}: {
  value: number;
  total: number;
  label: string;
  note?: string;
  className?: string;
}) {
  const ratio = total > 0 ? value / total : 0;

  return (
    <Reveal className={cn("meter", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[0.7rem] text-foreground">
          {value} / {total}
        </span>
      </div>
      <div className="meter-track">
        <span
          className="meter-fill"
          style={{ "--p": ratio } as CSSProperties}
        />
      </div>
      {note && (
        <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
      )}
    </Reveal>
  );
}
