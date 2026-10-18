import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as listPublishedPosts } from "./blog.functions-Nh7upfwn.mjs";
import { n as SITE_NAME, o as ogImagePath, r as SITE_URL } from "./seo-Bli6t7t1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.index-dBKYtlSk.js
var $$splitComponentImporter = () => import("./blog.index-jV1jsRb8.mjs");
var title = `Blog | ${SITE_NAME}`;
var description = "Essays by Andrew Mathews on shipping software, AI experiments, robotics, and the engineering habits behind his projects.";
var Route = createFileRoute("/blog/")({
	loader: async () => {
		try {
			return { posts: await listPublishedPosts() };
		} catch {
			return { posts: [] };
		}
	},
	head: () => {
		const url = `${SITE_URL}/blog`;
		const image = `${SITE_URL}${ogImagePath("/")}`;
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
					content: "website"
				},
				{
					property: "og:image",
					content: image
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
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
