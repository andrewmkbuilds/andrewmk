// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // The Supabase publishable keys are public (browser-safe) but the platform
    // secrets store delivers them as SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
    // (no VITE_ prefix). Vite only exposes VITE_-prefixed vars to the browser
    // bundle, so inject the public keys here via define; the client falls back
    // to process.env.SUPABASE_URL when import.meta.env.VITE_SUPABASE_URL is empty.
    // The service-role key is intentionally NOT defined — it must never reach
    // the browser.
    define: {
      "process.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL ?? ""),
      "process.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
      ),
    },
  },
});
