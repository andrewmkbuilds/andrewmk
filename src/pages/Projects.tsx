import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { featuredProjects, type Project } from "@/data/portfolio";

export default function Projects() {
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
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Projects
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              Things I've Built
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Different problems. Different systems. One constant: build it.
            </p>
          </Reveal>

          <h2 className="sr-only">Featured projects</h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
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
          <ProjectGrid />
          <Reveal className="mt-10 font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> More systems in development.
          </Reveal>
        </div>
      </section>

      <ProjectModal project={selected} open={open} onOpenChange={setOpen} />
    </Layout>
  );
}
