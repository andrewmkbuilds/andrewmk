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
  `aria-hidden`) and supplies the shared environment: a near-black navy room with three
  CSS 3D planes (distant field, glass architecture, foreground rim light), a perspective
  floor, a vignette and grain. Sections with their own background sit on top of it.
  All of it is CSS — no canvas, no WebGL (see "The ambient background" below).
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

## The ambient background

The background is a **CSS 3D scene**: three parallax planes of geometric objects hanging in one
perspective space over a near-black navy room. There is no canvas and no WebGL anywhere on the
site. The React Bits Silk and Particles shaders were removed on 2026-10-31 (a lost WebGL context
composited as an opaque light plate and washed the page out); the 2D mote canvas that replaced
them was removed on 2026-11-01 in favour of the 3D scene below.

- `src/components/ui/AmbientLayers.tsx` is the mount point only; the scene lives in
  `src/components/ui/background/SceneBackground.tsx` and its stylesheet in `src/styles/scene-3d.css`
  (imported from `src/styles.css`). Back to front: `.scene-base` (a `#080d19 → #050914` room lit
  from above) → `.scene-space` (one 1200 px perspective) → `.scene-far` / `.scene-mid` /
  `.scene-near` planes → `.scene-floor` + `.scene-horizon` → `.scene-vignette` → `.ambient-grain`.
- **The depth is real perspective, not opacity.** Each plane is a `translateZ` at a different
  depth (−760 / −260 / +60 px), so the renderer scales it for real: objects in the distant plane
  measure ~0.61 of their CSS size, the midground ~0.82, the foreground ~1.05. Objects are solid-
  looking because they are shaded, not because they are faint: spheres carry a radial body plus
  inset terminator shadows, the cube is five actual faces, slabs and platforms are lit glass with
  a 1 px top edge, and the gold rim is a lit border arc. Keep that shading when adding an object.
- **Parallax is two custom properties.** `background/useSceneDepth.ts` writes `--px` / `--py`
  (pointer, −1…1, eased with a self-stopping rAF) and `--sy` (scroll, clamped) on the scene root;
  each plane composes them with its own `--pdx` / `--pdy` / `--sds` factors, so the near plane
  travels ~4× further than the distant one. Only `pointerType === "mouse"` moves it — do not gate
  the listener on `(pointer: fine)`, which is false in embedded and automated browsers, and verify
  by reading the planes' computed transforms before and after a `PointerEvent("pointermove")`.
- **Budget:** no `backdrop-filter`, no `filter: blur()`, no canvas. Every animation is
  `transform` / `translate` / `rotate` / `opacity` on its own element, so the whole scene is
  compositor work. The floating objects animate the individual `translate` property rather than
  `transform`, which keeps each object's placement rotation intact.
- Mobile (`max-width: 767px`) keeps the same room static and lighter: floats stop, the right-hand
  slab, the small slab, the second beam, the second platform and the left shard are dropped, and
  the floor and dust drop in opacity. `prefers-reduced-motion` stops every scene animation and the
  driver writes no parallax at all; `scripts/a11y-keyboard-motion.cjs` asserts this on every route
  ("no animation is running", "ambient light drift is off") — run it after touching the scene.
- **Do not reintroduce a WebGL background without testing the sandbox preview.** Both vendored
  React Bits shaders (Silk, Particles) create a WebGL2 context whose cleanup calls
  `WEBGL_lose_context.loseContext()`; when the context is lost, headless Chrome composites the
  canvas as an opaque light plate and the whole page washes out (measured: mean luminance 110
  against the near-black scene base). If a canvas layer is ever wanted again, check
  `canvas.getContext("webgl2").isContextLost()` in the preview before shipping it.
