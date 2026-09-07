import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { routeHead } from "@/lib/route-head";
import { allProjectsJsonLd } from "@/lib/project-schema";
import { listPublishedProjects } from "@/lib/projects.functions";
import { ecosystemProjects, featuredProjects, type Project } from "@/data/portfolio";

export const Route = createFileRoute("/projects/")({
  loader: async (): Promise<{ featured: Project[]; ecosystem: Project[] }> => {
    try {
      const projects = await listPublishedProjects();
      if (projects.length === 0) return { featured: featuredProjects, ecosystem: ecosystemProjects };
      return {
        featured: projects.filter((p) => p.featured),
        ecosystem: projects.filter((p) => !p.featured),
      };
    } catch {
      // Never let a data hiccup take the public gallery down.
      return { featured: featuredProjects, ecosystem: ecosystemProjects };
    }
  },
  head: () => {
    const base = routeHead("/projects");
    return {
      ...base,
      scripts: [
        ...base.scripts,
        { type: "application/ld+json", children: JSON.stringify(allProjectsJsonLd()) },
      ],
    };
  },
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const { featured, ecosystem } = Route.useLoaderData();
  return <Projects featured={featured} ecosystem={ecosystem} />;
}
