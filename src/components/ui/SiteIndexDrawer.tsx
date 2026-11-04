import MultiLevelDrawerMenu from "@/components/annnimate/multi-level-drawer-menu";
import { indexableRoutes } from "@/data/seo";
import { projectPlate } from "@/lib/plate";

/**
 * The starter pack's two-panel drawer menu, wired to the real site index.
 *
 * Hover a primary category and the second panel slides in with that section's
 * pages; every sub-link is a real route (see the small adaptation in the
 * vendored component that renders anchors instead of buttons). Below `md` the
 * pack's own drill-down takes over, so the same structure works on touch.
 */
const groups = [
  {
    id: "work",
    label: "Work",
    paths: ["/projects", "/journey", "/achievements", "/press-kit"],
  },
  {
    id: "about",
    label: "About",
    paths: ["/about", "/now", "/faq", "/colophon"],
  },
  {
    id: "experience",
    label: "Experience",
    paths: ["/resume", "/profile", "/skills"],
  },
  { id: "writing", label: "Writing", paths: ["/blog"] },
  {
    id: "technical",
    label: "Technical",
    paths: ["/developers", "/sitemap", "/contact"],
  },
];

function labelFor(path: string) {
  return (
    indexableRoutes.find((route) => route.path === path)?.label ??
    path.replace("/", "")
  );
}

export function SiteIndexDrawer({ className = "" }: { className?: string }) {
  const primaries = groups.map((group) => ({
    id: group.id,
    label: group.label,
  }));

  const sublists = Object.fromEntries(
    groups.map((group) => [
      group.id,
      group.paths.map((path) => ({ label: labelFor(path), href: path })),
    ]),
  );

  return (
    <MultiLevelDrawerMenu
      className={`anm-drawer ${className}`.trim()}
      panelBg="#12202f"
      duration={0.7}
      logo="AndrewBuilds"
      primaries={primaries}
      sublists={sublists}
      secondaryLinks={[
        { label: "Résumé", href: "/resume" },
        { label: "Contact", href: "/contact" },
      ]}
      cards={[
        {
          src: projectPlate("Projects", "The work", 1),
          alt: "Projects index plate",
          label: "Projects",
          href: "/projects",
        },
        {
          src: projectPlate("Contact", "Say hello", 2),
          alt: "Contact plate",
          label: "Contact",
          href: "/contact",
        },
      ]}
      exploreHref="/sitemap"
      heroEyebrow="Site index"
      heroHeading="Every page, one place."
      heroSub="The directory, opened as a menu."
      heroImage={projectPlate("Index", "Site map", 1)}
    />
  );
}
