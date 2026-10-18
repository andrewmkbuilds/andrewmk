import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { R as ExternalLink, y as Printer, z as Download } from "../_libs/lucide-react.mjs";
import { C as munResults, D as socialLinks, O as timeline, _ as currentlyBuilding, a as Link$1, f as allProjects, g as competitionResults, h as buildingCategories, i as Layout, w as principles } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { n as certificateDateLabel, o as certificatesByRecency } from "./certificates-CO64SbXT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-C6VjpaFV.js
var import_jsx_runtime = require_jsx_runtime();
function Rule() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: "divider-gold mt-3 block h-px w-full"
	});
}
function Block({ eyebrow, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-10 first:pt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hairline-gold inline-block w-8"
				}), eyebrow]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-2xl font-semibold text-foreground md:text-3xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rule, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children
		})]
	});
}
function Resume() {
	const education = timeline.slice(0, 6);
	const highlighted = allProjects.slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface relative overflow-hidden rounded-2xl border border-gold/25 p-6 md:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "pointer-events-none absolute inset-x-0 top-0 h-px divider-gold"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-[0.22em] text-gold",
							children: "Résumé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl font-bold leading-[1.05] text-foreground md:text-5xl",
							children: "Andrew Mathews"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-lg text-primary",
							children: "Student Developer · AI Builder · Systems Thinker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-muted-foreground",
							children: "Dubai-based student developer building AI systems, software products, robotics projects and tools. Started with robotics at nine, now shipping full products and competing in STEM, engineering and MUN circuits."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/contact",
									className: "cta-pop focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground",
									children: ["Get in touch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "cta-arrow",
										children: "→"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => window.print(),
									className: "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/35 bg-gold/5 px-4 font-mono text-sm text-gold transition-colors hover:bg-gold/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print / Save as PDF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/profile",
									className: "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 font-mono text-sm text-foreground transition-colors hover:border-gold/50 hover:text-gold",
									children: "View profile"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground",
							children: socialLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: link.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "focus-ring inline-flex items-center gap-1 transition-colors hover:text-gold",
								children: [link.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
							}) }, link.id))
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					eyebrow: "Education & Journey",
					title: "Education and Training",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-5",
						children: education.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "surface rounded-xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-semibold text-foreground",
										children: entry.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-gold",
										children: entry.year
									})]
								}),
								entry.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: entry.meta
								}),
								entry.body.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-foreground/80",
									children: line
								}, line))
							]
						}, `${entry.year}-${entry.title}`))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
					eyebrow: "Selected Work",
					title: "Projects",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-4 sm:grid-cols-2",
						children: highlighted.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "surface rounded-xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: project.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
									children: project.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gold",
									children: project.tech.slice(0, 4).join(" · ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: `/projects/${project.slug}`,
									className: "focus-ring mt-3 inline-block font-mono text-xs text-primary hover:text-gold",
									children: "Read the case study →"
								})
							]
						}, project.slug))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-mono text-xs text-muted-foreground",
						children: [
							"Currently building:",
							" ",
							currentlyBuilding.map((item) => `${item.name} (${item.status})`).join(" · ")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					eyebrow: "Competitions",
					title: "Competitions and Recognition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "surface space-y-3 rounded-xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
								children: "STEM & Engineering"
							}), competitionResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: result.place
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										" ",
										"— ",
										[result.detail, result.event].filter(Boolean).join(", ")
									]
								})]
							}, `${result.place}-${result.detail}`))]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "surface space-y-3 rounded-xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
								children: "Model United Nations"
							}), munResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: result.title
								}), result.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" — ", result.detail]
								})]
							}, result.title))]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
					eyebrow: "Credentials",
					title: "Certificates",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "surface divide-y divide-border rounded-xl",
						children: certificatesByRecency.map((cert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: cert.title
								}), cert.issuer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: cert.issuer
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-gold",
								children: certificateDateLabel(cert)
							})]
						}, cert.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: "/achievements#certificates",
						className: "focus-ring mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Open the certificate gallery to view or download originals"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					eyebrow: "Skills",
					title: "Tools and Capabilities",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: buildingCategories.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "surface rounded-xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
								children: group.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1.5 text-sm text-muted-foreground",
								children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
							})]
						}, group.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
					eyebrow: "Approach",
					title: "How I Work",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-4 md:grid-cols-3",
						children: principles.map((principle) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "surface rounded-xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: principle.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: principle.body
							})]
						}, principle.title))
					})
				})
			]
		})
	}) });
}
var SplitComponent = Resume;
//#endregion
export { SplitComponent as component };
