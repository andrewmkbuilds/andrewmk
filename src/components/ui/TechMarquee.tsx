import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
  label: string;
}

/**
 * Infinite ribbon of tools. Two identical groups scroll inside one track so the
 * loop is seamless; the duplicate is hidden from assistive tech. Hovering pauses
 * it, and under prefers-reduced-motion the ribbon becomes a static wrapped list.
 */
export function TechMarquee({
  items,
  reverse,
  className,
  label,
}: TechMarqueeProps) {
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
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 font-mono text-[12px] whitespace-nowrap text-foreground/85 shadow-[var(--elev-1)] transition-[transform,color,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-gold/40 hover:text-foreground motion-reduce:transition-none motion-reduce:hover:transform-none"
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
      <div className={cn("marquee-track", reverse && "marquee-track-reverse")}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
