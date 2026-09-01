/**
 * Certificates sourced from Andrew's connected Google Drive folder
 * "Andrew Mathews Certificates 48481". Every entry below points at the real
 * file downloaded from that folder — nothing here is generated or invented.
 * Titles, issuers and dates are transcribed only where they are legible on the
 * certificate itself; unclear fields are omitted rather than guessed.
 */

export type CertificateCategory =
  | "TechFest"
  | "Data Science"
  | "IoT"
  | "Space Tech"
  | "FLL"
  | "Robotics"
  | "MUN"
  | "STEM / Engineering"
  | "Certifications"
  | "Academic"
  | "Other";

export interface Certificate {
  id: string;
  /** Title as stated on the certificate. */
  title: string;
  /** Issuing organisation, only when clearly visible on the document. */
  issuer?: string;
  /** Date or period printed on the certificate. */
  date?: string;
  category: CertificateCategory;
  /** Full-size original file, served from /public. */
  file: string;
  /** Lightweight preview generated from the original for the card. */
  thumb: string;
  type: "image" | "pdf";
  /** Links this certificate to an achievement already listed on the site. */
  achievementKey?: string;
}

const DIR = "/certificates";

export const certificates: Certificate[] = [
  {
    id: "fll-innovation",
    title: "Innovation Award — Winner",
    issuer: "FIRST LEGO League UAE (UNEARTHED)",
    date: "Dubai Regional 2025-2026",
    category: "FLL",
    file: `${DIR}/fll-innovation-certificate.jpg`,
    thumb: `${DIR}/thumbs/fll-innovation-certificate.webp`,
    type: "image",
    achievementKey: "fll-innovation",
  },
  {
    id: "fll-participation",
    title: "Certificate of Participation — Challenge: Dubai Regional",
    issuer: "FIRST LEGO League UAE (UNEARTHED)",
    date: "2025-2026",
    category: "FLL",
    file: `${DIR}/fll-participation-certificate.jpg`,
    thumb: `${DIR}/thumbs/fll-participation-certificate.webp`,
    type: "image",
  },
  {
    id: "techfest-data-science-1st",
    title: "Certificate of Merit — 1st Position, Data Science pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "6 May 2025",
    category: "Data Science",
    file: `${DIR}/7v-techfest-data-science-certificate-of-merit.jpg`,
    thumb: `${DIR}/thumbs/7v-techfest-data-science-certificate-of-merit.webp`,
    type: "image",
    achievementKey: "techfest-data-science",
  },
  {
    id: "techfest-iot-2nd",
    title: "Certificate of Merit — 2nd Position, IoT pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "6 May 2025",
    category: "IoT",
    file: `${DIR}/7v-techfest-iot-certificate-of-merit.jpg`,
    thumb: `${DIR}/thumbs/7v-techfest-iot-certificate-of-merit.webp`,
    type: "image",
    achievementKey: "techfest-iot",
  },
  {
    id: "techfest-space-tech-2nd",
    title: "Certificate of Appreciation — 2nd Position, Space Tech pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "9 May 2024",
    category: "Space Tech",
    file: `${DIR}/6t-techfest-space-tech-certificate-of-merit.jpg`,
    thumb: `${DIR}/thumbs/6t-techfest-space-tech-certificate-of-merit.webp`,
    type: "image",
    achievementKey: "techfest-space-tech",
  },
  {
    id: "techfest-digiquizz",
    title: "Certificate of Participation — Digiquizz pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "6 May 2025",
    category: "TechFest",
    file: `${DIR}/7v-techfest-digiquizz-participation-certifcate.jpg`,
    thumb: `${DIR}/thumbs/7v-techfest-digiquizz-participation-certifcate.webp`,
    type: "image",
  },
  {
    id: "techfest-coding",
    title: "Certificate of Participation — Coding pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "9 May 2024",
    category: "TechFest",
    file: `${DIR}/6t-techfest-coding-participation-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-techfest-coding-participation-certificate.webp`,
    type: "image",
  },
  {
    id: "techfest-data-science-participation",
    title: "Certificate of Participation — Data Science pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "9 May 2024",
    category: "Data Science",
    file: `${DIR}/6t-techfest-data-science-participation-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-techfest-data-science-participation-certificate.webp`,
    type: "image",
  },
  {
    id: "techfest-design",
    title: "Certificate of Participation — Design pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "9 May 2024",
    category: "TechFest",
    file: `${DIR}/6t-techfest-design-participation-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-techfest-design-participation-certificate.webp`,
    type: "image",
  },
  {
    id: "techfest-space-tech-appreciation",
    title: "Certificate of Appreciation — 2nd Position, Space Tech pathway",
    issuer: "The Indian High School, Dubai · Group Techfest",
    date: "9 May 2024",
    category: "Space Tech",
    file: `${DIR}/6t-techfest-space-tech-appreciation-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-techfest-space-tech-appreciation-certificate.webp`,
    type: "image",
  },
  {
    id: "robotics-2025",
    title: "Certificate of Participation — Robotics & Coding @IHS, after school program",
    issuer: "The Indian High School, Dubai",
    date: "Academic year 2025-2026",
    category: "Robotics",
    file: `${DIR}/7v-robotics-course-certificate.jpg`,
    thumb: `${DIR}/thumbs/7v-robotics-course-certificate.webp`,
    type: "image",
  },
  {
    id: "robotics-2023",
    title: "Certificate of Participation — Robotics with mBot @IHS, after school program",
    issuer: "The Indian High School, Dubai",
    date: "28 February 2023 · Academic year 2022-2023",
    category: "Robotics",
    file: `${DIR}/4n-robotics-certificate.jpg`,
    thumb: `${DIR}/thumbs/4n-robotics-certificate.webp`,
    type: "image",
  },
  {
    id: "mun-ihsmun-2025",
    title: "IHSMUN 2025 — Certificate of Participation",
    issuer: "The Indian High School, Dubai",
    date: "24-26 October 2025",
    category: "MUN",
    file: `${DIR}/7v-mun-certificate.jpg`,
    thumb: `${DIR}/thumbs/7v-mun-certificate.webp`,
    type: "image",
    achievementKey: "mun-ihsmun-2025",
  },
  {
    id: "math-expo",
    title: "Certificate of Participation — Second prize, Math Expo \u201cMath & Me\u201d",
    issuer: "The Indian High School, Dubai",
    date: "31 May 2024",
    category: "STEM / Engineering",
    file: `${DIR}/6t-math-exhibition-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-math-exhibition-certificate.webp`,
    type: "image",
    achievementKey: "math-expo",
  },
  {
    id: "tech-sphere",
    title: "Certificate of Appreciation — SMILE and SHINE Tech Sphere",
    issuer: "The Indian High School, Dubai",
    date: "29 November 2024",
    category: "STEM / Engineering",
    file: `${DIR}/6t-tech-exhibition-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-tech-exhibition-certificate.webp`,
    type: "image",
  },
  {
    id: "creative-model",
    title: "Certificate of Participation — Creative and Innovative Model / Experiment",
    issuer: "The Indian High School, Dubai",
    category: "STEM / Engineering",
    file: `${DIR}/4n-creative-model-presentation-certificate.jpg`,
    thumb: `${DIR}/thumbs/4n-creative-model-presentation-certificate.webp`,
    type: "image",
  },
  {
    id: "asdan-environmental",
    title: "Environmental Short Course — 4 ASDAN credits",
    issuer: "ASDAN",
    date: "Issued 29 January 2026",
    category: "Certifications",
    file: `${DIR}/certificate-andrew-mathews.pdf`,
    thumb: `${DIR}/thumbs/certificate-andrew-mathews.webp`,
    type: "pdf",
  },
  {
    id: "skill-up",
    title: "Certificate of Appreciation — Skill Up initiative",
    issuer: "The Indian High School, Oud Metha, Dubai",
    date: "14 October 2024",
    category: "Academic",
    file: `${DIR}/6t-skill-up-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-skill-up-certificate.webp`,
    type: "image",
  },
  {
    id: "future-uae-exhibition",
    title: "Certificate of Participation — Future UAE Exhibition",
    issuer: "The Indian High School, Dubai",
    date: "12 May 2025",
    category: "Academic",
    file: `${DIR}/7v-uae-sst-exhibition-certificate.jpg`,
    thumb: `${DIR}/thumbs/7v-uae-sst-exhibition-certificate.webp`,
    type: "image",
  },
  {
    id: "sst-exhibition",
    title: "Certificate of Participation — SST Exhibition: UAE Legacy, Progress and Destiny",
    issuer: "The Indian High School, Dubai",
    date: "20 September 2024",
    category: "Academic",
    file: `${DIR}/6t-sst-exhibition-certificate.jpg`,
    thumb: `${DIR}/thumbs/6t-sst-exhibition-certificate.webp`,
    type: "image",
  },
  {
    id: "republic-day",
    title: "Certificate of Participation — Republic Day celebrations",
    issuer: "The Indian High School, Dubai",
    date: "26 January 2024",
    category: "Academic",
    file: `${DIR}/5y-republic-day-certificate.jpg`,
    thumb: `${DIR}/thumbs/5y-republic-day-certificate.webp`,
    type: "image",
  },
  {
    id: "shot-put",
    title: "Certificate of Merit — Third position, Shot Put (Grade 7)",
    issuer: "The Indian High School, Dubai · Annual Athletic Meet 2025",
    date: "12 November 2025",
    category: "Other",
    file: `${DIR}/7v-sports-day-certificate.jpg`,
    thumb: `${DIR}/thumbs/7v-sports-day-certificate.webp`,
    type: "image",
    achievementKey: "shot-put",
  },
];

