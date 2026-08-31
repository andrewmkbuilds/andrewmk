import { Link } from "@/lib/router-compat";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { TechTag } from "@/components/ui/TechTag";
import { BuiltBy, PlatformBadge } from "@/components/ui/BuiltBy";
import { StatusDot } from "@/components/ui/StatusDot";
import { allProjects, type Project } from "@/data/portfolio";

interface ProjectDetailProps {
  project: Project;
}

function related(project: Project) {
  return allProjects
    .filter((p) => p.slug !== project.slug && p.filters.some((f) => project.filters.includes(f)))
    .slice(0, 3);
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const others = related(project);

  return (
    <Layout>
      <article>
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
                <span aria-hidden="true" className="hairline-gold inline-block w-8" />
                {project.category}
              </p>
              <h1 className="text-display mt-4 text-4xl text-balance text-foreground md:text-6xl">
                {project.name}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {project.description}
              </p>
              {project.previously && (
                <p className="mt-2 font-mono text-xs text-muted-foreground">{project.previously}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <PlatformBadge project={project} />
                {project.tech.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>

              {(project.live || project.github) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.live && (
                    <Button asChild className="cta-pop font-mono">
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        Live app
                        <ExternalLink className="cta-arrow ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button asChild variant="outline" className="font-mono">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Source
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="divider-gold py-16 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-10">
              {project.problem && (
                <Reveal>
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                    Problem
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {project.problem}
                  </p>
                </Reveal>
              )}

              <Reveal delay={70}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                  What I built
                </h2>
                <ul className="mt-4 grid list-none gap-2.5 p-0 sm:grid-cols-2">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-card p-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" />
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
                    <dd className="mt-1 text-sm font-medium text-foreground">{project.category}</dd>
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
              </aside>
            </Reveal>
          </div>
        </section>

        {others.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2 className="text-display text-2xl text-foreground md:text-3xl">Related work</h2>
              <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-3">
                {others.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={i * 60} className="h-full">
                    <Link
                      to={`/projects/${p.slug}`}
                      className="pop-card focus-ring flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card"
                    >
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                        {p.category}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">{p.name}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Open case
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
