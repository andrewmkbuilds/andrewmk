// Single source of truth for per-route metadata.
// Consumed by <Seo /> at runtime and by the build scripts
// (sitemap, og:image generation, prerendered head tags, SEO checks).

export const SITE_URL = "https://andrewmkbuilds.lovable.app";
export const SITE_NAME = "Andrew Mathews";
export const AUTHOR = "Andrew Mathews";

export interface RouteMeta {
  path: string;
  /** Short label used for breadcrumbs and the og:image eyebrow. */
  label: string;
  title: string;
  description: string;
  /** Headline rendered into the generated og:image. */
  ogHeadline: string;
  noindex?: boolean;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const routes: RouteMeta[] = [
  {
    path: "/",
    label: "Home",
    title: "Andrew Mathews | Developer · AI Builder · Systems Thinker",
    description:
      "Andrew Mathews is a student developer and AI builder from Dubai building software, AI systems, robotics projects, and real-world products.",
    ogHeadline: "I build systems that solve real problems.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/projects",
    label: "Projects",
    title: "Projects | Andrew Mathews",
    description:
      "Explore the software, AI systems, tools, and experiments Andrew Mathews has built, filterable by technology and build platform.",
    ogHeadline: "Things I've Built",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/about",
    label: "About",
    title: "About | Andrew Mathews",
    description:
      "How Andrew Mathews thinks about building: systems over features, shipping over theory, and turning ideas into working products.",
    ogHeadline: "Systems over features.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/journey",
    label: "Journey",
    title: "Journey | Andrew Mathews",
    description:
      "From a robotics programme at age 9 to shipping AI products: the timeline behind Andrew Mathews' work.",
    ogHeadline: "From robotics at 9 to shipping AI products.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/achievements",
    label: "Achievements",
    title: "Achievements | Andrew Mathews",
    description:
      "STEM competitions, engineering challenges, MUN results, and exhibitions Andrew Mathews has taken part in.",
    ogHeadline: "Competitions, results, and exhibitions.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact | Andrew Mathews",
    description:
      "Get in touch with Andrew Mathews to talk about technology, projects, collaboration, or something he is building.",
    ogHeadline: "Get in touch.",
    changefreq: "yearly",
    priority: "0.6",
  },
  {
    path: "/404",
    label: "Not found",
    title: "Page not found | Andrew Mathews",
    description: "This page isn't built yet.",
    ogHeadline: "Page not found",
    noindex: true,
  },
];

export const indexableRoutes = routes.filter((r) => !r.noindex);

export function routeSlug(path: string) {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}

export function ogImagePath(path: string) {
  return `/og/${routeSlug(path)}.png`;
}

export function getRoute(path: string): RouteMeta {
  const found = routes.find((r) => r.path === path);
  if (!found) throw new Error(`No route metadata registered for "${path}"`);
  return found;
}

export function breadcrumbJsonLd(route: RouteMeta) {
  const items = [{ name: "Home", item: `${SITE_URL}/` }];
  if (route.path !== "/") items.push({ name: route.label, item: `${SITE_URL}${route.path}` });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function webPageJsonLd(route: RouteMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: route.title,
    description: route.description,
    url: `${SITE_URL}${route.path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
    about: { "@type": "Person", name: AUTHOR },
  };
}
