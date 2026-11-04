/**
 * Recognisable brand marks.
 *
 * Every technology, company and credential issuer named on the site that has
 * an official mark is listed here. The marks themselves are the official
 * monochrome SVGs vendored into `public/brands` (Simple Icons), so they are
 * same-origin, cached, tiny and safe on light and dark surfaces — the tint
 * comes from `currentColor` via a CSS mask.
 *
 * `domain` is the official site used for the Logo.dev request when a
 * publishable token is configured (`VITE_LOGO_DEV_TOKEN`); without it the
 * vendored mark renders instead and nothing is fetched over the network.
 *
 * Only brands that actually appear in the portfolio content belong here.
 */
export interface Brand {
  /**
   * Filename (without extension) in `/public/brands`, when an official
   * monochrome mark is vendored. Brands without one still resolve their
   * domain, so Logo.dev can supply the mark when it is configured.
   */
  slug?: string;
  /**
   * Official raster mark published by the brand itself, used only when no
   * monochrome vector exists (Base44). Served from `/public/brands`.
   */
  image?: string;
  /** Official domain, used for Logo.dev. */
  domain: string;
  /** Human-readable brand name, used for accessible labels and tooltips. */
  label: string;
}

const BRANDS: Record<string, Brand> = {
  react: { slug: "react", domain: "react.dev", label: "React" },
  javascript: {
    slug: "javascript",
    domain: "javascript.com",
    label: "JavaScript",
  },
  typescript: {
    slug: "typescript",
    domain: "typescriptlang.org",
    label: "TypeScript",
  },
  python: { slug: "python", domain: "python.org", label: "Python" },
  html5: { slug: "html5", domain: "w3.org", label: "HTML" },
  css: { slug: "css", domain: "w3.org", label: "CSS" },
  tailwind: {
    slug: "tailwindcss",
    domain: "tailwindcss.com",
    label: "Tailwind CSS",
  },
  nodejs: { slug: "nodedotjs", domain: "nodejs.org", label: "Node.js" },
  nextjs: { slug: "nextdotjs", domain: "nextjs.org", label: "Next.js" },
  vite: { slug: "vite", domain: "vitejs.dev", label: "Vite" },
  flutter: { slug: "flutter", domain: "flutter.dev", label: "Flutter" },
  opencv: { slug: "opencv", domain: "opencv.org", label: "OpenCV" },
  mediapipe: { slug: "mediapipe", domain: "mediapipe.dev", label: "MediaPipe" },
  gemini: {
    slug: "googlegemini",
    domain: "gemini.google.com",
    label: "Google Gemini",
  },
  google: { slug: "google", domain: "google.com", label: "Google" },
  googlecloud: {
    slug: "googlecloud",
    domain: "cloud.google.com",
    label: "Google Cloud",
  },
  supabase: { slug: "supabase", domain: "supabase.com", label: "Supabase" },
  firebase: {
    slug: "firebase",
    domain: "firebase.google.com",
    label: "Firebase",
  },
  mongodb: { slug: "mongodb", domain: "mongodb.com", label: "MongoDB" },
  postgresql: {
    slug: "postgresql",
    domain: "postgresql.org",
    label: "PostgreSQL",
  },
  git: { slug: "git", domain: "git-scm.com", label: "Git" },
  github: { slug: "github", domain: "github.com", label: "GitHub" },
  figma: { slug: "figma", domain: "figma.com", label: "Figma" },
  unity: { slug: "unity", domain: "unity.com", label: "Unity" },
  docker: { slug: "docker", domain: "docker.com", label: "Docker" },
  arduino: { slug: "arduino", domain: "arduino.cc", label: "Arduino" },
  espressif: {
    slug: "espressif",
    domain: "espressif.com",
    label: "Espressif (ESP32)",
  },
  androidstudio: {
    slug: "androidstudio",
    domain: "developer.android.com",
    label: "Android Studio",
  },
  stripe: { slug: "stripe", domain: "stripe.com", label: "Stripe" },
  vercel: { slug: "vercel", domain: "vercel.com", label: "Vercel" },
  framer: { slug: "framer", domain: "framer.com", label: "Framer" },
  claude: { slug: "claude", domain: "claude.com", label: "Claude" },
  anthropic: { slug: "anthropic", domain: "anthropic.com", label: "Anthropic" },
  credly: { slug: "credly", domain: "credly.com", label: "Credly" },
  hackerrank: {
    slug: "hackerrank",
    domain: "hackerrank.com",
    label: "HackerRank",
  },
  datacamp: { slug: "datacamp", domain: "datacamp.com", label: "DataCamp" },
  first: { slug: "first", domain: "firstinspires.org", label: "FIRST" },
  linktree: { slug: "linktree", domain: "linktr.ee", label: "Linktree" },
  pillow: { domain: "python-pillow.org", label: "Pillow" },
  openexchange: {
    domain: "openexchangerates.org",
    label: "Open Exchange Rates",
  },
  // Languages and runtimes beyond the original vendored set.
  swift: { slug: "swift", domain: "swift.org", label: "Swift" },
  // Apple publishes no Objective-C mark of its own.
  objectivec: { domain: "developer.apple.com", label: "Objective-C" },
  kotlin: { slug: "kotlin", domain: "kotlinlang.org", label: "Kotlin" },
  java: { slug: "java", domain: "java.com", label: "Java" },
  cplusplus: { slug: "cplusplus", domain: "isocpp.org", label: "C++" },
  // Microsoft ships no standalone C# mark.
  csharp: { domain: "dotnet.microsoft.com", label: "C#" },
  rust: { slug: "rust", domain: "rust-lang.org", label: "Rust" },
  go: { slug: "go", domain: "go.dev", label: "Go" },
  ruby: { domain: "ruby-lang.org", label: "Ruby" },
  php: { domain: "php.net", label: "PHP" },
  // Frameworks, tools and platforms.
  vue: { slug: "vue", domain: "vuejs.org", label: "Vue" },
  nuxt: { domain: "nuxt.com", label: "Nuxt" },
  express: { domain: "expressjs.com", label: "Express" },
  reactnative: { domain: "reactnative.dev", label: "React Native" },
  xcode: { slug: "xcode", domain: "developer.apple.com", label: "Xcode" },
  postman: { slug: "postman", domain: "postman.com", label: "Postman" },
  openai: { slug: "openai", domain: "openai.com", label: "OpenAI" },
  // Base44 publishes an official app icon but no monochrome vector, so the
  // official PNG from its own marketing assets is the offline fallback.
  base44: {
    image: "/brands/base44.png",
    domain: "base44.com",
    label: "Base44",
  },
  lovable: { slug: "lovable", domain: "lovable.dev", label: "Lovable" },
  // Social profiles linked from the footer, header and About page.
  x: { slug: "x", domain: "x.com", label: "X" },
  instagram: {
    slug: "instagram",
    domain: "instagram.com",
    label: "Instagram",
  },
  youtube: { slug: "youtube", domain: "youtube.com", label: "YouTube" },
  // LinkedIn withdrew its mark from Simple Icons; Logo.dev supplies it.
  linkedin: { domain: "linkedin.com", label: "LinkedIn" },
};

