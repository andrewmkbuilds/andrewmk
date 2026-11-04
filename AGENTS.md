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
- **Stage new files before finishing a turn.** The platform's end-of-turn commit takes the git
  index, so a file it never sees staged stays untracked for every later commit while the imports
  that reference it get committed — which is how `ui/Sketch.tsx`, `ui/CursorLayer.tsx`,
  `lib/pointer.ts` and the scene components went missing from the branch and left CI red on
  unresolved imports. Run `git add -A` after creating or restoring files; an empty
  `git status --short` is the proof.

## Package manager

`bun.lock` is the **only** lockfile; the `web` service runs
`bun install --frozen-lockfile` at container start (dependencies live in the bind-mounted
`node_modules`, which is gitignored). A `package-lock.json` used to sit next to it — unused
by the container, and drifted out of sync with `package.json` (it still pinned
`@img/sharp-wasm32@0.35.4` and lacked `gsap`, `docx` and `pdf-lib`), so `npm ci` failed outright.
Cloudflare's builder picks the package manager from whichever lockfile it finds, so it was
removed on 2026-11-02 rather than regenerated: one lockfile, one dependency tree. Do not add a
second one back.

The `scripts/*.ts` generators run through `tsx` (a devDependency) instead of `bunx tsx`, so
`npm run build` works on a Node-only builder such as Cloudflare's. Verified 2026-11-02 in a clean
`node:24` copy: `npm install` → `npm run build` → `.output/server/index.mjs` →
`npx wrangler deploy --dry-run` all clean, and `bun install --frozen-lockfile && bun run build`
identical.

`bun run dev`'s `predev` step (sitemap + OG image generation via `bunx tsx`) is skipped in
the container because it needs extra network fetches on every start; `public/sitemap.xml`
and `public/og/` are committed. Run them on demand:

```sh
docker compose -f docker-compose.base44.yml exec -T web bunx tsx scripts/generate-sitemap.ts
docker compose -f docker-compose.base44.yml exec -T web bunx tsx scripts/generate-og-images.ts
```

## Production build, preview and deploy

Two artifacts come out of the same source, and they are not interchangeable:

| command                 | Nitro preset        | `.output/server/index.mjs`           | used for                               |
| ----------------------- | ------------------- | ------------------------------------ | -------------------------------------- |
| `bun run build`         | `cloudflare-module` | a Worker `fetch` handler (no server) | `wrangler deploy` — the deployed site  |
| `bun run build:preview` | `node-server`       | starts an HTTP server                | `bun run preview`, the SEO/a11y stages |

- **`vite preview` cannot serve this app — do not put it back.** TanStack Start's preview server
  always imports `dist/server/server.js` while the Nitro build writes `.output/server/index.mjs`,
  so every route answered HTTP 500 (`Cannot find module …/dist/server/server.js`). `bun run preview`
  now runs `scripts/preview-server.mjs`, which imports the real Nitro entry and refuses to start on
  the Cloudflare artifact (that preset starts no server, so a mismatch used to hang instead of
  failing). CI builds with `bun run build:preview` and starts it with `PORT=4173`.
- **The two builds share `.output`, so the last one wins.** Run the preview build after the
  Cloudflare build, never the other way round, when both are needed in one job.
- **Only the deploy build prerenders; the preview build stays pure SSR.** `vite.config.ts` sets
  `tanstackStart.prerender` with an explicit route list (the content routes: `/`, `/about`,
  `/journey`, `/skills`, `/achievements`, `/resume`, `/profile`, `/now`, `/press-kit`, `/faq`,
  `/colophon`, `/sitemap`, `/developers`, `/contact`) and `crawlLinks: false`, so a new dynamic
  route can never be frozen into a static file. It is gated to the `cloudflare-module` target only
  (`SSG_ENABLED` in `vite.config.ts`): TanStack's prerender pass boots the built server through
  its preview shim, which loads Nitro's `index.mjs` entry, and neither other target has one.
  Nitro's `node-server` entry exposes no `fetch` (every route failed and 0 pages prerendered), and
  Nitro's `cloudflare-pages` target (what the Pages builder sets `CF_PAGES` for) emits
  `dist/_worker.js/index.js` — the shim could not load it, every prerendered route answered
  Internal Server Error and the whole Pages build failed. The Pages target therefore renders those
  routes on demand; the Worker deploy keeps full SSG. Verified 2026-11-03: `CF_PAGES=1 bun run
build` exits 0 with `dist/_worker.js/index.js` + `dist/_routes.json` and no failed fetches.
  `/projects`, `/projects/$slug` and `/blog/*` deliberately
  stay SSR because their metadata comes from the database at request time. `sitemap.enabled` is
  off so `scripts/generate-sitemap.ts` keeps owning `public/sitemap.xml`. Verified 2026-11-02:
  `bun run build` prerendered all 14 pages with real content (OG tags and the custom sitemap
  intact) and `typecheck` was clean.
- **The root `wrangler.jsonc` holds shared settings only — never `main` or an assets binding.**
  Nitro reads it and merges it into the deploy config it writes for whichever target it built:
  `.output/server/wrangler.json` for Workers (`bun run build`), `dist/_worker.js/wrangler.json`
  for Cloudflare Pages (the builder sets `CF_PAGES`, which makes Nitro pick `cloudflare-pages`).
  Nitro adds the target's own fields — the Worker entry point, the `ASSETS` binding and its
  directory for Workers, `pages_build_output_dir` for Pages — so the root file keeps only `name`,
  `compatibility_date` and `compatibility_flags`. Workers-only fields there used to be copied into
  the Pages config, which Cloudflare rejected with "The name 'ASSETS' is reserved in Pages
  projects" and failed the Pages deployment (fixed 2026-11-02). `wrangler` follows Nitro's
  generated `.wrangler/deploy/config.json`, so `bun run deploy:check` validates the Workers bundle
  after a build — verified 2026-11-02: 134 modules, 5.6 MB raw / 1.34 MB gzip, 318 asset files.
  Verify the Pages side with `CF_PAGES=1 bun run build`, then
  `bunx wrangler pages deploy dist --project-name andrewmkbuilds-andrewmk --branch main`:
  it must reach the credentials error, not a configuration error.
- **`import.meta.dir` is Bun-only — the scripts must not use it.** `scripts/generate-scene-pool.ts`
  used it to locate `src/data/scene-pool.generated.ts`, which is fine under `bun` but `undefined`
  under Node, where `tsx` runs on the CI and Cloudflare builders: `prebuild` died with
  `ERR_INVALID_ARG_TYPE` from `resolve(undefined, …)` before Vite ever started, which failed the
  `CI` job, `Cloudflare Pages` and `Workers Builds: andrewmk` in under a minute. It derives the
  directory from `fileURLToPath(import.meta.url)` now. Verified 2026-11-03 on `node:24` (the
  version CI runs): `node node_modules/tsx/dist/cli.mjs scripts/generate-scene-pool.ts` writes
  23 projects. Keep every `scripts/*.ts` Node-portable — no `Bun.*` globals.
- **The Cloudflare checks give no log, so reproduce their builder instead.** `Cloudflare Pages` and
  `Workers Builds: andrewmk` report only "Build failed." (no annotations, logs behind an
  authenticated dashboard), and both fail in under a minute — too fast to be a compile. Their
  build image runs Node, and the repo's lockfile picks the package manager, so the failure was
  reproduced on a clean `git archive` copy in `node:24` (see "Package manager" for the two causes
  and the fix, 2026-11-02). When a Cloudflare check goes red again, re-run that reproduction before
  reading the app code: `npm install && npm run build && npx wrangler deploy --dry-run`.
- **The selection check asserts the brand gold — the palette it was written against is gone.** The
  `CI` job's install, lint, format, typecheck, `build`, `deploy:check` and `build:preview` steps
  pass; `scripts/selection-visual-check.py` failed every route with `off-theme bg=(74, 67, 53)`
  only because it still demanded a green highlight. `--selection-bg` is
  `color-mix(in oklab, var(--gold) 38%, var(--background))`, i.e. a warm ramp
  (red ≥ green ≥ blue), so that is the rule now; the browser-default blue
  (`blue > green and blue > red`) is still rejected, the 4.5:1 contrast floor against
  `--selection-fg` is unchanged, and the pass label is `theme-ok`. The baseline shot also waits for
  the element to finish its reveal transition: Chromium captured the `/projects` card mid-fade and
  diffed the card's own gradient shift as the highlight (`BLUE-FALLBACK`, zero gold pixels).
  Verified 2026-11-02 in Chromium at 1280 px and 390 px — 18/18 measured cases `theme-ok`, 0
  failures (the five contact-field cases skip in both because the lazy form's inputs are not
  mounted). Firefox and WebKit were not re-run locally; their CI numbers for the same cases were
  `bg=(73,66,52)` / `(24,18,8)`, warm ramps that pass the same rule.
