import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { ecosystemProjects, projectFilters, type Project } from "@/data/portfolio";

interface ProjectGridProps {
  projects?: Project[];
}

export function ProjectGrid({ projects = ecosystemProjects }: ProjectGridProps) {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.filters.includes(active))),
    [active, projects],
  );

  const openProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
        {projectFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            aria-pressed={active === filter}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200",
              active === filter
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">No projects with this technology yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <Reveal key={project.slug} delay={Math.min(index, 6) * 50} className="h-full">
              <ProjectCard project={project} onOpen={openProject} className="h-full" />
            </Reveal>
          ))}
        </div>
      )}

      <ProjectModal project={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
