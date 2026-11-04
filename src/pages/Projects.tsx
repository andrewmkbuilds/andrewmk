import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { PortfolioCurtain } from "@/components/ui/PortfolioCurtain";
import {
  ecosystemProjects,
  featuredProjects,
  type Project,
} from "@/data/portfolio";

interface ProjectsProps {
  /** Supplied by the route loader from the content dashboard; falls back to the built-in data. */
  featured?: Project[];
  ecosystem?: Project[];
}

export default function Projects({
  featured = featuredProjects,
  ecosystem = ecosystemProjects,
}: ProjectsProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          {/* Staggered masthead: eyebrow, then title, then standfirst. */}
          <div className="max-w-3xl">
            <Reveal>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold mb-4">
                Projects
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
                Things I&rsquo;ve{" "}
                <em className="serif-display mark-underline italic text-gold">
                  Built
                </em>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Different problems. Different systems. One constant: build it.
              </p>
            </Reveal>
          </div>

          <h2 className="sr-only">Featured projects</h2>

          {/* The flagships on a curtain rail: drag, use the arrows, or the
              arrow keys. Each slide is the project's own screenshot when the
              record publishes one, and its typographic plate when it does not. */}
          <div className="mt-10">
            <PortfolioCurtain />
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Drag, swipe or use the arrows · the four flagship builds
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={i * 70} className="h-full">
                <ProjectCard
                  project={project}
                  onOpen={openProject}
                  variant="featured"
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Ecosystem"
            title="Everything I Build Has a Purpose."
            subtitle="Systems, tools, experiments, and concepts built to solve specific problems."
          />
          <ProjectGrid projects={ecosystem} />
          <Reveal className="mt-10 font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> More systems in
            development.
          </Reveal>
        </div>
      </section>

      <ProjectModal project={selected} open={open} onOpenChange={setOpen} />
    </Layout>
  );
}
