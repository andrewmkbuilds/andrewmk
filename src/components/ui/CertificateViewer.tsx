import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, ZoomIn, ZoomOut, ExternalLink } from "lucide-react";
import type { Certificate } from "@/data/certificates";
import { cn } from "@/lib/utils";

interface CertificateViewerProps {
  certificate: Certificate | null;
  onClose: () => void;
}

const ZOOM_STEPS = [1, 1.5, 2, 3];

/**
 * Full-size certificate viewer. Images support step zoom with pan by scroll;
 * PDFs are embedded so the original document quality is preserved.
 */
export function CertificateViewer({ certificate, onClose }: CertificateViewerProps) {
  const reduce = useReducedMotion();
  const [zoomIndex, setZoomIndex] = useState(0);

  useEffect(() => {
    setZoomIndex(0);
  }, [certificate?.id]);

  useEffect(() => {
    if (!certificate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const zoom = ZOOM_STEPS[zoomIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${certificate.title} — certificate`}
      className="fixed inset-0 z-100 flex flex-col bg-background/95 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close certificate viewer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />

      <header className="relative z-10 flex items-start gap-3 border-b border-border px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
            {certificate.category}
          </p>
          <h2 className="mt-1 truncate text-sm font-semibold text-foreground md:text-base">
            {certificate.title}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {[certificate.issuer, certificate.date].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {certificate.type === "image" && (
            <>
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoomIndex === 0}
                onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
                className="focus-ring rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoomIndex === ZOOM_STEPS.length - 1}
                onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
                className="focus-ring rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
              >
                <ZoomIn className="size-4" />
              </button>
            </>
          )}
          <a
            href={certificate.file}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the original certificate file in a new tab"
            className="focus-ring rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
          <button
            type="button"
            aria-label="Close certificate viewer"
            onClick={onClose}
            className="focus-ring rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 overflow-auto p-3 md:p-6"
      >
        {certificate.type === "pdf" ? (
          <object
            data={certificate.file}
            type="application/pdf"
            aria-label={certificate.title}
            className="mx-auto h-full min-h-[60vh] w-full max-w-4xl rounded-xl border border-border bg-card"
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Your browser can't display this PDF inline.
              </p>
              <a
                href={certificate.file}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary"
              >
                Open the PDF
              </a>
            </div>
          </object>
        ) : (
          <div className={cn("mx-auto w-fit", zoom > 1 && "cursor-grab")}>
            <img
              src={certificate.file}
              alt={`${certificate.title}${certificate.issuer ? ` — ${certificate.issuer}` : ""}`}
              style={{ width: `${zoom * 100}%`, maxWidth: zoom > 1 ? "none" : "56rem" }}
              className="mx-auto h-auto rounded-xl border border-border bg-card shadow-card"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
