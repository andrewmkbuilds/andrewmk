import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { Mail, Share2 } from "lucide-react";
import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKTREE_URL,
  socialLinks,
} from "@/data/portfolio";
import { SocialMark } from "@/components/ui/SocialMark";

export default function Contact() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold mb-4">
              Contact
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
              Get in{" "}
              <em className="serif-display mark-underline italic text-gold">
                Touch
              </em>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Want to talk about technology, a project, collaboration, or
              something I'm building?
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <ContactForm sourcePath="/contact" />
            </Reveal>

            <Reveal delay={80}>
              <div className="space-y-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile (@andrewmkbuilds)"
                  className="flex items-center gap-4 rounded-xl border border-primary/40 bg-card p-5 shadow-card transition-colors hover:border-gold focus-ring"
                >
                  <SocialMark id="github" size="md" className="text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      GitHub{" "}
                      <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                        · Primary
                      </span>
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      @andrewmkbuilds
                    </span>
                  </span>
                </a>

                <a
                  href={LINKTREE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="All My Links — Linktree (linktr.ee/andrewmkbuilds)"
                  className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 p-5 shadow-card transition-colors hover:border-gold focus-ring"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Share2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      All My Links{" "}
                      <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                        · Main hub
                      </span>
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      linktr.ee/andrewmkbuilds
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      The central place to find every profile, project, and
                      link.
                    </span>
                  </span>
                </a>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks
                    .filter((s) => s.id !== "github" && s.id !== "linktree")
                    .map((link) => {
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} profile (${link.handle})`}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:border-gold/40 focus-ring"
                        >
                          <SocialMark
                            id={link.id}
                            size="md"
                            className="text-primary"
                          />
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {link.label}
                            </span>
                            <span className="block font-mono text-xs text-muted-foreground">
                              {link.handle}
                            </span>
                          </span>
                        </a>
                      );
                    })}
                </div>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="focus-ring flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-gold/40"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      Email
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      {CONTACT_EMAIL}
                    </span>
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
