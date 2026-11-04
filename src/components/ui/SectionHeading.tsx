import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";

interface SectionHeadingProps {
  label?: string;
  /** Wrap a word in *asterisks* to set it in the gold editorial serif. */
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

/** Splits "*word*" markers out of a heading into emphasised serif runs. */
function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <em
          key={i}
          className="serif-display mark-underline relative text-[1.08em] italic text-gold"
        >
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * The site's section opening.
 *
 * One editorial pattern, used everywhere: a serif italic index that counts up
 * through the page, a hairline, the mono kicker, then a Sora section title with
 * one word set in the gold serif. Pages get their identity from this rhythm
 * rather than from a new heading style per route.
 */
export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <Reveal
      variant="mask"
      className={cn(
        "relative max-w-3xl mb-10 md:mb-14",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {/* ambient light behind the heading — the midground of each section */}
      <Parallax
        distance={16}
        ariaHidden
        className={cn(
          "pointer-events-none absolute -top-14 -z-10 h-44 w-64",
          align === "center" ? "left-1/2 -translate-x-1/2" : "-left-8",
        )}
      >
        <div className="h-full w-full rounded-full bg-gold/[0.07] blur-[70px]" />
      </Parallax>
      {label && (
        <p
          className={cn(
            "mb-5 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold",
            align === "center" && "justify-center",
          )}
        >
          <span
            aria-hidden="true"
            className="section-kicker inline-flex items-baseline leading-none"
          />
          <span
            aria-hidden="true"
            className="hairline-gold inline-block h-px w-7 shrink-0 self-center"
          />
          <span>{label}</span>
          {align !== "center" && (
            <span
              aria-hidden="true"
              className="hairline-gold hidden h-px flex-1 self-center sm:block"
            />
          )}
        </p>
      )}
      <h2 className="headline-3d type-section text-[2rem] text-balance text-foreground md:text-[2.5rem] lg:text-[2.85rem]">
        {renderTitle(title)}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
