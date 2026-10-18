import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dcy-eaQM.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BEfvBBYI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-contact.functions-gXdf0cSN.js
var listSchema = objectType({
	search: stringType().trim().max(120).optional().default(""),
	status: enumType([
		"all",
		"open",
		"handled"
	]).optional().default("all"),
	limit: numberType().int().min(1).max(200).optional().default(50)
});
var listContactMessages = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => listSchema.parse(data ?? {})).handler(createSsrRpc("01d5083eb9069cd5388b340f3f1b1feface1bd115737c96ba9b4d8656f41a487"));
var updateSchema = objectType({
	id: stringType().uuid(),
	handled: booleanType(),
	note: stringType().trim().max(1e3).optional().default("")
});
var setContactMessageHandled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => updateSchema.parse(data)).handler(createSsrRpc("3a31b1fd8c16d36e52fb3c12a9dba23a7bffdd41c446b79d9fc3cd3dc1c21f7b"));
var getAdminStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e3de6249e068ef3051baf513d3c037fd212ffe6fecb071c7c0b1475b47a5274e"));
var exportSchema = listSchema;
var exportContactMessagesCsv = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => exportSchema.parse(data ?? {})).handler(createSsrRpc("e2fdf5e190b23015c143f348804bd2158f93aade3aada6a2cc82b734f3ac1742"));
var listAdminAuditLog = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => objectType({ limit: numberType().int().min(1).max(200).optional().default(50) }).parse(data ?? {})).handler(createSsrRpc("c82b5c8c1bdf55d899879d4ac36de3ed9e8823791957b31204a517f4c1a13ea0"));
//#endregion
export { setContactMessageHandled as a, listContactMessages as i, getAdminStatus as n, listAdminAuditLog as r, exportContactMessagesCsv as t };