- Verified 2026-11-02 in the sandbox, in the order CI runs them: `lint`, `format:check`,
  `validate:data`, `typecheck`, `build` + `deploy:check`, `build:preview` all clean,
  `seo:regression` 16/16 routes, `a11y:check` 16/16, every `sitemap.xml` URL (38) below 400, and
  `/404`, `/robots.txt`, `/openapi.json`, `/llms.txt`, `/data/v1/*.json`, `/api/cv/pdf` (7.5 kB PDF)
  and `/api/cv/docx` (12.8 kB DOCX) all served by the node preview build. The CV routes are
  `/api/cv/pdf` and `/api/cv/docx` — `/api/cv.pdf` answers 404 in dev too, so it is not a build
  regression.

## Backend (self-hosted Supabase subset)

The app talks to `@supabase/supabase-js`, so the sandbox runs Postgres + PostgREST + GoTrue
instead of a hosted project:

| service        | role                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `db`           | `postgres:16`; `docker/base44/db/init/00-roles.sql` creates the Supabase roles and the `auth` schema                      |
| `auth-migrate` | one-shot `gotrue migrate` (creates `auth.users` and friends)                                                              |
| `schema`       | one-shot: `docker/base44/db/prelude.sql` (auth.uid/role/jwt helpers, stub `storage` schema) then `supabase/apply_all.sql` |
| `auth`         | GoTrue on 9999 (email + password, auto-confirmed, no SMTP)                                                                |
| `rest`         | PostgREST on 3000 with the `anon` role for publishable reads                                                              |
| `gateway`      | nginx on 8000, resolves the API containers per request via Docker DNS                                                     |

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
- **Navigation is mixed, and the scroll reset must handle both.** Header/logo links are TanStack
  `Link`s (client-side, and a card's own link may be a plain `<a href>`), so a route change can
  happen inside one document. `ScrollToTop` therefore resets `document.scrollingElement.scrollTop`
  (not just `window.scrollTo`, which does nothing while `body` owns the overflow) and skips
  history pops so Back/Forward keep their position. Verified 2026-11-02: from `/projects` scrolled
  4 200 px, the header link landed on `/` at scroll 0 with the homepage `<h1>`.
- **A plain `<a href>` is a full document load.** With those, each click re-renders the route
  server-side. Check a route with
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
  `aria-hidden`) and supplies the shared environment: a near-black navy room, two soft
  light blooms, the React Bits GridMotion tile wall, a vignette and grain. Sections with
  their own background sit on top of it. No canvas, no WebGL (see "The ambient background"
  below).
- `src/components/ui/Parallax.tsx` is the only scroll-parallax primitive (transform
  only, spring-smoothed). It is disabled under `prefers-reduced-motion` and halved
  below 768px.
- `src/styles.css` owns the tokens and utilities: `--elev-1..3` elevation ladder,
  `--ease-out-expo` / `--dur-*` motion scale, `.glass`, `.headline-3d`,
  `.headline-3d-gold`, `.aurora*`, `.depth-floor`, `.sheen`.
- **Cards do not tilt (2026-11-03).** `Tilt3D` and the pointer-driven rotation in
  `ProjectCard` were removed: a card lifts vertically and lights up instead of
  rotating. `ui/CardFx.tsx` owns the whole interactive layer — `CardFxTracker`
  mounts once in `Layout` and writes `--mx` / `--my` on the `.spotlight` card under
  the cursor (one delegated `pointermove`, one rect per card entry, one rAF), and
  `CardSparkles` renders the featured-card lights. `styles.css` holds `.spotlight`
  (blue + gold radial at the cursor), `.edge-glow` (a blue→gold conic arc masked to
  the 1px border, animated only while hovered — the keyframes are `paused`, not
  removed, so the arc neither repaints at rest nor jumps), `.fx-sheen` (one light
  streak per hover) and `.lift-3d` (translate-only elevation). Gate the pointer
  listener on `pointerType === "mouse"`, never on `(pointer: fine)` — that query is
  false in embedded/automated browsers. Touch gets a static centred light plus an
  `:active` press, and `prefers-reduced-motion` stops the border animation, the
  sparkles and the streak. Verified in the preview 2026-11-03: 23 project cards,
  `--mx/--my` moved 25%/30% → 80%/75% on a mouse move and stayed unset for a touch
  move, 4 featured cards carry 24 sparkle dots, no inline rotation, no sideways
  overflow at 1535 / 375 px, 0 console errors. The class contract, timing and
  verification steps are written up in `docs/CARD_INTERACTIONS.md`.
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
  the card (scaled, deeper shadow) and the card **stays where it is dropped**. Position
  lives on the outer wrapper's `x`/`y` motion values and nothing else ever writes them;
  the inner `.hero-card` owns only the look (entry animation, drag bank/tilt, hover lift).
  Do not switch this back to motion's `drag` prop: `drag` shares its motion values with
  the `animate` prop, and the entrance animation (`y: 0`) replayed on the next re-render
  (the lazy background mounts ~0.9 s in) and slid every dropped card home.
- `src/components/ui/TechMarquee.tsx` is the infinite tools ribbon: **exactly two rows**,
  moving in opposite directions at different speeds (two CSS tracks each, duplicate
  hidden from assistive tech, paused on hover/off-screen, static and wrapped — never
  capped — under reduced motion). The ribbon is full-bleed (`width: 100vw` + negative
  inline margin, clipped at the screen edge, no end mask) and its animation duration
  scales with the row length so a long row does not scroll faster than a short one. Row
  content comes from `src/data/toolMarquee.ts`, which weaves two primary chips for every
  guest: the five headline platforms (Base44, Lovable, GitHub, Claude, ChatGPT) recur
  constantly while the rest of the owner-supplied build stack drifts past.
- **One pill box, no size hierarchy.** `--marquee-chip-w` / `--marquee-chip-h` are declared
  once on `.marquee` (re-tuned, not re-shaped, inside the 767 px query) and every `.marquee-chip`
  takes them with `box-sizing: border-box`, `flex: 0 0 auto`, `justify-content: center`, and the
  same inline padding, radius, 1 px border, 18 px mark slot, gap and mono type. Primary chips are
  the gold-edge variant in colour only. The width fits the longest label ("Tailwind CSS") and the
  label clips to an ellipsis instead of stretching its pill, so no name or logo can resize one —
  `ui/TechMarquee.tsx` renders the same markup for the real group and its duplicated loop copy,
  so both are identical by construction. Verified 2026-11-02 in the preview: all 168 rendered chips
  measured exactly 184 × 44 px at 1146 px and 153.6 × 38 px at 375 px, with one computed padding
  (`0 19.2px`), 999 px radius, 1 px border, 11.2 px gap, 14.5 px/1 mono type, an 18 × 18 icon slot,
  every label centred to the pixel, and no label truncated.
- `src/components/ui/CaseStudyRow.tsx` renders one project as a case study: numbered
  eyebrow, serif title, real highlights, figures taken from `project.results`, and a
  media panel that lifts when the row is hovered.
- Paper/ink utilities live at the end of `src/styles.css`: `.paper`, `.tape`,
  `.sticker`, `.note-hand`, `.mark-underline`, `.case-media`, `.marquee*`.

## Journey chapter stack

`src/components/ui/StackingCards.tsx` is the `/journey` narrative: one
typographic plate per `timeline` entry (7 today) that hold the screen while you
scroll — each new card slides up over the last, which sinks, shrinks, tilts and
darkens underneath it. The counter under the plate shows the chapter and its
ticks jump to any of them (pointer, Enter/Space) via `aria-current`; the plain
list of the same cards renders instead of the stack under reduced motion.

