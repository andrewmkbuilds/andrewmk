# Andrew Mathews — Developer Portfolio

My personal developer portfolio. It brings together the software I build — AI systems, productivity tools, robotics and computer-vision projects — alongside my competition results, certificates and the story of how the work has progressed over time.

**Live site:** https://andrewmk.is-a.dev

## Overview

The portfolio is a place to explore what I actually build, not a résumé page. Visitors can:

- Browse every project, filter by technology or platform, and open a full case study for the larger ones
- Read deep-dives covering the problem, interface walkthrough, tech stack, engineering challenges and results
- Look through competition results, MUN awards and exhibitions, with certificates attached as proof
- Follow the journey timeline and read blog posts about projects and AI experiments
- Get in touch through the contact form

## Featured Projects

| Project           | Focus                                                                                                                     | Status                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Gradr**         | AI career accelerator — resume analysis, ATS scoring, AI mock interviews, job tracking and career analytics               | Building              |
| **Stack Up**      | Personal finance system with expense tracking, budgets, savings goals, streaks and analytics. The first product I shipped | Live                  |
| **TerraCart**     | AI shopping assistant that analyses products and surfaces more sustainable alternatives                                   | Developing            |
| **ClientFlow OS** | Unified system for clients, projects, conversations, payments, documents and workflow automation                          | In active development |

## Other Projects

| Project                    | Focus                                                                                              | Status     |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ---------- |
| **DevOS**                  | AI developer command center — tasks, focus sessions and project threads in one place               | Live       |
| **COGNOS**                 | AI cognitive system that captures raw thoughts, classifies them and maps connections between ideas | Live       |
| **TabZen**                 | Intelligent tab management: context grouping, AI summaries and lossless archiving                  | Live       |
| **AI for Students**        | Gamified platform for learning how to understand and use AI                                        | Live       |
| **Home ServeAI**           | Home services marketplace concept with smart matching and real-time tracking                       | Concept    |
| **JARVIS**                 | Voice AI assistant with spoken command handling, context memory and action execution               | Experiment |
| **GemLab**                 | Multi-persona AI chatbot environment (Friendly, Professional, Creative modes)                      | Built      |
| **Security Camera System** | Motion-activated recording with automatic recording management                                     | Built      |
| **GesturePlay**            | Rock, Paper, Scissors, Pencil played through webcam hand gestures                                  | Built      |
| **Watch Walkie Talkie**    | Push-to-talk voice communication between smartwatches and phones                                   | Concept    |
| **ConversaCore AI**        | Multi-model conversational platform with dynamic model selection and fallbacks                     | Built      |
| **Arabica AI Chat**        | Bilingual English–Arabic chat with translation and context-aware replies                           | Built      |
| **NeuroTac AI**            | Tic Tac Toe engine that evaluates board states and picks optimal moves                             | Built      |
| **Currency Converter**     | Desktop converter for 170+ currencies with live rates and offline fallback                         | Built      |
| **Horizon Motorsports**    | Digital home for a UAE-based racing team competing in FLL, Techfest and engineering competitions   | Active     |

## Technologies

Across the projects above:

- **Web:** React, TypeScript, Tailwind CSS, Framer Motion
- **AI:** LLM and AI APIs, Google Gemini API, NLP, embeddings, multi-model routing, AI summarisation and classification
- **Python:** Tkinter desktop apps, OpenCV, MediaPipe, Haar cascade classifiers, Pillow, threading
- **Mobile & cross-device:** Flutter, Android Studio, real-time audio streaming
- **Backend & data:** Postgres, row-level security, auth, file storage, server functions, graph data models
- **Payments & integrations:** Stripe, REST APIs, MCP integration
- **Browser:** browser extension APIs and content scripts
- **Build platforms:** Base44, Lovable

### This site

Built with TanStack Start (React, TypeScript, Vite), Tailwind CSS and Motion, with a Postgres backend for the blog and contact form.

## Achievements

**Competitions**

- 1st Place — Data Science, Techfest
- 2nd Place — IoT, Techfest
- 2nd Place — Space Tech, Group Techfest
- Innovation Award — FLL UAE, Dubai Regional
- 2nd Place — Math Expo, "Math & Me"
- 3rd Place — Shot Put, Annual Athletic Meet

**Model United Nations**

- IHSMUN 2025 — FIA · Verbal Commendation
- Novara MUN 2026 — UNSC · Verbal Commendation
- IHS UNSummit 2026 — FIA · Verbal Commendation

Verbal Commendation is the only MUN award received. No other MUN award is claimed.

**Areas:** Techfest, Data Science, IoT, Space Tech, Coding, Robotics, FLL, STEM Racing / F1 in Schools

**Exhibitions:** robotics exhibitions, school exhibitions, TechFest, STEM and engineering demonstrations, and other project showcases.

## Certificates

The portfolio includes a Certificates & Proof section with the credentials, competition certificates and milestone documents behind the achievements above. Each certificate can be opened full size, and results link directly to the document that verifies them.

## Portfolio

https://andrewmk.is-a.dev

## Socials

| Platform  | Link                                      |
| --------- | ----------------------------------------- |
| GitHub    | https://github.com/andrewmkbuilds         |
| Lovable   | https://lovable.dev/@andrewbuilds         |
| Base44    | https://app.base44.com/@andrewmkbuilds    |
| X         | https://x.com/Andrew444884                |
| Instagram | https://www.instagram.com/andrewmkbuilds/ |
| Linktree  | https://linktr.ee/andrewmkbuilds          |

## Search, structured data and discovery

