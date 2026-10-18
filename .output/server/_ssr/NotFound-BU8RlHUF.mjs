import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { a as Link$1, i as Layout, k as useLocation$1 } from "./Layout-C1nd09HF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NotFound-BU8RlHUF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NotFound = () => {
	const location = useLocation$1();
	(0, import_react.useEffect)(() => {
		console.error("404 Error: User attempted to access non-existent route:", location.pathname);
	}, [location.pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
		name: "robots",
		content: "noindex, nofollow"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "flex min-h-[70vh] items-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.2em] text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-4xl md:text-5xl font-bold text-foreground",
					children: "This page isn't built yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 max-w-md text-muted-foreground",
					children: [
						"The route ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-foreground",
							children: location.pathname
						}),
						" doesn't exist. Head back and explore the work instead."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "font-mono",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/",
							children: "Back home"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "font-mono",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/projects",
							children: "View projects"
						})
					})]
				})
			]
		})
	})] });
};
//#endregion
export { NotFound as t };
