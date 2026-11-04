/**
 * Press-kit biographies.
 *
 * Every sentence restates a fact the rest of the site already publishes
 * (About, Journey, Skills, Projects). Nothing is upgraded, and no achievement,
 * client, employer or availability claim is added here.
 */

export interface BioVariant {
  id: string;
  label: string;
  /** "first" reads as Andrew; "third" reads about him. */
  person: "first" | "third";
  length: "short" | "medium" | "long";
  body: string;
}

export const bios: BioVariant[] = [
  {
    id: "short-first",
    label: "Short · first person",
    person: "first",
    length: "short",
    body: "I'm Andrew Mathews Kalathil, a 14-year-old student developer and AI builder from Dubai. I started building with robotics at age 9 and now build AI applications, web products and systems that solve real problems.",
  },
  {
    id: "short-third",
    label: "Short · third person",
    person: "third",
    length: "short",
    body: "Andrew Mathews Kalathil is a 14-year-old student developer and AI builder from Dubai, UAE. He started building with robotics at age 9 and now builds AI applications, web products and systems that solve real problems.",
  },
  {
    id: "medium-first",
    label: "Medium · first person",
    person: "first",
    length: "medium",
    body: "I'm Andrew Mathews Kalathil, a 14-year-old student developer and systems thinker based in Dubai. I work across artificial intelligence, software development, robotics and product design. I started with the Mbot@IHS robotics programme at age 9, and moved from there into software, AI and computer vision. Today I build everything from small Python experiments to full product systems such as Gradr, TerraCart and ClientFlow OS, and I compete in STEM and engineering challenges, take part in Model United Nations conferences, and show projects at exhibitions.",
  },
  {
    id: "medium-third",
    label: "Medium · third person",
    person: "third",
    length: "medium",
    body: "Andrew Mathews Kalathil is a 14-year-old student developer and systems thinker based in Dubai, UAE. He works across artificial intelligence, software development, robotics and product design. He began with the Mbot@IHS robotics programme at age 9 and moved from there into software, AI and computer vision. He now builds everything from small Python experiments to full product systems such as Gradr, TerraCart and ClientFlow OS, competes in STEM and engineering challenges, takes part in Model United Nations conferences, and shows projects at exhibitions.",
  },
  {
    id: "long-first",
    label: "Long · first person",
    person: "first",
    length: "long",
    body: "I'm Andrew Mathews Kalathil, a 14-year-old student developer and AI builder from Dubai, United Arab Emirates, and a student at The Indian High School, Dubai. I don't just learn technology — I apply it. I started building in 2022 at age 9 through the Mbot@IHS robotics programme, where I built and presented an original model at a school exhibition. That gave me the instinct to build physically; from there I moved deeper into software, AI, computer vision and product development.\n\nToday I work across AI applications and assistants, full-stack web products, robotics and engineering, and data work. My flagship products are Gradr, an AI career accelerator; Stack Up, a personal-finance app built around gamification; TerraCart, a sustainable shopping assistant; and ClientFlow OS, a business operating system. Alongside them sits a larger archive of tools and experiments.\n\nOutside of building, I compete in STEM and engineering challenges — Techfest, FIRST LEGO League and F1 in Schools / STEM Racing — take part in Model United Nations conferences, and demonstrate projects at exhibitions. I care about systems over features, shipping over theory, and starting from a problem worth solving.",
  },
  {
    id: "long-third",
    label: "Long · third person",
    person: "third",
    length: "long",
    body: "Andrew Mathews Kalathil is a 14-year-old student developer and AI builder from Dubai, United Arab Emirates, and a student at The Indian High School, Dubai. He describes his approach simply: he does not just learn technology, he applies it. He started building in 2022 at age 9 through the Mbot@IHS robotics programme, where he built and presented an original model at a school exhibition — the beginning of a move from hardware into software, AI, computer vision and product development.\n\nHe works across AI applications and assistants, full-stack web products, robotics and engineering, and data work. His flagship products are Gradr, an AI career accelerator; Stack Up, a personal-finance app built around gamification; TerraCart, a sustainable shopping assistant; and ClientFlow OS, a business operating system, alongside a larger archive of tools and experiments.\n\nOutside of building, he competes in STEM and engineering challenges — Techfest, FIRST LEGO League and F1 in Schools / STEM Racing — takes part in Model United Nations conferences, and demonstrates projects at exhibitions. His working principles are systems over features, shipping first and improving always, and starting from a real problem.",
  },
];

/** Facts a journalist or collaborator would need, all published elsewhere on the site. */
export const pressFacts = [
  { label: "Name", value: "Andrew Mathews Kalathil" },
  { label: "Also known as", value: "Andrew Mathews · AndrewBuilds" },
  { label: "Practice", value: "AndrewBuilds" },
  {
    label: "Role",
    value: "Student Developer · AI Builder · Systems Thinker",
  },
  { label: "Based in", value: "Dubai, United Arab Emirates" },
  { label: "Age", value: "14" },
  { label: "School", value: "The Indian High School, Dubai" },
  { label: "Building since", value: "2022 · age 9" },
  {
    label: "Flagship products",
    value: "Gradr · Stack Up · TerraCart · ClientFlow OS",
  },
];
