import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { deletePost, listAllPosts, savePost, type BlogPost } from "@/lib/blog.functions";
import AdminShell from "@/components/admin/AdminShell";
import MediaPicker from "@/components/admin/MediaPicker";
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
  cover_image_alt: string;
  author: string;
  category: string;
  featured: boolean;
  archived: boolean;
  published: boolean;
  publish_at: string;
  reading_minutes: number;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  og_image: string;
}

const EMPTY: Draft = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  cover_image: "",
  cover_image_alt: "",
  author: "Andrew Mathews",
  category: "",
  featured: false,
  archived: false,
  published: false,
  publish_at: "",
  reading_minutes: 3,
  seo_title: "",
  seo_description: "",
  canonical_url: "",
  og_image: "",
};

/** ISO timestamp -> value for <input type="datetime-local">. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDraft(post: BlogPost): Draft {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.join(", "),
    cover_image: post.cover_image ?? "",
    cover_image_alt: post.cover_image_alt ?? "",
    author: post.author || "Andrew Mathews",
    category: post.category ?? "",
    featured: post.featured,
    archived: post.archived,
    published: post.published,
    publish_at: toLocalInput(post.scheduled_at ?? post.published_at),
    reading_minutes: post.reading_minutes,
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
    canonical_url: post.canonical_url ?? "",
    og_image: post.og_image ?? "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function statusLabel(post: BlogPost) {
  if (post.archived) return "Archived";
  if (!post.published) return "Draft";
  if (post.scheduled_at && new Date(post.scheduled_at).getTime() > Date.now()) return "Scheduled";
  return "Published";
}

export default function AdminBlog() {
  const fetchPosts = useServerFn(listAllPosts);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const posts = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: () => fetchPosts(),
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
          cover_image_alt: draft.cover_image_alt,
          author: draft.author,
          category: draft.category,
          featured: draft.featured,
          archived: draft.archived,
          published: draft.published,
          publish_at: draft.publish_at ? new Date(draft.publish_at).toISOString() : null,
          reading_minutes: draft.reading_minutes,
          seo_title: draft.seo_title || null,
          seo_description: draft.seo_description || null,
          canonical_url: draft.canonical_url || null,
          og_image: draft.og_image || null,
        },
      }),
    onSuccess: (post) => {
      setError(null);
      setDraft(toDraft(post));
      void queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
    onError: (e: unknown) => setError(e instanceof Error ? e.message : "Could not save post."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setDraft(EMPTY);
      void queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    },
  });

  return (
    <AdminShell
      title="Blog"
      description="Write, schedule and publish posts. Drafts stay private until you publish them."
      actions={
        <Button variant="outline" className="font-mono" onClick={() => setDraft(EMPTY)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New post
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6"
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
              <Label htmlFor="slug">Web address (slug)</Label>
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
            <Label htmlFor="content">Content (## heading, - bullet, 1. list)</Label>
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
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MediaPicker
              id="cover"
              label="Cover image"
              value={draft.cover_image}
              onChange={(url) => setDraft((d) => ({ ...d, cover_image: url }))}
            />
            <div>
              <Label htmlFor="cover-alt">Cover image description (alt text)</Label>
              <Input
                id="cover-alt"
                value={draft.cover_image_alt}
                onChange={(e) => setDraft((d) => ({ ...d, cover_image_alt: e.target.value }))}
              />
            </div>
          </div>

          <fieldset className="rounded-lg border border-border p-4">
            <legend className="px-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Search engines
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="seo-title">SEO title (optional)</Label>
                <Input
                  id="seo-title"
                  value={draft.seo_title}
                  onChange={(e) => setDraft((d) => ({ ...d, seo_title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="canonical">Canonical URL (optional)</Label>
                <Input
                  id="canonical"
                  value={draft.canonical_url}
                  onChange={(e) => setDraft((d) => ({ ...d, canonical_url: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="seo-desc">SEO description (optional)</Label>
                <Textarea
                  id="seo-desc"
                  rows={2}
                  value={draft.seo_description}
                  onChange={(e) => setDraft((d) => ({ ...d, seo_description: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <MediaPicker
                  id="og-image"
                  label="Social share image (optional)"
                  value={draft.og_image}
                  onChange={(url) => setDraft((d) => ({ ...d, og_image: url }))}
                />
              </div>
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="publish-at">Publish date and time</Label>
              <Input
                id="publish-at"
                type="datetime-local"
                value={draft.publish_at}
                onChange={(e) => setDraft((d) => ({ ...d, publish_at: e.target.value }))}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty to publish immediately. A future time schedules the post.
              </p>
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={draft.author}
                onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--gold)]"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--gold)]"
                checked={draft.featured}
                onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--gold)]"
                checked={draft.archived}
                onChange={(e) => setDraft((d) => ({ ...d, archived: e.target.checked }))}
              />
              Archived
            </label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="font-mono" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Save post
            </Button>
            {draft.slug && (
              <Button asChild type="button" variant="outline" className="font-mono">
                <a href={`/blog/${draft.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Preview
                </a>
              </Button>
            )}
            {draft.id && (
              <Button
                type="button"
                variant="outline"
                className="font-mono"
                onClick={() => draft.id && deleteMutation.mutate(draft.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
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
                    {statusLabel(post)} · /{post.slug}
                  </span>
                </button>
              </li>
            ))}
            {posts.isLoading && <li className="text-sm text-muted-foreground">Loading…</li>}
          </ul>
        </aside>
      </div>
    </AdminShell>
  );
}
