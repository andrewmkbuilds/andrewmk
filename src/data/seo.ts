// Single source of truth for per-route metadata.
// Consumed by <Seo /> at runtime and by the build scripts
// (sitemap, og:image generation, prerendered head tags, SEO checks).

import {
  FULL_NAME,
  LOCATION,
  NAME_ALIASES,
  PERSON_DESCRIPTION,
  SCHOOL,
  SOCIAL_PROFILES,
  SHORT_NAME,
} from "./identity";

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
export const SITE_NAME = FULL_NAME;
export const AUTHOR = FULL_NAME;

// Stable identifiers for the entity graph. Every Person/WebSite reference in
// the structured data points at these, so a crawler resolves one person and
// one site instead of a new node per page.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export interface RouteMeta {
  path: string;
  /** Short label used for breadcrumbs and the og:image eyebrow. */
  label: string;
  title: string;
  description: string;
  /** Headline rendered into the generated og:image. */
  ogHeadline: string;
  /** Eyebrow of the og:image when it should differ from the route label. */
  ogLabel?: string;
  /** Shorter og:image copy when the meta description is too long to render. */
  ogDescription?: string;
  noindex?: boolean;
  changefreq?:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const routes: RouteMeta[] = [
  {
    path: "/",
    label: "Home",
    title: "Andrew Mathews Kalathil | 14-Year-Old Developer & AI Builder",
    description:
      "Meet Andrew Mathews Kalathil, a 14-year-old student developer from Dubai building full-stack applications, AI tools, automation systems and technology projects.",
    ogHeadline: "14-year-old developer & AI builder",
    ogLabel: "Andrew Mathews Kalathil",
    ogDescription:
      "Building full-stack applications, AI tools and automation systems from Dubai, UAE.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/projects",
    label: "Projects",
    title: "Projects by Andrew Mathews Kalathil",
    description:
      "Software, AI systems, tools and experiments built by Andrew Mathews Kalathil, with the technology stack and build platform for each project.",
    ogHeadline: "Things I've Built",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    path: "/about",
    label: "About",
    title: "About Andrew Mathews Kalathil — Developer in Dubai",
    description:
      "About Andrew Mathews Kalathil, a 14-year-old student developer in Dubai working across full-stack development, AI, automation and robotics.",
    ogHeadline: "Systems over features.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/journey",
    label: "Journey",
    title: "Andrew Mathews Kalathil — Journey & Timeline",
    description:
      "From a robotics programme at age 9 to shipping AI products at 14: the timeline behind Andrew Mathews Kalathil's work as a student developer in Dubai.",
    ogHeadline: "From robotics at 9 to shipping AI products.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/skills",
    label: "Skills",
    title: "Skills & Technologies | Andrew Mathews Kalathil",
    description:
      "The AI, software, computer-vision, robotics, product and competition capabilities behind Andrew Mathews Kalathil's projects, grouped by discipline.",
    ogHeadline: "What I build with.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/achievements",
    label: "Achievements",
    title: "Achievements | Andrew Mathews Kalathil",
    description:
      "STEM competitions, engineering challenges, MUN results and exhibitions Andrew Mathews Kalathil has taken part in, listed with their results.",
    ogHeadline: "Competitions, results, and exhibitions.",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/resume",
    label: "Résumé",
    title: "Résumé | Andrew Mathews Kalathil",
    description:
      "The full résumé of Andrew Mathews Kalathil: education, projects, STEM and MUN competition results, certificates and technical skills.",
    ogHeadline: "Education, projects, competitions, certificates.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/profile",
    label: "Profile",
    title: "Andrew Mathews Kalathil — Developer Profile",
    description:
      "A profile view of Andrew Mathews Kalathil, a 14-year-old student developer in Dubai — projects, education, honours, certifications, skills and links.",
    ogHeadline: "Student developer, AI builder, systems thinker.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/now",
    label: "Now",
    title: "Now | Andrew Mathews Kalathil",
    description:
      "What Andrew Mathews Kalathil is building right now — Gradr, TerraCart, ClientFlow OS and Horizon Motorsports — plus the focus areas behind them.",
    ogHeadline: "What I'm building right now.",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: "/press-kit",
    label: "Press kit",
    title: "Press kit | Andrew Mathews Kalathil",
    description:
      "Copy-ready short, medium and long biographies of Andrew Mathews Kalathil, with a published fact sheet and links to his work.",
    ogHeadline: "Biographies and facts.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: "FAQ | Andrew Mathews Kalathil",
    description:
      "Answers about Andrew Mathews Kalathil: what he builds, the technologies he uses, his projects, competition results and how to get in touch.",
    ogHeadline: "Questions, answered.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/colophon",
    label: "Colophon",
    title: "Colophon | Andrew Mathews Kalathil",
    description:
      "How this website is made: the application stack, design system, typefaces, motion budget, data sources and hosting behind Andrew Mathews Kalathil's portfolio.",
    ogHeadline: "How this site is made.",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/sitemap",
    label: "Sitemap",
    title: "Sitemap | Andrew Mathews Kalathil",
    description:
      "Every page on Andrew Mathews Kalathil's portfolio, organised by section and searchable, with links to the XML, Markdown and machine-readable sitemaps.",
    ogHeadline: "Every page, in one place.",
    changefreq: "weekly",
    priority: "0.5",
  },
  {
    path: "/developers",
    label: "Developers",
    title: "Developers | Andrew Mathews Kalathil",
    description:
      "The public read-only JSON API for Andrew Mathews Kalathil's portfolio, with llms.txt, llms-full.txt, agents.md and OpenAPI files for developers and AI agents.",
    ogHeadline: "The public data layer.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact | Andrew Mathews Kalathil",
    description:
      "Get in touch with Andrew Mathews Kalathil to talk about technology, projects, collaboration, or something he is building.",
    ogHeadline: "Get in touch.",
    changefreq: "yearly",
    priority: "0.6",
  },
  {
    path: "/404",
    label: "Not found",
    title: "Page not found | Andrew Mathews Kalathil",
    description: "This page isn't built yet.",
    ogHeadline: "Page not found",
    noindex: true,
  },
];

