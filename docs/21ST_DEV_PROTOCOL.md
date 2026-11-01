# 21st.dev integration protocol

The standing rule for every 21st.dev component, component-library implementation or integration
prompt that arrives in this repo. It is applied automatically — not only when someone remembers to
ask for it. `AGENTS.md` ("React Bits and 21st.dev") points here; `docs/21ST_DEV_INTEGRATION.md`
records how to fetch a component at all.

The component enhances the product. The product never adapts around a generic demo.

## 1. Inspect before writing code

- Map the site first: `src/pages/`, `src/components/layout/`, `src/components/ui/`,
  `src/components/resume/`, `src/data/`.
- Read the supplied component and say what it is actually for, not what it looks like.
- Find every existing place it could belong, and the existing component that already does that
  job (`ProjectGrid`, `PortfolioGallery`, `TechMarquee`, `HeroCardStack`, `AchievementCard`,
  `CaseStudyRow`, `ContactForm`, …).
- Read the design system before styling: tokens and utilities in `src/styles.css`, the depth
  ladder (`--elev-1..3`), `.glass` / `.headline-3d` / `.serif-display` / `.mark-underline`, the
  ambient CSS 3D scene, `SectionHeading`, `Reveal`, `Tilt3D`, `Parallax`.
- Identify the real data, assets, routes, dependencies and utilities it needs — `src/data/*`
  (content source of truth: `https://andrewmk.is-a.dev`), `src/data/brandOptics.ts` for marks,
  `@/lib/router-compat` for links, `motion/react` (already installed), the shadcn primitives in
  `src/components/ui/`.
- Read `AGENTS.md`, `package.json`, `components.json` and this file.

## 2. Choose the placement, do not invent one

| component kind        | existing home in this repo                                          |
| --------------------- | ------------------------------------------------------------------- |
| project gallery       | home "Ecosystem" section (`PortfolioGallery`) / `/projects` grid     |
| hero                  | `src/pages/Home.tsx` hero with `HeroCardStack`                      |
| proof / statistics    | `/achievements`, `/journey`, `src/data/portfolio.ts` aggregates      |
| navigation            | `src/components/layout/Header.tsx`, mobile sheet                     |
| feature / tool grids  | `/skills`, `TechMarquee`, `src/data/toolMarquee.ts`                  |
| contact               | `/contact` + `ContactForm`                                           |
| background effect     | `AmbientLayers` / `src/components/ui/background/SceneBackground.tsx` |
| cards / showcases     | the section whose own records the cards would show                   |

Upgrade an existing section instead of adding a parallel one. Never duplicate a section, a
project listing, or a CTA, and never add a standalone demo page (the repo already documents why
`/story`, `/recognition`, `/experience` and `/capabilities` do not exist — extend the canonical
page instead). If two placements are viable, take the one that serves the reader most.

## 3. Adapt to this project

Keep: TanStack Start + SSR, TypeScript strictness, the existing Tailwind config and CSS
variables, the shadcn component layer, `@/lib/router-compat` routing, CSS-first motion, the
existing state patterns. Reuse installed dependencies (`motion`, `lucide-react`, `clsx`/
`tailwind-merge`); do not add a framework, a router, a second animation library, or a duplicated
helper. New reusable UI goes in `src/components/ui/` in the repo's own style, with a header
comment that says what was changed from the supplied code and why.

## 4. Real content only

No demo text, names, prices, dates or statistics survive. Use `src/data/*` records, existing
routes, real dates, real brand assets from `public/brands/` (sized by `brandOptics.ts`, never by
hand), and the real content source of truth. Demo/stock imagery is never substituted in to fill
space — the portfolio publishes no product screenshots, so cards are built from project records.
Do not fabricate anything the source site does not publish. MUN awards are Verbal Commendation
only.

## 5. Preserve the identity

Navy/gold palette, Instrument Serif for editorial emphasis, mono uppercase eyebrows, the
elevation ladder, the existing radii and hover language. Restyle the component to the tokens
rather than importing its own palette, and do not restyle the sections around it.

## 6. Complete functionality

Port props, state, event handling, animation, assets, routing and keyframes properly. Compatibility
bugs are fixed, not copied (registry code often assumes a looser tsconfig and an undefined
`animate-*` keyframe — see `portfolio-gallery.tsx`'s header). Every visible control does something
real; no decorative fake interactivity.

## 7. Responsive and accessible

Desktop, tablet (982 px) and mobile. No horizontal overflow, nothing clipped, no hover-only
affordances on touch, keyboard reachable, `focus-ring` on every control, real `aria-label`s,
min 44 px touch targets, readable type, and `prefers-reduced-motion` honoured — use
`useHydratedReducedMotion()` (never motion's `useReducedMotion()`, which breaks hydration).

## 8. Performance

The budget in `AGENTS.md` ("Performance budget") applies unchanged: no per-frame React state,
transform/opacity only, no `backdrop-filter` on repeated surfaces, no `filter: blur()`, no
`will-change` at rest, no canvas/WebGL background, one scroll listener via `src/lib/scroll.ts`,
listeners and animation frames cleaned up.

## 9. Verification is mandatory

Compiling is not done. Before reporting the integration as working:

```sh
docker compose -f docker-compose.base44.yml exec -T web bunx tsc --noEmit -p tsconfig.json
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/<route>
```

Then in the real preview: open the route, confirm the real content renders, drive every
interaction the component adds (gesture **and** post-gesture assertion in one script), check
tablet and mobile widths for overflow, check console errors and failed requests, and confirm the
surrounding sections and navigation still work. A mounted component or an existing CSS rule is
not evidence that an effect is visible.

## 10. Execution

Apply all of the above without being asked to continue, and without asking where the component
goes unless the placement is genuinely ambiguous. Finish the integration — file, placement, data,
styling, responsiveness, verification — in the same turn, and keep every existing working
behaviour intact.
