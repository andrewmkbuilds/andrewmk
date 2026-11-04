import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AchievementCard } from "@/components/ui/AchievementCard";
import { AchievementBadge } from "@/components/ui/Badges";
import { CertificateGallery } from "@/components/ui/CertificateGallery";
import { CertificateViewer } from "@/components/ui/CertificateViewer";
import { PackAccordion } from "@/components/ui/PackAccordion";
import { CertificateScale } from "@/components/ui/CertificateScale";
import SplitFlapBoard from "@/components/annnimate/split-flap-board";
import ImageFlyIn from "@/components/annnimate/image-fly-in";
import ElasticDivider from "@/components/annnimate/elastic-divider";
import TextReveal from "@/components/annnimate/text-reveal";
import { certificates, type Certificate } from "@/data/certificates";
import {
  achievementGroups,
  certificationGroups,
  competitionResults,
  exhibitions,
  fllSeasons,
  munResults,
} from "@/data/portfolio";

const exhibitionLoop = ["Build", "Demonstrate", "Explain", "Iterate"];

const certById = (id?: string): Certificate | undefined =>
  id ? certificates.find((c) => c.id === id) : undefined;

export default function Achievements() {
  const [proof, setProof] = useState<Certificate | null>(null);

  /** The record, as a split-flap board: event / placing / discipline. */
  const flapSets = competitionResults
    .slice(0, 5)
    .map((result) => [
      result.event ?? "Techfest",
      result.place,
      result.detail ?? "Result",
    ]);

  /** Real certificate previews for the fly-in field. */
  const flyInImages = certificates.slice(0, 10).map((cert, i) => ({
    src: cert.thumb,
    alt: cert.title,
    aspect: ["portrait_md", "portrait_sm", "square_sm", "portrait_lg"][i % 4],
    hideMobile: i > 5,
  }));

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Achievements
            </p>
            <h1 className="headline-3d text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              Competitions, Recognition, and{" "}
              <em className="serif-display mark-underline italic text-gold">
                Results
              </em>
            </h1>
            <TextReveal
              className="anm-reveal mt-4 text-lg text-muted-foreground leading-relaxed"
              type="words"
              start="top 88%"
              stagger={0.022}
              duration={0.65}
            >
              STEM, engineering, robotics, and MUN —{" "}
              <strong>the places where the work gets tested</strong> against
              other people's work.
            </TextReveal>
          </Reveal>

          {achievementGroups.map((group) => (
            <Reveal key={group.title} className="mt-14">
              <h2 className="text-2xl font-semibold text-foreground">
                {group.title}
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <AchievementBadge key={item} label={item} size="sm" />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="container" aria-hidden="true">
        <ElasticDivider
          className="anm-divider"
          color="hsl(41 58% 60%)"
          weight={1.2}
        />
      </div>

      {/* The archive on a rail: real certificate previews, draggable. */}
      <section className="py-16 md:py-20" aria-label="Certificate archive">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
              The archive
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Drag or throw the rail · {certificates.length} originals
            </p>
          </div>
          <div className="mt-6">
            <CertificateScale />
          </div>
        </div>
      </section>

      {/* The record, as a mechanical split-flap board. */}
      <section className="border-t border-border py-20 md:py-24">
        <div className="container">
          <SectionHeading
            label="The record"
            title="Results, *Flapped* Into Place"
            subtitle="Tap the board, use the arrows, or press the left and right arrow keys."
          />
          <div className="mt-8 overflow-x-auto pb-2">
            <SplitFlapBoard className="anm-flap" sets={flapSets} />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Results" title="Competitions" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {competitionResults.map((result, i) => (
              <Reveal
                key={`${result.place}-${result.detail}`}
                delay={i * 60}
                className="h-full"
              >
                <AchievementCard
                  {...result}
                  className="h-full"
                  onViewProof={
                    certById(result.certKey)
                      ? () => setProof(certById(result.certKey)!)
                      : undefined
                  }
                />
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
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold/40">
                  <h3 className="text-lg font-semibold text-foreground">
                    {mun.title}
                  </h3>
                  {mun.detail && (
                    <p className="mt-2 font-mono text-sm text-primary">
                      {mun.detail}
                    </p>
                  )}
                  {certById(mun.certKey) && (
                    <button
                      type="button"
                      onClick={() => setProof(certById(mun.certKey)!)}
                      className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 font-mono text-xs text-foreground transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      View Certificate <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Robotics"
            title="FIRST LEGO League"
            subtitle="The Dubai Regional of the 2025–26 UNEARTHED season, and what the team came away with."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {fllSeasons.map((season, i) => (
              <Reveal key={season.season} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-gold/40">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                    {season.season}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {season.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {season.detail}
                  </p>
                  <ul className="mt-4 grid list-none gap-2 p-0">
                    {season.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-foreground/85"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {point}
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
            label="Learning"
            title="Certifications & Learning"
            subtitle="Course and programme completions, listed as exactly that — learning milestones rather than professional accreditation."
          />
          <div className="mt-8 max-w-3xl">
            <PackAccordion
              allowMultiple
              items={certificationGroups.map((group) => ({
                id: group.title,
                title: group.title,
                stagger: true,
                body: (
                  <ul className="grid list-none gap-3 p-0">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <p className="text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                ),
              }))}
            />
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            <span className="text-primary">//</span> Original certificates are
            viewable in the gallery below.
          </p>
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
                {i < exhibitionLoop.length - 1 && (
                  <span className="text-primary">→</span>
                )}
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

      {/* Proof, as a depth field: real certificate previews fly in from deep
          inside the section around a clear reading zone. */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Proof"
            title="Proof, Not *Promises*"
            subtitle="The originals behind the claims — every certificate below was issued by the organisation that awarded it."
          />
          <div className="mt-10">
            <ImageFlyIn
              className="anm-fly"
              headline="Proof, not promises."
              support="Every result on this page points back to a certificate issued by the organisation that awarded it."
              images={flyInImages}
              duration={14}
            />
          </div>
        </div>
      </section>

      <CertificateGallery />

      <CertificateViewer certificate={proof} onClose={() => setProof(null)} />
    </Layout>
  );
}
