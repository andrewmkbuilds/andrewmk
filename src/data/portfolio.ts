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
  /** Grouped technology stack, shown on the full project page. */
  stack?: { group: string; items: string[] }[];
  /** Engineering challenges and how they were solved. */
  challenges?: { title: string; detail: string }[];
  /** Outcomes so far — kept honest for in-progress work. */
  results?: { label: string; value: string; note?: string }[];
  /** Structured project walkthrough panels. */
  gallery?: { title: string; caption: string; lines?: string[] }[];
  /** Verified, measured figures. Only real reported numbers belong here. */
  metrics?: {
    title: string;
    intro?: string;
    source?: string;
    items: { value: string; label: string; note?: string }[];
    breakdown?: { label: string; value: string }[];
  };
  /* ---- Fields supplied by the content dashboard (optional everywhere) ---- */
  /** Long-form description shown under the intro on the project page. */
  fullDescription?: string;
  solution?: string;
  features?: string[];
  process?: string;
  learned?: string;
  /**
   * The project's own screenshot — a capture of that project's live site or,
   * for a project with no public surface, its bespoke illustration — vendored
   * in `public/projects/`. Every record publishes one: it is the single visual
   * asset for the project, and cards, the showcase preview, case studies, the
   * modal, the curtain slider and the project page all read this field through
   * `ui/ProjectShot.tsx`.
   */
  screenshot: string;
  /** Describes what the screenshot shows, for assistive tech. */
  imageAlt?: string;
  images?: { url: string; alt?: string; caption?: string }[];
  startDate?: string;
  endDate?: string;
  /** Per-project SEO overrides; blanks fall back to generated defaults. */
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
  };
}

