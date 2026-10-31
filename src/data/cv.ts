import { CONTACT_EMAIL, PROFILE_TITLE, SCHOOL } from "@/data/portfolio";

/**
 * The downloadable Master CV — one structured source for the page preview, the
 * PDF and the DOCX, so all three always show the same document.
 *
 * Provenance:
 * - Model United Nations facts, the full name, the phone number and the
 *   Gavelling profile come from the owner's ten supplied CV documents
 *   (five distinct contents; see `docs/cv/MASTER_CV_SOURCE_AUDIT.md`).
 * - Development, competition and leadership facts mirror
 *   https://andrewmk.is-a.dev (see `src/data/portfolio.ts`).
 *
 * Open discrepancies are recorded in `docs/cv/MASTER_CV_CONFLICTS.md`; nothing
 * here is invented. Add an entry and every download follows.
 */

export const CV_FILENAME = "Andrew_Mathews_Kalathil_CV";
export const MASTER_CV_FILENAME = "Andrew_Mathews_Kalathil_Master_CV";
export const PORTFOLIO_URL = "https://andrewmk.is-a.dev";
export const GITHUB_URL = "https://github.com/andrewmkbuilds";
/** Personal CV profile used in the supplied CV documents (not on the website). */
export const GAVELLING_URL = "https://gavelling.com/cv/andrew-cc2f1dc3";
/** Stated in every supplied CV document; the website publishes no phone number. */
export const CV_PHONE = "+971 54 347 4736";

export interface CvEducationEntry {
  school: string;
  detail: string;
  meta: string;
}

export interface CvSkillGroup {
  label: string;
  value: string;
}

export interface CvExperienceEntry {
  title: string;
  meta: string;
  points: string[];
}

export interface CvProjectEntry {
  name: string;
  /** Completion state, stated exactly as the project data records it. */
  status: string;
  summary: string;
  tech: string;
}

/** One Model United Nations conference, as the supplied CV documents record it. */
export interface CvMunEntry {
  event: string;
  date: string;
  role: string;
  /** Committee the delegate sat in. */
  committee: string;
  /** Country or person represented, only where a source states it. */
  portfolio?: string;
  /** Every award named by a source, in the source's order. */
  awards: string[];
}

export interface CvResultEntry {
  place: string;
  detail: string;
  event: string;
}

export interface CvLeadershipEntry {
  title: string;
  detail: string;
}

