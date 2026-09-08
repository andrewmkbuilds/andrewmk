import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Eye, Loader2, Plus, Save, Trash2 } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  deleteProject,
  listAllProjects,
  saveProject,
  type CmsProject,
  type ProjectInput,
} from "@/lib/projects.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Draft = ProjectInput;

const EMPTY: Draft = {
  slug: "",
  name: "",
  category: "",
  description: "",
  full_description: "",
  problem: "",
  solution: "",
  features: [],
  process: "",
  learned: "",
  built: [],
  tech: [],
  filters: [],
  status: "Building",
  live: "",
  github: "",
  demo: "",
  previously: "",
  platform: null,
  stack: null,
  challenges: null,
  results: null,
  gallery: null,
  metrics: null,
  featured: false,
  featured_image: "",
  image_alt: "",
  images: [],
  start_date: "",
  end_date: "",
  sort_order: 0,
  published: false,
  archived: false,
  seo_title: "",
  seo_description: "",
  canonical_url: "",
  og_image: "",
};

function toDraft(row: CmsProject): Draft {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    full_description: row.full_description,
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    features: row.features ?? [],
    process: row.process ?? "",
    learned: row.learned ?? "",
    built: row.built ?? [],
    tech: row.tech ?? [],
    filters: row.filters ?? [],
    status: row.status,
    live: row.live ?? "",
    github: row.github ?? "",
    demo: row.demo ?? "",
    previously: row.previously ?? "",
    platform: (row.platform as Draft["platform"]) ?? null,
    stack: row.stack,
    challenges: row.challenges,
    results: row.results,
    gallery: row.gallery,
    metrics: row.metrics,
    featured: row.featured,
    featured_image: row.featured_image ?? "",
    image_alt: row.image_alt ?? "",
    images: row.images ?? [],
    start_date: row.start_date ?? "",
    end_date: row.end_date ?? "",
    sort_order: row.sort_order,
    published: row.published,
    archived: row.archived,
    seo_title: row.seo_title ?? "",
    seo_description: row.seo_description ?? "",
    canonical_url: row.canonical_url ?? "",
    og_image: row.og_image ?? "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const lines = (value: string) =>
  value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function AdminProjects() {
  const fetchProjects = useServerFn(listAllProjects);
  const save = useServerFn(saveProject);
  const remove = useServerFn(deleteProject);
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const projects = useQuery<CmsProject[]>({
    queryKey: ["admin-projects"],
    queryFn: () => fetchProjects(),
  });

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const saving = useMutation({
    mutationFn: (input: Draft) => save({ data: input }),
    onSuccess: (row) => {
      setError(null);
      setDraft(toDraft(row));
      void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleting = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      setDraft(EMPTY);
      void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <AdminShell
      title="Projects"
      description="Add, edit and publish the projects that appear in your portfolio. Drafts stay hidden from visitors and search engines."
      actions={
        <Button type="button" variant="outline" size="sm" onClick={() => setDraft(EMPTY)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> New project
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            All projects
          </h2>
          {projects.isLoading ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading…
            </p>
          ) : (
            <ul className="mt-4 max-h-[32rem] list-none space-y-1 overflow-auto p-0">
              {(projects.data ?? []).map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setDraft(toDraft(row))}
                    className="focus-ring flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-background/60"
                  >
                    <span className="truncate">{row.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {row.archived ? "Arch" : row.published ? "Live" : "Draft"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <form
          className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            saving.mutate(draft);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                required
                value={draft.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    name,
                    slug: d.id ? d.slug : slugify(name),
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-slug">Web address (slug)</Label>
              <Input
                id="p-slug"
                required
                value={draft.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-category">Category</Label>
              <Input
                id="p-category"
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-status">Status</Label>
              <Input
                id="p-status"
                value={draft.status}
                onChange={(e) => set("status", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-description">Short description</Label>
            <Textarea
              id="p-description"
              rows={2}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-full">Overview</Label>
            <Textarea
              id="p-full"
              rows={5}
              value={draft.full_description}
              onChange={(e) => set("full_description", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-problem">Problem</Label>
              <Textarea
                id="p-problem"
                rows={3}
                value={draft.problem ?? ""}
                onChange={(e) => set("problem", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-solution">Solution</Label>
              <Textarea
                id="p-solution"
                rows={3}
                value={draft.solution ?? ""}
                onChange={(e) => set("solution", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p-built">What I built (one per line)</Label>
              <Textarea
                id="p-built"
                rows={4}
                value={draft.built.join("\n")}
                onChange={(e) => set("built", lines(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-tech">Tech (one per line)</Label>
              <Textarea
                id="p-tech"
                rows={4}
                value={draft.tech.join("\n")}
                onChange={(e) => set("tech", lines(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-filters">Filter tags (one per line)</Label>
              <Textarea
                id="p-filters"
                rows={4}
                value={draft.filters.join("\n")}
                onChange={(e) => set("filters", lines(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p-live">Live link</Label>
              <Input id="p-live" value={draft.live ?? ""} onChange={(e) => set("live", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-github">GitHub link</Label>
              <Input
                id="p-github"
                value={draft.github ?? ""}
                onChange={(e) => set("github", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-demo">Demo link</Label>
              <Input id="p-demo" value={draft.demo ?? ""} onChange={(e) => set("demo", e.target.value)} />
            </div>
          </div>

          <MediaPicker
            id="p-image"
            label="Cover image"
            value={draft.featured_image ?? ""}
            onChange={(url) => set("featured_image", url)}
          />
          <div className="space-y-2">
            <Label htmlFor="p-alt">Cover image description (alt text)</Label>
            <Input
              id="p-alt"
              value={draft.image_alt ?? ""}
              onChange={(e) => set("image_alt", e.target.value)}
            />
          </div>

          <fieldset className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
            <legend className="px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
              Search engine details
            </legend>
            <div className="space-y-2">
              <Label htmlFor="p-seo-title">Title override</Label>
              <Input
                id="p-seo-title"
                value={draft.seo_title ?? ""}
                onChange={(e) => set("seo_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-seo-desc">Description override</Label>
              <Input
                id="p-seo-desc"
                value={draft.seo_description ?? ""}
                onChange={(e) => set("seo_description", e.target.value)}
              />
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.archived}
                onChange={(e) => set("archived", e.target.checked)}
              />
              Archived
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              Order
              <Input
                type="number"
                className="w-24"
                value={draft.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving.isPending} className="font-mono">
              {saving.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              Save
            </Button>
            {draft.slug ? (
              <Button asChild type="button" variant="outline">
                <a href={`/projects/${draft.slug}`} target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4" aria-hidden="true" /> Preview page
                </a>
              </Button>
            ) : null}
            {draft.id ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive"
                disabled={deleting.isPending}
                onClick={() => {
                  if (draft.id && confirm("Delete this project permanently?")) {
                    deleting.mutate(draft.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
              </Button>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </AdminShell>
  );
}
