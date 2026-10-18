import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StatusDot-CTR_KAOE.js
var import_jsx_runtime = require_jsx_runtime();
function StatusDot({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("relative flex h-2 w-2", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-gold opacity-70 animate-ping motion-reduce:animate-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-gold" })]
	});
}
//#endregion
export { StatusDot as t };
