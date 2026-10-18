import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as featuredProjects, i as Layout, v as ecosystemProjects } from "./Layout-C1nd09HF.mjs";
import { t as Reveal } from "./Reveal-DX10E9CC.mjs";
import { t as SectionHeading } from "./SectionHeading-DieYsKLk.mjs";
import { t as Route } from "./projects.index-DWhbIJi7.mjs";
import { n as ProjectGrid, r as ProjectModal, t as ProjectCard } from "./ProjectGrid-hDNGu6Mr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects.index-C3jr98hn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Projects({ featured = featuredProjects, ecosystem = ecosystemProjects }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const openProject = (project) => {
		setSelected(project);
		setOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4",
								children: "Projects"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance",
								children: "Things I've Built"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg text-muted-foreground leading-relaxed",
								children: "Different problems. Different systems. One constant: build it."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "sr-only",
						children: "Featured projects"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-6 lg:grid-cols-2",
						children: featured.map((project, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 70,
							className: "h-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
								project,
								onOpen: openProject,
								variant: "featured",
								className: "h-full"
							})
						}, project.slug))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "Ecosystem",
						title: "Everything I Build Has a Purpose.",
						subtitle: "Systems, tools, experiments, and concepts built to solve specific problems."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectGrid, { projects: ecosystem }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "mt-10 font-mono text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "//"
						}), " More systems in development."]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectModal, {
			project: selected,
			open,
			onOpenChange: setOpen
		})
	] });
}
function ProjectsRoute() {
	const { featured, ecosystem } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {
		featured,
		ecosystem
	});
}
//#endregion
export { ProjectsRoute as component };
