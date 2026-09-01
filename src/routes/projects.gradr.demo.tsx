import { createFileRoute } from "@tanstack/react-router";

import GradrDemo from "@/pages/GradrDemo";
import { SITE_NAME, SITE_URL, ogImagePath } from "@/data/seo";

const title = `Gradr live demo — AI resume feedback & career insights | ${SITE_NAME}`;
const description =
  "Explore Gradr in action: rubric-based resume scoring, AI mock-interview grading and career analytics, running on sample data.";
const url = `${SITE_URL}/projects/gradr/demo`;
const image = `${SITE_URL}${ogImagePath("/projects")}`;

export const Route = createFileRoute("/projects/gradr/demo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: GradrDemo,
});
