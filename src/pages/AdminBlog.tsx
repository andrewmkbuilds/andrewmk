import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

import {
  deletePost,
  listAllPosts,
  savePost,
  type BlogPost,
} from "@/lib/blog.functions";
import { getAdminStatus } from "@/lib/admin-contact.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Draft {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  cover_image: string;
  published: boolean;
  reading_minutes: number;
}

const EMPTY: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  cover_image: "",
  published: false,
  reading_minutes: 3,
};

function toDraft(post: BlogPost): Draft {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.join(", "),
    cover_image: post.cover_image ?? "",
    published: post.published,
    reading_minutes: post.reading_minutes,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function AdminBlog() {
  const fetchStatus = useServerFn(getAdminStatus);
  const fetchPosts = useServerFn(listAllPosts);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });

  const posts = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    enabled: admin.data?.isAdmin === true,
    queryFn: () => fetchPosts({ data: {} }),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: draft.id,
          slug: draft.slug || slugify(draft.title),
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          tags: draft.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          cover_image: draft.cover_image || null,
          published: draft.published,
          reading_minutes: draft.reading_minutes,
        },
      }),
    onSuccess: (post) => {
      setError(null);
      setDraft(toDraft(post));
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "Could not save post."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setDraft(EMPTY);
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  if (admin.isLoading) {
    return (
      <main className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!admin.data?.isAdmin) {
    return (
      <main className="container py-24">
        <h1 className="text-2xl font-semibold text-foreground">Not authorised</h1>
        <p className="mt-2 text-muted-foreground">This area is restricted to the site admin.</p>
      </main>
    );
  }

  return (
    <main className="container py-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Admin</p>
          <h1 className="text-display mt-2 text-3xl text-foreground">Blog editor</h1>
        </div>
        <Button variant="outline" className="font-mono" onClick={() => setDraft(EMPTY)}>
          <Plus className="mr-2 h-4 w-4" />
          New post
        </Button>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="space-y-5 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={draft.title}
                required
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: d.id || d.slug ? d.slug : slugify(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={draft.slug}
                required
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={2}
              value={draft.excerpt}
              onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="content">Content (markdown-lite: ## heading, - bullet, 1. list)</Label>
            <Textarea
              id="content"
              rows={16}
              className="font-mono text-sm"
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={draft.tags}
                onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="minutes">Reading minutes</Label>
              <Input
                id="minutes"
                type="number"
                min={1}
                max={60}
                value={draft.reading_minutes}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, reading_minutes: Number(e.target.value) || 1 }))
                }
              />
            </div>
            <div>
              <Label htmlFor="cover">Cover image URL</Label>
              <Input
                id="cover"
                value={draft.cover_image}
                onChange={(e) => setDraft((d) => ({ ...d, cover_image: e.target.value }))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--gold)]"
              checked={draft.published}
              onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
            />
            Published
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="font-mono" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save post
            </Button>
            {draft.id && (
              <Button
                type="button"
                variant="outline"
                className="font-mono"
                onClick={() => draft.id && deleteMutation.mutate(draft.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </form>

        <aside>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Posts
          </h2>
          <ul className="mt-4 list-none space-y-2 p-0">
            {(posts.data ?? []).map((post) => (
              <li key={post.id}>
                <button
                  type="button"
                  onClick={() => setDraft(toDraft(post))}
                  className="focus-ring w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-gold/40"
                >
                  <span className="block text-sm font-medium text-foreground">{post.title}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {post.published ? "Published" : "Draft"} · /{post.slug}
                  </span>
                </button>
              </li>
            ))}
            {posts.isLoading && <li className="text-sm text-muted-foreground">Loading…</li>}
          </ul>
        </aside>
      </div>
    </main>
  );
}
