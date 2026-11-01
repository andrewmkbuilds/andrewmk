import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { Link } from "@/lib/router-compat";
import { animate, motion, useMotionValue } from "motion/react";
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
 * angles. Visitors can drag them anywhere inside the hero column and they stay
 * exactly where they are dropped. Every card links to its case study through a
 * small, explicit affordance so a drag never navigates by accident.
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

/** How far a pointer may travel on touch before it counts as a page scroll. */
const TOUCH_SLOP = 8;
/** A thumb must rest this long before the card is picked up. */
const TOUCH_HOLD_MS = 170;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface DragRange {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * The offsets that keep a card's box inside its container, measured from the
 * real geometry at drag time so the range follows the responsive layout
 * instead of a hardcoded screen coordinate.
 */
function measureRange(
  el: HTMLElement,
  container: HTMLElement,
  offsetX: number,
  offsetY: number,
): DragRange {
  const rect = el.getBoundingClientRect();
  const box = container.getBoundingClientRect();
  const baseLeft = rect.left - offsetX;
  const baseTop = rect.top - offsetY;

  let minX = box.left - baseLeft;
  let maxX = box.right - (baseLeft + rect.width);
  let minY = box.top - baseTop;
  let maxY = box.bottom - (baseTop + rect.height);

  // A card wider/taller than its column can only be centred.
  if (maxX < minX) minX = maxX = (minX + maxX) / 2;
  if (maxY < minY) minY = maxY = (minY + maxY) / 2;

  return { minX, maxX, minY, maxY };
}

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  range: DragRange;
  active: boolean;
  holdTimer: number | null;
  lastX: number;
  lastTime: number;
}

interface HeroCardProps {
  project: Project;
  pos: { rotate: number; className: string };
  index: number;
  bounds: RefObject<HTMLDivElement | null>;
  /** Dragging is off under reduced motion. */
  draggable: boolean;
}

/**
 * One taped card.
 *
 * Two elements, on purpose:
 *  - the outer `motion.div` owns the *position*. Its `x`/`y` are motion values
 *    that only a real drag writes — nothing animates them, nothing restores
 *    them, so a released card keeps its coordinates across re-renders, scroll,
 *    hover and other cards being dragged;
 *  - the inner `.hero-card` owns the *look*: entry animation, drag bank/tilt,
 *    the CSS hover lift and the glare sheen. Nothing here can move the card.
 *
 * Drag is plain Pointer Events rather than motion's `drag` prop: `drag` shares
 * the motion values with the `animate` prop, and the entrance animation
 * (`y: 0`) replayed on the next render and pulled dropped cards back to their
 * layout slot about a second later.
 */
