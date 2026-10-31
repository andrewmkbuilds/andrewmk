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
- **`supabase/apply_all.sql` runs once per DB volume.** It is idempotent for the schema and seeds
  no blog posts: the authoritative source site publishes `/blog` as "No posts yet", so posts exist
  only when an admin writes one in `/admin/blog`. Use `down -v` to re-apply the schema.
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
  a pushState-based SPA navigation helper will report the route as not rendered. (The preview
  `navigate()` helper is one of those — it drives `history.pushState`, which this router does not
  observe, so open routes with `preview_screenshot path=` / a direct URL instead.)
- **Admin:** the first account created at `/auth` ("Create the first admin account") is promoted
  to `admin` by the `bootstrap_first_admin` trigger; later public signups are blocked by design.
  A sandbox database may already hold that first admin. **Admin credentials are never recorded in
  this repository** — no email, password or token belongs in docs, source, or committed env files.
  If you need to create the first admin on a fresh volume, choose the password yourself and pass it
  through your shell environment (never paste it into a file that git tracks):

  ```sh
  read -r -s ADMIN_PASSWORD                       # prompt, not echoed, not stored
  ANON=$(docker compose -f docker-compose.base44.yml exec -T web sh -c 'bun /app/docker/base44/jwt.mjs anon')
  curl -s -X POST 'http://localhost:8000/auth/v1/signup' \
    -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H 'Content-Type: application/json' \
    -d "{\"email\":\"<your-admin-email>\",\"password\":\"$ADMIN_PASSWORD\"}"; unset ADMIN_PASSWORD
  docker compose -f docker-compose.base44.yml exec -T db psql -U postgres -d postgres \
    -c 'select user_id, role from public.user_roles;'
  ```

  Admin routes are gated server-side (the `_authenticated` route loads the session and role, and
  every admin server function re-checks it against `public.user_roles`), so a client-side route
  guard is never the only check. Rotate any password that has ever appeared in a transcript, doc or
  commit from `/admin/settings/security`.

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

## Editorial layer

The layout language borrowed from the reference design (aatmanjain.com), translated
into the blue-and-gold palette. Colours are never taken from the reference.

- `--font-serif` (Instrument Serif, loaded with the other Google fonts in
  `src/routes/__root.tsx`) is the headline/pull-quote voice. `SectionHeading` turns
  `*word*` inside its `title` into that serif plus the gold hand-drawn underline, and
  page `<h1>`s use the same inline `<em className="serif-display mark-underline …">`.
- `src/components/ui/HeroCardStack.tsx` is the hero's taped, draggable card collage,
  and carries the hand-written **"Drag me"** cue (`SketchArrow` pointing at the top
  card). Cards drag with mouse and touch — `touch-action: pan-y` keeps vertical page
  scrolling working under a thumb — and are static under reduced motion. A drag lifts
  the card (scaled, deeper shadow) and springs it back on release.
- `src/components/ui/TechMarquee.tsx` is the infinite tools ribbon: **exactly two rows**,
  moving in opposite directions at different speeds (two CSS tracks each, duplicate
  hidden from assistive tech, paused on hover/off-screen, static and capped at 15 chips
  under reduced motion). The ribbon is full-bleed (`width: 100vw` + negative inline
  margin, clipped at the screen edge, no end mask) and its animation duration scales with
  the row length so a long row does not scroll faster than a short one. Row content comes
  from `src/data/toolMarquee.ts`, which weaves two primary chips for every guest: the
  five headline platforms (Base44, Lovable, GitHub, Claude, ChatGPT) recur constantly
  while the rest of the owner-supplied build stack drifts past. Primary chips are the
  larger, gold-edged variant.
- `src/components/ui/CaseStudyRow.tsx` renders one project as a case study: numbered
  eyebrow, serif title, real highlights, figures taken from `project.results`, and a
  media panel that lifts when the row is hovered.
- Paper/ink utilities live at the end of `src/styles.css`: `.paper`, `.tape`,
  `.sticker`, `.note-hand`, `.mark-underline`, `.case-media`, `.marquee*`.

## React Bits and the depth field

- `components.json` declares the React Bits registry (`@react-bits` →
  `https://reactbits.dev/r/{name}.json`). Components are pulled from that registry and
  vendored under `src/components/reactbits/` — do not hand-roll a CSS imitation of a
  component the registry already ships.
- `src/components/reactbits/Silk.tsx` is **Silk** (`Silk-TS-TW`), the site's dimensional
  background: a WebGL2 shader of satin folds that tilts toward the pointer. It is vendored
  verbatim and carries `@ts-nocheck` because it targets a looser tsconfig than this repo's;
  restyle it from `DepthField`/`styles.css`, never by editing its shader.
- `src/components/ui/DepthField.tsx` owns it: lazy chunk, mounted 400 ms after first paint,
  never mounted under `prefers-reduced-motion` (the CSS depth system paints that case),
  half the pixel ratio and no pointer interaction on touch. `AmbientLayers` renders it
  between the atmospheric wash and the aurora, dimmed by `.depth-field` opacity so paper
  surfaces keep their contrast. It is decoration: `pointer-events: none`, `aria-hidden`.