- **Adapted from the supplied "StackingCards" demo, not copied.** It ran on GSAP
  - ScrollTrigger with stock photography and an `#ebebe9` stage; here it runs on
    the site's existing `motion/react` scroll progress (no second animation
    library), each card is built from `timeline` records, and the stage is
    transparent so the ambient scene shows through. Geometry and plate styling live
    in `src/styles/stacking-cards.css`.
- **The plate is capped, not stretched to the stage.** `--stack-max-h` used to be
  the pinned screen, so every chapter was a full-height slab with a hole in it.
  It is now 420 px from 992 px and 520 px from 640 px (uncapped on phones) and
  the card is wider than tall (`--stack-ratio: 1.9` desktop), which measures
  798 × 420 px at 1280 px instead of 1039 × 670 px. `.stack-copy` lost the
  `margin-top: auto` that pinned the body to the foot — that auto margin was the
  412 px void between title and description — so the copy sits 24 px under the
  title, and `.stack-points` (`margin: auto 0 0`) takes the foot of the card so
  the chips close the plate. Measured with a 440 px cap: every card's padding box
  clears its content (tightest 56 px, the 14-chip 2025–2026 chapter), no clipping,
  no sideways overflow; the 420 px cap tightens that remaining clearance to ~36 px
  by the same measure. A plate carries no image — the certificate preview added
  on 2026-11-02 was reverted at the owner's request.
- **Transform only.** The demo's per-frame `clip-path` inset repainted the card
  every frame; the covered card now uses `y` / `scale` / `rotate` plus an
  opacity shade, so the whole stack is compositor work. Reduced motion comes
  from `useHydratedReducedMotion()`, never motion's `useReducedMotion()`.
- **`position: sticky` needs a non-scrolling wrapper.** `Layout` used
  `overflow-x-hidden`, whose computed `overflow-y: auto` made it a scroll
  container and silently killed the pin (measured: stage top −1382 px halfway
  through the track). It is `overflow-x-clip` now — the same clipping, no
  scrollport. Keep it that way before adding another sticky section, and
  remember `body { overflow-x: hidden }` still owns sideways overflow of the
  page as a whole.
- Verified in the preview at 1280 / 768 / 375 px: the stage pins at `top: 0`
  for the whole track, the counter's tick jump lands on `sectionTop +
travel × i / (n − 1)` exactly, every plate's copy fits its own height
  (`needs ≤ has` measured per card, including the 14-chip 2025–2026 entry), and
  `documentElement` has no sideways overflow.

## Echo headline

`src/components/ui/EchoHeadline.tsx` is the home page's one-word statement:
"Systems" grows a 3D slab of its own copies, a trail of echoes fading into the
navy room. CSS in `src/styles/echo-headline.css`; the component only writes
`--eh-*` on the track.

- **`compact` is the home page's mode (2026-11-02).** It used to run as a
  full-screen 300vh scrub section between the tools ribbon and the case studies,
  which meant a whole viewport of scroll for one word. It is now the header of the
  `#work` section, directly above the featured card: `compact` drops the scrub
  track and the scroll hint, sizes everything from one `--eh-size`
  (`clamp(56px, 12vw, 132px)`) and plays `onEnter` once, so the same slab, fonts
  and echo depth hold at heading scale. Measured in the preview: 230 px tall at
  1272 px and 106 px at 375 px, and the echoes reach a few pixels past the word's
  box — that is why the compact root is `overflow: visible` while the full
  variant keeps `overflow: clip`.
