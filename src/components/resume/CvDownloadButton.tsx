import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "pdf" | "docx";
type State = "idle" | "working" | "done" | "error";

interface CvDownloadButtonProps {
  kind: Kind;
  filename: string;
  label: string;
  hint?: string;
  primary?: boolean;
}

/**
 * Downloads a generated CV file and reports failures instead of failing
 * silently. The file is fetched first so a server error can be surfaced in
 * place; the browser then saves it with the given filename.
 */
export function CvDownloadButton({
  kind,
  filename,
  label,
  hint,
  primary = false,
}: CvDownloadButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function download() {
    if (state === "working") return;
    setState("working");
    setError(null);
    try {
      const response = await fetch(`/api/cv/${kind}`, {
        headers: { accept: kind === "pdf" ? "application/pdf" : "*/*" },
      });
      if (!response.ok) {
        let message = `Generation failed (${response.status}). Please try again.`;
        try {
          const body = (await response.json()) as { error?: string };
          if (body?.error) message = body.error;
        } catch {
          /* keep the status-based message */
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setState("done");
    } catch (cause) {
      setState("error");
      setError(
        cause instanceof Error
          ? cause.message
          : "The file could not be generated. Please try again.",
      );
    }
  }

  const Icon = state === "working" ? Loader2 : primary ? Download : FileText;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={download}
        disabled={state === "working"}
        aria-label={`${label} — ${filename}`}
        className={cn(
          "focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg px-4 font-mono text-sm transition-all duration-300",
          primary
            ? "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            : "border border-gold/35 bg-gold/5 text-gold hover:-translate-y-0.5 hover:bg-gold/15",
          state === "working" && "cursor-progress opacity-70",
        )}
      >
        <Icon className={cn("size-4", state === "working" && "animate-spin")} />
        {state === "working"
          ? "Preparing…"
          : state === "done"
            ? "Downloaded"
            : label}
      </button>
      <span
        role="status"
        aria-live="polite"
        className="min-h-4 font-mono text-[11px] leading-4"
      >
        {state === "error" && error ? (
          <span className="text-destructive">{error}</span>
        ) : hint ? (
          <span className="text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </div>
  );
}
