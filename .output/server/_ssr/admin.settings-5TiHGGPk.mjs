import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as getAdminStatus } from "./admin-contact.functions-gXdf0cSN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { t as supabase } from "./client-Bxc8_G9k.mjs";
import { t as MfaPanel } from "./MfaPanel-BsF5oIAP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-5TiHGGPk.js
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const fetchStatus = useServerFn(getAdminStatus);
	const navigate = useNavigate();
	const admin = useQuery({
		queryKey: ["admin-status"],
		queryFn: () => fetchStatus()
	});
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Settings",
		description: "Your account, sign-in security and dashboard details.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-foreground",
							children: admin.data?.email ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: admin.data?.isAdmin ? "Site owner access" : "Standard account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-5 font-mono",
							onClick: signOut,
							children: "Sign out"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/settings/security",
							className: "focus-ring mt-3 inline-flex font-mono text-xs uppercase tracking-[0.16em] text-gold",
							children: "Security settings →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "Two-step sign-in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MfaPanel, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "How publishing works"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Drafts stay private — they never appear on the site, in menus or in search." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Set a future publish date to schedule a post; it appears automatically." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Archived items are hidden from the site but kept here for reference." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Published pages are added to the site map the next time the site is built." })
						]
					})]
				})
			]
		})
	});
}
var SplitComponent = AdminSettings;
//#endregion
export { SplitComponent as component };
