import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, L as Eye, b as Plus, c as Trash2, g as Save } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as MediaPicker } from "./MediaPicker-Bvq-NoLF.mjs";
import { t as Textarea } from "./textarea-BflGnvAP.mjs";
import { a as saveProject, r as listAllProjects, t as deleteProject } from "./projects.functions-XuLZFS12.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.projects-CVPBKavC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	slug: "",
	name: "",
	category: "",
	description: "",
	full_description: "",
	problem: "",
	solution: "",
	features: [],
	process: "",
	learned: "",
	built: [],
	tech: [],
	filters: [],
	status: "Building",
	live: "",
	github: "",
	previously: "",
	platform: null,
	stack: null,
	challenges: null,
	results: null,
	gallery: null,
	metrics: null,
	featured: false,
	featured_image: "",
	image_alt: "",
	images: [],
	start_date: "",
	end_date: "",
	sort_order: 0,
	published: false,
	archived: false,
	seo_title: "",
	seo_description: "",
	canonical_url: "",
	og_image: ""
};
function toDraft(row) {
	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		category: row.category,
		description: row.description,
		full_description: row.full_description,
		problem: row.problem ?? "",
		solution: row.solution ?? "",
		features: row.features ?? [],
		process: row.process ?? "",
		learned: row.learned ?? "",
		built: row.built ?? [],
		tech: row.tech ?? [],
		filters: row.filters ?? [],
		status: row.status,
		live: row.live ?? "",
		github: row.github ?? "",
		previously: row.previously ?? "",
		platform: row.platform ?? null,
		stack: row.stack,
		challenges: row.challenges,
		results: row.results,
		gallery: row.gallery,
		metrics: row.metrics,
		featured: row.featured,
		featured_image: row.featured_image ?? "",
		image_alt: row.image_alt ?? "",
		images: row.images ?? [],
		start_date: row.start_date ?? "",
		end_date: row.end_date ?? "",
		sort_order: row.sort_order,
		published: row.published,
		archived: row.archived,
		seo_title: row.seo_title ?? "",
		seo_description: row.seo_description ?? "",
		canonical_url: row.canonical_url ?? "",
		og_image: row.og_image ?? ""
	};
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}
var lines = (value) => value.split("\n").map((s) => s.trim()).filter(Boolean);
function AdminProjects() {
	const fetchProjects = useServerFn(listAllProjects);
	const save = useServerFn(saveProject);
	const remove = useServerFn(deleteProject);
	const queryClient = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)(EMPTY);
	const [error, setError] = (0, import_react.useState)(null);
	const projects = useQuery({
		queryKey: ["admin-projects"],
		queryFn: () => fetchProjects()
	});
	const set = (key, value) => setDraft((d) => ({
		...d,
		[key]: value
	}));
	const saving = useMutation({
		mutationFn: (input) => save({ data: input }),
		onSuccess: (row) => {
			setError(null);
			setDraft(toDraft(row));
			queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
		},
		onError: (e) => setError(e.message)
	});
	const deleting = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => {
			setDraft(EMPTY);
			queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
		},
		onError: (e) => setError(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Projects",
		description: "Add, edit and publish the projects that appear in your portfolio. Drafts stay hidden from visitors and search engines.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: () => setDraft(EMPTY),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "h-4 w-4",
				"aria-hidden": "true"
			}), " New project"]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[320px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-xl border border-border bg-card p-4 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
					children: "All projects"
				}), projects.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": "true"
					}), " Loading…"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 max-h-[32rem] list-none space-y-1 overflow-auto p-0",
					children: (projects.data ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDraft(toDraft(row)),
						className: "focus-ring flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-background/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
							children: row.archived ? "Arch" : row.published ? "Live" : "Draft"
						})]
					}) }, row.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-5 rounded-xl border border-border bg-card p-5 shadow-card",
				onSubmit: (e) => {
					e.preventDefault();
					saving.mutate(draft);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-name",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-name",
									required: true,
									value: draft.name,
									onChange: (e) => {
										const name = e.target.value;
										setDraft((d) => ({
											...d,
											name,
											slug: d.id ? d.slug : slugify(name)
										}));
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-slug",
									children: "Web address (slug)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-slug",
									required: true,
									value: draft.slug,
									onChange: (e) => set("slug", slugify(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-category",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-category",
									value: draft.category,
									onChange: (e) => set("category", e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-status",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-status",
									value: draft.status,
									onChange: (e) => set("status", e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-description",
							children: "Short description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "p-description",
							rows: 2,
							value: draft.description,
							onChange: (e) => set("description", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-full",
							children: "Overview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "p-full",
							rows: 5,
							value: draft.full_description,
							onChange: (e) => set("full_description", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-problem",
								children: "Problem"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "p-problem",
								rows: 3,
								value: draft.problem ?? "",
								onChange: (e) => set("problem", e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-solution",
								children: "Solution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "p-solution",
								rows: 3,
								value: draft.solution ?? "",
								onChange: (e) => set("solution", e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-built",
									children: "What I built (one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "p-built",
									rows: 4,
									value: draft.built.join("\n"),
									onChange: (e) => set("built", lines(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-tech",
									children: "Tech (one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "p-tech",
									rows: 4,
									value: draft.tech.join("\n"),
									onChange: (e) => set("tech", lines(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-filters",
									children: "Filter tags (one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "p-filters",
									rows: 4,
									value: draft.filters.join("\n"),
									onChange: (e) => set("filters", lines(e.target.value))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-live",
								children: "Live link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "p-live",
								value: draft.live ?? "",
								onChange: (e) => set("live", e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "p-github",
								children: "GitHub link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "p-github",
								value: draft.github ?? "",
								onChange: (e) => set("github", e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
						id: "p-image",
						label: "Cover image",
						value: draft.featured_image ?? "",
						onChange: (url) => set("featured_image", url)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "p-alt",
							children: "Cover image description (alt text)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "p-alt",
							value: draft.image_alt ?? "",
							onChange: (e) => set("image_alt", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "px-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
								children: "Search engine details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-seo-title",
									children: "Title override"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-seo-title",
									value: draft.seo_title ?? "",
									onChange: (e) => set("seo_title", e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "p-seo-desc",
									children: "Description override"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "p-seo-desc",
									value: draft.seo_description ?? "",
									onChange: (e) => set("seo_description", e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: draft.published,
									onChange: (e) => set("published", e.target.checked)
								}), "Published"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: draft.featured,
									onChange: (e) => set("featured", e.target.checked)
								}), "Featured"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: draft.archived,
									onChange: (e) => set("archived", e.target.checked)
								}), "Archived"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-foreground",
								children: ["Order", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									className: "w-24",
									value: draft.sort_order,
									onChange: (e) => set("sort_order", Number(e.target.value) || 0)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: saving.isPending,
								className: "font-mono",
								children: [saving.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
									className: "h-4 w-4 animate-spin",
									"aria-hidden": "true"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), "Save"]
							}),
							draft.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								type: "button",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/projects/${draft.slug}`,
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), " Preview page"]
								})
							}) : null,
							draft.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								className: "text-destructive",
								disabled: deleting.isPending,
								onClick: () => {
									if (draft.id && confirm("Delete this project permanently?")) deleting.mutate(draft.id);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), " Delete"]
							}) : null
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground",
						children: error
					}) : null
				]
			})]
		})
	});
}
var SplitComponent = AdminProjects;
//#endregion
export { SplitComponent as component };
