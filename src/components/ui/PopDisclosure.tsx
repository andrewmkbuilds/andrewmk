import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopDisclosureProps {
  /** Visible heading text. Also used to build the accessible name. */
  title: string;
  /** Optional short line rendered under the title, always visible. */
  summary?: ReactNode;
  /** Optional element (icon/eyebrow) rendered above the title. */
  media?: ReactNode;
  /** Heading level wrapper for the trigger. */
  headingLevel?: "h2" | "h3";
  /** Accessible name suffix, e.g. "focus area" -> "AI & Machine Learning, focus area". */
  kind?: string;
  /** Value for data-pop-target, used by regression tests. */
  popTarget?: string;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
}

/**
 * A card that doubles as a disclosure ("pop-out") panel.
 *
 * - The whole card is the pop surface (.pop-card) and lifts on hover
 *   (pointer devices only) and on :focus-within.
 * - The header is a real <button> with aria-expanded / aria-controls, so
 *   screen readers announce collapsed/expanded state and touch users get a
 *   reliable tap toggle that never interferes with scrolling.
 * - Escape closes the open panel and returns focus to its trigger.
 */
export function PopDisclosure({
  title,
  summary,
  media,
  headingLevel = "h3",
  kind,
  popTarget,
  className,
  panelClassName,
  children,
}: PopDisclosureProps) {
  const uid = useId().replace(/[:]/g, "");
  const triggerId = `pop-trigger-${uid}`;
  const panelId = `pop-panel-${uid}`;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const Heading = headingLevel;

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Escape" || !open) return;
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    },
    [open],
  );

  return (
    <div
      data-pop-target={popTarget}
      data-expanded={open ? "true" : "false"}
      onKeyDown={onKeyDown}
      className={cn(
        "group pop-card flex h-full flex-col rounded-xl border border-border bg-card shadow-card hover:border-primary/40",
        className,
      )}
    >
      <Heading className="m-0">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={kind ? `${title}, ${kind}` : undefined}
          onClick={() => setOpen((value) => !value)}
          className="focus-ring flex w-full touch-manipulation flex-col items-start gap-3 rounded-xl p-6 text-left"
        >
          {media}
          <span className="flex w-full items-start justify-between gap-3">
            <span className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
              {title}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "pop-chevron mt-1 h-4 w-4 shrink-0 text-muted-foreground",
                open && "rotate-180 text-primary",
              )}
            />
          </span>
          {summary ? (
            <span className="text-sm leading-relaxed text-muted-foreground">{summary}</span>
          ) : null}
        </button>
      </Heading>

      <div id={panelId} role="region" aria-labelledby={triggerId} className="pop-panel" data-open={open ? "true" : "false"}>
        <div className="pop-panel-inner">
          <div className={cn("border-t border-border px-6 pb-6 pt-4", panelClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
