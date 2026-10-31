import { useRef } from "react";
import { Link } from "@/lib/router-compat";
import { animate, motion, useMotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { TechTag } from "./TechTag";
import type { Project } from "@/data/portfolio";

interface HeroCardStackProps {
  projects: Project[];
  className?: string;
}

/**
 * The hero's signature surface: real product cards taped to the page at slight
 * angles. Visitors can drag them around — they spring back inside their frame.
 * Every card links to its case study through a small, explicit affordance so a
 * drag never navigates by accident.
 */
const layout: { rotate: number; className: string }[] = [
  { rotate: -5.5, className: "left-[2%] top-[4%] w-[58%] z-20" },
  { rotate: 4, className: "right-[0%] top-[24%] w-[54%] z-30" },
  { rotate: -1.5, className: "left-[16%] bottom-0 w-[62%] z-10" },
];

const fallbackPosition = {
  rotate: -3,
  className: "left-[4%] top-[6%] w-[58%] z-20",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface HeroCardProps {
  project: Project;
  pos: { rotate: number; className: string };
  index: number;
  bounds: React.RefObject<HTMLDivElement | null>;
}

/**
 * One taped card. Rotation lives in a motion value so a drag can tilt the card
 * with the pointer's velocity and spring it back to its resting angle on
 * release — the card reads as a physical object rather than a box that moves.
 */
function HeroCard({ project, pos, index, bounds }: HeroCardProps) {
  const reduce = useHydratedReducedMotion();
  const rotate = useMotionValue(pos.rotate);

  return (
    <motion.div
      drag={!reduce}
      dragConstraints={bounds}
      dragElastic={0.14}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 30 }}
      onDrag={(_, info) =>
        rotate.set(
          clamp(
            pos.rotate + info.velocity.x * 0.012,
            pos.rotate - 12,
            pos.rotate + 12,
          ),
        )
      }
      onDragEnd={() =>
        animate(rotate, pos.rotate, {
          type: "spring",
          stiffness: 260,
          damping: 22,
        })
      }
      initial={reduce ? false : { opacity: 0, y: 26, rotate: pos.rotate * 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.8,
        delay: reduce ? 0 : 0.35 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        reduce
          ? {}
          : {
              y: -6,
              scale: 1.015,
              boxShadow: "0 40px 70px -34px hsl(220 60% 2% / 0.95)",
            }
      }
      whileDrag={{
        scale: 1.05,
        zIndex: 60,
        cursor: "grabbing",
        boxShadow: "0 46px 80px -32px hsl(220 60% 2% / 1)",
      }}
      style={{ rotate }}
      className={cn(
        "paper tape absolute p-2.5 focus-within:ring-2 focus-within:ring-gold/50",
        !reduce && "cursor-grab motion-reduce:cursor-auto",
        pos.className,
      )}
    >
      <div className="relative overflow-hidden rounded-[0.7rem] border border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_65%),radial-gradient(90%_80%_at_100%_100%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%)]"
        />
        <div className="bg-grid relative flex h-[92px] items-end p-3 sm:h-[104px]">
          <p className="serif-display text-[1.55rem] text-foreground sm:text-[1.8rem]">
            {project.name}
          </p>
        </div>
      </div>

      <div className="px-1 pt-2.5 pb-1">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
          {project.category}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="flex flex-wrap gap-1">
            {project.tech.slice(0, 2).map((t) => (
              <TechTag key={t}>{t}</TechTag>
            ))}
          </span>
          <Link
            to={`/projects/${project.slug}`}
            aria-label={`Open the ${project.name} case study`}
            className="focus-ring inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/20"
          >
            Case study
            <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroCardStack({ projects, className }: HeroCardStackProps) {
  const bounds = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={bounds}
      className={cn(
        "relative h-[420px] w-full select-none sm:h-[470px] lg:h-[520px]",
        className,
      )}
    >
      {/* handwritten invitation */}
      <p
        aria-hidden="true"
        className="note-hand absolute -top-2 right-2 z-40 rotate-3 text-sm sm:text-base"
      >
        go on, drag one
        <svg
          viewBox="0 0 60 24"
          className="ml-6 h-4 w-14 text-gold/70"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M2 4c10 10 24 14 40 12" />
          <path d="M34 12l9 4-6 6" />
        </svg>
      </p>

      {projects.slice(0, 3).map((project, i) => (
        <HeroCard
          key={project.slug}
          project={project}
          pos={layout[i] ?? fallbackPosition}
          index={i}
          bounds={bounds}
        />
      ))}

      {/* floating fact stickers, part of the hero's paper collage */}
      <span className="sticker sticker-gold absolute right-[6%] top-[2%] z-40 hidden sm:inline-flex">
        Dubai, UAE
      </span>
      <span className="sticker absolute bottom-[8%] right-[4%] z-40 hidden rotate-2 md:inline-flex">
        Building since age 9
      </span>
    </div>
  );
}
