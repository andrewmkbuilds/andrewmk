import { useRef } from "react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  label: string;
  /** Optional short prefix shown before the options. */
  legend?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Filter chips with roving tabindex: one tab stop, arrow keys move between
 * options, Home/End jump to the ends — the pattern keyboard users expect.
 */
export function FilterBar({ label, legend, options, value, onChange, className }: FilterBarProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusAt = (index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-filter]");
    if (!buttons?.length) return;
    const next = (index + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(options.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {legend && (
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {legend}
        </span>
      )}
      <div ref={listRef} role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              data-filter
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(option)}
              onKeyDown={(event) => onKeyDown(event, index)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 focus-ring",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
