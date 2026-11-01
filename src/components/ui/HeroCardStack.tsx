import { useRef } from "react";
import { Link } from "@/lib/router-compat";
import { animate, motion, useDragControls, useMotionValue } from "motion/react";
import { ArrowUpRight, Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { TechTag } from "./TechTag";
import { Badge } from "./badge";
import { SketchArrow } from "./Sketch";
import GlareHover from "@/components/reactbits/GlareHover";
import { isFinePointer, setCursorState } from "@/lib/pointer";
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
  /**
   * Dragging is off under reduced motion. On touch the card only claims
   * horizontal gestures (`touch-action: pan-y`), so the page still scrolls
   * vertically when a thumb lands on a card.
   */
  draggable: boolean;
}

/**
 * One taped card. Rotation lives in a motion value so a drag can tilt the card
 * with the pointer's velocity and spring it back to its resting angle on
 * release — the card reads as a physical object rather than a box that moves.
 */
function HeroCard({ project, pos, index, bounds, draggable }: HeroCardProps) {
  const reduce = useHydratedReducedMotion();
  const rotate = useMotionValue(pos.rotate);
  // Banked "3D" tilt while the card is in the air: it leans into the direction
  // it is thrown and settles flat on release.
  const tiltY = useMotionValue(0);
  // Drag starts on a mouse press immediately, but on a touch only after a
  // short hold — so a thumb that just wants to scroll the page is never
  // hijacked into a drag.
  const controls = useDragControls();
  const hold = useRef<number | null>(null);
  const endHold = () => {
    if (hold.current !== null) {
      window.clearTimeout(hold.current);
      hold.current = null;
    }
  };

  return (
    <motion.div
      drag={draggable && !reduce}
      dragListener={false}
      dragControls={controls}
      onPointerDown={(event) => {
        if (!draggable || reduce) return;
        if (event.pointerType === "touch") {
          endHold();
          hold.current = window.setTimeout(
            () => controls.start(event.nativeEvent),
            170,
          );
          return;
        }
        controls.start(event.nativeEvent);
      }}
      onPointerUp={endHold}
      onPointerCancel={endHold}
      onPointerLeave={endHold}
      dragConstraints={bounds}
      dragElastic={0.1}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 30 }}
      onDrag={(_, info) => {
        rotate.set(
          clamp(
            pos.rotate + info.velocity.x * 0.012,
            pos.rotate - 12,
            pos.rotate + 12,
          ),
        );
        tiltY.set(clamp(info.velocity.x * 0.006, -7, 7));
      }}
      onDragStart={() => {
        if (isFinePointer()) setCursorState("grabbing");
      }}
      onDragEnd={() => {
        if (isFinePointer()) setCursorState("grab");
        animate(rotate, pos.rotate, {
          type: "spring",
          stiffness: 260,
          damping: 22,
        });
        animate(tiltY, 0, { type: "spring", stiffness: 190, damping: 18 });
      }}
      initial={reduce ? false : { opacity: 0, y: 26, rotate: pos.rotate * 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.8,
        delay: reduce ? 0 : 0.35 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      // The hover lift is CSS `translate` (see `.hero-card` in styles.css), not
      // a motion `y`: the drag owns `y`, and animating the same channel on
      // hover made a released card spring back vertically on the next hover
      // change. `x` was unaffected, which is why it looked like it worked.
      // `whileDrag` must not touch `y` either: the drag is writing that
      // channel, and the exit animation would drag the card back up by the
      // variant's offset when the finger lifts.
      whileDrag={{
        scale: 1.06,
        zIndex: 60,
        cursor: "grabbing",
        // The card lifts off the page while it is held: deeper, softer shadow.
        boxShadow: "0 34px 64px -22px hsl(220 70% 2% / 0.82)",
      }}
      // No transform transition on the surface: it would lag every drag frame.
      style={{
        rotate,
        rotateX: tiltY,
        transformPerspective: 900,
        touchAction: draggable ? "pan-y" : undefined,
      }}
      data-cursor={draggable && !reduce ? "grab" : undefined}
      className={cn(
        "paper tape absolute p-2.5 focus-within:ring-2 focus-within:ring-gold/50",
        draggable && !reduce && "hero-card cursor-grab",
        pos.className,
      )}
    >
      <div className="relative overflow-hidden rounded-[0.7rem] border border-border/70">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_65%),radial-gradient(90%_80%_at_100%_100%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_70%)]"
        />
        {/* React Bits `GlareHover`: a gold sheen that crosses the card face on
            hover — the card reads as printed stock catching the light. */}
        <GlareHover
          width="100%"
          height="100%"
          borderRadius="0"
          borderColor="transparent"
          background="transparent"
          glareColor="#e9c97c"
          glareOpacity={0.24}
          glareAngle={-28}
          glareSize={52}
          softness={0.7}
          variant="sheen"
          rimGlint={false}
          mode="hover"
          transitionDuration={900}
          className="block w-full"
          style={{ display: "block", width: "100%" }}
        >
          <div className="bg-grid relative flex h-[92px] items-end p-3 sm:h-[104px]">
            <p className="serif-display text-[1.55rem] text-foreground sm:text-[1.8rem]">
              {project.name}
            </p>
          </div>
        </GlareHover>

        {draggable && !reduce ? (
          <span aria-hidden="true" className="card-grip">
            <Grip className="h-3 w-3" />
            drag
          </span>
        ) : null}
      </div>

      <div className="px-1 pt-2.5 pb-1">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
          {project.category}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="flex flex-wrap gap-1">
            {project.tech.slice(0, 2).map((t) => (
              <TechTag key={t}>{t}</TechTag>
            ))}
          </span>
          <Link
            to={`/projects/${project.slug}`}
            aria-label={`Open the ${project.name} case study`}
            className="focus-ring rounded-sm"
          >
            <Badge tone="category" size="sm" className="badge-link">
              <span className="badge-label">Case study</span>
              <ArrowUpRight
                className="badge-icon badge-arrow"
                aria-hidden="true"
              />
            </Badge>
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
      {/* Hand-written invitation. It sits in the gap above the top card and
          its arrow curves down onto it, so the cue points at the thing it is
          talking about. Hidden on phones, where the stack fills the column and
          the label would land on a card. */}
      <div
        aria-hidden="true"
        className="drag-hint pointer-events-none absolute -top-10 left-[3%] z-40 hidden -rotate-[4deg] flex-col items-start gap-0.5 sm:flex"
      >
        <span className="note-hand text-[1.05rem] tracking-[0.08em] uppercase">
          Drag me
        </span>
        <SketchArrow className="drag-hint-arrow ml-5 h-7 w-16 rotate-[68deg] text-gold/85" />
      </div>

      {projects.slice(0, 3).map((project, i) => (
        <HeroCard
          key={project.slug}
          project={project}
          pos={layout[i] ?? fallbackPosition}
          index={i}
          bounds={bounds}
          draggable
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
