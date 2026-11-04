import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import { indexableRoutes } from "@/data/seo";
import { allProjects } from "@/data/portfolio";
import { SiteIndexDrawer } from "@/components/ui/SiteIndexDrawer";
import { Search } from "lucide-react";

/**
 * The directory. Route metadata comes from `src/data/seo.ts`, so a page added
 * there appears here — and in sitemap.xml — without a second list to maintain.
 */

const sections: { title: string; paths: string[] }[] = [
  { title: "Home", paths: ["/"] },
  {
    title: "About",
    paths: [
      "/about",
      "/journey",
      "/now",
      "/achievements",
      "/press-kit",
      "/faq",
      "/colophon",
    ],
  },
  { title: "Work", paths: ["/projects"] },
  { title: "Experience", paths: ["/resume", "/profile", "/skills"] },
  { title: "Writing", paths: ["/blog"] },
  { title: "Contact", paths: ["/contact"] },
  { title: "Technical and legal", paths: ["/sitemap", "/developers"] },
];

export default function Sitemap() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();

  const pages = useMemo(
    () =>
      indexableRoutes.map((route) => ({
        path: route.path,
        label: route.label,
        description: route.description,
      })),
    [],
  );

  const matches = (label: string, description: string, path: string) =>
    !term || `${label} ${description} ${path}`.toLowerCase().includes(term);

  const grouped = sections
    .map((section) => ({
      title: section.title,
      entries: pages.filter(
        (page) =>
          section.paths.includes(page.path) &&
          matches(page.label, page.description, page.path),
      ),
    }))
    .filter((section) => section.entries.length > 0);

  const listed = new Set([...sections.flatMap((s) => s.paths)]);
  const unlisted = pages.filter(
    (page) =>
      !listed.has(page.path) &&
      matches(page.label, page.description, page.path),
  );

  const projects = allProjects.filter((project) =>
    matches(project.name, project.description, project.category),
  );

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
              Sitemap
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
              Every page, in{" "}
              <em className="serif-display mark-underline italic text-gold">
                one place
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              A searchable directory of the site. Machines should use{" "}
              <a href="/sitemap.xml" className="link-underline text-gold">
                sitemap.xml
              </a>{" "}
              or{" "}
              <a href="/sitemap.md" className="link-underline text-gold">
                sitemap.md
              </a>
              .
            </p>
          </Reveal>

          {/* The directory as a two-panel drawer: the menu button opens a
              full-screen index; hovering a category reveals its pages. */}
          <div className="mt-10">
            <SiteIndexDrawer />
          </div>

          <Reveal delay={80} className="mt-10 max-w-md">
            <label htmlFor="sitemap-search" className="sr-only">
              Search pages
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="sitemap-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter pages and projects"
                className="focus-ring w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div className="space-y-10">
              {grouped.map((section) => (
                <Reveal key={section.title}>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {section.title}
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {section.entries.map((entry) => (
                      <li key={entry.path}>
                        <Link
                          to={entry.path}
                          className="link-underline font-medium text-foreground"
                        >
                          {entry.label}
                        </Link>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {entry.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              {unlisted.length > 0 && (
                <Reveal>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    More
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {unlisted.map((entry) => (
                      <li key={entry.path}>
                        <Link
                          to={entry.path}
                          className="link-underline font-medium text-foreground"
                        >
                          {entry.label}
                        </Link>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            <div>
              <Reveal>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Project case studies
                </h2>
                <ul className="mt-4 space-y-2">
                  {projects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="link-underline text-foreground"
                      >
                        {project.name}
                      </Link>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {project.category}
                      </span>
                    </li>
                  ))}
                  {projects.length === 0 && (
                    <li className="text-sm text-muted-foreground">
                      No case studies match “{query}”.
                    </li>
                  )}
                </ul>
              </Reveal>

              <Reveal delay={60} className="mt-10">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Machine-readable
                </h2>
                <ul className="mt-4 space-y-2 font-mono text-sm">
                  {[
                    "/sitemap.xml",
                    "/sitemap.md",
                    "/llms.txt",
                    "/llms-full.txt",
                    "/agents.md",
                    "/openapi.json",
                    "/data/v1/index.json",
                  ].map((path) => (
                    <li key={path}>
                      <a href={path} className="link-underline text-foreground">
                        {path}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {grouped.length === 0 && projects.length === 0 && (
            <p className="mt-10 text-sm text-muted-foreground">
              Nothing matches “{query}”.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
