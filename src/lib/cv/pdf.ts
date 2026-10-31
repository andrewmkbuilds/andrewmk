import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import {
  CV_FILENAME,
  cv,
  gavellingLabel,
  githubLabel,
  portfolioLabel,
} from "@/data/cv";

/**
 * Builds the downloadable CV as a real PDF: real text (selectable, searchable,
 * ATS-parseable) drawn with the standard Helvetica faces, A4 pages, clickable
 * links for email, portfolio, GitHub and the Gavelling profile. No screenshot,
 * no print dialog.
 *
 * Layout rules that keep the sheet readable:
 * - one A4 column with a single 46pt margin on every side;
 * - a section heading never starts lower than ~64pt from the bottom, so it
 *   keeps its first entry with it;
 * - a MUN entry stays on one page as a block;
 * - the footer rule is only drawn on the page the document actually ends on.
 */

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 46;
const CONTENT_WIDTH = A4.width - MARGIN * 2;

const ink = rgb(0.05, 0.09, 0.16);
const muted = rgb(0.36, 0.41, 0.5);
const accent = rgb(0.13, 0.36, 0.78);
const rule = rgb(0.8, 0.84, 0.9);

interface Cursor {
  page: PDFPage;
  y: number;
}

function addPage(doc: PDFDocument): Cursor {
  return { page: doc.addPage([A4.width, A4.height]), y: A4.height - MARGIN };
}

/** Adds a clickable rectangle over already-drawn text. */
function addLink(
  doc: PDFDocument,
  page: PDFPage,
  url: string,
  x: number,
  y: number,
  width: number,
  size: number,
) {
  const annotation = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y - size * 0.3, x + width, y + size * 1.1],
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: doc.context.obj(url) },
  });
  page.node.addAnnot(doc.context.register(annotation));
}

