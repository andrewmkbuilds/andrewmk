import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-BJUrh-0e.mjs";
import { S as useRouter, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, q as redirect, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as X } from "../_libs/lucide-react.mjs";
import { a as Root2, i as Provider, n as Close, o as Title, r as Description, s as Viewport, t as Action } from "../_libs/@radix-ui/react-toast+[...].mjs";
import { k as useLocation$1, l as TooltipProvider } from "./Layout-C1nd09HF.mjs";
import { t as NotFound } from "./NotFound-BU8RlHUF.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as supabase } from "./client-ewjTjLv0.mjs";
import { n as SITE_NAME, r as SITE_URL, t as AUTHOR } from "./seo-Bli6t7t1.mjs";
import { t as Route$20 } from "./blog._slug-swuSSVBJ.mjs";
import { t as Route$21 } from "./blog.index-dBKYtlSk.mjs";
import { n as featuredProjectsJsonLd } from "./project-schema-DKdE0Frl.mjs";
import { t as Route$22 } from "./projects._slug-DxifDZXx.mjs";
import { n as routeHead, t as Route$23 } from "./projects.index-DWhbIJi7.mjs";
import { t as z } from "../_libs/next-themes.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CoBw_yLx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOAST_LIMIT = 1;
var TOAST_REMOVE_DELAY = 1e6;
var count = 0;
function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map();
var addToRemoveQueue = (toastId) => {
	if (toastTimeouts.has(toastId)) return;
	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: "REMOVE_TOAST",
			toastId
		});
	}, TOAST_REMOVE_DELAY);
	toastTimeouts.set(toastId, timeout);
};
var reducer = (state, action) => {
	switch (action.type) {
		case "ADD_TOAST": return {
			...state,
			toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
		};
		case "UPDATE_TOAST": return {
			...state,
			toasts: state.toasts.map((t) => t.id === action.toast.id ? {
				...t,
				...action.toast
			} : t)
		};
		case "DISMISS_TOAST": {
			const { toastId } = action;
			if (toastId) addToRemoveQueue(toastId);
			else state.toasts.forEach((toast) => {
				addToRemoveQueue(toast.id);
			});
			return {
				...state,
				toasts: state.toasts.map((t) => t.id === toastId || toastId === void 0 ? {
					...t,
					open: false
				} : t)
			};
		}
		case "REMOVE_TOAST":
			if (action.toastId === void 0) return {
				...state,
				toasts: []
			};
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId)
			};
	}
};
var listeners = [];
var memoryState = { toasts: [] };
function dispatch(action) {
	memoryState = reducer(memoryState, action);
	listeners.forEach((listener) => {
		listener(memoryState);
	});
}
function toast$1({ ...props }) {
	const id = genId();
	const update = (props) => dispatch({
		type: "UPDATE_TOAST",
		toast: {
			...props,
			id
		}
	});
	const dismiss = () => dispatch({
		type: "DISMISS_TOAST",
		toastId: id
	});
	dispatch({
		type: "ADD_TOAST",
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			}
		}
	});
	return {
		id,
		dismiss,
		update
	};
}
function useToast() {
	const [state, setState] = import_react.useState(memoryState);
	import_react.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) listeners.splice(index, 1);
		};
	}, [state]);
	return {
		...state,
		toast: toast$1,
		dismiss: (toastId) => dispatch({
			type: "DISMISS_TOAST",
			...toastId !== void 0 ? { toastId } : {}
		})
	};
}
var ToastProvider = Provider;
var ToastViewport = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
	ref,
	className: cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
	...props
}));
ToastViewport.displayName = Viewport.displayName;
var toastVariants = cva("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
	variants: { variant: {
		default: "border bg-background text-foreground",
		destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
	} },
	defaultVariants: { variant: "default" }
});
var Toast = import_react.forwardRef(({ className, variant, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		ref,
		className: cn(toastVariants({ variant }), className),
		...props
	});
});
Toast.displayName = Root2.displayName;
var ToastAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50", className),
	...props
}));
ToastAction.displayName = Action.displayName;
var ToastClose = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Close, {
	ref,
	className: cn("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-hidden focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
	"toast-close": "",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
}));
ToastClose.displayName = Close.displayName;
var ToastTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
	ref,
	className: cn("text-sm font-semibold", className),
	...props
}));
ToastTitle.displayName = Title.displayName;
var ToastDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description, {
	ref,
	className: cn("text-sm opacity-90", className),
	...props
}));
ToastDescription.displayName = Description.displayName;
function Toaster$2() {
	const { toasts } = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToastProvider, { children: [toasts.map(function({ id, title, description, action, ...props }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toast, {
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle, { children: title }), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription, { children: description })]
				}),
				action,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose, {})
			]
		}, id);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport, {})] });
}
var Toaster$1 = ({ ...props }) => {
	const { theme = "system" } = z();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: theme ?? "system",
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function ScrollToTop() {
	const { pathname } = useLocation$1();
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var styles_default = "/assets/styles-C9FFol-c.css";
var personJsonLd = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "Person",
	name: AUTHOR,
	url: `${SITE_URL}/`,
	jobTitle: "Student · Developer · AI Builder · Systems Thinker",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Dubai",
		addressRegion: "Dubai",
		addressCountry: "AE"
	},
	homeLocation: {
		"@type": "Place",
		name: "Dubai, United Arab Emirates",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Dubai",
			addressCountry: "AE"
		}
	},
	workLocation: {
		"@type": "Place",
		name: "Dubai, United Arab Emirates"
	},
	nationality: {
		"@type": "Country",
		name: "United Arab Emirates"
	},
	knowsAbout: [
		"Artificial intelligence",
		"Robotics",
		"Web development",
		"STEM competitions in the UAE"
	],
	sameAs: [
		"https://github.com/andrewmkbuilds",
		"https://x.com/Andrew444884",
		"https://www.instagram.com/andrewmkbuilds/",
		"https://lovable.dev/@andrewbuilds",
		"https://app.base44.com/@andrewmkbuilds",
		"https://linktr.ee/andrewmkbuilds"
	]
});
var websiteJsonLd = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE_NAME,
	url: `${SITE_URL}/`,
	author: {
		"@type": "Person",
		name: AUTHOR
	}
});
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			},
			{ title: "Andrew Mathews | Student Developer, AI Builder & Robotics Engineer" },
			{
				name: "description",
				content: "Andrew Mathews is a student developer and technology builder from Dubai, UAE, creating AI applications, robotics projects, web apps, and innovative technology solutions."
			},
			{
				name: "author",
				content: AUTHOR
			},
			{
				name: "google-site-verification",
				content: "N0LjBnLEMo8ZqJ1lwaVLoswy8UkfIXMwgdfk35YEY-s"
			},
			{
				name: "Google-Site-Verification",
				content: "uEoWQOpt1nytKyk_9WlQU6iTrvkXo7Peuln1-OrCufs"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: personJsonLd
		}, {
			type: "application/ld+json",
			children: websiteJsonLd
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFound,
	errorComponent: RootErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$2, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollToTop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		] })
	});
}
function RootErrorComponent({ error, reset }) {
	const router = useRouter();
	console.error(error);
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.2em] text-primary",
					children: "Error"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-3xl font-bold text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "Something went wrong on our end. You can try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "font-mono",
						onClick: () => {
							router.invalidate();
							reset();
						},
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "font-mono",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							children: "Go home"
						})
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$16 = () => import("./routes-DYHVYCPY.mjs");
var Route$18 = createFileRoute("/")({
	head: () => {
		const base = routeHead("/");
		return {
			...base,
			scripts: [...base.scripts, {
				type: "application/ld+json",
				children: JSON.stringify(featuredProjectsJsonLd())
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./404-DMUQG2ez.mjs");
var Route$17 = createFileRoute("/404")({
	head: () => routeHead("/404"),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./route-Di7iQBCH.mjs");
var Route$16 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./about-BgJ1ZlpN.mjs");
var Route$15 = createFileRoute("/about")({
	head: () => routeHead("/about"),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./achievements-BHIRls0Z.mjs");
var Route$14 = createFileRoute("/achievements")({
	head: () => routeHead("/achievements"),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./auth-BgdC-UFz.mjs");
var Route$13 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in | Andrew Mathews" },
		{
			name: "description",
			content: "Private sign-in for the site admin area."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./contact-DVK6OAse.mjs");
var Route$12 = createFileRoute("/contact")({
	head: () => routeHead("/contact"),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./journey-BNGBmmg3.mjs");
var Route$11 = createFileRoute("/journey")({
	head: () => routeHead("/journey"),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./profile-s6W28Q13.mjs");
var Route$10 = createFileRoute("/profile")({
	head: () => routeHead("/profile"),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./resume-C6VjpaFV.mjs");
var Route$9 = createFileRoute("/resume")({
	head: () => routeHead("/resume"),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$8 = createFileRoute("/work")({ beforeLoad: () => {
	throw redirect({
		to: "/projects",
		replace: true
	});
} });
var $$splitComponentImporter$6 = () => import("./admin.index-CRdX6fMX.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [
		{ title: "Dashboard overview | Admin" },
		{
			name: "description",
			content: "Private overview of portfolio content."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.blog-BP9bOoVx.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/blog")({
	head: () => ({ meta: [
		{ title: "Blog editor | Admin" },
		{
			name: "description",
			content: "Private admin editor for portfolio blog posts."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.media-CX5Elab-.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/media")({
	head: () => ({ meta: [
		{ title: "Media library | Admin" },
		{
			name: "description",
			content: "Private admin media library for portfolio images."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.messages-CFPwTw-L.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/messages")({
	head: () => ({ meta: [
		{ title: "Contact submissions | Admin" },
		{
			name: "description",
			content: "Private admin view for contact form submissions."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.projects-CVPBKavC.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/projects")({
	head: () => ({ meta: [
		{ title: "Projects editor | Admin" },
		{
			name: "description",
			content: "Private admin editor for portfolio projects."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.settings-BAXl8Y2p.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/settings")({
	head: () => ({ meta: [
		{ title: "Settings | Admin" },
		{
			name: "description",
			content: "Private admin settings for the portfolio dashboard."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.settings.security-DKvjcJAM.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/settings/security")({
	head: () => ({ meta: [
		{ title: "Security | Admin" },
		{
			name: "description",
			content: "Private security settings for the admin account."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/**
* Public, crawlable image delivery for files uploaded through the content
* dashboard. The storage bucket itself stays private; this route streams the
* bytes with long-lived cache headers so images behave like static assets.
*/
var Route = createFileRoute("/api/public/media/$")({ server: { handlers: { GET: async ({ params }) => {
	const path = params._splat ?? "";
	if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data, error } = await supabaseAdmin.storage.from("media").download(path);
	if (error || !data) return new Response("Not found", { status: 404 });
	return new Response(await data.arrayBuffer(), { headers: {
		"content-type": data.type || "application/octet-stream",
		"cache-control": "public, max-age=31536000, immutable"
	} });
} } } });
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var R404Route = Route$17.update({
	id: "/404",
	path: "/404",
	getParentRoute: () => Route$19
});
var AuthenticatedRouteRoute = Route$16.update({
	id: "/_authenticated",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$15.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var AchievementsRoute = Route$14.update({
	id: "/achievements",
	path: "/achievements",
	getParentRoute: () => Route$19
});
var AuthRoute = Route$13.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$12.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var JourneyRoute = Route$11.update({
	id: "/journey",
	path: "/journey",
	getParentRoute: () => Route$19
});
var ProfileRoute = Route$10.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$19
});
var ResumeRoute = Route$9.update({
	id: "/resume",
	path: "/resume",
	getParentRoute: () => Route$19
});
var WorkRoute = Route$8.update({
	id: "/work",
	path: "/work",
	getParentRoute: () => Route$19
});
var BlogIndexRoute = Route$21.update({
	id: "/blog/",
	path: "/blog/",
	getParentRoute: () => Route$19
});
var BlogSlugRoute = Route$20.update({
	id: "/blog/$slug",
	path: "/blog/$slug",
	getParentRoute: () => Route$19
});
var ProjectsIndexRoute = Route$23.update({
	id: "/projects/",
	path: "/projects/",
	getParentRoute: () => Route$19
});
var ProjectsSlugRoute = Route$22.update({
	id: "/projects/$slug",
	path: "/projects/$slug",
	getParentRoute: () => Route$19
});
var AuthenticatedAdminIndexRoute = Route$7.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminBlogRoute = Route$6.update({
	id: "/admin/blog",
	path: "/admin/blog",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminMediaRoute = Route$5.update({
	id: "/admin/media",
	path: "/admin/media",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminMessagesRoute = Route$4.update({
	id: "/admin/messages",
	path: "/admin/messages",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminProjectsRoute = Route$3.update({
	id: "/admin/projects",
	path: "/admin/projects",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminSettingsRoute = Route$2.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminSettingsSecurityRoute = Route$1.update({
	id: "/security",
	path: "/security",
	getParentRoute: () => AuthenticatedAdminSettingsRoute
});
var ApiPublicMediaSplatRoute = Route.update({
	id: "/api/public/media/$",
	path: "/api/public/media/$",
	getParentRoute: () => Route$19
});
var AuthenticatedAdminSettingsRouteChildren = { AuthenticatedAdminSettingsSecurityRoute };
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminBlogRoute,
	AuthenticatedAdminMediaRoute,
	AuthenticatedAdminMessagesRoute,
	AuthenticatedAdminProjectsRoute,
	AuthenticatedAdminSettingsRoute: AuthenticatedAdminSettingsRoute._addFileChildren(AuthenticatedAdminSettingsRouteChildren),
	AuthenticatedAdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	R404Route,
	AboutRoute,
	AchievementsRoute,
	AuthRoute,
	ContactRoute,
	JourneyRoute,
	ProfileRoute,
	ResumeRoute,
	WorkRoute,
	BlogSlugRoute,
	ProjectsSlugRoute,
	BlogIndexRoute,
	ProjectsIndexRoute,
	ApiPublicMediaSplatRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
