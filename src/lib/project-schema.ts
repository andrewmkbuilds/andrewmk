// Structured data for the project catalogue: an ItemList of SoftwareApplication
// entries, each carrying its stack and the platform it was built with.
import { AUTHOR, SITE_URL } from "@/data/seo";
import { allProjects, featuredProjects, type Project } from "@/data/portfolio";

const PLATFORM_LABEL: Record<NonNullable<Project["platform"]>, string> = {
  base44: "Base44",
  lovable: "Lovable",
};

const STATUS_LABEL: Record<string, string> = {
  Live: "https://schema.org/InStock",
};

export function projectJsonLd(project: Project, pagePath: string) {
  const platform = project.platform ? PLATFORM_LABEL[project.platform] : undefined;

  return {
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    applicationCategory: project.category,
    url: project.live ?? `${SITE_URL}${pagePath}#${project.slug}`,
    ...(project.github ? { codeRepository: project.github } : {}),
    author: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
    creator: { "@type": "Person", name: AUTHOR, url: `${SITE_URL}/` },
    operatingSystem: "Web",
    keywords: [...project.tech, ...(platform ? [`Built with ${platform}`] : [])].join(", "),
    featureList: project.built,
    ...(platform
      ? {
          isBasedOn: { "@type": "SoftwareApplication", name: platform },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Build platform", value: platform },
            { "@type": "PropertyValue", name: "Stack", value: project.tech.join(", ") },
            { "@type": "PropertyValue", name: "Status", value: project.status },
          ],
        }
      : {
          additionalProperty: [
            { "@type": "PropertyValue", name: "Stack", value: project.tech.join(", ") },
            { "@type": "PropertyValue", name: "Status", value: project.status },
          ],
        }),
    ...(STATUS_LABEL[project.status]
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: STATUS_LABEL[project.status] } }
      : {}),
  };
}

export function projectItemListJsonLd(
  projects: Project[],
  pagePath: string,
  name: string,
  description: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: `${SITE_URL}${pagePath}`,
    numberOfItems: projects.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: project.live ?? `${SITE_URL}${pagePath}#${project.slug}`,
      item: projectJsonLd(project, pagePath),
    })),
  };
}

export const allProjectsJsonLd = () =>
  projectItemListJsonLd(
    allProjects,
    "/projects",
    "Projects by Andrew Mathews",
    "Software, AI systems, tools and experiments built by Andrew Mathews, with stack and build platform for each.",
  );

export const featuredProjectsJsonLd = () =>
  projectItemListJsonLd(
    featuredProjects,
    "/work",
    "Featured work by Andrew Mathews",
    "Selected products built by Andrew Mathews, with stack and build platform for each.",
  );
