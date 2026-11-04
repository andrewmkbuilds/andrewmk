/**
 * Small identity constants.
 *
 * These live apart from `portfolio.ts` because the layout needs one of them
 * (the footer's positioning line) on every route: importing it from the full
 * portfolio module pulled every project record into the shared layout chunk
 * that each page downloads before it can hydrate. `portfolio.ts` re-exports all
 * of them, so importers keep using `@/data/portfolio` where they also need
 * projects.
 */

/**
 * The name the site is indexed under. Search engines and AI answer engines
 * need one canonical string for the person; every schema node, page title and
 * machine-readable file uses this, while `SHORT_NAME` stays the running copy.
 */
export const FULL_NAME = "Andrew Mathews Kalathil";

/** The form of the name used in the hero, prose and social handles. */
export const SHORT_NAME = "Andrew Mathews";

/** Other public names the same person is published under (verified on this site). */
export const NAME_ALIASES = [
  "Andrew Mathews",
  "AndrewBuilds",
  "andrewmkbuilds",
];

export const LOCATION = "Dubai, United Arab Emirates";

/** Current age, published as "14-year-old" in prose and schema descriptions. */
export const AGE = 14;

/** Age when the public building record starts (2022, Mbot@IHS robotics). */
export const BUILDING_SINCE_AGE = 9;

/** The role line the public files state for the person. */
export const ROLE_SUMMARY =
  "Student Developer, Full-Stack Builder, AI & Automation Enthusiast, STEM Innovator";

/** One-sentence entity description shared by the Person schema and the public files. */
export const PERSON_DESCRIPTION =
  "Andrew Mathews Kalathil is a 14-year-old student developer and AI builder from Dubai, United Arab Emirates, working across full-stack web development, AI and automation, robotics and STEM innovation.";

/** Verified public profiles, used for Person.sameAs and the About page. */
export const SOCIAL_PROFILES = [
  "https://github.com/andrewmkbuilds",
  "https://x.com/Andrew444884",
  "https://www.instagram.com/andrewmkbuilds/",
  "https://lovable.dev/@andrewbuilds",
  "https://app.base44.com/@andrewmkbuilds",
  "https://linktr.ee/andrewmkbuilds",
];

export const GITHUB_URL = "https://github.com/andrewmkbuilds";
export const LINKTREE_URL = "https://linktr.ee/andrewmkbuilds";

/** Public contact address shown on the contact page. */
export const CONTACT_EMAIL = "buildwithandrewmk@gmail.com";

/** One-line professional description, used wherever the site states who I am. */
export const PROFILE_TITLE = "Student Developer · AI Builder · Systems Thinker";

/** Verbatim identity line from the source About page and Person JSON-LD. */
export const PROFILE_IDENTITY =
  "Student · Developer · AI Builder · Systems Thinker";

export const SCHOOL = "The Indian High School, Dubai";
