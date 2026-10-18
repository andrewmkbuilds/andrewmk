import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BEfvBBYI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media.functions-Bdg2vkfh.js
var ALLOWED = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif",
	"image/svg+xml"
];
var listMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3f2c393969bb6742c4169e29e2312769eec13343b7b20b0a255cbcfcc89b1685"));
var uploadMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	filename: stringType().trim().min(1).max(200),
	mimeType: enumType(ALLOWED),
	/** Base64-encoded file body (no data URL prefix). */
	base64: stringType().min(8).max(15e6),
	alt: stringType().trim().max(300).default(""),
	caption: stringType().trim().max(400).optional(),
	title: stringType().trim().max(200).optional()
}).parse(data)).handler(createSsrRpc("6639ae48e885f5f107f2b8ab79d32f3ea956ee4d069a1a85fe8a0d5c1e9acab7"));
var updateMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({
	id: stringType().uuid(),
	alt: stringType().trim().max(300).default(""),
	caption: stringType().trim().max(400).nullable().optional(),
	title: stringType().trim().max(200).nullable().optional()
}).parse(data)).handler(createSsrRpc("20dfdf2f89012ba917aeef4a41e967630bda786f85926651d064f397934b37c1"));
var deleteMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ id: stringType().uuid() }).parse(data)).handler(createSsrRpc("c539ff66020599c21bafc91dac11ef89f959891a8ae2384c7232bfd68bcd31a6"));
//#endregion
export { uploadMedia as i, listMedia as n, updateMedia as r, deleteMedia as t };
