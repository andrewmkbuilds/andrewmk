import { Seo } from "@/components/Seo";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { FindMeOnline } from "@/components/ui/FindMeOnline";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusDot } from "@/components/ui/StatusDot";
import { TypingCursor } from "@/components/ui/TypingCursor";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { TechTag } from "@/components/ui/TechTag";
import { ArrowRight, Globe, AppWindow, BrainCircuit, Workflow, Lightbulb, type LucideIcon } from "lucide-react";
import {
  buildingCategories,
  currentlyBuilding,
  featuredProjects,
  principles,
  quickStats,
  services,
  type Project,
} from "@/data/portfolio";

const serviceIcons: Record<string, LucideIcon> = {
  Globe,
  AppWindow,
  BrainCircuit,
  Workflow,
  Lightbulb,
};

const heroNodes = [
  { label: "AI", x: "68%", y: "22%" },
  { label: "Robotics", x: "84%", y: "40%" },
  { label: "Computer Vision", x: "70%", y: "62%" },
  { label: "Systems", x: "86%", y: "78%" },
  { label: "Product", x: "62%", y: "88%" },
];


export default function Home() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const openProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  return (
    <Layout>
      <Seo path="/" />
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-veil">
        <div className="absolute inset-0 bg-grid" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[420px] rounded-full bg-primary-glow/[0.07] blur-[120px]"
          aria-hidden="true"
        />


        {/* Floating technical labels */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {heroNodes.map((node, i) => (
            <span
              key={node.label}
              style={{ left: node.x, top: node.y, animationDelay: `${i * 1.1}s` }}
              className="absolute animate-drift rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm"
            >
              <span className="mr-2 inline-block h-1 w-1 rounded-full bg-primary align-middle" />
              {node.label}
            </span>
          ))}
        </div>

        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Reveal className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 backdrop-blur-sm">
              <StatusDot />
              <span className="font-mono text-xs text-foreground">Currently Building</span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance text-foreground">
                I build systems that solve real problems.
                <TypingCursor />
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
                I'm Andrew, a student developer and AI builder from Dubai. I build software,
                experiment with AI, compete in STEM and engineering challenges, and turn ideas into
                working products.
              </p>
            </Reveal>

            <Reveal delay={180} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-mono transition-transform hover:scale-[1.03]">
                <Link to="/projects">
                  Explore My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-mono">
                <Link to="/about">About Me</Link>
              </Button>
            </Reveal>

            <Reveal delay={220}>
              <SocialIcons className="mt-6" />
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                AI · Software · Robotics · Systems · Product
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-y border-border bg-card/30" aria-label="Quick statistics">
        <div className="container grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {quickStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <p className="text-2xl md:text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{stat.label}</p>
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
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 70} className="h-full">
                <ProjectCard
                  project={project}
                  onOpen={openProject}
                  variant="featured"
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildingCategories.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/40">
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
        </div>
      </section>

      {/* What I Can Build */}
      <section className="border-t border-border py-20 md:py-28" id="services">
        <div className="container">
          <SectionHeading
            label="Services"
            title="What I Can Build"
            subtitle="I turn ideas into working digital products, from websites and web apps to AI-powered systems."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = serviceIcons[service.icon] ?? Globe;
              return (
                <Reveal key={service.id} delay={i * 60} className="h-full">
                  <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 motion-reduce:hover:translate-y-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-colors group-hover:border-primary/40">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <dl className="mt-5 space-y-2 border-t border-border pt-4">
                      {service.details.map((d) => (
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
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How I think */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Approach" title="How I Think" />
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="h-full">
                <div className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 motion-reduce:hover:translate-y-0">
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card"
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
                <div className="h-full rounded-xl border border-border bg-card p-6 shadow-card">
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
      <section className="border-t border-border py-20 md:py-24">
        <div className="container">
          <Reveal className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Let's build something.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Have an idea, project, competition, or collaboration? Let's talk.
            </p>
            <Button asChild size="lg" className="mt-7 font-mono">
              <Link to="/contact">
                Get in touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <ProjectModal project={selected} open={open} onOpenChange={setOpen} />
    </Layout>
  );
}
