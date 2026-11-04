import { Link } from "@/lib/router-compat";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { SocialMark } from "@/components/ui/SocialMark";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { TickMark } from "./TickMark";
import { Badge } from "./badge";
import { StatusBadge } from "./Badges";
import { ProjectShot } from "./ProjectShot";
import type { Project } from "@/data/portfolio";

interface CaseStudyRowProps {
  project: Project;
  index: number;
}

/** The "Live" pill, shared by the screenshot caption and the plate panel. */
function LiveBadge({ project }: { project: Project }) {
  if (!project.live) return null;
  return (
    <a
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} live app (opens in a new tab)`}
      className="focus-ring rounded-full"
    >
      <Badge tone="live" size="sm" className="badge-link">
        <span className="badge-pulse" aria-hidden="true" />
        <span className="badge-label">Live</span>
        <ArrowUpRight className="badge-icon badge-arrow" aria-hidden="true" />
      </Badge>
    </a>
  );
}

/**
 * One case study, laid out the way the reference presents work: a numbered
 * eyebrow, an editorial serif title, a single-sentence pitch, the honest
 * highlights, a trio of real figures and a taped media panel that settles on
 * hover. Rows alternate sides on large screens.
 *
 * The media panel is the project's own screenshot — the same asset every other
 * surface uses (`ui/ProjectShot.tsx`) — under a caption strip carrying the name,
 * status and live link. Every record publishes that asset, so nothing here is
 * invented or borrowed from another project.
 */
export function CaseStudyRow({ project, index }: CaseStudyRowProps) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const highlights = project.built.slice(0, 3);
  const figures = (project.results ?? []).slice(0, 3);

  return (
    <article className="case-row group relative grid items-center gap-7 sm:gap-8 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-20">
      {/* media panel */}
      <Reveal className={cn("relative", flip && "lg:order-2")} y={22}>
        <div className="case-media surface relative overflow-hidden rounded-2xl">
          <div className="aspect-[16/10] overflow-hidden">
            <ProjectShot
              project={project}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>
          <div className="relative flex flex-wrap items-end justify-between gap-3 border-t border-border/70 bg-background/70 px-4 py-3.5 sm:px-5">
            <div className="min-w-0">
              <p className="serif-display text-lg leading-none text-foreground">
                {project.name}
              </p>
              <p className="mt-1.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {project.category}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} size="sm" />
              <LiveBadge project={project} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* story */}
      <div className={cn("case-story", flip && "lg:order-1")}>
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex min-w-[3.4rem] items-center gap-2 text-gold tabular-nums">
              {number}
              <span aria-hidden="true" className="h-px w-4 bg-gold/40" />
            </span>
            <span className="truncate">Case study</span>
            <span aria-hidden="true" className="h-3 w-px bg-foreground/15" />
            <span className="truncate">{project.category}</span>
          </p>

          <h3 className="headline-3d mt-3 text-[1.85rem] leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
            <Link
              to={`/projects/${project.slug}`}
              className="case-title-link focus-ring rounded-sm"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {project.description}
          </p>

          {highlights.length > 0 && (
            <ul className="mt-6 grid list-none gap-2.5 p-0">
              {highlights.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-foreground/85"
                >
                  <TickMark className="mt-0.5" index={i}>
                    <Check
                      className="h-3.5 w-3.5 text-gold"
                      aria-hidden="true"
                    />
                  </TickMark>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {figures.length > 0 && (
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-border/70 pt-5">
              {figures.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground tabular-nums">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to={`/projects/${project.slug}`}
              className="group/case focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20 active:scale-[0.99]"
            >
              Read the case study
              <ArrowRight
                className="step-arrow h-3.5 w-3.5"
                aria-hidden="true"
              />
            </Link>

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group/live inline-flex min-h-10 items-center gap-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Live app
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group/source inline-flex min-h-10 items-center gap-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <SocialMark id="github" size="sm" />
                Source
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
