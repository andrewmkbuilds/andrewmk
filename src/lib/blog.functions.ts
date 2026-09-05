import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  reading_minutes: number;
  created_at: string;
  updated_at: string;
}

const COLUMNS =
  "id,slug,title,excerpt,content,tags,cover_image,published,published_at,reading_minutes,created_at,updated_at";

/** Publishable (anon) client for public reads — RLS only exposes published posts. */
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

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await publicClient()
      .from("blog_posts")
      .select(COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(60);
    if (error) throw new Error("Could not load posts.");
    return (data ?? []) as BlogPost[];
  },
);

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(160) }).parse(data))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { data: row, error } = await publicClient()
      .from("blog_posts")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error("Could not load post.");
    return (row as BlogPost | null) ?? null;
  });

/* ---------------------------------- admin --------------------------------- */

async function assertAdmin(
  supabase: { from: (t: string) => any },
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}


const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(400).default(""),
  content: z.string().max(60000).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  cover_image: z.string().trim().max(500).nullable().optional(),
  published: z.boolean().default(false),
  reading_minutes: z.number().int().min(1).max(60).default(3),
});

export const listAllPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BlogPost[]> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(COLUMNS)
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Could not load posts.");
    return (data ?? []) as BlogPost[];
  });

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => postSchema.parse(data))
  .handler(async ({ data, context }): Promise<BlogPost> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);

    let publishedAt: string | null = null;
    if (data.published) {
      const existing = data.id
        ? await supabase.from("blog_posts").select("published_at").eq("id", data.id).maybeSingle()
        : null;
      publishedAt = existing?.data?.published_at ?? new Date().toISOString();
    }

    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags,
      cover_image: data.cover_image || null,
      published: data.published,
      reading_minutes: data.reading_minutes,
      published_at: publishedAt,
      author_id: context.userId,
    };

    const query = data.id
      ? supabase.from("blog_posts").update(payload).eq("id", data.id)
      : supabase.from("blog_posts").insert(payload);

    const { data: row, error } = await query.select(COLUMNS).single();
    if (error) throw new Error(error.message ?? "Could not save post.");
    return row as BlogPost;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { error } = await supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete post.");
    return { ok: true };
  });
