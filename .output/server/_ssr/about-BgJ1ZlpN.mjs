import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as socialLinks, S as getSocialIcon, h as buildingCategories, i as Layout, w as principles } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as SectionHeading } from "./SectionHeading-DieYsKLk.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-BgJ1ZlpN.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4",
							children: "About"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance",
							children: "I don't just learn technology. I apply it."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 60,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg text-foreground leading-relaxed",
										children: "I'm a student, builder, and systems thinker based in Dubai. I work across artificial intelligence, software development, robotics, product design, and engineering competitions."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 120,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: "I started building with robotics at age 9 through the Mbot@IHS programme. That experience gave me the initial instinct to build things physically. From there, I moved deeper into software, AI, computer vision, and product development."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 180,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: "Today, I build everything from small Python experiments to full product systems such as Gradr, TerraCart, and ClientFlow OS. I also compete in STEM and engineering challenges, participate in MUNs, work on F1 in Schools / STEM Racing, and showcase projects through exhibitions."
									})
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-6 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-mono text-xs uppercase tracking-[0.16em] text-primary",
									children: "Profile"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 space-y-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-xs text-muted-foreground",
											children: "Identity"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-foreground",
											children: "Student · Developer · AI Builder · Systems Thinker"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-xs text-muted-foreground",
											children: "Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-foreground",
											children: "Dubai, UAE"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-xs text-muted-foreground",
											children: "Started building"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-foreground",
											children: "Age 9 · 2022"
										})] })
									]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 140,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-6 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-mono text-xs uppercase tracking-[0.16em] text-primary",
										children: "Elsewhere"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "This portfolio is the hub. These are the rest."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 space-y-1",
										children: socialLinks.map((link) => {
											const Icon = getSocialIcon(link.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: link.url,
												target: "_blank",
												rel: "noopener noreferrer",
												"aria-label": `${link.label} profile (${link.handle})`,
												className: "group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary focus-ring",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm text-foreground transition-colors group-hover:text-gold",
															children: link.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-xs text-muted-foreground",
															children: link.handle
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-0.5 block text-xs text-muted-foreground",
														children: link.description
													})]
												})]
											}) }, link.id);
										})
									})
								]
							})
						})]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Approach",
					title: "How I Think"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 md:grid-cols-3",
					children: principles.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 70,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 motion-reduce:hover:translate-y-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-primary",
									children: ["0", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-xl font-semibold text-foreground transition-colors group-hover:text-gold",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground leading-relaxed",
									children: p.body
								})
							]
						})
					}, p.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Focus areas",
					title: "My Building Categories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: buildingCategories.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold text-foreground",
								children: cat.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: cat.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: item }, item))
							})]
						})
					}, cat.title))
				})]
			})
		})
	] });
}
var SplitComponent = About;
//#endregion
export { SplitComponent as component };
