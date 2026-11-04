import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { TickMark } from "@/components/ui/TickMark";
import { Link } from "@/lib/router-compat";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { CV_FILENAME } from "@/data/cv";
import { portfolioLabel } from "@/data/cv";
import { CvDownloadButton } from "@/components/resume/CvDownloadButton";
import { CvSheet } from "@/components/resume/CvSheet";

export default function Resume() {
  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="surface relative overflow-hidden rounded-2xl border border-gold/25 p-5 sm:p-6 md:p-9">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px divider-gold"
              />
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gold">
                Résumé
              </p>
              <h1 className="headline-3d mt-3 text-4xl font-bold leading-[1.05] text-foreground md:text-5xl">
                Andrew Mathews
              </h1>
              <p className="mt-3 text-balance text-base leading-relaxed text-primary sm:text-lg">
                A one-page CV generated from this site&rsquo;s own data —
                download it as a PDF or an editable Word document.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
                <CvDownloadButton
                  kind="pdf"
                  filename={`${CV_FILENAME}.pdf`}
                  label="Download PDF"
                  hint={`${CV_FILENAME}.pdf · A4, selectable text`}
                  primary
                />
                <CvDownloadButton
                  kind="docx"
                  filename={`${CV_FILENAME}.docx`}
                  label="Download DOCX"
                  hint={`${CV_FILENAME}.docx · editable in Word`}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
                <a
                  href={
                    portfolioLabel
                      ? `https://${portfolioLabel}`
                      : "https://andrewmk.is-a.dev"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-gold"
                >
                  {portfolioLabel}
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
                <Link
                  to="/achievements#certificates"
                  className="focus-ring inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-gold"
                >
                  <TickMark>
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                  </TickMark>
                  Certificates and verified Credly credentials
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Preview · same content as the download
              </p>
              <CvSheet />
            </div>
          </Reveal>

          <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
            Every fact here comes from{" "}
            <a
              href={`https://${portfolioLabel}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              {portfolioLabel}
            </a>{" "}
            and the rest of this site.
          </p>
        </div>
      </section>
    </Layout>
  );
}
