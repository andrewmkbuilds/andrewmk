import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  place: string;
  detail?: string;
  event?: string;
  index?: number;
  className?: string;
  /** Optional proof action linking the result to a real certificate. */
  onViewProof?: () => void;
}

export function AchievementCard({
  place,
  detail,
  event,
  index,
  className,
  onViewProof,
}: AchievementCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? {} : { y: -4 }}
      className={cn(
        "surface spotlight edge-glow lift-3d group relative isolate overflow-hidden rounded-xl p-5",
        "transition-colors duration-300 hover:border-primary/40",
        className,
      )}
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
    >
      {typeof index === "number" && (
        <span
          aria-hidden="true"
          className="absolute right-4 top-3 font-mono text-4xl font-semibold text-foreground/[0.045] transition-colors duration-300 group-hover:text-primary/15"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <p className="relative font-mono text-sm text-primary">{place}</p>
      {detail && (
        <h3 className="relative mt-2 text-lg font-semibold leading-snug text-foreground">
          {detail}
        </h3>
      )}
      {event && <p className="relative mt-1 text-sm text-muted-foreground">{event}</p>}
      {onViewProof && (
        <button
          type="button"
          onClick={onViewProof}
          className="focus-ring relative mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          View Certificate <span aria-hidden="true">&rarr;</span>
        </button>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-primary/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.article>
  );
}
