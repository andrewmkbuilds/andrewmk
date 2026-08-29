import { Reveal } from "./Reveal";
import { timeline } from "@/data/portfolio";

export function Timeline() {
  return (
    <ol className="relative space-y-10 border-l border-border pl-6 md:pl-10">
      {timeline.map((entry, index) => (
        <Reveal as="li" key={entry.year + entry.title} delay={index * 60} className="relative">
          <span
            className="absolute -left-[calc(1.5rem+5px)] top-2 h-[9px] w-[9px] rounded-full border border-primary bg-background md:-left-[calc(2.5rem+5px)]"
            aria-hidden="true"
          />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{entry.year}</p>
          <h3 className="mt-2 text-xl md:text-2xl font-semibold text-foreground">{entry.title}</h3>
          {entry.meta && (
            <p className="mt-1 font-mono text-xs text-accent">{entry.meta}</p>
          )}
          <div className="mt-3 space-y-2">
            {entry.body.map((line) => (
              <p key={line} className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          {entry.points && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {entry.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
