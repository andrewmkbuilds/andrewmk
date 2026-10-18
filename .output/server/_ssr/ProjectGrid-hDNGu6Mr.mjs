import { n as __toESM } from "../_runtime.mjs";
import { a as useMotionValue, c as AnimatePresence, i as useTransform, n as useReducedMotion, r as useSpring } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn, t as Button } from "./button-BJUrh-0e.mjs";
import { K as ChevronDown, P as Github, R as ExternalLink, X as ArrowUpRight, Z as ArrowRight, m as SearchX, r as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { T as projectFilters, a as Link$1, v as ecosystemProjects } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as FilterBar } from "./FilterBar-BrGUlU8R.mjs";
import { i as platformFilters, n as PlatformBadge, r as getProjectPlatforms, t as BuiltBy } from "./BuiltBy-iOKN8MoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProjectGrid-hDNGu6Mr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectCard({ project, onOpen, variant = "compact", className }) {
	const ref = (0, import_react.useRef)(null);
	const reduce = useReducedMotion();
	const uid = (0, import_react.useId)().replace(/[:]/g, "");
	const triggerId = `project-details-trigger-${uid}`;
	const panelId = `project-details-panel-${uid}`;
	const [detailsOpen, setDetailsOpen] = (0, import_react.useState)(false);
	const triggerRef = (0, import_react.useRef)(null);
	const hasCaseStudy = Boolean(project.stack?.length || project.challenges?.length);
	const px = useMotionValue(.5);
	const py = useMotionValue(.5);
	const rotX = useSpring(useTransform(py, [0, 1], [2.5, -2.5]), {
		stiffness: 200,
		damping: 24
	});
	const rotY = useSpring(useTransform(px, [0, 1], [-3, 3]), {
		stiffness: 200,
		damping: 24
	});
	const handleMove = (e) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const nx = (e.clientX - rect.left) / rect.width;
		const ny = (e.clientY - rect.top) / rect.height;
		el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
		el.style.setProperty("--my", `${e.clientY - rect.top}px`);
		if (!reduce && e.pointerType === "mouse") {
			px.set(nx);
			py.set(ny);
		}
	};
	const reset = () => {
		px.set(.5);
		py.set(.5);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
		ref,
		"data-cursor": "view",
		onPointerMove: handleMove,
		onPointerLeave: reset,
		onKeyDown: (event) => {
			if (event.key !== "Escape" || !detailsOpen) return;
			event.stopPropagation();
			setDetailsOpen(false);
			triggerRef.current?.focus();
		},
		style: reduce ? {} : {
			rotateX: rotX,
			rotateY: rotY,
			transformPerspective: 1e3,
			transformStyle: "preserve-3d"
		},
		whileHover: reduce ? {} : { y: -6 },
		transition: {
			type: "spring",
			stiffness: 260,
			damping: 26
		},
		className: cn("surface spotlight edge-glow group relative isolate h-full rounded-2xl p-6 text-left", "transition-colors duration-300 hover:border-gold/35 hover:shadow-glow md:p-7", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-0 overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-0 bottom-0 h-40 translate-y-8 bg-linear-to-t from-primary/[0.09] to-transparent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onOpen(project),
				className: "focus-ring absolute inset-0 z-10 rounded-2xl",
				"aria-label": `View details for ${project.name}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-depth-lg relative flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.2em] text-primary",
					children: project.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cn("text-display mt-2.5 text-foreground transition-colors duration-300 group-hover:text-gold", variant === "featured" ? "text-2xl md:text-[2rem]" : "text-lg md:text-xl"),
					children: project.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:text-gold",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("card-depth-sm relative mt-3.5 leading-relaxed text-muted-foreground", variant === "featured" ? "text-base" : "text-sm"),
				children: project.description
			}),
			variant === "featured" && project.built.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-depth-sm relative z-20 mt-5",
				"data-pop-target": "project-details",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					ref: triggerRef,
					id: triggerId,
					type: "button",
					"aria-expanded": detailsOpen,
					"aria-controls": panelId,
					onClick: () => setDetailsOpen((value) => !value),
					className: "focus-ring inline-flex touch-manipulation items-center gap-2 rounded-md font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold",
					children: [`What's inside ${project.name}`, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
						"aria-hidden": "true",
						className: cn("pop-chevron h-4 w-4", detailsOpen && "rotate-180 text-primary")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: panelId,
					role: "region",
					"aria-labelledby": triggerId,
					className: "pop-panel",
					"data-open": detailsOpen ? "true" : "false",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pop-panel-inner",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid gap-2 pt-4 sm:grid-cols-2",
							children: project.built.slice(0, 6).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" }), item]
							}, item))
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-depth-md relative mt-5 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, {
					project,
					className: "relative z-20"
				}), project.tech.slice(0, 4).map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: tech }, tech))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-depth-sm relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 font-mono text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), project.status]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuiltBy, {
					project,
					className: "relative z-20"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-depth-sm relative z-20 mt-4 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: `/projects/${project.slug}`,
					onClick: (event) => event.stopPropagation(),
					className: "focus-ring inline-flex items-center gap-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-gold",
					children: [hasCaseStudy ? "Read case study" : "Open project page", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
						"aria-hidden": "true",
						className: "h-3.5 w-3.5"
					})]
				}), hasCaseStudy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold",
					children: "Case study"
				})]
			})
		]
	});
}
var EASE = [
	.22,
	1,
	.36,
	1
];
/** Premium project presentation surface — a full case sheet, not a plain modal. */
function ProjectModal({ project, open, onOpenChange }) {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && project && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, {
			forceMount: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
				asChild: true,
				forceMount: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					transition: { duration: .25 },
					className: "fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				asChild: true,
				forceMount: true,
				"aria-describedby": void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: reduce ? { opacity: 0 } : {
						opacity: 0,
						y: 28,
						scale: .985
					},
					animate: {
						opacity: 1,
						y: 0,
						scale: 1
					},
					exit: reduce ? { opacity: 0 } : {
						opacity: 0,
						y: 16,
						scale: .99
					},
					transition: {
						duration: .4,
						ease: EASE
					},
					className: "surface grain fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-3xl sm:w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"aria-hidden": "true",
							className: "pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden rounded-t-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "absolute -top-24 left-1/3 h-64 w-96 rounded-full bg-primary/12 blur-[100px]",
								animate: reduce ? {} : {
									x: [
										0,
										40,
										0
									],
									opacity: [
										.7,
										1,
										.7
									]
								},
								transition: {
									duration: 12,
									repeat: Infinity,
									ease: "easeInOut"
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							className: "focus-ring absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-gold/40 hover:text-gold",
							"aria-label": "Close project details",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative p-5 sm:p-6 md:p-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
								initial: reduce ? false : {
									opacity: 0,
									y: 14
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .45,
									delay: .06,
									ease: EASE
								},
								className: "max-w-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[11px] uppercase tracking-[0.22em] text-primary",
										children: project.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
										className: "text-display mt-3 text-2xl text-foreground sm:text-3xl md:text-5xl",
										children: project.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-base leading-relaxed text-muted-foreground",
										children: project.description
									}),
									project.previously && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-mono text-xs text-muted-foreground",
										children: project.previously
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformBadge, { project }), project.tech.map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: tech }, tech))]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: reduce ? false : "hidden",
								animate: reduce ? {} : "show",
								variants: {
									hidden: {},
									show: { transition: {
										staggerChildren: .07,
										delayChildren: .14
									} }
								},
								className: "mt-9 space-y-7",
								children: [
									project.problem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Problem",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm leading-relaxed text-muted-foreground md:text-base",
											children: project.problem
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "What I built",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "grid list-none gap-2.5 p-0 sm:grid-cols-2",
											children: project.built.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-start gap-2.5 rounded-lg border border-border/70 bg-background/40 p-3 text-sm text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" }), item]
											}, item))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Current status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-sm text-foreground",
											children: project.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Built by Andrew",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuiltBy, { project })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										variants: itemVariants,
										className: "flex flex-wrap items-center gap-3 border-t border-border pt-6 [&_a]:w-full sm:[&_a]:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "secondary",
											className: "cta-pop font-mono",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
												to: `/projects/${project.slug}`,
												onClick: () => onOpenChange(false),
												children: ["Read full case", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "cta-arrow ml-2 h-4 w-4" })]
											})
										})
									}),
									(project.live || project.github) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										variants: itemVariants,
										className: "flex flex-wrap gap-3 border-t border-border pt-6",
										children: [project.live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											className: "font-mono",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: project.live,
												target: "_blank",
												rel: "noopener noreferrer",
												children: ["Live app", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-2 h-4 w-4" })]
											})
										}), project.github && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											className: "font-mono",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: project.github,
												target: "_blank",
												rel: "noopener noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "mr-2 h-4 w-4" }), "GitHub"]
											})
										})]
									})
								]
							})]
						})
					]
				})
			})]
		}) })
	});
}
var itemVariants = {
	hidden: {
		opacity: 0,
		y: 14
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: .5,
			ease: EASE
		}
	}
};
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
		variants: itemVariants,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-mono text-[11px] uppercase tracking-[0.2em] text-primary",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hairline-x flex-1",
				"aria-hidden": "true"
			})]
		}), children]
	});
}
function ProjectCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full animate-pulse rounded-xl border border-border bg-card/60 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-24 rounded bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-5 w-2/3 rounded bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full rounded bg-muted/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-5/6 rounded bg-muted/70" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-16 rounded-full bg-muted/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-20 rounded-full bg-muted/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-14 rounded-full bg-muted/70" })
				]
			})
		]
	});
}
function ProjectGrid({ projects = ecosystemProjects, loading = false }) {
	const [active, setActive] = (0, import_react.useState)("All");
	const [platform, setPlatform] = (0, import_react.useState)("All");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const visible = (0, import_react.useMemo)(() => projects.filter((project) => {
		const techMatch = active === "All" || project.filters.includes(active);
		const platformMatch = platform === "All" || getProjectPlatforms(project).includes(platform);
		return techMatch && platformMatch;
	}), [
		active,
		platform,
		projects
	]);
	const openProject = (project) => {
		setSelected(project);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-project-grid": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {
					label: "Filter projects by technology",
					legend: "Tech",
					options: projectFilters,
					value: active,
					onChange: setActive
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {
					label: "Filter projects by platform",
					legend: "Platform",
					options: platformFilters,
					value: platform,
					onChange: setPlatform
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: loading ? "Loading projects." : `${visible.length} projects shown.`
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				"aria-hidden": "true",
				children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCardSkeleton, {}, index))
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchX, { className: "mx-auto h-8 w-8 text-muted-foreground/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-mono text-sm text-foreground",
						children: "No projects match these filters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
						children: [
							"Nothing here combines",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: active === "All" ? "every tech" : active
							}),
							" with",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: platform === "All" ? "every platform" : platform
							}),
							". Try widening one of them."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-5 font-mono text-xs focus-ring",
						onClick: () => {
							setActive("All");
							setPlatform("All");
						},
						children: "Reset filters"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: visible.map((project, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: Math.min(index, 6) * 50,
					className: "h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
						project,
						onOpen: openProject,
						className: "h-full"
					})
				}, project.slug))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectModal, {
				project: selected,
				open,
				onOpenChange: setOpen
			})
		]
	});
}
//#endregion
export { ProjectGrid as n, ProjectModal as r, ProjectCard as t };
