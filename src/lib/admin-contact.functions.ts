import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  source_path: string | null;
  spam_score: number;
  delivery_status: string;
  created_at: string;
  handled_at: string | null;
  admin_note: string | null;
}

const listSchema = z.object({
  search: z.string().trim().max(120).optional().default(""),
  status: z.enum(["all", "open", "handled"]).optional().default("all"),
  limit: z.number().int().min(1).max(200).optional().default(50),
});

async function assertAdmin(supabase: {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
}, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) throw new Error("Forbidden");
}

export const listContactMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => listSchema.parse(data ?? {}))
  .handler(async ({ data, context }): Promise<ContactMessageRow[]> => {
    const supabase = context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
      from: (t: string) => any;
    };
    await assertAdmin(supabase, context.userId);

    let query = supabase
      .from("contact_messages")
      .select("id,name,email,message,source_path,spam_score,delivery_status,created_at,handled_at,admin_note")
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.status === "open") query = query.is("handled_at", null);
    if (data.status === "handled") query = query.not("handled_at", "is", null);

    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      if (term) {
        query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`);
      }
    }

    const { data: rows, error } = await query;
    if (error) throw new Error("Could not load messages.");
    return (rows ?? []) as ContactMessageRow[];
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  handled: z.boolean(),
  note: z.string().trim().max(1000).optional().default(""),
});

export const setContactMessageHandled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateSchema.parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
      from: (t: string) => any;
    };
    await assertAdmin(supabase, context.userId);

    const { error } = await supabase
      .from("contact_messages")
      .update({
        handled_at: data.handled ? new Date().toISOString() : null,
        handled_by: data.handled ? context.userId : null,
        admin_note: data.note || null,
      })
      .eq("id", data.id);

    if (error) throw new Error("Could not update the message.");
    return { ok: true };
  });

export const getAdminStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    const supabase = context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
    };
    const { data } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    const claims = context.claims as { email?: string } | undefined;
    return { isAdmin: data === true, email: claims?.email ?? null };
  });
