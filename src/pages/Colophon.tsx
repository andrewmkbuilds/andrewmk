import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Colophon: how this site is actually built.
 *
 * Everything below is taken from the repository itself (package.json, the
 * stylesheet's token block, the ambient-layer components and AGENTS.md) — no
 * tool, service or practice is named that the project does not use.
 */

const stack: { title: string; items: string[] }[] = [
  {
    title: "Application",
    items: [
      "TanStack Start (file-based routes, server-side rendering)",
      "React 19 + TypeScript",
      "Vite",
      "Bun for installs and scripts",
    ],
  },
  {
    title: "Interface",
    items: [
      "Tailwind CSS v4 with a token layer in src/styles.css",
      "Radix UI primitives for accordions, dialogs, menus and sheets",
      "Lucide icons",
      "Motion for the few places that need spring physics",
      "Vendored React Bits components (glare sheen, dot field)",
    ],
  },
  {
    title: "Type and colour",
    items: [
      "Sora — headings",
      "Inter — body text",
      "JetBrains Mono — labels, metadata, code",
      "Instrument Serif — editorial emphasis and pull quotes",
      "Navy base with a gold rim light; tokens for elevation and motion",
    ],
  },
  {
    title: "Data and services",
    items: [
      "Supabase (Postgres, PostgREST, GoTrue) for the contact form and content",
      "Resend for contact-form email, when a sender domain is configured",
      "pdf-lib and docx to generate the résumé files",
      "Static JSON generated from the same content as the pages",
    ],
  },
];

const decisions: { title: string; body: string }[] = [
  {
    title: "One physical space, not stacked panels",
    body: "The background is a CSS-painted room — navy base, a cold key light, a gold rim light, a perspective floor and a vignette — with a single 2D canvas of drifting motes. No WebGL shader runs behind the content, so the page renders identically on a software rasteriser and on a GPU.",
  },
  {
    title: "Motion that is cheap and optional",
    body: "Scroll reveals are one shared IntersectionObserver adding a class; the parallax primitive animates transforms only and switches off under prefers-reduced-motion; the header reads scroll through a single batched listener. Nothing animates width, height or blur.",
  },
  {
    title: "The paper layer",
    body: "Taped cards, stickers and hand-drawn arrows are CSS utilities (paper, tape, sticker, sketch), not images, so they stay crisp, themeable and lightweight. The hero card position is preserved by the browser, so a card stays exactly where it is dropped.",
  },
  {
    title: "Accessible by default",
    body: "Every route is reachable by keyboard, the skip link moves focus into the page, focus rings are never removed, and the draggable cards respond to pointer, touch and reduced-motion preferences.",
  },
];

export default function Colophon() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Colophon
            </p>
            <h1 className="headline-3d text-4xl font-bold leading-[1.08] text-balance text-foreground md:text-5xl">
              How this site is{" "}
              <em className="serif-display mark-underline italic text-gold">
                made
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The tools, the design system and the reasoning behind both.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {stack.map((group, i) => (
              <Reveal key={group.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <SectionHeading label="Decisions" title="Why it works *this* way" />
            <div className="space-y-10">
              {decisions.map((decision, i) => (
                <Reveal
                  key={decision.title}
                  delay={i * 50}
                  className="max-w-3xl"
                >
                  <h3 className="text-xl font-semibold text-foreground">
                    {decision.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {decision.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Content
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Everything about Andrew on this site comes from one set of
                content modules under src/data — the pages, the résumé files and
                the public JSON API are all generated from them. The same
                content is published for machines at{" "}
                <Link to="/developers" className="link-underline text-gold">
                  /developers
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Build and host
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The site is a server-rendered TanStack Start application built
                with Vite; the public address comes from the site URL configured
                in src/data/seo.ts. There is no analytics or advertising script
                on any page, and the only form on the site (contact) stores the
                message it receives.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
