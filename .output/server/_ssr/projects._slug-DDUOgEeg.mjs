import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { P as Github, R as ExternalLink, X as ArrowLeft, Y as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as Link$1, f as allProjects, i as Layout } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as Route } from "./projects._slug-DxifDZXx.mjs";
import { t as StatusDot } from "./StatusDot-CTR_KAOE.mjs";
import { n as PlatformBadge, t as BuiltBy } from "./BuiltBy-iOKN8MoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._slug-DDUOgEeg.js
var import_jsx_runtime = require_jsx_runtime();
function related(project, catalogue = allProjects) {
	return catalogue.filter((p) => p.slug !== project.slug && p.filters.some((f) => project.filters.includes(f))).slice(0, 3);
}
function ProjectDetail({ project, catalogue }) {
	const others = related(project, catalogue);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-hero-veil grain",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-grid",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container relative py-16 md:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: "/projects",
					className: "focus-ring inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-3.5 w-3.5",
						"aria-hidden": "true"
					}), "All projects"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 14
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .5,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "mt-7 max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "hairline-gold inline-block w-8"
							}), project.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-display mt-4 text-4xl text-balance text-foreground md:text-6xl",
							children: project.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-base leading-relaxed text-muted-foreground md:text-lg",
							children: project.description
						}),
						project.previously && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-xs text-muted-foreground",
							children: project.previously
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, { project }), project.tech.map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: tech }, tech))]
						}),
						(project.live || project.github) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [project.live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "cta-pop font-mono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: project.live,
									target: "_blank",
									rel: "noopener noreferrer",
									children: ["Live app", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "cta-arrow ml-2 h-4 w-4" })]
								})
							}), project.github && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "font-mono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: project.github,
									target: "_blank",
									rel: "noopener noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-2 h-4 w-4" }), "Source"]
								})
							})]
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-10",
					children: [
						project.problem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
							children: "Problem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-muted-foreground",
							children: project.problem
						})] }),
						project.fullDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: 40,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
								children: "Overview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-4",
								children: project.fullDescription.split(/\n{2,}/).map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base leading-relaxed text-muted-foreground",
									children: para
								}, i))
							})]
						}),
						project.solution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: 50,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
								children: "Solution"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base leading-relaxed text-muted-foreground",
								children: project.solution
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: 70,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
								children: "What I built"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 grid list-none gap-2.5 p-0 sm:grid-cols-2",
								children: project.built.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 rounded-lg border border-border/70 bg-card p-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" }), item]
								}, item))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: 120,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
								children: "Built by Andrew"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuiltBy, { project })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 90,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "pop-card h-full rounded-xl border border-border bg-card p-6 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
							children: "At a glance"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "mt-1 flex items-center gap-2 text-sm font-medium text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, {}), project.status]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-sm font-medium text-foreground",
									children: project.category
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
									children: "Focus"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-2 flex flex-wrap gap-2",
									children: project.filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: f }, f))
								})] })
							]
						})]
					})
				})]
			})
		}),
		project.stack && project.stack.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-display text-2xl text-foreground md:text-3xl",
					children: "Tech stack"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4",
					children: project.stack.map((group, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pop-card h-full rounded-xl border border-border bg-card p-5 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-mono text-[11px] uppercase tracking-[0.18em] text-gold",
								children: group.group
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: item }, item))
							})]
						})
					}, group.group))
				})]
			})
		}),
		project.challenges && project.challenges.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-display text-2xl text-foreground md:text-3xl",
					children: "Challenges & how I solved them"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid list-none gap-5 p-0 md:grid-cols-2",
					children: project.challenges.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pop-card h-full rounded-xl border border-border bg-card p-6 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold text-foreground",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: c.detail
							})]
						})
					}, c.title))
				})]
			})
		}),
		project.metrics && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-display text-2xl text-foreground md:text-3xl",
						children: project.metrics.title
					}),
					project.metrics.intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base",
						children: project.metrics.intro
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
						children: project.metrics.items.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 60,
							className: "h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pop-card h-full rounded-xl border border-gold/25 bg-card p-6 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-display text-3xl leading-none text-gold md:text-4xl",
										children: m.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground",
										children: m.label
									}),
									m.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: m.note
									})
								]
							})
						}, m.label))
					}),
					project.metrics.breakdown && project.metrics.breakdown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 120,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-8 grid gap-x-8 gap-y-3 rounded-xl border border-border bg-card/60 p-6 sm:grid-cols-2 lg:grid-cols-3",
							children: project.metrics.breakdown.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-4 border-b border-border/60 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: b.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-sm text-gold",
									children: b.value
								})]
							}, `${b.label}-${b.value}`))
						})
					}),
					project.metrics.source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground",
						children: project.metrics.source
					})
				]
			})
		}),
		project.results && project.results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-display text-2xl text-foreground md:text-3xl",
					children: "Results so far"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: project.results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pop-card h-full rounded-xl border border-border bg-card p-5 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
								children: r.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-lg font-semibold text-gold",
									children: r.value
								}), r.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1.5 block text-sm leading-relaxed text-muted-foreground",
									children: r.note
								})]
							})]
						})
					}, r.label))
				})]
			})
		}),
		others.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-display text-2xl text-foreground md:text-3xl",
					children: "Related work"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid list-none gap-5 p-0 md:grid-cols-3",
					children: others.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: `/projects/${p.slug}`,
							className: "pop-card focus-ring flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
									children: p.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 text-lg font-semibold text-foreground",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
									children: p.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
									children: ["Open case", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									})]
								})
							]
						})
					}, p.slug))
				})]
			})
		})
	] }) });
}
/** Absolute URL for an image reference that may be site-relative. */
function ProjectDetailRoute() {
	const { project, catalogue } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDetail, {
		project,
		catalogue
	});
}
//#endregion
export { ProjectDetailRoute as component };
