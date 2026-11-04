import { useState } from "react";
import { Award, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export type TimelineStopStatus = "complete" | "current" | "upcoming";

export interface TimelineStop {
  id: string;
  /** Year, date or period label — the timeline's own axis. */
  label: string;
  title: string;
  meta?: string | undefined;
  /** First paragraph is always visible; the rest unfolds behind Details. */
  body?: string[] | undefined;
  points?: string[] | undefined;
  status?: TimelineStopStatus | undefined;
  kind?: "milestone" | "award" | undefined;
  /** Real, verified action — e.g. opening the certificate that backs a result. */
  action?: { label: string; onClick: () => void } | undefined;
}

interface TimelineTrackProps {
  stops: TimelineStop[];
  label: string;
  className?: string;
}

/**
 * One chronological presentation for every dated record on the site.
 *
 * Vertical rail on phones; on desktop the spine runs down the middle and the
 * milestones alternate either side. The connecting line fills in gold as each
 * milestone is scrolled into view (the shared reveal observer adds the class),
 * so the page reads as progress rather than a stack of cards. Details unfold
 * behind a real button with `aria-expanded`; the first paragraph, title, meta
 * and status never depend on interaction.
 */
export function TimelineTrack({ stops, label, className }: TimelineTrackProps) {
  return (
    <div className={cn("tl", className)}>
      <ol className="tl-list" aria-label={label}>
        {stops.map((stop) => (
          <TimelineItem key={stop.id} stop={stop} />
        ))}
      </ol>
    </div>
  );
}

function TimelineItem({ stop }: { stop: TimelineStop }) {
  const [open, setOpen] = useState(false);
  const status = stop.status ?? "complete";
  const body = stop.body ?? [];
  const [lead, ...rest] = body;
  const details = [...rest];
  const hasDetails = details.length > 0 || Boolean(stop.points?.length);
  const panelId = `tl-panel-${stop.id}`;

  return (
    <Reveal as="li" className={cn("tl-item", `tl-item--${status}`)}>
      <span className="tl-marker" aria-hidden="true">
        {stop.kind === "award" ? (
          <Award className="h-3.5 w-3.5" />
        ) : (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === "upcoming" ? "border border-current" : "bg-current",
            )}
          />
        )}
      </span>

      <div className="tl-card">
        <div className="tl-head">
          <span className="tl-label">{stop.label}</span>
          {status === "current" && <span className="tl-flag">Now</span>}
          {status === "upcoming" && (
            <span className="tl-flag tl-flag--soon">Upcoming</span>
          )}
        </div>

        <h3 className="tl-title">{stop.title}</h3>
        {stop.meta && <p className="tl-meta">{stop.meta}</p>}
        {lead && <p className="tl-body">{lead}</p>}

        {hasDetails && (
          <>
            <button
              type="button"
              className="tl-toggle focus-ring"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={`${open ? "Hide" : "Show"} details: ${stop.title}`}
              onClick={() => setOpen((value) => !value)}
            >
              Details
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <div className="tl-details" data-open={open} id={panelId}>
              <div>
                <div className="tl-details-inner">
                  {details.map((paragraph, index) => (
                    <p key={index} className="tl-details-body">
                      {paragraph}
                    </p>
                  ))}
                  {stop.points && stop.points.length > 0 && (
                    <ul className="tl-points">
                      {stop.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* The proof link stays visible: it is a fact about the entry, not a
            detail that needs unfolding first. */}
        {stop.action && (
          <div className="mt-3">
            <button
              type="button"
              className="tl-action focus-ring"
              onClick={stop.action.onClick}
            >
              {stop.action.label}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        )}
      </div>
    </Reveal>
  );
}
