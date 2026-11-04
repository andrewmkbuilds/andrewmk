# Card interaction system

The one interactive layer every card on the site shares: a pointer-tracked
light, a travelling border arc, a single sheen, optional floating lights, a
vertical lift — and the tick reveal that makes a feature list feel like the same
system.

Nothing here rotates a card, measures layout per frame, or runs React state per
pointer move. Everything is paint-only (transform / opacity / custom
properties), and everything is opt-in through a class.

## Files

| file                               | role                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `src/components/ui/CardFx.tsx`     | `CardFxTracker` (one delegated pointer listener) and `CardSparkles`         |
| `src/components/layout/Layout.tsx` | mounts `<CardFxTracker />` once, so a route change never re-binds it        |
| `src/components/ui/TickMark.tsx`   | wraps an existing check icon and schedules its draw-on once                 |
| `src/styles.css`                   | `.spotlight`, `.edge-glow`, `.fx-sheen`, `.fx-sparkle`, `.lift-3d`, `.tick` |

## Class contract

Add the classes to the card element itself — they are utilities, not a wrapper
component:

```tsx
<article className="surface spotlight edge-glow lift-3d group relative isolate overflow-hidden rounded-xl">
  <span className="fx-sheen" aria-hidden="true" />
  <CardSparkles /> {/* featured cards only */}…
</article>
```

| class        | what it draws                                                       | needs                                 |
| ------------ | ------------------------------------------------------------------- | ------------------------------------- |
| `spotlight`  | blue + gold radial light at `--mx` / `--my`; fades in on hover      | a positioned element                  |
| `edge-glow`  | blue→gold conic arc masked to the 1px border, travels while hovered | `position: relative`, a border radius |
| `fx-sheen`   | one light streak across the face per hover                          | the card to carry `group`             |
| `fx-sparkle` | slow 2–3px lights in fixed positions                                | rendered by `CardSparkles`            |
| `lift-3d`    | translate-only elevation (`-5px`) plus a deeper shadow              | `transform`/`box-shadow` free         |

`--mx` / `--my` default to the centre, so touch devices and keyboard focus get
the same light with no cursor. Touch gets a static light (`@media (hover: none)`)
and an `:active` press instead of hover.

## How the pointer channel works

`CardFxTracker` mounts once. One passive `pointermove` listener finds the
`.spotlight` ancestor under the cursor, measures that card's rect on entry (not
per event), and writes `--mx` / `--my` inside a single `requestAnimationFrame`.
The cached rect is dropped on `scroll` / `resize`, so page movement never leaves
the light pointing at an old position.

Every event that is not `pointerType === "mouse"` is ignored. Do **not** gate
the listener on `(pointer: fine)` — that query is false in embedded and
automated browsers, where the light would then never follow a real mouse.

The border arc is a `@property --fx-angle` keyframe: `animation-play-state` is
`paused` at rest and `running` while hovered, so nothing repaints when the
pointer is elsewhere and the arc never jumps back to its start.

## Tick reveal

`<TickMark index={i}>` wraps an existing icon unchanged — the glyph, size and
colour are whatever the caller passes — and only schedules the paint:

```tsx
<TickMark className="mt-0.5" index={i}>
  <Check className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
</TickMark>
```

- It observes its own wrapper with the shared `Reveal` `IntersectionObserver`
  (one class toggle per tick, no scroll handler) and unobserves after the first
  intersection, so scrolling back never replays it.
- `.tick` walks the icon's own stroke with `stroke-dashoffset` (100 → 0) and
  settles the mark from `scale(0.86)`.
- Timing matches the card layer: `--ease-out-expo`, 0.45s of travel, 0.3s fade,
  0.5s stroke, and one `--tick-delay` step of **120 ms** per item in the list.
- Surrounding text is never hidden or delayed, so a list stays readable without
  JavaScript animation.
- `prefers-reduced-motion`, `@media (scripting: none)` and the print block all
  show the tick already drawn.

Wired into `CaseStudyRow` (home highlights), `ProjectTimeline` (a completed
milestone), `/resume`, and the two "What I built" feature lists in
`ProjectModal` and `ProjectDetail`. `ProjectCard`'s list keeps gold dots on
purpose: it sits inside a collapsed `pop-panel`, and a scroll-triggered tick
would fire while the panel is closed and be spent before it is opened.

Keep the index inside its list — pass the map's `i`, never a page-wide counter,
so each list starts its stagger at zero.

## Accessibility and the budget

- Decoration is `aria-hidden`; the card keeps its own label and link.
- Reduced motion stops the arc animation, hides the sheen, freezes the sparkles
  and removes every transition; the light itself stays at a static position.
- No `will-change` at rest, no `filter: blur()`, no `backdrop-filter`, no
  per-frame layout reads, and no React render per pointer move.
- Verify changes at desktop and mobile, then check that a mouse move writes
  `--mx` / `--my` and a touch move leaves them unset.

## Verification

```sh
# types, lint, formatting (CI runs all three)
docker compose -f docker-compose.base44.yml exec -T web bunx tsc --noEmit -p tsconfig.json
docker compose -f docker-compose.base44.yml exec -T web bunx eslint .
docker compose -f docker-compose.base44.yml exec -T web bunx prettier --check .

# reduced motion + keyboard regression
docker run --rm --user root --network host -v "$PWD:/repo" -w /repo \
  -e NODE_PATH=/home/pptruser/node_modules \
  -e PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
  ghcr.io/puppeteer/puppeteer:23.11.1 \
  node scripts/a11y-keyboard-motion.cjs http://localhost:3000
```

In the preview, dispatch a `new PointerEvent("pointermove")` over a card and read
its `--mx` / `--my`; scroll a feature list into view and read the ticks' opacity
and `stroke-dashoffset` before and after (0 → 1, `100px` → `0`).
