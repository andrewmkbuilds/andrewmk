import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionHeading-DieYsKLk.js
var import_jsx_runtime = require_jsx_runtime();
function SectionHeading({ label, title, subtitle, className, align = "left" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
		className: cn("max-w-3xl mb-10 md:mb-14", align === "center" && "mx-auto text-center", className),
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					className: "hairline-gold inline-block w-8"
				}), label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-[1.1] text-balance",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base md:text-lg text-muted-foreground leading-relaxed",
				children: subtitle
			})
		]
	});
}
//#endregion
export { SectionHeading as t };