- The marquee brand marks stay monochrome masks tinted with `currentColor` (the site's
  established system). OpenAI and Lovable marks are vendored in `public/brands` so the
  two platforms the ribbon leads with have real logos; Base44 has no official mark
  available, so its chip carries the name and the Lucide fallback glyph.

## Brand marks and verified credentials

- `src/data/brands.ts` is the only brand registry: a name as the content writes it (`"Python"`,
  `"Framer Motion"`, `"FIRST LEGO League UAE …"`) maps to an official mark. Marks are the official
  monochrome SVGs vendored in `public/brands/` (Simple Icons, CC0) and painted with `currentColor`
  through a CSS mask, so they are same-origin, cached, tint-less until hovered and correct on both
  light and dark surfaces. Do not add a name to the registry that the portfolio content does not
  mention.
- `BrandLogo` (`src/components/ui/BrandLogo.tsx`) sizes every mark explicitly, so a missing or
  failed logo can never shift layout. Names with no official mark (Base44, Lovable, Tkinter,
  Java, LEGO, …) deliberately fall back to the Lucide glyph in `tech-icons.tsx`.
- Logo.dev: when `VITE_LOGO_DEV_TOKEN` (a Logo.dev publishable key) is present at dev-server start,
  `BrandLogo` requests `https://img.logo.dev/<domain>?token=…&size=…&format=png&retina=true&fallback=404`
  and falls back to the vendored mark on error. Without a token nothing is fetched remotely. Set it
  in an untracked `.env.local` or pass it through the `web` service environment; never commit it.
- Verified credentials: `Certificate.verifyUrl` is set **only** where a real official credential
  page exists (currently the two MongoDB Credly badges). The card renders a `Verified` pill that
  swaps to `Verified on Credly` on hover, and a `View credential` action; both are plain links to
  the external page with `target="_blank"`, `rel="noopener noreferrer"` and an accessible label.
  Never add a verification state without such a URL — there is no internal verification page.

## Content source of truth

`https://andrewmk.is-a.dev` is the only authoritative source for anything about Andrew — identity,
bio, projects, achievements, certificates, skills, dates and links. `src/data/portfolio.ts`,
`src/data/certificates.ts` and `src/data/seo.ts` mirror it; nothing is added from memory, other
sites, GitHub, social media or inference.

- When the source contradicts the repo, the source wins. Content the source does not publish
  (a project, award, role, skill list or blog post) is removed rather than kept.
- The 19 project slugs are exactly the source's `/projects/<slug>` routes; the four featured ones
  are Gradr, Stack Up, TerraCart and ClientFlow OS, the other 15 form the ecosystem grid.
- Certificates are the source's 34 gallery entries with the same titles, issuers, dates, categories
  and file names.
- `/blog` publishes nothing unless an admin writes a post — the source shows "No posts yet".
- Different source pages word the identity line differently (home `<h1>`, About "Identity",
  profile header, résumé subtitle, Person JSON-LD), so each place keeps its own exact wording from
  the source rather than deriving all of them from `PROFILE_TITLE`.
- To re-audit after a source change: pull the source `sitemap.xml`, fetch each route, strip the
  tags, and check that every sentence of the source appears on the matching local route — and that
  no project, award or role appears locally that the source does not publish.

## Résumé, print and positioning copy

- `/resume` renders only data the rest of the site already publishes: `timeline`, `allProjects`,
  `competitionResults`, `munResults`, `skillGroups` (the `/skills` taxonomy) and every entry in
  `certificatesByRecency` — the same full certificate list the source résumé prints. Competition
  results and their certificates both appear, exactly as on the source.
- `src/styles.css` ends with a `@media print` block (light tokens, no header/footer/decorative
  layers, no shadows, sections that flow across pages) that backs the masthead's "Print / Save as
  PDF" button. Page-specific print rules belong there, not in components.
