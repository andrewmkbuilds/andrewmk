import { n as __toESM } from "../_runtime.mjs";
import { n as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
import { C as Maximize2, I as FileText, R as ExternalLink, _ as RotateCcw, n as ZoomIn, r as X, t as ZoomOut, z as Download } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { C as munResults, d as achievementGroups, g as competitionResults, i as Layout, y as exhibitions } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as SectionHeading } from "./SectionHeading-DieYsKLk.mjs";
import { t as TechTag } from "./TechTag-Bo1VUFKz.mjs";
import { t as FilterBar } from "./FilterBar-BrGUlU8R.mjs";
import { a as certificates, i as certificateIssuerParts, n as certificateDateLabel, o as certificatesByRecency, r as certificateDownloadName, t as certificateCategories } from "./certificates-CO64SbXT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/achievements-D7fmWf2w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AchievementCard({ place, detail, event, index, className, onViewProof }) {
	const reduce = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
		initial: reduce ? false : {
			opacity: 0,
			y: 18
		},
		whileInView: reduce ? {} : {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "0px 0px -8% 0px"
		},
		transition: {
			duration: .55,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		whileHover: reduce ? {} : { y: -4 },
		className: cn("surface spotlight edge-glow lift-3d group relative isolate overflow-hidden rounded-xl p-5", "gold-hover transition-colors duration-300 hover:border-gold/40", className),
		onPointerMove: (e) => {
			const el = e.currentTarget;
			const rect = el.getBoundingClientRect();
			el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
			el.style.setProperty("--my", `${e.clientY - rect.top}px`);
		},
		children: [
			typeof index === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute right-4 top-3 font-mono text-4xl font-semibold text-foreground/[0.045] transition-colors duration-300 group-hover:text-gold/15",
				children: String(index + 1).padStart(2, "0")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative font-mono text-sm text-gold",
				children: place
			}),
			detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "relative mt-2 text-lg font-semibold leading-snug text-foreground",
				children: detail
			}),
			event && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-1 text-sm text-muted-foreground",
				children: event
			}),
			onViewProof && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onViewProof,
				className: "focus-ring relative mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-gold/50 hover:text-gold",
				children: ["View Certificate ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "→"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
			})
		]
	});
}
function CertificateCard({ certificate, onOpen, className, compact = false }) {
	const reduce = useReducedMotion();
	const { org, program } = certificateIssuerParts(certificate);
	const dateLabel = certificateDateLabel(certificate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
		whileHover: reduce ? {} : { y: -4 },
		transition: {
			duration: .3,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: cn("surface spotlight edge-glow lift-3d group relative isolate flex h-full flex-col overflow-hidden rounded-xl", "gold-hover transition-colors duration-300 hover:border-gold/40", className),
		onPointerMove: (e) => {
			const el = e.currentTarget;
			const rect = el.getBoundingClientRect();
			el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
			el.style.setProperty("--my", `${e.clientY - rect.top}px`);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen(certificate),
				"aria-label": `Open ${certificate.title} in the full-size viewer`,
				className: "focus-ring relative block w-full overflow-hidden border-b border-border bg-linear-to-b from-muted/30 to-background",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block", compact ? "aspect-3/2" : "aspect-4/3"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: certificate.thumb,
							alt: `Preview of ${certificate.title}`,
							loading: "lazy",
							decoding: "async",
							className: "h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md border border-gold/30 bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold backdrop-blur-sm",
						children: [certificate.type === "pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }) : null, certificate.type === "pdf" ? "PDF" : "Original"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md border border-gold/30 bg-background/80 px-2 py-1 font-mono text-[10px] text-gold opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3" }), " Zoom"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative flex flex-1 flex-col", compact ? "p-4" : "p-5"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
							children: certificate.category
						}), dateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 font-mono text-[11px] text-muted-foreground",
							children: dateLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: cn("mt-2 font-semibold leading-snug text-foreground", compact ? "text-sm" : "text-base"),
						children: certificate.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-snug text-foreground/75",
						children: org
					}),
					program && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs leading-snug text-muted-foreground",
						children: program
					}),
					certificate.date && certificate.date !== dateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-[11px] text-muted-foreground/80",
						children: certificate.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpen(certificate),
							className: "focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:border-gold/50 hover:text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" }), "View"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: certificate.file,
							download: certificateDownloadName(certificate),
							"aria-label": `Download ${certificate.title}`,
							className: "focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/5 text-gold transition-colors hover:border-gold/60 hover:bg-gold/15",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
			})
		]
	});
}
var MIN_ZOOM = 1;
var MAX_ZOOM = 6;
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
/**
* Full-size, gold-accented certificate viewer.
* Images: cursor-anchored wheel/pinch zoom, drag to pan, keyboard +/-/0.
* PDFs: rendered as a real document in an embedded viewer, never as a flat image.
*/
function CertificateViewer({ certificate, onClose }) {
	const reduce = useReducedMotion();
	const stageRef = (0, import_react.useRef)(null);
	const dialogRef = (0, import_react.useRef)(null);
	const zoomRef = (0, import_react.useRef)(1);
	const offsetRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const dragRef = (0, import_react.useRef)(null);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [offset, setOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	zoomRef.current = zoom;
	offsetRef.current = offset;
	const reset = (0, import_react.useCallback)(() => {
		setZoom(1);
		setOffset({
			x: 0,
			y: 0
		});
	}, []);
	/** Zoom about a point in stage coordinates so that point stays put. */
	const zoomAt = (0, import_react.useCallback)((next, px, py) => {
		const current = zoomRef.current;
		const target = clamp(next, MIN_ZOOM, MAX_ZOOM);
		if (target === current) return;
		const k = target / current;
		const o = offsetRef.current;
		const nextOffset = target === MIN_ZOOM ? {
			x: 0,
			y: 0
		} : {
			x: px - (px - o.x) * k,
			y: py - (py - o.y) * k
		};
		setZoom(target);
		setOffset(nextOffset);
	}, []);
	const zoomFromCenter = (0, import_react.useCallback)((factor) => {
		const rect = stageRef.current?.getBoundingClientRect();
		zoomAt(zoomRef.current * factor, (rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2);
	}, [zoomAt]);
	(0, import_react.useEffect)(() => {
		reset();
	}, [certificate?.id, reset]);
	(0, import_react.useEffect)(() => {
		if (!certificate) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "+" || e.key === "=") zoomFromCenter(1.4);
			if (e.key === "-" || e.key === "_") zoomFromCenter(1 / 1.4);
			if (e.key === "0") reset();
		};
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [
		certificate,
		onClose,
		zoomFromCenter,
		reset
	]);
	(0, import_react.useEffect)(() => {
		const el = stageRef.current;
		if (!el || !certificate || certificate.type !== "image") return;
		const onWheel = (e) => {
			e.preventDefault();
			const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
			const rect = el.getBoundingClientRect();
			zoomAt(zoomRef.current * Math.exp(-dy * .0018), e.clientX - rect.left, e.clientY - rect.top);
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, [certificate, zoomAt]);
	if (!certificate) return null;
	const { org, program } = certificateIssuerParts(certificate);
	const dateLabel = certificateDateLabel(certificate);
	const isPdf = certificate.type === "pdf";
	const toolButton = "focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/25 bg-gold/5 p-2 text-gold/90 transition-colors hover:border-gold/60 hover:bg-gold/15 hover:text-gold disabled:opacity-35";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: dialogRef,
		role: "dialog",
		"aria-modal": "true",
		tabIndex: -1,
		"aria-label": `${certificate.title} — certificate`,
		className: "focus:outline-none fixed inset-0 z-100 flex flex-col bg-background/96 backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close certificate viewer",
				onClick: onClose,
				className: "absolute inset-0 h-full w-full cursor-default",
				tabIndex: -1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-start gap-3 border-b border-gold/20 bg-card/60 px-4 py-3 md:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "absolute inset-x-0 bottom-0 h-px divider-gold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold",
								children: [
									isPdf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3" }),
									certificate.category,
									dateLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["· ", dateLabel]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 truncate text-sm font-semibold text-foreground md:text-base",
								children: certificate.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [org, program].filter(Boolean).join(" · ")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-1.5",
						children: [
							!isPdf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Zoom out",
									disabled: zoom <= MIN_ZOOM,
									onClick: () => zoomFromCenter(1 / 1.4),
									className: toolButton,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"aria-live": "polite",
									className: "hidden w-12 text-center font-mono text-xs text-gold/80 sm:block",
									children: [Math.round(zoom * 100), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Zoom in",
									disabled: zoom >= MAX_ZOOM,
									onClick: () => zoomFromCenter(1.4),
									className: toolButton,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Reset zoom",
									disabled: zoom === 1 && offset.x === 0 && offset.y === 0,
									onClick: reset,
									className: cn(toolButton, "hidden sm:inline-flex"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: certificate.file,
								download: certificateDownloadName(certificate),
								"aria-label": "Download the original certificate",
								className: toolButton,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: certificate.file,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Open the original certificate file in a new tab",
								className: cn(toolButton, "hidden sm:inline-flex"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Close certificate viewer",
								onClick: onClose,
								className: "focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/45 bg-gold/15 p-2 text-gold transition-colors hover:bg-gold/25",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: reduce ? false : {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .35,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "relative z-10 flex-1 overflow-hidden p-3 md:p-6",
				children: isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-gold/25 bg-card",
					style: { boxShadow: "0 0 60px -30px color-mix(in oklab, var(--gold) 60%, transparent)" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: `${certificate.file}#view=FitH`,
						title: `${certificate.title} (PDF document)`,
						className: "h-full min-h-[60vh] w-full flex-1 bg-background"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-t border-gold/20 px-4 py-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["PDF document · ", certificate.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: certificate.file,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "focus-ring rounded-md border border-gold/30 px-3 py-1.5 text-gold transition-colors hover:bg-gold/10",
								children: "Open in new tab"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: certificate.file,
								download: certificateDownloadName(certificate),
								className: "focus-ring rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:bg-primary/20",
								children: "Download PDF"
							})]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: stageRef,
					className: cn("relative h-full w-full touch-none overflow-hidden rounded-xl", zoom > 1 ? dragRef.current ? "cursor-grabbing" : "cursor-grab" : "cursor-zoom-in"),
					onPointerDown: (e) => {
						if (zoomRef.current <= 1) return;
						dragRef.current = {
							x: e.clientX,
							y: e.clientY,
							ox: offsetRef.current.x,
							oy: offsetRef.current.y
						};
						e.currentTarget.setPointerCapture(e.pointerId);
					},
					onPointerMove: (e) => {
						const d = dragRef.current;
						if (!d) return;
						setOffset({
							x: d.ox + (e.clientX - d.x),
							y: d.oy + (e.clientY - d.y)
						});
					},
					onPointerUp: () => {
						dragRef.current = null;
					},
					onDoubleClick: (e) => {
						const rect = e.currentTarget.getBoundingClientRect();
						if (zoomRef.current > 1) reset();
						else zoomAt(2.5, e.clientX - rect.left, e.clientY - rect.top);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full w-full items-center justify-center",
						style: {
							transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
							transformOrigin: "0 0",
							width: "100%",
							height: "100%"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: certificate.file,
							alt: `${certificate.title}${certificate.issuer ? ` — ${certificate.issuer}` : ""}`,
							draggable: false,
							className: "max-h-full max-w-full select-none rounded-lg border border-gold/25 bg-card object-contain",
							style: { boxShadow: "0 0 80px -40px color-mix(in oklab, var(--gold) 70%, transparent)" }
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative z-10 hidden border-t border-border px-6 py-2 text-center font-mono text-[11px] text-muted-foreground md:block",
				children: isPdf ? "Esc to close · Download for the original document" : "Scroll or pinch to zoom · Drag to pan · Double-click to toggle · Esc to close"
			})
		]
	});
}
function CertificateGallery() {
	const [category, setCategory] = (0, import_react.useState)("All");
	const [active, setActive] = (0, import_react.useState)(null);
	const options = (0, import_react.useMemo)(() => ["All", ...certificateCategories], []);
	const visible = (0, import_react.useMemo)(() => category === "All" ? certificatesByRecency : certificatesByRecency.filter((c) => c.category === category), [category]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "certificates",
		"aria-labelledby": "certificates-title",
		className: "border-t border-border py-20 md:py-28",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Proof",
					title: "Certificates & Proof",
					subtitle: "Verified credentials, competition results and milestones from my journey as a builder — every file below is the original certificate."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "certificates-title",
					className: "sr-only",
					children: "Certificates and Proof"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {
					label: "Filter certificates by category",
					legend: "Category",
					options,
					value: category,
					onChange: setCategory,
					className: "mb-8"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					"aria-live": "polite",
					className: "sr-only",
					children: [visible.length, " certificates shown"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4",
						style: { scrollbarWidth: "none" },
						children: visible.map((certificate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "w-[72vw] shrink-0 snap-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateCard, {
								certificate,
								onOpen: setActive,
								compact: true,
								className: "h-full"
							})
						}, certificate.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-center font-mono text-[11px] text-muted-foreground",
						children: [
							"Swipe for more · ",
							visible.length,
							" certificates"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden gap-5 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3",
					children: visible.map((certificate, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: Math.min(i, 6) * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateCard, {
							certificate,
							onOpen: setActive,
							className: "h-full"
						})
					}, certificate.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateViewer, {
			certificate: active,
			onClose: () => setActive(null)
		})]
	});
}
var exhibitionLoop = [
	"Build",
	"Demonstrate",
	"Explain",
	"Iterate"
];
var certById = (id) => id ? certificates.find((c) => c.id === id) : void 0;
function Achievements() {
	const [proof, setProof] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4",
							children: "Achievements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance",
							children: "Competitions, Recognition, and Results"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground leading-relaxed",
							children: "STEM, engineering, robotics, and MUN — the places where the work gets tested against other people's work."
						})
					]
				}), achievementGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "mt-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold text-foreground",
						children: group.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechTag, { children: item }, item))
					})]
				}, group.title))]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Results",
					title: "Competitions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: competitionResults.map((result, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementCard, {
							...result,
							className: "h-full",
							onViewProof: certById(result.certKey) ? () => setProof(certById(result.certKey)) : void 0
						})
					}, `${result.place}-${result.detail}`))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "Diplomacy",
					title: "MUN"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 md:grid-cols-3",
					children: munResults.map((mun, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: i * 60,
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-semibold text-foreground",
									children: mun.title
								}),
								mun.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-mono text-sm text-primary",
									children: mun.detail
								}),
								certById(mun.certKey) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setProof(certById(mun.certKey)),
									className: "focus-ring mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-gold/50 hover:text-gold",
									children: ["View Certificate ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "→"
									})]
								})
							]
						})
					}, mun.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-card/40 py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "Exhibitions",
						title: "Where Ideas Become Real",
						subtitle: "Exhibitions are where projects move beyond the screen — set up on a table, demonstrated live, and explained to real people who ask hard questions."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "flex flex-wrap items-center gap-3",
						children: exhibitionLoop.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-lg border border-primary/30 bg-background px-5 py-3 font-mono text-sm text-foreground",
								children: step
							}), i < exhibitionLoop.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "→"
							})]
						}, step))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: exhibitions.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 50,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-background p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-sm text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-2 text-primary",
										children: "/"
									}), item]
								})
							})
						}, item))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateGallery, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateViewer, {
			certificate: proof,
			onClose: () => setProof(null)
		})
	] });
}
var SplitComponent = Achievements;
//#endregion
export { SplitComponent as component };
