import { useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { FilterBar } from "./FilterBar";
import { getProjectPlatforms, platformFilters } from "./BuiltBy";
import { ecosystemProjects, projectFilters, type Project } from "@/data/portfolio";

interface ProjectGridProps {
  projects?: Project[];
}

export function ProjectGrid({ projects = ecosystemProjects }: ProjectGridProps) {
  const [active, setActive] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const visible = useMemo(
    () =>
      projects.filter((project) => {
        const techMatch = active === "All" || project.filters.includes(active);
        const platformMatch =
          platform === "All" || getProjectPlatforms(project).includes(platform);
        return techMatch && platformMatch;
      }),
    [active, platform, projects],
  );

  const openProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-8 space-y-3">
        <FilterBar
          label="Filter projects by technology"
          legend="Tech"
          options={projectFilters}
          value={active}
          onChange={setActive}
        />
        <FilterBar
          label="Filter projects by platform"
          legend="Platform"
          options={platformFilters}
          value={platform}
          onChange={setPlatform}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown.
      </p>

      {visible.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          No projects match these filters yet.
        </p>
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
