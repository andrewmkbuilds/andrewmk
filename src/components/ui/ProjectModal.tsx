import { ExternalLink, Github, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { TechTag } from "./TechTag";
import { BuiltBy, PlatformBadge } from "./BuiltBy";
import type { Project } from "@/data/portfolio";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Premium project presentation surface — a full case sheet, not a plain modal. */
export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const reduce = useReducedMotion();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="surface grain fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl"
              >
                {/* animated background elements */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden rounded-t-2xl"
                >
                  <div className="absolute inset-0 bg-grid opacity-50" />
                  <motion.div
                    className="absolute -top-24 left-1/3 h-64 w-96 rounded-full bg-primary/12 blur-[100px]"
                    animate={reduce ? {} : { x: [0, 40, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <DialogPrimitive.Close
                  className="focus-ring absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Close project details"
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>

                <div className="relative p-6 md:p-9">
                  <motion.header
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.06, ease: EASE }}
                    className="max-w-2xl"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                      {project.category}
                    </p>
                    <DialogPrimitive.Title className="text-display mt-3 text-3xl text-foreground md:text-5xl">
                      {project.name}
                    </DialogPrimitive.Title>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    {project.previously && (
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {project.previously}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <PlatformBadge project={project} />
                      {project.tech.map((tech) => (
                        <TechTag key={tech}>{tech}</TechTag>
                      ))}
                    </div>
                  </motion.header>

                  <motion.div
                    initial={reduce ? false : "hidden"}
                    animate={reduce ? {} : "show"}
                    variants={{
                      hidden: {},
                      show: { transition: { staggerChildren: 0.07, delayChildren: 0.14 } },
                    }}
                    className="mt-9 space-y-7"
                  >
                    {project.problem && (
                      <Section title="Problem">
                        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                          {project.problem}
                        </p>
                      </Section>
                    )}

                    <Section title="What I built">
                      <ul className="grid gap-2.5 sm:grid-cols-2">
                        {project.built.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-background/40 p-3 text-sm text-muted-foreground"
                          >
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Section>

                    <Section title="Current status">
                      <p className="font-mono text-sm text-foreground">{project.status}</p>
                    </Section>

                    <Section title="Built by Andrew">
                      <BuiltBy project={project} />
                    </Section>

                    {(project.live || project.github) && (
                      <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-3 border-t border-border pt-6"
                      >
                        {project.live && (
                          <Button asChild className="font-mono">
                            <a href={project.live} target="_blank" rel="noopener noreferrer">
                              Live app
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {project.github && (
                          <Button asChild variant="outline" className="font-mono">
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              GitHub
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section variants={itemVariants}>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{title}</h3>
        <span className="hairline-x flex-1" aria-hidden="true" />
      </div>
      {children}
    </motion.section>
  );
}
