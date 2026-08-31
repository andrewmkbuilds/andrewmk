import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { routeHead } from "@/lib/route-head";
import { allProjectsJsonLd } from "@/lib/project-schema";

export const Route = createFileRoute("/projects/")({
  head: () => {
    const base = routeHead("/projects");
    return {
      ...base,
      scripts: [
        ...base.scripts,
        { type: "application/ld+json", children: JSON.stringify(allProjectsJsonLd()) },
      ],
    };
  },
  component: Projects,
});
