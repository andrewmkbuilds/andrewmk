import { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, PenLine } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { FilterBar } from "@/components/ui/FilterBar";
import { TechTag } from "@/components/ui/TechTag";
import type { BlogPost } from "@/lib/blog.functions";

/** Fixed category taxonomy visitors can filter by. */
const BLOG_CATEGORIES = ["Project", "Personal", "Technical"] as const;

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState("All");

  // Only show categories that actually have published posts, in the canonical order.
  const options = useMemo(() => {
    const used = new Set(posts.map((p) => p.category?.trim()).filter(Boolean) as string[]);
    const present = BLOG_CATEGORIES.filter((c) => used.has(c));
    return ["All", ...present];
  }, [posts]);

  const visible = useMemo(
    () => (category === "All" ? posts : posts.filter((p) => p.category === category)),
    [category, posts],
  );

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              <span aria-hidden="true" className="hairline-gold inline-block w-8" />
              Writing
            </p>
            <h1 className="text-display text-4xl text-balance text-foreground md:text-5xl">
              Notes from the build log
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Short essays on the projects I ship, the AI experiments that work (and the ones that
              do not), and the engineering habits behind them.
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <Reveal delay={80}>
              <div className="mt-14 rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <PenLine className="mx-auto h-6 w-6 text-gold" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">No posts yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  The first article is being written. In the meantime, the projects page has the
                  full build history.
                </p>
                <Link
                  to="/projects"
                  className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-gold"
                >
                  Browse projects
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              <Reveal delay={60}>
                <FilterBar
                  label="Filter posts by category"
                  legend="Category"
                  options={options}
                  value={category}
                  onChange={setCategory}
                  className="mt-10"
                />
              </Reveal>
              <p aria-live="polite" className="sr-only">
                {visible.length} posts shown
              </p>
              {visible.length === 0 ? (
                <Reveal delay={80}>
                  <div className="mt-14 rounded-xl border border-dashed border-border bg-card p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      No posts in this category yet.
                    </p>
                  </div>
                </Reveal>
              ) : (
                <ul className="mt-10 grid list-none gap-6 p-0 md:grid-cols-2">
                  {visible.map((post, i) => (
                    <Reveal as="li" key={post.id} delay={Math.min(i, 6) * 70} className="h-full">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="pop-card focus-ring flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card"
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      <time dateTime={post.published_at ?? undefined} className="text-gold">
                        {formatDate(post.published_at)}
                      </time>
                      <span aria-hidden="true" className="hairline-gold h-px flex-1" />
                      {post.category && <span className="text-gold/90">{post.category}</span>}
                      <span>{post.reading_minutes} min read</span>
                    </div>
                    <h2 className="text-display mt-4 text-xl text-foreground md:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <TechTag key={tag}>{tag}</TechTag>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Read post
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
