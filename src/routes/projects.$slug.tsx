import { createFileRoute, notFound } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";
import { allProjects } from "@/data/portfolio";
import { projectJsonLd } from "@/lib/project-schema";
import { SITE_NAME, SITE_URL, ogImagePath } from "@/data/seo";

function findProject(slug: string) {
  return allProjects.find((p) => p.slug === slug);
}

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ params }) => {
    const project = findProject(params.slug);
    if (!project) {
      return {
        meta: [{ title: `Project not found | ${SITE_NAME}` }, { name: "robots", content: "noindex" }],
      };
    }

    const url = `${SITE_URL}/projects/${project.slug}`;
    const image = `${SITE_URL}${ogImagePath("/projects")}`;
    const title = `${project.name} — ${project.category} | ${SITE_NAME}`;
    const description = project.description.slice(0, 155);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(projectJsonLd(project, `/projects/${project.slug}`)),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { slug } = Route.useLoaderData();
  const project = findProject(slug);
  if (!project) return <NotFound />;
  return <ProjectDetail project={project} />;
}
