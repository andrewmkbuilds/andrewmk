import { ArrowUpRight } from "lucide-react";
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
  return (
    <article
      className={cn(
        "group relative h-full rounded-xl border border-border bg-card p-6 text-left shadow-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="absolute inset-0 z-10 rounded-xl focus-ring"
        aria-label={`View details for ${project.name}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
            {project.category}
          </p>
          <h3
            className={cn(
              "mt-2 font-semibold text-foreground transition-colors group-hover:text-primary",
              variant === "featured" ? "text-2xl md:text-3xl" : "text-lg",
            )}
          >
            {project.name}
          </h3>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <p
        className={cn(
          "mt-3 text-muted-foreground leading-relaxed",
          variant === "featured" ? "text-base" : "text-sm",
        )}
      >
        {project.description}
      </p>

      {variant === "featured" && project.built.length > 0 && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {project.built.slice(0, 6).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <PlatformBadge project={project} className="relative z-20" />
        {project.tech.slice(0, 4).map((tech) => (
          <TechTag key={tech}>{tech}</TechTag>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {project.status}
        </span>
        <BuiltBy project={project} className="relative z-20" />
      </div>
    </article>
  );
}
