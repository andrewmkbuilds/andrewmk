import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Unit tests for the site's own components and data derivations.
 *
 * Separate from `vite.config.ts` on purpose: TanStack Start's plugin boots a
 * router and a server entry, which a jsdom component test has no use for. Only
 * the alias and the JSX transform are needed here.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
