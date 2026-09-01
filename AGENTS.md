# Base44 Dev Environment — Andrew Mathews Portfolio

## Stack
- **Runtime:** Bun (`oven/bun:1-debian`) + Vite dev server (TanStack Start SSR)
- **Framework:** React 19 + TanStack Router/Start + Tailwind CSS v4 + shadcn/ui
- **Backend/DB:** Supabase (remote, publishable keys committed in `.env`)
- **Port:** Vite dev server on `5173`, mapped to host `3000`

## Running the app
```
docker compose -f docker-compose.base44.yml up -d
```
The compose command runs `bun install`, generates the sitemap + OG images, then starts `vite dev`. Edits to source hot-reload.

## Key quirks
- **`bunx tsx` is broken under Bun** (the `predev`/`prebuild` hooks fail with "Cannot find module './cjs/index.cjs'"). Bun runs TypeScript natively, so the compose command invokes those scripts with `bun` directly instead of `bunx tsx`, then launches `bunx vite dev` (bypassing the npm `dev` script's predev hook).
- **OG image generation** prints a harmless `Fontconfig error: Cannot load default config file` (no fontconfig in the slim image) but still writes all 9 images successfully.
- **`vite.config.ts`** sets `server.host: true` + `allowedHosts: true` so the preview's external hostname is accepted.

## Supabase credentials
- The publishable keys (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `VITE_` mirrors) are committed in `.env` and are safe/public — the portfolio renders with them.
- The **service-role key** (`SUPABASE_SERVICE_ROLE_KEY`, used by `src/integrations/supabase/client.server.ts`) is NOT in `.env` and is only needed for admin/server-side operations. The public portfolio works without it; add it via the Base44 secrets panel only if admin features are needed.

## Verify
- `curl -sf http://localhost:3000/` returns the SSR HTML portfolio page.
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns HTTP 200 (external host accepted).
- Dev modules serve: `curl -sf http://localhost:3000/src/routes/index.tsx` → 200.
