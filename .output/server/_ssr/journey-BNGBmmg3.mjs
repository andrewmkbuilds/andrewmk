import { n as __toESM } from "../_runtime.mjs";
import { n as useReducedMotion, o as useScroll, r as useSpring } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { O as timeline, i as Layout } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as SectionHeading } from "./SectionHeading-DieYsKLk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journey-BNGBmmg3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Signature journey timeline: a scroll-linked progress spine with year markers
* that light up as the visitor moves through Andrew's development journey.
*/
function Timeline() {
	const ref = (0, import_react.useRef)(null);
	const reduce = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 75%", "end 60%"]
	});
	const progress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 30,
		mass: .4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		ref,
		className: "relative m-0 list-none space-y-12 pl-8 md:space-y-16 md:pl-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "absolute left-0 top-2 bottom-2 w-px bg-border md:left-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				"aria-hidden": "true",
				style: { scaleY: reduce ? 1 : progress },
				className: "absolute left-0 top-2 bottom-2 w-px origin-top bg-linear-to-b from-primary via-primary to-primary/20 md:left-1"
			}),
			timeline.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
				initial: reduce ? false : {
					opacity: 0,
					y: 24
				},
				whileInView: reduce ? {} : {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					margin: "0px 0px -12% 0px"
				},
				transition: {
					duration: .6,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "group relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
					"aria-hidden": "true",
					initial: reduce ? false : {
						scale: .4,
						opacity: 0
					},
					whileInView: reduce ? {} : {
						scale: 1,
						opacity: 1
					},
					viewport: {
						once: true,
						margin: "0px 0px -12% 0px"
					},
					transition: {
						duration: .45,
						delay: .1,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "absolute -left-8 top-1.5 flex h-3.5 w-3.5 items-center justify-center md:-left-[2.6rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-3.5 w-3.5 rounded-full bg-primary/20 transition-transform duration-500 group-hover:scale-150" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative h-[7px] w-[7px] rounded-full bg-gold shadow-glow" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface spotlight lift-3d relative overflow-hidden rounded-xl p-6 hover:border-gold/35 md:p-7",
					onPointerMove: (e) => {
						const el = e.currentTarget;
						const rect = el.getBoundingClientRect();
						el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
						el.style.setProperty("--my", `${e.clientY - rect.top}px`);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-wrap items-baseline gap-x-4 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-[0.24em] text-primary",
									children: entry.year
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden h-px flex-1 bg-border sm:block",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
									children: [
										String(index + 1).padStart(2, "0"),
										" / ",
										String(timeline.length).padStart(2, "0")
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-display mt-3 text-2xl text-foreground md:text-3xl",
							children: entry.title
						}),
						entry.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-xs text-primary",
							children: entry.meta
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2",
							children: entry.body.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground md:text-base",
								children: line
							}, line))
						}),
						entry.points && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 grid gap-2 sm:grid-cols-2",
							children: entry.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" }), point]
							}, point))
						})
					]
				})]
			}, entry.year + entry.title))
		]
	});
}
var flow = [
	"Robotics",
	"Software",
	"AI",
	"Systems"
];
function Journey() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4",
							children: "Journey"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance",
							children: "The Journey"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground leading-relaxed",
							children: "From a first robotics certification at age 9 to a growing ecosystem of products, experiments, and competitions."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 80,
					className: "mt-10 flex flex-wrap items-center gap-3",
					children: flow.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-foreground",
							children: step
						}), i < flow.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "→"
						})]
					}, step))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "sr-only",
						children: "Timeline of milestones"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {})]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				label: "Robotics",
				title: "Where It Started",
				subtitle: "The Mbot@IHS after-school programme at age 9 — building and presenting an original model at a school exhibition. Everything since has been an extension of that instinct."
			})
		})
	})] });
}
var SplitComponent = Journey;
//#endregion
export { SplitComponent as component };
