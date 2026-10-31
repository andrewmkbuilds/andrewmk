import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";
import { SketchStar } from "./Sketch";

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
          className="serif-display mark-underline mark-underline-draw relative text-[1.06em] text-gold not-italic"
        >
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

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
        <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          <SketchStar className="sketch-star h-3 w-3 shrink-0" weight={2.2} />
          <span aria-hidden="true" className="hairline-gold inline-block w-8" />
          {label}
        </p>
      )}
      <h2 className="headline-3d text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-[1.1] text-balance">
        {renderTitle(title)}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
