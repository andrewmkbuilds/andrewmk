import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { apiResources, API_VERSION, machineReadable } from "@/data/publicApi";
import { SITE_URL } from "@/data/seo";

/**
 * Developer documentation for the public data layer.
 *
 * The endpoint list is imported from `src/data/publicApi.ts`, the same registry
 * `scripts/generate-public-data.ts` and /openapi.json are built from.
 */
export default function Developers() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
              Developers
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
              The public{" "}
              <em className="serif-display mark-underline italic text-gold">
                data layer
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Everything about Andrew on this site is available as static,
              read-only JSON, generated from the same content the pages render.
              No key, no account, no rate limit, no write access.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10 max-w-3xl">
            <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <code>{`curl -s ${SITE_URL}/data/v1/projects.json \\
  -H 'Accept: application/json'`}</code>
            </pre>
          </Reveal>

          <div className="mt-16">
            <SectionHeading
              label={`Endpoints · ${API_VERSION}`}
              title="What is *published*"
            />
            <div className="space-y-4">
              {apiResources.map((resource, i) => (
                <Reveal key={resource.id} delay={i * 40}>
                  <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-mono text-sm text-foreground">
                        {resource.path}
                      </h2>
                      {/* A templated path (`/projects/{slug}.json`) has no page
                          to open, so it is shown as an example, not a link. */}
                      {resource.path.includes("{") ? (
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
                          Template
                        </span>
                      ) : (
                        <a
                          href={resource.path}
                          className="font-mono text-xs uppercase tracking-[0.14em] text-gold link-underline"
                        >
                          Open
                        </a>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {resource.description}
                    </p>
                    <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
                      {resource.fields.join(" · ")}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <div>
              <SectionHeading label="Files" title="For agents and *crawlers*" />
              <ul className="space-y-4">
                {machineReadable.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className="link-underline font-mono text-sm text-foreground"
                    >
                      {item.path}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Versioning
                </h2>
                <p className="mt-2">
                  The path carries the version (<code>/data/v1/</code>). Fields
                  may be added inside a version; a breaking change publishes
                  <code> /data/v2/</code> and leaves <code>v1</code> in place.
                  <code> /data/v1/index.json</code> lists everything available.
                </p>
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Freshness
                </h2>
                <p className="mt-2">
                  The files are regenerated from the site's content whenever it
                  is built and deployed, so they describe the deployed site.
                  <code> generatedAt</code> in the index is the generation time.
                </p>
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Caching
                </h2>
                <p className="mt-2">
                  The payloads are static files. Cache them, and revalidate with
                  an <code>If-Modified-Since</code> or a short TTL rather than
                  polling.
                </p>
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Errors and content types
                </h2>
                <p className="mt-2">
                  A valid resource returns <code>200</code> with{" "}
                  <code>Content-Type: application/json</code>. A path that does
                  not exist returns <code>404</code> — never the HTML page with
                  a 200. Check the content type before parsing.
                </p>
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  What is not here
                </h2>
                <p className="mt-2">
                  No contact messages, environment values, drafts or internal
                  identifiers. Contact details are only the ones already
                  published on the contact page.
                </p>
              </div>
            </div>
          </div>

          <Reveal className="mt-16 rounded-xl border border-gold/25 bg-gold/[0.06] p-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Attribution
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              This data describes a real person. Attribute it to{" "}
              <span className="text-foreground">Andrew Mathews</span> and link
              back to the page a record points at. Do not present the API as a
              product, a company or an official service.
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
