import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/lib/router-compat";
import { Download, Printer, ExternalLink } from "lucide-react";
import {
  PROFILE_TITLE,
  SCHOOL,
  allProjects,
  competitionResults,
  currentlyBuilding,
  munResults,
  principles,
  skillGroups,
  socialLinks,
  timeline,
} from "@/data/portfolio";
import { certificateDateLabel, certificatesByRecency } from "@/data/certificates";

function Rule() {
  return <span aria-hidden="true" className="divider-gold mt-3 block h-px w-full" />;
}

function Block({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 first:pt-0">
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
          <span aria-hidden="true" className="hairline-gold inline-block w-8" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground md:text-3xl">{title}</h2>
        <Rule />
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Resume() {
  const education = timeline.slice(0, 6);
  const highlighted = allProjects.slice(0, 6);
  // Every certificate, in recency order, matching the credentials list the
  // source résumé publishes.
  const credentials = certificatesByRecency;

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          {/* Masthead */}
          <Reveal>
            <div className="surface relative overflow-hidden rounded-2xl border border-gold/25 p-5 sm:p-6 md:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px divider-gold"
              />
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gold">Résumé</p>
              <h1 className="headline-3d mt-3 text-4xl font-bold leading-[1.05] text-foreground md:text-5xl">
                Andrew Mathews
              </h1>
              <p className="mt-3 text-balance text-base leading-relaxed text-primary sm:text-lg">
                {PROFILE_TITLE}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {SCHOOL} · Dubai, UAE
              </p>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Dubai-based student developer building AI systems, software products, robotics
                projects and tools. Started with robotics at nine, now shipping full products and
                competing in STEM, engineering and MUN circuits.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to="/contact"
                  className="cta-pop focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground"
                >
                  Get in touch
                  <span aria-hidden="true" className="cta-arrow">
                    →
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-gold/35 bg-gold/5 px-4 font-mono text-sm text-gold transition-colors hover:bg-gold/15"
                >
                  <Printer className="size-4" />
                  Print / Save as PDF
                </button>
                <Link
                  to="/profile"
                  className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 font-mono text-sm text-foreground transition-colors hover:border-gold/50 hover:text-gold"
                >
                  View profile
                </Link>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-1 transition-colors hover:text-gold"
                    >
                      {link.label}
                      <ExternalLink className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Block eyebrow="Education & Journey" title="Education and Training">
            <ol className="space-y-5">
              {education.map((entry) => (
                <li key={`${entry.year}-${entry.title}`} className="surface rounded-xl p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">{entry.title}</h3>
                    <span className="font-mono text-xs text-gold">{entry.year}</span>
                  </div>
                  {entry.meta && (
                    <p className="mt-1 text-sm text-muted-foreground">{entry.meta}</p>
                  )}
                  {entry.body.map((line) => (
                    <p key={line} className="mt-2 text-sm leading-relaxed text-foreground/80">
                      {line}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          </Block>

          <Block eyebrow="Selected Work" title="Projects">
            <ul className="grid gap-4 sm:grid-cols-2">
              {highlighted.map((project) => (
                <li key={project.slug} className="surface rounded-xl p-5">
                  <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                    {project.tech.slice(0, 4).join(" · ")}
                  </p>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="focus-ring mt-3 inline-block font-mono text-xs text-primary hover:text-gold"
                  >
                    Read the case study →
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Currently building:{" "}
              {currentlyBuilding.map((item) => `${item.name} (${item.status})`).join(" · ")}
            </p>
          </Block>

          <Block eyebrow="Competitions" title="Competitions and Recognition">
            <div className="grid gap-4 md:grid-cols-2">
              <ul className="surface space-y-3 rounded-xl p-5">
                <li className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                  STEM & Engineering
                </li>
                {competitionResults.map((result) => (
                  <li key={`${result.place}-${result.detail}`} className="text-sm">
                    <span className="font-semibold text-foreground">{result.place}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {[result.detail, result.event].filter(Boolean).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="surface space-y-3 rounded-xl p-5">
                <li className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                  Model United Nations
                </li>
                {munResults.map((result) => (
                  <li key={result.title} className="text-sm">
                    <span className="font-semibold text-foreground">{result.title}</span>
                    {result.detail && (
                      <span className="text-muted-foreground"> — {result.detail}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Block>

          <Block eyebrow="Credentials" title="Certificates">
            <ul className="cert-list surface divide-y divide-border rounded-xl md:grid md:grid-cols-2 md:divide-y-0">
              {credentials.map((cert, index) => (
                <li
                  key={cert.id}
                  className={[
                    "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-4",
                    // Two-column list on wider screens: a hairline between rows,
                    // a hairline down the middle between the columns.
                    index % 2 === 0 ? "md:border-r md:border-border" : "",
                    index < credentials.length - 2
                      ? "md:border-b md:border-border"
                      : "",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{cert.title}</p>
                    {cert.issuer && (
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-gold">
                    {certificateDateLabel(cert)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              Competition awards and MUN results are listed above.
            </p>
            <Link
              to="/achievements#certificates"
              className="focus-ring mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-gold"
            >
              <Download className="size-3.5" />
              Open the certificate gallery to view or download originals
            </Link>
          </Block>

          <Block eyebrow="Skills" title="Tools and Capabilities">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((group) => (
                <div key={group.title} className="surface rounded-xl p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                    {group.title}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link
              to="/skills"
              className="focus-ring mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary hover:text-gold"
            >
              See the skills page for what each capability has shipped in
            </Link>
          </Block>

          <Block eyebrow="Approach" title="How I Work">
            <ul className="grid gap-4 md:grid-cols-3">
              {principles.map((principle) => (
                <li key={principle.title} className="surface rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </section>
    </Layout>
  );
}
