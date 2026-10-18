import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, d as ShieldAlert, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as supabase } from "./client-ewjTjLv0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MfaPanel-DjKwD3pk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Optional two-factor (TOTP) enrollment for admins.
* Sign-in enforces the second step automatically once a factor is verified.
*/
function MfaPanel() {
	const [factors, setFactors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [enroll, setEnroll] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const refresh = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const { data, error: listError } = await supabase.auth.mfa.listFactors();
		setLoading(false);
		if (listError) {
			setError(listError.message);
			return;
		}
		setFactors(data?.totp ?? []);
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const verified = factors.filter((f) => f.status === "verified");
	async function startEnroll() {
		setBusy(true);
		setError(null);
		setMessage(null);
		const { data, error: enrollError } = await supabase.auth.mfa.enroll({
			factorType: "totp",
			friendlyName: `Authenticator ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`
		});
		setBusy(false);
		if (enrollError || !data) {
			setError(enrollError?.message ?? "Could not start enrollment.");
			return;
		}
		setEnroll({
			id: data.id,
			qr: data.totp.qr_code,
			secret: data.totp.secret
		});
	}
	async function confirmEnroll(event) {
		event.preventDefault();
		if (!enroll) return;
		setBusy(true);
		setError(null);
		const challenge = await supabase.auth.mfa.challenge({ factorId: enroll.id });
		if (challenge.error || !challenge.data) {
			setBusy(false);
			setError(challenge.error?.message ?? "Could not start the challenge.");
			return;
		}
		const { error: verifyError } = await supabase.auth.mfa.verify({
			factorId: enroll.id,
			challengeId: challenge.data.id,
			code: code.trim()
		});
		setBusy(false);
		if (verifyError) {
			setError(verifyError.message);
			return;
		}
		setEnroll(null);
		setCode("");
		setMessage("Two-factor authentication is now active on this account.");
		refresh();
	}
	async function disable(factorId) {
		setBusy(true);
		setError(null);
		const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
		setBusy(false);
		if (unenrollError) {
			setError(unenrollError.message);
			return;
		}
		setMessage("Two-factor authentication removed.");
		refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "mfa-heading",
		className: "mt-12 rounded-2xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [verified.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					className: "h-5 w-5 text-primary",
					"aria-hidden": "true"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					className: "h-5 w-5 text-muted-foreground",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "mfa-heading",
					className: "font-display text-lg font-semibold text-foreground",
					children: "Two-factor authentication"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Optional. When enabled, admin sign-in asks for a 6-digit code from your authenticator app."
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Checking status…"
			}) : verified.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono text-xs text-foreground",
					children: "Enabled"
				}), verified.map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: "outline",
					className: "font-mono focus-ring",
					disabled: busy,
					onClick: () => disable(factor.id),
					children: "Turn off"
				}, factor.id))]
			}) : enroll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: confirmEnroll,
				className: "mt-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: enroll.qr,
						alt: "QR code to add this account to your authenticator app",
						className: "h-44 w-44 rounded-xl bg-white p-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs break-all text-muted-foreground",
						children: ["Manual key: ", enroll.secret]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mfa-code",
							children: "6-digit code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mfa-code",
							inputMode: "numeric",
							autoComplete: "one-time-code",
							pattern: "[0-9]{6}",
							maxLength: 6,
							required: true,
							value: code,
							onChange: (e) => setCode(e.target.value),
							className: "max-w-40 font-mono"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: busy,
							className: "font-mono focus-ring",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "h-4 w-4 animate-spin",
								"aria-hidden": "true"
							}) : null, "Verify and enable"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							className: "font-mono focus-ring",
							onClick: () => setEnroll(null),
							children: "Cancel"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				className: "mt-4 font-mono focus-ring",
				disabled: busy,
				onClick: startEnroll,
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-4 w-4 animate-spin",
					"aria-hidden": "true"
				}) : null, "Enable two-factor"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-live": "polite",
				className: "mt-4 space-y-2 text-sm",
				children: [message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground",
					children: message
				}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground",
					children: error
				}) : null]
			})
		]
	});
}
//#endregion
export { MfaPanel as t };
