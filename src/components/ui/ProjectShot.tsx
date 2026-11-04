import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";

interface ProjectShotProps {
  project: Project;
  /** Extra classes for the frame the image fills. */
  className?: string;
  /** Above-the-fold screenshots skip lazy loading. */
  priority?: boolean;
  /** Overrides how the asset fills its frame; defaults by asset kind (see below). */
  fit?: "cover" | "contain";
}

/**
 * The one component that paints a project's screenshot.
 *
 * `Project.screenshot` is required: every record publishes exactly one visual
 * asset, vendored in `/public/projects/`. Every surface — card, showcase
 * preview, case study, modal, project page, curtain slider, spotlight — renders
 * it through here, so adding a project only means adding its record and its
 * file. Two kinds of asset live there: a capture of the project's own live site
 * (`*.webp`), and a bespoke illustration (`previews/*.svg`) for projects with no
 * public or accessible site. The artwork is designed, never a faked screenshot:
 * it abstracts the product rather than claiming to be its interface.
 *
 * Fitting follows the asset, because the two kinds fill a frame differently:
 *
 * - A live capture (1200×630, ~1.9:1) fills the frame with `object-cover` and
 *   anchors to the top, where each composition puts its subject. The frame's
 *   own ratio (16:10, 3:2, 16:9) trims the sides, never the product's own top
 *   edge, and the image is never stretched.
 * - A bespoke illustration (1200×800, 1.5:1) is a finished composition that
 *   reaches its bottom margin, so a wide frame (16:9) would cut it off. It is
 *   `object-contain`: the whole drawing shows, centred, on the frame's own
 *   surface instead of being cropped.
 *
 * Every caller's frame supplies the aspect ratio; `h-full w-full` makes the
 * image fill exactly that box, so nothing can overflow it. Pass `fit` only to
 * override the default for one surface.
 */
/**
 * Intrinsic size of the two asset kinds, both 1200 px wide (see AGENTS.md,
 * "One screenshot asset per project"): a live capture is 1200×630, a bespoke
 * illustration is 1200×800. Declaring it lets the browser reserve the box
 * before the file arrives, so a late image cannot shift the layout.
 */
const ASSET_WIDTH = 1200;
const CAPTURE_HEIGHT = 630;
const ARTWORK_HEIGHT = 800;

export function ProjectShot({
  project,
  className,
  priority = false,
  fit,
}: ProjectShotProps) {
  const artwork = /\.svg(\?|$)/i.test(project.screenshot);
  const mode = fit ?? (artwork ? "contain" : "cover");

  return (
    <img
      src={project.screenshot}
      alt={project.imageAlt ?? `${project.name} interface`}
      width={ASSET_WIDTH}
      height={artwork ? ARTWORK_HEIGHT : CAPTURE_HEIGHT}
      loading={priority ? "eager" : "lazy"}
      // The project page's hero and the opened project sheet are the LCP
      // element; everything below the fold stays at the default priority.
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn(
        "block h-full w-full max-h-full max-w-full",
        mode === "contain"
          ? "object-contain object-center"
          : "object-cover object-top",
        className,
      )}
    />
  );
}
