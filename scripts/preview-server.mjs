/**
 * Production preview for the Nitro build.
 *
 * `vite preview` cannot serve this app. `@tanstack/start-plugin-core`'s preview
 * plugin always imports `dist/server/server.js`, but the TanStack Start + Nitro
 * build used here writes `.output/server/index.mjs` instead — so every route
 * answered HTTP 500 ("Cannot find module dist/server/server.js").
 *
 * So the preview runs Nitro's own server entry, from the node-server artifact
 * produced by `bun run build:preview`:
 *
 *   bun run build:preview          # NITRO_PRESET=node-server vite build
 *   PORT=4173 bun run preview      # serves .output/server/index.mjs
 *
 * The default `bun run build` stays on Nitro's cloudflare-module preset (the
 * Worker bundle `wrangler deploy` ships), whose output is a `fetch` handler and
 * starts no server — the preset check below keeps the two artifacts apart.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outputDir = resolve(process.cwd(), ".output");
const entry = resolve(outputDir, "server/index.mjs");

if (!existsSync(entry)) {
  console.error(
    "[preview] No Nitro build at .output/server/index.mjs — run `bun run build:preview` first.",
  );
  process.exit(1);
}

const metaPath = resolve(outputDir, "nitro.json");
const preset = existsSync(metaPath)
  ? JSON.parse(readFileSync(metaPath, "utf8")).preset
  : undefined;

if (preset !== "node-server") {
  console.error(
    `[preview] .output was built with preset "${preset ?? "unknown"}", which does not start a server.\n` +
      "          That is the Cloudflare Worker bundle (deployed with `wrangler deploy`).\n" +
      "          Run `bun run build:preview` to build the node-server artifact this preview serves.",
  );
  process.exit(1);
}

// Nitro's node server reads NITRO_PORT / PORT and NITRO_HOST / HOST itself.
await import(pathToFileURL(entry).href);
