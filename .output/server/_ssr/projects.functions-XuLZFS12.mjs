import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BEfvBBYI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects.functions-XuLZFS12.js
/** Publishable (anon) client — RLS only exposes published, non-archived rows. */
var listPublishedProjects = createServerFn({ method: "GET" }).handler(createSsrRpc("d82b252dd7eac48e1651b8577c04ec6f892908f04ae09af69da60557e13f75ab"));
var getPublishedProject = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().min(1).max(160) }).parse(data)).handler(createSsrRpc("f559585c7990bd23d450339b60c318fdbc4d7aafe24ed2a17193f18bc64653b7"));
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
var listAllProjects = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f54e26d9c9617730e8874d6c07321c027614a72d9c61616275e0ef66f9e47776"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("c1ecb8ee5e9da786b529bc66e578f6b2fc55fb33dc7bef34088de7dd567e2ea0"));
var saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => projectSchema.parse(data)).handler(createSsrRpc("01b47e6e5f6031e8b52cd583aee720b950dc53a7ad67b96b8b41e698a2f75636"));
var deleteProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("19be884b45063665e63ba8cfb603b8bf27ed0b7f5a40b3413ab6b0ab0b40c734"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ order: arrayType(objectType({
	id: stringType().uuid(),
	sort_order: numberType().int().min(0)
})).max(500) }).parse(data)).handler(createSsrRpc("aba143423de6a225794c68c9902adac13f34b33a704c0d44818a56cc5c1594fa"));
//#endregion
export { saveProject as a, listPublishedProjects as i, getPublishedProject as n, listAllProjects as r, deleteProject as t };
