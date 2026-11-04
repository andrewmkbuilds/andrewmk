import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TechIndex } from "@/components/ui/TechIndex";
import {
  PROFILE_TITLE,
  SCHOOL,
  allProjects,
  skillGroups,
} from "@/data/portfolio";
import RotatingWords from "@/components/annnimate/rotating-words";
import { ArrowRight } from "lucide-react";

/** The disciplines the capability groups belong to, on the turning wheel. */
const disciplines = [
  "AI",
  "Software",
  "Computer vision",
  "Robotics",
  "Product",
];

/**
 * Skills — grouped by what the skill is actually used for, and linked back to
 * the work that uses it. Deliberately not a logo wall, and deliberately no
 * proficiency scores: the evidence is the projects.
 */
export default function Skills() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
              Skills
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
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

          {/* The disciplines on a drum: it spins through them once and
              settles on the last. Dots jump to any word; reduced motion
              renders the static list. */}
          <Reveal delay={60} className="mt-12 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
              Working across
            </p>
            <RotatingWords
              className="anm-words mt-3"
              words={disciplines}
              scrub={false}
              spin={1.8}
              settle={0.2}
              step={16}
              blur={6}
              nav
            />
          </Reveal>

          <div className="mt-14 border-t border-border pt-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <h2 className="type-section text-2xl text-foreground md:text-3xl">
                Capability index
              </h2>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                {skillGroups.reduce(
                  (total, group) => total + group.items.length,
                  0,
                )}{" "}
                capabilities · {skillGroups.length} areas
              </p>
            </div>
            <TechIndex groups={skillGroups} projects={allProjects} />
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
