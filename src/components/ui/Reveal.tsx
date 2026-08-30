import { type ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "li" | "section" | "article" | "span" | "p";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** delay in milliseconds */
  delay?: number;
  as?: RevealTag;
  /** vertical travel distance in px */
  y?: number;
  /** optional slight scale-in for hero-level elements */
  scale?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 18,
  scale = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      ref={ref as never}
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y, scale: scale ? 0.985 : 1 }}
      animate={reduce || inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale: scale ? 0.985 : 1 }}
      transition={{ duration: 0.65, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Reveals children in sequence — use with <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={reduce ? false : "hidden"}
      animate={reduce ? "show" : inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline entrance for display typography. */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
