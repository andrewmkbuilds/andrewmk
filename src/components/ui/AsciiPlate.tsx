import { useEffect, useRef, useState } from "react";

interface AsciiPlateProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  /** Longest edge of the character grid. */
  columns?: number;
}

/**
 * ASCII overlay, adapted from the starter pack — without three.js.
 *
 * The pack samples a shader on the GPU and blooms characters over the brighter
 * parts of a photo. Two of the site's rules (no WebGL, no per-frame canvas
 * work) make that a bad fit here: a lost WebGL context composites as an opaque
 * plate, and a running fragment shader is exactly the kind of cost the
 * performance budget forbids. So the same idea is done once per resize:
 * the image is sampled into a small offscreen canvas, and the glyphs are drawn
 * onto a single static canvas — one paint, no loop, nothing to lose.
 *
 * The photograph never disappears; the data layer is tinted gold→blue over its
 * brighter regions, exactly as the pack describes.
 */
export function AsciiPlate({
  src,
  alt,
  caption,
  className = "",
  columns = 104,
}: AsciiPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const image = new Image();
    image.decoding = "async";
    image.src = src;

    const draw = () => {
      if (cancelled) return;
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (!width || !height) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050d18";
      ctx.fillRect(0, 0, width, height);

      if (!image.complete || !image.naturalWidth) return;

      // Cover-fit the photograph.
      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight,
      );
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;
      ctx.globalAlpha = 0.42;
      ctx.drawImage(image, offsetX, offsetY, drawW, drawH);
      ctx.globalAlpha = 1;

      // Sample a small grid from the photograph.
      const cols = Math.max(24, Math.min(columns, Math.round(width / 7)));
      const rows = Math.max(8, Math.round((cols * height) / width / 1.6));
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sampleCtx = sample.getContext("2d");
      if (!sampleCtx) return;
      sampleCtx.drawImage(image, 0, 0, cols, rows);
      const data = sampleCtx.getImageData(0, 0, cols, rows).data;

      const cellW = width / cols;
      const cellH = height / rows;
      const glyphs = ["#", "@", "%", "*", "+", "=", ":", ".", "·"];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.max(6, cellW * 1.18)}px "JetBrains Mono", ui-monospace, monospace`;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          if (luma < 0.16) continue;

          const glyph =
            glyphs[
              Math.min(glyphs.length - 1, Math.floor(luma * glyphs.length))
            ];
          const warmth = Math.min(1, Math.max(0, (r - b) / 160));
          const alpha = Math.min(0.9, 0.18 + luma * 0.85);
          ctx.fillStyle = `rgba(${Math.round(214 + warmth * 20)}, ${Math.round(
            178 + warmth * 28,
          )}, ${Math.round(120 + (1 - warmth) * 120)}, ${alpha})`;
          ctx.fillText(
            glyph ?? ".",
            col * cellW + cellW / 2,
            row * cellH + cellH / 2,
          );
        }
      }
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(draw, 140);
    };

    image
      .decode()
      .catch(() => undefined)
      .then(draw);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    observer?.observe(wrap);
    window.addEventListener("resize", schedule);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [src, columns]);

  return (
    <figure
      ref={wrapRef}
      className={`ascii-plate m-0 ${className}`.trim()}
      style={{ aspectRatio: "16 / 10" }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 700ms var(--ease-out-expo, ease)",
        }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