export const featuredProjects: Project[] = [
  {
    slug: "gradr",
    screenshot: "/projects/gradr.webp",
    imageAlt:
      "Gradr homepage — the “Your AI career command center” hero beside a Career Command Center panel showing an ATS score, keyword coverage and live job matches.",
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
    live: "https://gradr.me",
    startDate: "2025-09-01",
    filters: ["AI", "React", "Lovable"],
    featured: true,
    platform: "lovable",
    problem:
      "Early-career candidates get almost no useful feedback. Resumes disappear into applicant tracking systems without explanation, interview practice is either expensive or unstructured, and applications end up scattered across spreadsheets, inboxes and browser tabs. The missing piece is not more advice — it is a system that reviews your material, tells you exactly what is weak, and keeps the whole search in one place.",
    stack: [
      {
        group: "Interface",
        items: ["React", "TypeScript", "Tailwind CSS", "Component library"],
      },
      {
        group: "AI layer",
        items: [
          "LLM APIs",
          "Structured prompting",
          "Scoring rubrics",
          "Streaming responses",
        ],
      },
      {
        group: "Backend",
        items: [
          "Postgres",
          "Row-level security",
          "Auth",
          "File storage",
          "Server functions",
        ],
      },
      {
        group: "Platform",
        items: ["Lovable", "MCP integration", "Credit-based usage metering"],
      },
    ],
    gallery: [
      {
        title: "Resume analysis",
        caption:
          "Upload a resume and get a structured breakdown: ATS score, keyword coverage, weak bullet points and concrete rewrite suggestions instead of vague feedback.",
        lines: [
          "ATS score",
          "Keyword gaps",
          "Bullet rewrites",
          "Section checks",
        ],
      },
      {
        title: "AI mock interviews",
        caption:
          "Role-specific interview sessions that ask follow-up questions, then score answers on structure, specificity and relevance so practice actually compounds.",
        lines: [
          "Role selection",
          "Live Q&A",
          "Answer scoring",
          "Session replay",
        ],
      },
      {
        title: "Job tracker",
        caption:
          "Every application in one board with stage, source and reminders, so nothing is lost between applying and following up.",
        lines: ["Saved jobs", "Stages", "Reminders", "Match signals"],
      },
      {
        title: "Career plan & analytics",
        caption:
          "A progress view that turns sessions and applications into trends — where scores improve, where they stall, and what to work on next.",
        lines: ["Score trend", "Skill gaps", "Next actions", "Weekly summary"],
      },
    ],
    challenges: [
      {
        title: "Making AI feedback specific, not generic",
        detail:
          "The first versions returned polite but useless advice. I moved from open-ended prompts to fixed scoring rubrics with structured output, so every response has to point at a real line in the resume or answer and explain what to change.",
      },
      {
        title: "Approximating ATS behaviour honestly",
        detail:
          "Real applicant tracking systems are closed. Instead of pretending to replicate one, the score is built from things that are actually checkable — parseability, section structure, keyword coverage against the job description and formatting risks — and the app explains each component.",
      },
      {
        title: "Keeping AI cost predictable",
        detail:
          "Long resumes and interview transcripts get expensive fast. Requests are trimmed and cached, heavy analysis runs on demand rather than on every keystroke, and usage is metered with a credit balance so cost stays bounded per user.",
      },
      {
        title: "Data privacy on personal documents",
        detail:
          "Resumes are sensitive. Everything is scoped per user with row-level security, files live in access-controlled storage, and no document is readable across accounts.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "In active development",
        note: "Core flows working end to end.",
      },
      {
        label: "Core modules",
        value: "6",
        note: "Resume, ATS, interviews, tracker, analytics, plan.",
      },
      {
        label: "Feedback loop",
        value: "Analyse → practise → apply",
        note: "One connected system.",
      },
      {
        label: "Integrations",
        value: "MCP tools",
        note: "Resumes, jobs and reminders exposed to assistants.",
      },
    ],
    metrics: {
      title: "Early traction",
      intro:
        "Gradr attracted 300+ visitors within its first three days after launch, demonstrating strong early interest in the platform.",
      source:
        "Figure measures website visitors, not registered or active users.",
      items: [
        {
          value: "300+",
          label: "Website visitors",
          note: "First three days after launch.",
        },
      ],
    },
  },
  {
    slug: "stack-up",
    screenshot: "/projects/previews/stack-up.svg",
    imageAlt:
      "Stack Up preview artwork — a streak calendar of gold bars, an XP coin and a savings goal ring.",
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
    startDate: "2024-09-01",
    endDate: "2025-03-01",
    live: "https://stackup-app.base44.app/",
    filters: ["Base44", "React"],
    featured: true,
    platform: "base44",
    problem:
      "Most budgeting apps assume you already have the discipline they are supposed to build. They show you a pie chart after the money is gone. Stack Up started from the opposite question: what would make a student actually open a finance app on a normal Tuesday? The answer was progress — visible streaks, goals that move, and numbers small enough to act on.",
    stack: [
      {
        group: "Interface",
        items: [
          "React",
          "Component-driven UI",
          "Responsive layouts",
          "Charting",
        ],
      },
      {
        group: "Logic",
        items: [
          "Budget engine",
          "Streak & XP rules",
          "Goal projection",
          "Category rollups",
        ],
      },
      {
        group: "Data",
        items: [
          "Per-user records",
          "Transaction history",
          "Recurring entries",
          "Auth",
        ],
      },
      { group: "Platform", items: ["Base44", "Hosted deployment"] },
    ],
    gallery: [
      {
        title: "Dashboard",
        caption:
          "One screen answers the only question that matters day to day: how much is left, and is this month on track compared to the last one.",
        lines: [
          "Safe-to-spend",
          "Month trend",
          "Top categories",
          "Streak status",
        ],
      },
      {
        title: "Expense capture",
        caption:
          "Logging a spend takes a few seconds — amount, category, optional note — because anything slower gets abandoned within a week.",
        lines: [
          "Quick add",
          "Smart categories",
          "Recurring entries",
          "Edit history",
        ],
      },
      {
        title: "Budgets & goals",
        caption:
          "Budgets are per category with live burn-down, and savings goals project a realistic finish date from actual deposit behaviour.",
        lines: [
          "Category caps",
          "Burn-down bars",
          "Goal projection",
          "Overspend alerts",
        ],
      },
      {
        title: "Streaks & analytics",
        caption:
          "Gamification is tied to behaviour that actually helps — logging consistently and staying under budget — not to spending more.",
        lines: [
          "Daily streak",
          "XP levels",
          "Category breakdown",
          "Month-over-month",
        ],
      },
    ],
    challenges: [
      {
        title: "Gamifying finance without encouraging bad habits",
        detail:
          "Early reward rules accidentally rewarded activity, which meant more transactions scored higher. I rewrote the scoring so streaks come from consistent logging and staying inside budget, and goal progress is the only thing that drives levels.",
      },
      {
        title: "Making budgets survive real life",
        detail:
          "A rigid monthly cap breaks the first time an unexpected bill lands. Budgets became rolling, with carry-over and a separate 'irregular' bucket, so one bad week does not invalidate the whole month.",
      },
      {
        title: "Keeping data entry under ten seconds",
        detail:
          "Retention died on friction. I cut the add-expense flow to a single sheet with remembered categories and recurring entries, which removed most repeat typing.",
      },
      {
        title: "Shipping a first product end to end",
        detail:
          "This was the first thing I took from idea to live URL — auth, data modelling, state, deployment. The lesson that carried into every project after it was to ship a narrow version and let real usage decide the next feature.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "Live",
        note: "Publicly usable at stackup-app.base44.app.",
      },
      {
        label: "First shipped product",
        value: "2024",
        note: "Idea to deployed app end to end.",
      },
      {
        label: "Core modules",
        value: "5",
        note: "Expenses, budgets, goals, streaks, analytics.",
      },
      {
        label: "Entry time",
        value: "< 10s",
        note: "Design target for logging a spend.",
      },
    ],
    metrics: {
      title: "Early traction",
      intro:
        "Stack Up attracted 600+ visitors within its first week after launch, demonstrating strong early interest following launch.",
      source:
        "Figure measures website visitors, not registered or active users.",
      items: [
        {
          value: "600+",
          label: "Website visitors",
          note: "First week after launch.",
        },
      ],
    },
  },

  {
    slug: "terracart",
    screenshot: "/projects/previews/terracart.svg",
    imageAlt:
      "TerraCart preview artwork — a product page with an inline sustainability read, claim checks and a lower-impact alternative.",
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
    startDate: "2025-11-01",
    filters: ["AI"],
    featured: true,
    problem:
      "Shopping sustainably online is mostly guesswork. Product pages optimise for conversion, claims are unverifiable, and comparing a greener alternative means opening five tabs mid-checkout. TerraCart puts the analysis where the decision happens — on the product page — and offers a concrete alternative instead of a lecture.",
    stack: [
      {
        group: "Extension",
        items: ["Browser extension", "Product page parsing", "Content scripts"],
      },
      {
        group: "AI layer",
        items: [
          "Product understanding",
          "Claim research",
          "Alternative matching",
        ],
      },
      {
        group: "Interface",
        items: ["Inline panel", "Comparison view", "Shopping checklist"],
      },
      {
        group: "Data",
        items: ["Product cache", "Category heuristics", "Saved items"],
      },
    ],
    gallery: [
      {
        title: "Product analysis",
        caption:
          "The extension reads the product being viewed and breaks down what is actually known about materials, packaging and origin versus what is only marketing language.",
        lines: ["Material read", "Packaging", "Origin signals", "Claim check"],
      },
      {
        title: "Better alternatives",
        caption:
          "Instead of a score with no action attached, it surfaces comparable products that are genuinely more sustainable and similar in price and function.",
        lines: [
          "Similar items",
          "Why it's better",
          "Price delta",
          "Availability",
        ],
      },
      {
        title: "Shopping checklist",
        caption:
          "A running list keeps intended purchases together so decisions can be reviewed before checkout rather than one impulse at a time.",
        lines: ["Saved items", "Compare view", "Notes", "Decision log"],
      },
    ],
    challenges: [
      {
        title: "Reading messy product pages",
        detail:
          "Every retailer structures pages differently. Parsing combines structured data where it exists with content-based extraction as fallback, so the panel still works on pages without clean markup.",
      },
      {
        title: "Not inventing sustainability claims",
        detail:
          "The easy failure mode is a confident number with nothing behind it. Analysis separates verifiable attributes from unverified marketing claims and says so explicitly when evidence is thin.",
      },
      {
        title: "Alternatives that are actually comparable",
        detail:
          "A greener product at four times the price is not a real option. Matching filters on function and price band first, then ranks on sustainability signals.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "In development",
        note: "Analysis and alternatives in progress.",
      },
      {
        label: "Surface",
        value: "Browser extension",
        note: "Works inline on product pages.",
      },
      {
        label: "Principle",
        value: "Evidence over scores",
        note: "Unverified claims labelled as such.",
      },
    ],
  },

  {
    slug: "clientflow-os",
    screenshot: "/projects/previews/clientflow-os.svg",
    imageAlt:
      "ClientFlow OS preview artwork — a client pipeline board running from enquiry to paid, with an invoice strip beneath.",
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
    live: "https://clientflowos.base44.app",
    startDate: "2025-10-01",
    github: "https://github.com/andrewmkbuilds/ClientFlow-OS",
    filters: ["AI", "React"],
    featured: true,
    problem:
      "Small studios and freelancers run their business across six tools that do not talk: a CRM, a chat app, a spreadsheet of projects, an invoicing tool, a drive folder and a notes app. Every handoff between them is manual and every status question costs a search. ClientFlow OS collapses the client lifecycle — enquiry to delivery to payment — into one connected system.",
    stack: [
      {
        group: "Interface",
        items: ["React", "TypeScript", "Dashboard layouts", "Approval flows"],
      },
      {
        group: "Backend",
        items: [
          "Postgres",
          "Row-level security",
          "Auth",
          "File storage",
          "Server functions",
        ],
      },
      {
        group: "Payments",
        items: ["Stripe", "Invoicing", "Payment status sync"],
      },
      {
        group: "AI layer",
        items: [
          "Automations",
          "Conversation summarisation",
          "Draft generation",
        ],
      },
    ],
    gallery: [
      {
        title: "Client lifecycle",
        caption:
          "Every client has one record carrying stage, projects, conversations, documents and payment history, so status never has to be reconstructed.",
        lines: ["Stages", "Contacts", "Linked projects", "Activity feed"],
      },
      {
        title: "Projects & approvals",
        caption:
          "Deliverables move through explicit approval states with a client-facing view, which removes the endless 'did you see this?' thread.",
        lines: ["Milestones", "Approval states", "Client view", "Change log"],
      },
      {
        title: "Payments & invoicing",
        caption:
          "Invoices are generated from project milestones and reconciled through Stripe, so paid work and unpaid work are never ambiguous.",
        lines: [
          "Invoice builder",
          "Stripe checkout",
          "Status sync",
          "Reminders",
        ],
      },
      {
        title: "AI automation",
        caption:
          "Routine work — summarising a thread, drafting an update, flagging a stalled project — is automated so the system reduces admin rather than adding it.",
        lines: [
          "Thread summaries",
          "Draft updates",
          "Stall detection",
          "Suggested next steps",
        ],
      },
    ],
    challenges: [
      {
        title: "Modelling one lifecycle across many objects",
        detail:
          "Clients, projects, invoices and messages each want to be the centre. Making the client the root and treating everything else as a scoped child removed most cross-entity edge cases.",
      },
      {
        title: "Payment state is the hard part",
        detail:
          "Invoices can be partially paid, refunded or fail after the fact. Stripe webhooks are the single source of truth and local state is derived from them, never written optimistically.",
      },
      {
        title: "Sharing with clients without leaking data",
        detail:
          "Client-facing views needed to expose exactly one project and nothing else. Row-level security policies are written per relationship instead of per role, which keeps access provable.",
      },
      {
        title: "Automation that stays trustworthy",
        detail:
          "Anything AI-generated that touches a client goes into a draft state with an approval step, so automation speeds up the operator instead of speaking for them.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "In active development",
        note: "Core lifecycle working.",
      },
      {
        label: "Modules",
        value: "8",
        note: "Clients, projects, comms, payments, docs, automation.",
      },
      { label: "Payments", value: "Stripe", note: "Webhook-driven state." },
      {
        label: "Code",
        value: "Public repo",
        note: "github.com/andrewmkbuilds/ClientFlow-OS",
      },
    ],
  },
];

