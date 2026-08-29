import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { TechTag } from "@/components/ui/TechTag";
import {
  achievementGroups,
  competitionResults,
  exhibitions,
  munResults,
} from "@/data/portfolio";

const exhibitionLoop = ["Build", "Demonstrate", "Explain", "Iterate"];

export default function Achievements() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Achievements
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              Competitions, Recognition, and Results
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              STEM, engineering, robotics, and MUN — the places where the work gets tested against
              other people's work.
            </p>
          </Reveal>

          {achievementGroups.map((group) => (
            <Reveal key={group.title} className="mt-14">
              <h2 className="text-2xl font-semibold text-foreground">{group.title}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechTag key={item}>{item}</TechTag>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Results" title="Competitions" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {competitionResults.map((result, i) => (
              <Reveal key={`${result.place}-${result.detail}`} delay={i * 60} className="h-full">
                <AchievementCard {...result} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Diplomacy" title="MUN" />
          <div className="grid gap-5 md:grid-cols-3">
            {munResults.map((mun, i) => (
              <Reveal key={mun.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40">
                  <h3 className="text-lg font-semibold text-foreground">{mun.title}</h3>
                  {mun.detail && (
                    <p className="mt-2 font-mono text-sm text-primary">{mun.detail}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions — visually distinct band */}
      <section className="border-t border-border bg-card/40 py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Exhibitions"
            title="Where Ideas Become Real"
            subtitle="Exhibitions are where projects move beyond the screen — set up on a table, demonstrated live, and explained to real people who ask hard questions."
          />

          <Reveal className="flex flex-wrap items-center gap-3">
            {exhibitionLoop.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="rounded-lg border border-primary/30 bg-background px-5 py-3 font-mono text-sm text-foreground">
                  {step}
                </span>
                {i < exhibitionLoop.length - 1 && <span className="text-primary">→</span>}
              </span>
            ))}
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exhibitions.map((item, i) => (
              <Reveal key={item} delay={i * 50}>
                <div className="rounded-xl border border-border bg-background p-5">
                  <p className="font-mono text-sm text-foreground">
                    <span className="mr-2 text-primary">/</span>
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
