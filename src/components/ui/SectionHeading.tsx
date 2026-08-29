import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
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
      className={cn(
        "max-w-3xl mb-10 md:mb-14",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {label && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
          {label}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-[1.1] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
