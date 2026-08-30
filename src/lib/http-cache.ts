// Smart caching for SSR HTML and static assets.
// - Fingerprinted build assets (/assets/*, /_build/*) → immutable, 1 year.
// - Images, fonts, og:images → long cache with revalidation window.
// - SSR HTML → short shared cache + stale-while-revalidate + strong-ish ETag,
//   so repeat visits get a 304 instead of a full document download.

const IMMUTABLE = "public, max-age=31536000, immutable";
const ASSET = "public, max-age=86400, stale-while-revalidate=604800";
const HTML = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400, must-revalidate";
const NO_STORE = "no-store";

const IMMUTABLE_PREFIXES = ["/assets/", "/_build/", "/_serverFn/assets/"];
const ASSET_EXTENSIONS =
  /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|mp4|webm|txt|xml|json|css|js|map)$/i;

export function cacheControlFor(pathname: string, contentType: string): string | null {
  if (pathname.startsWith("/api/") || pathname.startsWith("/_serverFn/")) return NO_STORE;
  if (IMMUTABLE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return IMMUTABLE;
  if (contentType.includes("text/html")) return HTML;
  if (ASSET_EXTENSIONS.test(pathname)) return ASSET;
  return null;
}

/** FNV-1a over the body — cheap, stable, good enough for revalidation. */
export function weakETag(body: ArrayBuffer): string {
  const bytes = new Uint8Array(body);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i]!;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `W/"${bytes.length.toString(16)}-${hash.toString(16)}"`;
}

function etagMatches(header: string | null, etag: string): boolean {
  if (!header) return false;
  if (header.trim() === "*") return true;
  return header
    .split(",")
    .map((value) => value.trim())
    .some((value) => value === etag || value.replace(/^W\//, "") === etag.replace(/^W\//, ""));
}

/**
 * Applies Cache-Control to any response and adds ETag/304 handling to
 * cacheable SSR HTML responses.
 */
export async function withHttpCaching(request: Request, response: Response): Promise<Response> {
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
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  // Only buffer HTML — assets are streamed straight through with headers.
  if (!contentType.includes("text/html")) {
    const headers = new Headers(response.headers);
    headers.set("cache-control", cacheControl);
    headers.set("vary", mergeVary(headers.get("vary")));
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  const body = await response.arrayBuffer();
  const etag = weakETag(body);
  const headers = new Headers(response.headers);
  headers.set("cache-control", cacheControl);
  headers.set("etag", etag);
  headers.set("vary", mergeVary(headers.get("vary")));

  if (etagMatches(request.headers.get("if-none-match"), etag)) {
    headers.delete("content-length");
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { status: 200, statusText: response.statusText, headers });
}

function mergeVary(existing: string | null): string {
  const values = new Set(
    (existing ?? "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean),
  );
  values.add("accept-encoding");
  return [...values].join(", ");
}
