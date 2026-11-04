import { createFileRoute, notFound } from "@tanstack/react-router";
import BlogPostPage from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { getPublishedPost } from "@/lib/blog.functions";
import {
  PERSON_ID,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  clampMetaDescription,
  ogImagePath,
} from "@/data/seo";

/** Absolute URL for an image reference that may be site-relative. */
function absolute(url?: string | null) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    let post: Awaited<ReturnType<typeof getPublishedPost>> = null;
    try {
      post = await getPublishedPost({ data: { slug: params.slug } });
    } catch {
      post = null; // backend unavailable → treat as not found, never crash
    }
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Post not found | ${SITE_NAME}` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const url = `${SITE_URL}/blog/${post.slug}`;
    // Dashboard overrides win, so an editor can tune a post's SERP copy and
    // share card without a deploy.
    const title =
      post.seo_title ||
      (`${post.title} | ${SITE_NAME}`.length <= 70
        ? `${post.title} | ${SITE_NAME}`
        : post.title);
    const description = clampMetaDescription(
      post.seo_description || post.excerpt || post.title,
    );
    const image =
      absolute(post.og_image) ??
      absolute(post.cover_image) ??
      `${SITE_URL}${ogImagePath("/")}`;
    const imageAlt = post.cover_image_alt || post.title;
    const canonical = post.canonical_url || url;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        {
          property: "article:published_time",
          content: post.published_at ?? "",
        },
        { property: "article:modified_time", content: post.updated_at },
        { property: "article:author", content: SITE_URL },
        { property: "article:section", content: post.category },
        { property: "og:image", content: image },
        { property: "og:image:alt", content: imageAlt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: imageAlt },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: post.title,
            description,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            image: [image],
            author: {
              "@type": "Person",
              "@id": PERSON_ID,
              name: SITE_NAME,
              url: `${SITE_URL}/`,
            },
            publisher: { "@id": PERSON_ID },
            isPartOf: { "@id": WEBSITE_ID },
            inLanguage: "en",
            articleSection: post.category,
            keywords: post.tags.join(", "),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${SITE_URL}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${SITE_URL}/blog`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: url,
              },
            ],
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
