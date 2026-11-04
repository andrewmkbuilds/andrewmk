import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { ProjectShot } from "./ProjectShot";
import type { Project } from "@/data/portfolio";

/**
 * Interactive project index, adapted from the 21st.dev "ProjectShowcase" demo.
 *
 * What changed from the supplied code, and why:
 *
 * 1. **Real records, not demo rows.** Rows come from `src/data/portfolio.ts`
 *    (`Project[]`), each linking to its own `/projects/<slug>` page. No demo
 *    name, description, date or stock image survives.
 * 2. **One asset per project, never stock imagery.** Every record publishes a
 *    `screenshot`, rendered here through `ProjectShot`, so this preview shows
 *    the same asset as the card, case study, modal and project page. That field
 *    holds either a capture of the project's own live site or — for projects
 *    with no public site, or one behind a login — a bespoke illustration of
 *    that specific product in `previews/`, each with its own composition.
 * 3. **One animation frame loop, driven by refs.** The demo kept the cursor in
 *    React state and used it as an effect dependency, so every pointer move
 *    tore down and restarted the loop (and re-rendered the whole list). Here
 *    the pointer only writes a ref; a single rAF loop, alive only while a row
 *    is active, interpolates the preview and writes `transform` directly.
 * 4. **The preview is portalled to `<body>`.** An ancestor (`.page-enter`)
 *    carries a transform, and a transformed ancestor becomes the containing
 *    block for `position: fixed` — inside the section the preview resolved
 *    against that box and slid off-screen as the page scrolled.
 * 5. **Transform + opacity only.** No `filter: blur()`, no layout reads per
 *    frame; plates cross-fade with scale, so the whole thing is compositor
 *    work.
 * 6. **Touch has no hover.** The floating preview is pointer-driven and
 *    desktop-only; on small screens each row is a large, tappable link.
 */

export interface ProjectShowcaseProps {
  /** Real projects from `src/data/portfolio.ts` — never duplicated records. */
  projects: Project[];
  className?: string;
}

const PREVIEW_WIDTH = 300;
const PREVIEW_HEIGHT = 200;
const GUTTER = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Published completion year when the record has one; otherwise its real status. */
function projectMeta(project: Project) {
  const year = (project.endDate ?? project.startDate ?? "").slice(0, 4);
  return year || project.status;
}

export function ProjectShowcase({ projects, className }: ProjectShowcaseProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  /**
   * Only rows the reader has actually pointed at (or focused) mount their
   * screenshot. Painting all 15 previews up front fetched every asset on page
   * load — the floating card is a hover surface, so its images can load on
   * demand. Kept so a previously seen shot still cross-fades in.
   */
  const [seen, setSeen] = useState<number[]>([]);
  const active = hovered ?? focused;
  const visible = active !== null;
  const markSeen = (index: number) =>
    setSeen((prev) => (prev.includes(index) ? prev : [...prev, index]));

  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const reduce = useHydratedReducedMotion();

  useEffect(() => setMounted(true), []);

  // The component's only animation loop: it runs while a row is active and is
  // cancelled the moment the last row loses hover/focus.
  useEffect(() => {
    if (!visible) return;
    const el = previewRef.current;
    let width = el?.offsetWidth ?? PREVIEW_WIDTH;
    let height = el?.offsetHeight ?? PREVIEW_HEIGHT;
    let frame = 0;

    // Enter at the target instead of flying in from the previous position.
    current.current = { ...target.current };

    const onResize = () => {
      width = el?.offsetWidth ?? width;
      height = el?.offsetHeight ?? height;
    };
    window.addEventListener("resize", onResize);

    const ease = reduce ? 1 : 0.18;

    const tick = () => {
      const tx = clamp(
        target.current.x,
        GUTTER,
        window.innerWidth - width - GUTTER,
      );
      const ty = clamp(
        target.current.y,
        GUTTER,
        window.innerHeight - height - GUTTER,
      );

      current.current.x += (tx - current.current.x) * ease;
      current.current.y += (ty - current.current.y) * ease;

      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [visible, reduce]);

  /** Pointer position is written to a ref only — never to React state. */
  const followPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    target.current = {
      x: event.clientX + 26,
      y: event.clientY - PREVIEW_HEIGHT / 2,
    };
  };

  const handlePointerEnter = (
    index: number,
    event: ReactPointerEvent<HTMLAnchorElement>,
  ) => {
    if (event.pointerType !== "mouse") return;
    followPointer(event);
    markSeen(index);
    setHovered(index);
  };

  const handleFocus = (index: number, event: FocusEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    target.current = {
      x: window.innerWidth - PREVIEW_WIDTH - GUTTER * 3,
      y: rect.top + rect.height / 2 - PREVIEW_HEIGHT / 2,
    };
    markSeen(index);
    setFocused(index);
  };

  const preview = (
    <div
      ref={previewRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-40 hidden h-[200px] w-[300px] overflow-hidden rounded-xl border border-border/80 bg-card transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none md:block",
        visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
      )}
      style={{ boxShadow: "var(--elev-3)" }}
    >
      {seen.map((index) => {
        const project = projects[index];
        if (!project) return null;
        return (
          <div
            key={project.slug}
            className={cn(
              "absolute inset-0 transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none",
              active === index
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0",
            )}
          >
            <ProjectShot project={project} />
          </div>
        );
      })}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/25 to-transparent"
      />
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      {mounted && createPortal(preview, document.body)}

      <ol
        className="m-0 list-none p-0"
        onPointerMove={followPointer}
        onPointerLeave={() => setHovered(null)}
      >
        {projects.map((project, index) => {
          const isActive = active === index;
          return (
            <li
              key={project.slug}
              className="border-t border-border/70 last:border-b"
            >
              <Link
                to={`/projects/${project.slug}`}
                onPointerEnter={(event) => handlePointerEnter(index, event)}
                onFocus={(event) => handleFocus(index, event)}
                onBlur={() => setFocused(null)}
                className={cn(
                  "focus-ring group relative flex min-h-11 items-start justify-between gap-4 rounded-lg px-2 py-5 transition-colors duration-300 sm:px-3 sm:py-6",
                  isActive && "bg-card/60",
                )}
              >
                <div className="flex min-w-0 flex-1 items-baseline gap-3 sm:gap-5">
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 font-mono text-[11px] text-muted-foreground/60 tabular-nums sm:w-8"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground sm:text-lg">
                      <span className="relative inline-block">
                        {project.name}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-px bg-gold transition-[width] duration-300 ease-out motion-reduce:transition-none",
                            isActive ? "w-full" : "w-0",
                          )}
                        />
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4 shrink-0 text-gold transition-all duration-300 ease-out motion-reduce:transition-none",
                          isActive
                            ? "translate-x-0 translate-y-0 opacity-100"
                            : "-translate-x-1.5 translate-y-1.5 opacity-0",
                        )}
                      />
                    </h3>

                    <p
                      className={cn(
                        "mt-1.5 line-clamp-2 text-sm leading-relaxed transition-colors duration-300",
                        isActive
                          ? "text-foreground/75"
                          : "text-muted-foreground",
                      )}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "shrink-0 pt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground tabular-nums transition-colors duration-300",
                    isActive && "text-gold",
                  )}
                >
                  {projectMeta(project)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
