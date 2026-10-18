import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, t as arrayType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.functions-DSkKGBt0.js
var COLUMNS = "id,slug,title,excerpt,content,tags,cover_image,published,published_at,reading_minutes,created_at,updated_at,cover_image_alt,author,category,featured,archived,scheduled_at,seo_title,seo_description,canonical_url,og_image";
/** Publishable (anon) client for public reads — RLS only exposes published posts. */
function publicClient() {
	const url = processModule.env["SUPABASE_URL"] ?? processModule.env["VITE_SUPABASE_URL"];
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"] ?? processModule.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? processModule.env["SUPABASE_ANON_KEY"];
	if (!url || !key) throw new Error("Supabase public credentials are not configured.");
	return createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
var listPublishedPosts_createServerFn_handler = createServerRpc({
	id: "e2cbed737503162e46e2ab3f882490859e69491c19f9c07d7dd3510044f18adc",
	name: "listPublishedPosts",
	filename: "src/lib/blog.functions.ts"
}, (opts) => listPublishedPosts.__executeServer(opts));
var listPublishedPosts = createServerFn({ method: "GET" }).handler(listPublishedPosts_createServerFn_handler, async () => {
	const { data, error } = await publicClient().from("blog_posts").select(COLUMNS).eq("published", true).eq("archived", false).lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).order("published_at", { ascending: false }).limit(60);
	if (error) throw new Error("Could not load posts.");
	return data ?? [];
});
var getPublishedPost_createServerFn_handler = createServerRpc({
	id: "5e47b6b5462336cd213aaf587762c19db3f76ae26cbad921e5799a17bbfd9e41",
	name: "getPublishedPost",
	filename: "src/lib/blog.functions.ts"
}, (opts) => getPublishedPost.__executeServer(opts));
var getPublishedPost = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().min(1).max(160) }).parse(data)).handler(getPublishedPost_createServerFn_handler, async ({ data }) => {
	const { data: row, error } = await publicClient().from("blog_posts").select(COLUMNS).eq("slug", data.slug).eq("published", true).eq("archived", false).lte("published_at", (/* @__PURE__ */ new Date()).toISOString()).maybeSingle();
	if (error) throw new Error("Could not load post.");
	return row ?? null;
});
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (error || !data) throw new Error("Forbidden");
}
var postSchema = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().trim().min(3).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
	title: stringType().trim().min(3).max(160),
	excerpt: stringType().trim().max(400).default(""),
	content: stringType().max(6e4).default(""),
	tags: arrayType(stringType().trim().min(1).max(40)).max(8).default([]),
	cover_image: stringType().trim().max(500).nullable().optional(),
	published: booleanType().default(false),
	reading_minutes: numberType().int().min(1).max(60).default(3),
	cover_image_alt: stringType().trim().max(300).default(""),
	author: stringType().trim().max(120).default("Andrew Mathews"),
	category: stringType().trim().max(120).default(""),
	featured: booleanType().default(false),
	archived: booleanType().default(false),
	/** ISO timestamp. In the future = scheduled; the public site hides it until then. */
	publish_at: stringType().trim().max(40).nullable().optional(),
	seo_title: stringType().trim().max(200).nullable().optional(),
	seo_description: stringType().trim().max(320).nullable().optional(),
	canonical_url: stringType().trim().max(500).nullable().optional(),
	og_image: stringType().trim().max(600).nullable().optional()
});
var listAllPosts_createServerFn_handler = createServerRpc({
	id: "51c6a377975d32263139e9787bb471de13201604a5339415a9c78f723ad07962",
	name: "listAllPosts",
	filename: "src/lib/blog.functions.ts"
}, (opts) => listAllPosts.__executeServer(opts));
var listAllPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAllPosts_createServerFn_handler, async ({ context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data, error } = await supabase.from("blog_posts").select(COLUMNS).order("updated_at", { ascending: false }).limit(200);
	if (error) throw new Error("Could not load posts.");
	return data ?? [];
});
var savePost_createServerFn_handler = createServerRpc({
	id: "2ff539d5b4dbb436f350ee134938846592007e6bd7cd44024e54c0441e189648",
	name: "savePost",
	filename: "src/lib/blog.functions.ts"
}, (opts) => savePost.__executeServer(opts));
var savePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => postSchema.parse(data)).handler(savePost_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	let publishedAt = null;
	if (data.published) {
		const existing = data.id ? await supabase.from("blog_posts").select("published_at").eq("id", data.id).maybeSingle() : null;
		publishedAt = (data.publish_at ? new Date(data.publish_at).toISOString() : null) ?? existing?.data?.published_at ?? (/* @__PURE__ */ new Date()).toISOString();
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
		cover_image_alt: data.cover_image_alt,
		author: data.author,
		category: data.category,
		featured: data.featured,
		archived: data.archived,
		scheduled_at: data.published && data.publish_at && new Date(data.publish_at).getTime() > Date.now() ? new Date(data.publish_at).toISOString() : null,
		seo_title: data.seo_title || null,
		seo_description: data.seo_description || null,
		canonical_url: data.canonical_url || null,
		og_image: data.og_image || null,
		author_id: context.userId
	};
	const { data: row, error } = await (data.id ? supabase.from("blog_posts").update(payload).eq("id", data.id) : supabase.from("blog_posts").insert(payload)).select(COLUMNS).single();
	if (error) throw new Error(error.message ?? "Could not save post.");
	return row;
});
var deletePost_createServerFn_handler = createServerRpc({
	id: "3843831164d0def4cb3afbf32fde4fbd1ac8c93e12b37a3c66d852aa39340c0d",
	name: "deletePost",
	filename: "src/lib/blog.functions.ts"
}, (opts) => deletePost.__executeServer(opts));
var deletePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deletePost_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { error } = await supabase.from("blog_posts").delete().eq("id", data.id);
	if (error) throw new Error("Could not delete post.");
	return { ok: true };
});
//#endregion
export { deletePost_createServerFn_handler, getPublishedPost_createServerFn_handler, listAllPosts_createServerFn_handler, listPublishedPosts_createServerFn_handler, savePost_createServerFn_handler };
