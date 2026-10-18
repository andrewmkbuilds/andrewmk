import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BEfvBBYI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.functions-Nh7upfwn.js
/** Publishable (anon) client for public reads — RLS only exposes published posts. */
var listPublishedPosts = createServerFn({ method: "GET" }).handler(createSsrRpc("e2cbed737503162e46e2ab3f882490859e69491c19f9c07d7dd3510044f18adc"));
var getPublishedPost = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().min(1).max(160) }).parse(data)).handler(createSsrRpc("5e47b6b5462336cd213aaf587762c19db3f76ae26cbad921e5799a17bbfd9e41"));
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
var listAllPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("51c6a377975d32263139e9787bb471de13201604a5339415a9c78f723ad07962"));
var savePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => postSchema.parse(data)).handler(createSsrRpc("2ff539d5b4dbb436f350ee134938846592007e6bd7cd44024e54c0441e189648"));
var deletePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("3843831164d0def4cb3afbf32fde4fbd1ac8c93e12b37a3c66d852aa39340c0d"));
//#endregion
export { savePost as a, listPublishedPosts as i, getPublishedPost as n, listAllPosts as r, deletePost as t };
