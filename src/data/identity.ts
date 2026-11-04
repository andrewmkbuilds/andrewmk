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
