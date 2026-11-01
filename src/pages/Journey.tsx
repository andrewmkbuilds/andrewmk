import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackingCards } from "@/components/ui/StackingCards";
import { PortfolioRail } from "@/components/ui/PortfolioRail";
import { SkillBadge } from "@/components/ui/Badges";
import { timeline } from "@/data/portfolio";
import type { StackingCardItem } from "@/components/ui/StackingCards";

/** Each milestone is one chapter of the stack: the year is its label line. */
const chapters: StackingCardItem[] = timeline.map(({ year, ...rest }) => ({
  eyebrow: year,
  ...rest,
}));
import {
  Bot,
  BrainCircuit,
  CodeXml,
  Layers,
  type LucideIcon,
} from "lucide-react";

const flow: { label: string; icon: LucideIcon }[] = [
  { label: "Robotics", icon: Bot },
  { label: "Software", icon: CodeXml },
  { label: "AI", icon: BrainCircuit },
  { label: "Systems", icon: Layers },
];

export default function Journey() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Journey
            </p>
            <h1 className="headline-3d text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              The{" "}
              <em className="serif-display mark-underline italic text-gold">
                Journey
              </em>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              From a first robotics certification at age 9 to a growing
              ecosystem of products, experiments, and competitions.
            </p>
          </Reveal>

          <Reveal
            delay={80}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {flow.map((step, i) => (
              <span key={step.label} className="flex items-center gap-3">
                <SkillBadge label={step.label} icon={step.icon} />
                {i < flow.length - 1 && (
                  <span className="text-primary" aria-hidden="true">
                    →
                  </span>
                )}
              </span>
            ))}
          </Reveal>

          <div className="mt-16">
            <h2 className="sr-only">Timeline of milestones</h2>
            <StackingCards
              items={chapters}
              ariaLabel="Timeline of milestones"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Disciplines"
            title="Four Ways I *Build*"
            subtitle="The same instinct applied across four disciplines. Scroll the rail and each step lights up as the bead reaches it."
          />
          <div className="mt-10">
            <PortfolioRail />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Robotics"
            title="Where It Started"
            subtitle="The Mbot@IHS after-school programme at age 9 — building and presenting an original model at a school exhibition. Everything since has been an extension of that instinct."
          />
        </div>
      </section>
    </Layout>
  );
}
