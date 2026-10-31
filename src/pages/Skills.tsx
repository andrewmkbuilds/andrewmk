import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SkillBadge } from "@/components/ui/Badges";
import { PROFILE_TITLE, SCHOOL, skillGroups } from "@/data/portfolio";
import { ArrowRight } from "lucide-react";

/**
 * Skills — grouped by what the skill is actually used for, with a short note on
 * where each capability comes from. Deliberately not a logo wall.
 */
export default function Skills() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Skills
            </p>
            <h1 className="headline-3d text-4xl font-bold leading-[1.08] text-balance text-foreground md:text-5xl">
              What I{" "}
              <em className="serif-display mark-underline italic text-gold">
                build
              </em>{" "}
              with.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {PROFILE_TITLE}. The capabilities I work with, grouped by the area
              they belong to.
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {SCHOOL}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 50} className="h-full">
                <div className="spotlight lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold/40">
                  <h2 className="text-lg font-semibold text-foreground">
                    {group.title}
                  </h2>
                  <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                    {group.items.map((item) => (
                      <li key={item}>
                        <SkillBadge label={item} size="sm" />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Evidence"
            title="Skills Are Only Worth What *Ships*"
            subtitle="The projects page shows each capability in context: what the problem was, what was built and what stage it reached."
          />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
            >
              See the projects
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/achievements"
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
            >
              Achievements & certificates
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
