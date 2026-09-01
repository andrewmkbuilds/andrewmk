import { useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { TechTag } from "./TechTag";
import { BuiltBy, PlatformBadge } from "./BuiltBy";
import type { Project } from "@/data/portfolio";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  variant?: "featured" | "compact";
  className?: string;
}

export function ProjectCard({ project, onOpen, variant = "compact", className }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:]/g, "");
  const triggerId = `project-details-trigger-${uid}`;
  const panelId = `project-details-panel-${uid}`;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasCaseStudy = Boolean(project.stack?.length || project.challenges?.length);


  // pointer-driven tilt (very restrained) + spotlight tracking
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotX = useSpring(useTransform(py, [0, 1], [2.5, -2.5]), {
    stiffness: 200,
    damping: 24,
  });
  const rotY = useSpring(useTransform(px, [0, 1], [-3, 3]), { stiffness: 200, damping: 24 });

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    if (!reduce && e.pointerType === "mouse") {
      px.set(nx);
      py.set(ny);
    }
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      data-cursor="view"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !detailsOpen) return;
        event.stopPropagation();
        setDetailsOpen(false);
        triggerRef.current?.focus();
      }}

      style={
        reduce
          ? {}
          : { rotateX: rotX, rotateY: rotY, transformPerspective: 1000, transformStyle: "preserve-3d" }
      }
      whileHover={reduce ? {} : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "surface spotlight edge-glow group relative isolate h-full rounded-2xl p-6 text-left",
        "transition-colors duration-300 hover:border-gold/35 hover:shadow-glow md:p-7",
        className,
      )}
    >
      {/* accent wash that rises on hover — isolated so the card can keep 3D depth */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      >
        <span className="absolute inset-x-0 bottom-0 h-40 translate-y-8 bg-linear-to-t from-primary/[0.09] to-transparent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
      </span>

      <button
        type="button"
        onClick={() => onOpen(project)}
        className="focus-ring absolute inset-0 z-10 rounded-2xl"
        aria-label={`View details for ${project.name}`}
      />

      <div className="card-depth-lg relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            {project.category}
          </p>
          <h3
            className={cn(
              "text-display mt-2.5 text-foreground transition-colors duration-300 group-hover:text-gold",
              variant === "featured" ? "text-2xl md:text-[2rem]" : "text-lg md:text-xl",
            )}
          >
            {project.name}
          </h3>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:text-gold">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      <p
        className={cn(
          "card-depth-sm relative mt-3.5 leading-relaxed text-muted-foreground",
          variant === "featured" ? "text-base" : "text-sm",
        )}
      >
        {project.description}
      </p>

      {variant === "featured" && project.built.length > 0 && (
        <div className="card-depth-sm relative z-20 mt-5" data-pop-target="project-details">
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            aria-expanded={detailsOpen}
            aria-controls={panelId}
            onClick={() => setDetailsOpen((value) => !value)}
            className="focus-ring inline-flex touch-manipulation items-center gap-2 rounded-md font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
          >
            {`What's inside ${project.name}`}
            <ChevronDown
              aria-hidden="true"
              className={cn("pop-chevron h-4 w-4", detailsOpen && "rotate-180 text-primary")}
            />
          </button>
          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="pop-panel"
            data-open={detailsOpen ? "true" : "false"}
          >
            <div className="pop-panel-inner">
              <ul className="grid gap-2 pt-4 sm:grid-cols-2">
                {project.built.slice(0, 6).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}


      <div className="card-depth-md relative mt-5 flex flex-wrap items-center gap-2">
        <PlatformBadge project={project} className="relative z-20" />
        {project.tech.slice(0, 4).map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>

      <div className="card-depth-sm relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {project.status}
        </span>
        <BuiltBy project={project} className="relative z-20" />
      </div>

      <div className="card-depth-sm relative z-20 mt-4 flex flex-wrap items-center gap-3">
        <Link
          to={`/projects/${project.slug}`}
          onClick={(event) => event.stopPropagation()}
          className="focus-ring inline-flex items-center gap-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-gold"
        >
          {hasCaseStudy ? "Read case study" : "Open project page"}
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
        {hasCaseStudy && (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
            Case study
          </span>
        )}
      </div>

    </motion.article>
  );
}
