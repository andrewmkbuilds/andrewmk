import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FilterBar-BrGUlU8R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Filter chips with roving tabindex: one tab stop, arrow keys move between
* options, Home/End jump to the ends — the pattern keyboard users expect.
*/
function FilterBar({ label, legend, options, value, onChange, className }) {
	const listRef = (0, import_react.useRef)(null);
	const focusAt = (index) => {
		const buttons = listRef.current?.querySelectorAll("button[data-filter]");
		if (!buttons?.length) return;
		buttons[(index + buttons.length) % buttons.length]?.focus();
	};
	const onKeyDown = (event, index) => {
		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				event.preventDefault();
				focusAt(index + 1);
				break;
			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault();
				focusAt(index - 1);
				break;
			case "Home":
				event.preventDefault();
				focusAt(0);
				break;
			case "End":
				event.preventDefault();
				focusAt(options.length - 1);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-center gap-2", className),
		children: [legend && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
			children: legend
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: listRef,
			role: "group",
			"aria-label": label,
			className: "flex flex-wrap gap-2",
			children: options.map((option, index) => {
				const active = option === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-filter": true,
					tabIndex: active ? 0 : -1,
					onClick: () => onChange(option),
					onKeyDown: (event) => onKeyDown(event, index),
					"aria-pressed": active,
					className: cn("rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 focus-ring", active ? "border-gold/60 bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"),
					children: option
				}, option);
			})
		})]
	});
}
//#endregion
export { FilterBar as t };
