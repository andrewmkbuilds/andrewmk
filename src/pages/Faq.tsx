import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import { PackAccordion } from "@/components/ui/PackAccordion";
import { faqEntries } from "@/data/faq";

/**
 * The FAQ. Questions and answers live in `src/data/faq.ts`, which also feeds
 * `/data/v1/faq.json`, so the page and the API cannot drift apart.
 */
export default function Faq() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
              FAQ
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
              Questions,{" "}
              <em className="serif-display mark-underline italic text-gold">
                answered
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Short answers to the things people ask most, each linked back to
              the page it comes from.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-12 max-w-3xl">
            {/* The accordion renders its questions as h3, so the list needs an
                h2 between the page h1 and them to keep the heading order. */}
            <h2 className="sr-only">Frequently asked questions</h2>
            <PackAccordion
              items={faqEntries.map((entry) => ({
                id: entry.id,
                title: entry.question,
                stagger: true,
                body: (
                  <>
                    <p>{entry.answer}</p>
                    <Link
                      to={entry.source.href}
                      className="link-underline mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-gold"
                    >
                      {entry.source.label}
                    </Link>
                  </>
                ),
              }))}
            />
          </Reveal>

          <Reveal className="mt-12 text-sm text-muted-foreground">
            Still missing something?{" "}
            <Link to="/contact" className="link-underline text-gold">
              Ask directly
            </Link>
            .
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
