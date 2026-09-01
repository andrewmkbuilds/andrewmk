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

              {(project.live || project.github || project.demo) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.demo && (
                    <Button asChild className="cta-pop font-mono">
                      <Link to={project.demo}>
                        Try the live demo
                        <ArrowRight className="cta-arrow ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
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

        {project.gallery && project.gallery.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2 className="text-display text-2xl text-foreground md:text-3xl">
                Inside the product
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                The main screens and what each one does.
              </p>
              <ul className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2">
                {project.gallery.map((shot, i) => (
                  <Reveal as="li" key={shot.title} delay={i * 60} className="h-full">
                    <figure className="pop-card m-0 flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background/60">
                        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
                        <div
                          className="pointer-events-none absolute -top-16 left-1/3 h-40 w-56 rounded-full bg-primary/15 blur-[70px]"
                          aria-hidden="true"
                        />
                        <div className="relative flex h-full flex-col p-4">
                          <div className="flex items-center gap-1.5" aria-hidden="true">
                            <span className="h-2 w-2 rounded-full bg-gold/70" />
                            <span className="h-2 w-2 rounded-full bg-primary/60" />
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              {project.name} · {shot.title}
                            </span>
                          </div>
                          <div className="mt-4 grid flex-1 content-start gap-2">
                            {(shot.lines ?? []).map((line) => (
                              <div
                                key={line}
                                className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-card/70 px-3 py-2"
                              >
                                <span className="truncate font-mono text-[11px] text-muted-foreground">
                                  {line}
                                </span>
                                <span
                                  className="h-1.5 w-10 rounded-full bg-gold/50"
                                  aria-hidden="true"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <figcaption className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-semibold text-foreground">{shot.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {shot.caption}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )}

        {project.stack && project.stack.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2 className="text-display text-2xl text-foreground md:text-3xl">Tech stack</h2>
              <ul className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
                {project.stack.map((group, i) => (
                  <Reveal as="li" key={group.group} delay={i * 60} className="h-full">
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
              <h2 className="text-display text-2xl text-foreground md:text-3xl">
                Challenges &amp; how I solved them
              </h2>
              <ul className="mt-8 grid list-none gap-5 p-0 md:grid-cols-2">
                {project.challenges.map((c, i) => (
                  <Reveal as="li" key={c.title} delay={i * 60} className="h-full">
                    <div className="pop-card h-full rounded-xl border border-border bg-card p-6 shadow-card">
                      <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
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

        {project.results && project.results.length > 0 && (
          <section className="divider-gold py-16 md:py-20">
            <div className="container">
              <h2 className="text-display text-2xl text-foreground md:text-3xl">Results so far</h2>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {project.results.map((r, i) => (
                  <Reveal key={r.label} delay={i * 60} className="h-full">
                    <div className="pop-card h-full rounded-xl border border-border bg-card p-5 shadow-card">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {r.label}
                      </dt>
                      <dd className="mt-2">
                        <span className="block text-lg font-semibold text-gold">{r.value}</span>
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
