import { b as featuredProjects, f as allProjects } from "./Layout-C1nd09HF.mjs";
import { r as SITE_URL, t as AUTHOR } from "./seo-Bli6t7t1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-schema-DKdE0Frl.js
var PLATFORM_LABEL = {
	base44: "Base44",
	lovable: "Lovable"
};
var STATUS_LABEL = { Live: "https://schema.org/InStock" };
function projectJsonLd(project, pagePath) {
	const platform = project.platform ? PLATFORM_LABEL[project.platform] : void 0;
	return {
		"@type": "SoftwareApplication",
		name: project.name,
		description: project.description,
		applicationCategory: project.category,
		url: project.live ?? `${SITE_URL}${pagePath}#${project.slug}`,
		...project.github ? { codeRepository: project.github } : {},
		author: {
			"@type": "Person",
			name: AUTHOR,
			url: `${SITE_URL}/`
		},
		creator: {
			"@type": "Person",
			name: AUTHOR,
			url: `${SITE_URL}/`
		},
		operatingSystem: "Web",
		keywords: [...project.tech, ...platform ? [`Built with ${platform}`] : []].join(", "),
		featureList: project.built,
		...platform ? {
			isBasedOn: {
				"@type": "SoftwareApplication",
				name: platform
			},
			additionalProperty: [
				{
					"@type": "PropertyValue",
					name: "Build platform",
					value: platform
				},
				{
					"@type": "PropertyValue",
					name: "Stack",
					value: project.tech.join(", ")
				},
				{
					"@type": "PropertyValue",
					name: "Status",
					value: project.status
				}
			]
		} : { additionalProperty: [{
			"@type": "PropertyValue",
			name: "Stack",
			value: project.tech.join(", ")
		}, {
			"@type": "PropertyValue",
			name: "Status",
			value: project.status
		}] },
		...STATUS_LABEL[project.status] ? { offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			availability: STATUS_LABEL[project.status]
		} } : {}
	};
}
function projectItemListJsonLd(projects, pagePath, name, description) {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name,
		description,
		url: `${SITE_URL}${pagePath}`,
		numberOfItems: projects.length,
		itemListOrder: "https://schema.org/ItemListOrderAscending",
		itemListElement: projects.map((project, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: project.live ?? `${SITE_URL}${pagePath}#${project.slug}`,
			item: projectJsonLd(project, pagePath)
		}))
	};
}
var allProjectsJsonLd = () => projectItemListJsonLd(allProjects, "/projects", "Projects by Andrew Mathews", "Software, AI systems, tools and experiments built by Andrew Mathews, with stack and build platform for each.");
var featuredProjectsJsonLd = () => projectItemListJsonLd(featuredProjects, "/projects", "Featured work by Andrew Mathews", "Selected products built by Andrew Mathews, with stack and build platform for each.");
//#endregion
export { featuredProjectsJsonLd as n, projectJsonLd as r, allProjectsJsonLd as t };
