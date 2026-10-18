import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as GraduationCap, N as Globe, R as ExternalLink, Y as Award, i as Wrench, w as MapPin } from "../_libs/lucide-react.mjs";
import { C as munResults, D as socialLinks, E as quickStats, O as timeline, _ as currentlyBuilding, a as Link$1, f as allProjects, g as competitionResults, h as buildingCategories, i as Layout, p as andrewbuilds_logo_default } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { n as certificateDateLabel, o as certificatesByRecency } from "./certificates-CO64SbXT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-s6W28Q13.js
var import_jsx_runtime = require_jsx_runtime();
function Panel({ icon: Icon, title, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface relative overflow-hidden rounded-2xl p-6 md:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute inset-x-0 top-0 h-px divider-gold"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2.5 text-lg font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-gold" }), title]
				}), action]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children
			})
		]
	}) });
}
function Profile() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface relative overflow-hidden rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-32 bg-linear-to-r from-primary/25 via-primary/10 to-gold/20 md:h-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "absolute inset-x-0 bottom-0 h-px divider-gold"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 pb-7 md:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: andrewbuilds_logo_default,
								alt: "AndrewBuilds logo — Andrew Mathews, student developer in Dubai",
								width: 96,
								height: 96,
								className: "-mt-12 h-24 w-24 rounded-2xl border border-gold/40 bg-card p-2 shadow-card"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-start justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-3xl font-bold text-foreground md:text-4xl",
										children: "Andrew Mathews"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 text-primary",
										children: "Student Developer · AI Builder · Robotics & Systems"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-gold" }), "Dubai, United Arab Emirates"]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: "/contact",
										className: "cta-pop focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground",
										children: ["Connect", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											className: "cta-arrow",
											children: "→"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/resume",
										className: "focus-ring inline-flex min-h-11 items-center rounded-lg border border-gold/35 bg-gold/5 px-4 font-mono text-sm text-gold transition-colors hover:bg-gold/15",
										children: "View résumé"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
								children: quickStats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "sr-only",
											children: stat.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-mono text-xl font-semibold text-gold",
											children: stat.value
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-snug text-muted-foreground",
											children: stat.label
										})
									]
								}, stat.label))
							})
						]
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					icon: Globe,
					title: "About",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground md:text-base",
						children: "I'm a student developer from Dubai who builds AI systems, software products and robotics projects. I started with a school robotics programme at nine and have been shipping ever since — from computer-vision experiments and Python tools to full AI-powered products. I care about systems that solve a complete problem, not features in isolation."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 grid gap-2 sm:grid-cols-2",
						children: currentlyBuilding.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline gap-2 rounded-lg border border-border p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: item.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-gold",
									children: item.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: item.note
								})
							]
						}, item.name))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					icon: Wrench,
					title: "Projects",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/projects",
						className: "focus-ring font-mono text-xs text-primary hover:text-gold",
						children: "See all →"
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4",
						children: allProjects.slice(0, 5).map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: `/projects/${project.slug}`,
										className: "focus-ring text-base font-semibold text-foreground hover:text-gold",
										children: project.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted-foreground",
										children: project.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary",
										children: project.tech.slice(0, 5).join(" · ")
									})
								]
							})]
						}, project.slug))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					icon: GraduationCap,
					title: "Education & Journey",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-4",
						children: timeline.slice(0, 6).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-14 shrink-0 font-mono text-xs text-gold",
								children: entry.year
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 border-l border-border pl-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground",
										children: entry.title
									}),
									entry.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: entry.meta
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-muted-foreground",
										children: entry.body[0]
									})
								]
							})]
						}, `${entry.year}-${entry.title}`))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					icon: Award,
					title: "Honors & Certifications",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/achievements#certificates",
						className: "focus-ring font-mono text-xs text-primary hover:text-gold",
						children: "Gallery →"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2",
						children: [competitionResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-gold",
								children: result.place
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									" ",
									"— ",
									[result.detail, result.event].filter(Boolean).join(", ")
								]
							})]
						}, `${result.place}-${result.detail}`)), munResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-gold",
								children: result.title
							}), result.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" — ", result.detail]
							})]
						}, result.title))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 grid gap-2 sm:grid-cols-2",
						children: certificatesByRecency.slice(0, 8).map((cert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium leading-snug text-foreground",
								children: cert.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [cert.issuer, certificateDateLabel(cert)].filter(Boolean).join(" · ")
							})]
						}, cert.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					icon: Wrench,
					title: "Skills",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: buildingCategories.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
							children: group.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md border border-border px-2 py-1 text-xs text-muted-foreground",
								children: item
							}, item))
						})] }, group.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					icon: Globe,
					title: "Find me online",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 sm:grid-cols-2",
						children: socialLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: link.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "focus-ring flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:border-gold/45",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-foreground",
									children: link.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-mono text-xs text-muted-foreground",
									children: link.handle
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4 shrink-0 text-gold" })]
						}) }, link.id))
					})
				})
			]
		})
	}) });
}
var SplitComponent = Profile;
//#endregion
export { SplitComponent as component };
