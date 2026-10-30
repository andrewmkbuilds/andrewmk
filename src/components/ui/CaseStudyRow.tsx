import { Link } from "@/lib/router-compat";
import { ArrowRight, ArrowUpRight, Check, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
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
 */
export function CaseStudyRow({ project, index }: CaseStudyRowProps) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const highlights = project.built.slice(0, 3);
  const figures = (project.results ?? []).slice(0, 3);

  return (
    <article className="case-row group relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      {/* media panel */}
      <Reveal className={cn("relative", flip && "lg:order-2")} y={22}>
        <div className="case-media surface relative overflow-hidden rounded-2xl">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(130%_100%_at_15%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_60%),radial-gradient(90%_80%_at_100%_100%,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_72%)]"
          />
          <div className="bg-grid relative flex min-h-[240px] flex-col justify-between p-6 sm:min-h-[300px] sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <span className="sticker sticker-gold">{project.status}</span>
              <span
                aria-hidden="true"
                className="serif-display text-4xl text-foreground/12 sm:text-5xl"
              >
                {number}
              </span>
            </div>

            <div>
              <p className="serif-display headline-3d text-3xl leading-none text-foreground sm:text-5xl">
                {project.name}
              </p>
              <p className="mt-3 max-w-sm font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                {project.category}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-foreground/12 bg-background/40 px-2.5 py-1 font-mono text-[10px] tracking-wide text-foreground/80 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* story */}
      <div className={cn(flip && "lg:order-1")}>
        <Reveal>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-gold">Case study {number}</span>
            <span aria-hidden="true" className="h-px w-4 bg-gold/40" />
            <span>{project.category}</span>
          </p>

          <h3 className="headline-3d mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            <Link
              to={`/projects/${project.slug}`}
              className="focus-ring rounded-sm"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
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
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-border/70 pt-5">
              {figures.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              to={`/projects/${project.slug}`}
              className="group/case focus-ring inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
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
                className="focus-ring inline-flex items-center gap-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Live app
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                Source
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
