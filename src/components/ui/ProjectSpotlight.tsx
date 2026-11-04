import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { ProjectShot } from "./ProjectShot";
import { StatusBadge } from "./Badges";
import { PlatformBadge } from "./BuiltBy";
import { TechTag } from "./TechTag";
import type { Project } from "@/data/portfolio";

interface ProjectSpotlightProps {
  project: Project;
  index: number;
}

/**
 * The full-width flagship row on `/projects`.
 *
 * Same records and the same single screenshot asset as every other project
 * surface; what changes is the weight. The build gets a large frame, its real
 * status, verified links and the first two figures from `project.results`, so
 * the flagship reads as a case study rather than another tile. Rows alternate
 * sides above 900px and stack in source order below it.
 */
export function ProjectSpotlight({ project, index }: ProjectSpotlightProps) {
  const highlights = (project.results ?? []).slice(0, 2);
  const year = (project.endDate ?? project.startDate)?.slice(0, 4);

  return (
    <article className="spot" data-flip={index % 2 === 1}>
      <div className="spot-media">
        <figure className="spot-frame">
          <div className="aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)+2px)]">
            <ProjectShot project={project} />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-2 px-1 pt-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{project.category}</span>
            <span>{year ?? project.status}</span>
          </figcaption>
        </figure>
      </div>

      <div className="spot-copy">
        <p className="spot-eyebrow">
          <span className="spot-num">{String(index + 1).padStart(2, "0")}</span>
          Flagship build
        </p>

        <h3 className="spot-name">
          <Link
            to={`/projects/${project.slug}`}
            className="focus-ring rounded-sm transition-colors hover:text-gold"
          >
            {project.name}
          </Link>
        </h3>

        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} size="sm" />
          <PlatformBadge project={project} />
          {project.tech.slice(0, 4).map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>

        {highlights.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {highlights.map((result) => (
              <div key={result.label} className="spot-result">
                <dd className="spot-result-value">{result.value}</dd>
                <dt className="spot-result-label">{result.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            to={`/projects/${project.slug}`}
            className="focus-ring inline-flex min-h-11 items-center gap-2 border-b border-gold/40 pb-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold transition-colors hover:border-gold"
          >
            Read the case study
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-11 items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Live product
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-11 items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Source
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