function HeroCard({ project, pos, index, bounds, draggable }: HeroCardProps) {
  const reduce = useHydratedReducedMotion();
  const wrapper = useRef<HTMLDivElement>(null);

  // Persistent drop position. Written only by the drag handlers below.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Visual-only channels, layered on the inner element.
  const rotate = useMotionValue(pos.rotate);
  const tiltY = useMotionValue(0);
  const scale = useMotionValue(1);

  const [dragging, setDragging] = useState(false);
  const gesture = useRef<Gesture | null>(null);

  const clearHold = () => {
    const g = gesture.current;
    if (g?.holdTimer != null) {
      window.clearTimeout(g.holdTimer);
      g.holdTimer = null;
    }
  };

  const begin = useCallback(() => {
    const g = gesture.current;
    const el = wrapper.current;
    if (!g || !el || g.active) return;
    g.active = true;
    clearHold();
    try {
      el.setPointerCapture(g.pointerId);
    } catch {
      /* synthetic pointer or capture unsupported — the handlers still work */
    }
    setDragging(true);
    animate(scale, 1.05, { duration: 0.16, ease: [0.22, 1, 0.36, 1] });
    if (isFinePointer()) setCursorState("grabbing");
  }, [scale]);

  const end = useCallback(
    (settle: boolean) => {
      const g = gesture.current;
      if (!g) return;
      clearHold();
      gesture.current = null;
      const el = wrapper.current;
      try {
        if (el?.hasPointerCapture(g.pointerId))
          el.releasePointerCapture(g.pointerId);
      } catch {
        /* capture already gone */
      }
      setDragging(false);
      animate(scale, 1, { type: "spring", stiffness: 320, damping: 26 });
      if (!settle) return;
      // Only the tilt/bank settle; the drop position is never touched.
      animate(rotate, pos.rotate, {
        type: "spring",
        stiffness: 260,
        damping: 22,
      });
      animate(tiltY, 0, { type: "spring", stiffness: 190, damping: 18 });
      if (isFinePointer()) setCursorState("grab");
    },
    [pos.rotate, rotate, scale, tiltY],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || reduce) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const el = wrapper.current;
    const container = bounds.current;
    if (!el || !container || gesture.current) return;
    // Links and buttons inside the card keep working: never start a drag on them.
    if ((event.target as Element).closest("a, button, [role='button']")) return;

    const originX = x.get();
    const originY = y.get();
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX,
      originY,
      range: measureRange(el, container, originX, originY),
      active: false,
      holdTimer: null,
      lastX: event.clientX,
      lastTime: event.timeStamp,
    };

    if (event.pointerType === "touch") {
      // Hold to pick up; a swipe still scrolls the page.
      gesture.current.holdTimer = window.setTimeout(begin, TOUCH_HOLD_MS);
    } else {
      begin();
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.pointerId !== event.pointerId) return;

    if (!g.active) {
      const travelled = Math.hypot(
        event.clientX - g.startX,
        event.clientY - g.startY,
      );
      if (travelled > TOUCH_SLOP) end(false); // that was a scroll, not a drag
      return;
    }

    x.set(
      clamp(g.originX + event.clientX - g.startX, g.range.minX, g.range.maxX),
    );
    y.set(
      clamp(g.originY + event.clientY - g.startY, g.range.minY, g.range.maxY),
    );

    // Bank the card into the throw. Purely visual.
    const dt = Math.max(event.timeStamp - g.lastTime, 1);
    const vx = (event.clientX - g.lastX) / dt;
    g.lastX = event.clientX;
    g.lastTime = event.timeStamp;
    rotate.set(clamp(pos.rotate + vx * 5, pos.rotate - 10, pos.rotate + 10));
    tiltY.set(clamp(vx * 4, -7, 7));
  };

  // A touch drag started after the hold must keep the page still, and a plain
  // swipe must not be swallowed (`touch-action: pan-y` decides that at touchstart).
  useEffect(() => {
    const el = wrapper.current;
    if (!el || !draggable) return;
    const onTouchMove = (event: TouchEvent) => {
      if (gesture.current?.active) event.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [draggable]);

  // A breakpoint change can leave a dropped card outside the column: pull it
  // back in. This only clamps; it never returns a card to its layout slot.
  useEffect(() => {
    if (!draggable) return;
    const onResize = () => {
      const el = wrapper.current;
      const container = bounds.current;
      if (!el || !container || gesture.current) return;
      const range = measureRange(el, container, x.get(), y.get());
      x.set(clamp(x.get(), range.minX, range.maxX));
      y.set(clamp(y.get(), range.minY, range.maxY));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bounds, draggable, x, y]);

  useEffect(() => clearHold, []);

  return (
    <motion.div
      ref={wrapper}
      className={cn("absolute", pos.className)}
      style={{
        x,
        y,
        zIndex: dragging ? 70 : undefined,
        touchAction: draggable && !reduce ? "pan-y" : undefined,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(true)}
      onPointerLeave={() => {
        if (gesture.current && !gesture.current.active) end(false);
      }}
      data-cursor={draggable && !reduce ? "grab" : undefined}
      data-card={project.slug}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : 0.8,
          delay: reduce ? 0 : 0.35 + index * 0.12,
          ease: [0.22, 1, 0.36, 1],
        }}
        // The hover lift is CSS `translate` (see `.hero-card` in styles.css) and
        // these motion values are visual only: the drag writes the wrapper, so
        // no effect here can move the card off the spot the visitor chose.
        style={{ rotate, rotateX: tiltY, scale, transformPerspective: 900 }}
        className={cn(
          "hero-card paper tape w-full p-2.5 focus-within:ring-2 focus-within:ring-gold/50",
          draggable && !reduce && "cursor-grab",
          dragging && "is-dragging",
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