export async function buildCvPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${cv.name} — CV`);
  doc.setAuthor(cv.name);
  doc.setSubject("Curriculum Vitae");
  doc.setKeywords([
    "CV",
    "curriculum vitae",
    "Model United Nations",
    "student developer",
    "AI",
    "robotics",
  ]);
  doc.setCreator(portfolioLabel);
  doc.setProducer(portfolioLabel);

  const body = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let { page, y } = addPage(doc);

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN) {
      ({ page, y } = addPage(doc));
    }
  };

  const measure = (text: string, font: PDFFont, size: number) =>
    font.widthOfTextAtSize(text, size);

  const wrap = (text: string, font: PDFFont, size: number, width: number) => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (measure(next, font, size) > width && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const paragraph = (
    text: string,
    options: {
      font?: PDFFont;
      size?: number;
      leading?: number;
      color?: typeof ink;
      x?: number;
      width?: number;
      gapAfter?: number;
    } = {},
  ) => {
    const font = options.font ?? body;
    const size = options.size ?? 9.4;
    const leading = options.leading ?? size * 1.38;
    const color = options.color ?? ink;
    const x = options.x ?? MARGIN;
    const width = options.width ?? CONTENT_WIDTH;
    for (const line of wrap(text, font, size, width)) {
      ensureSpace(leading);
      y -= leading;
      page.drawText(line, { x, y: y + leading * 0.28, size, font, color });
    }
    y -= options.gapAfter ?? 0;
  };

  /** Bullet whose label is bold and whose detail wraps beside it. */
  const bulleted = (label: string, detail: string, size = 9.2) => {
    const labelText = `${label} — `;
    const labelWidth = measure(labelText, bold, size);
    const lines = wrap(detail, body, size, CONTENT_WIDTH - 12 - labelWidth);
    ensureSpace(12 + lines.length * 11.6);
    y -= 12;
    page.drawText("•", { x: MARGIN + 2, y, size, font: body, color: accent });
    page.drawText(labelText, {
      x: MARGIN + 12,
      y,
      size,
      font: bold,
      color: ink,
    });
    lines.forEach((line, i) => {
      if (i > 0) y -= 11.6;
      page.drawText(line, {
        x: MARGIN + 12 + labelWidth,
        y,
        size,
        font: body,
        color: muted,
      });
    });
    y -= 2;
  };

  const section = (title: string) => {
    // Keep the heading with at least its first entry rather than stranding it.
    ensureSpace(64);
    y -= 16;
    page.drawText(title.toUpperCase(), {
      x: MARGIN,
      y,
      size: 9.2,
      font: bold,
      color: accent,
    });
    y -= 5;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4.width - MARGIN, y },
      thickness: 0.7,
      color: rule,
    });
    y -= 11;
  };

  // ---- Masthead ----------------------------------------------------------
  y -= 26;
  page.drawText(cv.name, { x: MARGIN, y, size: 23, font: bold, color: ink });
  y -= 17;
  page.drawText(cv.role, {
    x: MARGIN,
    y,
    size: 10.5,
    font: body,
    color: accent,
  });
  y -= 15;

  // Contact line: location · phone · email · portfolio · github, links clickable.
  const contactSize = 9;
  const separator = "  ·  ";
  let cx = MARGIN;
  const contactItems: { text: string; url?: string }[] = [
    { text: cv.location },
    { text: cv.phone },
    { text: cv.email, url: `mailto:${cv.email}` },
    { text: portfolioLabel, url: cv.portfolio },
    { text: githubLabel, url: cv.github },
  ];
  contactItems.forEach((item, index) => {
    const prefix = index === 0 ? "" : separator;
    const text = `${prefix}${item.text}`;
    page.drawText(text, {
      x: cx,
      y,
      size: contactSize,
      font: body,
      color: muted,
    });
    if (item.url) {
      const start = cx + measure(prefix, body, contactSize);
      addLink(
        doc,
        page,
        item.url,
        start,
        y,
        measure(item.text, body, contactSize),
        contactSize,
      );
    }
    cx += measure(text, body, contactSize);
  });
  y -= 12;

  // ---- Profile -----------------------------------------------------------
  section("Profile");
  paragraph(cv.profile, { gapAfter: 2 });

  // ---- Education ---------------------------------------------------------
  section("Education");
  for (const entry of cv.education) {
    paragraph(entry.school, { font: bold, size: 10 });
    paragraph(`${entry.detail} · ${entry.meta}`, { color: muted, gapAfter: 2 });
  }

  // ---- Model United Nations ---------------------------------------------
  section("Model United Nations Experience");
  for (const entry of cv.mun) {
    ensureSpace(58);
    paragraph(entry.event, { font: bold, size: 9.9 });
    paragraph(`${entry.role} · ${entry.committee} · ${entry.date}`, {
      size: 9.2,
    });
    if (entry.portfolio) {
      paragraph(`Represented ${entry.portfolio}`, { size: 9.2, color: muted });
    }
    paragraph(`Awards: ${entry.awards.join(" · ")}`, {
      size: 9.2,
      font: bold,
      color: accent,
      gapAfter: 6,
    });
  }
  for (const highlight of cv.munHighlights) {
    ensureSpace(12);
    y -= 12;
    page.drawText("•", {
      x: MARGIN + 2,
      y,
      size: 9.2,
      font: body,
      color: accent,
    });
    paragraph(highlight, {
      x: MARGIN + 12,
      width: CONTENT_WIDTH - 12,
      size: 9.2,
    });
  }
  y -= 2;

  // ---- Technical skills --------------------------------------------------
  section("Technical Skills");
  for (const group of cv.skills) {
    ensureSpace(14);
    const labelWidth = 104;
    y -= 12.4;
    page.drawText(group.label, {
      x: MARGIN,
      y,
      size: 9.2,
      font: bold,
      color: ink,
    });
    const lines = wrap(group.value, body, 9.2, CONTENT_WIDTH - labelWidth);
    lines.forEach((line, i) => {
      if (i > 0) y -= 11.6;
      page.drawText(line, {
        x: MARGIN + labelWidth,
        y,
        size: 9.2,
        font: body,
        color: ink,
      });
    });
  }

  // ---- Development experience -------------------------------------------
  section("Development Experience");
  for (const entry of cv.experience) {
    ensureSpace(30);
    paragraph(entry.title, { font: bold, size: 9.8 });
    paragraph(entry.meta, { size: 8.8, color: muted });
    for (const point of entry.points) {
      ensureSpace(12);
      y -= 12;
      page.drawText("•", {
        x: MARGIN + 2,
        y,
        size: 9.2,
        font: body,
        color: accent,
      });
      paragraph(point, {
        x: MARGIN + 12,
        width: CONTENT_WIDTH - 12,
        size: 9.2,
      });
    }
    y -= 2;
  }

  // ---- Selected projects -------------------------------------------------
  section("Selected Projects");
  for (const project of cv.projects) {
    ensureSpace(26);
    y -= 12.4;
    const nameSize = 9.6;
    page.drawText(project.name, {
      x: MARGIN,
      y,
      size: nameSize,
      font: bold,
      color: ink,
    });
    page.drawText(` — ${project.status}`, {
      x: MARGIN + measure(project.name, bold, nameSize),
      y,
      size: 8.8,
      font: body,
      color: accent,
    });
    // `paragraph` draws its first line 0.72 × leading below the cursor, so the
    // name and its summary would otherwise sit only ~8.4pt apart (less than the
    // 9.6pt name itself). Drop the cursor first for a 12pt baseline step.
    y -= 3.6;
    paragraph(project.summary, { size: 9, color: muted, leading: 11.6 });
    paragraph(project.tech, {
      size: 8.4,
      color: muted,
      leading: 10.6,
      gapAfter: 4,
    });
  }

  // ---- Competitions and awards ------------------------------------------
  section("Competitions and Awards");
  for (const result of cv.results) {
    bulleted(`${result.place} — ${result.detail}`, result.event);
  }

  // ---- Leadership --------------------------------------------------------
  section("Leadership and Extracurricular");
  for (const item of cv.leadership) bulleted(item.title, item.detail);

  // ---- Footer ------------------------------------------------------------
  y -= 18;
  ensureSpace(24);
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4.width - MARGIN, y },
    thickness: 0.7,
    color: rule,
  });
  y -= 11;
  page.drawText(`${portfolioLabel}  ·  ${gavellingLabel}`, {
    x: MARGIN,
    y,
    size: 8.4,
    font: body,
    color: accent,
  });
  addLink(
    doc,
    page,
    cv.portfolio,
    MARGIN,
    y,
    measure(portfolioLabel, body, 8.4),
    8.4,
  );
  const gavellingOffset = measure(`${portfolioLabel}  ·  `, body, 8.4);
  addLink(
    doc,
    page,
    cv.gavelling,
    MARGIN + gavellingOffset,
    y,
    measure(gavellingLabel, body, 8.4),
    8.4,
  );

  return doc.save();
}

export const CV_PDF_FILENAME = `${CV_FILENAME}.pdf`;
