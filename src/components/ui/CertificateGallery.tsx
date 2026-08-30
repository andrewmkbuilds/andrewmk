import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FilterBar } from "@/components/ui/FilterBar";
import { CertificateCard } from "@/components/ui/CertificateCard";
import { CertificateViewer } from "@/components/ui/CertificateViewer";
import { certificateCategories, certificates, type Certificate } from "@/data/certificates";

export function CertificateGallery() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<Certificate | null>(null);

  const options = useMemo(() => ["All", ...certificateCategories], []);
  const visible = useMemo(
    () => (category === "All" ? certificates : certificates.filter((c) => c.category === category)),
    [category],
  );

  return (
    <section id="certificates" className="border-t border-border py-20 md:py-28">
      <div className="container">
        <SectionHeading
          label="Proof"
          title="Certificates & Proof"
          subtitle="Verified credentials, competition results, and milestones from my journey as a builder."
        />

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