export const indexableRoutes = routes.filter((r) => !r.noindex);

/**
 * Trim a generated description to the meta budget without cutting a word in
 * half. Project summaries and blog excerpts are written for the page, not for
 * the SERP, so a bare `slice()` shipped descriptions that ended mid-word
 * ("…carry ever") or on a lonely comma.
 */
export function clampMetaDescription(value: string, max = 158): string {
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 60 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[,;:.\s]+$/, "")}…`;
}

export function routeSlug(path: string) {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}

export function ogImagePath(path: string) {
  // The homepage shares the site-wide social card served from the site root.
  return path === "/" ? "/og-image.png" : `/og/${routeSlug(path)}.png`;
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
    "@id": `${SITE_URL}${route.path}#webpage`,
    name: route.title,
    description: route.description,
    url: `${SITE_URL}${route.path}`,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    about: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTHOR,
      url: `${SITE_URL}/`,
    },
    author: { "@id": PERSON_ID },
  };
}

/**
 * The person node. Rendered once, on every route, so any page a crawler lands
 * on can resolve who the site is about. Every fact here is published visibly on
 * the homepage, About, Profile or Résumé — nothing is inferred or upgraded.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR,
    alternateName: NAME_ALIASES,
    url: `${SITE_URL}/`,
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
    description: PERSON_DESCRIPTION,
    jobTitle: "Student Developer",
    knowsAbout: [
      "Full-stack web development",
      "Artificial intelligence",
      "AI automation",
      "Computer vision",
      "Robotics",
      "Internet of Things (IoT)",
      "Cybersecurity",
      "Product design",
      "STEM engineering competitions",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    homeLocation: {
      "@type": "Place",
      name: LOCATION,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    affiliation: {
      "@type": "EducationalOrganization",
      name: SCHOOL,
    },
    sameAs: SOCIAL_PROFILES,
  };
}

/** The site node, linked to the person so the portfolio reads as his official site. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: SHORT_NAME,
    url: `${SITE_URL}/`,
    description: `The official portfolio of ${FULL_NAME}, a 14-year-old student developer and AI builder in Dubai, UAE.`,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

/** /profile is the canonical personal-profile page for the person node. */
export function profilePageJsonLd() {
  const route = getRoute("/profile");
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/profile#profilepage`,
    url: `${SITE_URL}/profile`,
    name: route.title,
    description: route.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };
}