- Paper-specific gotchas found by rendering the PDF in headless Chrome (`print` media, A4, the
  export's 12 mm/10 mm margins) and reading the per-page text stream:
  - `.reveal*` wrappers start at `opacity: 0` / `clip-path: inset(...)` and only switch on when
    they scroll into view, so printing without scrolling used to emit blank or half-clipped
    sections. The print block resets them to visible; keep that rule when adding reveal variants.
  - `break-after: avoid-page` belongs on headings only. Put on `p`, it chained a section's eyebrow
    to its heading and then to the whole following block, pushing the section to the next sheet
    and leaving half-empty pages (9 pages, three of them < 50% full). Headings only: 7 pages, all
    full.
  - A4 content width (~718 px) sits below Tailwind's `md` breakpoint, so `md:grid-cols-2` never
    applies on paper. The certificate list carries a `cert-list` class that the print block
    re-flows into two columns with its own rules.
  - Measure a change with: `page.emulateMediaType('print')` then `page.pdf(...)`, and check page
    count plus the bottom gap of each page from the PDF text coordinates. A ~150 MB throwaway
    node + `chrome-headless-shell` container is enough; nothing is added to the repo.
- The one-line positioning copy is `PROFILE_TITLE` in `src/data/portfolio.ts`; the résumé, the
  footer and `/skills` read it, and `PROFILE_IDENTITY` holds the verbatim About/JSON-LD identity
  line. The home `<h1>`, `/profile` and the Person JSON-LD each use the exact wording the source
  site uses in that same place, so they are written out where they differ. Page `<title>`s in
  `src/data/seo.ts` are separate SEO strings and are intentionally not derived from it.
- `body { overflow-x: hidden }` makes `documentElement` the scroll container. Automation that
  uses `window.scrollTo` can appear not to move the page; set
  `document.documentElement.scrollTop` instead.

## What to check after a change

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/           # 200 + real HTML
curl -s 'http://localhost:8000/rest/v1/blog_posts?select=slug&limit=1'   # seeded rows
curl -s http://localhost:8000/auth/v1/health                             # GoTrue up
docker compose -f docker-compose.base44.yml logs web --tail 30           # build/runtime errors
```

Known non-blocking noise: TanStack warns that `inputValidator()` is deprecated.

Hydration: motion's `useReducedMotion()` resolves to `null` on the server, so any component that
branches on it while rendering (structure, inline styles, classNames) sent markup the client could
not match. `src/hooks/use-hydrated-reduced-motion.ts` returns `false` until mount; use it instead of
`useReducedMotion()` wherever the value changes markup (`HeroCardStack`). Header's active pill is
derived only from the router's resolved location (`isActiveRoute`), never from `window`.

## Performance budget

The site is deliberately cheap to run. Keep it that way — these are the rules the current build
follows and the reasons behind them:

- **One scroll listener.** `src/lib/scroll.ts` owns the only `scroll` subscription, batches work into
  one `requestAnimationFrame`, and every subscriber unsubscribes when it goes off screen. Header
  (capsule elevation + progress bar) and `Parallax` use it; nothing adds its own scroll handler.
- **Reveals are CSS.** `Reveal` / `RevealWords` use a single shared `IntersectionObserver` that adds
  `.is-revealed` (styles in the "MOTION BUDGET" block at the end of `src/styles.css`). No per-element
  springs, no inline animation styles, and `prefers-reduced-motion` is handled in CSS so SSR and
  hydration agree.
- **No `backdrop-filter` on sticky or repeated surfaces.** A blurred sticky header repaints the strip
  every scroll frame; `.glass`, `.sticker` and `.tape` use layered translucent gradients instead.
- **No `filter: blur()` light fields.** Ambient and hero glows are radial gradients whose falloff is
  the blur — a full-screen filter would be re-blurred each frame.
- **Never `will-change` at rest.** Only the marquee tracks and the parallax elements while they are
  on screen opt in; permanent hints on every card cost GPU memory.
- **Marquee is one CSS transform.** `TechMarquee` pauses via `data-paused` when the ribbon is
  off screen or the tab is hidden, and does no per-frame positioning in JS.
- **Hero cards drag on every pointer, but only horizontally on touch.** `HeroCardStack` uses motion
  values (no React state per pointer move), `touch-action: pan-y` leaves vertical scrolling to the
  page, and the `.paper` surface has no CSS transform transition — that transition used to smooth
  (lag) every drag frame.
- **The WebGL field is optional.** Silk ships as its own lazy chunk
  (`.output/public/assets/Silk-*.js`), stops its own loop when the tab is hidden or the canvas is
  off-screen, and is the only extra pointer listener in the app (internal to the component; app
  surfaces still share `src/lib/pointer.ts`).
- **Parallax never runs on phones** (below 768px) and stops entirely under reduced motion.
- **Below-the-fold bundles are split.** The home contact form is `React.lazy`; TanStack splits each
  route file into its own chunk automatically (verified in `vite build` output).
- **Fonts** are limited to the weights the design uses (Sora 400/600/700, Inter 400/500/600,
  JetBrains Mono 400/500, Instrument Serif).

Measured on the sandbox (production build, `bunx vite build` in the `web` service): the shared
entry chunk is ~156 KB gzip, the layout/vendor chunk ~81 KB gzip before the animation library was
removed from Header/Footer/PageTransition, and each route ships its own chunk (e.g. `/journey`
~12 KB, `/achievements` ~19 KB raw). Re-measure after any change to shared components.

## Sandbox-only overrides

`vite.config.ts` adds `server.allowedHosts` for the preview proxy host, gated on
`BASE44_PREVIEW_MODE === "1"` plus `BASE44_SANDBOX_HOST_DOMAIN`; with the flag unset the config is
unchanged and Vite's default localhost behaviour applies. The compose file passes
`BASE44_PREVIEW_MODE` through from the platform unchanged.