export const ecosystemProjects: Project[] = [
  {
    slug: "sitescout-ai",
    screenshot: "/projects/sitescout-ai.webp",
    imageAlt:
      "SiteScout AI homepage — the “Find Your Next Client Before Your Competitors Do” hero above a preview dashboard of discovered businesses, website audits and an opportunity funnel.",
    name: "SiteScout AI",
    category: "Agency Technology · AI",
    description:
      "AI-powered client acquisition for web agencies — discover local businesses, audit their websites, score the real opportunities, and carry every lead through to a signed client.",
    built: [
      "Business discovery",
      "Website audits",
      "Opportunity scoring",
      "AI outreach",
      "Lead pipeline",
      "Team roles and audit logs",
    ],
    tech: ["AI", "React"],
    status: "Live",
    live: "https://sitescout-ai.base44.app",
    filters: ["AI", "Base44"],
    platform: "base44",
    problem:
      "An agency's next client is usually a local business with a weak website, but finding those businesses means scrolling maps, opening sites one at a time and keeping notes in a spreadsheet. SiteScout AI turns that manual sweep into one pipeline: it discovers businesses by industry and location, checks what their sites actually do, separates real opportunities from noise, and keeps the outreach that follows in the same place.",
    stack: [
      {
        group: "Interface",
        items: ["React", "TypeScript", "Tailwind CSS", "Dashboard layouts"],
      },
      {
        group: "Discovery",
        items: [
          "Location and industry search",
          "Multi-source verification",
          "CSV import",
        ],
      },
      {
        group: "Intelligence",
        items: [
          "Website audits",
          "Performance and SEO checks",
          "Mobile and conversion signals",
          "Opportunity scoring",
        ],
      },
      {
        group: "Workspace",
        items: [
          "Lead pipeline",
          "AI outreach drafting",
          "Organization roles",
          "Audit logs",
        ],
      },
      {
        group: "Platform",
        items: ["Base44", "Postgres", "Row-level security"],
      },
    ],
  },
  {
    slug: "scholara",
    name: "Scholara",
    category: "Education · School OS · AI",
    description:
      "An AI-powered school operating system that unites academics, operations, communication and analytics for students, teachers, parents and school leaders.",
    built: [
      "Role-based dashboards",
      "Assignments & exams",
      "Academic analytics",
      "Finance & fees",
      "Library system",
      "Transport management",
      "Incident management",
      "Student wellbeing",
      "AI Tutor & Teacher Copilot",
    ],
    tech: ["AI", "Base44"],
    status: "Live",
    live: "https://get-scholara.base44.app/",
    screenshot: "/projects/scholara.webp",
    imageAlt:
      "Scholara landing page — “The intelligent OS for modern schools” above its platform metrics.",
    filters: ["AI", "Base44"],
    platform: "base44",
    problem:
      "A school runs academics, finance, transport, wellbeing and parent communication across spreadsheets, disconnected apps and paper forms. Scholara replaces that patchwork with one system where every role — student, teacher, parent, administrator, principal, counselor, finance staff, librarian and transport manager — works over the same data with its own dashboard, navigation and permissions.",
    solution:
      "One platform with nine role-specific surfaces over a shared dataset. The AI layer is grounded in the school's own records: the student tutor sees grades and upcoming exams, the teacher copilot drafts lessons, rubrics and feedback, and the principal view summarises the week from real numbers rather than a prompt.",
    stack: [
      {
        group: "Roles",
        items: [
          "Student",
          "Teacher",
          "Parent",
          "Administrator",
          "Principal",
          "Counselor",
          "Finance",
          "Librarian",
          "Transport",
        ],
      },
      {
        group: "Academics",
        items: ["Assignments", "Exams & grading", "Attendance", "Analytics"],
      },
      {
        group: "Operations",
        items: [
          "Finance & fees",
          "Library loans",
          "Transport routes",
          "Incident tracking",
          "Wellbeing check-ins",
        ],
      },
      {
        group: "AI layer",
        items: [
          "AI Tutor",
          "Teacher Copilot",
          "Principal summaries",
          "Command palette (⌘K)",
        ],
      },
      { group: "Platform", items: ["Base44", "Hosted demo"] },
    ],
    gallery: [
      {
        title: "Role-aware entry",
        caption:
          "Picking a role opens a different product: the student sees tonight's study plan, the admin sees attendance across the school, the finance office sees outstanding balances.",
        lines: ["9+ roles", "Own navigation", "Own permissions", "Shared data"],
      },
      {
        title: "Academics in one place",
        caption:
          "Assignments, exams, submissions, grading and attendance are one connected flow instead of four tools the staff reconcile by hand.",
        lines: ["Create", "Publish", "Submit", "Grade & track"],
      },
      {
        title: "School operations",
        caption:
          "Finance and fees, library loans, transport routes, incidents and wellbeing sit on the same data model as academics, so a student record means the same thing everywhere.",
        lines: ["Invoices", "Loans", "Routes", "Incidents"],
      },
      {
        title: "Scholara Brain",
        caption:
          "The AI tutor keeps conversation history and subject context, and the command palette lets any role navigate, search and act from the keyboard.",
        lines: [
          "AI Tutor",
          "Teacher Copilot",
          "Principal summaries",
          "⌘K palette",
        ],
      },
    ],
    results: [
      {
        label: "Roles",
        value: "9+",
        note: "Product scope as published on the site.",
      },
      {
        label: "Modules",
        value: "30+",
        note: "Product scope as published on the site.",
      },
      {
        label: "AI features",
        value: "15+",
        note: "Product scope as published on the site.",
      },
      {
        label: "Try it",
        value: "Open demo",
        note: "Pick any role and use the full platform.",
      },
    ],
  },
  {
    slug: "critiqueflow",
    name: "CritiqueFlow",
    category: "Design Tooling · Review",
    description:
      "A design review platform that turns visual feedback into structured discussion, tasks and a measurable design health score.",
    built: [
      "Design upload & canvas",
      "Deterministic design scan",
      "Pinned feedback threads",
      "Feedback-to-task tracking",
      "Design health scoring",
      "Before/after comparison",
    ],
    tech: ["React", "Base44"],
    status: "Live",
    live: "https://critiqueflow.base44.app/",
    screenshot: "/projects/critiqueflow.webp",
    imageAlt:
      "CritiqueFlow dashboard — design health trends, feedback volume chart and review counters.",
    filters: ["React", "Base44"],
    platform: "base44",
    problem:
      "Design feedback usually arrives as loose comments in chat, scattered screenshots and calls nobody writes down. It is hard to act on, impossible to measure, and the same comment comes back in the next round. CritiqueFlow puts the design on a canvas and turns every note into something with an owner, a state and a score attached to it.",
    solution:
      "A comment is pinned to the design, discussed in a thread, promoted to a task and closed when the fix lands. A design health score is calculated from the actual feedback data — typography, colour, spacing, layout, accessibility and consistency — so improvement between two versions is verifiable instead of argued about.",
    stack: [
      {
        group: "Canvas",
        items: ["Image upload", "Pinned notes", "Version compare"],
      },
      {
        group: "Analysis",
        items: [
          "Deterministic scan",
          "Typography checks",
          "Colour & contrast",
          "Spacing & alignment",
        ],
      },
      {
        group: "Review flow",
        items: ["Threaded comments", "Task assignment", "Resolution states"],
      },
      { group: "Platform", items: ["Base44", "Hosted demo"] },
    ],
    gallery: [
      {
        title: "Upload and pin",
        caption:
          "Any design image goes onto the canvas, and feedback is pinned to the exact element it is about rather than described from memory.",
        lines: ["PNG · JPG · SVG", "Canvas pinning", "No plugins", "No setup"],
      },
      {
        title: "Smart design scan",
        caption:
          "A deterministic pass checks spacing, contrast, hierarchy and alignment, then ranks what to fix first.",
        lines: ["Spacing", "Contrast", "Hierarchy", "Alignment"],
      },
      {
        title: "Feedback → task → fix",
        caption:
          "Every comment can be promoted to a task with an owner and a state, so a review round ends in closed items instead of a longer thread.",
        lines: ["Open", "In progress", "Done", "Resolved by"],
      },
      {
        title: "Design health and before/after",
        caption:
          "The health score is computed from the feedback data per category, and two versions can be compared with a drag handle to see exactly what changed.",
        lines: ["Health score", "Per-category", "Version compare", "Slider"],
      },
    ],
    results: [
      {
        label: "Scan",
        value: "Deterministic",
        note: "Checks are computed from the feedback data.",
      },
      {
        label: "Core loop",
        value: "Feedback → task → fix",
        note: "Each note becomes a tracked item.",
      },
      {
        label: "Compare",
        value: "Two versions",
        note: "Before/after slider on the same canvas.",
      },
    ],
  },
  {
    slug: "the-neonrush",
    name: "The Neon Rush",
    category: "Game · Interactive",
    description:
      "A neon arcade game built around story chapters, daily missions, mini-games and a hangar of ships and skins.",
    built: [
      "Story mode",
      "Daily & weekly missions",
      "Side quests",
      "Arcade mini-games",
      "Ships & skins",
      "Leaderboards",
      "Daily challenge",
    ],
    tech: ["Game", "Base44"],
    status: "Live",
    live: "https://the-neonrush.base44.app/",
    screenshot: "/projects/the-neonrush.webp",
    imageAlt:
      "The Neon Rush command center — story, survival and the arcade mode grid.",
    filters: ["Base44"],
    platform: "base44",
    problem:
      "A game needs a reason to come back on a normal Tuesday, not just a good first level. The Neon Rush wraps its arcade play in a command center — chapters, objectives, records and unlocks — so a short session always has a next thing to chase.",
    solution:
      "Everything hangs off one command center: the story chapter, the daily and weekly missions, the side quests, the arcade cabinet and the hangar of ships and skins. A daily challenge puts every player on the same modifiers and the same leaderboard, so scores are comparable.",
    stack: [
      {
        group: "Play",
        items: [
          "Story chapters",
          "Arcade mini-games",
          "Skill challenges",
          "Daily challenge",
        ],
      },
      {
        group: "Progression",
        items: ["Ships & skins", "Database sectors", "Mission logs", "Stats"],
      },
      {
        group: "Social",
        items: ["Leaderboards", "Daily rankings", "Profile & progress"],
      },
      { group: "Platform", items: ["Base44", "Hosted game"] },
    ],
    gallery: [
      {
        title: "Command center",
        caption:
          "The hub every run starts from: start the story, open an arcade cabinet, check the mission terminal or the leaderboard.",
        lines: ["Story", "Survival", "Missions", "Leaderboard"],
      },
      {
        title: "Story and objectives",
        caption:
          "Chapter 1: First Contact runs alongside daily and weekly missions, side quests and optional lore, so progress continues between story beats.",
        lines: ["Chapters", "Daily missions", "Side quests", "Lore"],
      },
      {
        title: "Arcade and challenges",
        caption:
          "Mini-games and no-dash skill trials test specific mechanics, and the daily challenge fixes the modifiers so everyone plays the same run.",
        lines: ["Arcade", "Skill trials", "Daily challenge", "Same modifiers"],
      },
      {
        title: "Hangar, records and advisors",
        caption:
          "Ships and skins are unlocked from play, stats and mission logs track performance, and AI advisors give in-game support and tips.",
        lines: ["Hangar", "Stats", "Leaderboard", "AI advisors"],
      },
    ],
    results: [
      {
        label: "Modes",
        value: "Story · Arcade · Daily",
        note: "Three ways into the same game.",
      },
      {
        label: "Progression",
        value: "Ships & skins",
        note: "Unlocks earned through play.",
      },
      {
        label: "Status",
        value: "Live",
        note: "Playable in the browser.",
      },
    ],
  },
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
    screenshot: "/projects/horizon-motorsports.webp",
    imageAlt:
      "Horizon Motorsports home page — the team hero with its car metrics and call to action.",
    filters: ["React"],
    platform: "base44",
    problem:
      "Horizon Motorsports needed a presence that matched how the team actually operates: a Dubai-based racing and engineering team competing in FLL, Techfest and other UAE competitions, with a following that lives mostly on social. The site had to work as the anchor visitors land on from Instagram — fast, motion-driven, and clear about who the team is and what it competes in.",
    stack: [
      {
        group: "Interface",
        items: ["React", "Framer Motion", "Responsive layout"],
      },
      {
        group: "Content",
        items: ["Team profile", "Competition history", "Media sections"],
      },
      { group: "Platform", items: ["Base44", "Hosted deployment"] },
    ],
    challenges: [
      {
        title: "Motion that does not cost load time",
        detail:
          "The identity of the site is movement, but heavy animation on a phone over mobile data is a bounce. Transitions are kept to transform and opacity, staged on scroll, so the first screen paints before anything animates.",
      },
      {
        title: "Designed for social traffic",
        detail:
          "Most visitors arrive from a link in an Instagram profile, on a phone, mid-scroll. The layout leads with the team identity and current competitions rather than a long narrative, so the first screen answers who and what.",
      },
      {
        title: "Content that survives a competition season",
        detail:
          "Results and events change through the season. Sections are structured so competition entries can be added without reworking layout.",
      },
    ],
    results: [
      { label: "Status", value: "Active", note: "Live team site." },
      {
        label: "Competitions",
        value: "FLL · Techfest",
        note: "UAE engineering and robotics circuit.",
      },
      { label: "Base", value: "Dubai, UAE", note: "Team operates locally." },
      {
        label: "Primary channel",
        value: "Instagram",
        note: "Site is the landing point for social traffic.",
      },
    ],
    metrics: {
      title: "Digital reach",
      intro:
        "These figures come from recent Instagram analytics for the team account, which is the team's main audience channel.",
      source:
        "Source: Instagram account analytics for the reporting period shown in the app. Views, accounts reached, interactions and profile visits are distinct Instagram metrics and are not website visits.",
      items: [
        {
          value: "6,631",
          label: "Total views",
          note: "Instagram content views.",
        },
        {
          value: "486",
          label: "Accounts reached",
          note: "Unique Instagram accounts.",
        },
        {
          value: "857",
          label: "Interactions",
          note: "Instagram content interactions.",
        },
        {
          value: "494",
          label: "Profile visits",
          note: "Visits to the Instagram profile.",
        },
        {
          value: "14",
          label: "External link clicks",
          note: "Clicks on the profile link.",
        },
        {
          value: "149",
          label: "Followers",
          note: "Instagram account followers.",
        },
      ],
      breakdown: [
        { label: "Accounts reached — followers", value: "65.6%" },
        { label: "Accounts reached — non-followers", value: "34.4%" },
        { label: "Interactions — followers", value: "72.8%" },
        { label: "Interactions — non-followers", value: "27.2%" },
        { label: "Views — posts", value: "68.3%" },
        { label: "Views — stories", value: "25.4%" },
        { label: "Views — reels", value: "6.4%" },
        { label: "Interactions — posts", value: "94.3%" },
        { label: "Interactions — reels", value: "5%" },
        { label: "Interactions — stories", value: "0.7%" },
        { label: "Top content — Apr 14", value: "336 views" },
        { label: "Top content — Apr 13", value: "297 views" },
        { label: "Top content — Apr 13", value: "263 views" },
        { label: "Top content — Apr 3", value: "225 views" },
        { label: "Top content — Apr 5", value: "219 views" },
      ],
    },
  },
  {
    slug: "devos",
    name: "DevOS",
    category: "Productivity / AI",
    description:
      "AI-powered developer command center designed to bring tasks, focus sessions, and project threads into one place.",
    built: [
      "Task system",
      "Focus sessions",
      "Project threads",
      "AI integration",
    ],
    tech: ["Python", "AI Integration"],
    status: "Live",
    live: "https://dev-os-flow.base44.app",
    screenshot: "/projects/devos.webp",
    imageAlt:
      "DevOS workspace — task metrics, the focus timer, contribution activity and the AI assistant.",
    filters: ["Python", "AI", "Base44"],
    platform: "base44",
    problem:
      "Building alone means context lives in five places at once — a task list, a terminal, a notes file, a chat with an AI assistant, and whatever was open when you stopped. DevOS came out of my own workflow: one command center where the task, the focus session and the project thread are the same object, so picking work back up does not require reconstructing it.",
    stack: [
      {
        group: "Core",
        items: ["Python", "Task engine", "Session timer", "Thread store"],
      },
      {
        group: "AI layer",
        items: [
          "Assistant integration",
          "Context summarisation",
          "Task breakdown",
        ],
      },
      {
        group: "Interface",
        items: [
          "Command-driven UI",
          "Keyboard-first navigation",
          "Project boards",
        ],
      },
      { group: "Platform", items: ["Base44", "Hosted deployment"] },
    ],
    gallery: [
      {
        title: "Command center",
        caption:
          "Everything starts from one input: create a task, start a focus block, or open a project thread without leaving the keyboard.",
        lines: [
          "Command palette",
          "Today view",
          "Active session",
          "Quick capture",
        ],
      },
      {
        title: "Focus sessions",
        caption:
          "A session is bound to a task, so time tracked is attributable and the end of a block produces a note rather than just a stopped timer.",
        lines: ["Timed blocks", "Bound task", "Session notes", "History"],
      },
      {
        title: "Project threads",
        caption:
          "Each project keeps a running thread of decisions, blockers and AI exchanges, which is what makes returning after a week cheap.",
        lines: ["Decision log", "Blockers", "AI exchanges", "Linked tasks"],
      },
      {
        title: "AI assist",
        caption:
          "The assistant reads the thread, breaks a vague task into concrete steps, and summarises where a project stalled.",
        lines: [
          "Task breakdown",
          "Thread summary",
          "Next step",
          "Context recall",
        ],
      },
    ],
    challenges: [
      {
        title: "Context that survives a break",
        detail:
          "Tasks alone were not enough to resume work. Attaching session notes and decisions to a persistent project thread turned resumption from re-reading code into reading four lines.",
      },
      {
        title: "Keeping AI grounded in the project",
        detail:
          "Generic assistant answers were useless. Requests now carry a trimmed slice of the project thread and recent sessions, so suggestions reference actual decisions instead of guessing.",
      },
      {
        title: "Avoiding another tool to maintain",
        detail:
          "The system only works if updating it is a side effect of working. Ending a focus block prompts a one-line note, and that single habit keeps the whole thread current.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "Live",
        note: "Usable at dev-os-flow.base44.app.",
      },
      {
        label: "Objects unified",
        value: "3",
        note: "Tasks, focus sessions, project threads.",
      },
      {
        label: "Built for",
        value: "Solo builders",
        note: "Designed around my own workflow.",
      },
      {
        label: "Interaction",
        value: "Keyboard-first",
        note: "Command-driven navigation.",
      },
    ],
  },

  {
    slug: "cognos",
    screenshot: "/projects/previews/cognos.svg",
    imageAlt:
      "COGNOS preview artwork — a raw thought captured and classified, feeding a connected idea graph.",
    name: "COGNOS",
    category: "Cognitive / AI",
    description:
      "An AI cognitive operating system designed to capture raw thoughts, classify them, and map connections between ideas.",
    built: ["Thought capture", "AI classification", "Idea graph mapping"],
    tech: ["AI APIs", "NLP", "Graph Architecture"],
    status: "Live",
    live: "https://cognos-app.base44.app",
    filters: ["AI", "Base44"],
    platform: "base44",
    problem:
      "Notes apps store text; they do not store thinking. Ideas arrive unformed, at bad times, and the connection between two of them is usually the valuable part. COGNOS was an attempt to build a capture surface that classifies a raw thought the moment it lands and then shows how it relates to everything captured before.",
    stack: [
      {
        group: "Capture",
        items: ["Fast entry", "Voice-to-text input", "Tag inference"],
      },
      {
        group: "AI layer",
        items: [
          "Classification",
          "Embeddings",
          "Similarity linking",
          "NLP cleanup",
        ],
      },
      {
        group: "Graph",
        items: ["Node/edge model", "Cluster detection", "Interactive map"],
      },
      { group: "Platform", items: ["Base44", "Persistent store"] },
    ],
    gallery: [
      {
        title: "Raw capture",
        caption:
          "One input box, no folders, no decisions. The cost of capturing a thought has to be near zero or the thought is lost.",
        lines: [
          "Instant entry",
          "No taxonomy",
          "Timestamped",
          "Offline-tolerant",
        ],
      },
      {
        title: "Automatic classification",
        caption:
          "Each entry is typed — idea, question, task, observation — and tagged, so structure appears after capture instead of blocking it.",
        lines: [
          "Type detection",
          "Auto tags",
          "Confidence",
          "Manual correction",
        ],
      },
      {
        title: "Idea graph",
        caption:
          "Related thoughts are linked by meaning, and clusters surface themes you did not know you kept returning to.",
        lines: ["Semantic links", "Clusters", "Timeline view", "Search"],
      },
    ],
    challenges: [
      {
        title: "Classification that is useful, not noisy",
        detail:
          "Over-eager tagging made everything look connected. I constrained the label set and added a confidence threshold, so low-certainty entries stay unclassified rather than polluting the graph.",
      },
      {
        title: "Meaningful edges",
        detail:
          "Keyword overlap linked unrelated notes. Switching to embedding similarity with a minimum distance produced far fewer but far better connections.",
      },
      {
        title: "Graphs that stay readable",
        detail:
          "Past a few hundred nodes the map turned into hairball. Rendering now collapses clusters by default and expands on demand.",
      },
    ],
    results: [
      {
        label: "Status",
        value: "Live",
        note: "Usable at cognos-app.base44.app.",
      },
      {
        label: "Pipeline",
        value: "Capture → classify → connect",
        note: "Fully automatic.",
      },
      {
        label: "Link quality",
        value: "Embedding-based",
        note: "Replaced keyword matching.",
      },
    ],
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
    screenshot: "/projects/tabzen.webp",
    imageAlt: "TabZen workspace — focus score, tab groups and daily goals.",
    filters: ["AI", "Base44"],
    platform: "base44",
    problem:
      "Research sessions end with forty tabs and no memory of why half of them were opened. Closing them loses the thread; keeping them makes the browser unusable. TabZen treats tabs as a working set that should be grouped, summarised and archived without losing the reason each one existed.",
    stack: [
      {
        group: "Extension",
        items: [
          "Browser extension APIs",
          "Tab & window events",
          "Local storage",
        ],
      },
      {
        group: "AI layer",
        items: [
          "Page summarisation",
          "Topic clustering",
          "Title normalisation",
        ],
      },
      {
        group: "Interface",
        items: ["Group view", "Search over archive", "One-click restore"],
      },
      { group: "Platform", items: ["Base44", "Hosted app surface"] },
    ],
    gallery: [
      {
        title: "Context groups",
        caption:
          "Open tabs are clustered by topic rather than by the order they were opened, so a research thread stays together even when it was interrupted.",
        lines: [
          "Auto grouping",
          "Manual override",
          "Group naming",
          "Pin important",
        ],
      },
      {
        title: "Summaries",
        caption:
          "Each tab gets a one-line summary so a group can be understood at a glance weeks later, without reopening every page.",
        lines: ["Per-tab summary", "Group digest", "Key links", "Read state"],
      },
      {
        title: "Lossless archive",
        caption:
          "Archiving closes the tabs but keeps URL, title, summary and group, so nothing is lost and everything is searchable.",
        lines: [
          "Archive session",
          "Full-text search",
          "Restore group",
          "Export",
        ],
      },
    ],
    challenges: [
      {
        title: "Grouping that matches human intent",
        detail:
          "Pure keyword clustering split obviously related pages. Grouping now combines page content signals with opener relationships and time proximity, which matches how a session actually forms.",
      },
      {
        title: "Summarising cheaply",
        detail:
          "Summarising every tab on every change is wasteful. Summaries are generated once per URL, cached, and refreshed only when the page changes materially.",
      },
      {
        title: "Never losing a tab",
        detail:
          "Any archive feature is only trusted if restore is perfect. Archive writes the full record before closing anything, and restore rebuilds the window layout exactly.",
      },
    ],
    results: [
      { label: "Status", value: "Live", note: "Usable at tabzen.base44.app." },
      {
        label: "Core loop",
        value: "Group → summarise → archive",
        note: "Three-step workflow.",
      },
      {
        label: "Data loss",
        value: "Zero by design",
        note: "Archive precedes close.",
      },
    ],
  },

  {
    slug: "ai-for-students",
    screenshot: "/projects/previews/ai-for-students.svg",
    imageAlt:
      "AI for Students preview artwork — a dotted lesson path with milestones, an open lesson card and level progress.",
    name: "AI for Students",
    category: "Education / AI",
    description:
      "A gamified AI learning platform built around making AI easier for students to understand and use.",
    built: ["Guided AI lessons", "Gamification", "API-driven tutoring"],
    tech: ["AI Tutoring", "APIs", "Gamification"],
    status: "Live",
    live: "https://ai-for-students.base44.app",
    filters: ["AI", "Base44"],
    platform: "base44",
  },
  {
    slug: "home-serveai",
    screenshot: "/projects/previews/home-serveai.svg",
    imageAlt:
      "Home ServeAI preview artwork — a city map with service pins, a matched route and a provider card.",
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
    screenshot: "/projects/previews/jarvis.svg",
    imageAlt:
      "JARVIS preview artwork — a radial listening field around a microphone with a spoken request and reply.",
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
    screenshot: "/projects/previews/gemlab.svg",
    imageAlt:
      "GemLab preview artwork — three side-by-side persona conversations in friendly, professional and creative modes.",
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
    screenshot: "/projects/previews/security-camera-system.svg",
    imageAlt:
      "Security Camera System preview artwork — a camera feed with a detected person, a recording overlay and a motion timeline.",
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
    screenshot: "/projects/previews/currency-converter.svg",
    imageAlt:
      "Currency Converter preview artwork — stacked from and to amount panels with a swap control and a live rate table.",
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
    screenshot: "/projects/previews/gestureplay.svg",
    imageAlt:
      "GesturePlay preview artwork — a tracked hand skeleton beside rock, paper and pencil move cards.",
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
    screenshot: "/projects/previews/watch-walkie-talkie.svg",
    imageAlt:
      "Watch Walkie Talkie preview artwork — a smartwatch push-to-talk dial paired with a phone over transmission arcs.",
    name: "Watch Walkie Talkie",
    category: "Real-Time Communication",
    description:
      "Push-to-talk voice communication concept connecting smartwatches and phones for instant communication.",
    built: [
      "Push-to-talk",
      "Real-time audio streaming",
      "Cross-device pairing",
    ],
    tech: [
      "Flutter",
      "Python",
      "Real-Time Audio Streaming",
      "Cross-Device Communication",
    ],
    status: "Concept",
    filters: ["Flutter", "Python"],
  },
  {
    slug: "conversacore-ai",
    screenshot: "/projects/previews/conversacore-ai.svg",
    imageAlt:
      "ConversaCore AI preview artwork — one prompt routed between model nodes with a fallback path and a response panel.",
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
    screenshot: "/projects/previews/arabica-ai-chat.svg",
    imageAlt:
      "Arabica AI Chat preview artwork — mirrored English and Arabic conversations with translation between them.",
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
    screenshot: "/projects/previews/neurotac-ai.svg",
    imageAlt:
      "NeuroTac AI preview artwork — a tic tac toe board with scored candidate moves and a win probability bar.",
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

export const allProjects: Project[] = [
  ...featuredProjects,
  ...ecosystemProjects,
];

/**
 * The three draggable cards in the hero — a curated pick, not a chronology and
 * not simply the flagships. One technically ambitious system (Scholara), one
 * visually-driven game (The Neon Rush) and one AI product build (Gradr), so the
 * first screen shows three different strengths. Swap or reorder the slugs here
 * and the hero follows; every card still links to its own case study, and every
 * project stays reachable from `/projects` and the ecosystem archive.
 */
const heroShowcaseSlugs = ["scholara", "the-neonrush", "gradr"];

export const heroShowcase: Project[] = heroShowcaseSlugs
  .map((slug) => allProjects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

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
    items: [
      "Generative AI",
      "AI APIs",
      "AI applications",
      "AI assistants",
      "AI integrations",
    ],
  },
  {
    title: "Software",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "React",
      "Flutter",
      "Tkinter",
    ],
  },
  {
    title: "Computer Vision",
    items: ["OpenCV", "MediaPipe", "Motion detection", "Gesture recognition"],
  },
  {
    title: "Robotics",
    items: [
      "Robotics",
      "Sensors",
      "Hardware integration",
      "Engineering competitions",
    ],
  },
  {
    title: "Product",
    items: [
      "Product design",
      "Systems thinking",
      "Rapid prototyping",
      "Problem solving",
    ],
  },
  {
    title: "Competition",
    items: [
      "Techfest",
      "FLL",
      "F1 in Schools / STEM Racing",
      "MUN",
      "Exhibitions",
    ],
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
    body: [
      "Participated across Coding, Data Science, and Space Tech pathways.",
    ],
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
    year: "2026",
    title: "Novara MUN Secretariat",
    meta: "Head of Admins · July 2026",
    body: [
      "Joined the Novara MUN 2026 secretariat as Head of Admins, running the conference's administration.",
    ],
  },
  {
    year: "NOW",
    title: "Building What's Next",
    body: [
      "More ambitious products. More competitions. More experiments. More systems.",
    ],
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
  {
    place: "1st Place",
    detail: "Data Science",
    event: "Techfest",
    certKey: "techfest-data-science-1st",
  },
  {
    place: "2nd Place",
    detail: "IoT",
    event: "Techfest",
    certKey: "techfest-iot-2nd",
  },
  {
    place: "2nd Place",
    detail: "Space Tech",
    event: "Group Techfest",
    certKey: "techfest-space-tech-2nd",
  },
  {
    place: "Innovation Award",
    detail: "FLL UAE",
    event: "Dubai Regional",
    certKey: "fll-innovation",
  },
  {
    place: "2nd Place",
    detail: "Math Expo",
    event: '"Math & Me"',
    certKey: "math-expo",
  },
  {
    place: "3rd Place",
    detail: "Shot Put",
    event: "Annual Athletic Meet",
    certKey: "shot-put",
  },
];

