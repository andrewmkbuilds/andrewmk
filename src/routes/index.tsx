import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";
import { routeHead } from "@/lib/route-head";
import { featuredProjectsJsonLd } from "@/lib/project-schema";

export const Route = createFileRoute("/")({
  head: () => {
    const base = routeHead("/");
    return {
      ...base,
      scripts: [
        ...base.scripts,
        { type: "application/ld+json", children: JSON.stringify(featuredProjectsJsonLd()) },
      ],
    };
  },
  component: Home,
});
