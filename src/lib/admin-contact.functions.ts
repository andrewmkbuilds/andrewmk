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

async function isAdmin(supabase: { from: (t: string) => any }, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !error && !!data;
}

async function assertAdmin(supabase: { from: (t: string) => any }, userId: string) {
  if (!(await isAdmin(supabase, userId))) throw new Error("Forbidden");
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

    const { data: before } = await supabase
      .from("contact_messages")
      .select("id,name,email,handled_at,admin_note")
      .eq("id", data.id)
      .maybeSingle();

    const { error } = await supabase
      .from("contact_messages")
      .update({
        handled_at: data.handled ? new Date().toISOString() : null,
        handled_by: data.handled ? context.userId : null,
        admin_note: data.note || null,
      })
      .eq("id", data.id);

    if (error) throw new Error("Could not update the message.");

    const claims = context.claims as { email?: string } | undefined;
    const actorEmail = claims?.email ?? null;
    const prev = (before ?? {}) as { name?: string; email?: string; handled_at?: string | null; admin_note?: string | null };

    const { recordAudit, notifyAdmin } = await import("./admin-audit.server");

    await recordAudit({
      actorId: context.userId,
      actorEmail,
      action: data.handled ? "mark_handled" : "reopen",
      entity: "contact_message",
      entityId: data.id,
      details: {
        from: { handled: Boolean(prev.handled_at), note: prev.admin_note ?? null },
        to: { handled: data.handled, note: data.note || null },
        subject_email: prev.email ?? null,
      },
    });

    await notifyAdmin(
      data.handled ? "Contact message marked handled" : "Contact message reopened",
      [
        ["From", prev.name ?? "unknown"],
        ["Email", prev.email ?? "unknown"],
        ["Admin", actorEmail ?? context.userId],
        ["When", new Date().toISOString()],
      ],
      data.note || undefined,
    );

    return { ok: true };
  });

export const getAdminStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    const supabase = context.supabase as never as { from: (t: string) => any };
    const admin = await isAdmin(supabase, context.userId);
    const claims = context.claims as { email?: string } | undefined;
    return { isAdmin: admin, email: claims?.email ?? null };

  });

const exportSchema = listSchema;

export const exportContactMessagesCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => exportSchema.parse(data ?? {}))
  .handler(async ({ data, context }): Promise<{ filename: string; csv: string; count: number }> => {
    const supabase = context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
      from: (t: string) => any;
    };
    await assertAdmin(supabase, context.userId);

    let query = supabase
      .from("contact_messages")
      .select("id,name,email,message,source_path,spam_score,delivery_status,created_at,handled_at,admin_note")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (data.status === "open") query = query.is("handled_at", null);
    if (data.status === "handled") query = query.not("handled_at", "is", null);
    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error("Could not export messages.");

    const { recordAudit, toCsv } = await import("./admin-audit.server");
    const list = (rows ?? []) as ContactMessageRow[];

    const csv = toCsv(
      ["Received", "Name", "Email", "Message", "Page", "Spam score", "Delivery", "Handled at", "Admin note"],
      list.map((r) => [
        r.created_at,
        r.name,
        r.email,
        r.message,
        r.source_path,
        r.spam_score,
        r.delivery_status,
        r.handled_at,
        r.admin_note,
      ]),
    );

    const claims = context.claims as { email?: string } | undefined;
    await recordAudit({
      actorId: context.userId,
      actorEmail: claims?.email ?? null,
      action: "export_csv",
      entity: "contact_message",
      details: { count: list.length, status: data.status, search: data.search },
    });

    const stamp = new Date().toISOString().slice(0, 10);
    return { filename: `contact-messages-${data.status}-${stamp}.csv`, csv, count: list.length };
  });

export interface AuditLogRow {
  id: string;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string;
  created_at: string;
}

export const listAdminAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ limit: z.number().int().min(1).max(200).optional().default(50) }).parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<AuditLogRow[]> => {
    const supabase = context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
      from: (t: string) => any;
    };
    await assertAdmin(supabase, context.userId);

    const { data: rows, error } = await supabase
      .from("admin_audit_log")
      .select("id,actor_email,action,entity,entity_id,details,created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (error) throw new Error("Could not load the audit log.");
    return ((rows ?? []) as Array<Record<string, unknown>>).map((row) => ({
      id: String(row["id"]),
      actor_email: (row["actor_email"] as string | null) ?? null,
      action: String(row["action"]),
      entity: String(row["entity"]),
      entity_id: (row["entity_id"] as string | null) ?? null,
      details: JSON.stringify(row["details"] ?? {}),
      created_at: String(row["created_at"]),
    }));
  });
