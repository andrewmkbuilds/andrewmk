import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/seo-Bli6t7t1.js
var SITE_URL = (((typeof import.meta !== "undefined" ? {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PROJECT_ID": "wqlrveawbyvqymaapemb",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_X6bp6fF5ri56omWk15jDrg_HrN6sPGF",
	"VITE_SUPABASE_URL": "https://wqlrveawbyvqymaapemb.supabase.co"
}["VITE_SITE_URL"] : void 0) ?? (typeof processModule !== "undefined" ? processModule.env?.["VITE_SITE_URL"] : void 0)) || "https://andrewmk.is-a.dev").replace(/\/$/, "");
var SITE_NAME = "Andrew Mathews";
var AUTHOR = "Andrew Mathews";
var routes = [
	{
		path: "/",
		label: "Home",
		title: "Andrew Mathews | Student Developer, AI Builder & Robotics Engineer",
		description: "Andrew Mathews is a student developer and technology builder from Dubai, UAE, creating AI applications, robotics projects, web apps, and innovative technology solutions.",
		ogHeadline: "I build systems that solve real problems.",
		changefreq: "weekly",
		priority: "1.0"
	},
	{
		path: "/projects",
		label: "Projects",
		title: "Projects | Andrew Mathews",
		description: "Explore the software, AI systems, tools, and experiments Andrew Mathews has built, filterable by technology and build platform.",
		ogHeadline: "Things I've Built",
		changefreq: "weekly",
		priority: "0.9"
	},
	{
		path: "/about",
		label: "About",
		title: "About | Andrew Mathews",
		description: "How Andrew Mathews thinks about building: systems over features, shipping over theory, and turning ideas into working products.",
		ogHeadline: "Systems over features.",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/journey",
		label: "Journey",
		title: "Journey | Andrew Mathews",
		description: "From a robotics programme at age 9 to shipping AI products: the timeline behind Andrew Mathews' work.",
		ogHeadline: "From robotics at 9 to shipping AI products.",
		changefreq: "monthly",
		priority: "0.7"
	},
	{
		path: "/achievements",
		label: "Achievements",
		title: "Achievements | Andrew Mathews",
		description: "STEM competitions, engineering challenges, MUN results, and exhibitions Andrew Mathews has taken part in.",
		ogHeadline: "Competitions, results, and exhibitions.",
		changefreq: "monthly",
		priority: "0.7"
	},
	{
		path: "/resume",
		label: "Résumé",
		title: "Résumé | Andrew Mathews",
		description: "The full résumé of Andrew Mathews: education, projects, STEM and MUN competition results, certificates, and technical skills.",
		ogHeadline: "Education, projects, competitions, certificates.",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/profile",
		label: "Profile",
		title: "Profile | Andrew Mathews",
		description: "A profile view of Andrew Mathews — about, projects, education, honors, certifications, skills, and every place to find him online.",
		ogHeadline: "Student developer, AI builder, systems thinker.",
		changefreq: "monthly",
		priority: "0.8"
	},
	{
		path: "/contact",
		label: "Contact",
		title: "Contact | Andrew Mathews",
		description: "Get in touch with Andrew Mathews to talk about technology, projects, collaboration, or something he is building.",
		ogHeadline: "Get in touch.",
		changefreq: "yearly",
		priority: "0.6"
	},
	{
		path: "/404",
		label: "Not found",
		title: "Page not found | Andrew Mathews",
		description: "This page isn't built yet.",
		ogHeadline: "Page not found",
		noindex: true
	}
];
routes.filter((r) => !r.noindex);
function routeSlug(path) {
	return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}
function ogImagePath(path) {
	return `/og/${routeSlug(path)}.png`;
}
function getRoute(path) {
	const found = routes.find((r) => r.path === path);
	if (!found) throw new Error(`No route metadata registered for "${path}"`);
	return found;
}
function breadcrumbJsonLd(route) {
	const items = [{
		name: "Home",
		item: `${SITE_URL}/`
	}];
	if (route.path !== "/") items.push({
		name: route.label,
		item: `${SITE_URL}${route.path}`
	});
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((entry, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: entry.name,
			item: entry.item
		}))
	};
}
function webPageJsonLd(route) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: route.title,
		description: route.description,
		url: `${SITE_URL}${route.path}`,
		isPartOf: {
			"@type": "WebSite",
			name: SITE_NAME,
			url: `${SITE_URL}/`
		},
		about: {
			"@type": "Person",
			name: AUTHOR
		}
	};
}
//#endregion
export { getRoute as a, breadcrumbJsonLd as i, SITE_NAME as n, ogImagePath as o, SITE_URL as r, webPageJsonLd as s, AUTHOR as t };
