import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { Buffer } from "node:buffer";
//#region node_modules/.nitro/vite/services/ssr/assets/media.functions-BTyRI4D5.js
var COLUMNS = "id,path,url,filename,mime_type,size_bytes,alt,caption,title,created_at";
var BUCKET = "media";
var ALLOWED = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif",
	"image/svg+xml"
];
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (error || !data) throw new Error("Forbidden");
}
var listMedia_createServerFn_handler = createServerRpc({
	id: "3f2c393969bb6742c4169e29e2312769eec13343b7b20b0a255cbcfcc89b1685",
	name: "listMedia",
	filename: "src/lib/media.functions.ts"
}, (opts) => listMedia.__executeServer(opts));
var listMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listMedia_createServerFn_handler, async ({ context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data, error } = await supabase.from("media_assets").select(COLUMNS).order("created_at", { ascending: false }).limit(300);
	if (error) throw new Error("Could not load the media library.");
	return data ?? [];
});
var uploadMedia_createServerFn_handler = createServerRpc({
	id: "6639ae48e885f5f107f2b8ab79d32f3ea956ee4d069a1a85fe8a0d5c1e9acab7",
	name: "uploadMedia",
	filename: "src/lib/media.functions.ts"
}, (opts) => uploadMedia.__executeServer(opts));
var uploadMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	filename: stringType().trim().min(1).max(200),
	mimeType: enumType(ALLOWED),
	/** Base64-encoded file body (no data URL prefix). */
	base64: stringType().min(8).max(15e6),
	alt: stringType().trim().max(300).default(""),
	caption: stringType().trim().max(400).optional(),
	title: stringType().trim().max(200).optional()
}).parse(data)).handler(uploadMedia_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const bytes = Buffer.from(data.base64, "base64");
	if (bytes.byteLength > 10485760) throw new Error("Images must be 10 MB or smaller.");
	const safeName = data.filename.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-").replace(/^-+|-+$/g, "").slice(-80);
	const path = `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}/${crypto.randomUUID().slice(0, 8)}-${safeName}`;
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const upload = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
		contentType: data.mimeType,
		cacheControl: "31536000",
		upsert: false
	});
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
		uploaded_by: context.userId
	};
	const { data: saved, error } = await supabase.from("media_assets").insert(row).select(COLUMNS).single();
	if (error) throw new Error(error.message ?? "Could not save the image details.");
	return saved;
});
var updateMedia_createServerFn_handler = createServerRpc({
	id: "20dfdf2f89012ba917aeef4a41e967630bda786f85926651d064f397934b37c1",
	name: "updateMedia",
	filename: "src/lib/media.functions.ts"
}, (opts) => updateMedia.__executeServer(opts));
var updateMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	alt: stringType().trim().max(300).default(""),
	caption: stringType().trim().max(400).nullable().optional(),
	title: stringType().trim().max(200).nullable().optional()
}).parse(data)).handler(updateMedia_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data: row, error } = await supabase.from("media_assets").update({
		alt: data.alt,
		caption: data.caption ?? null,
		title: data.title ?? null
	}).eq("id", data.id).select(COLUMNS).single();
	if (error) throw new Error("Could not update the image.");
	return row;
});
var deleteMedia_createServerFn_handler = createServerRpc({
	id: "c539ff66020599c21bafc91dac11ef89f959891a8ae2384c7232bfd68bcd31a6",
	name: "deleteMedia",
	filename: "src/lib/media.functions.ts"
}, (opts) => deleteMedia.__executeServer(opts));
var deleteMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteMedia_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data: row } = await supabase.from("media_assets").select("path").eq("id", data.id).maybeSingle();
	if (row?.path) {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		await supabaseAdmin.storage.from(BUCKET).remove([row.path]);
	}
	const { error } = await supabase.from("media_assets").delete().eq("id", data.id);
	if (error) throw new Error("Could not delete the image.");
	return { ok: true };
});
//#endregion
export { deleteMedia_createServerFn_handler, listMedia_createServerFn_handler, updateMedia_createServerFn_handler, uploadMedia_createServerFn_handler };
