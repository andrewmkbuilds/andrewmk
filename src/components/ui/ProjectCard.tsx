import { Link } from "react-router-dom";
import { TechTag } from "./TechTag";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  stack: string[];
  impact: string;
  slug: string;
  className?: string;
}

export function ProjectCard({ name, description, stack, impact, slug, className }: ProjectCardProps) {
  return (
    <Link to={`/work/${slug}`}>
      <article
        className={cn(
          "group p-6 bg-card border border-border rounded-lg transition-all hover:border-primary/50 hover:bg-card/80 cursor-pointer",
          className
        )}
      >
        {/* Project Name */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-mono text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {stack.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>

        {/* Impact */}
        <div className="pt-4 border-t border-border">
          <span className="font-mono text-xs text-primary">
            <span className="text-muted-foreground">{"//"}</span> {impact}
          </span>
        </div>
      </article>
    </Link>
  );
}