/** Category order used by the filter bar; only categories in use are shown. */
const CATEGORY_ORDER: CertificateCategory[] = [
  "FLL",
  "TechFest",
  "Data Science",
  "IoT",
  "Space Tech",
  "Robotics",
  "STEM / Engineering",
  "MUN",
  "Certifications",
  "Academic",
  "Other",
];

export const certificateCategories = CATEGORY_ORDER.filter((c) =>
  certificates.some((cert) => cert.category === c),
);

export function certificateFor(key: string): Certificate | undefined {
  return certificates.find((c) => c.achievementKey === key);
}

/**
 * Best-effort sort key from the human-written date on the certificate.
 * Dates are transcribed verbatim, so this parses "12 November 2025",
 * "Issued 29 January 2026", "2025-2026" and "Academic year 2022-2023".
 */
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export function certificateSortKey(cert: Certificate): number {
  const raw = cert.date ?? "";
  const years = raw.match(/\d{4}/g);
  const year = years ? Math.max(...years.map(Number)) : 0;
  const month = MONTHS.findIndex((m) => raw.toLowerCase().includes(m));
  const day = Number(raw.match(/\b(\d{1,2})\s+[A-Za-z]{3,}/)?.[1] ?? 1);
  return year * 10000 + (month >= 0 ? month + 1 : 0) * 100 + day;
}

