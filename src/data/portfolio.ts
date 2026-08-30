export interface Project {
  slug: string;
  name: string;
  category: string;
  description: string;
  /** Present only when explicitly known. Otherwise the modal shows "What it is". */
  problem?: string;
  built: string[];
  tech: string[];
  status: string;
  live?: string;
  github?: string;
  filters: string[];
  featured?: boolean;
  previously?: string;
  /** Build platform, only when factually known. Drives the "Built with" badge. */
  platform?: "base44" | "lovable";
}

export const featuredProjects: Project[] = [
  {
    slug: "gradr",
    name: "Gradr",
    category: "Career Technology · AI",
    description:
      "An AI-powered career accelerator designed to help students, graduates, and early-career professionals build stronger resumes, prepare for interviews, and manage their career journey.",
    previously: "Previously known as CareerFlow OS.",
    built: [
      "AI resume analysis",
      "ATS scoring",
      "Job tracking",
      "AI mock interviews",
      "Interview analytics",
      "Career development tools",
    ],
    tech: ["AI", "React"],
    status: "Building",
    filters: ["AI", "React", "Lovable"],
    featured: true,
    platform: "lovable",
  },
  {
    slug: "stack-up",
    name: "Stack Up",
    category: "Personal Finance · Gamification",
    description:
      "The first product I shipped. A personal finance system designed to make spending, budgeting, and saving easier to understand and more engaging.",
    built: [
      "Expense tracking",
      "Budget management",
      "Savings goals",
      "Gamification",
      "Streaks",
      "Financial analytics",
    ],
    tech: ["React"],
    status: "Live",
    live: "https://stackup-app.base44.app/",
    filters: ["Base44", "React"],
    featured: true,
    platform: "base44",
  },
  {
    slug: "terracart",
    name: "TerraCart",
    category: "AI · Sustainability · E-commerce",
    description:
      "An AI-powered shopping assistant designed to help people discover more sustainable alternatives while shopping online.",
    built: [
      "E-commerce product analysis",
      "Sustainable alternatives",
      "AI research",
      "Shopping checklist",
      "Browser extension experience",
    ],
    tech: ["AI", "Browser Extension"],
    status: "Developing",
    filters: ["AI"],
    featured: true,
  },
  {
    slug: "clientflow-os",
    name: "ClientFlow OS",
    category: "Business Operating System · AI",
    description:
      "A unified platform for managing clients, projects, conversations, payments, documents, and workflows in one connected system.",
    built: [
      "Client lifecycle management",
      "Project management",
      "Communication tracking",
      "Stripe payments",
      "Invoicing",
      "File storage",
      "AI automation",
      "Approval dashboards",
    ],
    tech: ["AI", "React"],
    status: "In Active Development",
    github: "https://github.com/andrewmkbuilds/ClientFlow-OS",
    filters: ["AI", "React"],
    featured: true,
  },
];

