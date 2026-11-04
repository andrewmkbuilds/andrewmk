import { createFileRoute } from "@tanstack/react-router";

/**
 * `GET /api/cv/pdf` — generates the CV PDF on demand and returns it as a
 * download. Real text, A4, clickable links; never a print-dialog detour.
 */
export const Route = createFileRoute("/api/cv/pdf")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { buildCvPdf, CV_PDF_FILENAME } = await import("@/lib/cv/pdf");
          const bytes = await buildCvPdf();
          return new Response(new Uint8Array(bytes), {
            headers: {
              "content-type": "application/pdf",
              "content-disposition": `attachment; filename="${CV_PDF_FILENAME}"`,
              "content-length": String(bytes.byteLength),
              "cache-control": "public, max-age=300",
              "x-content-type-options": "nosniff",
            },
          });
        } catch (error) {
          console.error("[cv] pdf generation failed", error);
          return Response.json(
            { error: "The CV PDF could not be generated. Please try again." },
            { status: 500 },
          );
        }
      },
    },
  },
});
