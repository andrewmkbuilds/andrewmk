import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as supabase } from "./client-ewjTjLv0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BgdC-UFz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Auth() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [mfa, setMfa] = (0, import_react.useState)(null);
	const [mfaCode, setMfaCode] = (0, import_react.useState)("");
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError(null);
		setNotice(null);
		if (mode === "signup") {
			const { error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: { emailRedirectTo: `${window.location.origin}/auth` }
			});
			setBusy(false);
			if (signUpError) {
				setError(signUpError.message);
				return;
			}
			setNotice("Account created. Confirm your email if prompted, then sign in.");
			setMode("signin");
			return;
		}
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (signInError) {
			setBusy(false);
			setError(signInError.message);
			return;
		}
		const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
		if (aal && aal.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
			const { data: factors } = await supabase.auth.mfa.listFactors();
			const factor = (factors?.totp ?? []).find((f) => f.status === "verified");
			setBusy(false);
			if (factor) {
				setMfa({ factorId: factor.id });
				setNotice("Enter the 6-digit code from your authenticator app.");
				return;
			}
		} else setBusy(false);
		navigate({ to: "/admin/messages" });
	}
	async function onVerifyMfa(event) {
		event.preventDefault();
		if (!mfa) return;
		setBusy(true);
		setError(null);
		const challenge = await supabase.auth.mfa.challenge({ factorId: mfa.factorId });
		if (challenge.error || !challenge.data) {
			setBusy(false);
			setError(challenge.error?.message ?? "Could not start the verification challenge.");
			return;
		}
		const { error: verifyError } = await supabase.auth.mfa.verify({
			factorId: mfa.factorId,
			challengeId: challenge.data.id,
			code: mfaCode.trim()
		});
		setBusy(false);
		if (verifyError) {
			setError(verifyError.message);
			return;
		}
		navigate({ to: "/admin/messages" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold text-foreground",
				children: "Sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Private area. Admin access is required to review contact submissions."
			}),
			mfa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onVerifyMfa,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mfa-signin-code",
							children: "Authentication code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mfa-signin-code",
							inputMode: "numeric",
							autoComplete: "one-time-code",
							pattern: "[0-9]{6}",
							maxLength: 6,
							required: true,
							autoFocus: true,
							value: mfaCode,
							onChange: (e) => setMfaCode(e.target.value),
							className: "max-w-40 font-mono"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full font-mono focus-ring",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "h-4 w-4 animate-spin",
							"aria-hidden": "true"
						}) : null, busy ? "Verifying…" : "Verify code"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"aria-live": "polite",
						role: "status",
						className: "text-sm",
						children: [notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground",
							children: notice
						}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground",
							children: error
						}) : null]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "auth-email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "auth-email",
							type: "email",
							autoComplete: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "auth-password",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "auth-password",
							type: "password",
							autoComplete: mode === "signup" ? "new-password" : "current-password",
							required: true,
							value: password,
							onChange: (e) => setPassword(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full font-mono",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "h-4 w-4 animate-spin",
							"aria-hidden": "true"
						}) : null, busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						className: "w-full font-mono",
						onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
						children: mode === "signin" ? "Create the admin account" : "Back to sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"aria-live": "polite",
						role: "status",
						className: "text-sm",
						children: [notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground",
							children: notice
						}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground",
							children: error
						}) : null]
					})
				]
			})
		]
	});
}
var SplitComponent = Auth;
//#endregion
export { SplitComponent as component };