export const ecosystemProjects: Project[] = [
  {
    slug: "horizon-motorsports",
    name: "Horizon Motorsports",
    category: "Racing / Community",
    description:
      "Digital home for Horizon Motorsports, a UAE-based racing team competing in FLL, Techfest, and engineering competitions.",
    built: ["Team site", "Competition presence", "Motion-driven interface"],
    tech: ["React", "Framer Motion"],
    status: "Active",
    live: "https://horizonmotorsports.base44.app/",
    filters: ["React"],
  },
  {
    slug: "devos",
    name: "DevOS",
    category: "Productivity / AI",
    description:
      "AI-powered developer command center designed to bring tasks, focus sessions, and project threads into one place.",
    built: ["Task system", "Focus sessions", "Project threads", "AI integration"],
    tech: ["Python", "AI Integration"],
    status: "Live",
    live: "https://dev-os-flow.base44.app/",
    filters: ["Python", "AI", "Base44"],
    platform: "base44",
  },
  {
    slug: "cognos",
    name: "COGNOS",
    category: "Cognitive / AI",
    description:
      "An AI cognitive operating system designed to capture raw thoughts, classify them, and map connections between ideas.",
    built: ["Thought capture", "AI classification", "Idea graph mapping"],
    tech: ["AI APIs", "NLP", "Graph Architecture"],
    status: "Live",
    live: "https://cognos-app.base44.app/",
    filters: ["AI", "Base44"],
    platform: "base44",
  },
  {
    slug: "tabzen",
    name: "TabZen",
    category: "Productivity / Browser",
    description:
      "Intelligent tab management that groups tabs by context, summarizes them, and archives them without losing information.",
    built: ["Context grouping", "AI summarization", "Lossless archiving"],
    tech: ["Browser Extension", "AI Summarization"],
    status: "Live",
    live: "https://tabzen.base44.app/",
    filters: ["AI", "Base44"],
    platform: "base44",
  },
  {
    slug: "ai-for-students",
    name: "AI for Students",
    category: "Education / AI",
    description:
      "A gamified AI learning platform built around making AI easier for students to understand and use.",
    built: ["Guided AI lessons", "Gamification", "API-driven tutoring"],
    tech: ["AI Tutoring", "APIs", "Gamification"],
    status: "Live",
    live: "https://ai-for-students.base44.app/",
    filters: ["AI", "Base44"],
    platform: "base44",
  },
  {
    slug: "home-serveai",
    name: "Home ServeAI",
    category: "Marketplace / AI",
    description:
      "AI-powered home services marketplace concept featuring smart matching, real-time tracking, and recurring service management.",
    built: ["Smart matching", "Real-time tracking", "Recurring services"],
    tech: ["Marketplace Architecture", "AI Matching", "Real-Time Tracking"],
    status: "Concept",
    filters: ["AI", "Lovable"],
    platform: "lovable",
  },
  {
    slug: "jarvis",
    name: "JARVIS",
    category: "AI Voice Assistant",
    description:
      "Voice-powered AI assistant designed to understand spoken commands, maintain context, and execute actions.",
    built: ["Voice command handling", "Context memory", "Action execution"],
    tech: ["Flutter", "Python", "Gemini API", "Android Studio"],
    status: "Experiment",
    filters: ["Flutter", "Python", "AI"],
  },
  {
    slug: "gemlab",
    name: "GemLab",
    category: "AI / Tooling",
    description:
      "Multi-persona AI chatbot environment with Friendly, Professional, and Creative conversation modes.",
    built: ["Persona switching", "Threaded responses", "Desktop interface"],
    tech: ["Python", "Tkinter", "Google Gemini API", "Threading"],
    status: "Built",
    filters: ["Python", "Tkinter", "AI"],
  },
  {
    slug: "security-camera-system",
    name: "Security Camera System",
    category: "Computer Vision",
    description:
      "An intelligent motion-activated recording system that detects movement through a webcam and automatically manages recordings.",
    built: ["Motion detection", "Automatic recording", "Recording management"],
    tech: ["Python", "OpenCV", "Haar Cascade Classifiers"],
    status: "Built",
    filters: ["Python", "OpenCV"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    category: "Finance / Utility",
    description:
      "Desktop currency converter supporting 170+ currencies with live exchange rates and offline fallback.",
    built: ["Live rates", "Offline caching", "Desktop UI"],
    tech: ["Python", "Tkinter", "Open Exchange Rate API", "Offline Caching"],
    status: "Built",
    filters: ["Python", "Tkinter"],
  },
  {
    slug: "gestureplay",
    name: "GesturePlay",
    category: "Computer Vision / Interactive",
    description:
      "Rock, Paper, Scissors, Pencil played entirely through webcam hand gestures.",
    built: ["Hand tracking", "Gesture recognition", "Game loop"],
    tech: ["Python", "OpenCV", "MediaPipe", "Tkinter", "Pillow"],
    status: "Built",
    filters: ["Python", "OpenCV", "Tkinter"],
  },
  {
    slug: "watch-walkie-talkie",
    name: "Watch Walkie Talkie",
    category: "Real-Time Communication",
    description:
      "Push-to-talk voice communication concept connecting smartwatches and phones for instant communication.",
    built: ["Push-to-talk", "Real-time audio streaming", "Cross-device pairing"],
    tech: ["Flutter", "Python", "Real-Time Audio Streaming", "Cross-Device Communication"],
    status: "Concept",
    filters: ["Flutter", "Python"],
  },
  {
    slug: "conversacore-ai",
    name: "ConversaCore AI",
    category: "AI / Conversational",
    description:
      "Multi-model conversational platform with dynamic model selection, persona-driven responses, and fallback systems.",
    built: ["Dynamic model selection", "Persona responses", "Fallback systems"],
    tech: ["Python", "Multi-Model AI", "Tkinter"],
    status: "Built",
    github: "https://github.com/andrewmkbuilds/ConversaCore-AI",
    filters: ["Python", "AI", "Tkinter"],
  },
  {
    slug: "arabica-ai-chat",
    name: "Arabica AI Chat",
    category: "AI / Multilingual",
    description:
      "Bilingual AI chat focused on English-Arabic conversation, translation, and context-aware responses.",
    built: ["Bilingual chat", "Translation", "Context-aware replies"],
    tech: ["Python", "Tkinter", "Translation API", "AI"],
    status: "Built",
    github: "https://github.com/andrewmkbuilds/Arabica-AI-Chat",
    filters: ["Python", "AI", "Tkinter"],
  },
  {
    slug: "neurotac-ai",
    name: "NeuroTac AI",
    category: "AI / Game",
    description:
      "An intelligent Tic Tac Toe engine that evaluates board states and selects optimal moves.",
    built: ["Board evaluation", "Optimal move search", "Game logic"],
    tech: ["Python", "AI Decision Logic", "Game Theory"],
    status: "Built",
    github: "https://github.com/andrewmkbuilds/NeuroTac-AI",
    filters: ["Python", "AI"],
  },
];

export const allProjects: Project[] = [...featuredProjects, ...ecosystemProjects];

export const projectFilters = [
  "All",
  "Python",
  "Flutter",
  "React",
  "AI",
  "Base44",
  "Lovable",
  "OpenCV",
  "Tkinter",
];

export const quickStats = [
  { value: "15+", label: "Projects & Systems" },
  { value: "Age 9", label: "Started Building" },
  { value: "3", label: "Flagship Products" },
  { value: "Multiple", label: "STEM & Engineering Competitions" },
];

export const buildingCategories = [
  {
    title: "AI",
    items: ["Generative AI", "AI APIs", "AI applications", "AI assistants", "AI integrations"],
  },
  {
    title: "Software",
    items: ["Python", "TypeScript", "JavaScript", "React", "Flutter", "Tkinter"],
  },
  {
    title: "Computer Vision",
    items: ["OpenCV", "MediaPipe", "Motion detection", "Gesture recognition"],
  },
  {
    title: "Robotics",
    items: ["Robotics", "Sensors", "Hardware integration", "Engineering competitions"],
  },
  {
    title: "Product",
    items: ["Product design", "Systems thinking", "Rapid prototyping", "Problem solving"],
  },
  {
    title: "Competition",
    items: ["Techfest", "FLL", "F1 in Schools / STEM Racing", "MUN", "Exhibitions"],
  },
];

export const principles = [
  {
    title: "Systems Over Features",
    body: "I like building connected systems that solve a complete problem instead of isolated features.",
  },
  {
    title: "Ship First, Improve Always",
    body: "A working product gives me something real to learn from. I build, test, iterate, and improve.",
  },
  {
    title: "Real Problems First",
    body: "The best projects start with a problem worth solving.",
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  meta?: string;
  body: string[];
  points?: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "2022",
    title: "First Robotics Certification",
    meta: "Age 9 · Grade 4",
    body: [
      "Completed the Mbot@IHS robotics after-school programme and built and presented an original model at a school exhibition.",
      "This was the beginning of the building journey.",
    ],
  },
  {
    year: "2023",
    title: "Exploring Beyond Hardware",
    meta: "Age 10 · Grade 4-5",
    body: [
      "After robotics, the focus expanded toward software and discovering what could be built beyond physical hardware.",
    ],
  },
  {
    year: "2024",
    title: "Techfest Breakout",
    meta: "Age 11 · Grade 5-6",
    body: ["Participated across Coding, Data Science, and Space Tech pathways."],
    points: [
      "2nd Place Space Tech at Group Techfest",
      "Certificate of Merit",
      "Certificate of Appreciation",
      '2nd Place at Math Expo "Math & Me"',
      "Recognition through school exhibitions and events",
    ],
  },
  {
    year: "2025",
    title: "Stack Up Ships",
    meta: "Age 12-13 · Grade 6-7",
    body: ["Stack Up became the first live application shipped."],
    points: [
      "1st Place Data Science at Techfest",
      "2nd Place IoT at Techfest",
      "FLL UAE Dubai Regional Innovation Award",
      "IHSMUN",
      "3rd Place Shot Put at Annual Athletic Meet",
      "Additional robotics certification",
    ],
  },
  {
    year: "2025-2026",
    title: "From Projects to an Ecosystem",
    meta: "Age 13-14 · Grade 7",
    body: [
      "Started building a broader ecosystem of products and experiments.",
      "Also founded Horizon Motorsports and participated in STEM Racing / F1 in Schools.",
    ],
    points: [
      "Gradr",
      "ClientFlow OS",
      "DevOS",
      "COGNOS",
      "TabZen",
      "TerraCart",
      "Home ServeAI",
      "AI for Students",
      "JARVIS",
      "GemLab",
      "GesturePlay",
      "Watch Walkie Talkie",
      "Computer vision systems",
      "Multiple AI experiments",
    ],
  },
  {
    year: "NOW",
    title: "Building What's Next",
    body: ["More ambitious products. More competitions. More experiments. More systems."],
  },
];

export const achievementGroups = [
  {
    title: "STEM & Technology",
    kind: "tags" as const,
    items: [
      "Techfest",
      "Data Science",
      "IoT",
      "Space Tech",
      "Coding",
      "Robotics",
      "FLL",
      "STEM Racing / F1 in Schools",
    ],
  },
];

/** `certKey` links a result to a real certificate in src/data/certificates.ts. */
export interface CompetitionResult {
  place: string;
  detail?: string;
  event?: string;
  certKey?: string;
}

export interface MunResult {
  title: string;
  detail?: string;
  certKey?: string;
}

export const competitionResults: CompetitionResult[] = [
  { place: "1st Place", detail: "Data Science", event: "Techfest", certKey: "techfest-data-science-1st" },
  { place: "2nd Place", detail: "IoT", event: "Techfest", certKey: "techfest-iot-2nd" },
  { place: "2nd Place", detail: "Space Tech", event: "Group Techfest", certKey: "techfest-space-tech-2nd" },
  { place: "Innovation Award", detail: "FLL UAE", event: "Dubai Regional", certKey: "fll-innovation" },
  { place: "2nd Place", detail: "Math Expo", event: '"Math & Me"', certKey: "math-expo" },
  { place: "3rd Place", detail: "Shot Put", event: "Annual Athletic Meet", certKey: "shot-put" },
];

export const munResults: MunResult[] = [
  { title: "IHSMUN 2025", detail: "FIA · Verbal Commendation", certKey: "mun-ihsmun-2025" },
  { title: "Novara MUN 2026", detail: "UNSC · Verbal Commendation" },
  { title: "IHS UNSummit 2026", detail: "FIA · Verbal Commendation + Best Resolution" },
];

export const exhibitions = [
  "Robotics exhibitions",
  "School exhibitions",
  "TechFest",
  "STEM / engineering demonstrations",
  "Other project showcases",
];

/** Official project intake form. Do not change without Andrew's confirmation. */
export const WEBSITE_INTAKE_FORM_URL = "https://forms.gle/1ZSLJwTv6EUeXaQY8";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: { label: string; value: string }[];
  /** Lead-generation services get a primary action on the card. */
  cta?: { label: string; href: string; external?: boolean };
  secondary?: { label: string; href: string };
  /** Small reassurance line under the CTA. */
  microcopy?: string;
  /** Ordered process step labels (no turnaround times). */
  steps?: string[];
}

