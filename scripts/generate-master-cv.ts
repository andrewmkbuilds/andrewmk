/**
 * Writes the Master CV deliverables into `docs/cv/`:
 *
 *   Andrew_Mathews_Kalathil_Master_CV.pdf    (A4, real text, clickable links)
 *   Andrew_Mathews_Kalathil_Master_CV.docx   (editable, real heading styles)
 *
 * Both are generated from `src/data/cv.ts` with the same builders the website
 * uses, so the committed files and `/api/cv/pdf` / `/api/cv/docx` can never
 * drift apart.
 *
 * Run from the repo root (inside the container, where node_modules exists):
 *   docker compose -f docker-compose.base44.yml exec -T web \
 *     bunx tsx scripts/generate-master-cv.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { MASTER_CV_FILENAME } from "../src/data/cv";
import { buildCvDocx } from "../src/lib/cv/docx";
import { buildCvPdf } from "../src/lib/cv/pdf";

const outDir = path.join(process.cwd(), "docs", "cv");
await mkdir(outDir, { recursive: true });

const pdfBytes = await buildCvPdf();
const docxBytes = await buildCvDocx();

const pdfPath = path.join(outDir, `${MASTER_CV_FILENAME}.pdf`);
const docxPath = path.join(outDir, `${MASTER_CV_FILENAME}.docx`);
await writeFile(pdfPath, pdfBytes);
await writeFile(docxPath, docxBytes);

const pageCount = (await PDFDocument.load(pdfBytes)).getPageCount();
console.log(
  `pdf  ${pdfPath}  (${pdfBytes.byteLength} bytes, ${pageCount} pages)`,
);
console.log(`docx ${docxPath}  (${docxBytes.byteLength} bytes)`);
