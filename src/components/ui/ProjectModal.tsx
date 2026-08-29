import { ExternalLink, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TechTag } from "./TechTag";
import type { Project } from "@/data/portfolio";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl border-border bg-card">
        {project && (
          <>
            <DialogHeader className="text-left">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                {project.category}
              </p>
              <DialogTitle className="text-2xl md:text-3xl font-semibold">
                {project.name}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {project.description}
              </DialogDescription>
            </DialogHeader>

            {project.previously && (
              <p className="font-mono text-xs text-muted-foreground">{project.previously}</p>
            )}

            <div className="space-y-6 pt-2">
              <section>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent mb-3">
                  {project.problem ? "Problem" : "What it is"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.problem ?? project.description}
                </p>
              </section>

              <section>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent mb-3">
                  What I built
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.built.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent mb-3">
                  Technology
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <TechTag key={tech}>{tech}</TechTag>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent mb-3">
                  Current status
                </h3>
                <p className="font-mono text-sm text-foreground">{project.status}</p>
              </section>

              {(project.live || project.github) && (
                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
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
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