export const services: Service[] = [
  {
    id: "websites",
    title: "Business Websites",
    description:
      "Modern, responsive websites built around your goals. Clean UI, fast performance, mobile-first design, and a structure that makes it easy for visitors to understand what you offer.",
    icon: "Globe",
    details: [
      { label: "Pricing", value: "Custom quote" },
      { label: "Turnaround", value: "Discuss your project" },
    ],
    cta: {
      label: "Start a Website Project",
      href: WEBSITE_INTAKE_FORM_URL,
      external: true,
    },
    secondary: { label: "See Websites I've Built", href: "/websites" },
    microcopy: "Tell me what you need and I'll take it from there.",
    steps: [
      "Discovery",
      "Structure & content plan",
      "Design",
      "Build",
      "Review & revisions",
      "Launch & handover",
    ],
  },

  {
    id: "web-apps",
    title: "Web Applications",
    description:
      "Full-scale web applications built around real functionality, not just pretty screens. I can take an idea from concept and interface design through development and deployment.",
    icon: "AppWindow",
    details: [
      { label: "Pricing", value: "Custom quote" },
      { label: "Turnaround", value: "Discuss your project" },
    ],
  },
  {
    id: "ai-products",
    title: "AI-Powered Products",
    description:
      "I can integrate AI into an existing product or help build an AI-first application from scratch using modern AI models, APIs, and custom logic.",
    icon: "BrainCircuit",
    details: [
      { label: "Technologies", value: "Gemini · Claude · AI APIs · Custom AI Logic" },
      { label: "Pricing", value: "Custom quote" },
    ],
  },
  {
    id: "automation",
    title: "Automation & Systems",
    description:
      "I build connected systems that reduce repetitive work and bring scattered processes into one place, including dashboards, workflows, data systems, and AI-powered automation.",
    icon: "Workflow",
    details: [
      { label: "Pricing", value: "Custom quote" },
      { label: "Turnaround", value: "Discuss your project" },
    ],
  },
  {
    id: "consultation",
    title: "Product & Technical Consultation",
    description:
      "Have an idea but don't know how to build it? We can talk through the concept, technology, architecture, features, and development approach and turn the idea into a practical plan.",
    icon: "Lightbulb",
    details: [
      { label: "First session", value: "Free" },
      { label: "Format", value: "Online" },
    ],
  },
];

