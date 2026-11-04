import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineTrack } from "@/components/ui/TimelineTrack";
import { PortfolioRail } from "@/components/ui/PortfolioRail";
import { SkillBadge } from "@/components/ui/Badges";
import { journeyMilestones } from "@/data/visuals";
import type { TimelineStop } from "@/components/ui/TimelineTrack";
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

/** Every chapter of the journey, as a dated stop on the timeline. */
const stops: TimelineStop[] = journeyMilestones.map((milestone) => ({
  id: milestone.id,
  label: milestone.label,
  title: milestone.title,
  meta: milestone.meta,
  body: milestone.body,
  points: milestone.points,
  status: milestone.status,
}));

export default function Journey() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold mb-4">
              Journey
            </p>
            <h1 className="headline-3d text-display text-[2.75rem] text-balance text-foreground md:text-[3.6rem] leading-[1.02]">
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
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <h2 className="type-section text-2xl text-foreground md:text-3xl">
                The timeline
              </h2>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                {stops.length} chapters · 2022 → now
              </p>
            </div>
            <TimelineTrack
              label="Timeline of milestones"
              stops={stops}
              className="mx-auto max-w-5xl"
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
