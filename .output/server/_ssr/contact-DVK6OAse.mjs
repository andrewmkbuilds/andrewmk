import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { P as Github, T as Mail, f as Share2 } from "../_libs/lucide-react.mjs";
import { D as socialLinks, S as getSocialIcon, i as Layout, n as GITHUB_URL, r as LINKTREE_URL, t as CONTACT_EMAIL } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as ContactForm } from "./ContactForm-DGs96B50.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DVK6OAse.js
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 md:py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance",
						children: "Get in Touch"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg text-muted-foreground leading-relaxed",
						children: "Want to talk about technology, a project, collaboration, or something I'm building?"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 grid gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, { sourcePath: "/contact" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 80,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: GITHUB_URL,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "GitHub profile (@andrewmkbuilds)",
								className: "flex items-center gap-4 rounded-xl border border-primary/40 bg-card p-5 shadow-card transition-colors hover:border-gold focus-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm font-medium text-foreground",
									children: ["GitHub ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] uppercase tracking-wider text-primary",
										children: "· Primary"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-xs text-muted-foreground",
									children: "@andrewmkbuilds"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: LINKTREE_URL,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "All My Links — Linktree (linktr.ee/andrewmkbuilds)",
								className: "flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-card transition-colors hover:border-gold focus-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-sm font-semibold text-foreground",
											children: [
												"All My Links",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[10px] uppercase tracking-wider text-primary",
													children: "· Main hub"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-mono text-xs text-muted-foreground",
											children: "linktr.ee/andrewmkbuilds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-xs text-muted-foreground",
											children: "The central place to find every profile, project, and link."
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: socialLinks.filter((s) => s.id !== "github" && s.id !== "linktree").map((link) => {
									const Icon = getSocialIcon(link.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: link.url,
										target: "_blank",
										rel: "noopener noreferrer",
										"aria-label": `${link.label} profile (${link.handle})`,
										className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:border-gold/40 focus-ring",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-medium text-foreground",
											children: link.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-mono text-xs text-muted-foreground",
											children: link.handle
										})] })]
									}, link.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${CONTACT_EMAIL}`,
								className: "focus-ring flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-gold/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-foreground",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-mono text-xs text-muted-foreground",
									children: CONTACT_EMAIL
								})] })]
							})
						]
					})
				})]
			})]
		})
	}) });
}
var SplitComponent = Contact;
//#endregion
export { SplitComponent as component };
