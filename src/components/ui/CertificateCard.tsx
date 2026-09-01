import { motion, useReducedMotion } from "motion/react";
import { Download, FileText, Maximize2 } from "lucide-react";
import {
  certificateDateLabel,
  certificateDownloadName,
  certificateIssuerParts,
  type Certificate,
} from "@/data/certificates";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  certificate: Certificate;
  onOpen: (certificate: Certificate) => void;
  className?: string;
  /** Compact layout used by the mobile swipe rail. */
  compact?: boolean;
}

export function CertificateCard({
  certificate,
  onOpen,
  className,
  compact = false,
}: CertificateCardProps) {
  const reduce = useReducedMotion();
  const { org, program } = certificateIssuerParts(certificate);
  const dateLabel = certificateDateLabel(certificate);

  return (
    <motion.article
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface spotlight edge-glow lift-3d group relative isolate flex h-full flex-col overflow-hidden rounded-xl",
        "gold-hover transition-colors duration-300 hover:border-gold/40",
        className,
      )}
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Open ${certificate.title} in the full-size viewer`}
        className="focus-ring relative block w-full overflow-hidden border-b border-border bg-background"
      >
        <span className={cn("block", compact ? "aspect-3/2" : "aspect-4/3")}>
          <img
            src={certificate.thumb}
            alt={`Preview of ${certificate.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </span>
        <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md border border-gold/30 bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
          {certificate.type === "pdf" ? <FileText className="size-3" /> : null}
          {certificate.type === "pdf" ? "PDF" : "Original"}
        </span>
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md border border-gold/30 bg-background/80 px-2 py-1 font-mono text-[10px] text-gold opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="size-3" /> Zoom
        </span>
      </button>

      <div className={cn("relative flex flex-1 flex-col", compact ? "p-4" : "p-5")}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {certificate.category}
          </p>
          {dateLabel && (
            <p className="shrink-0 font-mono text-[11px] text-muted-foreground">{dateLabel}</p>
          )}
        </div>

        <h3
          className={cn(
            "mt-2 font-semibold leading-snug text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {certificate.title}
        </h3>

        <p className="mt-1.5 text-sm leading-snug text-foreground/75">{org}</p>
        {program && (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{program}</p>
        )}
        {certificate.date && certificate.date !== dateLabel && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">{certificate.date}</p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpen(certificate)}
            className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:border-gold/50 hover:text-gold"
          >
            <Maximize2 className="size-4" />
            View
          </button>
          <a
            href={certificate.file}
            download={certificateDownloadName(certificate)}
            aria-label={`Download ${certificate.title}`}
            className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/5 text-gold transition-colors hover:border-gold/60 hover:bg-gold/15"
          >
            <Download className="size-4" />
          </a>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.article>
  );
}