export const munResults: MunResult[] = [
  {
    title: "IHSMUN 2025",
    detail: "Lok Sabha B · Verbal Commendation",
    certKey: "mun-ihsmun-2025",
  },
  { title: "Novara MUN 2026", detail: "UNSC · Verbal Commendation" },
  {
    title: "IHS UNSummit 2026",
    detail: "FIA · Verbal Commendation",
  },
];

/** FIRST LEGO League seasons, listed only as far as they are confirmed. */
export const fllSeasons = [
  {
    season: "2025–26",
    title: "FIRST LEGO League · UNEARTHED",
    detail: "Dubai Regional 2025–2026.",
    points: [
      "Innovation Award — Winner at the Dubai Regional",
      "Certificate of Participation — Challenge: Dubai Regional",
    ],
  },
];

export const exhibitions = [
  "Robotics exhibitions",
  "School exhibitions",
  "TechFest",
  "STEM / engineering demonstrations",
  "Other project showcases",
];

/** Non-commercial description of the kinds of work Andrew builds. */
export interface BuildArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: { label: string; value: string }[];
  /** Project slugs surfaced inside the card's detail panel. */
  projects?: string[];
}

export const buildAreas: BuildArea[] = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description:
      "AI-first applications and assistants built with modern models, APIs, and custom logic — from career tools to conversational systems.",
    icon: "BrainCircuit",
    details: [
      { label: "Focus", value: "Assistants · Agents · Model APIs" },
      { label: "Projects", value: "Gradr · COGNOS · JARVIS" },
    ],
    projects: ["gradr", "cognos", "jarvis"],
  },
  {
    id: "software",
    title: "Software Development",
    description:
      "Full applications built end to end: interface design, application logic, data models, and deployment of things that actually run.",
    icon: "AppWindow",
    details: [
      { label: "Focus", value: "Web apps · Tools · Platforms" },
      { label: "Projects", value: "Stack Up · DevOS · TabZen" },
    ],
    projects: ["stack-up", "devos", "tabzen"],
  },
  {
    id: "robotics",
    title: "Robotics & Engineering",
    description:
      "Competition robotics and engineering builds, from FLL and STEM Racing to hardware experiments and exhibition demonstrations.",
    icon: "Cpu",
    details: [
      { label: "Focus", value: "FLL · STEM Racing · Hardware" },
      { label: "Work", value: "Competitions · Exhibitions" },
    ],
    projects: ["horizon-motorsports"],
  },
  {
    id: "vision",
    title: "Computer Vision",
    description:
      "Experiments in perception: gesture control, camera systems, and interfaces that respond to the physical world.",
    icon: "ScanEye",
    details: [
      { label: "Focus", value: "Gesture · Tracking · Cameras" },
      { label: "Projects", value: "GesturePlay · Security Camera System" },
    ],
    projects: ["gestureplay", "security-camera-system"],
  },
  {
    id: "product",
    title: "Product Development",
    description:
      "Taking an idea from a rough concept through structure, interface, and iteration until it becomes a usable product.",
    icon: "Workflow",
    details: [
      { label: "Focus", value: "Concept → Interface → Ship" },
      { label: "Projects", value: "TerraCart · ClientFlow OS" },
    ],
    projects: ["terracart", "clientflow-os"],
  },
  {
    id: "data",
    title: "Data Science",
    description:
      "Working with data to find patterns, build dashboards, and turn scattered information into something understandable.",
    icon: "LineChart",
    details: [
      { label: "Focus", value: "Analysis · Dashboards · Automation" },
      { label: "Interest", value: "Systems thinking" },
    ],
    projects: ["gemlab"],
  },
];

