import { Link } from "@/lib/router-compat";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Prose } from "@/components/ui/Prose";
import { TechTag } from "@/components/ui/TechTag";
import type { BlogPost as Post } from "@/lib/blog.functions";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostPage({ post }: { post: Post }) {
  return (
    <Layout>
      <article className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <Link
            to="/blog"
            className="focus-ring inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All writing
          </Link>

          <header className="mt-8">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <time dateTime={post.published_at ?? undefined} className="text-gold">
                {formatDate(post.published_at)}
              </time>
              <span aria-hidden="true" className="hairline-gold h-px w-10" />
              <span>{post.reading_minutes} min read</span>
            </div>
            <h1 className="text-display mt-4 text-3xl text-balance text-foreground md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
            )}
            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TechTag key={tag}>{tag}</TechTag>
                ))}
              </div>
            )}
          </header>

          <div className="divider-gold mt-10 pt-10">
            <Prose content={post.content} />
          </div>
        </div>
      </article>
    </Layout>
  );
}
