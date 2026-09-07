import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { listPublishedProjects } from "@/lib/projects.functions";
import { ecosystemProjects, featuredProjects, type Project } from "@/data/portfolio";
import { SITE_NAME, SITE_URL, ogImagePath, routeByPath } from "@/data/seo";

const meta = routeByPath("/projects");

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
    const url = `${SITE_URL}/projects`;
    const image = `${SITE_URL}${ogImagePath("/projects")}`;
    const title = meta?.title ?? `Projects | ${SITE_NAME}`;
    const description =
      meta?.description ??
      "Software, AI systems and robotics projects built by Andrew Mathews, with full case studies for each build.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const { featured, ecosystem } = Route.useLoaderData();
  return <Projects featured={featured} ecosystem={ecosystem} />;
}