export const currentlyBuilding = [
  { name: "Gradr", status: "Building", note: "AI career accelerator." },
  {
    name: "TerraCart",
    status: "Developing",
    note: "Sustainable shopping assistant.",
  },
  {
    name: "ClientFlow OS",
    status: "In Active Development",
    note: "Business operating system.",
  },
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

/** Public contact address shown on the contact page. */
export const CONTACT_EMAIL = "buildwithandrewmk@gmail.com";

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
    description:
      "The central hub for every profile, project, and link of mine.",
    cta: "View All My Links",
  },
];

/** One-line professional description, used wherever the site states who I am. */
export const PROFILE_TITLE = "Student Developer · AI Builder · Systems Thinker";

/** Verbatim identity line from the source About page and Person JSON-LD. */
export const PROFILE_IDENTITY =
  "Student · Developer · AI Builder · Systems Thinker";

export const SCHOOL = "The Indian High School, Dubai";

export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "AI",
    items: [
      "Generative AI",
      "AI APIs",
      "AI applications",
      "AI assistants",
      "AI integrations",
    ],
  },
  {
    title: "Software",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "React",
      "Flutter",
      "Tkinter",
    ],
  },
  {
    title: "Computer Vision",
    items: ["OpenCV", "MediaPipe", "Motion detection", "Gesture recognition"],
  },
  {
    title: "Robotics",
    items: [
      "Robotics",
      "Sensors",
      "Hardware integration",
      "Engineering competitions",
    ],
  },
  {
    title: "Product",
    items: [
      "Product design",
      "Systems thinking",
      "Rapid prototyping",
      "Problem solving",
    ],
  },
  {
    title: "Competition",
    items: [
      "Techfest",
      "FLL",
      "F1 in Schools / STEM Racing",
      "MUN",
      "Exhibitions",
    ],
  },
];

