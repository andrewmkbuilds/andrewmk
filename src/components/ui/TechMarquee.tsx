import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import type { MarqueeItem } from "@/data/toolMarquee";

interface TechMarqueeProps {
  items: MarqueeItem[];
  reverse?: boolean;
  className?: string;
  label: string;
}

/**
 * Infinite ribbon of tools. The loop is a single CSS transform animation on a
 * compositor layer — no JavaScript positions anything per frame. It pauses when
 * the ribbon is off-screen or the tab is hidden, hovering pauses it, and under
 * prefers-reduced-motion it becomes a static wrapped list.
 *
 * Two sizes of chip carry the hierarchy: the five headline platforms are large
 * and gold-edged, everything else rides past compactly.
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
  const duration = items.length * 2.8;

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
      className={cn("marquee-group", copy && "marquee-track-copy")}
    >
      {items.map((item, index) => {
        const primary = item.tier === "primary";
        return (
          <li
            key={`${item.name}-${index}`}
            className={cn("marquee-chip", primary && "marquee-chip-primary")}
          >
            <span className="marquee-chip-mark" aria-hidden="true">
              <BrandLogo
                name={item.name}
                size={primary ? "lg" : "md"}
                className="marquee-brand"
                fallback={<span className="marquee-chip-dot" />}
              />
            </span>
            <span className="marquee-chip-label">{item.name}</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={cn("marquee", className)} aria-label={label} role="group">
      <div
        ref={trackRef}
        className={cn("marquee-track", reverse && "marquee-track-reverse")}
        style={{
          animationDuration: `${reverse ? duration * 1.18 : duration}s`,
        }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
