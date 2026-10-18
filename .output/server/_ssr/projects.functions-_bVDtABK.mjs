import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/projects.functions-_bVDtABK.js
var PROJECT_COLUMNS = "id,slug,name,category,description,full_description,problem,solution,features,process,learned,built,tech,filters,status,live,github,demo,previously,platform,stack,challenges,results,gallery,metrics,featured,featured_image,image_alt,images,start_date,end_date,sort_order,published,archived,seo_title,seo_description,canonical_url,og_image,created_at,updated_at";
/** Drops keys whose value is undefined so optional fields stay truly absent. */
function compact(value) {
	return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== void 0));
}
/** Maps a CMS row onto the shape the existing public components already render. */
function toProject(row) {
	return compact({
		slug: row.slug,
		name: row.name,
		category: row.category,
		description: row.description,
		problem: row.problem ?? void 0,
		built: row.built ?? [],
		tech: row.tech ?? [],
		status: row.status,
		live: row.live ?? void 0,
		github: row.github ?? void 0,
		demo: row.demo ?? void 0,
		filters: row.filters ?? [],
		featured: row.featured,
		previously: row.previously ?? void 0,
		platform: row.platform ?? void 0,
		stack: row.stack ?? void 0,
		challenges: row.challenges ?? void 0,
		results: row.results ?? void 0,
		gallery: row.gallery ?? void 0,
		metrics: row.metrics ?? void 0,
		fullDescription: row.full_description || void 0,
		solution: row.solution ?? void 0,
		features: row.features?.length ? row.features : void 0,
		process: row.process ?? void 0,
		learned: row.learned ?? void 0,
		featuredImage: row.featured_image ?? void 0,
		imageAlt: row.image_alt ?? void 0,
		images: row.images?.length ? row.images : void 0,
		startDate: row.start_date ?? void 0,
		endDate: row.end_date ?? void 0,
		seo: compact({
			title: row.seo_title ?? void 0,
			description: row.seo_description ?? void 0,
			canonical: row.canonical_url ?? void 0,
			ogImage: row.og_image ?? void 0
		})
	});
}
/** Publishable (anon) client — RLS only exposes published, non-archived rows. */
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
var listPublishedProjects_createServerFn_handler = createServerRpc({
	id: "d82b252dd7eac48e1651b8577c04ec6f892908f04ae09af69da60557e13f75ab",
	name: "listPublishedProjects",
	filename: "src/lib/projects.functions.ts"
}, (opts) => listPublishedProjects.__executeServer(opts));
var listPublishedProjects = createServerFn({ method: "GET" }).handler(listPublishedProjects_createServerFn_handler, async () => {
	const { data, error } = await publicClient().from("projects").select(PROJECT_COLUMNS).eq("published", true).eq("archived", false).order("sort_order", { ascending: true }).limit(300);
	if (error) throw new Error("Could not load projects.");
	return (data ?? []).map(toProject);
});
var getPublishedProject_createServerFn_handler = createServerRpc({
	id: "f559585c7990bd23d450339b60c318fdbc4d7aafe24ed2a17193f18bc64653b7",
	name: "getPublishedProject",
	filename: "src/lib/projects.functions.ts"
}, (opts) => getPublishedProject.__executeServer(opts));
var getPublishedProject = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().min(1).max(160) }).parse(data)).handler(getPublishedProject_createServerFn_handler, async ({ data }) => {
	const { data: row, error } = await publicClient().from("projects").select(PROJECT_COLUMNS).eq("slug", data.slug).eq("published", true).eq("archived", false).maybeSingle();
	if (error) throw new Error("Could not load project.");
	return row ? toProject(row) : null;
});
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (error || !data) throw new Error("Forbidden");
}
var jsonArray = (schema) => arrayType(schema).max(40).nullable().optional();
var projectSchema = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
	name: stringType().trim().min(2).max(120),
	category: stringType().trim().max(120).default(""),
	description: stringType().trim().max(600).default(""),
	full_description: stringType().max(2e4).default(""),
	problem: stringType().max(6e3).nullable().optional(),
	solution: stringType().max(6e3).nullable().optional(),
	features: arrayType(stringType().trim().min(1).max(160)).max(40).default([]),
	process: stringType().max(6e3).nullable().optional(),
	learned: stringType().max(6e3).nullable().optional(),
	built: arrayType(stringType().trim().min(1).max(120)).max(40).default([]),
	tech: arrayType(stringType().trim().min(1).max(60)).max(40).default([]),
	filters: arrayType(stringType().trim().min(1).max(60)).max(20).default([]),
	status: stringType().trim().max(60).default("Building"),
	live: stringType().trim().max(400).nullable().optional(),
	github: stringType().trim().max(400).nullable().optional(),
	demo: stringType().trim().max(400).nullable().optional(),
	previously: stringType().trim().max(300).nullable().optional(),
	platform: enumType(["base44", "lovable"]).nullable().optional(),
	stack: jsonArray(objectType({
		group: stringType().max(80),
		items: arrayType(stringType().max(80)).max(30)
	})),
	challenges: jsonArray(objectType({
		title: stringType().max(160),
		detail: stringType().max(3e3)
	})),
	results: jsonArray(objectType({
		label: stringType().max(120),
		value: stringType().max(120),
		note: stringType().max(300).optional()
	})),
	gallery: jsonArray(objectType({
		title: stringType().max(160),
		caption: stringType().max(1200),
		lines: arrayType(stringType().max(120)).max(12).optional()
	})),
	metrics: objectType({
		title: stringType().max(160),
		intro: stringType().max(1200).optional(),
		source: stringType().max(400).optional(),
		items: arrayType(objectType({
			value: stringType().max(80),
			label: stringType().max(160),
			note: stringType().max(300).optional()
		})).max(20),
		breakdown: arrayType(objectType({
			label: stringType().max(160),
			value: stringType().max(80)
		})).max(30).optional()
	}).nullable().optional(),
	featured: booleanType().default(false),
	featured_image: stringType().trim().max(600).nullable().optional(),
	image_alt: stringType().trim().max(300).nullable().optional(),
	images: arrayType(objectType({
		url: stringType().trim().max(600),
		alt: stringType().max(300).optional(),
		caption: stringType().max(400).optional()
	})).max(30).default([]),
	start_date: stringType().trim().max(20).nullable().optional(),
	end_date: stringType().trim().max(20).nullable().optional(),
	sort_order: numberType().int().min(0).max(1e5).default(0),
	published: booleanType().default(false),
	archived: booleanType().default(false),
	seo_title: stringType().trim().max(200).nullable().optional(),
	seo_description: stringType().trim().max(320).nullable().optional(),
	canonical_url: stringType().trim().max(500).nullable().optional(),
	og_image: stringType().trim().max(600).nullable().optional()
});
var listAllProjects_createServerFn_handler = createServerRpc({
	id: "f54e26d9c9617730e8874d6c07321c027614a72d9c61616275e0ef66f9e47776",
	name: "listAllProjects",
	filename: "src/lib/projects.functions.ts"
}, (opts) => listAllProjects.__executeServer(opts));
var listAllProjects = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAllProjects_createServerFn_handler, async ({ context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data, error } = await supabase.from("projects").select(PROJECT_COLUMNS).order("sort_order", { ascending: true }).limit(500);
	if (error) throw new Error("Could not load projects.");
	return data ?? [];
});
var getProjectById_createServerFn_handler = createServerRpc({
	id: "c1ecb8ee5e9da786b529bc66e578f6b2fc55fb33dc7bef34088de7dd567e2ea0",
	name: "getProjectById",
	filename: "src/lib/projects.functions.ts"
}, (opts) => getProjectById.__executeServer(opts));
var getProjectById = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(getProjectById_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { data: row, error } = await supabase.from("projects").select(PROJECT_COLUMNS).eq("id", data.id).maybeSingle();
	if (error) throw new Error("Could not load project.");
	return row ?? null;
});
var saveProject_createServerFn_handler = createServerRpc({
	id: "01b47e6e5f6031e8b52cd583aee720b950dc53a7ad67b96b8b41e698a2f75636",
	name: "saveProject",
	filename: "src/lib/projects.functions.ts"
}, (opts) => saveProject.__executeServer(opts));
var saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => projectSchema.parse(data)).handler(saveProject_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
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
		author_id: context.userId
	};
	const { data: row, error } = await (id ? supabase.from("projects").update(payload).eq("id", id) : supabase.from("projects").insert(payload)).select(PROJECT_COLUMNS).single();
	if (error) throw new Error(error.message ?? "Could not save project.");
	return row;
});
var deleteProject_createServerFn_handler = createServerRpc({
	id: "19be884b45063665e63ba8cfb603b8bf27ed0b7f5a40b3413ab6b0ab0b40c734",
	name: "deleteProject",
	filename: "src/lib/projects.functions.ts"
}, (opts) => deleteProject.__executeServer(opts));
var deleteProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(deleteProject_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	const { error } = await supabase.from("projects").delete().eq("id", data.id);
	if (error) throw new Error("Could not delete project.");
	return { ok: true };
});
var reorderProjects_createServerFn_handler = createServerRpc({
	id: "aba143423de6a225794c68c9902adac13f34b33a704c0d44818a56cc5c1594fa",
	name: "reorderProjects",
	filename: "src/lib/projects.functions.ts"
}, (opts) => reorderProjects.__executeServer(opts));
var reorderProjects = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ order: arrayType(objectType({
	id: stringType().uuid(),
	sort_order: numberType().int().min(0)
})).max(500) }).parse(data)).handler(reorderProjects_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	await assertAdmin(supabase, context.userId);
	for (const item of data.order) {
		const { error } = await supabase.from("projects").update({ sort_order: item.sort_order }).eq("id", item.id);
		if (error) throw new Error("Could not reorder projects.");
	}
	return { ok: true };
});
//#endregion
export { deleteProject_createServerFn_handler, getProjectById_createServerFn_handler, getPublishedProject_createServerFn_handler, listAllProjects_createServerFn_handler, listPublishedProjects_createServerFn_handler, reorderProjects_createServerFn_handler, saveProject_createServerFn_handler };
