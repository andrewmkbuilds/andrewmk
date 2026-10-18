import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as cn } from "./button-BJUrh-0e.mjs";
import { R as ExternalLink } from "../_libs/lucide-react.mjs";
import { D as socialLinks, S as getSocialIcon, c as TooltipContent, l as TooltipProvider, s as Tooltip, u as TooltipTrigger } from "./Layout-C1nd09HF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BuiltBy-iOKN8MoW.js
var import_jsx_runtime = require_jsx_runtime();
function getEntries(project) {
	const entries = [];
	if (project.github) entries.push({
		key: "github",
		href: project.github,
		label: `${project.name} on GitHub`,
		icon: getSocialIcon("github")
	});
	if (project.live) entries.push({
		key: "live",
		href: project.live,
		label: `${project.name} live app`,
		icon: ExternalLink
	});
	if (project.platform) {
		const social = socialLinks.find((s) => s.id === project.platform);
		if (social) entries.push({
			key: social.id,
			href: social.url,
			label: `Built with ${social.label} — ${social.handle}`,
			icon: getSocialIcon(social.id)
		});
	}
	return entries;
}
/** Subtle "Built with Base44/Lovable" badge linking to Andrew's profile on that platform. */
function PlatformBadge({ project, className }) {
	if (!project.platform) return null;
	const social = socialLinks.find((s) => s.id === project.platform);
	if (!social) return null;
	const Icon = getSocialIcon(social.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: social.url,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": `${project.name} — built with ${social.label}, view Andrew's ${social.label} profile (opens in a new tab)`,
		onClick: (e) => e.stopPropagation(),
		className: cn("inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary transition-colors hover:border-gold/60 hover:bg-primary/15 focus-ring", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
			"Built with ",
			social.label
		]
	});
}
/** Platform options derived from the "Built by Andrew" attribution. */
var platformFilters = [
	"All",
	"GitHub",
	"Lovable",
	"Base44"
];
/** Platforms a project is actually attributed to, matching the BuiltBy links. */
function getProjectPlatforms(project) {
	const labels = {
		github: "GitHub",
		lovable: "Lovable",
		base44: "Base44"
	};
	return getEntries(project).map((entry) => labels[entry.key]).filter((label) => Boolean(label));
}
/** Small "Built by Andrew" attribution row with only the links relevant to a project. */
function BuiltBy({ project, className, showLabel = false }) {
	const entries = getEntries(project);
	if (entries.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center gap-1.5", className),
			children: [showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
				children: "Built by Andrew"
			}), entries.map((entry) => {
				const Icon = entry.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: entry.href,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": `${entry.label} (opens in a new tab)`,
						onClick: (e) => e.stopPropagation(),
						className: "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/60 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold focus-ring",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: entry.label })] }, entry.key);
			})]
		})
	});
}
//#endregion
export { platformFilters as i, PlatformBadge as n, getProjectPlatforms as r, BuiltBy as t };