export const currentlyBuilding = [
  { name: "Gradr", status: "Building", note: "AI career accelerator." },
  { name: "TerraCart", status: "Developing", note: "Sustainable shopping assistant." },
  { name: "ClientFlow OS", status: "In Active Development", note: "Business operating system." },
  { name: "Horizon Motorsports", status: "Active", note: "UAE racing team." },
];

export const GITHUB_URL = "https://github.com/andrewmkbuilds";
export const LINKTREE_URL = "https://linktr.ee/andrewmkbuilds";

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
  /** Short line describing what someone finds there. */
  description: string;
  /** Label for the visit button. */
  cta: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "@andrewmkbuilds",
    url: "https://github.com/andrewmkbuilds",
    description: "Projects, experiments, and code.",
    cta: "View GitHub",
  },
  {
    id: "base44",
    label: "Base44",
    handle: "@andrewmkbuilds",
    url: "https://app.base44.com/@andrewmkbuilds",
    description: "Apps and products I've built with Base44.",
    cta: "View Base44",
  },
  {
    id: "lovable",
    label: "Lovable",
    handle: "@andrewbuilds",
    url: "https://lovable.dev/@andrewbuilds",
    description: "Web products and experiments built with Lovable.",
    cta: "View Lovable",
  },
  {
    id: "x",
    label: "X",
    handle: "@Andrew444884",
    url: "https://x.com/Andrew444884",
    description: "Thoughts, updates, and what I'm building.",
    cta: "View X",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@andrewmkbuilds",
    url: "https://www.instagram.com/andrewmkbuilds/",
    description: "Personal updates and things I'm working on.",
    cta: "View Instagram",
  },
  {
    id: "linktree",
    label: "All My Links",
    handle: "linktr.ee/andrewmkbuilds",
    url: "https://linktr.ee/andrewmkbuilds",
    description: "The central hub for every profile, project, and link of mine.",
    cta: "View All My Links",
  },
];

