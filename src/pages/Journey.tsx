import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";

const flow = ["Robotics", "Software", "AI", "Systems"];

export default function Journey() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Journey
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              The Journey
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              From a first robotics certification at age 9 to a growing ecosystem of products,
              experiments, and competitions.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10 flex flex-wrap items-center gap-3">
            {flow.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-foreground">
                  {step}
                </span>
                {i < flow.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </Reveal>

          <div className="mt-16">
            <h2 className="sr-only">Timeline of milestones</h2>
            <Timeline />
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
