import { createFileRoute, notFound } from "@tanstack/react-router";
import BlogPostPage from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { getPublishedPost } from "@/lib/blog.functions";
import { SITE_NAME, SITE_URL, ogImagePath } from "@/data/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPublishedPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Post not found | ${SITE_NAME}` }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const url = `${SITE_URL}/blog/${post.slug}`;
    const image = post.cover_image ?? `${SITE_URL}${ogImagePath("/")}`;
    const title = `${post.title} | ${SITE_NAME}`;
    const description = (post.excerpt || post.title).slice(0, 155);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.published_at ?? "" },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            mainEntityOfPage: url,
            image,
            author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
            keywords: post.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage post={post} />;
}
