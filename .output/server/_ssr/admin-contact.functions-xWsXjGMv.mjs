import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-contact.functions-xWsXjGMv.js
var listSchema = objectType({
	search: stringType().trim().max(120).optional().default(""),
	status: enumType([
		"all",
		"open",
		"handled"
	]).optional().default("all"),
	limit: numberType().int().min(1).max(200).optional().default(50)
});
async function isAdmin(supabase, userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	return !error && !!data;
}
async function assertAdmin(supabase, userId) {
	if (!await isAdmin(supabase, userId)) throw new Error("Forbidden");
}
var listContactMessages_createServerFn_handler = createServerRpc({
	id: "01d5083eb9069cd5388b340f3f1b1feface1bd115737c96ba9b4d8656f41a487",
	name: "listContactMessages",
	filename: "src/lib/admin-contact.functions.ts"
}, (opts) => listContactMessages.__executeServer(opts));
var listContactMessages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => listSchema.parse(data ?? {})).handler(listContactMessages_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	let query = supabase.from("contact_messages").select("id,name,email,message,source_path,spam_score,delivery_status,created_at,handled_at,admin_note").order("created_at", { ascending: false }).limit(data.limit);
	if (data.status === "open") query = query.is("handled_at", null);
	if (data.status === "handled") query = query.not("handled_at", "is", null);
	if (data.search) {
		const term = data.search.replace(/[%,()]/g, " ").trim();
		if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`);
	}
	const { data: rows, error } = await query;
	if (error) throw new Error("Could not load messages.");
	return rows ?? [];
});
var updateSchema = objectType({
	id: stringType().uuid(),
	handled: booleanType(),
	note: stringType().trim().max(1e3).optional().default("")
});
var setContactMessageHandled_createServerFn_handler = createServerRpc({
	id: "3a31b1fd8c16d36e52fb3c12a9dba23a7bffdd41c446b79d9fc3cd3dc1c21f7b",
	name: "setContactMessageHandled",
	filename: "src/lib/admin-contact.functions.ts"
}, (opts) => setContactMessageHandled.__executeServer(opts));
var setContactMessageHandled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => updateSchema.parse(data)).handler(setContactMessageHandled_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data: before } = await supabase.from("contact_messages").select("id,name,email,handled_at,admin_note").eq("id", data.id).maybeSingle();
	const { error } = await supabase.from("contact_messages").update({
		handled_at: data.handled ? (/* @__PURE__ */ new Date()).toISOString() : null,
		handled_by: data.handled ? context.userId : null,
		admin_note: data.note || null
	}).eq("id", data.id);
	if (error) throw new Error("Could not update the message.");
	const actorEmail = context.claims?.email ?? null;
	const prev = before ?? {};
	const { recordAudit, notifyAdmin } = await import("./admin-audit.server-Cg2E5cOb.mjs");
	await recordAudit({
		actorId: context.userId,
		actorEmail,
		action: data.handled ? "mark_handled" : "reopen",
		entity: "contact_message",
		entityId: data.id,
		details: {
			from: {
				handled: Boolean(prev.handled_at),
				note: prev.admin_note ?? null
			},
			to: {
				handled: data.handled,
				note: data.note || null
			},
			subject_email: prev.email ?? null
		}
	});
	await notifyAdmin(data.handled ? "Contact message marked handled" : "Contact message reopened", [
		["From", prev.name ?? "unknown"],
		["Email", prev.email ?? "unknown"],
		["Admin", actorEmail ?? context.userId],
		["When", (/* @__PURE__ */ new Date()).toISOString()]
	], data.note || void 0);
	return { ok: true };
});
var getAdminStatus_createServerFn_handler = createServerRpc({
	id: "e3de6249e068ef3051baf513d3c037fd212ffe6fecb071c7c0b1475b47a5274e",
	name: "getAdminStatus",
	filename: "src/lib/admin-contact.functions.ts"
}, (opts) => getAdminStatus.__executeServer(opts));
var getAdminStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getAdminStatus_createServerFn_handler, async ({ context }) => {
	const supabase = context.supabase;
	return {
		isAdmin: await isAdmin(supabase, context.userId),
		email: context.claims?.email ?? null
	};
});
var exportSchema = listSchema;
var exportContactMessagesCsv_createServerFn_handler = createServerRpc({
	id: "e2fdf5e190b23015c143f348804bd2158f93aade3aada6a2cc82b734f3ac1742",
	name: "exportContactMessagesCsv",
	filename: "src/lib/admin-contact.functions.ts"
}, (opts) => exportContactMessagesCsv.__executeServer(opts));
var exportContactMessagesCsv = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => exportSchema.parse(data ?? {})).handler(exportContactMessagesCsv_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	let query = supabase.from("contact_messages").select("id,name,email,message,source_path,spam_score,delivery_status,created_at,handled_at,admin_note").order("created_at", { ascending: false }).limit(1e3);
	if (data.status === "open") query = query.is("handled_at", null);
	if (data.status === "handled") query = query.not("handled_at", "is", null);
	if (data.search) {
		const term = data.search.replace(/[%,()]/g, " ").trim();
		if (term) query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,message.ilike.%${term}%`);
	}
	const { data: rows, error } = await query;
	if (error) throw new Error("Could not export messages.");
	const { recordAudit, toCsv } = await import("./admin-audit.server-Cg2E5cOb.mjs");
	const list = rows ?? [];
	const csv = toCsv([
		"Received",
		"Name",
		"Email",
		"Message",
		"Page",
		"Spam score",
		"Delivery",
		"Handled at",
		"Admin note"
	], list.map((r) => [
		r.created_at,
		r.name,
		r.email,
		r.message,
		r.source_path,
		r.spam_score,
		r.delivery_status,
		r.handled_at,
		r.admin_note
	]));
	const claims = context.claims;
	await recordAudit({
		actorId: context.userId,
		actorEmail: claims?.email ?? null,
		action: "export_csv",
		entity: "contact_message",
		details: {
			count: list.length,
			status: data.status,
			search: data.search
		}
	});
	const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return {
		filename: `contact-messages-${data.status}-${stamp}.csv`,
		csv,
		count: list.length
	};
});
var listAdminAuditLog_createServerFn_handler = createServerRpc({
	id: "c82b5c8c1bdf55d899879d4ac36de3ed9e8823791957b31204a517f4c1a13ea0",
	name: "listAdminAuditLog",
	filename: "src/lib/admin-contact.functions.ts"
}, (opts) => listAdminAuditLog.__executeServer(opts));
var listAdminAuditLog = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ limit: numberType().int().min(1).max(200).optional().default(50) }).parse(data ?? {})).handler(listAdminAuditLog_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data: rows, error } = await supabase.from("admin_audit_log").select("id,actor_email,action,entity,entity_id,details,created_at").order("created_at", { ascending: false }).limit(data.limit);
	if (error) throw new Error("Could not load the audit log.");
	return (rows ?? []).map((row) => ({
		id: String(row["id"]),
		actor_email: row["actor_email"] ?? null,
		action: String(row["action"]),
		entity: String(row["entity"]),
		entity_id: row["entity_id"] ?? null,
		details: JSON.stringify(row["details"] ?? {}),
		created_at: String(row["created_at"])
	}));
});
//#endregion
export { exportContactMessagesCsv_createServerFn_handler, getAdminStatus_createServerFn_handler, listAdminAuditLog_createServerFn_handler, listContactMessages_createServerFn_handler, setContactMessageHandled_createServerFn_handler };
