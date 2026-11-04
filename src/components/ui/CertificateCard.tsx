import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Download,
  ExternalLink,
  FileText,
  Maximize2,
} from "lucide-react";
import {
  certificateDateLabel,
  certificateDownloadName,
  certificateIssuerParts,
  type Certificate,
} from "@/data/certificates";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";

interface CertificateCardProps {
  certificate: Certificate;
  onOpen: (certificate: Certificate) => void;
  className?: string;
  /** Compact layout used by the mobile swipe rail. */
  compact?: boolean;
}

/** Short title without the document-type suffix, for accessible link names. */
function credentialName(certificate: Certificate) {
  return certificate.title.split("—")[0]?.trim() || certificate.title;
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
  const { verifyUrl, verifyPlatform = "Credly" } = certificate;
  const credentialLabel = `View ${credentialName(certificate)} credential on ${verifyPlatform} (opens in a new tab)`;

  return (
    <motion.article
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "surface spotlight edge-glow lift-3d group relative isolate flex h-full flex-col overflow-hidden rounded-xl",
        "gold-hover transition-colors duration-300 hover:border-gold/40",
        verifyUrl && "certificate-verified-card",
        className,
      )}
    >
      <span aria-hidden="true" className="fx-sheen" />

      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Open ${certificate.title} in the full-size viewer`}
        className="focus-ring relative block w-full overflow-hidden border-b border-border bg-linear-to-b from-muted/30 to-background"
      >
        <span className={cn("block", compact ? "aspect-3/2" : "aspect-4/3")}>
          <img
            src={certificate.thumb}
            alt={`Preview of ${certificate.title}`}
            // The card frame owns the box (`aspect-3/2` rail, `aspect-4/3`
            // grid); declaring that same ratio here reserves it before the
            // thumbnail arrives, so the gallery cannot shift as images load.
            width={1200}
            height={compact ? 800 : 900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
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

      <div
        className={cn("relative flex flex-1 flex-col", compact ? "p-4" : "p-5")}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            {certificate.category}
          </p>
          {dateLabel && (
            <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
              {dateLabel}
            </p>
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

        <div className="mt-2 flex items-start gap-2">
          {certificate.issuer && (
            <span className="credential-issuer-mark mt-0.5 inline-flex">
              <BrandLogo issuer name={certificate.issuer} size="md" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm leading-snug text-foreground/75">{org}</p>
            {program && (
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {program}
              </p>
            )}
          </div>
        </div>
        {certificate.date && certificate.date !== dateLabel && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">
            {certificate.date}
          </p>
        )}

        {verifyUrl && (
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={credentialLabel}
            className="credential-verified focus-ring mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/35 bg-gold/[0.07] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-gold"
          >
            <BadgeCheck
              aria-hidden="true"
              className="credential-check size-3.5"
            />
            <span className="credential-verified-text" aria-hidden="true">
              <span className="credential-verified-idle">Verified</span>
              <span className="credential-verified-hover">
                Verified on {verifyPlatform}
                <ArrowUpRight className="credential-verified-arrow size-3" />
              </span>
            </span>
          </a>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2">
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

          {verifyUrl && (
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={credentialLabel}
              className="focus-ring credential-cta mt-2 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-gold transition-colors hover:bg-gold/20"
            >
              <ExternalLink aria-hidden="true" className="size-3.5" />
              View credential
              <ArrowUpRight
                aria-hidden="true"
                className="credential-arrow size-3.5"
              />
            </a>
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.article>
  );
}