- The React Bits registry stays declared in `components.json` (`@react-bits`, no API key), and
  `src/components/reactbits/` is its vendoring location — it now holds only `GlareHover.tsx`
  (`DotField.tsx` was removed with the WebGL background; see "React Bits" below). 21st.dev
  fetches go through the CLI, which
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
  balances the artwork inside it — equal boxes alone let a full-canvas glyph (Base44, OpenAI,
  Claude, Lovable) read larger than a flat or outline mark. The table records each vendored file's
  ink bounding box and painted coverage (rasterise the file, take the alpha bounds); **one** formula
  then turns those numbers into a scale: the ink's long side is fitted to `0.8 × density` of the
  slot, where `density = clamp((0.34 / coverage) ** 0.3, 0.78, 1)`. Equal bounding boxes were not
  enough on their own — a solid, full-bleed tile (Base44, ChatGPT/OpenAI, Lovable, Claude,
  TypeScript) still read larger than a thin glyph, which is what density corrects. It is the only
  sizing rule on the site — add a new brand by measuring its artwork, never by hand-tuning a scale
  to taste — and the scale is capped at 1, so no mark is enlarged past its own slot (the previous
  1.1 ceiling let an inset mark such as Rust render ~40% larger than everything else).
- **Two tables, one formula.** Logo.dev does not crop consistently, so `brandOptics.ts` keeps
  `INK` (the vendored `/public/brands/*.svg`, measured from the file) and `REMOTE_INK` (per
  domain, measured at `?size=128&retina=true&theme=dark`) and runs the same formula over both.
  Artwork missing from either table gets the shared `0.8` target span, which is why a new brand
  without measurements reads too large — measure it and add it.
- **Audited 2026-11-01 with rendered pixels, not the tables.** A headless Chromium pass over `/`,
  `/projects`, `/skills`, `/achievements`, `/journey`, `/about`, `/contact` and `/resume` at 1440
  and 390 px rasterised every mark's actual asset, took its alpha bounds and divided by the slot
  it renders in. Every mark on the site lands between 0.62 and 0.80 of its slot, which is the
  design band; ink sits within ~1 px of the slot centre for the Logo.dev images and the vendored
  masks alike. The named check: Base44 **0.653**, ChatGPT/OpenAI 0.742, Lovable 0.627, Claude
  0.624 in the same 18 px slots — a 1.19× spread that is coverage doing its job (the solid Base44,
  Lovable and Claude tiles pull in, the open OpenAI spiral pushes out), not a sizing error. There
  is **no 0.88 Base44 scale anywhere in the code**: the coverage formula has always produced
  0.653, and Base44 renders within 5 % of the other two solid tiles, so it stays.
- **Per-domain entries were current except one.** Re-measuring all 55 brand/source pairs flagged
  only `python-pillow.org`, whose real ink is 0.833 × 0.958 at coverage 0.522: the stale entry
  (`0.84 × 0.85`) made Pillow render at 0.80 of its badge slot instead of 0.70. Corrected. Do not
  hand-tune a scale to make one brand match its neighbours; fix the measurement.
- **Same brand, two sources.** When Logo.dev serves a different artwork than the vendored file the
  two renders differ by design — GitHub 0.735/0.742, Lovable 0.627/0.631, Base44 0.653/0.652,
  TypeScript 0.624/0.624, OpenAI 0.742/0.773, Claude 0.624/0.757 (the vendored file is a thin
  outline, Logo.dev serves the solid tile). Both stay inside the band; equalising them by hand
  would break the one-rule contract.
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
- **The background is a pure-CSS 3D scene with no canvas.** Three perspective planes of shaded
  geometry plus an SVG-turbulence grain overlay; the only JavaScript is one pointer listener and
  the shared scroll subscription, which write two custom properties. Nothing repaints: every
  moving part animates a transform on the compositor.
- **The background parallax never runs under reduced motion**, and its pointer channel ignores
  every event that is not `pointerType === "mouse"`, so phones and tablets only get the scroll drift.
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
  Tailwind, what this repo uses). One is installed:

  | file | used by | notes |
  | ---- | ------- | ----- |
  | `reactbits/GlareHover.tsx` | `ui/HeroCardStack.tsx` (card media block) | gold sheen across the card face; hover sweeps a streak through it |

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
- **21st.dev works through the CLI now; there is still no MCP bridge.** `API_KEY_21ST` is declared
  in `.base44/environment.json` and reaches the `web` service via `/run/base44/app.env`, so
  `docker compose … exec -T web bunx --bun @21st-dev/cli@latest search "<query>"` returns results
  (verified 2026-11-01). No 21st.dev component is vendored yet; installed files are ordinary source
  once added, so restyle them to the navy/gold tokens and review the diff.
  `docs/21ST_DEV_INTEGRATION.md` records what was checked.
