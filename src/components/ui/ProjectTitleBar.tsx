import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router-compat";

interface ProjectTitleBarProps {
  name: string;
  /** Id of the page's own <h1>, whose position drives the bar. */
  targetId?: string;
}

/**
 * The case study's name, kept at the top of the page.
 *
 * The hero <h1> scrolls away with its screenshot, so the reader loses track of
 * which project they are in half-way down a long case study. This bar sits in
 * the article flow directly under the hero and sticks below the site header
 * once the <h1> has scrolled out of view — no layout shift (the space is
 * reserved once) and nothing to click through while it is hidden.
 */
export function ProjectTitleBar({
  name,
  targetId = "project-title",
}: ProjectTitleBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setVisible(!entry.isIntersecting);
      },
      // The site header floats over the top ~72px, so treat that strip as
      // "not visible" and reveal the bar as the title passes behind it.
      { rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      className="project-bar"
      data-visible={visible ? "true" : "false"}
      // While it is parked in the flow under the hero it is invisible, so its
      // link must not be a tab stop or announced twice.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="container flex h-11 items-center gap-3">
        <Link
          to="/projects"
          className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-md font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          All projects
        </Link>
        <span className="h-4 w-px shrink-0 bg-border" aria-hidden="true" />
        <p className="project-bar-name">{name}</p>
        <span className="ml-auto hidden shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground sm:block">
          Case study
        </span>
      </div>
    </div>
  );
}
