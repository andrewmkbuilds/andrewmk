import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface MediaAsset {
  id: string;
  path: string;
  url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  alt: string;
  caption: string | null;
  title: string | null;
  created_at: string;
}

const COLUMNS = "id,path,url,filename,mime_type,size_bytes,alt,caption,title,created_at";
const BUCKET = "media";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"] as const;

async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

export const listMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MediaAsset[]> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { data, error } = await supabase
      .from("media_assets")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error("Could not load the media library.");
    return (data ?? []) as MediaAsset[];
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        filename: z.string().trim().min(1).max(200),
        mimeType: z.enum(ALLOWED),
        /** Base64-encoded file body (no data URL prefix). */
        base64: z.string().min(8).max(15_000_000),
        alt: z.string().trim().max(300).default(""),
        caption: z.string().trim().max(400).optional(),
        title: z.string().trim().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<MediaAsset> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);

    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.byteLength > 10 * 1024 * 1024) throw new Error("Images must be 10 MB or smaller.");

    const safeName = data.filename
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-80);
    const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID().slice(0, 8)}-${safeName}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const upload = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: data.mimeType, cacheControl: "31536000", upsert: false });
    if (upload.error) throw new Error(upload.error.message ?? "Upload failed.");

    const row = {
      path,
      url: `/api/public/media/${path}`,
      filename: safeName,
      mime_type: data.mimeType,
      size_bytes: bytes.byteLength,
      alt: data.alt,
      caption: data.caption ?? null,
      title: data.title ?? null,
      uploaded_by: context.userId,
    };

    const { data: saved, error } = await supabase
      .from("media_assets")
      .insert(row)
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message ?? "Could not save the image details.");
    return saved as MediaAsset;
  });

export const updateMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        alt: z.string().trim().max(300).default(""),
        caption: z.string().trim().max(400).nullable().optional(),
        title: z.string().trim().max(200).nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }): Promise<MediaAsset> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);
    const { data: row, error } = await supabase
      .from("media_assets")
      .update({ alt: data.alt, caption: data.caption ?? null, title: data.title ?? null })
      .eq("id", data.id)
      .select(COLUMNS)
      .single();
    if (error) throw new Error("Could not update the image.");
    return row as MediaAsset;
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as never as any;
    await assertAdmin(supabase, context.userId);

    const { data: row } = await supabase
      .from("media_assets")
      .select("path")
      .eq("id", data.id)
      .maybeSingle();

    if (row?.path) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.storage.from(BUCKET).remove([row.path]);
    }

    const { error } = await supabase.from("media_assets").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete the image.");
    return { ok: true };
  });