- **The header sits on `SectionHeading`'s grid (2026-11-03).** Its `<header>` carries the same
  `mb-10 md:mb-14` rhythm, its subtitle uses the same `max-w-3xl` copy column (it was `max-w-2xl`,
  672 px against the section's 768 px), and the featured card has no top margin of its own — the
  old `mt-10` wrapper collapsed into the header margin and became a second source of truth.
  Measured in the preview after the change: header bottom → card top 56 px at 1280 px and 40 px at
  375 px, the same gap every `SectionHeading` section uses, with no sideways overflow.

- **Adapted from the supplied demo, not copied.** It ran on GSAP + ScrollTrigger
  with a `#ebebe9` page and Switzer; here the scroll progress and its smoothing
  spring are motion's (`useScroll` + `useSpring`, no second animation library),
  the slab speaks in `--font-serif`, and the echoes mix toward `--background`
  instead of probing the DOM for a painted ground (the site has one dark room).
- **The tall track is a class, not markup.** `eh-is-scrub` (300vh) is added
  after mount, so the SSR pass and reduced motion both render one plain headline
  in a single screen. Keep the root on `overflow: clip` — `hidden` computes
  `overflow-y: auto`, makes a scroll container and kills the sticky stage.
- **Verified in the preview**: the track is 3× the viewport, the stage pins at
  `top: 0` for the whole pass, `--eh-reach` runs 0 → 1 with the echoes hidden at
  rest, the farthest echo projects to ~0.55 of the word, and there is no
  sideways overflow at 1167 / 982 / 375 px.

## Project showcase (home Ecosystem archive)

`src/components/ui/project-showcase.tsx` is the homepage "Ecosystem" section: one
row per `ecosystemProjects` record (name, real description, real status, link to its
`/projects/<slug>` page) with a floating preview that follows the cursor on desktop.
Adapted from the 21st.dev "ProjectShowcase" demo.

- **One screenshot asset per project.** `Project.screenshot` (plus `imageAlt`) is the only
  visual asset a project has, and `ui/ProjectShot.tsx` is the only component that paints
  it. Every surface reads that one field: the `ProjectCard` thumbnail (16:10), the showcase
  preview (3:2), the `CaseStudyRow` media panel (16:10 + caption strip), the `ProjectModal`
  hero (16:9), the project page hero (16:9), the curtain slider and the feature spotlight.
  Adding a project means adding its record and its file — never a second, hand-assigned
  image per placement. `Project.screenshot` is a **required** field: every record publishes one
  asset, so `ProjectShot` always paints and no caller carries a typographic plate fallback
  (the plate branches were removed from the showcase, case study, card, modal, project hero,
  curtain slider and spotlight on 2026-11-02).
- **Two kinds of asset share `public/projects/`, told apart by format.** Live-site captures
  are `*.webp`; bespoke illustrations are `previews/<slug>.svg`. Eight projects publish a
  capture (Gradr, SiteScout AI, Scholara, CritiqueFlow, The Neon Rush, Horizon Motorsports,
  DevOS, TabZen), each 1200×630 WebP (~20–40 KB) so no surface depends on the live site at
  runtime. Capture at 1600×840 CSS at `deviceScaleFactor: 2` with the Playwright image, then
  resize to 1200×630, or at 1440×756 and resize the same way. Pick the frame that shows the
  product itself (Gradr's Career Command Center, SiteScout's discovery dashboard, CritiqueFlow's
  dashboard, DevOS/TabZen's workspace, Neon Rush's mode grid), not a blind top-left crop.
  **Fitting follows the asset, in `ProjectShot` only** (2026-11-02): a live capture fills the
  frame with `object-cover object-top` so each composition's subject stays in frame, while a
  `previews/*.svg` illustration — a finished composition that reaches its bottom margin — is
  `object-contain object-center`, because a 16:9 frame used to cut the artwork's bottom off. The
  image is never stretched (`max-h-full max-w-full` plus the frame's own aspect ratio), and
  `fit` is the one override. Typographic plates from `src/lib/plate.ts` render in frames of every
  ratio (16:10 rail, 4:3 drawer poster, 1:1 drawer card, fixed-height dialog cells), so their copy
  sits in a centred safe box (x 380–1220, y 186–862 of 1600×1000) that every crop from 16:9 to
  about 5:6 keeps visible: the title wraps to at most two lines instead of running off the side.
  The rail's and drawer's plate frames are owned by `src/styles/annnimate-theme.css` (16:10 +
  contain), never by the vendored pack CSS.
- **Live URLs are owner-confirmed; the domain is not the project.** Gradr is
  `https://gradr.me` (the AI career platform — `gradr.xyz` is an unrelated card-grading site),
  ClientFlow OS is `https://clientflowos.base44.app`, and SiteScout AI is
  `https://sitescout-ai.base44.app`. `gradr.me` currently fails DNSSEC validation
  (`No DNSKEY matches DS RRs`), so validating resolvers cannot reach it; capture it with
  Chromium's `--host-resolver-rules=MAP gradr.me <A record>`. Fix the domain's DNSSEC before
  promoting the URL anywhere it matters.
- **The other fifteen projects have bespoke artwork, never a faked screenshot.**
  Stack Up, COGNOS, ClientFlow OS and AI for Students are login-gated with no public product
  surface (their `/` redirects to a Base44 login form); TerraCart, Home ServeAI, JARVIS,
  GemLab, Security Camera System, Currency Converter, GesturePlay, Watch Walkie Talkie,
  ConversaCore AI, Arabica AI Chat and NeuroTac AI publish no live URL. Each one has its own
  1200×800 SVG in `public/projects/previews/`, with a composition of its own — a resume sheet
  and ATS dial, a streak calendar, an inline sustainability read, a pipeline board, an idea
  graph, a lesson path, a service map, a radial listening field, three persona columns, a
  camera feed with a detection box, stacked currency panels, a hand-landmark skeleton, a
  watch/phone pair, a model router, mirrored bilingual conversations, a scored tic tac toe
  board. They abstract the product from its README and record (they are illustrations, not
  interface claims) and keep the navy/blue/gold palette. Keep each composition distinct: do
  not add a seventeenth project by copying another's layout and swapping the title.
- **`og:image` stays raster.** `src/routes/projects.$slug.tsx` only advertises a `screenshot`
  as the share card when it is not an `.svg`, so artwork routes fall back to the generated
  `og/projects` image. Browsers render the SVGs fine; social scrapers do not.
- **The right-hand column is `projectMeta()`**: the completion year when the record
  publishes one (`endDate`/`startDate`; the four featured projects do), otherwise the
  project's real `status`. Ecosystem records publish no dates, so they show status —
  do not invent years to fill the column.
- **One rAF loop, refs only.** The demo kept the cursor in React state and used it as
  the effect dependency, which restarted the loop on every pointer move and re-rendered
  the whole list. Here `pointermove` writes a ref, and a single loop — started when a
  row becomes active, cancelled on leave — lerps toward it and writes `transform`
  directly. Row hover/focus is React state; the pointer never is.
- **The preview is portalled to `<body>`.** `.page-enter` on an ancestor carries a
  transform, and a transformed ancestor becomes the containing block for
  `position: fixed`; inside the section the preview resolved against that box and sat
  ~6 700 px off-screen while scrolled. Verified: with the portal the preview tracks the
  cursor, clamps inside the viewport at the bottom-right corner, and hides on leave.
- **Touch and reduced motion.** The preview is `hidden md:block` and only opens for
  `pointerType === "mouse"`, so phones get large tappable rows and no hover dependency.
  Plates cross-fade with `opacity`/`scale` only (no `filter: blur()`, no per-frame
  layout reads); under `prefers-reduced-motion` the transitions are off and the preview
  jumps straight to the target via `useHydratedReducedMotion()`.
- **Keyboard.** A focused row docks the preview at the right edge of the viewport,
  vertically aligned with that row. Verify with a real `focusin` — a programmatic
  `element.focus()` alone does not fire React's delegated handler in the headless
  harness and reads as a false negative.
- Verified in the preview at 1280 / 375 px: 15 rows with correct `/projects/<slug>`
  hrefs, hover and keyboard previews, screenshot switching, viewport clamping, hiding on
  leave, no console errors, no failed requests, no sideways overflow. Re-verified
  2026-11-02 after the plate fallback was removed: rows 1/5/10 showed
  `sitescout-ai.webp`, `horizon-motorsports.webp` and `previews/home-serveai.svg` (each
  1200 px wide, `object-fit: cover`, preview opacity 1 → 0 on leave, 0 console errors).

## The ambient background

The background is **one leaned wall of drifting tiles**: the React Bits GridMotion component hanging
in a single perspective over a near-black navy room. There is no canvas and no WebGL anywhere on
the site. The React Bits Silk and Particles shaders were removed on 2026-10-31 (a lost WebGL
context composited as an opaque light plate and washed the page out); the 2D mote canvas that
replaced them was removed on 2026-11-01, and the hand-built three-plane CSS 3D scene that replaced
_that_ gave way to the tile wall on 2026-11-01 — its slabs, cube and rings resolved at inconsistent
perceived depths, because three hand-tuned `translateZ` planes never agreed on one horizon.

- `src/components/ui/AmbientLayers.tsx` is the mount point only; the scene lives in
  `src/components/ui/background/SceneBackground.tsx` and its stylesheet in `src/styles/scene-3d.css`
  (imported from `src/styles.css`). Back to front: `.scene-base` (a `#070c17 → #03060c` room lit
  from above) → `.scene-bloom-blue` / `.scene-bloom-gold` → `.scene-grid` (the GridMotion wall,
  styles in `src/styles/grid-motion.css`) → `.scene-vignette` → `.ambient-grain`.
- **The depth is one perspective and one lean.** The tile plane is turned (`angle`) and leaned back
  (`tilt`), and the wall is sized from the rotated bounds of its own box, so it recedes the same way
  at every viewport height — which is what the old three-plane scene could not do. Rows drift in
  alternating directions (`direction="alternate"`), and the tiles nearest the cursor lift out of
  `dim` through each tile's `--spot` custom property. Tile words come from
  `src/data/sceneTiles.ts`: real project names only, never invented brands.
- **The wall re-draws on every page load.** `SCENE_PROJECT_POOL` is the whole
  `allProjects` set (23 records, deduplicated by slug), and `lib/scene-selection.ts`
  draws 12 of them — shuffled, then taken one per `category` lane so a draw spans
  products, AI tools, utilities and experiments instead of the same flagships.
  Nothing is hardcoded and nothing is saved permanently: the draw runs in
  `SceneBackground`'s mount effect (client-only, so SSR and hydration never
  disagree — the plane is `opacity: 0` until the client loop fades it in), and
  `lib/scene-selection.ts` caches the draw for the life of the document. That
  cache matters: `Layout` (and with it the scene) remounts on every client-side
  route change, so without it each navigation reshuffled the wall and rebuilt
  every tile. `sessionStorage` holds only the previous draw's signature so two
  consecutive loads cannot show the same wall. The tiled wall still repeats names by design —
  the sample size is what stops it repeating the same handful.
- **One rAF loop, no React state.** `reactbits/GridMotion.tsx` writes each row's `transform` and
  each lit tile's `--spot` per frame, measures the root box only on mount/resize (a
  `getBoundingClientRect()` inside the loop was a forced layout after the previous frame's
  writes), skips every tile that is already dark while the pointer is away, stops when the tab is
  hidden, and stops entirely when the wall scrolls out of view. Only `pointerType === "mouse"` drives parallax — do not gate the
  listener on `(pointer: fine)`, which is false in embedded and automated browsers. Verify by
  dispatching a `PointerEvent("pointermove")` and reading a tile's `--spot` (measured: 10 tiles
  lit at the viewport centre).
- **Budget:** no `backdrop-filter`, no `filter: blur()`, no canvas, and no permanent `will-change`.
  Every animation is `transform` / `opacity` on the compositor: the two blooms drift on CSS
  keyframes and the wall is the only JavaScript on the layer.
- **The wall is a lit surface, not a stack of panels (2026-11-02).** Tile faces are near-invisible
  on purpose: three-stop fills at ~0.5 alpha with one lit top edge and one hairline ring
  (`grid-motion.css`), so what reads is the grid and the names rather than tiled slabs behind the
  copy. Eight rows of 2:1 tiles (`rows={8}`, `aspectRatio={2}`, lean eased to 28°) replaced six
  1.8:1 slabs at 30°, `ProjectTile`'s label offsets/rotations are halved, and its nine-tile rhythm
  carries two display names instead of three. The room lost its third gradient (one overhead cone,
  one warm right edge, one low wash) and the wall's mask is a single elliptical
  `radial-gradient` — the old two intersected linear masks left a visible corner.
- Mobile (`max-width: 767px`) keeps the same room with the wall dropped to `opacity: 0.56` (from
  `0.7`). `prefers-reduced-motion` stops the blooms, and GridMotion paints exactly one static
  frame — no rAF loop, no pointer listeners; `scripts/a11y-keyboard-motion.cjs` asserts "no
  animation is running" and "ambient light drift is off" on every route, so run it after touching
  the scene.
