import { n as __toESM } from "../_runtime.mjs";
import { n as useReducedMotion, t as useInView } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-DX10E9CC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EASE = [
	.22,
	1,
	.36,
	1
];
function Reveal({ children, className, delay = 0, as = "div", y = 18, scale = false }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		margin: "0px 0px -10% 0px"
	});
	const reduce = useReducedMotion();
	const Comp = motion[as];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		ref,
		className: cn(className),
		initial: reduce ? false : {
			opacity: 0,
			y,
			scale: scale ? .985 : 1
		},
		animate: reduce || inView ? {
			opacity: 1,
			y: 0,
			scale: 1
		} : {
			opacity: 0,
			y,
			scale: scale ? .985 : 1
		},
		transition: {
			duration: .65,
			delay: delay / 1e3,
			ease: EASE
		},
		children
	});
}
/** Word-by-word headline entrance for display typography. */
function RevealWords({ text, className, delay = 0 }) {
	const reduce = useReducedMotion();
	const words = text.split(" ");
	if (reduce) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: text
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
		className: cn("inline", className),
		initial: "hidden",
		animate: "show",
		variants: {
			hidden: {},
			show: { transition: {
				staggerChildren: .045,
				delayChildren: delay
			} }
		},
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-block overflow-hidden align-bottom",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
				className: "inline-block",
				variants: {
					hidden: {
						y: "110%",
						opacity: 0
					},
					show: {
						y: "0%",
						opacity: 1,
						transition: {
							duration: .7,
							ease: EASE
						}
					}
				},
				children: [word, i < words.length - 1 ? "\xA0" : ""]
			})
		}, `${word}-${i}`))
	});
}
//#endregion
export { RevealWords as n, Reveal as t };
