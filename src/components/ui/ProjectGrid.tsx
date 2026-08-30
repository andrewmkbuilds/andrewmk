import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { FilterBar } from "./FilterBar";
import { getProjectPlatforms, platformFilters } from "./BuiltBy";
import { ecosystemProjects, projectFilters, type Project } from "@/data/portfolio";

interface ProjectGridProps {
  projects?: Project[];
  /** Render skeleton placeholders instead of cards while data is loading. */
  loading?: boolean;
}

function ProjectCardSkeleton() {
  return (
    <div className="h-full animate-pulse rounded-xl border border-border bg-card/60 p-5">
      <div className="h-3 w-24 rounded bg-muted" />
      <div className="mt-4 h-5 w-2/3 rounded bg-muted" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-muted/70" />
        <div className="h-3 w-5/6 rounded bg-muted/70" />
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted/70" />
        <div className="h-6 w-20 rounded-full bg-muted/70" />
        <div className="h-6 w-14 rounded-full bg-muted/70" />
      </div>
    </div>
  );
}

export function ProjectGrid({ projects = ecosystemProjects, loading = false }: ProjectGridProps) {
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
        {loading ? "Loading projects." : `${visible.length} projects shown.`}
      </p>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
          <SearchX className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-4 font-mono text-sm text-foreground">No projects match these filters</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Nothing here combines{" "}
            <span className="text-foreground">{active === "All" ? "every tech" : active}</span> with{" "}
            <span className="text-foreground">
              {platform === "All" ? "every platform" : platform}
            </span>
            . Try widening one of them.
          </p>
          <Button
            variant="outline"
            className="mt-5 font-mono text-xs focus-ring"
            onClick={() => {
              setActive("All");
              setPlatform("All");
            }}
          >
            Reset filters
          </Button>
        </div>
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
