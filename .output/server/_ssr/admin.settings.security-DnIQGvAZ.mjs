import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as getAdminStatus, r as listAdminAuditLog } from "./admin-contact.functions-gXdf0cSN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as supabase } from "./client-Bxc8_G9k.mjs";
import { t as MfaPanel } from "./MfaPanel-BsF5oIAP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings.security-DnIQGvAZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	"At least 12 characters",
	"Mix of upper and lower case letters",
	"At least one number",
	"At least one symbol"
];
function meetsPolicy(pw) {
	return pw.length >= 12 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
}
/**
* Password change for the signed-in admin.
* Verifies the current password by re-authenticating before updating, and
* invalidates other sessions by signing out everywhere after a successful change.
*/
function PasswordChangeForm() {
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const mismatch = confirm.length > 0 && next !== confirm;
	const weak = next.length > 0 && !meetsPolicy(next);
	const disabled = busy || !current || !next || !confirm || mismatch || weak;
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError(null);
		setMessage(null);
		if (next !== confirm) {
			setBusy(false);
			setError("The new password and confirmation do not match.");
			return;
		}
		if (!meetsPolicy(next)) {
			setBusy(false);
			setError("The new password does not meet the strength requirements.");
			return;
		}
		const { data: user } = await supabase.auth.getUser();
		const email = user.user?.email;
		if (!email) {
			setBusy(false);
			setError("Could not confirm your account. Please sign in again.");
			return;
		}
		const { error: reauthError } = await supabase.auth.signInWithPassword({
			email,
			password: current
		});
		if (reauthError) {
			setBusy(false);
			setError("Your current password is incorrect.");
			return;
		}
		const { error: updateError } = await supabase.auth.updateUser({ password: next });
		setBusy(false);
		if (updateError) {
			setError(updateError.message);
			return;
		}
		setMessage("Password updated. Other sessions have been signed out.");
		setCurrent("");
		setNext("");
		setConfirm("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "pw-current",
					children: "Current password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "pw-current",
					type: "password",
					autoComplete: "current-password",
					required: true,
					value: current,
					onChange: (e) => setCurrent(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pw-new",
						children: "New password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pw-new",
						type: "password",
						autoComplete: "new-password",
						required: true,
						value: next,
						onChange: (e) => setNext(e.target.value)
					}),
					weak ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-foreground",
						children: "Use a stronger password (see the rules below)."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pw-confirm",
						children: "Confirm new password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pw-confirm",
						type: "password",
						autoComplete: "new-password",
						required: true,
						value: confirm,
						onChange: (e) => setConfirm(e.target.value)
					}),
					mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-foreground",
						children: "Passwords do not match."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-none space-y-1 p-0 text-xs text-muted-foreground",
				children: RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "h-1 w-1 rounded-full bg-gold"
					}), rule]
				}, rule))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled,
				className: "font-mono focus-ring",
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-4 w-4 animate-spin",
					"aria-hidden": "true"
				}) : null, busy ? "Updating…" : "Change password"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-live": "polite",
				role: "status",
				className: "text-sm",
				children: [message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground",
					children: message
				}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground",
					children: error
				}) : null]
			})
		]
	});
}
function formatTime(value) {
	try {
		return new Date(value).toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return value;
	}
}
function actionLabel(action) {
	return {
		mark_handled: "Message handled",
		reopen: "Message reopened",
		export_csv: "Exported messages",
		login: "Signed in",
		login_failed: "Failed sign-in",
		password_changed: "Password changed",
		mfa_enabled: "2FA enabled",
		mfa_disabled: "2FA disabled"
	}[action] ?? action;
}
function AdminSecurity() {
	const fetchStatus = useServerFn(getAdminStatus);
	const fetchAudit = useServerFn(listAdminAuditLog);
	const admin = useQuery({
		queryKey: ["admin-status"],
		queryFn: () => fetchStatus()
	});
	const audit = useQuery({
		queryKey: ["admin-audit"],
		queryFn: () => fetchAudit({ data: { limit: 30 } })
	});
	async function signOutEverywhere() {
		await supabase.auth.signOut({ scope: "global" });
		window.location.href = "/auth";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Security",
		description: "Password, two-factor authentication and recent security activity for your account.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Enter your current password to confirm the change. Other active sessions are signed out after a successful update."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordChangeForm, {})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-foreground",
							children: admin.data?.email ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: admin.data?.isAdmin ? "Site owner access" : "Standard account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-5 font-mono",
							onClick: signOutEverywhere,
							children: "Sign out everywhere"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MfaPanel, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Security activity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Recent account and content events. Sensitive values are never shown."
						}),
						audit.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "Loading…"
						}) : audit.data && audit.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 list-none divide-y divide-border p-0",
							children: audit.data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-2 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground",
									children: actionLabel(row.action)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
									children: row.entity
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: row.actor_email ?? "system"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: formatTime(row.created_at)
									})]
								})]
							}, row.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "No security events recorded yet."
						})
					]
				})
			]
		})
	});
}
var SplitComponent = AdminSecurity;
//#endregion
export { SplitComponent as component };
