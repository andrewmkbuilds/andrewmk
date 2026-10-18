import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { X as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as Link$1, i as Layout } from "./Layout-C1nd09HF.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as Route } from "./blog._slug-swuSSVBJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-kdxMEiIR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Minimal, dependency-free renderer for the light markdown subset used in
* blog posts: ## / ### headings, - bullet lists, 1. ordered lists, paragraphs.
*/
function Prose({ content }) {
	const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: blocks.map((block, i) => {
			if (block.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 text-lg font-semibold text-foreground md:text-xl",
				children: block.slice(4)
			}, i);
			if (block.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-display mt-10 text-2xl text-foreground md:text-3xl",
				children: block.slice(3)
			}, i);
			const lines = block.split("\n");
			if (lines.every((l) => /^-\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-none space-y-2.5 p-0",
				children: lines.map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "leading-relaxed",
						children: l.replace(/^-\s+/, "")
					})]
				}, j))
			}, i);
			if (lines.every((l) => /^\d+\.\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-none space-y-2.5 p-0",
				children: lines.map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-gold",
						children: String(j + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "leading-relaxed",
						children: l.replace(/^\d+\.\s+/, "")
					})]
				}, j))
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "leading-relaxed text-muted-foreground",
				children: lines.map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [j > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}), l] }, j))
			}, i);
		})
	});
}
function formatDate(value) {
	if (!value) return "";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function BlogPostPage({ post }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "py-16 md:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: "/blog",
					className: "focus-ring inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-3.5 w-3.5",
						"aria-hidden": "true"
					}), "All writing"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: post.published_at ?? void 0,
									className: "text-gold",
									children: formatDate(post.published_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: "hairline-gold h-px w-10"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [post.reading_minutes, " min read"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-display mt-4 text-3xl text-balance text-foreground md:text-5xl",
							children: post.title
						}),
						post.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-lg leading-relaxed text-muted-foreground",
							children: post.excerpt
						}),
						post.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: post.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: tag }, tag))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divider-gold mt-10 pt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { content: post.content })
				})
			]
		})
	}) });
}
function BlogPostRoute() {
	const { post } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogPostPage, { post });
}
//#endregion
export { BlogPostRoute as component };
