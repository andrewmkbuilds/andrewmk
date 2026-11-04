import { createFileRoute } from "@tanstack/react-router";
import Profile from "@/pages/Profile";
import { routeHead } from "@/lib/route-head";
import { profilePageJsonLd } from "@/data/seo";

export const Route = createFileRoute("/profile")({
  head: () => {
    const base = routeHead("/profile");
    return {
      ...base,
      scripts: [
        ...base.scripts,
        {
          type: "application/ld+json",
          children: JSON.stringify(profilePageJsonLd()),
        },
      ],
    };
  },
  component: Profile,
});