- **Do not reintroduce a WebGL background without testing the sandbox preview.** Both vendored
  React Bits shaders (Silk, Particles) create a WebGL2 context whose cleanup calls
  `WEBGL_lose_context.loseContext()`; when the context is lost, headless Chrome composites the
  canvas as an opaque light plate and the whole page washes out (measured: mean luminance 110
  against the near-black scene base). If a canvas layer is ever wanted again, check
  `canvas.getContext("webgl2").isContextLost()` in the preview before shipping it.
- The React Bits registry stays declared in `components.json` (`@react-bits`, no API key), and
  `src/components/reactbits/` is its vendoring location — it holds `GlareHover.tsx` and
  `GridMotion.tsx` (`DotField.tsx` was removed with the WebGL background; see "React Bits" below).
  21st.dev fetches go through the CLI, which
  authenticates with `API_KEY_21ST` delivered to the `web` service — see
  `docs/21ST_DEV_INTEGRATION.md` for the command.
- The marquee brand marks come from Logo.dev when a token is configured (`theme=dark`, so
  GitHub/X/Next/Vercel arrive light-on-dark instead of near-black), and fall back to the
  vendored `currentColor` masks. Every brand the ribbon names has an official mark now:
  Base44 publishes an app icon but no vector, so `public/brands/base44.png` (its own
  marketing asset) is the offline fallback rather than a Lucide glyph.

## Brand marks and verified credentials

- `src/data/brands.ts` is the only brand registry: a name as the content writes it (`"Python"`,
  `"Framer Motion"`, `"FIRST LEGO League UAE …"`) maps to an official mark. Marks are the official
  monochrome SVGs vendored in `public/brands/` (Simple Icons, CC0) and painted with `currentColor`
  through a CSS mask, so they are same-origin, cached, tint-less until hovered and correct on both
  light and dark surfaces. Do not add a name to the registry that the portfolio content does not
  mention.
