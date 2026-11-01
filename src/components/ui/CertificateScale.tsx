import ScaleSlider from "@/components/annnimate/scale-slider";
import { certificates } from "@/data/certificates";

/**
 * The starter pack's scale slider, filled with the real certificate previews
 * published in /public/certificates/thumbs. Drag, throw, scroll or use the
 * arrows; the reel is decorative next to the gallery, so no card opens.
 */
export function CertificateScale({ className = "" }: { className?: string }) {
  const images = certificates.map((cert) => cert.thumb);

  return (
    <ScaleSlider
      className={`anm-scale ${className}`.trim()}
      images={images}
      direction="rtl"
      minScale={0.34}
      autoplay={0.0014}
      drag={0.001}
      scroll={0.00018}
    />
  );
}
