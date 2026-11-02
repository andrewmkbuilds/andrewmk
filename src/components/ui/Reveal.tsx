import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "li" | "section" | "article" | "span" | "p";

/**
 * Scroll reveal, done by the compositor.
 *
 * A single shared IntersectionObserver adds one class when an element first
 * enters the viewport; the movement itself is a plain CSS transition on
 * `opacity` + `transform`. That replaces dozens of per-element motion
 * components, springs and inline styles the previous build mounted — same
 * feel, a fraction of the main-thread work.
 *
 * Reduced motion is handled in CSS (`styles.css`), so the server and client
 * markup stay identical.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );
  return observer;
}

/** Shared reveal hook — also used by the hand-drawn sketch layer. */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  return useRevealRef<T>();
}

function useRevealRef<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return ref;
}

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
  /**
   * Entrance family. Every variant is CSS-only and shares the same observer.
   * - rise: fade + travel (default)
   * - mask: the element is unveiled from the bottom edge
   * - clip: the element is wiped in from the left
   */
  variant?: "rise" | "mask" | "clip";
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 18,
  scale = false,
  variant = "rise",
}: RevealProps) {
  const ref = useRevealRef<HTMLElement>();
  const Comp = as as ElementType;
  // A clipped reveal keeps its clip-path on an inner wrapper. Chrome reports a
  // target clipped to zero height as never intersecting, so an element carrying
  // `.reveal-mask` itself could never trigger its own reveal and stayed hidden.
  const clipped = variant === "mask" || variant === "clip";

  return (
    <Comp
      ref={ref}
      className={cn("reveal", scale && !clipped && "reveal-scale", className)}
      style={
        {
          "--reveal-y": `${y}px`,
          transitionDelay: delay ? `${delay}ms` : undefined,
        } as CSSProperties
      }
    >
      {clipped ? (
        <div className={variant === "mask" ? "reveal-mask" : "reveal-clip"}>
          {children}
        </div>
      ) : (
        children
      )}
    </Comp>
  );
}

/** Reveals children together. Kept for API compatibility with RevealItem. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return <Reveal className={className ?? ""}>{children}</Reveal>;
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
    <Reveal className={className ?? ""} y={y}>
      {children}
    </Reveal>
  );
}

/**
 * Word-by-word headline entrance for display typography — pure CSS keyframes
 * with a per-word delay, so it never blocks hydration or the main thread.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className="reveal-word"
            style={{
              animationDelay: `${Math.round((delay + i * 0.045) * 1000)}ms`,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
