import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as featuredProjects, v as ecosystemProjects } from "./Layout-C1nd09HF.mjs";
import { i as listPublishedProjects } from "./projects.functions-XuLZFS12.mjs";
import { a as getRoute, i as breadcrumbJsonLd, n as SITE_NAME, o as ogImagePath, r as SITE_URL, s as webPageJsonLd } from "./seo-BvaQqZHm.mjs";
import { t as allProjectsJsonLd } from "./project-schema-aLJzgYFq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects.index-C_cwZpZe.js
function routeHead(path) {
	const route = getRoute(path);
	const url = `${SITE_URL}${route.path}`;
	const image = `${SITE_URL}${ogImagePath(route.path)}`;
	return {
		meta: [
			{ title: route.title },
			{
				name: "description",
				content: route.description
			},
			{
				property: "og:site_name",
				content: SITE_NAME
			},
			{
				property: "og:title",
				content: route.title
			},
			{
				property: "og:description",
				content: route.description
			},
			{
				property: "og:url",
				content: url
			},
			{
				property: "og:type",
				content: route.path === "/" ? "website" : "article"
			},
			{
				property: "og:image",
				content: image
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: route.title
			},
			{
				name: "twitter:description",
				content: route.description
			},
			{
				name: "twitter:image",
				content: image
			},
			...route.noindex ? [{
				name: "robots",
				content: "noindex"
			}] : []
		],
		links: [{
			rel: "canonical",
			href: url
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(webPageJsonLd(route))
		}, {
			type: "application/ld+json",
			children: JSON.stringify(breadcrumbJsonLd(route))
		}]
	};
}
var $$splitComponentImporter = () => import("./projects.index-tF5URg8a.mjs");
var Route = createFileRoute("/projects/")({
	loader: async () => {
		try {
			const projects = await listPublishedProjects();
			if (projects.length === 0) return {
				featured: featuredProjects,
				ecosystem: ecosystemProjects
			};
			return {
				featured: projects.filter((p) => p.featured),
				ecosystem: projects.filter((p) => !p.featured)
			};
		} catch {
			return {
				featured: featuredProjects,
				ecosystem: ecosystemProjects
			};
		}
	},
	head: () => {
		const base = routeHead("/projects");
		return {
			...base,
			scripts: [...base.scripts, {
				type: "application/ld+json",
				children: JSON.stringify(allProjectsJsonLd())
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { routeHead as n, Route as t };
