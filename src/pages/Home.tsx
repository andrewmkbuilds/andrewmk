import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { FindMeOnline } from "@/components/ui/FindMeOnline";
import { Reveal, RevealWords } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { SystemGraph } from "@/components/ui/SystemGraph";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { TechConstellation } from "@/components/ui/TechConstellation";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";
import { TypingCursor } from "@/components/ui/TypingCursor";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { TechTag } from "@/components/ui/TechTag";
import { PopDisclosure, InlinePopDisclosure } from "@/components/ui/PopDisclosure";

import { ArrowRight, AppWindow, BrainCircuit, Workflow, Cpu, ScanEye, LineChart, type LucideIcon } from "lucide-react";
import {
  buildingCategories,
  currentlyBuilding,
  featuredProjects,
  principles,
  quickStats,
  buildAreas,
  type Project,
} from "@/data/portfolio";

const buildIcons: Record<string, LucideIcon> = {
  AppWindow,
  BrainCircuit,
  Workflow,
  Cpu,
  ScanEye,
  LineChart,
};


export default function Home() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-veil grain">
        <div className="absolute inset-0 bg-grid" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-primary-glow/[0.07] blur-[120px]"
          aria-hidden="true"
        />

        <div className="container relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-10 lg:py-40">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur-sm"
            >
              <StatusDot />
              <span className="font-mono text-xs text-foreground">Currently Building</span>
            </motion.div>

            <h1 className="text-display text-[2.6rem] leading-[1.02] text-balance text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <RevealWords text="I build systems that solve" delay={0.15} />{" "}
              <span className="relative inline-block text-primary">
                <RevealWords text="real problems." delay={0.42} />
              </span>
              <TypingCursor />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              I'm Andrew, a student developer and AI builder from Dubai. I build software,
              experiment with AI, compete in STEM and engineering challenges, and turn ideas into
              working products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Button asChild size="lg" className="font-mono shadow-glow">
                  <Link to="/projects">
                    Explore My Work
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button asChild size="lg" variant="outline" className="font-mono">
                  <Link to="/about">About Me</Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
            >
              <SocialIcons className="mt-7" />
              <p className="mt-9 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                AI · Software · Robotics · Systems · Product
              </p>
            </motion.div>
          </div>

          {/* Ecosystem visualisation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative -mx-2 h-[320px] sm:h-[380px] lg:h-[520px]"
          >
            <Tilt3D className="h-full w-full" intensity={7}>
              {/* layered depth plates behind the graph */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-6 rounded-3xl border border-border/50 bg-card/20 backdrop-blur-[1px]"
                style={{ transform: "translateZ(-60px)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-12 rounded-3xl border border-primary/15"
                style={{ transform: "translateZ(-28px)" }}
              />
              <div style={{ transform: "translateZ(40px)" }} className="h-full w-full">
                <SystemGraph className="h-full w-full" />
              </div>
            </Tilt3D>
          </motion.div>

        </div>
      </section>

      {/* Quick stats */}
      <section className="border-y border-border bg-card/30" aria-label="Quick statistics">
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {quickStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70}>
              <p className="text-display text-3xl text-foreground md:text-4xl">{stat.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured work */}
      <section className="py-20 md:py-28" id="work">
        <div className="container">
          <SectionHeading
            label="Featured"
            title="Things I've Built"
            subtitle="Different problems. Different systems. One constant: build it."
          />
          <ul className="grid list-none gap-6 p-0 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <Reveal as="li" key={project.slug} delay={i * 70} className="h-full">
                <ProjectCard
                  project={project}
                  onOpen={openProject}
                  variant="featured"
                  className="pop-card h-full"
                />
              </Reveal>
            ))}
          </ul>


        </div>
      </section>

      {/* Ecosystem */}
      <section className="border-t border-border py-20 md:py-28" id="ecosystem">
        <div className="container">
          <SectionHeading
            label="Ecosystem"
            title="Everything I Build Has a Purpose."
            subtitle="Systems, tools, experiments, and concepts built to solve specific problems."
          />
          <ProjectGrid />
          <Reveal className="mt-10 font-mono text-sm text-muted-foreground">
            <span className="text-primary">//</span> More systems in development.
          </Reveal>
        </div>
      </section>

      {/* Building categories */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Focus areas" title="My Building Categories" />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="grid gap-5 sm:grid-cols-2">
              {buildingCategories.map((cat, i) => (
                <Reveal key={cat.title} delay={i * 60} className="h-full">
                  <div className="spotlight lift-3d h-full rounded-xl border border-border bg-card p-6 shadow-card hover:border-gold/40">
                    <h3 className="text-lg font-semibold text-foreground">{cat.title}</h3>
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
      <section className="border-t border-border py-20 md:py-28" id="what-i-build">
        <div className="container">
          <SectionHeading
            label="Focus areas"
            title="What I Build"
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
                        <div key={d.label} className="flex items-baseline justify-between gap-3">
                          <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {d.label}
                          </dt>
                          <dd className="text-right text-sm font-medium text-foreground">
                            {d.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </PopDisclosure>
                </Reveal>
              );
            })}
          </ul>


        </div>
      </section>


      {/* How I think */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Approach" title="How I Think" />
          <ul className="grid list-none gap-5 p-0 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 70} className="h-full">
                <PopDisclosure
                  title={p.title}
                  kind="principle, show details"
                  popTarget="principle"
                  media={<span className="font-mono text-xs text-primary">0{i + 1}</span>}
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </PopDisclosure>
              </Reveal>
            ))}

          </ul>

        </div>
      </section>

      {/* Robotics origin */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              label="Robotics"
              title="Where It Started"
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
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    <span className="text-base font-medium text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STEM Racing */}
      <section className="border-t border-border py-20 md:py-28">
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
                  I take part in F1 in Schools / STEM Racing, where the work runs through
                  engineering, design, teamwork, racing, and competition. It's a different kind of
                  building: constraints are physical, deadlines are real, and the whole team has to
                  move together.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Engineering", "Design", "Teamwork", "Racing", "Competition"].map((t) => (
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
                    A UAE-based racing team competing in FLL, Techfest, and engineering
                    competitions.
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
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Live" title="Currently Building" />
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
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FindMeOnline />

      {/* CTA */}
      <section className="border-t border-border py-20 md:py-24" aria-labelledby="get-in-touch-heading">
        <div className="container">
          <Reveal>
            <div
              data-pop-target="get-in-touch"
              className="pop-card rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card"
            >
              <h2
                id="get-in-touch-heading"
                className="text-3xl md:text-4xl font-semibold text-foreground"
              >
                Always building something.
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Want to talk about technology, a project, collaboration, or something I'm building?
              </p>
              <Button asChild size="lg" className="cta-pop mt-7 font-mono">
                <Link to="/contact" aria-label="Get in touch with Andrew Mathews">
                  Get in touch
                  <ArrowRight className="cta-arrow ml-2 h-4 w-4" />
                </Link>
              </Button>
              <InlinePopDisclosure
                label="What to reach out about"
                popTarget="get-in-touch-details"
                className="mt-6"
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


      <ProjectModal project={selected} open={open} onOpenChange={setOpen} />
    </Layout>
  );
}
