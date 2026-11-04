import { cn } from "@/lib/utils";

/**
 * The person's initials as a brand seal.
 *
 * A serif "AK" inside a gold-edged tile: the one mark that carries the
 * identity without repeating the logotype. Decorative only — the wordmark and
 * heading beside it already name the site, so it is hidden from assistive tech.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center rounded-lg border border-gold/35 bg-gold/[0.08] shadow-[var(--elev-1)]",
        className,
      )}
    >
      <span className="text-display text-[1.05rem] text-gold">AK</span>
      <span className="pointer-events-none absolute inset-[3px] rounded-[5px] border border-gold/15" />
    </span>
  );
}
