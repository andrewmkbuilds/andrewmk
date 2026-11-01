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
  the card (scaled, deeper shadow) and the card **stays where it is dropped**. Position
  lives on the outer wrapper's `x`/`y` motion values and nothing else ever writes them;
  the inner `.hero-card` owns only the look (entry animation, drag bank/tilt, hover lift).
  Do not switch this back to motion's `drag` prop: `drag` shares its motion values with
  the `animate` prop, and the entrance animation (`y: 0`) replayed on the next re-render
  (the lazy background mounts ~0.9 s in) and slid every dropped card home.
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

## Journey chapter stack

`src/components/ui/StackingCards.tsx` is the `/journey` narrative: one
typographic plate per `timeline` entry (7 today) that hold the screen while you
scroll — each new card slides up over the last, which sinks, shrinks, tilts and
darkens underneath it. The counter under the plate shows the chapter and its
ticks jump to any of them (pointer, Enter/Space) via `aria-current`; the plain
list of the same cards renders instead of the stack under reduced motion.

- **Adapted from the supplied "StackingCards" demo, not copied.** It ran on GSAP
  + ScrollTrigger with stock photography and an `#ebebe9` stage; here it runs on
  the site's existing `motion/react` scroll progress (no second animation
  library), each card is built from `timeline` records (the portfolio publishes
  no product screenshots), and the stage is transparent so the ambient scene
  shows through. Geometry and plate styling live in
  `src/styles/stacking-cards.css`; the plate is sized from the pinned stage so
  it can never grow taller than the screen.
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

`src/components/ui/EchoHeadline.tsx` is the home page's one-word statement
between the tools ribbon and the case studies: "Systems" grows a 3D slab of its
own copies as you scroll, a trail of echoes fading into the navy room. CSS in
`src/styles/echo-headline.css`; the component only writes `--eh-*` on the track.

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

- **Real screenshots, no stock imagery.** A record with `featuredImage` renders that image
  inside the preview (`object-cover`, cropped to the 300×200 frame); the rest keep the
  typographic plate built from the record itself — status, name and stack, on the same
  primary/gold gradient and `bg-grid` as `CaseStudyRow` and the gallery plates.
- **The screenshots are captures of the live sites, vendored in `public/projects/`.**
  Six projects publish one (Scholara, CritiqueFlow, The Neon Rush, Horizon Motorsports,
  DevOS, TabZen), each 1200×630 WebP (~20–40 KB) so the preview never depends on the live
  site. Capture at 1440×756 CSS at `deviceScaleFactor: 2` with the puppeteer image, then
  resize to 1200×630 (`fit: cover`, Lanczos) — the same aspect the project page already
  declares for `og:image`, which reuses `featuredImage`. Pick the frame that shows the
  product itself (CritiqueFlow's `/dashboard`, DevOS/TabZen's workspace, Neon Rush's mode
  grid), not a blind top-left crop. Stack Up and COGNOS are login-gated, AI for Students is
  unpublished, and Gradr/TerraCart/ClientFlow OS publish no live URL — those stay on plates
  rather than getting a fake or login-screen asset.
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
  hrefs, hover and keyboard previews, plate switching, viewport clamping, hiding on
  leave, no console errors, no failed requests, no sideways overflow.

## The ambient background

The background is **one leaned wall of drifting tiles**: the React Bits GridMotion component hanging
in a single perspective over a near-black navy room. There is no canvas and no WebGL anywhere on
the site. The React Bits Silk and Particles shaders were removed on 2026-10-31 (a lost WebGL
context composited as an opaque light plate and washed the page out); the 2D mote canvas that
replaced them was removed on 2026-11-01, and the hand-built three-plane CSS 3D scene that replaced
*that* gave way to the tile wall on 2026-11-01 — its slabs, cube and rings resolved at inconsistent
perceived depths, because three hand-tuned `translateZ` planes never agreed on one horizon.

- `src/components/ui/AmbientLayers.tsx` is the mount point only; the scene lives in
  `src/components/ui/background/SceneBackground.tsx` and its stylesheet in `src/styles/scene-3d.css`
  (imported from `src/styles.css`). Back to front: `.scene-base` (a `#080d19 → #050914` room lit
  from above) → `.scene-bloom-blue` / `.scene-bloom-gold` → `.scene-grid` (the GridMotion wall,
  styles in `src/styles/grid-motion.css`) → `.scene-vignette` → `.ambient-grain`.
- **The depth is one perspective and one lean.** The tile plane is turned (`angle`) and leaned back
  (`tilt`), and the wall is sized from the rotated bounds of its own box, so it recedes the same way
  at every viewport height — which is what the old three-plane scene could not do. Rows drift in
  alternating directions (`direction="alternate"`), and the tiles nearest the cursor lift out of
  `dim` through each tile's `--spot` custom property. Tile words come from
  `src/data/sceneTiles.ts`: real project and skill names only, never invented brands.
- **One rAF loop, no React state.** `reactbits/GridMotion.tsx` writes each row's `transform` and
  each lit tile's `--spot` per frame, reads the root rect once per frame, and stops entirely when
  the wall scrolls out of view. Only `pointerType === "mouse"` drives parallax — do not gate the
  listener on `(pointer: fine)`, which is false in embedded and automated browsers. Verify by
  dispatching a `PointerEvent("pointermove")` and reading a tile's `--spot` (measured: 10 tiles
  lit at the viewport centre).
