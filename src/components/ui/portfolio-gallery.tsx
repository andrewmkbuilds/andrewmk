import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import type { Project } from "@/data/portfolio";

/**
 * 3D project gallery, adapted from the 21st.dev PortfolioGallery component.
 *
 * Two deliberate departures from the demo:
 *
 * 1. **No stock imagery.** The portfolio has never published product
 *    screenshots, so a card is a designed *plate* built from that project's
 *    own record — status, name, category and stack. Stock photography would
 *    misrepresent the work.
 * 2. **No marquee.** The demo repeats the same images four times in the DOM
 *    and relies on an `animate-marquee` keyframe this project never defined.
 *    Below `md` the gallery is one horizontally scrollable, snap-aligned row:
 *    every card appears once, every card is a real link, and nothing moves
 *    under the reader's thumb.
 *
 * Above `md` the plates fan across a shared perspective: the middle of the row
 * sits highest, the ends fall away, and the hovered/focused plate turns to face
 * the reader and lifts. All motion is transform/opacity; under
 * `prefers-reduced-motion` the fan renders static with no transitions.
 */

export interface PortfolioGalleryProps {
  /** Real projects from `src/data/portfolio.ts` — never duplicated records. */
  projects: Project[];
  /** Optional heading; omit when the surrounding section already has one. */
  title?: string;
  /** Optional archive link. Omit when the page already offers one. */
  archiveButton?: { text: string; to: string };
  /** How far the middle plate of the fan rises, in px. */
  maxHeight?: number;
  /** Fraction of each plate that the next plate covers (0–1). */
  overlap?: number;
  className?: string;
}

function GalleryPlate({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index: number;
  compact?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");
  const stack = project.tech.slice(0, 2).join(" · ");

  return (
    <div
      className={cn(
        "relative isolate flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card",
        compact ? "p-4" : "p-4 lg:p-5",
      )}
      style={{ boxShadow: "var(--elev-2)" }}
    >
      {/* Shared light: cool key from the top-left, gold rim bottom-right. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(125%_95%_at_10%_0%,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_62%),radial-gradient(95%_80%_at_100%_100%,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_72%)]"
      />
      <span
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 opacity-25"
      />

      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold lg:text-[10px]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gold/80"
          />
          {project.status}
        </span>
        <span
          aria-hidden="true"
          className="serif-display text-xl leading-none tabular-nums text-foreground/15 lg:text-2xl"
        >
          {number}
        </span>
      </div>

      <div className="mt-5">
        <p className="serif-display text-[15px] leading-tight text-foreground lg:text-xl">
          {project.name}
        </p>
        <p className="mt-1.5 line-clamp-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground lg:text-[10px]">
          {project.category}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/80 lg:text-[10px]">
          {stack}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </div>
    </div>
  );
}

export function PortfolioGallery({
  projects,
  title,
  archiveButton,
  maxHeight = 112,
  overlap = 0.72,
  className,
}: PortfolioGalleryProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useHydratedReducedMotion();

  // The entrance stagger only applies once; hover responses must be immediate.
  useEffect(() => setReady(true), []);

  const count = projects.length;
  const middle = Math.floor(count / 2);
  const step = maxHeight / Math.max(middle, 1);
  // Plate width such that the whole fan spans the row exactly, capped so the
  // plates stay a readable size on very wide screens.
  const span = count - overlap * (count - 1);
  const rowStyle = {
    "--pg-card": `min(240px, calc(100% / ${span.toFixed(3)}))`,
    "--pg-overlap": `-${overlap}`,
  } as CSSProperties;

  return (
    <div data-portfolio-gallery="" className={cn("relative", className)}>
      {(title || archiveButton) && (
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          {title && (
            <h2 className="headline-3d text-2xl text-foreground md:text-3xl">
              {title}
            </h2>
          )}
          {archiveButton && (
            <Link
              to={archiveButton.to}
              className="focus-ring group inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
            >
              {archiveButton.text}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      )}

      {/* Tablet and up — one perspective, plates staggered by distance. */}
      <div className="relative hidden overflow-hidden md:block">
        <div
          className="flex w-full items-end justify-center pb-4 pt-36"
          style={rowStyle}
          onMouseLeave={() => setHovered(null)}
        >
          {projects.map((project, index) => {
            const distance = Math.abs(index - middle);
            const stagger = Math.max(maxHeight - distance * step, 0);
            const isHovered = hovered === index;
            const isMuted = hovered !== null && hovered !== index;

            return (
              <motion.div
                key={project.slug}
                className="relative shrink-0"
                style={{
                  width: "var(--pg-card)",
                  marginLeft:
                    index === 0
                      ? 0
                      : "calc(var(--pg-card) * var(--pg-overlap))",
                  transformPerspective: 1600,
                  zIndex: isHovered ? count + 1 : count - index,
                }}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, y: stagger + 140, rotateY: -26 }
                }
                animate={{
                  opacity: 1,
                  y: isHovered
                    ? -(maxHeight + 28)
                    : isMuted
                      ? -stagger * 0.45
                      : -stagger,
                  rotateY: isHovered ? 0 : -26,
                  x: isMuted ? (index < (hovered ?? 0) ? -14 : 14) : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                  duration: reduce ? 0 : isHovered ? 0.24 : 0.36,
                  delay: reduce || ready ? 0 : index * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onHoverStart={() => setHovered(index)}
                onHoverEnd={() => setHovered(null)}
                onFocusCapture={() => setHovered(index)}
                onBlurCapture={() => setHovered(null)}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="focus-ring group block rounded-2xl"
                  aria-label={`${project.name} — ${project.category}`}
                >
                  <div className="aspect-[4/5] w-full">
                    <GalleryPlate project={project} index={index} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Small screens — one scrollable row, snap aligned, full-size targets. */}
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:hidden">
        <ul
          className="flex snap-x snap-mandatory gap-4 p-0"
          style={{ listStyle: "none" }}
          aria-label={title ? `${title} — projects` : "Projects"}
        >
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className="w-[68vw] max-w-[260px] shrink-0 snap-start"
            >
              <Link
                to={`/projects/${project.slug}`}
                className="focus-ring group block min-h-11 rounded-2xl"
                aria-label={`${project.name} — ${project.category}`}
              >
                <div className="aspect-[4/5] w-full">
                  <GalleryPlate project={project} index={index} compact />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
