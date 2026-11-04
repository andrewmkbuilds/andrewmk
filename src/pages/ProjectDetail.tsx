import { Link } from "@/lib/router-compat";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { SocialMark } from "@/components/ui/SocialMark";
import { motion } from "motion/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { TechTag } from "@/components/ui/TechTag";
import { TickMark } from "@/components/ui/TickMark";
import { BuiltBy, PlatformBadge } from "@/components/ui/BuiltBy";
import { StatusDot } from "@/components/ui/StatusDot";
import { StatusBadge } from "@/components/ui/Badges";
import { ProjectTimeline } from "@/components/ui/ProjectTimeline";
import { ProjectShot } from "@/components/ui/ProjectShot";
import { SystemFlow } from "@/components/ui/SystemFlow";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { allProjects, type Project } from "@/data/portfolio";

interface ProjectDetailProps {
  project: Project;
  /** Full catalogue used for "related projects"; defaults to the built-in data. */
  catalogue?: Project[];
}

function related(project: Project, catalogue: Project[] = allProjects) {
  return catalogue
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.filters.some((f) => project.filters.includes(f)),
    )
    .slice(0, 3);
}

export default function ProjectDetail({
  project,
  catalogue,
}: ProjectDetailProps) {
  const others = related(project, catalogue);

  /**
   * The case study's own contents, built from the sections this record
   * actually renders — so the rail never points at a heading that is absent.
   */
  const sections = [
    project.problem ? { id: "problem", label: "Problem" } : null,
    project.fullDescription ? { id: "overview", label: "Overview" } : null,
    project.solution ? { id: "solution", label: "Solution" } : null,
    { id: "built", label: "What I built" },
    project.stack && project.stack.length > 0
      ? { id: "stack", label: "Tech stack" }
      : null,
    project.challenges && project.challenges.length > 0
      ? { id: "challenges", label: "Challenges" }
      : null,
    project.metrics ? { id: "metrics", label: project.metrics.title } : null,
    project.results && project.results.length > 0
      ? { id: "results", label: "Results" }
      : null,
  ].filter((entry): entry is { id: string; label: string } => entry !== null);

  return (
    <Layout>
      <article>
        <ReadingProgress />
        <section className="relative overflow-hidden bg-hero-veil grain">
          <div className="absolute inset-0 bg-grid" aria-hidden="true" />
          <div className="container relative py-16 md:py-24">
            <Link
              to="/projects"
              className="focus-ring inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All projects
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-3xl"
            >
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                <span
                  aria-hidden="true"
                  className="hairline-gold inline-block w-8"
                />
                {project.category}
              </p>
              <h1 className="headline-3d text-display mt-4 text-[2.75rem] text-balance text-foreground md:text-[4rem] leading-[1.02]">
                {project.name}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {project.description}
              </p>
              {project.previously && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {project.previously}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} size="sm" />
                <PlatformBadge project={project} />
                {project.tech.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>

              {(project.live || project.github) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.live && (
                    <Button
                      asChild
                      data-cursor="cta"
                      className="cta-pop font-mono"
                    >
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live app
                        <ExternalLink className="cta-arrow ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button asChild variant="outline" className="font-mono">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SocialMark id="github" size="md" className="mr-2" />
                        Source
                      </a>
                    </Button>
                  )}
                </div>
              )}

              <figure className="mt-10 overflow-hidden rounded-2xl border border-border/80 shadow-card md:mt-12">
                <div className="aspect-[16/9]">
                  <ProjectShot project={project} priority />
                </div>
              </figure>
            </motion.div>
          </div>
        </section>

        {/* The published walkthrough, as connected stages: every title and
            step below is copied from the project's own gallery record. */}
        {project.gallery && project.gallery.length > 1 && (
          <section
            className="divider-gold py-16 md:py-20"
            aria-labelledby="flow-heading"
          >
            <div className="container">
              <h2
                id="flow-heading"
                className="type-section scroll-mt-24 text-2xl text-foreground md:text-3xl"
              >
                How it works
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                The flows {project.name} actually ships, in the order a user
                meets them. Select a stage to see what it does.
              </p>
              <SystemFlow
                className="mt-8"
                stages={project.gallery.map((panel) => ({
                  title: panel.title,
                  detail: panel.caption,
                  steps: panel.lines ?? [],
                }))}
                caption="Stages as published in the project walkthrough."
              />
            </div>
          </section>
        )}

        <ProjectTimeline project={project} />

        <section className="divider-gold py-16 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-10">
              {project.problem && (
                <Reveal>
                  <h2
                    id="problem"
                    className="scroll-mt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-gold"
                  >
                    Problem
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {project.problem}
                  </p>
                </Reveal>
              )}

              {project.fullDescription && (
                <Reveal delay={40}>
                  <h2
                    id="overview"
                    className="scroll-mt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-gold"
                  >
                    Overview
                  </h2>
                  <div className="mt-4 space-y-4">
                    {project.fullDescription.split(/\n{2,}/).map((para, i) => (
                      <p
                        key={i}
                        className="text-base leading-relaxed text-muted-foreground"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </Reveal>
              )}

              {project.solution && (
                <Reveal delay={50}>
                  <h2
                    id="solution"
                    className="scroll-mt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-gold"
                  >
                    Solution
                  </h2>
                  <blockquote className="mt-4">
                    <p className="pull-quote">{project.solution}</p>
                  </blockquote>
                </Reveal>
              )}

              <Reveal delay={70}>
                <h2
                  id="built"
                  className="scroll-mt-24 font-mono text-[11px] uppercase tracking-[0.2em] text-gold"
                >
                  What I built
                </h2>
                <ul className="mt-4 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                  {project.built.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-card p-3 text-sm text-muted-foreground"
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
              </Reveal>

              <Reveal delay={120}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  Built by Andrew
                </h2>
                <div className="mt-4">
                  <BuiltBy project={project} />
                </div>
              </Reveal>
            </div>

            <Reveal delay={90}>
              <aside className="pop-card h-full rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  At a glance
                </h2>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                      <StatusDot />
                      {project.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {project.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      Focus
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {project.filters.map((f) => (
                        <TechTag key={f}>{f}</TechTag>
                      ))}
                    </dd>
                  </div>
                </dl>

                {sections.length > 1 && (
                  <nav
                    aria-label="On this page"
                    className="mt-6 border-t border-border pt-5"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                      On this page
                    </p>
                    <ol className="mt-3 grid list-none gap-1.5 p-0">
                      {sections.map((section, index) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="focus-ring flex items-baseline gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-gold"
                          >
                            <span
                              className="font-mono text-[0.6rem] text-muted-foreground/70"
                              aria-hidden="true"
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {section.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
              </aside>
            </Reveal>
          </div>
        </section>

        {project.stack && project.stack.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2
                id="stack"
                className="type-section scroll-mt-24 text-2xl text-foreground md:text-3xl"
              >
                Tech stack
              </h2>
              <ul className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
                {project.stack.map((group, i) => (
                  <Reveal
                    as="li"
                    key={group.group}
                    delay={i * 60}
                    className="h-full"
                  >
                    <div className="pop-card h-full rounded-xl border border-border bg-card p-5 shadow-card">
                      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                        {group.group}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <TechTag key={item}>{item}</TechTag>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2
                id="challenges"
                className="type-section scroll-mt-24 text-2xl text-foreground md:text-3xl"
              >
                Challenges &amp; how I solved them
              </h2>
              <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-2">
                {project.challenges.map((c, i) => (
                  <Reveal
                    as="li"
                    key={c.title}
                    delay={i * 60}
                    className="h-full"
                  >
                    <div className="pop-card h-full rounded-xl border border-border bg-card p-6 shadow-card">
                      <h3 className="text-base font-semibold text-foreground">
                        {c.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {c.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        {project.metrics && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2
                id="metrics"
                className="type-section scroll-mt-24 text-2xl text-foreground md:text-3xl"
              >
                {project.metrics.title}
              </h2>
              {project.metrics.intro && (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.metrics.intro}
                </p>
              )}
              <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {project.metrics.items.map((m, i) => (
                  <Reveal key={m.label} delay={i * 60} className="h-full">
                    <div className="pop-card h-full rounded-xl border border-gold/25 bg-card p-6 shadow-card">
                      <dd className="display-numeral text-4xl leading-none text-gold md:text-5xl">
                        {m.value}
                      </dd>
                      <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                        {m.label}
                      </dt>
                      {m.note && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {m.note}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </dl>
              {project.metrics.breakdown &&
                project.metrics.breakdown.length > 0 && (
                  <Reveal delay={120}>
                    <dl className="mt-8 grid gap-x-8 gap-y-3 rounded-xl border border-border bg-card/60 p-6 sm:grid-cols-2 lg:grid-cols-3">
                      {project.metrics.breakdown.map((b) => (
                        <div
                          key={`${b.label}-${b.value}`}
                          className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-2"
                        >
                          <dt className="text-sm text-muted-foreground">
                            {b.label}
                          </dt>
                          <dd className="font-mono text-sm text-gold">
                            {b.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                )}
              {project.metrics.source && (
                <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                  {project.metrics.source}
                </p>
              )}
            </div>
          </section>
        )}

        {project.results && project.results.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2
                id="results"
                className="type-section scroll-mt-24 text-2xl text-foreground md:text-3xl"
              >
                Results so far
              </h2>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {project.results.map((r, i) => (
                  <Reveal key={r.label} delay={i * 60} className="h-full">
                    <div className="pop-card h-full rounded-xl border border-border bg-card p-5 shadow-card">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {r.label}
                      </dt>
                      <dd className="mt-2">
                        <span className="block text-lg font-semibold text-gold">
                          {r.value}
                        </span>
                        {r.note && (
                          <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                            {r.note}
                          </span>
                        )}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2 className="type-section text-2xl text-foreground md:text-3xl">
                Related work
              </h2>
              <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-3">
                {others.map((p, i) => (
                  <Reveal
                    as="li"
                    key={p.slug}
                    delay={i * 60}
                    className="h-full"
                  >
                    <Link
                      to={`/projects/${p.slug}`}
                      className="pop-card focus-ring flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card"
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                        {p.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Open case
                        <ArrowRight
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
