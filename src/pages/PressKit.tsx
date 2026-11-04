import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toast } from "@/components/ui/sonner";
import { Check, Copy, ExternalLink } from "lucide-react";
import { bios, pressFacts } from "@/data/pressKit";
import { featuredProjects, socialLinks } from "@/data/portfolio";

/**
 * Press kit: ready-to-paste biographies plus the facts a collaborator or
 * journalist needs. The biographies restate published information only — there
 * is no agency, availability or pricing claim anywhere on this page.
 */
export default function PressKit() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedId(id);
      toast("Bio copied", { description: "Ready to paste." });
      window.setTimeout(
        () => setCopiedId((current) => (current === id ? null : current)),
        2000,
      );
    } catch {
      toast("Couldn't copy", {
        description: "Select the text and copy it manually.",
      });
    }
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
              Press kit
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
              Biographies and{" "}
              <em className="serif-display mark-underline italic text-gold">
                facts
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Copy-ready versions of the same story, in first and third person.
              Every claim here also appears on the About, Journey or Projects
              pages.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {bios.map((bio, i) => (
              <Reveal key={bio.id} delay={i * 50} className="h-full">
                <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      {bio.label}
                    </h2>
                    <button
                      type="button"
                      onClick={() => copy(bio.id, bio.body)}
                      aria-label={`Copy the ${bio.label.toLowerCase()} biography`}
                      className="focus-ring -my-2.5 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-[11px] text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      {copiedId === bio.id ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {copiedId === bio.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {bio.body.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <SectionHeading label="Fact sheet" title="At a *glance*" />
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {pressFacts.map((fact) => (
                <Reveal
                  key={fact.label}
                  className="border-b border-border/70 pb-3"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-foreground">{fact.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Flagship work
              </h2>
              <ul className="mt-4 space-y-2">
                {featuredProjects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="link-underline inline-flex items-center gap-2 text-foreground"
                    >
                      {project.name}
                      <span className="text-muted-foreground">
                        — {project.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={60}>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Elsewhere
              </h2>
              <ul className="mt-4 space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-2 text-foreground"
                    >
                      {link.label}
                      <span className="text-muted-foreground">
                        {link.handle}
                      </span>
                      <ExternalLink
                        className="h-3 w-3 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="mt-16">
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Something not answered here? Use the{" "}
              <Link to="/contact" className="link-underline text-gold">
                contact page
              </Link>
              . AndrewBuilds is a personal practice — there is no agency, team
              or client list behind it.
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
