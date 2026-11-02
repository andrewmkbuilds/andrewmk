import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";

interface ProjectShotProps {
  project: Project;
  /** Extra classes for the frame the image fills. */
  className?: string;
  /** Above-the-fold screenshots skip lazy loading. */
  priority?: boolean;
}

/**
 * The one component that paints a project's screenshot.
 *
 * `Project.screenshot` is the project's single visual asset, vendored in
 * `/public/projects/`. Every surface — card, showcase preview, case study,
 * modal, project page, slider — renders it through here, so adding a project
 * only means adding its record and its file. Two kinds of asset live there:
 * a capture of the project's own live site (`*.webp`), and a bespoke
 * illustration (`previews/*.svg`) for projects with no public or accessible
 * site. The artwork is designed, never a faked screenshot: it abstracts the
 * product rather than claiming to be its interface. A record without an asset
 * renders nothing and the caller keeps its typographic plate.
 *
 * The image is never stretched: it fills the frame with `object-cover` and
 * anchors to the top of the asset, where each composition puts its subject.
 */
export function ProjectShot({
  project,
  className,
  priority = false,
}: ProjectShotProps) {
  if (!project.screenshot) return null;

  return (
    <img
      src={project.screenshot}
      alt={project.imageAlt ?? `${project.name} interface`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("block h-full w-full object-cover object-top", className)}
    />
  );
}
