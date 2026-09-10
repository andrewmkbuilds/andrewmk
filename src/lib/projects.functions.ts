import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Project } from "@/data/portfolio";

/** Row shape of public.projects (the CMS table). */
export interface CmsProject {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  full_description: string;
  problem: string | null;
  solution: string | null;
  features: string[];
  process: string | null;
  learned: string | null;
  built: string[];
  tech: string[];
  filters: string[];
  status: string;
  live: string | null;
  github: string | null;
  demo: string | null;
  previously: string | null;
  platform: string | null;
  stack: { group: string; items: string[] }[] | null;
  challenges: { title: string; detail: string }[] | null;
  results: { label: string; value: string; note?: string }[] | null;
  gallery: { title: string; caption: string; lines?: string[] }[] | null;
  metrics: Project["metrics"] | null;
  featured: boolean;
  featured_image: string | null;
  image_alt: string | null;
  images: { url: string; alt?: string; caption?: string }[];
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  published: boolean;
  archived: boolean;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export const PROJECT_COLUMNS =
  "id,slug,name,category,description,full_description,problem,solution,features,process,learned,built,tech,filters,status,live,github,demo,previously,platform,stack,challenges,results,gallery,metrics,featured,featured_image,image_alt,images,start_date,end_date,sort_order,published,archived,seo_title,seo_description,canonical_url,og_image,created_at,updated_at";

/** Drops keys whose value is undefined so optional fields stay truly absent. */
function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

/** Maps a CMS row onto the shape the existing public components already render. */
export function toProject(row: CmsProject): Project {
  return compact({
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    problem: row.problem ?? undefined,
    built: row.built ?? [],
    tech: row.tech ?? [],
    status: row.status,
    live: row.live ?? undefined,
    github: row.github ?? undefined,
    demo: row.demo ?? undefined,
    filters: row.filters ?? [],
    featured: row.featured,
    previously: row.previously ?? undefined,
    platform: (row.platform as Project["platform"]) ?? undefined,
    stack: row.stack ?? undefined,
    challenges: row.challenges ?? undefined,
    results: row.results ?? undefined,
    gallery: row.gallery ?? undefined,
    metrics: row.metrics ?? undefined,
    fullDescription: row.full_description || undefined,
    solution: row.solution ?? undefined,
    features: row.features?.length ? row.features : undefined,
    process: row.process ?? undefined,
    learned: row.learned ?? undefined,
    featuredImage: row.featured_image ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    images: row.images?.length ? row.images : undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    seo: compact({
      title: row.seo_title ?? undefined,
      description: row.seo_description ?? undefined,
      canonical: row.canonical_url ?? undefined,
      ogImage: row.og_image ?? undefined,
    }),
  } as Project);
}


/** Publishable (anon) client — RLS only exposes published, non-archived rows. */
function publicClient() {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) throw new Error("Supabase public credentials are not configured.");

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input as RequestInfo, { ...init, headers });
      },
    },
  });
}

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(
  async (): Promise<Project[]> => {
    const { data, error } = await publicClient()
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("published", true)
      .eq("archived", false)
      .order("sort_order", { ascending: true })
      .limit(300);
    if (error) throw new Error("Could not load projects.");
    return ((data ?? []) as unknown as CmsProject[]).map(toProject);
  },
);

export const getPublishedProject = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(160) }).parse(data))
  .handler(async ({ data }): Promise<Project | null> => {
    const { data: row, error } = await publicClient()
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("slug", data.slug)
      .eq("published", true)
      .eq("archived", false)
      .maybeSingle();
    if (error) throw new Error("Could not load project.");
    return row ? toProject(row as unknown as CmsProject) : null;
  });

/* ---------------------------------- admin --------------------------------- */

async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

