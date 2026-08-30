// Maps src/data/seo.ts route metadata into TanStack Start's head() shape.
// Replaces the old react-helmet-async <Seo /> component + dist prerender step:
// SSR now emits per-route titles, descriptions, canonicals, OG/Twitter tags,
// and JSON-LD directly in the initial HTML.
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbJsonLd,
  getRoute,
  ogImagePath,
  webPageJsonLd,
} from "@/data/seo";

export function routeHead(path: string) {
  const route = getRoute(path);
  const url = `${SITE_URL}${route.path}`;
  const image = `${SITE_URL}${ogImagePath(route.path)}`;

  return {
    meta: [
      { title: route.title },
      { name: "description", content: route.description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: route.title },
      { property: "og:description", content: route.description },
      { property: "og:url", content: url },
      { property: "og:type", content: route.path === "/" ? "website" : "article" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: route.title },
      { name: "twitter:description", content: route.description },
      { name: "twitter:image", content: image },
      ...(route.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(webPageJsonLd(route)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(route)) },
    ],
  };
}
