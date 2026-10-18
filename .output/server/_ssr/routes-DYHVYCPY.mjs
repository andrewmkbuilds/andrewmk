import { n as __toESM } from "../_runtime.mjs";
import { a as useMotionValue, i as useTransform, l as performance_default, n as useReducedMotion, r as useSpring } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn, t as Button } from "./button-BJUrh-0e.mjs";
import { $ as AppWindow, B as Cpu, F as GitFork, H as CloudOff, J as BrainCircuit, K as ChevronDown, R as ExternalLink, X as ArrowUpRight, Z as ArrowRight, a as Workflow, h as ScanEye, l as Star, q as ChartLine, v as RefreshCw, z as Download } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { D as socialLinks, E as quickStats, S as getSocialIcon, _ as currentlyBuilding, a as Link$1, b as featuredProjects, h as buildingCategories, i as Layout, m as buildAreas, o as SocialIcons, w as principles, x as getProject } from "./Layout-C1nd09HF.mjs";
import { n as RevealWords, t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as SectionHeading } from "./SectionHeading-DieYsKLk.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as ContactForm } from "./ContactForm-DGs96B50.mjs";
import { t as StatusDot } from "./StatusDot-CTR_KAOE.mjs";
import { n as ProjectGrid, r as ProjectModal, t as ProjectCard } from "./ProjectGrid-hDNGu6Mr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYHVYCPY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GITHUB_USER = "andrewmkbuilds";
/** Height reserved for the body so the card never shifts between states. */
var BODY_MIN_HEIGHT = "min-h-[356px] sm:min-h-[190px]";
/**
* Live preview of public GitHub repositories via the public, unauthenticated
* GitHub REST API. Shows a skeleton while loading and a graceful fallback when
* the API is unavailable or rate-limited — never fabricated data.
*/
function GithubPreview() {
	const [repos, setRepos] = (0, import_react.useState)(null);
	const [state, setState] = (0, import_react.useState)("loading");
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const controller = new AbortController();
		setState("loading");
		fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=4`, {
			signal: controller.signal,
			headers: { Accept: "application/vnd.github+json" }
		}).then((res) => res.ok ? res.json() : Promise.reject(new Error(String(res.status)))).then((data) => {
			if (!Array.isArray(data) || data.length === 0) {
				setState("unavailable");
				return;
			}
			setRepos(data.slice(0, 4));
			setState("ready");
		}).catch((err) => {
			if (err.name !== "AbortError") setState("unavailable");
		});
		return () => controller.abort();
	}, [attempt]);
	const retry = (0, import_react.useCallback)(() => setAttempt((a) => a + 1), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lift-3d rounded-xl border border-border bg-card/60 p-5 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-mono text-[11px] uppercase tracking-[0.16em] text-primary",
				children: "Live from GitHub"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `https://github.com/${GITHUB_USER}?tab=repositories`,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex items-center gap-1 whitespace-nowrap rounded font-mono text-[11px] text-muted-foreground transition-colors hover:text-gold focus-ring",
				"aria-label": "See all public repositories on GitHub (opens in a new tab)",
				children: ["All repos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
					className: "h-3 w-3",
					"aria-hidden": "true"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: BODY_MIN_HEIGHT,
			"aria-live": "polite",
			"aria-busy": state === "loading",
			children: [
				state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Loading recent repositories…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					"aria-hidden": "true",
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: "h-[78px] animate-pulse rounded-lg border border-border/60 bg-muted/40 motion-reduce:animate-none" }, i))
				})] }),
				state === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex h-[330px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-background/30 px-4 text-center sm:h-[164px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, {
							className: "h-5 w-5 text-muted-foreground",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Live repository data isn't available right now."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: retry,
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold focus-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
									className: "h-3 w-3",
									"aria-hidden": "true"
								}), " Try again"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://github.com/${GITHUB_USER}?tab=repositories`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] text-primary transition-colors hover:brightness-110 focus-ring",
								children: ["Browse on GitHub ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
									className: "h-3 w-3",
									"aria-hidden": "true"
								})]
							})]
						})
					]
				}),
				state === "ready" && repos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: repos.map((repo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: repo.html_url,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": `${repo.name} repository on GitHub (opens in a new tab)`,
						className: "group block h-full rounded-lg border border-border/70 bg-background/40 p-3 transition-all hover:-translate-y-0.5 hover:border-gold/40 focus-ring motion-reduce:hover:translate-y-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm text-foreground transition-colors group-hover:text-gold",
								children: repo.name
							}),
							repo.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
								children: repo.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground",
								children: [
									repo.language && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-1.5 w-1.5 rounded-full bg-primary",
											"aria-hidden": "true"
										}), repo.language]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
												className: "h-3 w-3",
												"aria-hidden": "true"
											}),
											" ",
											repo.stargazers_count,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sr-only",
												children: "stars"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, {
												className: "h-3 w-3",
												"aria-hidden": "true"
											}),
											" ",
											repo.forks_count,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sr-only",
												children: "forks"
											})
										]
									})
								]
							})
						]
					}) }, repo.id))
				})
			]
		})]
	});
}
/** "Find Me Online" — integrated profile hub, not a link list. */
function FindMeOnline() {
	const [primary, ...rest] = socialLinks;
	if (!primary) return null;
	const PrimaryIcon = getSocialIcon(primary.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border py-20 md:py-28",
		id: "online",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				label: "Online",
				title: "Find Me Online",
				subtitle: "Follow what I'm building, experimenting with, and learning."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card hover:border-gold/40 hover:shadow-glow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryIcon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-semibold text-foreground",
												children: primary.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-1.5 w-1.5 rounded-full bg-primary",
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] uppercase tracking-[0.16em] text-primary",
												children: "Primary"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-sm text-muted-foreground",
										children: primary.handle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: primary.description
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: primary.url,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": `${primary.cta} — ${primary.handle} (opens in a new tab)`,
								className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs text-primary-foreground transition-all hover:brightness-110 focus-ring",
								children: [
									primary.cta,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubPreview, {})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: rest.map((link, i) => {
						const Icon = getSocialIcon(link.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 60 + i * 60,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: link.url,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": `${link.cta} — ${link.handle} (opens in a new tab)`,
								className: "group lift-3d flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:border-gold/40 hover:shadow-glow focus-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors group-hover:border-gold/40 group-hover:text-gold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-foreground transition-colors group-hover:text-gold",
												children: link.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-xs text-muted-foreground",
											children: link.handle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1.5 text-sm text-muted-foreground",
											children: link.description
										})
									]
								})]
							})
						}, link.id);
					})
				})]
			})]
		})
	});
}
/**
* Subtle magnetic pull towards the cursor. Desktop pointers only —
* automatically inert on touch devices and with reduced-motion enabled.
*/
function Magnetic({ children, className, strength = .28, radius = 90 }) {
	const ref = (0, import_react.useRef)(null);
	const reduce = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const sx = useSpring(x, {
		stiffness: 220,
		damping: 18,
		mass: .35
	});
	const sy = useSpring(y, {
		stiffness: 220,
		damping: 18,
		mass: .35
	});
	const handleMove = (e) => {
		if (reduce || e.pointerType !== "mouse" || !ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / (radius + rect.width / 2));
		x.set(dx * strength * falloff);
		y.set(dy * strength * falloff);
	};
	const reset = () => {
		x.set(0);
		y.set(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
		ref,
		onPointerMove: handleMove,
		onPointerLeave: reset,
		style: {
			x: sx,
			y: sy
		},
		className: cn("inline-flex", className),
		children
	});
}
var NODES = [
	{
		id: "Builder",
		x: .5,
		y: .5,
		r: 5.5,
		ring: 0,
		label: "Builder",
		phase: 0,
		amp: 2
	},
	{
		id: "AI",
		x: .28,
		y: .26,
		r: 3.6,
		ring: 1,
		label: "AI",
		phase: .8,
		amp: 6
	},
	{
		id: "Software",
		x: .74,
		y: .22,
		r: 3.6,
		ring: 1,
		label: "Software",
		phase: 1.9,
		amp: 7
	},
	{
		id: "Robotics",
		x: .82,
		y: .58,
		r: 3.4,
		ring: 1,
		label: "Robotics",
		phase: 3.1,
		amp: 6
	},
	{
		id: "Systems",
		x: .62,
		y: .82,
		r: 3.4,
		ring: 1,
		label: "Systems",
		phase: 4.2,
		amp: 7
	},
	{
		id: "Product",
		x: .22,
		y: .7,
		r: 3.4,
		ring: 1,
		label: "Product",
		phase: 5.3,
		amp: 6
	},
	{
		id: "Vision",
		x: .12,
		y: .44,
		r: 2.4,
		ring: 2,
		phase: 2.2,
		amp: 8
	},
	{
		id: "Data",
		x: .44,
		y: .12,
		r: 2.2,
		ring: 2,
		phase: .4,
		amp: 8
	},
	{
		id: "Automation",
		x: .9,
		y: .36,
		r: 2.2,
		ring: 2,
		phase: 3.7,
		amp: 9
	},
	{
		id: "Web",
		x: .9,
		y: .8,
		r: 2.2,
		ring: 2,
		phase: 1.2,
		amp: 8
	},
	{
		id: "Edge",
		x: .36,
		y: .92,
		r: 2.2,
		ring: 2,
		phase: 5.9,
		amp: 9
	},
	{
		id: "Design",
		x: .08,
		y: .84,
		r: 2.2,
		ring: 2,
		phase: 4.8,
		amp: 8
	}
];
var EDGES = [
	["Builder", "AI"],
	["Builder", "Software"],
	["Builder", "Robotics"],
	["Builder", "Systems"],
	["Builder", "Product"],
	["AI", "Data"],
	["AI", "Vision"],
	["Software", "Web"],
	["Software", "Automation"],
	["Robotics", "Automation"],
	["Systems", "Edge"],
	["Product", "Design"],
	["Product", "Vision"],
	["Software", "AI"],
	["Systems", "Robotics"]
];
/**
* Hero "ecosystem" visualisation: a connected system of disciplines with
* travelling signal pulses. Canvas-based (single GPU-friendly layer), pauses
* when off-screen, renders a static composition under prefers-reduced-motion.
*/
function SystemGraph({ className }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const styles = getComputedStyle(document.documentElement);
		const primary = styles.getPropertyValue("--primary").trim() || "hsl(205 82% 54%)";
		const glow = styles.getPropertyValue("--gold").trim() || "hsl(41 72% 58%)";
		const fg = styles.getPropertyValue("--muted-foreground").trim() || "hsl(213 15% 70%)";
		let width = 0;
		let height = 0;
		let dpr = 1;
		let raf = 0;
		let running = false;
		let start = performance_default.now();
		const pointer = {
			x: .5,
			y: .5,
			tx: .5,
			ty: .5,
			active: false
		};
		const pulses = EDGES.map((_, i) => ({
			edge: i,
			t: Math.random(),
			speed: .05 + Math.random() * .07
		}));
		const index = new Map(NODES.map((n, i) => [n.id, i]));
		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		const positions = (time) => {
			const depthX = (pointer.x - .5) * 26;
			const depthY = (pointer.y - .5) * 20;
			return NODES.map((n) => {
				const drift = reduce ? 0 : Math.sin(time * 35e-5 + n.phase) * n.amp;
				const drift2 = reduce ? 0 : Math.cos(time * 28e-5 + n.phase * 1.3) * n.amp * .6;
				const depth = n.ring === 0 ? .35 : n.ring === 1 ? .75 : 1.15;
				return {
					...n,
					px: n.x * width + drift2 + depthX * depth,
					py: n.y * height + drift + depthY * depth
				};
			});
		};
		const draw = (now) => {
			const time = now - start;
			pointer.x += (pointer.tx - pointer.x) * .06;
			pointer.y += (pointer.ty - pointer.y) * .06;
			const pts = positions(time);
			ctx.clearRect(0, 0, width, height);
			EDGES.forEach(([a, b], i) => {
				const na = pts[index.get(a)];
				const nb = pts[index.get(b)];
				if (!na || !nb) return;
				const grad = ctx.createLinearGradient(na.px, na.py, nb.px, nb.py);
				grad.addColorStop(0, withAlpha(primary, na.ring === 0 ? .35 : .16));
				grad.addColorStop(1, withAlpha(primary, nb.ring === 2 ? .07 : .16));
				ctx.strokeStyle = grad;
				ctx.lineWidth = na.ring === 0 || nb.ring === 0 ? 1.1 : .75;
				ctx.beginPath();
				ctx.moveTo(na.px, na.py);
				ctx.lineTo(nb.px, nb.py);
				ctx.stroke();
				if (!reduce) {
					const p = pulses[i];
					p.t += p.speed * .016;
					if (p.t > 1) p.t -= 1;
					const ease = p.t;
					const px = na.px + (nb.px - na.px) * ease;
					const py = na.py + (nb.py - na.py) * ease;
					const fade = Math.sin(Math.PI * ease);
					ctx.fillStyle = withAlpha(glow, .7 * fade);
					ctx.beginPath();
					ctx.arc(px, py, 1.6, 0, Math.PI * 2);
					ctx.fill();
				}
			});
			pts.forEach((n) => {
				const pulse = reduce ? 0 : (Math.sin(time * .0016 + n.phase) + 1) / 2;
				const radius = n.r + (n.ring === 0 ? pulse * 1.2 : pulse * .4);
				if (n.ring === 0) {
					const halo = ctx.createRadialGradient(n.px, n.py, 0, n.px, n.py, 74);
					halo.addColorStop(0, withAlpha(primary, .22));
					halo.addColorStop(1, withAlpha(primary, 0));
					ctx.fillStyle = halo;
					ctx.beginPath();
					ctx.arc(n.px, n.py, 74, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.fillStyle = withAlpha(n.ring === 2 ? fg : primary, n.ring === 2 ? .45 : .95);
				ctx.beginPath();
				ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
				ctx.fill();
				if (n.ring <= 1) {
					ctx.strokeStyle = withAlpha(primary, .25 + pulse * .2);
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.arc(n.px, n.py, radius + 6 + (n.ring === 0 ? pulse * 5 : 0), 0, Math.PI * 2);
					ctx.stroke();
				}
				if (n.label && width > 380) {
					ctx.font = "500 10px 'JetBrains Mono', monospace";
					ctx.fillStyle = withAlpha(n.ring === 0 ? primary : fg, n.ring === 0 ? .95 : .7);
					ctx.textAlign = "center";
					ctx.fillText(n.label.toUpperCase(), n.px, n.py - radius - 12);
				}
			});
			if (!reduce && running) raf = requestAnimationFrame(draw);
		};
		const onPointerMove = (e) => {
			if (e.pointerType !== "mouse") return;
			const rect = canvas.getBoundingClientRect();
			pointer.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
			pointer.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
		};
		const onPointerLeave = () => {
			pointer.tx = .5;
			pointer.ty = .5;
		};
		const startLoop = () => {
			if (running) return;
			running = true;
			start = performance_default.now() - 1200;
			raf = requestAnimationFrame(draw);
		};
		const stopLoop = () => {
			running = false;
			cancelAnimationFrame(raf);
		};
		resize();
		if (reduce) draw(performance_default.now());
		else startLoop();
		const ro = new ResizeObserver(() => {
			resize();
			if (reduce) draw(performance_default.now());
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([entry]) => {
			if (reduce) return;
			if (entry?.isIntersecting) startLoop();
			else stopLoop();
		}, { threshold: .01 });
		io.observe(canvas);
		const parent = canvas.parentElement ?? canvas;
		parent.addEventListener("pointermove", onPointerMove);
		parent.addEventListener("pointerleave", onPointerLeave);
		return () => {
			stopLoop();
			ro.disconnect();
			io.disconnect();
			parent.removeEventListener("pointermove", onPointerMove);
			parent.removeEventListener("pointerleave", onPointerLeave);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className,
		role: "img",
		"aria-label": "Abstract visualisation of Andrew's building ecosystem: AI, software, robotics, systems and product connected around a central node."
	});
}
/** Accepts hsl()/oklch() CSS colour strings and applies an alpha channel. */
/** Applies an alpha channel to any CSS colour string. */
function withAlpha(color, alpha) {
	const a = Math.max(0, Math.min(1, alpha));
	const [r, g, b] = toRgb(color);
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}
var rgbCache = /* @__PURE__ */ new Map();
/** Resolves any CSS colour string (hex, hsl, oklch, ...) to rgb triplets. */
function toRgb(color) {
	const cached = rgbCache.get(color);
	if (cached) return cached;
	let out = [
		48,
		181,
		128
	];
	try {
		const c = document.createElement("canvas");
		c.width = 1;
		c.height = 1;
		const ctx = c.getContext("2d", { willReadFrequently: true });
		if (ctx) {
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, 1, 1);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			out = [
				d[0] ?? 0,
				d[1] ?? 0,
				d[2] ?? 0
			];
		}
	} catch {}
	rgbCache.set(color, out);
	return out;
}
/**
* Pointer-driven 3D tilt wrapper.
* Desktop mouse only: touch pointers, coarse pointers and reduced-motion users
* get a plain static container so nothing feels laggy or gimmicky on mobile.
*/
function Tilt3D({ children, className, intensity = 6, perspective = 1100 }) {
	const ref = (0, import_react.useRef)(null);
	const reduce = useReducedMotion();
	const px = useMotionValue(.5);
	const py = useMotionValue(.5);
	const spring = {
		stiffness: 150,
		damping: 22,
		mass: .6
	};
	const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), spring);
	const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), spring);
	const handleMove = (e) => {
		if (reduce || e.pointerType !== "mouse") return;
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		px.set((e.clientX - rect.left) / rect.width);
		py.set((e.clientY - rect.top) / rect.height);
	};
	const reset = () => {
		px.set(.5);
		py.set(.5);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref,
		onPointerMove: handleMove,
		onPointerLeave: reset,
		style: reduce ? {} : {
			rotateX,
			rotateY,
			transformPerspective: perspective,
			transformStyle: "preserve-3d"
		},
		className: cn("relative", className),
		children
	});
}
var TECH = [
	{
		name: "Python",
		x: 16,
		y: 26,
		group: "language"
	},
	{
		name: "TypeScript",
		x: 44,
		y: 14,
		group: "language"
	},
	{
		name: "React",
		x: 70,
		y: 24,
		group: "framework"
	},
	{
		name: "Flutter",
		x: 88,
		y: 46,
		group: "framework"
	},
	{
		name: "Tkinter",
		x: 12,
		y: 58,
		group: "framework"
	},
	{
		name: "AI",
		x: 50,
		y: 46,
		group: "ai"
	},
	{
		name: "OpenCV",
		x: 26,
		y: 78,
		group: "ai"
	},
	{
		name: "MediaPipe",
		x: 56,
		y: 82,
		group: "ai"
	},
	{
		name: "Supabase",
		x: 80,
		y: 72,
		group: "platform"
	},
	{
		name: "Base44",
		x: 34,
		y: 44,
		group: "platform"
	},
	{
		name: "Lovable",
		x: 70,
		y: 56,
		group: "platform"
	}
];
var LINKS = [
	["Python", "AI"],
	["Python", "OpenCV"],
	["OpenCV", "MediaPipe"],
	["AI", "MediaPipe"],
	["AI", "Base44"],
	["AI", "Lovable"],
	["TypeScript", "React"],
	["React", "Lovable"],
	["React", "Supabase"],
	["Lovable", "Supabase"],
	["Base44", "TypeScript"],
	["Flutter", "React"],
	["Tkinter", "Python"],
	["Base44", "Python"]
];
var groupLabel = {
	language: "Language",
	framework: "Framework",
	ai: "AI / Vision",
	platform: "Platform"
};
/**
* Interactive technology constellation — SVG lines + DOM chips so it stays
* readable, accessible and crisp at every breakpoint.
*/
function TechConstellation({ className }) {
	const [active, setActive] = (0, import_react.useState)(null);
	const reduce = useReducedMotion();
	const ref = (0, import_react.useRef)(null);
	const isDimmed = (name) => active !== null && active !== name && !LINKS.some(([a, b]) => a === active && b === name || b === active && a === name);
	const byName = Object.fromEntries(TECH.map((t) => [t.name, t]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("surface grain relative overflow-hidden rounded-2xl", "h-[420px] sm:h-[460px] lg:h-[520px]", className),
		onMouseLeave: () => setActive(null),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 bg-grid opacity-40",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[90px]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "absolute inset-0 h-full w-full",
				"aria-hidden": "true",
				children: LINKS.map(([a, b]) => {
					const na = byName[a];
					const nb = byName[b];
					if (!na || !nb) return null;
					const lit = active === a || active === b;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.line, {
						x1: `${na.x}%`,
						y1: `${na.y}%`,
						x2: `${nb.x}%`,
						y2: `${nb.y}%`,
						stroke: "var(--gold)",
						strokeWidth: lit ? 1.4 : .8,
						initial: reduce ? false : {
							pathLength: 0,
							opacity: 0
						},
						whileInView: reduce ? {} : {
							pathLength: 1,
							opacity: lit ? .6 : .16
						},
						animate: { opacity: lit ? .6 : .16 },
						viewport: {
							once: true,
							margin: "-10%"
						},
						transition: {
							duration: .9,
							ease: [
								.22,
								1,
								.36,
								1
							]
						}
					}, `${a}-${b}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute inset-0 m-0 list-none p-0",
				children: TECH.map((tech, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.li, {
					className: "absolute",
					style: {
						left: `${tech.x}%`,
						top: `${tech.y}%`,
						translateX: "-50%",
						translateY: "-50%"
					},
					initial: reduce ? false : {
						opacity: 0,
						scale: .85
					},
					whileInView: reduce ? {} : {
						opacity: 1,
						scale: 1
					},
					viewport: {
						once: true,
						margin: "-10%"
					},
					transition: {
						duration: .5,
						delay: .05 * i,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onMouseEnter: () => setActive(tech.name),
						onFocus: () => setActive(tech.name),
						onBlur: () => setActive(null),
						"aria-label": `${tech.name} — ${groupLabel[tech.group]}`,
						className: cn("focus-ring group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur-sm transition-all duration-300 sm:text-xs", active === tech.name ? "border-primary/60 bg-primary/15 text-foreground shadow-glow scale-105" : "border-border bg-card/80 text-muted-foreground hover:border-gold/40 hover:text-foreground", isDimmed(tech.name) && "opacity-35"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("h-1.5 w-1.5 rounded-full transition-colors", tech.group === "ai" || tech.group === "platform" ? "bg-primary" : "bg-muted-foreground group-hover:bg-gold"),
							"aria-hidden": "true"
						}), tech.name]
					})
				}, tech.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "//"
					}),
					" ",
					active ? groupLabel[byName[active].group] : "Hover a node"
				]
			})
		]
	});
}
function TypingCursor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-[3px] h-[1em] bg-primary animate-blink ml-1 align-middle" });
}
/**
* A card that doubles as a disclosure ("pop-out") panel.
*
* - The whole card is the pop surface (.pop-card) and lifts on hover
*   (pointer devices only) and on :focus-within.
* - The header is a real <button> with aria-expanded / aria-controls, so
*   screen readers announce collapsed/expanded state and touch users get a
*   reliable tap toggle that never interferes with scrolling.
* - Escape closes the open panel and returns focus to its trigger.
*/
function PopDisclosure({ title, summary, media, headingLevel = "h3", kind, popTarget, className, panelClassName, children }) {
	const uid = (0, import_react.useId)().replace(/[:]/g, "");
	const triggerId = `pop-trigger-${uid}`;
	const panelId = `pop-panel-${uid}`;
	const [open, setOpen] = (0, import_react.useState)(false);
	const triggerRef = (0, import_react.useRef)(null);
	const Heading = headingLevel;
	const onKeyDown = (0, import_react.useCallback)((event) => {
		if (event.key !== "Escape" || !open) return;
		event.stopPropagation();
		setOpen(false);
		triggerRef.current?.focus();
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-pop-target": popTarget,
		"data-expanded": open ? "true" : "false",
		onKeyDown,
		className: cn("group pop-card flex h-full flex-col rounded-xl border border-border bg-card shadow-card hover:border-gold/40", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
			className: "m-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				ref: triggerRef,
				id: triggerId,
				type: "button",
				"aria-expanded": open,
				"aria-controls": panelId,
				"aria-label": kind ? `${title}, ${kind}` : void 0,
				onClick: () => setOpen((value) => !value),
				className: "focus-ring flex w-full touch-manipulation flex-col items-start gap-3 rounded-xl p-6 text-left",
				children: [
					media,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex w-full items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-semibold text-foreground transition-colors group-hover:text-gold",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
							"aria-hidden": "true",
							className: cn("pop-chevron mt-1 h-4 w-4 shrink-0 text-muted-foreground", open && "rotate-180 text-primary")
						})]
					}),
					summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: summary
					}) : null
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: panelId,
			role: "region",
			"aria-labelledby": triggerId,
			className: "pop-panel",
			"data-open": open ? "true" : "false",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pop-panel-inner",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("border-t border-border px-6 pb-6 pt-4", panelClassName),
					children
				})
			})
		})]
	});
}
/**
* Inline variant for pop-out content inside an existing card (e.g. the
* closing CTA). Same ARIA contract: aria-expanded + aria-controls on the
* trigger, labelled region, Escape closes and restores focus.
*/
function InlinePopDisclosure({ label, popTarget, className, children }) {
	const uid = (0, import_react.useId)().replace(/[:]/g, "");
	const triggerId = `pop-inline-trigger-${uid}`;
	const panelId = `pop-inline-panel-${uid}`;
	const [open, setOpen] = (0, import_react.useState)(false);
	const triggerRef = (0, import_react.useRef)(null);
	const onKeyDown = (0, import_react.useCallback)((event) => {
		if (event.key !== "Escape" || !open) return;
		event.stopPropagation();
		setOpen(false);
		triggerRef.current?.focus();
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-pop-target": popTarget,
		"data-expanded": open ? "true" : "false",
		onKeyDown,
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			ref: triggerRef,
			id: triggerId,
			type: "button",
			"aria-expanded": open,
			"aria-controls": panelId,
			onClick: () => setOpen((value) => !value),
			className: "focus-ring inline-flex touch-manipulation items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-gold",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				"aria-hidden": "true",
				className: cn("pop-chevron h-4 w-4", open && "rotate-180 text-primary")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: panelId,
			role: "region",
			"aria-labelledby": triggerId,
			className: "pop-panel",
			"data-open": open ? "true" : "false",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pop-panel-inner",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4",
					children
				})
			})
		})]
	});
}
var buildIcons = {
	AppWindow,
	BrainCircuit,
	Workflow,
	Cpu,
	ScanEye,
	LineChart: ChartLine
};
function Home() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const openProject = (project) => {
		setSelected(project);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-hero-veil grain",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-grid",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { duration: 1.2 },
					className: "pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-primary-glow/[0.07] blur-[120px]",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-10 lg:py-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 10
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
								className: "mb-7 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-foreground",
									children: "Currently Building"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-display text-[2.6rem] leading-[1.02] text-balance text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Andrew Mathews — Student Developer, AI Builder & Robotics Engineer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealWords, {
											text: "I build systems that solve",
											delay: .15
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "relative inline-block text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevealWords, {
												text: "real problems.",
												delay: .42
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingCursor, {})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
								initial: {
									opacity: 0,
									y: 12
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .6,
									delay: .7,
									ease: [
										.22,
										1,
										.36,
										1
									]
								},
								className: "mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg",
								children: "I'm Andrew, a student developer and AI builder from Dubai. I build software, experiment with AI, compete in STEM and engineering challenges, and turn ideas into working products."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 12
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: .6,
									delay: .82,
									ease: [
										.22,
										1,
										.36,
										1
									]
								},
								className: "mt-9 flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "font-mono shadow-glow",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/projects",
											children: ["Explore My Work", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
										})
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										className: "font-mono",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/about",
											children: "About Me"
										})
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Magnetic, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "font-mono shadow-glow",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/resume",
											"aria-label": "Download Andrew Mathews' résumé",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Download Résumé"]
										})
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: {
									duration: .6,
									delay: .95
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialIcons, { className: "mt-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-9 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground",
									children: "AI · Software · Robotics · Systems · Product"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							scale: .96
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: 1,
							delay: .3,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						className: "relative -mx-2 h-[320px] sm:h-[380px] lg:h-[520px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tilt3D, {
							className: "h-full w-full",
							intensity: 7,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": "true",
									className: "pointer-events-none absolute inset-6 rounded-3xl border border-border/50 bg-card/20 backdrop-blur-[1px]",
									style: { transform: "translateZ(-60px)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": "true",
									className: "pointer-events-none absolute inset-12 rounded-3xl border border-primary/15",
									style: { transform: "translateZ(-28px)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { transform: "translateZ(40px)" },
									className: "h-full w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemGraph, { className: "h-full w-full" })
								})
							]
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold border-b border-b-border bg-card/30",
			"aria-label": "Quick statistics",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container grid grid-cols-2 gap-8 py-12 md:grid-cols-4",
				children: quickStats.map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: i * 70,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-display text-3xl text-foreground md:text-4xl",
						children: stat.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
						children: stat.label
					})]
				}, stat.label))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			id: "work",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Featured",
					title: "Things I've Built",
					subtitle: "Different problems. Different systems. One constant: build it."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid list-none gap-6 p-0 lg:grid-cols-2",
					children: featuredProjects.map((project, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 70,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
							project,
							onOpen: openProject,
							variant: "featured",
							className: "pop-card h-full"
						})
					}, project.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			id: "ecosystem",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "Ecosystem",
						title: "Everything I Build Has a Purpose.",
						subtitle: "Systems, tools, experiments, and concepts built to solve specific problems."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectGrid, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "mt-10 font-mono text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "//"
						}), " More systems in development."]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Focus areas",
					title: "My Building Categories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: buildingCategories.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 60,
							className: "h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "spotlight lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card hover:border-gold/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold text-foreground",
									children: cat.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: cat.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: item }, item))
								})]
							})
						}, cat.title))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 120,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tilt3D, {
							className: "h-full",
							intensity: 5,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechConstellation, { className: "h-full min-h-[340px]" })
						})
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			id: "what-i-build",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Focus areas",
					title: "What I Build",
					subtitle: "I build software, AI systems, experiments, and technical projects to explore ideas and solve real problems."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3",
					children: buildAreas.map((area, i) => {
						const Icon = buildIcons[area.icon] ?? AppWindow;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							as: "li",
							delay: i * 60,
							className: "h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopDisclosure, {
								title: area.title,
								kind: "focus area, show details",
								popTarget: "build-area",
								summary: area.description,
								media: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-colors group-hover:border-gold/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "h-5 w-5",
										"aria-hidden": "true"
									})
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "space-y-2",
									children: area.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
											children: d.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-sm font-medium text-foreground sm:text-right",
											children: d.value
										})]
									}, d.label))
								}), (area.projects ?? []).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-5 grid list-none gap-3 border-t border-border/70 p-0 pt-4",
									children: (area.projects ?? []).map((slug) => {
										const p = getProject(slug);
										if (!p) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: `/projects/${p.slug}`,
											className: "focus-ring block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:border-gold/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex flex-wrap items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-semibold text-foreground",
														children: p.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold",
														children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
															className: "h-3 w-3",
															"aria-hidden": "true"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1.5 block text-sm leading-relaxed text-muted-foreground",
													children: p.description
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-2.5 flex flex-wrap gap-1.5",
													children: p.tech.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: t }, t))
												})
											]
										}) }, slug);
									})
								})]
							})
						}, area.id);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Approach",
					title: "How I Think"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid list-none gap-5 p-0 md:grid-cols-3",
					children: principles.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						as: "li",
						delay: i * 70,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopDisclosure, {
							title: p.title,
							kind: "principle, show details",
							popTarget: "principle",
							media: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-gold",
								children: ["0", i + 1]
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: p.body
							})
						})
					}, p.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			"aria-labelledby": "dubai-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 lg:grid-cols-2 lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.18em] text-gold",
							children: "Location"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "dubai-heading",
							className: "text-display mt-3 text-2xl text-foreground md:text-3xl",
							children: "Based in Dubai, UAE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base",
							children: "I build from Dubai. The robotics work started here through a school programme, and the software, AI and racing projects since have all been built alongside UAE technology and STEM competitions — FLL, Techfest and MUN among them. Most of what is on this site was designed, built and tested in Dubai."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid list-none gap-3 p-0 sm:grid-cols-2",
							children: [
								{
									k: "Base",
									v: "Dubai, United Arab Emirates"
								},
								{
									k: "Competitions",
									v: "UAE STEM & technology events"
								},
								{
									k: "Focus",
									v: "AI, software and robotics"
								},
								{
									k: "Working with",
									v: "Remote and local collaborators"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "lift-3d rounded-xl border border-border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
									children: item.k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block text-sm text-foreground",
									children: item.v
								})]
							}, item.k))
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 lg:grid-cols-2 lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "Robotics",
						title: "Where It Started",
						subtitle: "It didn't begin with AI. It began with physically building things — the Mbot@IHS robotics programme at age 9.",
						className: "mb-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								"Robotics",
								"Software",
								"AI",
								"Systems"
							].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "lift-3d flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-gold",
									children: ["0", i + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-medium text-foreground",
									children: step
								})]
							}, step))
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Engineering",
					title: "STEM Racing",
					subtitle: "Engineering beyond the screen."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "lg:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full rounded-xl border border-border bg-card p-8 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted-foreground leading-relaxed",
								children: "I take part in F1 in Schools / STEM Racing, where the work runs through engineering, design, teamwork, racing, and competition. It's a different kind of building: constraints are physical, deadlines are real, and the whole team has to move together."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-wrap gap-2",
								children: [
									"Engineering",
									"Design",
									"Teamwork",
									"Racing",
									"Competition"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: t }, t))
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col justify-between rounded-xl border border-primary/30 bg-card p-8 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-[0.16em] text-primary",
									children: "Connected team"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-2xl font-semibold text-foreground",
									children: "Horizon Motorsports"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground leading-relaxed",
									children: "A UAE-based racing team competing in FLL, Techfest, and engineering competitions."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-6 font-mono",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://horizonmotorsports.base44.app/",
									target: "_blank",
									rel: "noopener noreferrer",
									children: "Visit the team site"
								})
							})]
						})
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Live",
					title: "Currently Building"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: currentlyBuilding.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] uppercase tracking-[0.14em] text-primary",
										children: item.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 text-lg font-semibold text-foreground",
									children: item.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: item.note
								})
							]
						})
					}, item.name))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindMeOnline, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-24",
			"aria-labelledby": "get-in-touch-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-pop-target": "get-in-touch",
					className: "pop-card rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "get-in-touch-heading",
							className: "text-3xl md:text-4xl font-semibold text-foreground",
							children: "Always building something."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-muted-foreground",
							children: "Want to talk about technology, a project, collaboration, or something I'm building?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "cta-pop mt-7 font-mono",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
								to: "/contact",
								"aria-label": "Get in touch with Andrew Mathews",
								children: ["Get in touch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "cta-arrow ml-2 h-4 w-4" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlinePopDisclosure, {
							label: "What to reach out about",
							popTarget: "get-in-touch-details",
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid list-none gap-2 p-0 text-sm text-muted-foreground sm:grid-cols-2",
								children: [
									"Technology, AI and systems discussions",
									"Project ideas and collaborations",
									"Robotics and STEM Racing",
									"Feedback on something I've built"
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" }), item]
								}, item))
							})
						})
					]
				}) })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "divider-gold py-20 md:py-28",
			id: "contact",
			"aria-labelledby": "home-contact-heading",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container max-w-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "Contact",
						title: "Reach Out Directly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "Send me a message and I'll get back to you. No middlemen, just a direct line."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, { sourcePath: "/" })
					})
				] })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectModal, {
			project: selected,
			open,
			onOpenChange: setOpen
		})
	] });
}
var SplitComponent = Home;
//#endregion
export { SplitComponent as component };
