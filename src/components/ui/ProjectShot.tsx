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
 * `Project.screenshot` is a capture of that project's own live site, vendored in
 * `/public/projects/`. Every surface — card, showcase preview, case study,
 * modal, project page, slider — renders it through here, so adding a project
 * only means adding its record and its file. A record without a screenshot
 * renders nothing and the caller keeps its typographic plate.
 *
 * The image is never stretched: it fills the frame with `object-cover` and
 * anchors to the top of the capture, where the product's own header and first
 * screen sit.
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
