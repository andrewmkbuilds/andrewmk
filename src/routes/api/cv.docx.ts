import { createFileRoute } from "@tanstack/react-router";

/**
 * `GET /api/cv/docx` — the same CV as an editable Word document, generated on
 * demand with real heading styles and hyperlinks.
 */
export const Route = createFileRoute("/api/cv/docx")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { buildCvDocx, CV_DOCX_FILENAME } = await import("@/lib/cv/docx");
          const bytes = await buildCvDocx();
          return new Response(new Uint8Array(bytes), {
            headers: {
              "content-type":
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "content-disposition": `attachment; filename="${CV_DOCX_FILENAME}"`,
              "content-length": String(bytes.byteLength),
              "cache-control": "public, max-age=300",
              "x-content-type-options": "nosniff",
            },
          });
        } catch (error) {
          console.error("[cv] docx generation failed", error);
          return Response.json(
            { error: "The CV document could not be generated. Please try again." },
            { status: 500 },
          );
        }
      },
    },
  },
});
