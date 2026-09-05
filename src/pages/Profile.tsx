import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/lib/router-compat";
import { MapPin, ExternalLink, Award, GraduationCap, Wrench, Globe } from "lucide-react";
import logoUrl from "@/assets/andrewbuilds-logo.png";
import {
  allProjects,
  buildingCategories,
  competitionResults,
  currentlyBuilding,
  munResults,
  quickStats,
  socialLinks,
  timeline,
} from "@/data/portfolio";
import { certificateDateLabel, certificatesByRecency } from "@/data/certificates";

function Panel({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="surface relative overflow-hidden rounded-2xl p-6 md:p-7">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px divider-gold" />
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
            <Icon className="size-4 text-gold" />
            {title}
          </h2>
          {action}
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}

export default function Profile() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl space-y-6">
          {/* Profile header — cover, avatar, headline */}
          <Reveal>
            <article className="surface relative overflow-hidden rounded-2xl">
              <div className="relative h-32 bg-linear-to-r from-primary/25 via-primary/10 to-gold/20 md:h-40">
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px divider-gold" />
              </div>
              <div className="px-6 pb-7 md:px-8">
                <img
                  src={logoUrl}
                  alt="Andrew Mathews"
                  width={96}
                  height={96}
                  className="-mt-12 h-24 w-24 rounded-2xl border border-gold/40 bg-card p-2 shadow-card"
                />
                <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                      Andrew Mathews
                    </h1>
                    <p className="mt-1.5 text-primary">
                      Student Developer · AI Builder · Robotics & Systems
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-gold" />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/contact"
                      className="cta-pop focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground"
                    >
                      Connect
                      <span aria-hidden="true" className="cta-arrow">
                        →
                      </span>
                    </Link>
                    <Link
                      to="/resume"
                      className="focus-ring inline-flex min-h-11 items-center rounded-lg border border-gold/35 bg-gold/5 px-4 font-mono text-sm text-gold transition-colors hover:bg-gold/15"
                    >
                      View résumé
                    </Link>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border p-3">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-mono text-xl font-semibold text-gold">{stat.value}</dd>
                      <p className="mt-1 text-xs leading-snug text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </Reveal>

          <Panel icon={Globe} title="About">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              I'm a student developer from Dubai who builds AI systems, software products and
              robotics projects. I started with a school robotics programme at nine and have been
              shipping ever since — from computer-vision experiments and Python tools to full
              AI-powered products. I care about systems that solve a complete problem, not
              features in isolation.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {currentlyBuilding.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                    {item.status}
                  </span>
                  <span className="text-muted-foreground">{item.note}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            icon={Wrench}
            title="Projects"
            action={
              <Link
                to="/projects"
                className="focus-ring font-mono text-xs text-primary hover:text-gold"
              >
                See all →
              </Link>
            }
          >
            <ul className="space-y-4">
              {allProjects.slice(0, 5).map((project) => (
                <li key={project.slug} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="focus-ring text-base font-semibold text-foreground hover:text-gold"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                      {project.tech.slice(0, 5).join(" · ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={GraduationCap} title="Education & Journey">
            <ol className="space-y-4">
              {timeline.slice(0, 6).map((entry) => (
                <li key={`${entry.year}-${entry.title}`} className="flex gap-4">
                  <span className="w-14 shrink-0 font-mono text-xs text-gold">{entry.year}</span>
                  <div className="min-w-0 border-l border-border pl-4">
                    <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                    {entry.meta && (
                      <p className="text-xs text-muted-foreground">{entry.meta}</p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {entry.body[0]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel
            icon={Award}
            title="Honors & Certifications"
            action={
              <Link
                to="/achievements#certificates"
                className="focus-ring font-mono text-xs text-primary hover:text-gold"
              >
                Gallery →
              </Link>
            }
          >
            <ul className="space-y-2">
              {competitionResults.map((result) => (
                <li key={`${result.place}-${result.detail}`} className="text-sm">
                  <span className="font-semibold text-gold">{result.place}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — {[result.detail, result.event].filter(Boolean).join(", ")}
                  </span>
                </li>
              ))}
              {munResults.map((result) => (
                <li key={result.title} className="text-sm">
                  <span className="font-semibold text-gold">{result.title}</span>
                  {result.detail && (
                    <span className="text-muted-foreground"> — {result.detail}</span>
                  )}
                </li>
              ))}
            </ul>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {certificatesByRecency.slice(0, 8).map((cert) => (
                <li key={cert.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium leading-snug text-foreground">{cert.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[cert.issuer, certificateDateLabel(cert)].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel icon={Wrench} title="Skills">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {buildingCategories.map((group) => (
                <div key={group.title}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                    {group.title}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Globe} title="Find me online">
            <ul className="grid gap-3 sm:grid-cols-2">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:border-gold/45"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {link.label}
                      </span>
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {link.handle}
                      </span>
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-gold" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </Layout>
  );
}
