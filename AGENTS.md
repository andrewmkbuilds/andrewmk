# AGENTS.md

Notes for anyone (human or agent) running this repo inside the Base44 sandbox.

## Start / stop

```sh
docker compose -f docker-compose.base44.yml up -d --build   # dev stack, live reload
docker compose -f docker-compose.base44.yml ps              # health
docker compose -f docker-compose.base44.yml down            # stop (keeps the DB volume)
docker compose -f docker-compose.base44.yml down -v         # stop + wipe DB (re-applies schema)
```

- **Host port 3000** is the preview entry point: `vite dev` (TanStack Start, SSR) run from the
  bind-mounted repo, so edits hot-reload. Verified: HMR logs `hmr update /src/styles.css`.
- **Host port 8000** is the Supabase-compatible API gateway (`docker/base44/nginx.conf`):
  `/rest/v1` → PostgREST, `/auth/v1` → GoTrue, with CORS for the preview origin.

## Package manager

`bun.lock` is the source of truth; the `web` service runs
`bun install --frozen-lockfile` at container start (dependencies live in the bind-mounted
`node_modules`, which is gitignored). `package-lock.json` is not used by the container.

`bun run dev`'s `predev` step (sitemap + OG image generation via `bunx tsx`) is skipped in
the container because it needs extra network fetches on every start; `public/sitemap.xml`
and `public/og/` are committed. Run them on demand:

```sh
docker compose -f docker-compose.base44.yml exec -T web bunx tsx scripts/generate-sitemap.ts
docker compose -f docker-compose.base44.yml exec -T web bunx tsx scripts/generate-og-images.ts
```

## Backend (self-hosted Supabase subset)

The app talks to `@supabase/supabase-js`, so the sandbox runs Postgres + PostgREST + GoTrue
instead of a hosted project:

| service        | role                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| `db`           | `postgres:16`; `docker/base44/db/init/00-roles.sql` creates the Supabase roles and the `auth` schema |
| `auth-migrate` | one-shot `gotrue migrate` (creates `auth.users` and friends)             |
| `schema`       | one-shot: `docker/base44/db/prelude.sql` (auth.uid/role/jwt helpers, stub `storage` schema) then `supabase/apply_all.sql` |
| `auth`         | GoTrue on 9999 (email + password, auto-confirmed, no SMTP)               |
| `rest`         | PostgREST on 3000 with the `anon` role for publishable reads             |
| `gateway`      | nginx on 8000, resolves the API containers per request via Docker DNS    |

Quirks worth knowing:

- **GoTrue config is half-unprefixed.** Both `gotrue migrate` and `gotrue serve` require
  `API_EXTERNAL_URL` (no `GOTRUE_` prefix) while the DB/JWT keys are prefixed. Compose sets both.
- **`auth` schema must exist before `gotrue migrate`**, because it migrates with
  `search_path=auth` (created in `00-roles.sql`).
- **Keys are local-only.** `docker/base44/jwt.mjs` mints `anon`/`service_role` JWTs at `web`
  start from the dev JWT secret in the compose file. No real Supabase project is contacted.
- **`supabase/apply_all.sql` runs once per DB volume.** It is idempotent for the schema, but its
  `blog_posts` seed rows are plain `INSERT`s, so the job skips if `public.blog_posts` already
  exists. Use `down -v` to re-seed.
- **No Storage API runs here.** `docker/base44/db/prelude.sql` creates a stub `storage` schema
  (`buckets`, `objects`) so the four `storage.objects` admin policies in `apply_all.sql` apply
  instead of erroring; nothing reads or writes those tables. Media uploads (`/admin/media`) still
  need a real Supabase Storage endpoint; the public site serves bundled assets.
- **`schema.sh` fails loudly.** It runs `apply_all.sql` with `ON_ERROR_STOP=1`, so a migration that
  cannot apply stops the `schema` job instead of scrolling past. `00-roles.sql` pre-creates
  GoTrue's empty `auth.schema_migrations` metadata table, avoiding its initial missing-table log
  while GoTrue records its migrations normally.
- **Navigation is a full document load.** The site's nav links are plain `<a href>`s (no client-side
  route transition), so each click re-renders the route server-side. Check a route with
  `curl -s http://localhost:3000/blog | grep -ao '<h1[^>]*>[^<]*'` or by opening the path directly;
  a pushState-based SPA navigation helper will report the route as not rendered.
- **Admin:** the first account created at `/auth` ("Create the first admin account") is promoted
  to `admin` by the `bootstrap_first_admin` trigger; later public signups are blocked by design.
- **Contact form** writes to `contact_messages`. Email delivery additionally needs
  `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (optional, see `.base44/environment.json`); without them
  the form reports "saved" and the row is stored only.

## Skills

`.claude/skills/ui-ux-pro-max/` holds the UI/UX Pro Max skill (MIT, v2.15.0, `uupm.cc`): a local
CSV design database plus a stdlib-only Python search tool. Query it from the repo root, e.g.
`python .claude/skills/ui-ux-pro-max/scripts/search.py "portfolio dark minimal" --design-system`
or `... "focus ring" --domain ux`. The sandbox host has no Python, so run it in a container:

```sh
docker run --rm -v "$PWD:/w" -w /w python:3.12-slim \
  python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style
```

## UI depth system

The visual language is built around one physical space rather than flat panels:

- `src/components/ui/AmbientLayers.tsx` mounts once in `Layout` (fixed, `-z-10`,
  `aria-hidden`) and supplies the shared environment: atmospheric wash → drifting
  aurora light → perspective floor → vignette. Sections with their own background sit
  on top of it.
- `src/components/ui/Parallax.tsx` is the only scroll-parallax primitive (transform
  only, spring-smoothed). It is disabled under `prefers-reduced-motion` and halved
  below 768px.
- `src/styles.css` owns the tokens and utilities: `--elev-1..3` elevation ladder,
  `--ease-out-expo` / `--dur-*` motion scale, `.glass`, `.headline-3d`,
  `.headline-3d-gold`, `.aurora*`, `.depth-floor`, `.sheen`.
- `Tilt3D` publishes `--mx` / `--my`; pass `glare` to render the `.sheen` light that
  follows the pointer (desktop pointers only).
- `SectionHeading` and every page `<h1>` use the dimensional heading utilities, so
  new pages inherit the type treatment by reusing those, not by adding new shadows.

## What to check after a change

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/           # 200 + real HTML
curl -s 'http://localhost:8000/rest/v1/blog_posts?select=slug&limit=1'   # seeded rows
curl -s http://localhost:8000/auth/v1/health                             # GoTrue up
docker compose -f docker-compose.base44.yml logs web --tail 30           # build/runtime errors
```

Known non-blocking noise: the dev SSR pass logs a React hydration mismatch for the nav link's
`active` class (client re-renders it), and TanStack warns that `inputValidator()` is deprecated.

## Sandbox-only overrides

`vite.config.ts` adds `server.allowedHosts` for the preview proxy host, gated on
`BASE44_PREVIEW_MODE === "1"` plus `BASE44_SANDBOX_HOST_DOMAIN`; with the flag unset the config is
unchanged and Vite's default localhost behaviour applies. The compose file passes
`BASE44_PREVIEW_MODE` through from the platform unchanged.