/** Names as written in the portfolio content → brand key. */
const NAMES: Record<string, keyof typeof BRANDS> = {
  React: "react",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  // Tkinter is Python's own GUI toolkit and has no separate official mark.
  Tkinter: "python",
  HTML: "html5",
  CSS: "css",
  "Tailwind CSS": "tailwind",
  "Node.js": "nodejs",
  "Next.js": "nextjs",
  Vite: "vite",
  Flutter: "flutter",
  OpenCV: "opencv",
  MediaPipe: "mediapipe",
  "Gemini API": "gemini",
  "Google Gemini API": "gemini",
  Google: "google",
  "Google Cloud": "googlecloud",
  Supabase: "supabase",
  Firebase: "firebase",
  MongoDB: "mongodb",
  SQL: "postgresql",
  PostgreSQL: "postgresql",
  Git: "git",
  GitHub: "github",
  Figma: "figma",
  Unity: "unity",
  Docker: "docker",
  Arduino: "arduino",
  ESP32: "espressif",
  "Android Studio": "androidstudio",
  Stripe: "stripe",
  Vercel: "vercel",
  "Framer Motion": "framer",
  Framer: "framer",
  Claude: "claude",
  Anthropic: "anthropic",
  Credly: "credly",
  HackerRank: "hackerrank",
  DataCamp: "datacamp",
  FIRST: "first",
  Linktree: "linktree",
  Pillow: "pillow",
  "Open Exchange Rate API": "openexchange",
  Swift: "swift",
  "Objective-C": "objectivec",
  Kotlin: "kotlin",
  Java: "java",
  "C++": "cplusplus",
  "C#": "csharp",
  Rust: "rust",
  Go: "go",
  Ruby: "ruby",
  PHP: "php",
  Vue: "vue",
  Nuxt: "nuxt",
  Express: "express",
  "React Native": "reactnative",
  Xcode: "xcode",
  Postman: "postman",
  OpenAI: "openai",
  "OpenAI API": "openai",
  ChatGPT: "openai",
  Base44: "base44",
  Lovable: "lovable",
  X: "x",
  Instagram: "instagram",
  YouTube: "youtube",
  LinkedIn: "linkedin",
};

/** Brand for a name exactly as the content writes it, if one exists. */
export function brandFor(name: string | undefined): Brand | undefined {
  if (!name) return undefined;
  const key = NAMES[name.trim()];
  return key ? BRANDS[key] : undefined;
}

/**
 * Issuer line → brand. Certificates write issuers as
 * "The Indian High School, Dubai · Group Techfest", so match on the first
 * segment only and never invent a mark for an organisation that has none.
 */
export function brandForIssuer(issuer: string | undefined): Brand | undefined {
  if (!issuer) return undefined;
  const org = issuer.split("·")[0]?.trim() ?? "";
  const direct = brandFor(org);
  if (direct) return direct;
  if (org.startsWith("FIRST LEGO League")) return BRANDS["first"];
  return undefined;
}