export interface CertificationEntry {
  name: string;
  detail: string;
}

export interface CertificationGroup {
  title: string;
  items: CertificationEntry[];
}

/**
 * Learning and completion certificates. These are course and programme
 * completions, not professional accreditations, and they are labelled that way.
 */
export const certificationGroups: CertificationGroup[] = [
  {
    title: "AI & developer skills",
    items: [
      { name: "Claude 101", detail: "Anthropic · completion certificate" },
      { name: "Claude Code 101", detail: "Anthropic · completion certificate" },
      {
        name: "AI Fluency for Students",
        detail: "Anthropic · completion certificate",
      },
      {
        name: "Software Engineer Intern",
        detail: "HackerRank · certificate of accomplishment",
      },
      {
        name: "Frontend Developer (React)",
        detail: "HackerRank · certificate of accomplishment",
      },
    ],
  },
  {
    title: "Data & cloud",
    items: [
      {
        name: "MongoDB Indexing Design Fundamentals",
        detail: "MongoDB · proof of completion",
      },
      {
        name: "CRUD Operations in MongoDB",
        detail: "MongoDB · proof of completion",
      },
      {
        name: "Google Cloud learning track",
        detail: "DataCamp · four statement-of-accomplishment courses",
      },
    ],
  },
  {
    title: "Academic & programmes",
    items: [
      { name: "Environmental Short Course", detail: "ASDAN · 4 credits" },
      {
        name: "TKS 2026–27",
        detail: "The Knowledge Society · accepted for the 2026–27 cohort",
      },
    ],
  },
];
