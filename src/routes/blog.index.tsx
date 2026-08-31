import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { listPublishedPosts } from "@/lib/blog.functions";
import { SITE_NAME, SITE_URL, ogImagePath } from "@/data/seo";

const title = `Blog | ${SITE_NAME}`;
const description =
  "Essays by Andrew Mathews on shipping software, AI experiments, robotics, and the engineering habits behind his projects.";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    try {
      return { posts: await listPublishedPosts() };
    } catch {
      return { posts: [] };
    }
  },
  head: () => {
    const url = `${SITE_URL}/blog`;
    const image = `${SITE_URL}${ogImagePath("/")}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogRoute,
});

function BlogRoute() {
  const { posts } = Route.useLoaderData();
  return <Blog posts={posts} />;
}
