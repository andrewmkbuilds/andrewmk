import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, R as ExternalLink, b as Plus, c as Trash2, g as Save } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as savePost, r as listAllPosts, t as deletePost } from "./blog.functions-Nh7upfwn.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as MediaPicker } from "./MediaPicker-Bvq-NoLF.mjs";
import { t as Textarea } from "./textarea-BflGnvAP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.blog-BP9bOoVx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	slug: "",
	title: "",
	excerpt: "",
	content: "",
	tags: "",
	cover_image: "",
	cover_image_alt: "",
	author: "Andrew Mathews",
	category: "",
	featured: false,
	archived: false,
	published: false,
	publish_at: "",
	reading_minutes: 3,
	seo_title: "",
	seo_description: "",
	canonical_url: "",
	og_image: ""
};
/** ISO timestamp -> value for <input type="datetime-local">. */
function toLocalInput(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toDraft(post) {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		content: post.content,
		tags: post.tags.join(", "),
		cover_image: post.cover_image ?? "",
		cover_image_alt: post.cover_image_alt ?? "",
		author: post.author || "Andrew Mathews",
		category: post.category ?? "",
		featured: post.featured,
		archived: post.archived,
		published: post.published,
		publish_at: toLocalInput(post.scheduled_at ?? post.published_at),
		reading_minutes: post.reading_minutes,
		seo_title: post.seo_title ?? "",
		seo_description: post.seo_description ?? "",
		canonical_url: post.canonical_url ?? "",
		og_image: post.og_image ?? ""
	};
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}
function statusLabel(post) {
	if (post.archived) return "Archived";
	if (!post.published) return "Draft";
	if (post.scheduled_at && new Date(post.scheduled_at).getTime() > Date.now()) return "Scheduled";
	return "Published";
}
function AdminBlog() {
	const fetchPosts = useServerFn(listAllPosts);
	const save = useServerFn(savePost);
	const remove = useServerFn(deletePost);
	const queryClient = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)(EMPTY);
	const [error, setError] = (0, import_react.useState)(null);
	const posts = useQuery({
		queryKey: ["admin-blog-posts"],
		queryFn: () => fetchPosts()
	});
	const saveMutation = useMutation({
		mutationFn: () => save({ data: {
			id: draft.id,
			slug: draft.slug || slugify(draft.title),
			title: draft.title,
			excerpt: draft.excerpt,
			content: draft.content,
			tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
			cover_image: draft.cover_image || null,
			cover_image_alt: draft.cover_image_alt,
			author: draft.author,
			category: draft.category,
			featured: draft.featured,
			archived: draft.archived,
			published: draft.published,
			publish_at: draft.publish_at ? new Date(draft.publish_at).toISOString() : null,
			reading_minutes: draft.reading_minutes,
			seo_title: draft.seo_title || null,
			seo_description: draft.seo_description || null,
			canonical_url: draft.canonical_url || null,
			og_image: draft.og_image || null
		} }),
		onSuccess: (post) => {
			setError(null);
			setDraft(toDraft(post));
			queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
		},
		onError: (e) => setError(e instanceof Error ? e.message : "Could not save post.")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			setDraft(EMPTY);
			queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Blog",
		description: "Write, schedule and publish posts. Drafts stay private until you publish them.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			className: "font-mono",
			onClick: () => setDraft(EMPTY),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "mr-2 h-4 w-4",
				"aria-hidden": "true"
			}), "New post"]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6",
				onSubmit: (e) => {
					e.preventDefault();
					saveMutation.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: draft.title,
							required: true,
							onChange: (e) => setDraft((d) => ({
								...d,
								title: e.target.value,
								slug: d.id || d.slug ? d.slug : slugify(e.target.value)
							}))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "slug",
							children: "Web address (slug)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "slug",
							value: draft.slug,
							required: true,
							onChange: (e) => setDraft((d) => ({
								...d,
								slug: e.target.value
							}))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "excerpt",
						children: "Excerpt"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "excerpt",
						rows: 2,
						value: draft.excerpt,
						onChange: (e) => setDraft((d) => ({
							...d,
							excerpt: e.target.value
						}))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "content",
						children: "Content (## heading, - bullet, 1. list)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "content",
						rows: 16,
						className: "font-mono text-sm",
						value: draft.content,
						onChange: (e) => setDraft((d) => ({
							...d,
							content: e.target.value
						}))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "tags",
								children: "Tags (comma separated)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "tags",
								value: draft.tags,
								onChange: (e) => setDraft((d) => ({
									...d,
									tags: e.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "category",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "category",
								value: draft.category,
								onChange: (e) => setDraft((d) => ({
									...d,
									category: e.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "minutes",
								children: "Reading minutes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "minutes",
								type: "number",
								min: 1,
								max: 60,
								value: draft.reading_minutes,
								onChange: (e) => setDraft((d) => ({
									...d,
									reading_minutes: Number(e.target.value) || 1
								}))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
							id: "cover",
							label: "Cover image",
							value: draft.cover_image,
							onChange: (url) => setDraft((d) => ({
								...d,
								cover_image: url
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "cover-alt",
							children: "Cover image description (alt text)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "cover-alt",
							value: draft.cover_image_alt,
							onChange: (e) => setDraft((d) => ({
								...d,
								cover_image_alt: e.target.value
							}))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "rounded-lg border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "px-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
							children: "Search engines"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "seo-title",
									children: "SEO title (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "seo-title",
									value: draft.seo_title,
									onChange: (e) => setDraft((d) => ({
										...d,
										seo_title: e.target.value
									}))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "canonical",
									children: "Canonical URL (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "canonical",
									value: draft.canonical_url,
									onChange: (e) => setDraft((d) => ({
										...d,
										canonical_url: e.target.value
									}))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "seo-desc",
										children: "SEO description (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "seo-desc",
										rows: 2,
										value: draft.seo_description,
										onChange: (e) => setDraft((d) => ({
											...d,
											seo_description: e.target.value
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
										id: "og-image",
										label: "Social share image (optional)",
										value: draft.og_image,
										onChange: (url) => setDraft((d) => ({
											...d,
											og_image: url
										}))
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "publish-at",
								children: "Publish date and time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "publish-at",
								type: "datetime-local",
								value: draft.publish_at,
								onChange: (e) => setDraft((d) => ({
									...d,
									publish_at: e.target.value
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Leave empty to publish immediately. A future time schedules the post."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "author",
							children: "Author"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "author",
							value: draft.author,
							onChange: (e) => setDraft((d) => ({
								...d,
								author: e.target.value
							}))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "h-4 w-4 accent-[var(--gold)]",
									checked: draft.published,
									onChange: (e) => setDraft((d) => ({
										...d,
										published: e.target.checked
									}))
								}), "Published"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "h-4 w-4 accent-[var(--gold)]",
									checked: draft.featured,
									onChange: (e) => setDraft((d) => ({
										...d,
										featured: e.target.checked
									}))
								}), "Featured"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "h-4 w-4 accent-[var(--gold)]",
									checked: draft.archived,
									onChange: (e) => setDraft((d) => ({
										...d,
										archived: e.target.checked
									}))
								}), "Archived"]
							})
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "font-mono",
								disabled: saveMutation.isPending,
								children: [saveMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "mr-2 h-4 w-4 animate-spin",
									"aria-hidden": "true"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
									className: "mr-2 h-4 w-4",
									"aria-hidden": "true"
								}), "Save post"]
							}),
							draft.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								type: "button",
								variant: "outline",
								className: "font-mono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/blog/${draft.slug}`,
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
										className: "mr-2 h-4 w-4",
										"aria-hidden": "true"
									}), "Preview"]
								})
							}),
							draft.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "font-mono",
								onClick: () => draft.id && deleteMutation.mutate(draft.id),
								disabled: deleteMutation.isPending,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "mr-2 h-4 w-4",
									"aria-hidden": "true"
								}), "Delete"]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: "Posts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 list-none space-y-2 p-0",
				children: [(posts.data ?? []).map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDraft(toDraft(post)),
					className: "focus-ring w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-gold/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-medium text-foreground",
						children: post.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
						children: [
							statusLabel(post),
							" · /",
							post.slug
						]
					})]
				}) }, post.id)), posts.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted-foreground",
					children: "Loading…"
				})]
			})] })]
		})
	});
}
var SplitComponent = AdminBlog;
//#endregion
export { SplitComponent as component };
