import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, G as CircleCheck, s as TriangleAlert } from "../_libs/lucide-react.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BEfvBBYI.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { t as Textarea } from "./textarea-BflGnvAP.mjs";
import { n as contactSchema } from "./contact.server-z8_iTars.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ContactForm-DGs96B50.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var submitContactMessage = createServerFn({ method: "POST" }).inputValidator((data) => contactSchema.parse(data)).handler(createSsrRpc("6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b"));
/**
* Reusable contact form. Shares the same server function, validation and
* honeypot as the standalone /contact page so messages are stored and
* delivered identically wherever it appears.
*/
function ContactForm({ sourcePath = "/contact" }) {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		message: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [status, setStatus] = (0, import_react.useState)({ kind: "idle" });
	const mountedAt = (0, import_react.useRef)(Date.now());
	const honeypot = (0, import_react.useRef)(null);
	const send = useServerFn(submitContactMessage);
	const validate = (v) => {
		const e = {};
		if (v.name.trim().length < 2) e.name = "Please enter your name.";
		if (!v.email.trim()) e.email = "Please enter your email.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
		if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
		return e;
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const next = validate(values);
		setErrors(next);
		if (Object.keys(next).length > 0) {
			setStatus({
				kind: "error",
				message: "Please fix the highlighted fields."
			});
			return;
		}
		setStatus({ kind: "sending" });
		try {
			const result = await send({ data: {
				name: values.name.trim(),
				email: values.email.trim(),
				message: values.message.trim(),
				company: honeypot.current?.value ?? "",
				elapsedMs: Date.now() - mountedAt.current,
				sourcePath
			} });
			if (result.ok) {
				setStatus({
					kind: "sent",
					message: result.message
				});
				setValues({
					name: "",
					email: "",
					message: ""
				});
			} else setStatus({
				kind: "error",
				message: result.message
			});
		} catch {
			setStatus({
				kind: "error",
				message: "Couldn't send right now. Please try again or reach me on GitHub."
			});
		}
	};
	const update = (field) => (e) => {
		setValues((prev) => ({
			...prev,
			[field]: e.target.value
		}));
		if (status.kind !== "sending") setStatus({ kind: "idle" });
	};
	const uid = sourcePath.replace(/[^a-z0-9]/gi, "-");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		noValidate: true,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `name-${uid}`,
						className: "font-mono text-xs",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `name-${uid}`,
						name: "name",
						value: values.name,
						onChange: update("name"),
						"aria-invalid": Boolean(errors.name),
						"aria-describedby": errors.name ? `name-${uid}-error` : void 0,
						placeholder: "Your name"
					}),
					errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: `name-${uid}-error`,
						className: "font-mono text-xs text-destructive",
						children: errors.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `email-${uid}`,
						className: "font-mono text-xs",
						children: "Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `email-${uid}`,
						name: "email",
						type: "email",
						value: values.email,
						onChange: update("email"),
						"aria-invalid": Boolean(errors.email),
						"aria-describedby": errors.email ? `email-${uid}-error` : void 0,
						placeholder: "you@example.com"
					}),
					errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: `email-${uid}-error`,
						className: "font-mono text-xs text-destructive",
						children: errors.email
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `message-${uid}`,
						className: "font-mono text-xs",
						children: "Message"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: `message-${uid}`,
						name: "message",
						value: values.message,
						onChange: update("message"),
						"aria-invalid": Boolean(errors.message),
						"aria-describedby": errors.message ? `message-${uid}-error` : void 0,
						placeholder: "What are you building?",
						rows: 5
					}),
					errors.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: `message-${uid}-error`,
						className: "font-mono text-xs text-destructive",
						children: errors.message
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-hidden": "true",
				className: "absolute left-[-9999px] h-0 w-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: `company-${uid}`,
					children: "Company"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `company-${uid}`,
					name: "company",
					type: "text",
					ref: honeypot,
					tabIndex: -1,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "font-mono",
				disabled: status.kind === "sending",
				children: status.kind === "sending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-4 w-4 animate-spin",
					"aria-hidden": "true"
				}), "Sending…"] }) : "Send message"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"aria-live": "polite",
				role: "status",
				className: "text-sm",
				children: [status.kind === "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/5 p-4 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						className: "mt-0.5 h-4 w-4 shrink-0 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status.message })]
				}), status.kind === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						className: "mt-0.5 h-4 w-4 shrink-0 text-destructive",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status.message })]
				})]
			})
		]
	});
}
//#endregion
export { ContactForm as t };
