import { Suspense, lazy } from "react";
import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { FindMeOnline } from "@/components/ui/FindMeOnline";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroCardStack } from "@/components/ui/HeroCardStack";
import { TechMarquee } from "@/components/ui/TechMarquee";
import { CaseStudyRow } from "@/components/ui/CaseStudyRow";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { Parallax } from "@/components/ui/Parallax";
import { TechConstellation } from "@/components/ui/TechConstellation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { TechTag } from "@/components/ui/TechTag";
import { RoleBadge } from "@/components/ui/Badges";
import { SketchArrow, SketchSeparator, SketchStar } from "@/components/ui/Sketch";
import {
  PopDisclosure,
  InlinePopDisclosure,
} from "@/components/ui/PopDisclosure";

// The contact form is below the fold and carries the form/server-function
// bundle, so it is fetched only when the reader scrolls that far.
const ContactForm = lazy(() =>
  import("@/components/ui/ContactForm").then((m) => ({
    default: m.ContactForm,
  })),
);

import {
  ArrowRight,
  AppWindow,
  BrainCircuit,
  CircuitBoard,
  Hammer,
  Lightbulb,
  PenLine,
  Rocket,
  Sparkles,
  Waypoints,
  Workflow,
  Cpu,
  ScanEye,
  LineChart,
  Download,
  type LucideIcon,
} from "lucide-react";
import {
  buildingCategories,
  currentlyBuilding,
  featuredProjects,
  principles,
  quickStats,
  buildAreas,
  getProject,
} from "@/data/portfolio";

const buildIcons: Record<string, LucideIcon> = {
  AppWindow,
  BrainCircuit,
  Workflow,
  Cpu,
  ScanEye,
  LineChart,
};

const toolRowOne = [
  "Python",
  "TypeScript",
  "JavaScript",
  "React",
  "Flutter",
  "Tkinter",
  "OpenCV",
  "MediaPipe",
];

const stepIcons = [Lightbulb, Hammer, Rocket];

const toolRowTwo = [
  "Base44",
  "Lovable",
  "Gemini API",
  "Tailwind CSS",
  "Supabase",
  "Git",
  "GitHub",
  "AI APIs",
];

