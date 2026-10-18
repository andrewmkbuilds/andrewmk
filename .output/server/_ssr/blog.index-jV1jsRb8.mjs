import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { Y as ArrowRight, x as PenLine } from "../_libs/lucide-react.mjs";
import { a as Link$1, i as Layout } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as Route } from "./blog.index-dBKYtlSk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.index-jV1jsRb8.js
var import_jsx_runtime = require_jsx_runtime();
function formatDate(value) {
	if (!value) return "";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function Blog({ posts }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "hairline-gold inline-block w-8"
						}), "Writing"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-display text-4xl text-balance text-foreground md:text-5xl",
						children: "Notes from the build log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg leading-relaxed text-muted-foreground",
						children: "Short essays on the projects I ship, the AI experiments that work (and the ones that do not), and the engineering habits behind them."
					})
				]
			}), posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-14 rounded-xl border border-dashed border-border bg-card p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {
							className: "mx-auto h-6 w-6 text-gold",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-lg font-semibold text-foreground",
							children: "No posts yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
							children: "The first article is being written. In the meantime, the projects page has the full build history."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/projects",
							className: "focus-ring mt-6 inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-gold",
							children: ["Browse projects", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							})]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-14 grid list-none gap-6 p-0 md:grid-cols-2",
				children: posts.map((post, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					as: "li",
					delay: i * 70,
					className: "h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: `/blog/${post.slug}`,
						className: "pop-card focus-ring flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										dateTime: post.published_at ?? void 0,
										className: "text-gold",
										children: formatDate(post.published_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "hairline-gold h-px flex-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [post.reading_minutes, " min read"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-display mt-4 text-xl text-foreground md:text-2xl",
								children: post.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex-1 leading-relaxed text-muted-foreground",
								children: post.excerpt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex flex-wrap items-center gap-2",
								children: post.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: tag }, tag))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
								children: ["Read post", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								})]
							})
						]
					})
				}, post.id))
			})]
		})
	}) });
}
function BlogRoute() {
	const { posts } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Blog, { posts });
}
//#endregion
export { BlogRoute as component };
