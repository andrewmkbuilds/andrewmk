import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, ZoomIn, ZoomOut, ExternalLink, Download, RotateCcw, FileText } from "lucide-react";
import {
  certificateDateLabel,
  certificateDownloadName,
  certificateIssuerParts,
  type Certificate,
} from "@/data/certificates";
import { cn } from "@/lib/utils";

interface CertificateViewerProps {
  certificate: Certificate | null;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Full-size, gold-accented certificate viewer.
 * Images: cursor-anchored wheel/pinch zoom, drag to pan, keyboard +/-/0.
 * PDFs: rendered as a real document in an embedded viewer, never as a flat image.
 */
export function CertificateViewer({ certificate, onClose }: CertificateViewerProps) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  zoomRef.current = zoom;
  offsetRef.current = offset;

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  /** Zoom about a point in stage coordinates so that point stays put. */
  const zoomAt = useCallback((next: number, px: number, py: number) => {
    const current = zoomRef.current;
    const target = clamp(next, MIN_ZOOM, MAX_ZOOM);
    if (target === current) return;
    const k = target / current;
    const o = offsetRef.current;
    const nextOffset =
      target === MIN_ZOOM
        ? { x: 0, y: 0 }
        : { x: px - (px - o.x) * k, y: py - (py - o.y) * k };
    setZoom(target);
    setOffset(nextOffset);
  }, []);

  const zoomFromCenter = useCallback(
    (factor: number) => {
      const rect = stageRef.current?.getBoundingClientRect();
      zoomAt(zoomRef.current * factor, (rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2);
    },
    [zoomAt],
  );

  useEffect(() => {
    reset();
  }, [certificate?.id, reset]);

  // Escape to close, keyboard zoom, scroll lock, focus into the dialog.
  useEffect(() => {
    if (!certificate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomFromCenter(1.4);
      if (e.key === "-" || e.key === "_") zoomFromCenter(1 / 1.4);
      if (e.key === "0") reset();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [certificate, onClose, zoomFromCenter, reset]);

  // Native non-passive wheel listener: React's onWheel cannot preventDefault.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !certificate || certificate.type !== "image") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const rect = el.getBoundingClientRect();
      zoomAt(
        zoomRef.current * Math.exp(-dy * 0.0018),
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [certificate, zoomAt]);

  if (!certificate) return null;

  const { org, program } = certificateIssuerParts(certificate);
  const dateLabel = certificateDateLabel(certificate);
  const isPdf = certificate.type === "pdf";

  const toolButton =
    "focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/25 bg-gold/5 p-2 text-gold/90 transition-colors hover:border-gold/60 hover:bg-gold/15 hover:text-gold disabled:opacity-35";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label={`${certificate.title} — certificate`}
      className="focus:outline-none fixed inset-0 z-100 flex flex-col bg-background/96 backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Close certificate viewer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        tabIndex={-1}
      />

      <header className="relative z-10 flex items-start gap-3 border-b border-gold/20 bg-card/60 px-4 py-3 md:px-6">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px divider-gold" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {isPdf && <FileText className="size-3" />}
            {certificate.category}
            {dateLabel && <span className="text-muted-foreground">· {dateLabel}</span>}
          </p>
          <h2 className="mt-1 truncate text-sm font-semibold text-foreground md:text-base">
            {certificate.title}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {[org, program].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {!isPdf && (
            <>
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoom <= MIN_ZOOM}
                onClick={() => zoomFromCenter(1 / 1.4)}
                className={toolButton}
              >
                <ZoomOut className="size-4" />
              </button>
              <span
                aria-live="polite"
                className="hidden w-12 text-center font-mono text-xs text-gold/80 sm:block"
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoom >= MAX_ZOOM}
                onClick={() => zoomFromCenter(1.4)}
                className={toolButton}
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Reset zoom"
                disabled={zoom === 1 && offset.x === 0 && offset.y === 0}
                onClick={reset}
                className={cn(toolButton, "hidden sm:inline-flex")}
              >
                <RotateCcw className="size-4" />
              </button>
            </>
          )}
          <a
            href={certificate.file}
            download={certificateDownloadName(certificate)}
            aria-label="Download the original certificate"
            className={toolButton}
          >
            <Download className="size-4" />
          </a>
          <a
            href={certificate.file}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the original certificate file in a new tab"
            className={cn(toolButton, "hidden sm:inline-flex")}
          >
            <ExternalLink className="size-4" />
          </a>
          <button
            type="button"
            aria-label="Close certificate viewer"
            onClick={onClose}
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/45 bg-gold/15 p-2 text-gold transition-colors hover:bg-gold/25"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 overflow-hidden p-3 md:p-6"
      >
        {isPdf ? (
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-gold/25 bg-card"
            style={{ boxShadow: "0 0 60px -30px color-mix(in oklab, var(--gold) 60%, transparent)" }}>
            <iframe
              src={`${certificate.file}#view=FitH`}
              title={`${certificate.title} (PDF document)`}
              className="h-full min-h-[60vh] w-full flex-1 bg-background"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gold/20 px-4 py-3 text-xs text-muted-foreground">
              <span>PDF document · {certificate.title}</span>
              <span className="flex gap-2">
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded-md border border-gold/30 px-3 py-1.5 text-gold transition-colors hover:bg-gold/10"
                >
                  Open in new tab
                </a>
                <a
                  href={certificate.file}
                  download={certificateDownloadName(certificate)}
                  className="focus-ring rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary transition-colors hover:bg-primary/20"
                >
                  Download PDF
                </a>
              </span>
            </div>
          </div>
        ) : (
          <div
            ref={stageRef}
            className={cn(
              "relative h-full w-full touch-none overflow-hidden rounded-xl",
              zoom > 1 ? (dragRef.current ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
            )}
            onPointerDown={(e) => {
              if (zoomRef.current <= 1) return;
              dragRef.current = {
                x: e.clientX,
                y: e.clientY,
                ox: offsetRef.current.x,
                oy: offsetRef.current.y,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = dragRef.current;
              if (!d) return;
              setOffset({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) });
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
            onDoubleClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if (zoomRef.current > 1) reset();
              else zoomAt(2.5, e.clientX - rect.left, e.clientY - rect.top);
            }}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={certificate.file}
                alt={`${certificate.title}${certificate.issuer ? ` — ${certificate.issuer}` : ""}`}
                draggable={false}
                className="max-h-full max-w-full select-none rounded-lg border border-gold/25 bg-card object-contain"
                style={{ boxShadow: "0 0 80px -40px color-mix(in oklab, var(--gold) 70%, transparent)" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      <p className="relative z-10 hidden border-t border-border px-6 py-2 text-center font-mono text-[11px] text-muted-foreground md:block">
        {isPdf
          ? "Esc to close · Download for the original document"
          : "Scroll or pinch to zoom · Drag to pan · Double-click to toggle · Esc to close"}
      </p>
    </div>
  );
}
