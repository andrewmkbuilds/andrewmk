import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as getAdminStatus } from "./admin-contact.functions-gXdf0cSN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminShell-DtO3LkIS.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Overview"
	},
	{
		to: "/admin/projects",
		label: "Projects"
	},
	{
		to: "/admin/blog",
		label: "Blog"
	},
	{
		to: "/admin/media",
		label: "Media"
	},
	{
		to: "/admin/messages",
		label: "Messages"
	},
	{
		to: "/admin/settings",
		label: "Settings"
	},
	{
		to: "/admin/settings/security",
		label: "Security"
	}
];
/** Shared frame for the private content dashboard: nav, admin gate, page header. */
function AdminShell({ title, description, actions, children }) {
	const fetchStatus = useServerFn(getAdminStatus);
	const admin = useQuery({
		queryKey: ["admin-status"],
		queryFn: () => fetchStatus()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container py-14 md:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Dashboard sections",
				className: "flex flex-wrap gap-2",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "focus-ring rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground",
					activeOptions: { exact: item.to === "/admin" },
					activeProps: { className: "border-gold/60 text-foreground" },
					children: item.label
				}, item.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mt-8 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-display text-2xl text-foreground md:text-3xl",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: description
				}) : null] }), actions]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: admin.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": "true"
					}), " Checking your access…"]
				}) : admin.data?.isAdmin ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground",
					children: "This area is limited to the site owner."
				})
			})
		]
	});
}
//#endregion
export { AdminShell as t };
