import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import { socialIconMap } from "@/components/ui/SocialIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { GithubPreview } from "@/components/ui/GithubPreview";

/** "Find Me Online" — integrated profile hub, not a link list. */
export function FindMeOnline() {
  const [primary, ...rest] = socialLinks;
  const PrimaryIcon = socialIconMap[primary.id];

  return (
    <section className="border-t border-border py-20 md:py-28" id="online">
      <div className="container">
        <SectionHeading
          label="Online"
          title="Find Me Online"
          subtitle="Follow what I'm building, experimenting with, and learning."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {/* Primary: GitHub, with live public repo preview */}
          <Reveal className="lg:col-span-2">
            <div className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <PrimaryIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{primary.label}</h3>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                        Primary
                      </span>
                    </div>
                    <p className="font-mono text-sm text-muted-foreground">{primary.handle}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{primary.description}</p>
                  </div>
                </div>
                <a
                  href={primary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${primary.cta} — ${primary.handle} (opens in a new tab)`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-mono text-xs text-primary-foreground transition-all hover:brightness-110 focus-ring"
                >
                  {primary.cta} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-6">
                <GithubPreview />
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {rest.map((link, i) => {
              const Icon = socialIconMap[link.id];
              return (
                <Reveal key={link.id} delay={60 + i * 60}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.cta} — ${link.handle} (opens in a new tab)`}
                    className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow focus-ring motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                          {link.label}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">{link.handle}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
