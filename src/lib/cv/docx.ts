import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import {
  CV_FILENAME,
  cv,
  gavellingLabel,
  githubLabel,
  portfolioLabel,
} from "@/data/cv";

/**
 * Builds the same Master CV as an editable Word document: real heading styles,
 * real bullet lists and working hyperlinks, so it stays editable and
 * ATS-friendly. Section order and wording match the PDF exactly.
 */

const accent = "1D4ED8";
const muted = "5B6472";

function heading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 90 },
    border: { bottom: { color: "CCD4E0", space: 2, style: "single", size: 6 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 19,
        color: accent,
        characterSpacing: 12,
      }),
    ],
  });
}

function body(
  text: string,
  options: { bold?: boolean; color?: string; size?: number } = {},
) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text,
        bold: options.bold ?? false,
        color: options.color ?? "0F172A",
        size: options.size ?? 19,
      }),
    ],
  });
}

function bulletRun(
  text: string,
  options: { bold?: boolean; color?: string } = {},
) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({
        text,
        bold: options.bold ?? false,
        size: 19,
        color: options.color ?? "0F172A",
      }),
    ],
  });
}

function bullet(label: string, detail: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 50 },
    children: [
      new TextRun({
        text: `${label} — `,
        bold: true,
        size: 19,
        color: "0F172A",
      }),
      new TextRun({ text: detail, size: 19, color: muted }),
    ],
  });
}

function subheading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 140, after: 30 },
    keepNext: true,
    children: [new TextRun({ text, bold: true, size: 21, color: "0F172A" })],
  });
}

function link(url: string, text: string) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text, color: accent, underline: {}, size: 18 })],
  });
}

function separator() {
  return new TextRun({ text: "  ·  ", size: 18, color: muted });
}

export async function buildCvDocx(): Promise<Uint8Array> {
  const contact = new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: `${cv.location}  ·  ${cv.phone}  ·  `,
        size: 18,
        color: muted,
      }),
      link(`mailto:${cv.email}`, cv.email),
      separator(),
      link(cv.portfolio, portfolioLabel),
      separator(),
      link(cv.github, githubLabel),
    ],
  });

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: cv.name, bold: true, size: 44, color: "0F172A" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [new TextRun({ text: cv.role, size: 22, color: accent })],
    }),
    contact,

    heading("Profile"),
    body(cv.profile),

    heading("Education"),
    ...cv.education.flatMap((entry) => [
      body(entry.school, { bold: true, size: 20 }),
      body(`${entry.detail} · ${entry.meta}`, { color: muted }),
    ]),

    heading("Model United Nations Experience"),
    ...cv.mun.flatMap((entry) => [
      subheading(entry.event),
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({ text: `${entry.role} · `, size: 19, color: "0F172A" }),
          new TextRun({ text: entry.committee, size: 19, color: "0F172A" }),
          new TextRun({ text: ` · ${entry.date}`, size: 19, color: muted }),
        ],
      }),
      ...(entry.portfolio
        ? [body(`Represented ${entry.portfolio}`, { color: muted, size: 19 })]
        : []),
      body(`Awards: ${entry.awards.join(" · ")}`, {
        bold: true,
        color: accent,
        size: 19,
      }),
    ]),
    ...cv.munHighlights.map((highlight) => bulletRun(highlight)),

    heading("Technical Skills"),
    ...cv.skills.map(
      (group) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${group.label}: `,
              bold: true,
              size: 19,
              color: "0F172A",
            }),
            new TextRun({ text: group.value, size: 19, color: "0F172A" }),
          ],
        }),
    ),

    heading("Development Experience"),
    ...cv.experience.flatMap((entry) => [
      body(entry.title, { bold: true, size: 20 }),
      body(entry.meta, { color: muted }),
      ...entry.points.map((point) => bulletRun(point)),
    ]),

    heading("Selected Projects"),
    ...cv.projects.flatMap((project) => [
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({
            text: project.name,
            bold: true,
            size: 19,
            color: "0F172A",
          }),
          new TextRun({
            text: ` — ${project.status}`,
            size: 18,
            color: accent,
          }),
        ],
      }),
      body(project.summary, { color: muted }),
      body(project.tech, { color: muted, size: 17 }),
    ]),

    heading("Competitions and Awards"),
    ...cv.results.map((result) =>
      bullet(`${result.place} — ${result.detail}`, result.event),
    ),

    heading("Leadership and Extracurricular"),
    ...cv.leadership.map((item) => bullet(item.title, item.detail)),

    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 200 },
      children: [
        link(cv.portfolio, portfolioLabel),
        separator(),
        link(cv.gavelling, gavellingLabel),
      ],
    }),
  ];

  const doc = new Document({
    creator: cv.name,
    title: `${cv.name} — CV`,
    description: "Curriculum Vitae",
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 19 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}

export const CV_DOCX_FILENAME = `${CV_FILENAME}.docx`;
