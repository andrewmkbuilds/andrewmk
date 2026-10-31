import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
  label: string;
}

/**
 * Infinite ribbon of tools. The loop is a single CSS transform animation on a
 * compositor layer — no JavaScript positions anything per frame. It pauses when
 * the ribbon is off-screen or the tab is hidden, hovering pauses it, and under
 * prefers-reduced-motion it becomes a static wrapped list.
 */
export function TechMarquee({
  items,
  reverse,
  className,
  label,
}: TechMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Constant reading speed: the loop takes longer as the row gets longer,
  // so a wide row does not whip past faster than a short one.
  const duration = items.length * 5;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let onScreen = true;
    const sync = () => {
      track.dataset["paused"] = onScreen && !document.hidden ? "false" : "true";
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    io.observe(track);

    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const group = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={cn(
        "flex shrink-0 list-none items-center gap-2.5 p-0 pr-2.5",
        copy && "marquee-track-copy",
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 font-mono text-[12px] whitespace-nowrap text-foreground/85 shadow-[var(--elev-1)] transition-colors duration-300 hover:border-gold/40 hover:text-foreground"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gold/70"
          />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee", className)} aria-label={label} role="group">
      <div
        ref={trackRef}
        className={cn("marquee-track", reverse && "marquee-track-reverse")}
        style={{ animationDuration: `${reverse ? duration * 1.26 : duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
