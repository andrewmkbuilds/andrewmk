import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Certificate } from "@/data/certificates";
import { cn } from "@/lib/utils";

interface CertificateCardProps {
  certificate: Certificate;
  onOpen: (certificate: Certificate) => void;
  className?: string;
}

export function CertificateCard({ certificate, onOpen, className }: CertificateCardProps) {
  const reduce = useReducedMotion();

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
      <div className="relative aspect-4/3 overflow-hidden border-b border-border bg-background">
        <img
          src={certificate.thumb}
          alt={`Preview of ${certificate.title}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-gold/30 bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold backdrop-blur-sm">
          {certificate.type === "pdf" && <FileText className="size-3" />}
          Original certificate
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
          {certificate.category}
        </p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">
          {certificate.title}
        </h3>
        {certificate.issuer && (
          <p className="mt-1.5 text-sm text-muted-foreground">{certificate.issuer}</p>
        )}
        {certificate.date && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">{certificate.date}</p>
        )}

        <button
          type="button"
          onClick={() => onOpen(certificate)}
          className="focus-ring mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:border-gold/50 hover:text-gold"
        >
          View Certificate
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
    </motion.article>
  );
}
