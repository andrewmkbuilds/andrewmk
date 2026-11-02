import { useCallback, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Stacking cards, adapted from the supplied "StackingCards" component.
 *
 * What changed from the supplied code, and why:
 *
 * 1. **`motion/react` instead of GSAP + ScrollTrigger.** The site already
 *    ships motion and the integration protocol forbids a second animation
 *    library, so the same scroll progress drives each card here.
 * 2. **Typographic plates, not photos.** The demo is built from stock
 *    imagery; this portfolio has never published product screenshots, so a
 *    card is laid out from its own record (year, title, meta, body, real
 *    milestones) and never from filler imagery.
 * 3. **Transform + opacity only.** The supplied card clip-path shrinks the
 *    card's frame per frame; here the covered card sinks with
 *    `yPercent`/`scale`/`rotate` and a shade overlay, which stays on the
 *    compositor (see the performance budget in AGENTS.md).
 * 4. **No `useReducedMotion()`.** It resolves differently on the server, so
 *    reduced motion is read from `useHydratedReducedMotion()`; the plain
 *    list of cards renders instead of the pinned stack.
 *
 * The stack keeps the screen while you scroll: card 1 slides up over card 0,
 * which sinks, shrinks, tilts and darkens underneath it, and so on. The
 * counter at the bottom shows which chapter you are in and jumps to any of
 * them on click or keyboard.
 */

export interface StackingCardItem {
  /** The label line on the plate — the year on the journey timeline. */
  eyebrow: string;
  title: string;
  meta?: string | undefined;
  body?: string[] | undefined;
  /** Real milestones from the entry; rendered as chips, never as invented copy. */
  points?: string[] | undefined;
}

interface StackingCardsProps {
  items: StackingCardItem[];
  /** Accessible name of the section. */
  ariaLabel?: string;
  className?: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function CardFace({
  item,
  index,
  total,
}: {
  item: StackingCardItem;
  index: number;
  total: number;
}) {
  return (
    <article className="stack-face">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold">
          {item.eyebrow}
        </p>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {pad2(index + 1)} / {pad2(total)}
        </span>
      </div>

      <h3 className="stack-title headline-3d font-semibold text-balance text-foreground">
        {item.title}
      </h3>

      {item.meta ? (
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary">
          {item.meta}
        </p>
      ) : null}

      <div className="stack-copy">
        {item.body?.map((line) => (
          <p
            key={line}
            className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm md:text-[15px]"
          >
            {line}
          </p>
        ))}

        {item.points?.length ? (
          <ul className="stack-points">
            {item.points.map((point) => (
              <li key={point} className="stack-point">
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <span aria-hidden="true" className="stack-year">
        {item.eyebrow}
      </span>
    </article>
  );
}

/**
 * One card in the pinned stack. Its own hooks derive two progress channels
 * from the shared scroll progress: how far it has slid in, and how far it has
 * been covered by the card behind it.
 */
function StackedCard({
  item,
  index,
  total,
  progress,
}: {
  item: StackingCardItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const steps = total - 1;

  const enter = useTransform(progress, (p) => clamp01(p * steps - index + 1));
  const cover = useTransform(progress, (p) => clamp01(p * steps - index));

  const y = useTransform([enter, cover], (latest: number[]) => {
    const [e = 0, c = 0] = latest;
    return `${(1 - e) * 101 + c * 12}%`;
  });
  const scale = useTransform(cover, [0, 1], [1, 0.9]);
  const rotate = useTransform(cover, [0, 1], [0, 2]);
  const shade = useTransform(cover, [0, 1], [0, 0.55]);

  return (
    <li className="stack-card">
      <motion.div className="stack-card-inner" style={{ y, scale, rotate }}>
        <CardFace item={item} index={index} total={total} />
        <motion.span
          aria-hidden="true"
          className="stack-shade"
          style={{ opacity: shade }}
        />
      </motion.div>
    </li>
  );
}

export function StackingCards({
  items,
  ariaLabel = "Milestones",
  className,
}: StackingCardsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useHydratedReducedMotion();
  const total = items.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.max(0, Math.min(total - 1, Math.round(p * (total - 1))));
    setActive((prev) => (prev === next ? prev : next));
  });

  // Jump to a chapter: the tick buttons are the only controls, so this has to
  // work for keyboard and pointer alike.
  const goTo = useCallback(
    (i: number) => {
      const el = rootRef.current;
      if (!el || total < 2) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + travel * (i / (total - 1)),
        behavior: "smooth",
      });
    },
    [total],
  );

  // Reduced motion and a single-entry stack get the plain list of cards.
  if (reduce || total < 2) {
    return (
      <section
        className={cn("stack-cards stack-cards-static", className)}
        aria-label={ariaLabel}
      >
        <ol className="stack-static-list">
          {items.map((item, i) => (
            <li key={item.eyebrow + item.title}>
              <CardFace item={item} index={i} total={total} />
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={cn("stack-cards", className)}
      aria-label={ariaLabel}
      style={{ "--stack-count": total } as CSSProperties}
    >
      <div className="stack-stage">
        <div className="stack-view">
          <ol className="stack-frame">
            {items.map((item, i) => (
              <StackedCard
                key={item.eyebrow + item.title}
                item={item}
                index={i}
                total={total}
                progress={scrollYProgress}
              />
            ))}
          </ol>

          <div className="stack-index">
            <span className="stack-count" aria-hidden="true">
              <span className="stack-num">
                <span
                  className="stack-num-track"
                  style={{ transform: `translateY(${-active * 20}px)` }}
                >
                  {items.map((_, i) => (
                    <span key={i}>{pad2(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className="stack-total">{`/ ${pad2(total)}`}</span>
            </span>

            <span className="stack-ticks">
              {items.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  className="stack-tick focus-ring"
                  data-filled={i <= active ? "true" : "false"}
                  aria-label={item.title}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