- `BrandLogo` (`src/components/ui/BrandLogo.tsx`) sizes every mark explicitly, so a missing or
  failed logo can never shift layout. Social profiles render through `SocialMark`
  (`src/components/ui/SocialMark.tsx`), which resolves a social id to the same registry, so the
  footer, header, About/Contact lists, "Find Me Online" and the "Built with …" attribution all
  show official platform marks instead of Lucide icons. Only brands with no official mark at all
  (Tkinter, Objective-C, C#, LEGO) still use the Lucide glyph from `tech-icons.tsx`.
- Every mark renders in one fixed slot and `src/data/brandOptics.ts` holds the measurement that
  balances the artwork inside it — equal boxes alone let a full-bleed tile (Claude, Base44,
  TypeScript, Tailwind) read much heavier than a glyph sharing the slot with transparent margin.
  The tables record what each mark actually _shows_: the visible artwork's bounding box and the
  fraction of the canvas it paints, both measured **against the pill surface** (rasterise the file,
  composite it on the navy pill, take the bounds of what differs — not the alpha bounds, which call
  a near-black tile "100 % ink"). **One** formula then turns those numbers into a scale:
  `weight = clamp((0.55 / coverage) ** 0.34, 0.86, 1)` trims dense artwork, `air = clamp(0.95 /
√(w × h), 0.9, 1)` gives a full-bleed mark its margin back, and the visible long side becomes
  `0.60 × weight × air` of the slot. In the ribbon's 18 px slot that is 8.8 px for a solid tile and
  ~10.4 px for glyph art: one optical size, deliberately smaller in _extent_ for the heavier
  artwork. It is the only sizing rule on the site — add a new brand by measuring its artwork, never
  by hand-tuning a scale to taste — and the scale is capped at 1, so no mark is enlarged past its
  own slot. Measuring only the alpha bounds is what let the 2026-10 build set every mark to ~10.7 px
  and still show Claude, Base44, Lovable, GitHub and ChatGPT as the biggest marks in every pill.
- **Two tables, one formula.** Logo.dev does not crop consistently, so `brandOptics.ts` keeps
  `INK` (the vendored `/public/brands/*.svg`, whose alpha bounds _are_ their visible bounds) and
  `REMOTE_INK` (per domain, measured at `?size=128&retina=true&theme=dark`) and runs the same
  formula over both. Artwork missing from either table gets the shared `0.6` target span, which is
  why a new brand without measurements reads too large — measure it and add it.
- **Re-measured 2026-11-01 against the rendered ribbon, this time on what the artwork shows.**
  Every mark sat at 10.5–11.3 px in the 18 px slot, yet Claude, Base44, Lovable, GitHub and ChatGPT
  still dominated their pills: Logo.dev serves all five edge to edge, and Claude/Lovable/Base44 as
  an opaque tile that paints the whole slot, so equal extent is _not_ equal weight. Re-measuring all
  54 remote domains by compositing each file on the pill surface produced the current rule (visible
  bbox + visible coverage, `0.60 × weight × air`). Rendered in the ribbon that is 8.8 px for a solid
  tile (Claude 8.8, Base44 9.6, Lovable 9.1) and 10.3–10.8 px for glyph art (GitHub 10.4, ChatGPT
  10.3, Python 10.4, React 10.8), with Supabase's glyph — previously trapped inside an invisible
  near-black tile and rendering at 6.1 px — now at 10.8 px. Verify by measuring the rendered mark
  (`getBoundingClientRect()` on it, which already includes `--brand-scale`), never by reading the
  table.
- **Do not hand-tune a scale to make one brand match its neighbours; fix the measurement.** A
  near-black tile (Supabase, `8,8,8`) is invisible on the pill, so its ink is the glyph on it
  (0.59 × 0.61, coverage 0.15), not the canvas. Alpha-based measurement called that tile full ink
  and shrank the glyph to a third of its neighbours.
- **Same brand, two sources.** When Logo.dev serves a different artwork than the vendored file the
  two renders differ by design — Claude especially (the vendored file is a thin outline, Logo.dev
  serves a solid coral tile), so the two paths give it different scales. Both land in the same
  optical band; equalising them by hand would break the one-rule contract.
- **The fallback has to survive a blocked network.** With `img.logo.dev` blocked (a tracker
  blocker, offline, exhausted quota) the request fails before React has attached `onError`, so
  the error was lost and the mark stayed a blank image: measured 167 blank marks on `/`. The
  `useEffect` in `BrandLogo` now checks the element on mount and attaches its own `error`
  listener when it is still loading — same measurement now gives 0 blank marks and 194 vendored
  masks. Keep that effect; removing it silently brings the blank logos back for anyone blocking
  Logo.dev.
- Mark _sizes_ stay uniform inside a collection, too: the ribbon's headline chips keep their gold
  edge but use the same 18 px mark slot, padding and pill box as every other chip, and the "Find Me
  Online" and Contact rows render GitHub at the same size as the platforms below it. Chip/icon
  sizes are chosen per group in the component, never per brand.
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
- The four featured project slugs are Gradr, Stack Up, TerraCart and ClientFlow OS; every other
  record forms the ecosystem grid. `SiteScout AI` (added 2026-11-02) came from the owner's
  confirmed URL list and its own live site rather than the source site — verify it is published
  there before treating it as source-confirmed like the rest.
- Certificates are the source's 34 gallery entries with the same titles, issuers, dates, categories
  and file names.
- `/blog` publishes nothing unless an admin writes a post — the source shows "No posts yet".
- **MUN awards are owner-confirmed, and narrower than the inputs claimed.** Andrew has won no
  MUN award other than **Verbal Commendation** — never Honourable Mention, Best Position Paper,
  Best Resolution, Outstanding Delegate or Best Delegate. `munResults` (portfolio), `cv.mun` and
  `cv.munHighlights` (CV, and therefore the PDF/DOCX and `/api/cv/*`) carry exactly that award
  for all three conferences (Novara MUN 2026, IHS UNSummit 2026, IHSMUN 2025). `cv.mun` holds one
  entry per role and not every entry carries an award: Novara MUN 2026 appears twice, as Delegate
  (UNSC, Russia, Verbal Commendation) and as Secretariat (Head of Admins), both July 2026 — never
  merge the two or attach the award to the secretariat entry. The supplied CV
  PDFs and an older website pass claimed more; `docs/cv/MASTER_CV_CONFLICTS.md` §1 and §10 record
  the correction. Do not reintroduce a second award, and never count a committee, portfolio,
  resolution or participation as an award.
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

## Master CV deliverables

- `docs/cv/` holds the two committed deliverables
  (`Andrew_Mathews_Kalathil_Master_CV.pdf` and `.docx`), the audit of the ten
  supplied CV documents (`MASTER_CV_SOURCE_AUDIT.md`) and the open questions
  (`MASTER_CV_CONFLICTS.md`). Regenerate both from `src/data/cv.ts` — the same
  source `/api/cv/pdf` and `/api/cv/docx` serve:

  ```sh
  docker compose -f docker-compose.base44.yml exec -T web \
    bunx tsx scripts/generate-master-cv.ts
  ```

- Verify a layout change by rendering the PDF pages and measuring its text
  boxes (margins, page break, overlapping line boxes, trailing white space), not
  by comparing extracted text with `cv.ts`. `paragraph()` in `src/lib/cv/pdf.ts`
  draws its first line `0.72 × leading` below the cursor, so a heading drawn
  with `drawText` needs the cursor dropped before the paragraph that follows it
  or the two line boxes overlap.
- `docs/EMAIL_DELIVERY.md` records why contact-form mail is stored but not
  delivered while the Resend account is in testing mode, and the single
  configuration change needed once a sending domain is verified. Do not send
  repeated test messages.

## Public data layer and the editorial pages

The site is also a structured public source. Everything below is generated from the same
`src/data` modules the pages render, so a content change reaches the pages, the résumé files and
the API together.

```sh
docker compose -f docker-compose.base44.yml exec -T web \
  bunx tsx scripts/generate-public-data.ts      # also `bun run data:generate`, and part of predev/prebuild
```

- Writes 32 files into `public/`: `data/v1/index.json`, `profile.json`, `projects.json`,
  `projects/<slug>.json` (one per project), `recognition.json`, `experience.json`,
  `resources.json`, `faq.json`, plus `llms.txt`, `llms-full.txt`, `agents.md`, `openapi.json`,
  `.well-known/api-catalog` and `sitemap.md`. Commit the output — the sandbox serves `public/`
  directly and skips `predev`.
- `src/data/publicApi.ts` is the endpoint registry: the generator, `/openapi.json` and the
  `/developers` page all read it, so the docs cannot list an endpoint that does not exist.
  `src/data/faq.ts` feeds both `/faq` and `faq.json`; `src/data/pressKit.ts` feeds `/press-kit`
  and `llms-full.txt`. Add a question or a bio there, never in the page.
- Verified in the sandbox: every endpoint answers `200` with `application/json`, `/llms.txt` and
  `/llms-full.txt` with `text/plain`, `/agents.md` and `/sitemap.md` with `text/markdown`, and an
  unknown `/data/v1/*.json` path with `404` plus an HTML body — so check the content type, not
  just the status, before parsing.
- `/.well-known/api-catalog` has no file extension, so nothing infers its type. Two things set it:
  a small Vite middleware in `vite.config.ts` (dev/preview) and `public/_headers` (Cloudflare
  Pages / `nitro deploy`). Nitro merges `public/_headers` into `.output/public/_headers`; keep
  both in sync if the path changes.
- Editorial routes added with the data layer: `/now`, `/press-kit`, `/faq`, `/colophon`,
  `/sitemap`, `/developers`. They are registered in `src/data/seo.ts` (so `sitemap.xml`, the OG
  images and the head tags pick them up), linked from the footer and the mobile sheet, and
  grouped on `/sitemap`. The desktop pill keeps its seven core links on purpose.
- `/story`, `/recognition`, `/experience` and `/capabilities` are **not** separate routes: their
  content already has a canonical home at `/journey`, `/achievements`, `/resume` + `/profile` and
  `/skills`. Adding a second page for the same facts would split the same content across two
  URLs. Extend the existing page instead.

## Identity and search visibility

The site is the searchable entity for one person, and its full indexed name is
**Andrew Mathews Kalathil** (published in running copy as "Andrew Mathews",
practice name "AndrewBuilds").

- `src/data/identity.ts` holds `FULL_NAME`, `SHORT_NAME`, `NAME_ALIASES`,
  `PERSON_DESCRIPTION` and `SOCIAL_PROFILES`; `src/data/seo.ts` re-exports the
  name as `SITE_NAME`/`AUTHOR` and builds the entity graph — `personJsonLd()`
  and `websiteJsonLd()` (rendered once in `src/routes/__root.tsx`),
  `profilePageJsonLd()` (on `/profile`), plus the per-route `WebPage` and
  `BreadcrumbList`. Every node shares the `#person` / `#website` `@id`s, so a
  crawler resolves one person and one site. Keep any new schema block
  referencing those ids rather than repeating the person inline.
- Every fact in the schema must also be visible on the page it describes: the
  name appears in the home intro and `<h1>`, `/about`, `/profile` and the press
  kit. Adding a `knowsAbout` term or an `affiliation` means publishing it on a
  page first — `nationality` and any employment claim are deliberately absent.
- `scripts/seo-regression.ts` fails if a route loses its Person or WebSite
  node, if `Person.name` drifts from `AUTHOR`, if `/profile` loses its
  `ProfilePage`, or if the homepage stops naming the author.
- `public/robots.txt` allows search **and** AI crawlers (GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, …) and disallows only `/admin`,
  `/auth` and `/404`. `src/data/seo.ts` is still the only source of route
  metadata for `sitemap.xml`, `og/` and `llms.txt`.
- **The share cards are drawn with fonts committed in the repo (2026-11-04).**
  `scripts/generate-og-images.ts` renders text through librsvg, which resolves
  families via fontconfig — and an image with no fonts at all turns every glyph
  into a tofu box, which is what every one of the 16 cards had become.
  `scripts/og-fonts/` now carries Sora and JetBrains Mono (SIL OFL, licence
  files alongside); the generator writes a fontconfig config pointing at them
  and, only when the host has no usable font, re-runs itself once in a child
  process that carries `FONTCONFIG_PATH` — librsvg reads that variable as it
  starts, so assigning `process.env` at runtime is too late (measured: still
  tofu). A host with fonts (CI, Cloudflare) builds exactly as before. Add a face
  by dropping its TTF in there and naming it in the SVG.
- `scripts/generate-sitemap.ts` writes `<lastmod>` from `git log -1` on each
  page's source files. A build host without git (the `web` container) reuses the
  previous sitemap's dates instead of stamping the build time, so the committed
  file stays stable; run it from a checkout with history (or `node:24` with the
  repo mounted) to refresh the dates.
- Project `<title>`s use `name | category by <full name>` and fall back to
  `name by <full name>` when that would pass 70 characters.

## What to check after a change

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/           # 200 + real HTML
curl -s 'http://localhost:8000/rest/v1/blog_posts?select=slug&limit=1'   # seeded rows
curl -s http://localhost:8000/auth/v1/health                             # GoTrue up
docker compose -f docker-compose.base44.yml logs web --tail 30           # build/runtime errors
```

Known non-blocking noise: TanStack warns that `inputValidator()` is deprecated.

### Static analysis gates

```sh
docker compose -f docker-compose.base44.yml exec -T web bunx eslint .          # 0 errors
docker compose -f docker-compose.base44.yml exec -T web bunx prettier --check . # clean
docker compose -f docker-compose.base44.yml exec -T web bunx tsc --noEmit -p tsconfig.json
```

`bun run lint` (eslint + `eslint-plugin-prettier`) and `bun run format:check` both
run in CI, so neither may be left dirty. `.prettierignore` keeps the gate honest:
the vendored `reactbits/` and `annnimate/` sources (kept byte-for-byte), the
`.claude/skills/` database and every file the `scripts/` generators rewrite
(`src/routeTree.gen.ts`, `public/data/`, `public/agents.md`, `public/llms*.txt`,
`public/openapi.json`, `public/sitemap.*`, `public/og/`) are excluded — formatting
those would be undone on the next regeneration and would dirty a re-download.

The `react-refresh/only-export-components` warnings (16, all in
`src/components/ui/`) are deliberate: those files export a small helper next to
their component, and splitting them for fast refresh is not worth the churn.

Type casts to the Supabase client live in one place, `src/lib/db-client.ts`
(`asDbClient` / `DbClient`), because the generated `requireSupabaseAuth` context
type does not match `SupabaseClient` in every query position. Use it instead of
`as any` in the admin server functions.

## Keyboard and reduced-motion checks

`scripts/a11y-keyboard-motion.cjs` is the keyboard + reduced-motion regression run. It drives a
real headless Chromium (the puppeteer image ships one; the sandbox host has no browser):

```sh
docker run --rm --user root --network host -v "$PWD:/repo" -w /repo \
  -e NODE_PATH=/home/pptruser/node_modules \
  -e PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
  ghcr.io/puppeteer/puppeteer:23.11.1 \
  node scripts/a11y-keyboard-motion.cjs http://localhost:3000
```

- `--user root` is required only because the sandbox checkout is root-owned; the image's default
  user cannot read the mount. `PUPPETEER_CACHE_DIR` points at the Chromium the image baked in.
- The script is CommonJS on purpose: ESM ignores `NODE_PATH` and puppeteer lives in the image's
  global `node_modules`.
- Per route (`/`, `/work`, `/resume`, `/achievements`, `/contact`) it asserts: the skip link is the
  first Tab stop **and Enter moves focus into `<main>`** (that needs `tabIndex={-1}` on `<main>`),
  every Tab stop is visible with a focus ring, Shift+Tab walks back, `Space`/`Enter` toggle a
  visible `aria-expanded` control, the mobile menu opens with `Space` and closes with `Escape`,
  and under `prefers-reduced-motion: reduce` the decorative canvas holds a single still frame (two
  pixel reads a moment apart must be identical), no animation runs, reveal wrappers are visible,
  keyboard traversal still works and **every visible text line still renders**.
- The text-parity check compares unique visible lines in `<main>` while ignoring `aria-hidden`
  decoration. It is what caught the marquee's reduced-motion chip cap (`nth-child(n + 16)`
  display:none) hiding tools; do not cap the static ribbon again.

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
- **A clipped reveal clips an inner wrapper, never the observed node.** Chrome reports a target whose
  own `clip-path` clips it to zero height as never intersecting, so `.reveal-mask` sitting on the
  observed element meant the reveal could never fire: every `SectionHeading` — the gold uppercase
  eyebrow, the serif title and the subtitle — stayed at `opacity: 0` / `inset(0 0 100%)` on every page
  (the "sections have no headers" report, 2026-11-02). `Reveal` now renders `reveal-mask` /
  `reveal-clip` on a child `div`, and `styles.css` resets the clip through
  `.reveal.is-revealed > .reveal-mask`. Verified in headless Chromium at 1078 px: all 10 home section
  headings reach `is-revealed` with opacity 1 while scrolling, and 390 px shows the headings with no
  sideways overflow.
- **Ticks draw themselves in (2026-11-04).** `ui/TickMark.tsx` wraps an existing check icon
  unchanged and observes its own wrapper with that same shared observer; the `.tick` block in
  `styles.css` walks the icon's own stroke in with `stroke-dashoffset` (100 → 0) while the mark
  settles from `scale(0.86)`, staggered 120 ms per item through `--tick-delay`. The settle uses the
  card layer's motion (`--ease-out-expo`, 0.45s lift, 0.3s fade), so a checklist and a `.lift-3d`
  card read as one system — see `docs/CARD_INTERACTIONS.md`. It fires once (the observer
  unobserves), and the text beside a tick is never hidden or delayed; reduced motion,
  `scripting: none` and print all show the tick already drawn. Wired into `CaseStudyRow` (the home
  highlights), `ProjectTimeline` (a completed milestone), `/resume`, and the two "What I built"
  feature lists — `ProjectModal` and `ProjectDetail`. `ProjectCard`'s list stays gold dots: it
  lives inside a collapsed `pop-panel`, so its ticks would reveal while the panel is closed and be
  spent before anyone opened it.
  Verified in the preview 2026-11-04: ticks start at opacity 0 / `100px` dashoffset and end at
  1 / 0 on a 120 ms cadence while the row text stayed at opacity 1, and `/projects/stack-up` +
  `/resume` serve the wrapper in SSR.
- **No `backdrop-filter` on sticky or repeated surfaces.** A blurred sticky header repaints the strip
  every scroll frame; `.glass`, `.sticker` and `.tape` use layered translucent gradients instead.
- **No `filter: blur()` light fields.** Ambient and hero glows are radial gradients whose falloff is
  the blur — a full-screen filter would be re-blurred each frame.
- **Never `will-change` at rest.** Only the marquee tracks and the parallax elements while they are
  on screen opt in; permanent hints on every card cost GPU memory.
- **Marquee is one CSS transform.** `TechMarquee` pauses via `data-paused` when the ribbon is
  off screen or the tab is hidden, and does no per-frame positioning in JS.
- **Hero cards drag with Pointer Events, and only one element paints the drag.** `HeroCardStack`
  writes the wrapper's `x`/`y` motion values directly (no React state per pointer move, so a drag
  costs one transform frame); `touch-action: pan-y` leaves a swipe to the page and a 170 ms hold
  picks the card up, after which a non-passive `touchmove` keeps the page still. Drag constraints
  are measured from the card's and the column's real rects at drag time and clamped there, so the
  card cannot leave the hero and a breakpoint change only pulls it back inside. The inner
  `.hero-card` carries the visual channels (rotate/tilt/scale) and has no CSS transform transition —
  that transition used to smooth (lag) every drag frame.
- **The background is DOM plus one rAF loop and no canvas.** The GridMotion wall writes a row
  `transform` and a tile `--spot` per frame and stops when it scrolls out of view; the blooms are
  CSS keyframes and the grain is an SVG-turbulence overlay. Nothing repaints: every moving part is
  a compositor transform.
- **The background never animates under reduced motion** — one static frame, no loop, no pointer
  listeners — and its pointer channel ignores every event that is not `pointerType === "mouse"`.
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

## React Bits and 21st.dev

The component registries, and exactly what was taken from each (2026-11-01).

- **Registry.** `components.json` declares `@react-bits` → `https://reactbits.dev/r/{name}.json`.
  The shadcn MCP server is not available in this environment, so components are installed by
  fetching that registry item and vendoring its `files[].content` into
  `src/components/reactbits/` — the same bytes the `shadcn add` path would write. The index is
  `https://reactbits.dev/r/registry.json`; item names carry the flavour suffix (`-TS-TW` = TypeScript +
  Tailwind, what this repo uses). Two are installed:

  | file                       | used by                                   | notes                                                                                                                                                      |
  | -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `reactbits/GlareHover.tsx` | `ui/HeroCardStack.tsx` (card media block) | gold sheen across the card face; hover sweeps a streak through it                                                                                          |
  | `reactbits/GridMotion.tsx` | `ui/background/SceneBackground.tsx`       | the ambient depth field; Tailwind strings replaced by `styles/grid-motion.css`, and it stops under reduced motion instead of looping to hold a still frame |

  `DotField.tsx` (the WebGL dot lattice) was removed with the CSS 3D background rebuild on
  2026-11-01; it is not referenced anywhere in `src/`.

- **Vendored files carry `// @ts-nocheck` plus a header comment.** Registry sources are written for
  a looser tsconfig than this repo's (`noUncheckedIndexedAccess`, index-signature access), so they
  fail `tsc --noEmit` as-is; the only other edit is stripping the permanent `will-change-transform`
  hint from `GlareHover`'s band. Re-fetching a component overwrites both — re-apply them.
- **No WebGL layer is mounted.** The old `DepthBackground` wrapper and its `DotField` lattice were
  removed on 2026-11-01. If one is ever wanted again it must be conditional (hardware renderer, no
  reduced motion), lazy, and unmounted on `webglcontextlost` — a lost context composites as an
  opaque plate over the page, which is the failure that washed the site out twice.
- **`ui/portfolio-gallery.tsx` is the first 21st.dev component vendored.** It was the
  homepage "Ecosystem" archive until 2026-11-01, when that section moved to
  `ui/project-showcase.tsx` (see "Project showcase (home Ecosystem archive)" below); the
  gallery stays in the library, unmounted, for a surface that wants the fan. It renders: 15 real `ecosystemProjects` fanned across one CSS
  perspective above `md` (middle highest, hovered/focused plate straightens, lifts and takes
  the top z-index), and a single snap-scrolling row below `md`. Two deliberate changes from
  the supplied demo: the cards are **typographic plates**, not images — the portfolio has
  never published a product screenshot, so nothing is faked — and the demo's
  `animate-marquee` (undefined here, four repeated copies of the same images) is gone. The
  fan's plate width is derived from the item count and the `overlap` prop
  (`--pg-card: min(240px, calc(100% / span))`), so adding a project re-fits the row instead
  of overflowing. The `/projects` page keeps the filterable `ProjectGrid`.
- **A plate lifts for keyboard users too, and the wiring is fussy.** The lift is React state, so
  focus must set it: `onFocusCapture` on the `motion.div` never fired (motion filters capture
  handlers — verified: Tab onto a plate left it in the fan, `z-index` and transform empty) and
  TanStack's `Link` carries its own `onFocus`. The handlers now sit on a plain `div` between them.
  Verify with **real keyboard input** (`page.keyboard.press('Tab')` in the puppeteer image): a
  programmatic `element.focus()` does move `document.activeElement` but React's delegated
  `onFocus` does not fire for it in this harness, so an automated `.focus()` check reports a false
  negative.
- **21st.dev works through the CLI now; there is still no MCP bridge.** `API_KEY_21ST` is declared
  in `.base44/environment.json` and reaches the `web` service via `/run/base44/app.env`, so
  `docker compose … exec -T web bunx --bun @21st-dev/cli@latest search "<query>"` returns results
  (verified 2026-11-01). Installed files are ordinary source once added, so restyle them to the
  navy/gold tokens and review the diff. `docs/21ST_DEV_INTEGRATION.md` records what was checked.
- **Every 21st.dev component follows `docs/21ST_DEV_PROTOCOL.md`.** Inspect the site first, place
  the component in an existing section rather than a new one, use real records and the navy/gold
  tokens, keep the performance budget, and verify it in the running preview at tablet and mobile
  before calling it done — applying the whole protocol in the same turn, without asking where it
  goes.

## Annnimate starter pack (2026-11-01)

The 17-component Animate.com/Annnimate starter pack (source:
`https://coastal-ivory-caejbxdk.edgeone.dev/`) is integrated into the portfolio. Read this before
touching any of it.

- **Where the code lives.** `src/components/annnimate/` holds the pack's own `.jsx` + `.css`,
  vendored as shipped (they are excluded from `tsc` via `src/types/annnimate.d.ts` and from ESLint
  by an ignore entry, the same treatment as `src/components/reactbits/`). Site-side adapters live
  in `src/components/ui/` (`PackAccordion`, `PortfolioCurtain`, `PortfolioRail`,
  `CertificateScale`, `SkillCloud`, `FeatureSpotlight`, `AsciiPlate`, `SiteIndexDrawer`); the
  palette and geometry overrides live in `src/styles/annnimate-theme.css`, imported from
  `src/styles.css`. Restyle there, never by hand-editing a component's demo CSS beyond the two
  mechanical edits below.
- **Mechanical edits only:** every `@font-face` Switzer block is stripped and the font stacks
  point at `var(--font-sans)`; `feature-dialog.jsx` takes an `actionHref` so the dialog's primary
  action can open `/projects/<slug>`, and its icon-only expand button carries
  `aria-label={"Open ${title} details"}`; `multi-level-drawer-menu.jsx` renders sub-links as
  anchors when the entry is `{ label, href }`, its hidden demo page uses a `<p>` instead of an
  `<h1>` (it is visually hidden, but `a11y:check` counts the tag, and two `<h1>`s failed `/sitemap`),
  and its demo page/logo are hidden by CSS. Any other change to a vendored file will be lost on a
  re-download.
- **GSAP is now a second animation library, deliberately scoped.** The pack runs on GSAP 3.15
  (`gsap` + `@gsap/react`), which is the only sane way to use 15 of its components. It is NOT a
  replacement for `motion/react`: existing entrance/scroll work stays where it is, and new
  site-native components should still use motion. Keep GSAP usage inside the vendored components
  and their adapters; do not start writing new GSAP site components. Build cost is ~114 KB gzip
  of the shared client chunk — do not add a third library.
- **`page-enter` must not fill forwards.** `.page-enter` animated with `both`, so the final
  `transform: none` keyframe still computed as `matrix(1,0,0,1,0,0)`, which made it the containing
  block for `position: fixed` descendants: the feature dialog opened at `top: -4377 px` (document
  coordinates 11 208 px). It is `backwards` now. Any fixed overlay rendered inside a route depends
  on that.
- **Placements.** Home: dual-scramble identity pill, elastic divider, `FeatureSpotlight` for Gradr,
  `SkillCloud` (28 real skills, links to `/skills`), `TextReveal` in the Dubai paragraph. Projects:
  curtain slider (four flagship records). Achievements: certificate rail (`ScaleSlider`, real
  thumbs), split-flap results board, pack accordion for certification groups, `ImageFlyIn` proof
  field, elastic divider, `TextReveal`. About: `TextReveal`, elastic divider, ASCII plate of the
  brand mark. Journey: process rail from the four build disciplines. Skills: rotating-words wheel.
  FAQ: pack accordion. Sitemap: two-panel drawer index with real routes.
- **`SkillCloud` no longer uses the pack's physics cloud (2026-11-02).** `MagneticTagCloud`
  positions every tag absolutely at `left/top: 50%` and tilts it at rest, and `.anm-cloud` set
  `overflow: visible` with a collapsed wrapper height — measured at 768 px, all 28 tags sat
  outside the wrapper's 48 px box and spilled over the focus-area cards, with the tilt growing
  into a 45° tumble on hover. `ui/SkillCloud.tsx` now renders the same 28 real skills (same order,
  same tone cycle, same `/skills` links) as plain pills in a flex-wrap list inside a padded,
  bordered panel. Do not re-mount `annnimate/magnetic-tag-cloud` here: a tag may never be
  absolutely positioned or rotated in this section. Verified at 768 / 375 / 1280 px: 0 tags
  outside the panel, 0 tag overlaps, 0 non-identity transforms, 8–10 px gaps, no clipped label,
  no sideways document overflow.
- **`EchoHeadline` and `StackingCards` stay native.** Both pack components were already adapted to
  motion/react in earlier sessions; replacing them with the GSAP originals would regress the
  journey stack and the home headline. `Pricing` is intentionally not mounted: the portfolio
  publishes no rates, and inventing tiers would break the content-source rule above.
- **Screenshots wherever a project is shown.** The curtain slider, the feature dialog tile and
  every other project surface render `Project.screenshot`; `src/lib/plate.ts` still builds the
  navy/gold typographic SVG data URIs used by the process rail, the drawer cards and the
  dialog's status sheet. Never point a pack image slot at a stock/CDN URL.
- **ASCII overlay is a rewrite, not a port.** The pack version needs three.js and a running
  shader; `src/components/ui/AsciiPlate.tsx` samples the image once into an offscreen grid and
  paints the glyphs onto one static canvas on mount/resize. Keeps the site's no-WebGL rule.
- **The feature dialog's sheet is hidden in CSS, not only by GSAP.** `feature-dialog.jsx` renders
  the whole Gradr sheet into the server HTML and only hides it from a GSAP `set()` on mount, so
  before hydration the sheet painted as a full-screen project overlay over whatever route was
  loading — the "project screen on the homepage" bug (fixed 2026-11-02). `annnimate-theme.css`
  pins the sheet's `.fdg_modal` wrapper to `visibility: hidden; opacity: 0` and shows it again
  while the stage carries `.is-open`; GSAP's inline autoAlpha takes over once it runs. Keep those
  two rules if the theme is ever rewritten. `ui/FeatureSpotlight.tsx` also releases the dialog's
  `body` scroll lock on unmount, because leaving the route while the sheet is open unmounts it
  before its close leg can unlock.
- **Reduced motion** is handled inside the pack components and by the theme's override block.
  Do not disable a component's internal check.
- Verified 2026-11-01 in the preview (1280 px): the home spotlight dialog opens in-viewport with
  the navy sheet, the split-flap board flips (`Techfest, 1st Place, Data Science` →
  `… 2nd Place, IoT`), the achievements accordion expands (`aria-expanded=true`, 256 px panel),
  the certificate rail mounts 34 cards at 368 px, the fly-in field mounts 10 images at 544 px,
  with zero console errors and no horizontal overflow. Not automatically verified in that session:
  the curtain slider's transition, the sitemap drawer's panels, the journey rail and the skills
  wheel (they render server-side and mount without errors; check them by hand before changing
  their styles).