The site is built to be resolved as **one person**, not as a set of unrelated pages: a single
canonical name, one entity graph shared by every route, one sitemap, and a set of
machine-readable files that search engines and AI answer engines can read directly.

### Canonical identity

| What                    | Value                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Indexed full name       | **Andrew Mathews Kalathil** (`FULL_NAME`)                                       |
| Name in running copy    | Andrew Mathews (`SHORT_NAME`)                                                   |
| Practice name / aliases | AndrewBuilds, andrewmkbuilds (`NAME_ALIASES`)                                   |
| Location                | Dubai, United Arab Emirates                                                     |
| Canonical site          | https://andrewmk.is-a.dev (`CUSTOM_DOMAIN_URL`, overridable by `VITE_SITE_URL`) |

`src/data/identity.ts` is the only place these strings live. `src/data/seo.ts` re-exports them
as `AUTHOR` / `SITE_NAME` and derives every page title, canonical URL, share card and
machine-readable file from them, so the name cannot drift between a `<title>`, a JSON-LD node
and `llms.txt`.

### Structured data (JSON-LD)

Two nodes render once, in the `head()` of `src/routes/__root.tsx`, so whichever URL a crawler
lands on resolves the same entities:

| Node                                | `@id`                  | Built by                    | Rendered on      |
| ----------------------------------- | ---------------------- | --------------------------- | ---------------- |
| `Person`                            | `/#person`             | `personJsonLd()`            | every route      |
| `WebSite`                           | `/#website`            | `websiteJsonLd()`           | every route      |
| `ProfilePage`                       | `/profile#profilepage` | `profilePageJsonLd()`       | `/profile`       |
| `WebPage`                           | `<url>#webpage`        | `webPageJsonLd()`           | every route      |
| `BreadcrumbList`                    | —                      | `breadcrumbJsonLd()`        | every route      |
| `ItemList` of `SoftwareApplication` | —                      | `src/lib/project-schema.ts` | `/`, `/projects` |
| `Article` / `BlogPosting`           | —                      | blog route head             | `/blog/<slug>`   |

Page-level nodes reference the shared ids (`{"@id": "…/#person"}`) instead of restating the
person, so a crawler sees one person and one site rather than a new node per page. Every fact
in the schema is also published as visible copy — `knowsAbout` and `jobTitle` map to `/about`,
`/skills` and `/profile`, `affiliation` to the education section, `sameAs` to the social links,
`alternateName` to the press kit. Nothing is inferred, and a schema property is only added
after its fact is visible on a page.

### Discovery files

Everything below is a static asset in `public/` (or generated into it at build time) and is
served from the site root, with its content type pinned in `public/_headers`:

| Path                          | Purpose                                                                                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/robots.txt`                 | Allows search engines **and** AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot); disallows only `/admin`, `/auth` and `/404`; points at the sitemap                           |
| `/sitemap.xml`                | Written by `scripts/generate-sitemap.ts` from `indexableRoutes` plus the project pages. `<lastmod>` comes from git history, `/blog` is listed only once an article is published, and the document is validated against the sitemap 0.9 protocol before it is written |
| `/sitemap.md`                 | Markdown mirror of the site structure for humans and agents                                                                                                                                                                                                          |
| `/llms.txt`, `/llms-full.txt` | Curated index and full text corpus for AI assistants                                                                                                                                                                                                                 |
| `/agents.md`                  | Instructions for AI systems on how to describe the site and its author                                                                                                                                                                                               |
| `/openapi.json`               | Contract for the read-only JSON API                                                                                                                                                                                                                                  |
| `/data/v1/*.json`             | Public read-only JSON API (profile, projects, experience, FAQ), regenerated on every build                                                                                                                                                                           |
| `/.well-known/api-catalog`    | RFC 9727 linkset pointing at the API and its docs                                                                                                                                                                                                                    |
| `/.well-known/security.txt`   | RFC 9116 security contact                                                                                                                                                                                                                                            |
| `/site.webmanifest`           | Installable-app manifest: name, description, theme colour, icons                                                                                                                                                                                                     |
| `/<indexnow-key>.txt`         | IndexNow ownership proof. The key is public by design, not a secret                                                                                                                                                                                                  |
| `/og-image.png`, `/og/*.png`  | Per-route social share cards, generated by `scripts/generate-og-images.ts`                                                                                                                                                                                           |

### Verifying

```sh
npm run seo:regression                                 # a running server (default :8080)
npm run seo:regression -- --base=http://localhost:3000 # dev / staging server
npm run seo:regression -- --source=dist                # prerendered build output
npm run seo:indexnow -- --dry-run                      # what would be announced to Bing
```

`scripts/seo-regression.ts` walks every route registered in `src/data/seo.ts` and fails when a
page loses its unique title (≤ 70 chars) or description, its single self-referencing canonical
and `og:url`, its reachable `og:image`, its `WebPage` / `BreadcrumbList` JSON-LD, its **`Person`**
node (name equal to `AUTHOR`, an `@id`, non-empty `sameAs`) or its **`WebSite`** node; when
`/profile` loses its `ProfilePage`; when the project `ItemList` loses an item, a description or
its stack; or when `sitemap.xml` / `robots.txt` stop covering the public routes.
`scripts/seo-check.ts` runs the canonical, metadata and og:image half of that against `dist/`.

Adding a page means registering it in `src/data/seo.ts` — that one entry feeds the head tags,
the sitemap, the share card and the regression suite. A page that only restates facts already
published elsewhere should extend the existing route instead.

## Development

This portfolio is an evolving personal project rather than a finished deliverable — projects, case studies, certificates and blog posts are added as the work happens, and the design and structure change along with it.

Running it locally requires Node.js and npm:

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```
