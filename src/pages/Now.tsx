import { Layout } from "@/components/layout/Layout";
import { Link } from "@/lib/router-compat";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  buildingCategories,
  currentlyBuilding,
  principles,
} from "@/data/portfolio";
import { ArrowRight } from "lucide-react";

/**
 * What is happening right now.
 *
 * The split is deliberate: `currentlyBuilding` holds work in progress, and the
 * focus areas describe the kind of work — nothing here is presented as
 * finished, and nothing is listed that the rest of the site does not publish.
 */
export default function Now() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Now
            </p>
            <h1 className="headline-3d text-4xl font-bold leading-[1.08] text-balance text-foreground md:text-5xl">
              What I&rsquo;m building{" "}
              <em className="serif-display mark-underline italic text-gold">
                right now
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              A working list, not a highlight reel. Everything here is in
              progress unless its status says otherwise.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {currentlyBuilding.map((item, i) => (
              <Reveal key={item.name} delay={i * 60} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-xl font-semibold text-foreground">
                      {item.name}
                    </h2>
                    <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20">
            <SectionHeading
              label="Focus"
              title="Where the *work* is going"
              subtitle="The areas I keep returning to, in the words the skills page uses."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buildingCategories.map((category, i) => (
                <Reveal key={category.title} delay={i * 50} className="h-full">
                  <div className="h-full rounded-xl border border-border bg-card/70 p-5">
                    <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                      {category.title}
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {category.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <SectionHeading label="Principles" title="How I *build*" />
            <div className="grid gap-5 md:grid-cols-3">
              {principles.map((principle, i) => (
                <Reveal key={principle.title} delay={i * 60}>
                  <h3 className="text-lg font-semibold text-foreground">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {principle.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="mt-16 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
            <Link
              to="/journey"
              className="link-underline inline-flex items-center gap-2 text-gold"
            >
              The chronology
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/projects"
              className="link-underline inline-flex items-center gap-2 text-gold"
            >
              Every project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="link-underline inline-flex items-center gap-2 text-gold"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
