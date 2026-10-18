//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var IMMUTABLE = "public, max-age=31536000, immutable";
var ASSET = "public, max-age=86400, stale-while-revalidate=604800";
var HTML = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400, must-revalidate";
var NO_STORE = "no-store";
var IMMUTABLE_PREFIXES = [
	"/assets/",
	"/_build/",
	"/_serverFn/assets/"
];
var ASSET_EXTENSIONS = /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|txt|xml|json|css|js|map)$/i;
function cacheControlFor(pathname, contentType) {
	if (pathname.startsWith("/api/") || pathname.startsWith("/_serverFn/")) return NO_STORE;
	if (IMMUTABLE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return IMMUTABLE;
	if (contentType.includes("text/html")) return HTML;
	if (ASSET_EXTENSIONS.test(pathname)) return ASSET;
	return null;
}
/** FNV-1a over the body — cheap, stable, good enough for revalidation. */
function weakETag(body) {
	const bytes = new Uint8Array(body);
	let hash = 2166136261;
	for (let i = 0; i < bytes.length; i++) {
		hash ^= bytes[i];
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return `W/"${bytes.length.toString(16)}-${hash.toString(16)}"`;
}
function etagMatches(header, etag) {
	if (!header) return false;
	if (header.trim() === "*") return true;
	return header.split(",").map((value) => value.trim()).some((value) => value === etag || value.replace(/^W\//, "") === etag.replace(/^W\//, ""));
}
/**
* Applies Cache-Control to any response and adds ETag/304 handling to
* cacheable SSR HTML responses.
*/
async function withHttpCaching(request, response) {
	if (request.method !== "GET" && request.method !== "HEAD") return response;
	if (response.status !== 200) return response;
	if (response.headers.has("cache-control")) return response;
	const pathname = new URL(request.url).pathname;
	const contentType = response.headers.get("content-type") ?? "";
	const cacheControl = cacheControlFor(pathname, contentType);
	if (!cacheControl) return response;
	if (cacheControl === NO_STORE) {
		const headers = new Headers(response.headers);
		headers.set("cache-control", NO_STORE);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
	if (!contentType.includes("text/html")) {
		const headers = new Headers(response.headers);
		headers.set("cache-control", cacheControl);
		headers.set("vary", mergeVary(headers.get("vary")));
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
	const body = await response.arrayBuffer();
	const etag = weakETag(body);
	const headers = new Headers(response.headers);
	headers.set("cache-control", cacheControl);
	headers.set("etag", etag);
	headers.set("vary", mergeVary(headers.get("vary")));
	if (etagMatches(request.headers.get("if-none-match"), etag)) {
		headers.delete("content-length");
		return new Response(null, {
			status: 304,
			headers
		});
	}
	return new Response(body, {
		status: 200,
		statusText: response.statusText,
		headers
	});
}
function mergeVary(existing) {
	const values = new Set((existing ?? "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean));
	values.add("accept-encoding");
	return [...values].join(", ");
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-Cc1N0Heb.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await withHttpCaching(request, await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx)));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
