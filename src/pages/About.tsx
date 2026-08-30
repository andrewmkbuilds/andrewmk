import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TechTag } from "@/components/ui/TechTag";
import { buildingCategories, principles, socialLinks } from "@/data/portfolio";
import { getSocialIcon } from "@/components/ui/SocialIcons";

export default function About() {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
                  About
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
                  I don't just learn technology. I apply it.
                </h1>
              </Reveal>

              <div className="mt-8 space-y-6">
                <Reveal delay={60}>
                  <p className="text-lg text-foreground leading-relaxed">
                    I'm a student, builder, and systems thinker based in Dubai. I work across
                    artificial intelligence, software development, robotics, product design, and
                    engineering competitions.
                  </p>
                </Reveal>
                <Reveal delay={120}>
                  <p className="text-muted-foreground leading-relaxed">
                    I started building with robotics at age 9 through the Mbot@IHS programme. That
                    experience gave me the initial instinct to build things physically. From there,
                    I moved deeper into software, AI, computer vision, and product development.
                  </p>
                </Reveal>
                <Reveal delay={180}>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, I build everything from small Python experiments to full product systems
                    such as Gradr, TerraCart, and ClientFlow OS. I also compete in STEM and
                    engineering challenges, participate in MUNs, work on F1 in Schools / STEM
                    Racing, and showcase projects through exhibitions.
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="space-y-8">
              <Reveal delay={80}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    Profile
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="font-mono text-xs text-muted-foreground">Identity</dt>
                      <dd className="text-foreground">
                        Student · Developer · AI Builder · Systems Thinker
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-muted-foreground">Location</dt>
                      <dd className="text-foreground">Dubai, UAE</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs text-muted-foreground">Started building</dt>
                      <dd className="text-foreground">Age 9 · 2022</dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    Elsewhere
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    This portfolio is the hub. These are the rest.
                  </p>
                  <ul className="mt-4 space-y-1">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.id);
                      return (
                        <li key={link.id}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${link.label} profile (${link.handle})`}
                            className="group flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary focus-ring"
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="text-sm text-foreground transition-colors group-hover:text-primary">
                                  {link.label}
                                </span>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {link.handle}
                                </span>
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">
                                {link.description}
                              </span>
                            </span>
                          </a>

                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container">
          <SectionHeading label="Approach" title="How I Think" />
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="h-full">
                <div className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 motion-reduce:hover:translate-y-0">
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
    </Layout>
  );
}
