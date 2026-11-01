// Single source of truth for per-route metadata.
// Consumed by <Seo /> at runtime and by the build scripts
// (sitemap, og:image generation, prerendered head tags, SEO checks).

// The public address every canonical, OG tag, sitemap entry and JSON-LD URL uses.
// Flip DEFAULT_SITE_URL to CUSTOM_DOMAIN_URL the moment the custom domain goes live,
// or set VITE_SITE_URL to override without a code change.
export const CUSTOM_DOMAIN_URL = "https://andrewmk.is-a.dev";
export const PUBLISHED_URL = "https://andrewmk.lovable.app";
const DEFAULT_SITE_URL = CUSTOM_DOMAIN_URL;

const envSiteUrl =
  (typeof import.meta !== "undefined"
    ? (import.meta as { env?: Record<string, string> }).env?.["VITE_SITE_URL"]
    : undefined) ??
  (typeof process !== "undefined" ? process.env?.["VITE_SITE_URL"] : undefined);

export const SITE_URL = (envSiteUrl || DEFAULT_SITE_URL).replace(/\/$/, "");
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
  changefreq?:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const routes: RouteMeta[] = [
  {
    path: "/",
    label: "Home",
    title: "Andrew Mathews | Student Developer, AI Builder & Robotics Engineer",
    description:
      "Andrew Mathews is a student developer and technology builder from Dubai, UAE, creating AI applications, robotics projects, web apps, and innovative technology solutions.",
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
    path: "/skills",
    label: "Skills",
    title: "Skills | Andrew Mathews",
    description:
      "The AI, software, computer vision, robotics, product and competition capabilities behind Andrew Mathews' projects.",
    ogHeadline: "What I build with.",
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
    path: "/resume",
    label: "Résumé",
    title: "Résumé | Andrew Mathews",
    description:
      "The full résumé of Andrew Mathews: education, projects, STEM and MUN competition results, certificates, and technical skills.",
    ogHeadline: "Education, projects, competitions, certificates.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/profile",
    label: "Profile",
    title: "Profile | Andrew Mathews",
    description:
      "A profile view of Andrew Mathews — about, projects, education, honors, certifications, skills, and every place to find him online.",
    ogHeadline: "Student developer, AI builder, systems thinker.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/now",
    label: "Now",
    title: "Now | Andrew Mathews",
    description:
      "What Andrew Mathews is building right now — Gradr, TerraCart, ClientFlow OS and Horizon Motorsports — plus the focus areas and principles behind them.",
    ogHeadline: "What I'm building right now.",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: "/press-kit",
    label: "Press kit",
    title: "Press kit | Andrew Mathews",
    description:
      "Copy-ready short, medium and long biographies of Andrew Mathews in first and third person, with a published fact sheet and links to his work.",
    ogHeadline: "Biographies and facts.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: "FAQ | Andrew Mathews",
    description:
      "Answers about Andrew Mathews: what he builds, the technologies he works with, his projects, his competition and MUN results, and how to get in touch.",
    ogHeadline: "Questions, answered.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/colophon",
    label: "Colophon",
    title: "Colophon | Andrew Mathews",
    description:
      "How this website is made: the application stack, design system, typefaces, motion budget, data sources and hosting.",
    ogHeadline: "How this site is made.",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/sitemap",
    label: "Sitemap",
    title: "Sitemap | Andrew Mathews",
    description:
      "Every page on the site, organised by section and searchable, with links to the XML, Markdown and machine-readable sitemaps.",
    ogHeadline: "Every page, in one place.",
    changefreq: "weekly",
    priority: "0.5",
  },
  {
    path: "/developers",
    label: "Developers",
    title: "Developers | Andrew Mathews",
    description:
      "The public read-only JSON API for this site, with the llms.txt, llms-full.txt, agents.md and OpenAPI files that make it readable by developers and AI agents.",
    ogHeadline: "The public data layer.",
    changefreq: "monthly",
    priority: "0.6",
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
  if (route.path !== "/")
    items.push({ name: route.label, item: `${SITE_URL}${route.path}` });

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
