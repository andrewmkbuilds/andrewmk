import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, G as CircleCheck, _ as RotateCcw, k as History, p as Search, z as Download } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as setContactMessageHandled, i as listContactMessages, n as getAdminStatus, r as listAdminAuditLog, t as exportContactMessagesCsv } from "./admin-contact.functions-gXdf0cSN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as MfaPanel } from "./MfaPanel-BsF5oIAP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.messages-DEVKzlPM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		value: "all",
		label: "All"
	},
	{
		value: "open",
		label: "Open"
	},
	{
		value: "handled",
		label: "Handled"
	}
];
function AdminMessages() {
	const fetchStatus = useServerFn(getAdminStatus);
	const fetchMessages = useServerFn(listContactMessages);
	const markHandled = useServerFn(setContactMessageHandled);
	const exportCsv = useServerFn(exportContactMessagesCsv);
	const fetchAudit = useServerFn(listAdminAuditLog);
	const queryClient = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [submittedSearch, setSubmittedSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("open");
	const admin = useQuery({
		queryKey: ["admin-status"],
		queryFn: () => fetchStatus()
	});
	const messages = useQuery({
		queryKey: [
			"contact-messages",
			submittedSearch,
			status
		],
		enabled: admin.data?.isAdmin === true,
		queryFn: () => fetchMessages({ data: {
			search: submittedSearch,
			status,
			limit: 100
		} })
	});
	const mutation = useMutation({
		mutationFn: (vars) => markHandled({ data: vars }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
			queryClient.invalidateQueries({ queryKey: ["admin-audit-log"] });
		}
	});
	const audit = useQuery({
		queryKey: ["admin-audit-log"],
		enabled: admin.data?.isAdmin === true,
		queryFn: () => fetchAudit({ data: { limit: 50 } })
	});
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [exportError, setExportError] = (0, import_react.useState)(null);
	async function downloadCsv() {
		setExporting(true);
		setExportError(null);
		try {
			const result = await exportCsv({ data: {
				search: submittedSearch,
				status,
				limit: 200
			} });
			const blob = new Blob([`\uFEFF${result.csv}`], { type: "text/csv;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = result.filename;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
			queryClient.invalidateQueries({ queryKey: ["admin-audit-log"] });
		} catch {
			setExportError("Could not export right now. Try again.");
		} finally {
			setExporting(false);
		}
	}
	const rows = (0, import_react.useMemo)(() => messages.data ?? [], [messages.data]);
	if (admin.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-5xl px-6 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Checking access…"
		})
	});
	if (!admin.data?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-6 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold text-foreground",
			children: "Admin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted-foreground",
			children: "This account does not have admin access to contact submissions."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-6 py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold text-foreground",
				children: "Contact submissions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Search, review and mark messages as handled."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 flex flex-col gap-4 sm:flex-row sm:items-end",
				onSubmit: (e) => {
					e.preventDefault();
					setSubmittedSearch(search.trim());
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "admin-search",
						children: "Search name, email or message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "admin-search",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "e.g. website project"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "font-mono",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), "Search"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				role: "group",
				"aria-label": "Filter by status",
				children: [FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: status === f.value ? "default" : "outline",
					size: "sm",
					"aria-pressed": status === f.value,
					onClick: () => setStatus(f.value),
					className: "font-mono",
					children: f.label
				}, f.value)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "ml-auto font-mono focus-ring",
					onClick: downloadCsv,
					disabled: exporting,
					children: [exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), "Export CSV"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"aria-live": "polite",
				className: "mt-2 text-xs text-muted-foreground",
				children: exportError ?? "CSV exports respect the current search and status filter."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				"aria-live": "polite",
				className: "mt-8 space-y-4",
				children: messages.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading messages…"
				}) : messages.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground",
					children: "Could not load messages. Try again."
				}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No messages match this view."
				}) : rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-2xl border border-border bg-card p-5 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-lg font-semibold text-foreground",
								children: [
									row.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sans text-sm font-normal text-muted-foreground",
										children: row.email
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground",
								children: new Date(row.created_at).toLocaleString()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 whitespace-pre-wrap text-sm text-muted-foreground",
							children: row.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground",
									children: row.delivery_status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground",
									children: ["spam ", row.spam_score]
								}),
								row.handled_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono text-xs text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										className: "h-3 w-3 text-primary",
										"aria-hidden": "true"
									}), "Handled"]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: row.handled_at ? "outline" : "default",
									className: "ml-auto font-mono",
									disabled: mutation.isPending,
									onClick: () => mutation.mutate({
										id: row.id,
										handled: !row.handled_at
									}),
									children: [mutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
										className: "h-4 w-4 animate-spin",
										"aria-hidden": "true"
									}) : row.handled_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), row.handled_at ? "Reopen" : "Mark handled"]
								})
							]
						})
					]
				}, row.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "audit-heading",
				className: "mt-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
							className: "h-5 w-5 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "audit-heading",
							className: "font-display text-lg font-semibold text-foreground",
							children: "Admin activity log"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Every admin change is recorded with a timestamp and the admin identity."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: audit.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "Loading activity…"
						}) : (audit.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No admin activity recorded yet."
						}) : (audit.data ?? []).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-primary",
									children: entry.action
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: entry.actor_email ?? "unknown admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: entry.entity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									dateTime: entry.created_at,
									className: "ml-auto font-mono text-xs text-muted-foreground",
									children: new Date(entry.created_at).toLocaleString()
								})
							]
						}, entry.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MfaPanel, {})
		]
	});
}
var SplitComponent = AdminMessages;
//#endregion
export { SplitComponent as component };
