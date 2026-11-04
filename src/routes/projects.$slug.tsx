import { createFileRoute, notFound } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";
import { allProjects, type Project } from "@/data/portfolio";
import {
  getPublishedProject,
  listPublishedProjects,
} from "@/lib/projects.functions";
import { projectJsonLd } from "@/lib/project-schema";
import {
  SITE_NAME,
  SITE_URL,
  clampMetaDescription,
  ogImagePath,
} from "@/data/seo";

function staticProject(slug: string) {
  return allProjects.find((p) => p.slug === slug);
}

/** Lowercase a sentence start without mangling an acronym ("AI-powered"). */
function lowerFirst(text: string) {
  return /^[A-Z]{2}/.test(text)
    ? text
    : `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

/** Absolute URL for an image reference that may be site-relative. */
function absolute(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({
    params,
  }): Promise<{ project: Project; catalogue: Project[] }> => {
    let project: Project | null = null;
    let catalogue: Project[] = allProjects;

    try {
      project = await getPublishedProject({ data: { slug: params.slug } });
      const all = await listPublishedProjects();
      if (all.length > 0) catalogue = all;
    } catch {
      project = null;
    }

    project = project ?? staticProject(params.slug) ?? null;
    if (!project) throw notFound();
    return { project, catalogue };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Project not found | ${SITE_NAME}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { project } = loaderData;
    const url = `${SITE_URL}/projects/${project.slug}`;
    const canonical = project.seo?.canonical || url;
    // Social scrapers cannot render SVG, so a bespoke preview artwork is not
    // advertised as a share card; those routes use the generated og:image.
    const shareable = !project.screenshot.endsWith(".svg")
      ? absolute(project.screenshot)
      : undefined;
    const image =
      absolute(project.seo?.ogImage) ??
      shareable ??
      `${SITE_URL}${ogImagePath("/projects")}`;
    // Keep the indexed name in every project title, but stay inside the ~70
    // character budget: the category is dropped when the full form overflows.
    const withCategory = `${project.name} | ${project.category} by ${SITE_NAME}`;
    const title =
      project.seo?.title ||
      (withCategory.length <= 70
        ? withCategory
        : `${project.name} by ${SITE_NAME}`);
    const description = clampMetaDescription(
      project.seo?.description ||
        `${project.name} is ${lowerFirst(project.description)}`,
    );

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "en_GB" },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: project.name },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: project.name },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            ...projectJsonLd(project, `/projects/${project.slug}`),
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${SITE_URL}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Projects",
                item: `${SITE_URL}/projects`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: project.name,
                item: url,
              },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { project, catalogue } = Route.useLoaderData();
  return <ProjectDetail project={project} catalogue={catalogue} />;
}
