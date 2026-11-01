import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              FAQ
            </p>
            <h1 className="headline-3d text-4xl font-bold leading-[1.08] text-balance text-foreground md:text-5xl">
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
            <Accordion type="single" collapsible className="w-full">
              {faqEntries.map((entry) => (
                <AccordionItem key={entry.id} value={entry.id}>
                  <AccordionTrigger className="focus-ring rounded-sm text-left text-base font-medium text-foreground">
                    {entry.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    <p>{entry.answer}</p>
                    <Link
                      to={entry.source.href}
                      className="link-underline mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-gold"
                    >
                      {entry.source.label}
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
