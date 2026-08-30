import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { timeline } from "@/data/portfolio";

/**
 * Signature journey timeline: a scroll-linked progress spine with year markers
 * that light up as the visitor moves through Andrew's development journey.
 */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <ol ref={ref} className="relative m-0 list-none space-y-12 pl-8 md:space-y-16 md:pl-12">
      {/* spine */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-px bg-border md:left-1"
      />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: reduce ? 1 : progress }}
        className="absolute left-0 top-2 bottom-2 w-px origin-top bg-linear-to-b from-primary via-primary to-primary/20 md:left-1"
      />

      {timeline.map((entry, index) => (
        <motion.li
          key={entry.year + entry.title}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group relative"
        >
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            whileInView={reduce ? {} : { scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-8 top-1.5 flex h-3.5 w-3.5 items-center justify-center md:-left-[2.6rem]"
          >
            <span className="absolute h-3.5 w-3.5 rounded-full bg-primary/20 transition-transform duration-500 group-hover:scale-150" />
            <span className="relative h-[7px] w-[7px] rounded-full bg-primary shadow-glow" />
          </motion.span>

          <div className="surface spotlight relative overflow-hidden rounded-xl p-6 transition-colors duration-300 hover:border-primary/35 md:p-7"
            onPointerMove={(e) => {
              const el = e.currentTarget as HTMLElement;
              const rect = el.getBoundingClientRect();
              el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
              el.style.setProperty("--my", `${e.clientY - rect.top}px`);
            }}
          >
            <div className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
                {entry.year}
              </p>
              <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-display mt-3 text-2xl text-foreground md:text-3xl">
              {entry.title}
            </h3>
            {entry.meta && <p className="mt-2 font-mono text-xs text-primary">{entry.meta}</p>}

            <div className="mt-4 space-y-2">
              {entry.body.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {line}
                </p>
              ))}
            </div>

            {entry.points && (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
