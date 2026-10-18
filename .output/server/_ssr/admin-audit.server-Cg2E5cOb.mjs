import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-audit.server-Cg2E5cOb.js
/** Writes an immutable audit row. Never throws: auditing must not break the action. */
async function recordAudit(entry) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { error } = await supabaseAdmin.from("admin_audit_log").insert({
			actor_id: entry.actorId,
			actor_email: entry.actorEmail,
			action: entry.action,
			entity: entry.entity ?? "contact_message",
			entity_id: entry.entityId ?? null,
			details: entry.details ?? {}
		});
		if (error) console.error("audit insert failed", error);
	} catch (error) {
		console.error("audit insert threw", error);
	}
}
var escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[c]);
/**
* Sends an admin-facing notification email when a provider is configured.
* Returns null when email is not configured (the audit log remains the record).
*/
async function notifyAdmin(subject, lines, body) {
	const apiKey = processModule.env["RESEND_API_KEY"];
	const to = processModule.env["CONTACT_TO_EMAIL"];
	if (!apiKey || !to) return null;
	const from = processModule.env["CONTACT_FROM_EMAIL"] ?? "Portfolio <onboarding@resend.dev>";
	const rows = lines.map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`).join("\n");
	try {
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from,
				to: [to],
				subject,
				html: `<h2>${escapeHtml(subject)}</h2>\n${rows}${body ? `<hr /><p>${escapeHtml(body).replace(/\n/g, "<br />")}</p>` : ""}`
			})
		});
		if (!response.ok) return {
			ok: false,
			error: `${response.status} ${await response.text()}`.slice(0, 500)
		};
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: error.message.slice(0, 500)
		};
	}
}
/** RFC 4180 CSV serialisation. */
function toCsv(headers, rows) {
	const cell = (value) => {
		const text = value === null || value === void 0 ? "" : String(value);
		return `"${(/^[=+\-@\t\r]/.test(text) ? `'${text}` : text).replace(/"/g, "\"\"")}"`;
	};
	return [headers.map(cell).join(","), ...rows.map((r) => r.map(cell).join(","))].join("\r\n");
}
//#endregion
export { notifyAdmin, recordAudit, toCsv };
