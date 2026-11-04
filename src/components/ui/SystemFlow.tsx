import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface FlowStage {
  title: string;
  detail: string;
  steps: string[];
}

interface SystemFlowProps {
  stages: FlowStage[];
  /** Describes where the stages come from, so nothing reads as invented. */
  caption?: string;
  className?: string;
}

/**
 * A connected stage diagram for implemented flows.
 *
 * Stages come from a project's own published walkthrough panels — the titles
 * and steps are copied from the record, never invented. Selecting a node shows
 * its detail panel (the gold progress line follows the selection); every stage
 * title is always visible, and the detail is one click or Enter away, so the
 * diagram adds navigation rather than hiding content behind hover.
 */
export function SystemFlow({ stages, caption, className }: SystemFlowProps) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const stage = stages[active] ?? stages[0];

  if (!stage) return null;

  const progress = stages.length > 1 ? active / (stages.length - 1) : 0;

  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % stages.length
        : (active - 1 + stages.length) % stages.length;
    setActive(next);
    const buttons = listRef.current?.querySelectorAll("button");
    buttons?.[next]?.focus();
  };

  return (
    <div className={cn("flow", className)}>
      <div className="flow-chain-shell">
        <span
          className="flow-progress"
          style={{ "--flow-p": progress } as CSSProperties}
          aria-hidden="true"
        />
        <ol className="flow-chain" ref={listRef} onKeyDown={onKeyDown}>
          {stages.map((item, index) => (
            <li key={item.title} className="flow-step">
              <button
                type="button"
                className="flow-node focus-ring"
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <span className="flow-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flow-name">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="flow-panel" aria-live="polite">
        <p className="flow-panel-title">{stage.title}</p>
        <p className="flow-panel-body">{stage.detail}</p>
        <ul className="flow-steps">
          {stage.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        {caption && (
          <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