export const cv = {
  name: "Andrew Mathews Kalathil",
  role: PROFILE_TITLE,
  location: "Dubai, UAE",
  email: CONTACT_EMAIL,
  phone: CV_PHONE,
  portfolio: PORTFOLIO_URL,
  github: GITHUB_URL,
  gavelling: GAVELLING_URL,
  profile:
    "Student developer and Model United Nations delegate based in Dubai. Builds AI tools, web products and computer-vision projects end to end, from first prototype to working product, and has been awarded at every MUN conference attended — representing Russia, Liam Lawson and Kodikunnil Suresh across the UNSC, FIA and Lok Sabha committees.",

  education: [
    {
      school: SCHOOL,
      detail: "Grade 8, progressing to Grade 9 in the 2027 academic year",
      meta: "Dubai, UAE",
    },
  ] satisfies CvEducationEntry[],

  skills: [
    { label: "Languages", value: "Python, JavaScript, TypeScript, HTML, CSS" },
    { label: "Frameworks", value: "React, Flutter, Tkinter" },
    {
      label: "AI",
      value: "Generative AI, AI APIs, AI applications, automation",
    },
    {
      label: "Vision & hardware",
      value: "Computer vision (OpenCV, MediaPipe), robotics",
    },
    {
      label: "Engineering",
      value: "APIs, responsive interfaces, rapid prototyping",
    },
    {
      label: "MUN & diplomacy",
      value:
        "Research, negotiation, public speaking, resolution and position-paper writing",
    },
  ] satisfies CvSkillGroup[],

  mun: [
    {
      event: "Novara MUN 2026",
      date: "July 2026",
      role: "Delegate",
      committee: "United Nations Security Council (UNSC)",
      portfolio: "Russia",
      awards: ["Verbal Commendation"],
    },
    {
      event: "IHS UNSummit 2026",
      date: "June 2026",
      role: "Delegate",
      committee: "Fédération Internationale de l'Automobile (FIA)",
      portfolio: "Liam Lawson",
      awards: ["Verbal Commendation", "Best Resolution"],
    },
    {
      event: "IHSMUN 2025",
      date: "24–26 October 2025",
      role: "Delegate",
      committee: "Lok Sabha B",
      portfolio: "Kodikunnil Suresh",
      awards: ["Honourable Mention", "Best Position Paper"],
    },
  ] satisfies CvMunEntry[],

  munHighlights: [
    "Awarded at every MUN conference attended: two individual awards each at IHS UNSummit 2026 and IHSMUN 2025, one at Novara MUN 2026.",
    "Experience across crisis, specialised and domestic committees, including a UN Security Council simulation.",
    "Drafted resolutions, directives and position papers from research to floor debate.",
    "Strengths in diplomacy, negotiation, research, public speaking and teamwork.",
  ],

  experience: [
    {
      title: "Independent Developer — 50+ websites and digital projects",
      meta: "Ongoing · Dubai, UAE",
      points: [
        "Built and shipped 50+ websites and digital projects, from single-page sites and small tools to multi-feature products.",
        "Work spans generative AI, automation, APIs, computer vision and robotics, taken from concept to a working build.",
      ],
    },
  ] satisfies CvExperienceEntry[],

  projects: [
    {
      name: "Gradr",
      status: "Building",
      summary:
        "AI career accelerator: resume analysis, ATS scoring, interview practice and application tracking in one workspace.",
      tech: "AI · React",
    },
    {
      name: "Stack Up",
      status: "Live",
      summary:
        "Personal finance system that makes spending, budgeting and saving easier to understand, with streaks and analytics.",
      tech: "React",
    },
    {
      name: "TerraCart",
      status: "Developing",
      summary:
        "AI shopping assistant that surfaces more sustainable alternatives while people shop online.",
      tech: "AI · Browser extension",
    },
    {
      name: "ClientFlow OS",
      status: "In active development",
      summary:
        "Client lifecycle system connecting enquiry, projects, delivery and payment in a single record.",
      tech: "React · AI",
    },
    {
      name: "DevOS",
      status: "Live",
      summary:
        "AI developer command centre bringing tasks, focus sessions and project threads into one place.",
      tech: "Python · AI integration",
    },
    {
      name: "Horizon Motorsports",
      status: "Active",
      summary:
        "Digital home for a UAE-based racing and engineering team competing in FLL and Techfest.",
      tech: "React · Motion",
    },
  ] satisfies CvProjectEntry[],

  /** Competition and sport results — each has a certificate on the website. */
  results: [
    { place: "1st Place", detail: "Data Science", event: "Techfest" },
    { place: "2nd Place", detail: "IoT", event: "Techfest" },
    { place: "2nd Place", detail: "Space Tech", event: "Group Techfest" },
    {
      place: "Innovation Award",
      detail: "FIRST LEGO League",
      event: "UAE Dubai Regional 2025–26",
    },
    {
      place: "2nd Place",
      detail: "Math Expo “Math & Me”",
      event: "The Indian High School",
    },
    { place: "3rd Place", detail: "Shot Put", event: "Annual Athletic Meet" },
  ] satisfies CvResultEntry[],

  leadership: [
    {
      title: "Horizon Motorsports — Founder and Sponsorship Manager",
      detail:
        "Founded the team and handles sponsorship outreach and partner communication.",
    },
    {
      title: "STEM Racing / F1 in Schools",
      detail:
        "Engineering competition programme: design, build and present a race project as a team.",
    },
    {
      title: "FIRST LEGO League",
      detail:
        "Robotics seasons including the Dubai Regional, where the team won the Innovation Award in 2025–26.",
    },
    {
      title: "Robotics and coding",
      detail:
        "Building since age nine: robotics programmes, hardware builds and software projects.",
    },
    {
      title: "ASDAN Environmental Short Course",
      detail: "Short-course programme completed alongside school science work.",
    },
    {
      title: "Future UAE Exhibition",
      detail: "Participated in the exhibition as a student exhibitor.",
    },
  ] satisfies CvLeadershipEntry[],
} as const;

export type Cv = typeof cv;

/** A link as it reads in the document, without the protocol. */
const label = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const portfolioLabel = label(cv.portfolio);
export const githubLabel = label(cv.github);
export const gavellingLabel = label(cv.gavelling);