/** Short, readable date for cards: "Nov 2025", "2025–2026", or "" when unknown. */
export function certificateDateLabel(cert: Certificate): string {
  const raw = cert.date;
  if (!raw) return "";
  const range = raw.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (range) return `${range[1]}–${range[2]}`;
  const year = raw.match(/\d{4}/)?.[0];
  const monthIndex = MONTHS.findIndex((m) => raw.toLowerCase().includes(m));
  if (year && monthIndex >= 0) {
    const month = MONTHS[monthIndex]!;
    return `${month.slice(0, 3).replace(/^./, (c) => c.toUpperCase())} ${year}`;
  }
  return year ?? raw;
}

/** Issuer split into organisation and programme, for two-line card display. */
export function certificateIssuerParts(cert: Certificate): { org: string; program?: string } {
  if (!cert.issuer) return { org: "Independent" };
  const [org, ...rest] = cert.issuer.split("·").map((part) => part.trim());
  const program = rest.join(" · ");
  return program ? { org: org ?? cert.issuer, program } : { org: org ?? cert.issuer };
}

/** Newest certificates first — used by the gallery and résumé. */
export const certificatesByRecency: Certificate[] = [...certificates].sort(
  (a, b) => certificateSortKey(b) - certificateSortKey(a),
);

/** Filename suggested when a visitor downloads the original document. */
export function certificateDownloadName(cert: Certificate): string {
  const ext = cert.type === "pdf" ? "pdf" : "jpg";
  return `${cert.id}-andrew-mathews.${ext}`;
}
