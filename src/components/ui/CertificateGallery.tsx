import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FilterBar } from "@/components/ui/FilterBar";
import { CertificateCard } from "@/components/ui/CertificateCard";
import { CertificateViewer } from "@/components/ui/CertificateViewer";
import {
  certificateCategories,
  certificatesByRecency,
  type Certificate,
} from "@/data/certificates";

export function CertificateGallery() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<Certificate | null>(null);

  const options = useMemo(() => ["All", ...certificateCategories], []);
  const visible = useMemo(
    () =>
      category === "All"
        ? certificatesByRecency
        : certificatesByRecency.filter((c) => c.category === category),
    [category],
  );

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-title"
      className="border-t border-border py-20 md:py-28"
    >
      <div className="container">
        <SectionHeading
          label="Proof"
          title="Certificate Gallery"
          subtitle="Every certificate below is the original document — issued by the school, competition or programme named on it. Open one to zoom in, or download the file."
        />
        <h2 id="certificates-title" className="sr-only">
          Certificate Gallery
        </h2>

        <Reveal>
          <FilterBar
            label="Filter certificates by category"
            legend="Category"
            options={options}
            value={category}
            onChange={setCategory}
            className="mb-8"
          />
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {visible.length} certificates shown
        </p>

        {/* Mobile: horizontal swipe rail with snap points and smaller cards. */}
        <div className="sm:hidden">
          <ul
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {visible.map((certificate) => (
              <li key={certificate.id} className="w-[72vw] shrink-0 snap-center">
                <CertificateCard
                  certificate={certificate}
                  onOpen={setActive}
                  compact
                  className="h-full"
                />
              </li>
            ))}
          </ul>
          <p className="mt-1 text-center font-mono text-[11px] text-muted-foreground">
            Swipe for more · {visible.length} certificates
          </p>
        </div>

        {/* Tablet and up: standard grid. */}
        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((certificate, i) => (
            <Reveal key={certificate.id} delay={Math.min(i, 6) * 60} className="h-full">
              <CertificateCard certificate={certificate} onOpen={setActive} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>

      <CertificateViewer certificate={active} onClose={() => setActive(null)} />
    </section>
  );
}
