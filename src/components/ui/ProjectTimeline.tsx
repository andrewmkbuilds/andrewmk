import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Project } from "@/data/portfolio";

interface ProjectTimelineProps {
  project: Project;
}

function formatDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * A compact two-point timeline showing when a piece of work started and when it
 * was completed. Renders only when at least one of the dates is set, so projects
 * without dates are unaffected.
 */
export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const start = project.startDate;
  const end = project.endDate;
  if (!start && !end) return null;

  const hasEnd = Boolean(end);
  const inProgress = !hasEnd;

  return (
    <section aria-label="Project timeline" className="divider-gold py-12 md:py-16">
      <div className="container">
        <Reveal>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
            Timeline
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            When this piece of work started and where it stands today.
          </p>

          <ol className="relative mt-8 list-none space-y-0 p-0 md:space-y-0">
            {/* connecting spine */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-3 bottom-3 w-px bg-border md:left-[11px]"
            />

            {/* Start */}
            <li className="relative flex items-start gap-4 pb-8 md:gap-6 md:pb-10">
              <span
                aria-hidden="true"
                className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-background md:h-6 md:w-6"
              >
                <PlayCircle className="h-3 w-3 text-gold md:h-4 md:w-4" />
              </span>
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Started
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground md:text-xl">
                  {start ? formatDate(start) : "Date not recorded"}
                </p>
              </div>
            </li>

            {/* Completion */}
            <li className="relative flex items-start gap-4 md:gap-6">
              <span
                aria-hidden="true"
                className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-background md:h-6 md:w-6"
              >
                {inProgress ? (
                  <Circle className="h-3 w-3 text-muted-foreground md:h-4 md:w-4" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 text-gold md:h-4 md:w-4" />
                )}
              </span>
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {inProgress ? "Status" : "Completed"}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground md:text-xl">
                  {hasEnd ? formatDate(end) : `${project.status} — in progress`}
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