- **Budget:** no `backdrop-filter`, no `filter: blur()`, no canvas, and no permanent `will-change`.
  Every animation is `transform` / `opacity` on the compositor: the two blooms drift on CSS
  keyframes and the wall is the only JavaScript on the layer.
- Mobile (`max-width: 767px`) keeps the same room with the wall dropped to `opacity: 0.6` (from
  `0.72`). `prefers-reduced-motion` stops the blooms, and GridMotion paints exactly one static
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
  The tables record what each mark actually *shows*: the visible artwork's bounding box and the
  fraction of the canvas it paints, both measured **against the pill surface** (rasterise the file,
  composite it on the navy pill, take the bounds of what differs — not the alpha bounds, which call
  a near-black tile "100 % ink"). **One** formula then turns those numbers into a scale:
  `weight = clamp((0.55 / coverage) ** 0.34, 0.86, 1)` trims dense artwork, `air = clamp(0.95 /
  √(w × h), 0.9, 1)` gives a full-bleed mark its margin back, and the visible long side becomes
  `0.60 × weight × air` of the slot. In the ribbon's 18 px slot that is 8.8 px for a solid tile and
  ~10.4 px for glyph art: one optical size, deliberately smaller in *extent* for the heavier
  artwork. It is the only sizing rule on the site — add a new brand by measuring its artwork, never
  by hand-tuning a scale to taste — and the scale is capped at 1, so no mark is enlarged past its
  own slot. Measuring only the alpha bounds is what let the 2026-10 build set every mark to ~10.7 px
  and still show Claude, Base44, Lovable, GitHub and ChatGPT as the biggest marks in every pill.
- **Two tables, one formula.** Logo.dev does not crop consistently, so `brandOptics.ts` keeps
  `INK` (the vendored `/public/brands/*.svg`, whose alpha bounds *are* their visible bounds) and
  `REMOTE_INK` (per domain, measured at `?size=128&retina=true&theme=dark`) and runs the same
  formula over both. Artwork missing from either table gets the shared `0.6` target span, which is
  why a new brand without measurements reads too large — measure it and add it.
- **Re-measured 2026-11-01 against the rendered ribbon, this time on what the artwork shows.**
  Every mark sat at 10.5–11.3 px in the 18 px slot, yet Claude, Base44, Lovable, GitHub and ChatGPT
  still dominated their pills: Logo.dev serves all five edge to edge, and Claude/Lovable/Base44 as
  an opaque tile that paints the whole slot, so equal extent is *not* equal weight. Re-measuring all
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
- Mark *sizes* stay uniform inside a collection, too: the ribbon's headline chips keep their gold
  edge and larger padding but use the same mark size as every other chip, and the "Find Me Online"
  and Contact rows render GitHub at the same size as the platforms below it. Chip/icon sizes are
  chosen per group in the component, never per brand.
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

## What to check after a change

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/           # 200 + real HTML
curl -s 'http://localhost:8000/rest/v1/blog_posts?select=slug&limit=1'   # seeded rows
curl -s http://localhost:8000/auth/v1/health                             # GoTrue up
docker compose -f docker-compose.base44.yml logs web --tail 30           # build/runtime errors
```

Known non-blocking noise: TanStack warns that `inputValidator()` is deprecated.

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

  | file | used by | notes |
  | ---- | ------- | ----- |
  | `reactbits/GlareHover.tsx` | `ui/HeroCardStack.tsx` (card media block) | gold sheen across the card face; hover sweeps a streak through it |
  | `reactbits/GridMotion.tsx` | `ui/background/SceneBackground.tsx` | the ambient depth field; Tailwind strings replaced by `styles/grid-motion.css`, and it stops under reduced motion instead of looping to hold a still frame |

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
- **Two mechanical edits only:** every `@font-face` Switzer block is stripped and the font stacks
  point at `var(--font-sans)`; `feature-dialog.jsx` takes an `actionHref` so the dialog's primary
  action can open `/projects/<slug>`; `multi-level-drawer-menu.jsx` renders sub-links as anchors
  when the entry is `{ label, href }`, and its demo page/logo are hidden by CSS. Any other change
  to a vendored file will be lost on a re-download.
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
- **`EchoHeadline` and `StackingCards` stay native.** Both pack components were already adapted to
  motion/react in earlier sessions; replacing them with the GSAP originals would regress the
  journey stack and the home headline. `Pricing` is intentionally not mounted: the portfolio
  publishes no rates, and inventing tiers would break the content-source rule above.
- **No screenshots, so plates are generated.** `src/lib/plate.ts` builds a navy/gold typographic
  SVG data URI per record; the curtain slider, feature dialog, process rail and drawer cards use
  it. Never point a pack image slot at a stock/CDN URL.
- **ASCII overlay is a rewrite, not a port.** The pack version needs three.js and a running
  shader; `src/components/ui/AsciiPlate.tsx` samples the image once into an offscreen grid and
  paints the glyphs onto one static canvas on mount/resize. Keeps the site's no-WebGL rule.
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
