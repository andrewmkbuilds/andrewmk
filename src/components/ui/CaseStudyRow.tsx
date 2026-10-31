import { Link } from "@/lib/router-compat";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { SocialMark } from "@/components/ui/SocialMark";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Badge } from "./badge";
import { StatusBadge } from "./Badges";
import { TechTag } from "./TechTag";
import type { Project } from "@/data/portfolio";

interface CaseStudyRowProps {
  project: Project;
  index: number;
}

/**
 * One case study, laid out the way the reference presents work: a numbered
 * eyebrow, an editorial serif title, a single-sentence pitch, the honest
 * highlights, a trio of real figures and a taped media panel that settles on
 * hover. Rows alternate sides on large screens.
 *
 * The media panel is typographic by design — no product screenshot is invented
 * for a project that has none. Projects with a live URL still surface it
 * honestly, as a link, never as an implied interface.
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
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(130%_100%_at_15%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%),radial-gradient(90%_80%_at_100%_100%,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_72%)]"
          />
          <div className="case-media-inner bg-grid flex aspect-[4/3] max-h-[420px] flex-col justify-between p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <StatusBadge status={project.status} size="sm" />
              <span
                aria-hidden="true"
                className="serif-display text-4xl text-foreground/12 tabular-nums sm:text-5xl"
              >
                {number}
              </span>
            </div>

            <div className="mt-6">
              <p className="serif-display headline-3d text-3xl leading-none text-foreground sm:text-[2.9rem]">
                {project.name}
              </p>
              <p className="mt-3 max-w-sm font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                {project.category}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((t) => (
                  <TechTag key={t}>{t}</TechTag>
                ))}
              </span>
              {project.live && (
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
                    <ArrowUpRight
                      className="badge-icon badge-arrow"
                      aria-hidden="true"
                    />
                  </Badge>
                </a>
              )}
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
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-foreground/85"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                    aria-hidden="true"
                  />
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
