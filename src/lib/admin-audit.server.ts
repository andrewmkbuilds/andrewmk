// Server-only helpers for admin auditing and admin notification emails.

export interface AuditEntry {
  actorId: string;
  actorEmail: string | null;
  action: string;
  entity?: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
}

/** Writes an immutable audit row. Never throws: auditing must not break the action. */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: entry.actorId,
      actor_email: entry.actorEmail,
      action: entry.action,
      entity: entry.entity ?? "contact_message",
      entity_id: entry.entityId ?? null,
      details: entry.details ?? {},
    });
    if (error) console.error("audit insert failed", error);
  } catch (error) {
    console.error("audit insert threw", error);
  }
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Sends an admin-facing notification email when a provider is configured.
 * Returns null when email is not configured (the audit log remains the record).
 */
export async function notifyAdmin(
  subject: string,
  lines: Array<[string, string]>,
  body?: string,
): Promise<{ ok: boolean; error?: string } | null> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["CONTACT_TO_EMAIL"];
  if (!apiKey || !to) return null;

  const from = process.env["CONTACT_FROM_EMAIL"] ?? "Portfolio <onboarding@resend.dev>";
  const rows = lines
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html: `<h2>${escapeHtml(subject)}</h2>\n${rows}${
          body ? `<hr /><p>${escapeHtml(body).replace(/\n/g, "<br />")}</p>` : ""
        }`,
      }),
    });
    if (!response.ok) {
      return { ok: false, error: `${response.status} ${await response.text()}`.slice(0, 500) };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: (error as Error).message.slice(0, 500) };
  }
}

/** RFC 4180 CSV serialisation. */
export function toCsv(headers: string[], rows: Array<Array<string | number | null>>): string {
  const cell = (value: string | number | null) => {
    const text = value === null || value === undefined ? "" : String(value);
    // Guard against spreadsheet formula injection.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [headers.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n");
}