export default function Home() {
  return (
    <Layout>
      {/* Hero — three depth layers: atmosphere, structure, content */}
      <section className="relative overflow-hidden bg-hero-veil grain">
        <Parallax distance={36} ariaHidden className="absolute inset-0">
          <div className="absolute inset-0 bg-grid" aria-hidden="true" />
        </Parallax>
        {/* A soft gradient instead of a blurred element: same light, no
            full-size filter repaint. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_100%)]"
        />

        <div className="container relative grid items-center gap-12 pt-32 pb-16 md:pt-40 md:pb-20 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8 lg:pt-40 lg:pb-24">
          <div className="max-w-2xl">
            {/* identity pill — name and place, the way the reference opens */}
            <div className="enter mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 py-1.5 pr-3.5 pl-3">
              <span aria-hidden="true" className="text-sm">
                👋
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold-glow">
                Andrew Mathews · Dubai, UAE
              </span>
              <StatusDot />
            </div>

            <h1 className="headline-3d text-display text-[2.6rem] leading-[1.03] text-balance text-foreground sm:text-5xl md:text-6xl lg:text-[4.05rem]">
              {/* Real page heading for search engines and screen readers; the
                  animated display line below stays exactly as designed. */}
              <span className="sr-only">
                Andrew Mathews — Student Developer, AI Builder &amp; Robotics
                Engineer
              </span>
              <span aria-hidden="true" className="relative block">
                <span className="block">
                  <RevealWords text="I build systems that" delay={0.12} />
                </span>
                <span className="mt-1 block">
                  <RevealWords
                    text="solve"
                    delay={0.3}
                    className="serif-display mark-underline pr-1 italic text-gold-glow"
                  />{" "}
                  <span className="text-primary">
                    <RevealWords text="real problems." delay={0.38} />
                  </span>
                </span>
                <SketchStar
                  className="absolute -top-2 right-[4%] hidden h-5 w-5 text-gold/80 sm:block md:h-6 md:w-6"
                  weight={1.7}
                />
              </span>
            </h1>

            {/* margin note — hand-written ink beside the headline */}
            <p
              aria-hidden="true"
              style={{ animationDelay: "520ms" }}
              className="enter note-hand mt-4 ml-1 hidden items-center gap-2 text-base sm:inline-flex"
            >
              <SketchArrow className="h-3 w-9 shrink-0 text-gold/70" />
              right now: building Gradr
            </p>

            <p
              style={{ animationDelay: "120ms" }}
              className="enter mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              I&rsquo;m Andrew, a student developer and AI builder from Dubai.
              I build software, experiment with AI, compete in STEM and
              engineering challenges, and turn ideas into working products.
            </p>

            <div
              style={{ animationDelay: "220ms" }}
              className="enter mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  data-cursor="cta"
                  className="group font-mono shadow-glow"
                >
                  <Link to="/projects">
                    See my work
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  data-cursor="cta"
                  className="font-mono"
                >
                  <Link to="/contact">Get in touch</Link>
                </Button>
              </Magnetic>
              <Link
                to="/resume"
                aria-label="Download Andrew Mathews' résumé"
                className="focus-ring inline-flex items-center gap-1.5 rounded-full px-1 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Résumé
              </Link>
            </div>

            <div
              style={{ animationDelay: "320ms" }}
              className="enter mt-8 flex flex-wrap items-center gap-2"
            >
              <RoleBadge label="Student Developer" icon={PenLine} className="-rotate-1" />
              <RoleBadge label="AI Builder" icon={Sparkles} className="rotate-1" />
              <RoleBadge label="Robotics &amp; Systems" icon={CircuitBoard} className="-rotate-[1.5deg]" />
              <RoleBadge label="Systems Thinker" icon={Waypoints} className="rotate-[0.6deg]" />
            </div>

            <div className="enter" style={{ animationDelay: "400ms" }}>
              <SocialIcons className="mt-7" />
              <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                AI · Software · Robotics · Systems · Product
              </p>
            </div>
          </div>

          {/* Draggable paper cards — the hero's signature surface */}
          <div
            className="enter relative -mx-2 lg:mx-0"
            style={{ animationDelay: "180ms" }}
          >
            <HeroCardStack projects={featuredProjects} />
          </div>
        </div>
        {/* scroll indicator — part of the hero's depth language */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center md:flex"
        >
          <span className="scroll-cue flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
            <span className="h-8 w-px bg-linear-to-b from-gold/70 to-transparent" />
          </span>
        </div>
      </section>

      {/* Quick stats */}
      <section
        className="divider-gold border-b border-b-border bg-card/30"
        aria-label="Quick statistics"
      >
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {quickStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <p className="headline-3d text-display text-3xl text-foreground md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Idea → Prototype → Product — the builder narrative, stated once */}
      <section
        className="border-b border-border/70 py-14 md:py-16"
        aria-labelledby="process-heading"
      >
        <div className="container">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="process-heading"
              className="serif-display text-2xl text-foreground md:text-[2rem]"
            >
              From &ldquo;this would be cool&rdquo; to a{" "}
              <em className="mark-underline italic text-gold">
                working product
              </em>
              .
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Every project on this site moved through the same three steps, and
              most of them are still moving.
            </p>
          </div>
          <ol className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-3">
            {[
              {
                step: "Idea",
                body: "A real problem, written down plainly before anything gets built.",
              },
              {
                step: "Prototype",
                body: "The smallest version that can be used, tested and argued with.",
              },
              {
                step: "Product",
                body: "Ship it, watch what actually breaks, then improve the part that matters.",
              },
            ].map((item, i) => {
              const StepIcon = stepIcons[i] ?? Lightbulb;
              return (
              <li
                key={item.step}
                className="spotlight lift-3d group rounded-xl border border-border bg-card p-6 shadow-card hover:border-gold/35"
              >
                <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-gold transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <StepIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  0{i + 1} · {item.step}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Tools ribbon — the reference's logo band, in AndrewBuilds ink */}
      <section
        className="border-y border-border/70 bg-card/20 py-14 md:py-16"
        aria-labelledby="tools-heading"
      >
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2
              id="tools-heading"
              className="serif-display text-2xl text-foreground md:text-[2rem]"
            >
              Stuff I build{" "}
              <em className="mark-underline italic text-gold">with</em>.
            </h2>
            <Link
              to="/projects"
              className="focus-ring inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
            >
              See all projects
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          <TechMarquee label="Languages and frameworks" items={toolRowOne} />
          <TechMarquee
            label="Platforms and tooling"
            items={toolRowTwo}
            reverse
          />
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 md:py-28" id="work">
        <div className="container">
          <SectionHeading
            label="Featured"
            title="Things I've *Built*"
            subtitle="Different problems. Different systems. One constant: build it."
          />
          <div className="grid gap-20 md:gap-28">
            {featuredProjects.map((project, i) => (
              <CaseStudyRow key={project.slug} project={project} index={i} />
            ))}
          </div>
          <Reveal className="mt-14">
            <Link
              to="/projects"
              className="group focus-ring inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
            >
              All projects and experiments
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="divider-gold py-20 md:py-28" id="ecosystem">
        <div className="container">
          <SectionHeading
            label="Ecosystem"
            title="Everything I Build Has a *Purpose*."
            subtitle="Systems, tools, experiments, and concepts built to solve specific problems."
          />
          <ProjectGrid />
          <Reveal className="mt-10 font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> More systems in
            development.
          </Reveal>
        </div>
      </section>

      {/* Building categories */}
      <section className="divider-gold py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Focus areas"
            title="My Building *Categories*"
          />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="grid gap-5 sm:grid-cols-2">
              {buildingCategories.map((cat, i) => (
                <Reveal key={cat.title} delay={i * 60} className="h-full">
                  <div className="spotlight lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card hover:border-gold/40">
                    <h3 className="text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <TechTag key={item}>{item}</TechTag>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120} className="h-full">
              <Tilt3D className="h-full" intensity={5}>
                <TechConstellation className="h-full min-h-[340px]" />
              </Tilt3D>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What I Build */}
      <section className="divider-gold py-20 md:py-28" id="what-i-build">
        <div className="container">
          <SectionHeading
            label="Focus areas"
            title="What I *Build*"
            subtitle="I build software, AI systems, experiments, and technical projects to explore ideas and solve real problems."
          />
          <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {buildAreas.map((area, i) => {
              const Icon = buildIcons[area.icon] ?? AppWindow;
              return (
                <Reveal as="li" key={area.id} delay={i * 60} className="h-full">
                  <PopDisclosure
                    title={area.title}
                    kind="focus area, show details"
                    popTarget="build-area"
                    summary={area.description}
                    media={
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-colors group-hover:border-gold/40">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    }
                  >
                    <dl className="space-y-2">
                      {area.details.map((d) => (
                        <div
                          key={d.label}
                          className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                        >
                          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {d.label}
                          </dt>
                          <dd className="text-sm font-medium text-foreground sm:text-right">
                            {d.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {(area.projects ?? []).length > 0 && (
                      <ul className="mt-5 grid list-none gap-3 border-t border-border/70 p-0 pt-4">
                        {(area.projects ?? []).map((slug) => {
                          const p = getProject(slug);
                          if (!p) return null;
                          return (
                            <li key={slug}>
                              <Link
                                to={`/projects/${p.slug}`}
                                className="focus-ring block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:border-gold/40"
                              >
                                <span className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-foreground">
                                    {p.name}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                                    Open
                                    <ArrowRight
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </span>
                                <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                                  {p.description}
                                </span>
                                <span className="mt-2.5 flex flex-wrap gap-1.5">
                                  {p.tech.map((t) => (
                                    <TechTag key={t}>{t}</TechTag>
                                  ))}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </PopDisclosure>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* How I think */}
      <section className="divider-gold py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Approach" title="How I *Think*" />
          <ul className="grid list-none gap-5 p-0 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 70} className="h-full">
                <PopDisclosure
                  title={p.title}
                  kind="principle, show details"
                  popTarget="principle"
                  media={
                    <span className="font-mono text-xs text-gold">
                      0{i + 1}
                    </span>
                  }
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </PopDisclosure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Based in Dubai */}
      <section
        className="divider-gold py-20 md:py-28"
        aria-labelledby="dubai-heading"
      >
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                Location
              </p>
              <h2
                id="dubai-heading"
                className="text-display mt-3 text-2xl text-foreground md:text-3xl"
              >
                Based in Dubai, UAE
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                I build from Dubai. The robotics work started here through a
                school programme, and the software, AI and racing projects since
                have all been built alongside UAE technology and STEM
                competitions — FLL, Techfest and MUN among them. Most of what is
                on this site was designed, built and tested in Dubai.
              </p>
            </div>
            <Reveal delay={80}>
              <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
                {[
                  { k: "Base", v: "Dubai, United Arab Emirates" },
                  { k: "School", v: "The Indian High School, Dubai" },
                  { k: "Focus", v: "AI, software, robotics and STEM" },
                  { k: "Working with", v: "Remote and local collaborators" },
                ].map((item) => (
                  <li
                    key={item.k}
                    className="lift-3d rounded-xl border border-border bg-card p-5 shadow-card"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                      {item.k}
                    </span>
                    <span className="mt-2 block text-sm text-foreground">
                      {item.v}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Robotics origin */}
      <section className="divider-gold py-20 md:py-28">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              label="Robotics"
              title="Where It *Started*"
              subtitle="It didn't begin with AI. It began with physically building things — the Mbot@IHS robotics programme at age 9."
              className="mb-0"
            />
            <Reveal delay={80}>
              <ol className="grid gap-3 sm:grid-cols-2">
                {["Robotics", "Software", "AI", "Systems"].map((step, i) => (
                  <li
                    key={step}
                    className="lift-3d flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card"
                  >
                    <span className="font-mono text-xs text-gold">
                      0{i + 1}
                    </span>
                    <span className="text-base font-medium text-foreground">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STEM Racing */}
      <section className="divider-gold py-20 md:py-28">
        <div className="container">
          <SectionHeading
            label="Engineering"
            title="STEM Racing"
            subtitle="Engineering beyond the screen."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="h-full rounded-xl border border-border bg-card p-8 shadow-card">
                <p className="text-base text-muted-foreground leading-relaxed">
                  I take part in F1 in Schools / STEM Racing, where the work runs
                  through engineering, design, teamwork, racing, and competition.
                  It's a different kind of building: constraints are physical,
                  deadlines are real, and the whole team has to move together.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Engineering",
                    "Design",
                    "Teamwork",
                    "Racing",
                    "Competition",
                  ].map((t) => (
                    <TechTag key={t}>{t}</TechTag>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex h-full flex-col justify-between rounded-xl border border-primary/30 bg-card p-8 shadow-card">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    Connected team
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">
                    Horizon Motorsports
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    A UAE-based racing team competing in FLL, Techfest, and
                    engineering competitions.
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-6 font-mono">
                  <a
                    href="https://horizonmotorsports.base44.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit the team site
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Currently building */}
      <section className="divider-gold py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Live" title="Currently *Building*" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {currentlyBuilding.map((item, i) => (
              <Reveal key={item.name} delay={i * 60} className="h-full">
                <div className="lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-2">
                    <StatusDot />
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FindMeOnline />

      {/* CTA */}
      <section
        className="divider-gold py-20 md:py-24"
        aria-labelledby="get-in-touch-heading"
      >
        <div className="container">
          <Reveal>
            <div
              data-pop-target="get-in-touch"
              className="pop-card rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                Over to you
              </p>
              <h2
                id="get-in-touch-heading"
                className="headline-3d serif-display mt-4 text-4xl text-foreground md:text-6xl"
              >
                Always building{" "}
                <em className="mark-underline italic text-gold">something</em>.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Want to talk about technology, a project, collaboration, or
                something I'm building?
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="cta-pop font-mono">
                  <Link
                    to="/contact"
                    aria-label="Get in touch with Andrew Mathews"
                  >
                    Get in touch
                    <ArrowRight className="cta-arrow ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-mono"
                >
                  <Link to="/projects">See the work</Link>
                </Button>
              </div>
              <InlinePopDisclosure
                label="What to reach out about"
                popTarget="get-in-touch-details"
                className="mt-8"
              >
                <ul className="grid list-none gap-2 p-0 text-sm text-muted-foreground sm:grid-cols-2">
                  {[
                    "Technology, AI and systems discussions",
                    "Project ideas and collaborations",
                    "Robotics and STEM Racing",
                    "Feedback on something I've built",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </InlinePopDisclosure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Direct contact form */}
      <section
        className="divider-gold py-20 md:py-28"
        id="contact"
        aria-labelledby="home-contact-heading"
      >
        <div className="container max-w-2xl">
          <Reveal>
            <SectionHeading label="Contact" title="Reach Out *Directly*" />
            <p className="mt-4 text-muted-foreground">
              Send me a message and I'll get back to you. No middlemen, just a
              direct line.
            </p>
            <div className="mt-10">
              <Suspense
                fallback={
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Loading the form…
                  </p>
                }
              >
                <ContactForm sourcePath="/" />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
