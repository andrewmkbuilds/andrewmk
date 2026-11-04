/**
 * The public data API, declared once.
 *
 * `scripts/generate-public-data.ts` writes these files from the same content
 * that powers the pages; `/developers` and `/openapi.json` are generated from
 * this registry too, so the documentation cannot describe endpoints that do
 * not exist. Nothing private (env values, unpublished rows, contact messages)
 * is ever listed here.
 */

export const API_VERSION = "v1";

export interface ApiResource {
  /** File name under /data/v1, without `.json`. */
  id: string;
  path: string;
  description: string;
  /** Top-level fields, in the order the generator writes them. */
  fields: string[];
  /** Absolute URL filled in by the generator and the docs page. */
  url?: string;
}

export const apiResources: ApiResource[] = [
  {
    id: "index",
    path: "/data/v1/index.json",
    description:
      "Catalog of every endpoint in this version, with the site URL and generation date.",
    fields: ["version", "generatedAt", "site", "resources", "docs"],
  },
  {
    id: "profile",
    path: "/data/v1/profile.json",
    description:
      "Identity, positioning line, school, location, quick stats, working principles, focus areas and public profiles.",
    fields: [
      "name",
      "practice",
      "identity",
      "title",
      "school",
      "location",
      "stats",
      "principles",
      "focus",
      "links",
      "contact",
    ],
  },
  {
    id: "projects",
    path: "/data/v1/projects.json",
    description:
      "Every documented project as a summary record, with links to its case study and its own JSON endpoint.",
    fields: ["count", "featured", "projects"],
  },
  {
    id: "project",
    path: "/data/v1/projects/{slug}.json",
    description:
      "One project in full: problem, stack, features, challenges, results, status, live and source links.",
    fields: [
      "slug",
      "name",
      "category",
      "description",
      "problem",
      "status",
      "live",
      "github",
      "platform",
      "tech",
      "built",
      "stack",
      "features",
      "challenges",
      "results",
      "metrics",
      "caseStudy",
    ],
  },
  {
    id: "recognition",
    path: "/data/v1/recognition.json",
    description:
      "Competition results, Model United Nations results and verified credentials. MUN recognition is limited to Verbal Commendation.",
    fields: [
      "competitionResults",
      "munResults",
      "achievementGroups",
      "verifiedCredentials",
      "munAwardPolicy",
    ],
  },
  {
    id: "experience",
    path: "/data/v1/experience.json",
    description:
      "The published chronology: milestones, seasons and exhibitions, in the site's own wording.",
    fields: ["timeline", "fllSeasons", "exhibitions"],
  },
  {
    id: "resources",
    path: "/data/v1/resources.json",
    description:
      "Skills taxonomy, certification groups, the certificate list and the areas Andrew builds in.",
    fields: ["skills", "certificationGroups", "certificates", "buildAreas"],
  },
  {
    id: "faq",
    path: "/data/v1/faq.json",
    description:
      "The FAQ, word for word as it appears on /faq, with the page each answer comes from.",
    fields: ["count", "faq"],
  },
];

/** The machine-readable entry points that are not JSON API resources. */
export const machineReadable = [
  {
    path: "/llms.txt",
    label: "llms.txt",
    type: "text/plain",
    description: "Concise overview of the site for language models.",
  },
  {
    path: "/llms-full.txt",
    label: "llms-full.txt",
    type: "text/plain",
    description: "The site's public information as one plain-text document.",
  },
  {
    path: "/agents.md",
    label: "agents.md",
    type: "text/markdown",
    description: "How an AI assistant should describe Andrew and this site.",
  },
  {
    path: "/openapi.json",
    label: "openapi.json",
    type: "application/json",
    description: "OpenAPI 3.1 description of the /data/v1 API.",
  },
  {
    path: "/.well-known/api-catalog",
    label: "API catalog",
    type: "application/linkset+json",
    description: "Discovery catalog (RFC 9727 linkset) for the public API.",
  },
  {
    path: "/sitemap.xml",
    label: "sitemap.xml",
    type: "application/xml",
    description: "Every indexable page.",
  },
  {
    path: "/sitemap.md",
    label: "sitemap.md",
    type: "text/markdown",
    description: "The sitemap as a Markdown directory.",
  },
];
