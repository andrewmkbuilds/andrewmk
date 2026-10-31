/**
 * The two-row build-stack ribbon under the hero.
 *
 * Five platforms are the headline of the ribbon (Base44, Lovable, GitHub,
 * Claude, ChatGPT) and recur constantly; every other technology the portfolio
 * already names drifts past occasionally. Both rows repeat the same primaries
 * at different offsets, so a primary is never more than a chip or two away and
 * a secondary is always a passing guest rather than a fixture.
 *
 * Names come from the portfolio's own stack list — nothing is added here that
 * the site does not already publish.
 */

export interface MarqueeItem {
  name: string;
  tier: "primary" | "secondary";
}

export interface MarqueeRow {
  label: string;
  items: MarqueeItem[];
  reverse: boolean;
}

/** The five platforms that must stay prominent in both rows. */
const PRIMARY = ["Base44", "Lovable", "GitHub", "Claude", "ChatGPT"];

/**
 * Every other technology the site features, in two halves so each row has its
 * own cast and the pair together covers the whole stack.
 */
const SECONDARY = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Swift",
  "Node.js",
  "Kotlin",
  "Flutter",
  "Java",
  "Tailwind CSS",
  "Rust",
  "Vue",
  "JavaScript",
  "Supabase",
  "C++",
  "Firebase",
  "Go",
  "Docker",
  "SQL",
  "Vercel",
  "HTML",
  "Figma",
  "CSS",
  "Xcode",
  "OpenCV",
  "MediaPipe",
  "Gemini API",
  "Postman",
];

/**
 * Two primaries, then one guest. A row of 8 guests therefore carries 16
 * primary chips — twice the secondary density — and the guest cast changes
 * from row to row.
 */
function weave(guests: string[], offset: number): MarqueeItem[] {
  const items: MarqueeItem[] = [];
  guests.forEach((guest, index) => {
    items.push({
      name: PRIMARY[(index * 2 + offset) % PRIMARY.length]!,
      tier: "primary",
    });
    items.push({
      name: PRIMARY[(index * 2 + 1 + offset) % PRIMARY.length]!,
      tier: "primary",
    });
    items.push({ name: guest, tier: "secondary" });
  });
  return items;
}

const half = Math.ceil(SECONDARY.length / 2);

export const marqueeRows: MarqueeRow[] = [
  {
    label: "Platforms, languages and tools I build with — row one",
    items: weave(SECONDARY.slice(0, half), 0),
    reverse: false,
  },
  {
    label: "Platforms, languages and tools I build with — row two",
    items: weave(SECONDARY.slice(half), 3),
    reverse: true,
  },
];
