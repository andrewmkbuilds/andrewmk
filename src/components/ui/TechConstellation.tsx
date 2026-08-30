import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface TechNode {
  name: string;
  /** percentage coordinates within the field */
  x: number;
  y: number;
  group: "language" | "framework" | "ai" | "platform";
}

const TECH: TechNode[] = [
  { name: "Python", x: 16, y: 26, group: "language" },
  { name: "TypeScript", x: 44, y: 14, group: "language" },
  { name: "React", x: 70, y: 24, group: "framework" },
  { name: "Flutter", x: 88, y: 46, group: "framework" },
  { name: "Tkinter", x: 12, y: 58, group: "framework" },
  { name: "AI", x: 50, y: 46, group: "ai" },
  { name: "OpenCV", x: 26, y: 78, group: "ai" },
  { name: "MediaPipe", x: 56, y: 82, group: "ai" },
  { name: "Supabase", x: 80, y: 72, group: "platform" },
  { name: "Base44", x: 34, y: 44, group: "platform" },
  { name: "Lovable", x: 70, y: 56, group: "platform" },
];

const LINKS: [string, string][] = [
  ["Python", "AI"],
  ["Python", "OpenCV"],
  ["OpenCV", "MediaPipe"],
  ["AI", "MediaPipe"],
  ["AI", "Base44"],
  ["AI", "Lovable"],
  ["TypeScript", "React"],
  ["React", "Lovable"],
  ["React", "Supabase"],
  ["Lovable", "Supabase"],
  ["Base44", "TypeScript"],
  ["Flutter", "React"],
  ["Tkinter", "Python"],
  ["Base44", "Python"],
];

const groupLabel: Record<TechNode["group"], string> = {
  language: "Language",
  framework: "Framework",
  ai: "AI / Vision",
  platform: "Platform",
};

/**
 * Interactive technology constellation — SVG lines + DOM chips so it stays
 * readable, accessible and crisp at every breakpoint.
 */
export function TechConstellation({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const isDimmed = (name: string) =>
    active !== null &&
    active !== name &&
    !LINKS.some(([a, b]) => (a === active && b === name) || (b === active && a === name));

  const byName = Object.fromEntries(TECH.map((t) => [t.name, t]));

  return (
    <div
      ref={ref}
      className={cn(
        "surface grain relative overflow-hidden rounded-2xl",
        "h-[420px] sm:h-[460px] lg:h-[520px]",
        className,
      )}
      onMouseLeave={() => setActive(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[90px]"
        aria-hidden="true"
      />

      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {LINKS.map(([a, b]) => {
          const na = byName[a];
          const nb = byName[b];
          if (!na || !nb) return null;
          const lit = active === a || active === b;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={`${na.x}%`}
              y1={`${na.y}%`}
              x2={`${nb.x}%`}
              y2={`${nb.y}%`}
              stroke="var(--primary)"
              strokeWidth={lit ? 1.4 : 0.8}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? false : { pathLength: 1, opacity: lit ? 0.6 : 0.16 }}
              animate={{ opacity: lit ? 0.6 : 0.16 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>

      <ul className="absolute inset-0 m-0 list-none p-0">
        {TECH.map((tech, i) => (
          <motion.li
            key={tech.name}
            className="absolute"
            style={{ left: `${tech.x}%`, top: `${tech.y}%`, translateX: "-50%", translateY: "-50%" }}
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={reduce ? false : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onMouseEnter={() => setActive(tech.name)}
              onFocus={() => setActive(tech.name)}
              onBlur={() => setActive(null)}
              aria-label={`${tech.name} — ${groupLabel[tech.group]}`}
              className={cn(
                "focus-ring group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur-sm transition-all duration-300 sm:text-xs",
                active === tech.name
                  ? "border-primary/60 bg-primary/15 text-foreground shadow-glow scale-105"
                  : "border-border bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                isDimmed(tech.name) && "opacity-35",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  tech.group === "ai" || tech.group === "platform"
                    ? "bg-primary"
                    : "bg-muted-foreground group-hover:bg-primary",
                )}
                aria-hidden="true"
              />
              {tech.name}
            </button>
          </motion.li>
        ))}
      </ul>

      <p className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-primary">//</span> {active ? groupLabel[byName[active]!.group] : "Hover a node"}
      </p>
    </div>
  );
}
