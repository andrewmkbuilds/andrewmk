import { CONTACT_EMAIL, PROFILE_TITLE, SCHOOL } from "@/data/portfolio";

/**
 * The downloadable CV — one structured source for the page preview, the PDF
 * and the DOCX, so all three always show the same document.
 *
 * Facts mirror https://andrewmk.is-a.dev plus the owner's own CV brief. Add an
 * entry here and every download follows; nothing is invented or exaggerated.
 */

export const CV_FILENAME = "Andrew_Mathews_Kalathil_CV";
export const PORTFOLIO_URL = "https://andrewmk.is-a.dev";
export const GITHUB_URL = "https://github.com/andrewmkbuilds";

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

export interface CvAwardEntry {
  title: string;
  detail: string;
}

export interface CvLeadershipEntry {
  title: string;
  detail: string;
}

export const cv = {
  name: "Andrew Mathews",
  role: PROFILE_TITLE,
  location: "Dubai, UAE",
  email: CONTACT_EMAIL,
  portfolio: PORTFOLIO_URL,
  github: GITHUB_URL,
  profile:
    "Student developer, AI builder and STEM enthusiast based in Dubai. Started with robotics at nine and now builds AI tools, web products and computer-vision projects end to end, from first prototype to working product.",

  education: [
    {
      school: SCHOOL,
      detail: "Grade 8, progressing to Grade 9 in the 2027 academic year",
      meta: "Dubai, UAE",
    },
  ] satisfies CvEducationEntry[],

  skills: [
    { label: "Languages", value: "Python, JavaScript, TypeScript, HTML, CSS" },
    { label: "Frameworks", value: "React, Flutter" },
    { label: "AI", value: "AI integrations, AI APIs, automation" },
    { label: "Vision & hardware", value: "Computer vision (OpenCV, MediaPipe), robotics" },
    { label: "Engineering", value: "APIs, responsive interfaces, rapid prototyping" },
  ] satisfies CvSkillGroup[],

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

  awards: [
    {
      title: "IHSMUN 2025",
      detail: "Honourable Mention and Best Position Paper",
    },
    {
      title: "IHS UNSummit 2026",
      detail: "Verbal Commendation and Best Resolution",
    },
    {
      title: "Novara MUN 2026",
      detail: "Verbal Commendation",
    },
    {
      title: "RoundSquare MUN 2026",
      detail: "Participation, with positive chair feedback (not a formal award)",
    },
  ] satisfies CvAwardEntry[],

  leadership: [
    {
      title: "Horizon Motorsports — Sponsorship Manager",
      detail: "Handles sponsorship outreach and partner communication for the team.",
    },
    {
      title: "STEM Racing / F1 in Schools",
      detail: "Engineering competition programme: design, build and present a race project as a team.",
    },
    {
      title: "FIRST LEGO League",
      detail:
        "Robotics seasons including the Dubai Regional, where the team won the Innovation Award in 2025–26.",
    },
    {
      title: "Robotics and coding",
      detail: "Building since age nine: robotics programmes, hardware builds and software projects.",
    },
  ] satisfies CvLeadershipEntry[],
} as const;

export type Cv = typeof cv;

/** The portfolio link as it reads in the document, without the protocol. */
export const portfolioLabel = cv.portfolio.replace(/^https?:\/\//, "").replace(/\/$/, "");
export const githubLabel = cv.github.replace(/^https?:\/\//, "");
