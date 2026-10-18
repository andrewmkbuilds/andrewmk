import { X as notFound, _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as allProjects } from "./Layout-C1nd09HF.mjs";
import { i as listPublishedProjects, n as getPublishedProject } from "./projects.functions-XuLZFS12.mjs";
import { n as SITE_NAME, o as ogImagePath, r as SITE_URL } from "./seo-Bli6t7t1.mjs";
import { r as projectJsonLd } from "./project-schema-DKdE0Frl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._slug-DxifDZXx.js
var $$splitComponentImporter = () => import("./projects._slug-DDUOgEeg.mjs");
var $$splitNotFoundComponentImporter = () => import("./projects._slug-BdUep_5y.mjs");
function staticProject(slug) {
	return allProjects.find((p) => p.slug === slug);
}
/** Absolute URL for an image reference that may be site-relative. */
function absolute(url) {
	if (!url) return void 0;
	return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}
var Route = createFileRoute("/projects/$slug")({
	loader: async ({ params }) => {
		let project = null;
		let catalogue = allProjects;
		try {
			project = await getPublishedProject({ data: { slug: params.slug } });
			const all = await listPublishedProjects();
			if (all.length > 0) catalogue = all;
		} catch {
			project = null;
		}
		project = project ?? staticProject(params.slug) ?? null;
		if (!project) throw notFound();
		return {
			project,
			catalogue
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: `Project not found | ${SITE_NAME}` }, {
			name: "robots",
			content: "noindex"
		}] };
		const { project } = loaderData;
		const url = `${SITE_URL}/projects/${project.slug}`;
		const canonical = project.seo?.canonical || url;
		const image = absolute(project.seo?.ogImage) ?? absolute(project.featuredImage) ?? `${SITE_URL}${ogImagePath("/projects")}`;
		const title = project.seo?.title || `${project.name} | ${project.category} by Andrew Mathews`;
		const description = (project.seo?.description || `${project.name} is ${project.description.charAt(0).toLowerCase()}${project.description.slice(1)}`).slice(0, 158);
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:site_name",
					content: SITE_NAME
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: url
				},
				{
					property: "og:type",
					content: "article"
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
					content: title
				},
				{
					name: "twitter:description",
					content: description
				},
				{
					name: "twitter:image",
					content: image
				}
			],
			links: [{
				rel: "canonical",
				href: canonical
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					...projectJsonLd(project, `/projects/${project.slug}`),
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": url
					}
				})
			}, {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: `${SITE_URL}/`
						},
						{
							"@type": "ListItem",
							position: 2,
							name: "Projects",
							item: `${SITE_URL}/projects`
						},
						{
							"@type": "ListItem",
							position: 3,
							name: project.name,
							item: url
						}
					]
				})
			}]
		};
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
