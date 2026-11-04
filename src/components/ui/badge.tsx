import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge primitives.
 *
 * Each tone is its own physical object rather than a recoloured pill: a
 * technology chip is squared and mono, an award is gold with a moving sheen,
 * a live status carries a pulsing dot, a link badge slides its arrow. The
 * shapes, borders and micro-motions live in `styles.css` (`.badge*`), so a
 * badge is one class away anywhere in the site.
 */
const badgeVariants = cva("badge", {
  variants: {
    tone: {
      neutral: "badge-neutral",
      tech: "badge-tech",
      status: "badge-status",
      achievement: "badge-achievement",
      certification: "badge-certification",
      skill: "badge-skill",
      role: "badge-role",
      category: "badge-category",
      external: "badge-external",
      live: "badge-live",
      featured: "badge-featured",
    },
    size: {
      sm: "badge-sm",
      md: "",
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "md",
  },
});

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
