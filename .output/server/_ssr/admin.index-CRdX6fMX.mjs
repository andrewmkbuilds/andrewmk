import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { r as listAllPosts } from "./blog.functions-Nh7upfwn.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { n as listMedia } from "./media.functions-Bdg2vkfh.mjs";
import { r as listAllProjects } from "./projects.functions-XuLZFS12.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-CRdX6fMX.js
var import_jsx_runtime = require_jsx_runtime();
function Stat({ label, value, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "focus-ring pop-card block rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-gold/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-display text-2xl text-foreground",
			children: value
		})]
	});
}
function AdminOverview() {
	const fetchProjects = useServerFn(listAllProjects);
	const fetchPosts = useServerFn(listAllPosts);
	const fetchMedia = useServerFn(listMedia);
	const projects = useQuery({
		queryKey: ["admin-projects"],
		queryFn: () => fetchProjects()
	});
	const posts = useQuery({
		queryKey: ["admin-blog-posts"],
		queryFn: () => fetchPosts()
	});
	const media = useQuery({
		queryKey: ["admin-media"],
		queryFn: () => fetchMedia()
	});
	const p = projects.data ?? [];
	const b = posts.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Content dashboard",
		description: "Manage your projects, blog posts and images. Drafts stay private until you publish them.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Published projects",
					value: `${p.filter((x) => x.published && !x.archived).length}`,
					to: "/admin/projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Project drafts",
					value: `${p.filter((x) => !x.published && !x.archived).length}`,
					to: "/admin/projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Published posts",
					value: `${b.filter((x) => x.published).length}`,
					to: "/admin/blog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Images",
					value: `${(media.data ?? []).length}`,
					to: "/admin/media"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
					children: "Recently updated projects"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 list-none space-y-3 p-0 text-sm",
					children: [[...p].sort((a, z) => z.updated_at.localeCompare(a.updated_at)).slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
							children: item.archived ? "Archived" : item.published ? "Live" : "Draft"
						})]
					}, item.id)), p.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted-foreground",
						children: "Nothing yet."
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
					children: "Recently updated posts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 list-none space-y-3 p-0 text-sm",
					children: [[...b].sort((a, z) => z.updated_at.localeCompare(a.updated_at)).slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
							children: item.archived ? "Archived" : item.published ? "Live" : "Draft"
						})]
					}, item.id)), b.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted-foreground",
						children: "Nothing yet."
					}) : null]
				})]
			})]
		})]
	});
}
var SplitComponent = AdminOverview;
//#endregion
export { SplitComponent as component };