const jsonArray = <T extends z.ZodTypeAny>(schema: T) => z.array(schema).max(40).nullable().optional();

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().max(120).default(""),
  description: z.string().trim().max(600).default(""),
  full_description: z.string().max(20000).default(""),
  problem: z.string().max(6000).nullable().optional(),
  solution: z.string().max(6000).nullable().optional(),
  features: z.array(z.string().trim().min(1).max(160)).max(40).default([]),
  process: z.string().max(6000).nullable().optional(),
  learned: z.string().max(6000).nullable().optional(),
  built: z.array(z.string().trim().min(1).max(120)).max(40).default([]),
  tech: z.array(z.string().trim().min(1).max(60)).max(40).default([]),
  filters: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  status: z.string().trim().max(60).default("Building"),
  live: z.string().trim().max(400).nullable().optional(),
  github: z.string().trim().max(400).nullable().optional(),
  demo: z.string().trim().max(400).nullable().optional(),
  previously: z.string().trim().max(300).nullable().optional(),
  platform: z.enum(["base44", "lovable"]).nullable().optional(),
  stack: jsonArray(z.object({ group: z.string().max(80), items: z.array(z.string().max(80)).max(30) })),
  challenges: jsonArray(z.object({ title: z.string().max(160), detail: z.string().max(3000) })),
  results: jsonArray(
    z.object({ label: z.string().max(120), value: z.string().max(120), note: z.string().max(300).optional() }),
  ),
  gallery: jsonArray(
    z.object({
      title: z.string().max(160),
      caption: z.string().max(1200),
      lines: z.array(z.string().max(120)).max(12).optional(),
    }),
  ),
  metrics: z
    .object({
      title: z.string().max(160),
      intro: z.string().max(1200).optional(),
      source: z.string().max(400).optional(),
      items: z
        .array(
          z.object({ value: z.string().max(80), label: z.string().max(160), note: z.string().max(300).optional() }),
        )
        .max(20),
      breakdown: z.array(z.object({ label: z.string().max(160), value: z.string().max(80) })).max(30).optional(),
    })
    .nullable()
    .optional(),
  featured: z.boolean().default(false),
  featured_image: z.string().trim().max(600).nullable().optional(),
  image_alt: z.string().trim().max(300).nullable().optional(),
  images: z
    .array(
      z.object({
        url: z.string().trim().max(600),
        alt: z.string().max(300).optional(),
        caption: z.string().max(400).optional(),
      }),
    )
    .max(30)
    .default([]),
  start_date: z.string().trim().max(20).nullable().optional(),
  end_date: z.string().trim().max(20).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  seo_title: z.string().trim().max(200).nullable().optional(),
  seo_description: z.string().trim().max(320).nullable().optional(),
  canonical_url: z.string().trim().max(500).nullable().optional(),
  og_image: z.string().trim().max(600).nullable().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const listAllProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CmsProject[]> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("sort_order", { ascending: true })
      .limit(500);
    if (error) throw new Error("Could not load projects.");
    return (data ?? []) as CmsProject[];
  });

export const getProjectById = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<CmsProject | null> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { data: row, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not load project.");
    return (row as CmsProject | null) ?? null;
  });

export const saveProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => projectSchema.parse(data))
  .handler(async ({ data, context }): Promise<CmsProject> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);

    const { id, ...fields } = data;
    const payload = {
      ...fields,
      live: fields.live || null,
      github: fields.github || null,
      demo: fields.demo || null,
      previously: fields.previously || null,
      platform: fields.platform || null,
      featured_image: fields.featured_image || null,
      image_alt: fields.image_alt || null,
      start_date: fields.start_date || null,
      end_date: fields.end_date || null,
      seo_title: fields.seo_title || null,
      seo_description: fields.seo_description || null,
      canonical_url: fields.canonical_url || null,
      og_image: fields.og_image || null,
      author_id: context.userId,
    };

    const query = id
      ? supabase.from("projects").update(payload).eq("id", id)
      : supabase.from("projects").insert(payload);

    const { data: row, error } = await query.select(PROJECT_COLUMNS).single();
    if (error) throw new Error(error.message ?? "Could not save project.");
    return row as CmsProject;
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { error } = await supabase.from("projects").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete project.");
    return { ok: true };
  });

export const reorderProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ order: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0) })).max(500) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    for (const item of data.order) {
      const { error } = await supabase
        .from("projects")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      if (error) throw new Error("Could not reorder projects.");
    }
    return { ok: true };
  });
