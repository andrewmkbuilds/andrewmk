import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import { WEBSITE_INTAKE_FORM_URL } from "@/data/portfolio";

/**
 * Gallery of business websites built for clients.
 * Intentionally empty until the real list is supplied — no placeholder work.
 */
const websites: { name: string; url: string; summary: string }[] = [];

export default function Websites() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Business Websites
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.08] text-balance text-foreground">
              Websites I've Built
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Websites designed and built around what a business actually needs: clear structure,
              fast performance, and mobile-first design.
            </p>
          </Reveal>

          {websites.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {websites.map((site) => (
                <article
                  key={site.url}
                  className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40"
                >
                  <h2 className="text-lg font-semibold text-foreground">{site.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {site.summary}
                  </p>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-auto pt-5 font-mono text-xs text-primary"
                  >
                    Visit site →
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <Reveal delay={80}>
              <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/50 p-8 md:p-12">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                  Gallery in progress
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  This gallery is being put together.
                </h2>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Website work is being collected and written up here. In the meantime, you can see
                  the rest of what I build, or start a project directly.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild className="font-mono focus-ring">
                    <a href={WEBSITE_INTAKE_FORM_URL} target="_blank" rel="noopener noreferrer">
                      Start a Website Project
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="font-mono focus-ring">
                    <Link to="/projects">See all projects</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </Layout>
  );
}
