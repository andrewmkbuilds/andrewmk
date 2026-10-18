import { n as __toESM } from "../_runtime.mjs";
import { a as useMotionValue, c as AnimatePresence, n as useReducedMotion, o as useScroll, r as useSpring } from "../_libs/framer-motion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-BJUrh-0e.mjs";
import { b as Link, p as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Hexagon, D as Instagram, P as Github, S as Menu, f as Share2, j as Heart, o as Twitter, r as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as Provider, r as Root3, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Layout-C1nd09HF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}));
TooltipContent.displayName = Content2.displayName;
/**
* Router-compat shim — bridges @/lib/router-compat v6 call sites to
* @tanstack/react-router without hand-rewriting every component.
* This is the same load-bearing pattern used in Klar's dev-copy migration.
*/
function parseTo(to) {
	const [beforeHash = "", hashStr] = (to ?? "").split("#");
	const [pathname = "", searchStr] = beforeHash.split("?");
	return {
		pathname: pathname || ".",
		...searchStr ? { search: Object.fromEntries(new URLSearchParams(searchStr)) } : {},
		...hashStr ? { hash: hashStr } : {}
	};
}
function useLocation$1() {
	const loc = useLocation();
	return (0, import_react.useMemo)(() => ({
		pathname: loc.pathname,
		search: loc.searchStr ? `?${loc.searchStr}` : "",
		hash: loc.hash ?? "",
		state: loc.state ?? null,
		key: loc.pathname + (loc.searchStr ?? "")
	}), [
		loc.pathname,
		loc.searchStr,
		loc.hash,
		loc.state
	]);
}
var Link$1 = (0, import_react.forwardRef)(function Link$2({ to, replace, state, children, ...rest }, ref) {
	const { pathname, search, hash } = parseTo(to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		ref,
		to: pathname,
		...search !== void 0 ? { search } : {},
		...hash !== void 0 ? { hash } : {},
		...replace !== void 0 ? { replace } : {},
		...state !== void 0 ? { state } : {},
		...rest ?? {},
		children
	});
});
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetClose = DialogClose;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var featuredProjects = [
	{
		slug: "gradr",
		name: "Gradr",
		category: "Career Technology · AI",
		description: "An AI-powered career accelerator designed to help students, graduates, and early-career professionals build stronger resumes, prepare for interviews, and manage their career journey.",
		previously: "Previously known as CareerFlow OS.",
		built: [
			"AI resume analysis",
			"ATS scoring",
			"Job tracking",
			"AI mock interviews",
			"Interview analytics",
			"Career development tools"
		],
		tech: ["AI", "React"],
		status: "Building",
		filters: [
			"AI",
			"React",
			"Lovable"
		],
		featured: true,
		platform: "lovable",
		problem: "Early-career candidates get almost no useful feedback. Resumes disappear into applicant tracking systems without explanation, interview practice is either expensive or unstructured, and applications end up scattered across spreadsheets, inboxes and browser tabs. The missing piece is not more advice — it is a system that reviews your material, tells you exactly what is weak, and keeps the whole search in one place.",
		stack: [
			{
				group: "Interface",
				items: [
					"React",
					"TypeScript",
					"Tailwind CSS",
					"Component library"
				]
			},
			{
				group: "AI layer",
				items: [
					"LLM APIs",
					"Structured prompting",
					"Scoring rubrics",
					"Streaming responses"
				]
			},
			{
				group: "Backend",
				items: [
					"Postgres",
					"Row-level security",
					"Auth",
					"File storage",
					"Server functions"
				]
			},
			{
				group: "Platform",
				items: [
					"Lovable",
					"MCP integration",
					"Credit-based usage metering"
				]
			}
		],
		gallery: [
			{
				title: "Resume analysis",
				caption: "Upload a resume and get a structured breakdown: ATS score, keyword coverage, weak bullet points and concrete rewrite suggestions instead of vague feedback.",
				lines: [
					"ATS score",
					"Keyword gaps",
					"Bullet rewrites",
					"Section checks"
				]
			},
			{
				title: "AI mock interviews",
				caption: "Role-specific interview sessions that ask follow-up questions, then score answers on structure, specificity and relevance so practice actually compounds.",
				lines: [
					"Role selection",
					"Live Q&A",
					"Answer scoring",
					"Session replay"
				]
			},
			{
				title: "Job tracker",
				caption: "Every application in one board with stage, source and reminders, so nothing is lost between applying and following up.",
				lines: [
					"Saved jobs",
					"Stages",
					"Reminders",
					"Match signals"
				]
			},
			{
				title: "Career plan & analytics",
				caption: "A progress view that turns sessions and applications into trends — where scores improve, where they stall, and what to work on next.",
				lines: [
					"Score trend",
					"Skill gaps",
					"Next actions",
					"Weekly summary"
				]
			}
		],
		challenges: [
			{
				title: "Making AI feedback specific, not generic",
				detail: "The first versions returned polite but useless advice. I moved from open-ended prompts to fixed scoring rubrics with structured output, so every response has to point at a real line in the resume or answer and explain what to change."
			},
			{
				title: "Approximating ATS behaviour honestly",
				detail: "Real applicant tracking systems are closed. Instead of pretending to replicate one, the score is built from things that are actually checkable — parseability, section structure, keyword coverage against the job description and formatting risks — and the app explains each component."
			},
			{
				title: "Keeping AI cost predictable",
				detail: "Long resumes and interview transcripts get expensive fast. Requests are trimmed and cached, heavy analysis runs on demand rather than on every keystroke, and usage is metered with a credit balance so cost stays bounded per user."
			},
			{
				title: "Data privacy on personal documents",
				detail: "Resumes are sensitive. Everything is scoped per user with row-level security, files live in access-controlled storage, and no document is readable across accounts."
			}
		],
		results: [
			{
				label: "Status",
				value: "In active development",
				note: "Core flows working end to end."
			},
			{
				label: "Core modules",
				value: "6",
				note: "Resume, ATS, interviews, tracker, analytics, plan."
			},
			{
				label: "Feedback loop",
				value: "Analyse → practise → apply",
				note: "One connected system."
			},
			{
				label: "Integrations",
				value: "MCP tools",
				note: "Resumes, jobs and reminders exposed to assistants."
			}
		],
		metrics: {
			title: "Early traction",
			intro: "Gradr attracted 300+ visitors within its first three days after launch, demonstrating strong early interest in the platform.",
			source: "Figure measures website visitors, not registered or active users.",
			items: [{
				value: "300+",
				label: "Website visitors",
				note: "First three days after launch."
			}]
		}
	},
	{
		slug: "stack-up",
		name: "Stack Up",
		category: "Personal Finance · Gamification",
		description: "The first product I shipped. A personal finance system designed to make spending, budgeting, and saving easier to understand and more engaging.",
		built: [
			"Expense tracking",
			"Budget management",
			"Savings goals",
			"Gamification",
			"Streaks",
			"Financial analytics"
		],
		tech: ["React"],
		status: "Live",
		live: "https://stackup-app.base44.app/",
		filters: ["Base44", "React"],
		featured: true,
		platform: "base44",
		problem: "Most budgeting apps assume you already have the discipline they are supposed to build. They show you a pie chart after the money is gone. Stack Up started from the opposite question: what would make a student actually open a finance app on a normal Tuesday? The answer was progress — visible streaks, goals that move, and numbers small enough to act on.",
		stack: [
			{
				group: "Interface",
				items: [
					"React",
					"Component-driven UI",
					"Responsive layouts",
					"Charting"
				]
			},
			{
				group: "Logic",
				items: [
					"Budget engine",
					"Streak & XP rules",
					"Goal projection",
					"Category rollups"
				]
			},
			{
				group: "Data",
				items: [
					"Per-user records",
					"Transaction history",
					"Recurring entries",
					"Auth"
				]
			},
			{
				group: "Platform",
				items: ["Base44", "Hosted deployment"]
			}
		],
		gallery: [
			{
				title: "Dashboard",
				caption: "One screen answers the only question that matters day to day: how much is left, and is this month on track compared to the last one.",
				lines: [
					"Safe-to-spend",
					"Month trend",
					"Top categories",
					"Streak status"
				]
			},
			{
				title: "Expense capture",
				caption: "Logging a spend takes a few seconds — amount, category, optional note — because anything slower gets abandoned within a week.",
				lines: [
					"Quick add",
					"Smart categories",
					"Recurring entries",
					"Edit history"
				]
			},
			{
				title: "Budgets & goals",
				caption: "Budgets are per category with live burn-down, and savings goals project a realistic finish date from actual deposit behaviour.",
				lines: [
					"Category caps",
					"Burn-down bars",
					"Goal projection",
					"Overspend alerts"
				]
			},
			{
				title: "Streaks & analytics",
				caption: "Gamification is tied to behaviour that actually helps — logging consistently and staying under budget — not to spending more.",
				lines: [
					"Daily streak",
					"XP levels",
					"Category breakdown",
					"Month-over-month"
				]
			}
		],
		challenges: [
			{
				title: "Gamifying finance without encouraging bad habits",
				detail: "Early reward rules accidentally rewarded activity, which meant more transactions scored higher. I rewrote the scoring so streaks come from consistent logging and staying inside budget, and goal progress is the only thing that drives levels."
			},
			{
				title: "Making budgets survive real life",
				detail: "A rigid monthly cap breaks the first time an unexpected bill lands. Budgets became rolling, with carry-over and a separate 'irregular' bucket, so one bad week does not invalidate the whole month."
			},
			{
				title: "Keeping data entry under ten seconds",
				detail: "Retention died on friction. I cut the add-expense flow to a single sheet with remembered categories and recurring entries, which removed most repeat typing."
			},
			{
				title: "Shipping a first product end to end",
				detail: "This was the first thing I took from idea to live URL — auth, data modelling, state, deployment. The lesson that carried into every project after it was to ship a narrow version and let real usage decide the next feature."
			}
		],
		results: [
			{
				label: "Status",
				value: "Live",
				note: "Publicly usable at stackup-app.base44.app."
			},
			{
				label: "First shipped product",
				value: "2024",
				note: "Idea to deployed app end to end."
			},
			{
				label: "Core modules",
				value: "5",
				note: "Expenses, budgets, goals, streaks, analytics."
			},
			{
				label: "Entry time",
				value: "< 10s",
				note: "Design target for logging a spend."
			}
		],
		metrics: {
			title: "Early traction",
			intro: "Stack Up attracted 600+ visitors within its first week after launch, demonstrating strong early interest following launch.",
			source: "Figure measures website visitors, not registered or active users.",
			items: [{
				value: "600+",
				label: "Website visitors",
				note: "First week after launch."
			}]
		}
	},
	{
		slug: "terracart",
		name: "TerraCart",
		category: "AI · Sustainability · E-commerce",
		description: "An AI-powered shopping assistant designed to help people discover more sustainable alternatives while shopping online.",
		built: [
			"E-commerce product analysis",
			"Sustainable alternatives",
			"AI research",
			"Shopping checklist",
			"Browser extension experience"
		],
		tech: ["AI", "Browser Extension"],
		status: "Developing",
		filters: ["AI"],
		featured: true,
		problem: "Shopping sustainably online is mostly guesswork. Product pages optimise for conversion, claims are unverifiable, and comparing a greener alternative means opening five tabs mid-checkout. TerraCart puts the analysis where the decision happens — on the product page — and offers a concrete alternative instead of a lecture.",
		stack: [
			{
				group: "Extension",
				items: [
					"Browser extension",
					"Product page parsing",
					"Content scripts"
				]
			},
			{
				group: "AI layer",
				items: [
					"Product understanding",
					"Claim research",
					"Alternative matching"
				]
			},
			{
				group: "Interface",
				items: [
					"Inline panel",
					"Comparison view",
					"Shopping checklist"
				]
			},
			{
				group: "Data",
				items: [
					"Product cache",
					"Category heuristics",
					"Saved items"
				]
			}
		],
		gallery: [
			{
				title: "Product analysis",
				caption: "The extension reads the product being viewed and breaks down what is actually known about materials, packaging and origin versus what is only marketing language.",
				lines: [
					"Material read",
					"Packaging",
					"Origin signals",
					"Claim check"
				]
			},
			{
				title: "Better alternatives",
				caption: "Instead of a score with no action attached, it surfaces comparable products that are genuinely more sustainable and similar in price and function.",
				lines: [
					"Similar items",
					"Why it's better",
					"Price delta",
					"Availability"
				]
			},
			{
				title: "Shopping checklist",
				caption: "A running list keeps intended purchases together so decisions can be reviewed before checkout rather than one impulse at a time.",
				lines: [
					"Saved items",
					"Compare view",
					"Notes",
					"Decision log"
				]
			}
		],
		challenges: [
			{
				title: "Reading messy product pages",
				detail: "Every retailer structures pages differently. Parsing combines structured data where it exists with content-based extraction as fallback, so the panel still works on pages without clean markup."
			},
			{
				title: "Not inventing sustainability claims",
				detail: "The easy failure mode is a confident number with nothing behind it. Analysis separates verifiable attributes from unverified marketing claims and says so explicitly when evidence is thin."
			},
			{
				title: "Alternatives that are actually comparable",
				detail: "A greener product at four times the price is not a real option. Matching filters on function and price band first, then ranks on sustainability signals."
			}
		],
		results: [
			{
				label: "Status",
				value: "In development",
				note: "Analysis and alternatives in progress."
			},
			{
				label: "Surface",
				value: "Browser extension",
				note: "Works inline on product pages."
			},
			{
				label: "Principle",
				value: "Evidence over scores",
				note: "Unverified claims labelled as such."
			}
		]
	},
	{
		slug: "clientflow-os",
		name: "ClientFlow OS",
		category: "Business Operating System · AI",
		description: "A unified platform for managing clients, projects, conversations, payments, documents, and workflows in one connected system.",
		built: [
			"Client lifecycle management",
			"Project management",
			"Communication tracking",
			"Stripe payments",
			"Invoicing",
			"File storage",
			"AI automation",
			"Approval dashboards"
		],
		tech: ["AI", "React"],
		status: "In Active Development",
		github: "https://github.com/andrewmkbuilds/ClientFlow-OS",
		filters: ["AI", "React"],
		featured: true,
		problem: "Small studios and freelancers run their business across six tools that do not talk: a CRM, a chat app, a spreadsheet of projects, an invoicing tool, a drive folder and a notes app. Every handoff between them is manual and every status question costs a search. ClientFlow OS collapses the client lifecycle — enquiry to delivery to payment — into one connected system.",
		stack: [
			{
				group: "Interface",
				items: [
					"React",
					"TypeScript",
					"Dashboard layouts",
					"Approval flows"
				]
			},
			{
				group: "Backend",
				items: [
					"Postgres",
					"Row-level security",
					"Auth",
					"File storage",
					"Server functions"
				]
			},
			{
				group: "Payments",
				items: [
					"Stripe",
					"Invoicing",
					"Payment status sync"
				]
			},
			{
				group: "AI layer",
				items: [
					"Automations",
					"Conversation summarisation",
					"Draft generation"
				]
			}
		],
		gallery: [
			{
				title: "Client lifecycle",
				caption: "Every client has one record carrying stage, projects, conversations, documents and payment history, so status never has to be reconstructed.",
				lines: [
					"Stages",
					"Contacts",
					"Linked projects",
					"Activity feed"
				]
			},
			{
				title: "Projects & approvals",
				caption: "Deliverables move through explicit approval states with a client-facing view, which removes the endless 'did you see this?' thread.",
				lines: [
					"Milestones",
					"Approval states",
					"Client view",
					"Change log"
				]
			},
			{
				title: "Payments & invoicing",
				caption: "Invoices are generated from project milestones and reconciled through Stripe, so paid work and unpaid work are never ambiguous.",
				lines: [
					"Invoice builder",
					"Stripe checkout",
					"Status sync",
					"Reminders"
				]
			},
			{
				title: "AI automation",
				caption: "Routine work — summarising a thread, drafting an update, flagging a stalled project — is automated so the system reduces admin rather than adding it.",
				lines: [
					"Thread summaries",
					"Draft updates",
					"Stall detection",
					"Suggested next steps"
				]
			}
		],
		challenges: [
			{
				title: "Modelling one lifecycle across many objects",
				detail: "Clients, projects, invoices and messages each want to be the centre. Making the client the root and treating everything else as a scoped child removed most cross-entity edge cases."
			},
			{
				title: "Payment state is the hard part",
				detail: "Invoices can be partially paid, refunded or fail after the fact. Stripe webhooks are the single source of truth and local state is derived from them, never written optimistically."
			},
			{
				title: "Sharing with clients without leaking data",
				detail: "Client-facing views needed to expose exactly one project and nothing else. Row-level security policies are written per relationship instead of per role, which keeps access provable."
			},
			{
				title: "Automation that stays trustworthy",
				detail: "Anything AI-generated that touches a client goes into a draft state with an approval step, so automation speeds up the operator instead of speaking for them."
			}
		],
		results: [
			{
				label: "Status",
				value: "In active development",
				note: "Core lifecycle working."
			},
			{
				label: "Modules",
				value: "8",
				note: "Clients, projects, comms, payments, docs, automation."
			},
			{
				label: "Payments",
				value: "Stripe",
				note: "Webhook-driven state."
			},
			{
				label: "Code",
				value: "Public repo",
				note: "github.com/andrewmkbuilds/ClientFlow-OS"
			}
		]
	}
];
var ecosystemProjects = [
	{
		slug: "horizon-motorsports",
		name: "Horizon Motorsports",
		category: "Racing / Community",
		description: "Digital home for Horizon Motorsports, a UAE-based racing team competing in FLL, Techfest, and engineering competitions.",
		built: [
			"Team site",
			"Competition presence",
			"Motion-driven interface"
		],
		tech: ["React", "Framer Motion"],
		status: "Active",
		live: "https://horizonmotorsports.base44.app/",
		filters: ["React"],
		platform: "base44",
		problem: "Horizon Motorsports needed a presence that matched how the team actually operates: a Dubai-based racing and engineering team competing in FLL, Techfest and other UAE competitions, with a following that lives mostly on social. The site had to work as the anchor visitors land on from Instagram — fast, motion-driven, and clear about who the team is and what it competes in.",
		stack: [
			{
				group: "Interface",
				items: [
					"React",
					"Framer Motion",
					"Responsive layout"
				]
			},
			{
				group: "Content",
				items: [
					"Team profile",
					"Competition history",
					"Media sections"
				]
			},
			{
				group: "Platform",
				items: ["Base44", "Hosted deployment"]
			}
		],
		challenges: [
			{
				title: "Motion that does not cost load time",
				detail: "The identity of the site is movement, but heavy animation on a phone over mobile data is a bounce. Transitions are kept to transform and opacity, staged on scroll, so the first screen paints before anything animates."
			},
			{
				title: "Designed for social traffic",
				detail: "Most visitors arrive from a link in an Instagram profile, on a phone, mid-scroll. The layout leads with the team identity and current competitions rather than a long narrative, so the first screen answers who and what."
			},
			{
				title: "Content that survives a competition season",
				detail: "Results and events change through the season. Sections are structured so competition entries can be added without reworking layout."
			}
		],
		results: [
			{
				label: "Status",
				value: "Active",
				note: "Live team site."
			},
			{
				label: "Competitions",
				value: "FLL · Techfest",
				note: "UAE engineering and robotics circuit."
			},
			{
				label: "Base",
				value: "Dubai, UAE",
				note: "Team operates locally."
			},
			{
				label: "Primary channel",
				value: "Instagram",
				note: "Site is the landing point for social traffic."
			}
		],
		metrics: {
			title: "Digital reach",
			intro: "These figures come from recent Instagram analytics for the team account, which is the team's main audience channel.",
			source: "Source: Instagram account analytics for the reporting period shown in the app. Views, accounts reached, interactions and profile visits are distinct Instagram metrics and are not website visits.",
			items: [
				{
					value: "6,631",
					label: "Total views",
					note: "Instagram content views."
				},
				{
					value: "486",
					label: "Accounts reached",
					note: "Unique Instagram accounts."
				},
				{
					value: "857",
					label: "Interactions",
					note: "Instagram content interactions."
				},
				{
					value: "494",
					label: "Profile visits",
					note: "Visits to the Instagram profile."
				},
				{
					value: "14",
					label: "External link clicks",
					note: "Clicks on the profile link."
				},
				{
					value: "149",
					label: "Followers",
					note: "Instagram account followers."
				}
			],
			breakdown: [
				{
					label: "Accounts reached — followers",
					value: "65.6%"
				},
				{
					label: "Accounts reached — non-followers",
					value: "34.4%"
				},
				{
					label: "Interactions — followers",
					value: "72.8%"
				},
				{
					label: "Interactions — non-followers",
					value: "27.2%"
				},
				{
					label: "Views — posts",
					value: "68.3%"
				},
				{
					label: "Views — stories",
					value: "25.4%"
				},
				{
					label: "Views — reels",
					value: "6.4%"
				},
				{
					label: "Interactions — posts",
					value: "94.3%"
				},
				{
					label: "Interactions — reels",
					value: "5%"
				},
				{
					label: "Interactions — stories",
					value: "0.7%"
				},
				{
					label: "Top content — Apr 14",
					value: "336 views"
				},
				{
					label: "Top content — Apr 13",
					value: "297 views"
				},
				{
					label: "Top content — Apr 13",
					value: "263 views"
				},
				{
					label: "Top content — Apr 3",
					value: "225 views"
				},
				{
					label: "Top content — Apr 5",
					value: "219 views"
				}
			]
		}
	},
	{
		slug: "devos",
		name: "DevOS",
		category: "Productivity / AI",
		description: "AI-powered developer command center designed to bring tasks, focus sessions, and project threads into one place.",
		built: [
			"Task system",
			"Focus sessions",
			"Project threads",
			"AI integration"
		],
		tech: ["Python", "AI Integration"],
		status: "Live",
		live: "https://dev-os-flow.base44.app/",
		filters: [
			"Python",
			"AI",
			"Base44"
		],
		platform: "base44",
		problem: "Building alone means context lives in five places at once — a task list, a terminal, a notes file, a chat with an AI assistant, and whatever was open when you stopped. DevOS came out of my own workflow: one command center where the task, the focus session and the project thread are the same object, so picking work back up does not require reconstructing it.",
		stack: [
			{
				group: "Core",
				items: [
					"Python",
					"Task engine",
					"Session timer",
					"Thread store"
				]
			},
			{
				group: "AI layer",
				items: [
					"Assistant integration",
					"Context summarisation",
					"Task breakdown"
				]
			},
			{
				group: "Interface",
				items: [
					"Command-driven UI",
					"Keyboard-first navigation",
					"Project boards"
				]
			},
			{
				group: "Platform",
				items: ["Base44", "Hosted deployment"]
			}
		],
		gallery: [
			{
				title: "Command center",
				caption: "Everything starts from one input: create a task, start a focus block, or open a project thread without leaving the keyboard.",
				lines: [
					"Command palette",
					"Today view",
					"Active session",
					"Quick capture"
				]
			},
			{
				title: "Focus sessions",
				caption: "A session is bound to a task, so time tracked is attributable and the end of a block produces a note rather than just a stopped timer.",
				lines: [
					"Timed blocks",
					"Bound task",
					"Session notes",
					"History"
				]
			},
			{
				title: "Project threads",
				caption: "Each project keeps a running thread of decisions, blockers and AI exchanges, which is what makes returning after a week cheap.",
				lines: [
					"Decision log",
					"Blockers",
					"AI exchanges",
					"Linked tasks"
				]
			},
			{
				title: "AI assist",
				caption: "The assistant reads the thread, breaks a vague task into concrete steps, and summarises where a project stalled.",
				lines: [
					"Task breakdown",
					"Thread summary",
					"Next step",
					"Context recall"
				]
			}
		],
		challenges: [
			{
				title: "Context that survives a break",
				detail: "Tasks alone were not enough to resume work. Attaching session notes and decisions to a persistent project thread turned resumption from re-reading code into reading four lines."
			},
			{
				title: "Keeping AI grounded in the project",
				detail: "Generic assistant answers were useless. Requests now carry a trimmed slice of the project thread and recent sessions, so suggestions reference actual decisions instead of guessing."
			},
			{
				title: "Avoiding another tool to maintain",
				detail: "The system only works if updating it is a side effect of working. Ending a focus block prompts a one-line note, and that single habit keeps the whole thread current."
			}
		],
		results: [
			{
				label: "Status",
				value: "Live",
				note: "Usable at dev-os-flow.base44.app."
			},
			{
				label: "Objects unified",
				value: "3",
				note: "Tasks, focus sessions, project threads."
			},
			{
				label: "Built for",
				value: "Solo builders",
				note: "Designed around my own workflow."
			},
			{
				label: "Interaction",
				value: "Keyboard-first",
				note: "Command-driven navigation."
			}
		]
	},
	{
		slug: "cognos",
		name: "COGNOS",
		category: "Cognitive / AI",
		description: "An AI cognitive operating system designed to capture raw thoughts, classify them, and map connections between ideas.",
		built: [
			"Thought capture",
			"AI classification",
			"Idea graph mapping"
		],
		tech: [
			"AI APIs",
			"NLP",
			"Graph Architecture"
		],
		status: "Live",
		live: "https://cognos-app.base44.app/",
		filters: ["AI", "Base44"],
		platform: "base44",
		problem: "Notes apps store text; they do not store thinking. Ideas arrive unformed, at bad times, and the connection between two of them is usually the valuable part. COGNOS was an attempt to build a capture surface that classifies a raw thought the moment it lands and then shows how it relates to everything captured before.",
		stack: [
			{
				group: "Capture",
				items: [
					"Fast entry",
					"Voice-to-text input",
					"Tag inference"
				]
			},
			{
				group: "AI layer",
				items: [
					"Classification",
					"Embeddings",
					"Similarity linking",
					"NLP cleanup"
				]
			},
			{
				group: "Graph",
				items: [
					"Node/edge model",
					"Cluster detection",
					"Interactive map"
				]
			},
			{
				group: "Platform",
				items: ["Base44", "Persistent store"]
			}
		],
		gallery: [
			{
				title: "Raw capture",
				caption: "One input box, no folders, no decisions. The cost of capturing a thought has to be near zero or the thought is lost.",
				lines: [
					"Instant entry",
					"No taxonomy",
					"Timestamped",
					"Offline-tolerant"
				]
			},
			{
				title: "Automatic classification",
				caption: "Each entry is typed — idea, question, task, observation — and tagged, so structure appears after capture instead of blocking it.",
				lines: [
					"Type detection",
					"Auto tags",
					"Confidence",
					"Manual correction"
				]
			},
			{
				title: "Idea graph",
				caption: "Related thoughts are linked by meaning, and clusters surface themes you did not know you kept returning to.",
				lines: [
					"Semantic links",
					"Clusters",
					"Timeline view",
					"Search"
				]
			}
		],
		challenges: [
			{
				title: "Classification that is useful, not noisy",
				detail: "Over-eager tagging made everything look connected. I constrained the label set and added a confidence threshold, so low-certainty entries stay unclassified rather than polluting the graph."
			},
			{
				title: "Meaningful edges",
				detail: "Keyword overlap linked unrelated notes. Switching to embedding similarity with a minimum distance produced far fewer but far better connections."
			},
			{
				title: "Graphs that stay readable",
				detail: "Past a few hundred nodes the map turned into hairball. Rendering now collapses clusters by default and expands on demand."
			}
		],
		results: [
			{
				label: "Status",
				value: "Live",
				note: "Usable at cognos-app.base44.app."
			},
			{
				label: "Pipeline",
				value: "Capture → classify → connect",
				note: "Fully automatic."
			},
			{
				label: "Link quality",
				value: "Embedding-based",
				note: "Replaced keyword matching."
			}
		]
	},
	{
		slug: "tabzen",
		name: "TabZen",
		category: "Productivity / Browser",
		description: "Intelligent tab management that groups tabs by context, summarizes them, and archives them without losing information.",
		built: [
			"Context grouping",
			"AI summarization",
			"Lossless archiving"
		],
		tech: ["Browser Extension", "AI Summarization"],
		status: "Live",
		live: "https://tabzen.base44.app/",
		filters: ["AI", "Base44"],
		platform: "base44",
		problem: "Research sessions end with forty tabs and no memory of why half of them were opened. Closing them loses the thread; keeping them makes the browser unusable. TabZen treats tabs as a working set that should be grouped, summarised and archived without losing the reason each one existed.",
		stack: [
			{
				group: "Extension",
				items: [
					"Browser extension APIs",
					"Tab & window events",
					"Local storage"
				]
			},
			{
				group: "AI layer",
				items: [
					"Page summarisation",
					"Topic clustering",
					"Title normalisation"
				]
			},
			{
				group: "Interface",
				items: [
					"Group view",
					"Search over archive",
					"One-click restore"
				]
			},
			{
				group: "Platform",
				items: ["Base44", "Hosted app surface"]
			}
		],
		gallery: [
			{
				title: "Context groups",
				caption: "Open tabs are clustered by topic rather than by the order they were opened, so a research thread stays together even when it was interrupted.",
				lines: [
					"Auto grouping",
					"Manual override",
					"Group naming",
					"Pin important"
				]
			},
			{
				title: "Summaries",
				caption: "Each tab gets a one-line summary so a group can be understood at a glance weeks later, without reopening every page.",
				lines: [
					"Per-tab summary",
					"Group digest",
					"Key links",
					"Read state"
				]
			},
			{
				title: "Lossless archive",
				caption: "Archiving closes the tabs but keeps URL, title, summary and group, so nothing is lost and everything is searchable.",
				lines: [
					"Archive session",
					"Full-text search",
					"Restore group",
					"Export"
				]
			}
		],
		challenges: [
			{
				title: "Grouping that matches human intent",
				detail: "Pure keyword clustering split obviously related pages. Grouping now combines page content signals with opener relationships and time proximity, which matches how a session actually forms."
			},
			{
				title: "Summarising cheaply",
				detail: "Summarising every tab on every change is wasteful. Summaries are generated once per URL, cached, and refreshed only when the page changes materially."
			},
			{
				title: "Never losing a tab",
				detail: "Any archive feature is only trusted if restore is perfect. Archive writes the full record before closing anything, and restore rebuilds the window layout exactly."
			}
		],
		results: [
			{
				label: "Status",
				value: "Live",
				note: "Usable at tabzen.base44.app."
			},
			{
				label: "Core loop",
				value: "Group → summarise → archive",
				note: "Three-step workflow."
			},
			{
				label: "Data loss",
				value: "Zero by design",
				note: "Archive precedes close."
			}
		]
	},
	{
		slug: "ai-for-students",
		name: "AI for Students",
		category: "Education / AI",
		description: "A gamified AI learning platform built around making AI easier for students to understand and use.",
		built: [
			"Guided AI lessons",
			"Gamification",
			"API-driven tutoring"
		],
		tech: [
			"AI Tutoring",
			"APIs",
			"Gamification"
		],
		status: "Live",
		live: "https://ai-for-students.base44.app/",
		filters: ["AI", "Base44"],
		platform: "base44"
	},
	{
		slug: "home-serveai",
		name: "Home ServeAI",
		category: "Marketplace / AI",
		description: "AI-powered home services marketplace concept featuring smart matching, real-time tracking, and recurring service management.",
		built: [
			"Smart matching",
			"Real-time tracking",
			"Recurring services"
		],
		tech: [
			"Marketplace Architecture",
			"AI Matching",
			"Real-Time Tracking"
		],
		status: "Concept",
		filters: ["AI", "Lovable"],
		platform: "lovable"
	},
	{
		slug: "jarvis",
		name: "JARVIS",
		category: "AI Voice Assistant",
		description: "Voice-powered AI assistant designed to understand spoken commands, maintain context, and execute actions.",
		built: [
			"Voice command handling",
			"Context memory",
			"Action execution"
		],
		tech: [
			"Flutter",
			"Python",
			"Gemini API",
			"Android Studio"
		],
		status: "Experiment",
		filters: [
			"Flutter",
			"Python",
			"AI"
		]
	},
	{
		slug: "gemlab",
		name: "GemLab",
		category: "AI / Tooling",
		description: "Multi-persona AI chatbot environment with Friendly, Professional, and Creative conversation modes.",
		built: [
			"Persona switching",
			"Threaded responses",
			"Desktop interface"
		],
		tech: [
			"Python",
			"Tkinter",
			"Google Gemini API",
			"Threading"
		],
		status: "Built",
		filters: [
			"Python",
			"Tkinter",
			"AI"
		]
	},
	{
		slug: "security-camera-system",
		name: "Security Camera System",
		category: "Computer Vision",
		description: "An intelligent motion-activated recording system that detects movement through a webcam and automatically manages recordings.",
		built: [
			"Motion detection",
			"Automatic recording",
			"Recording management"
		],
		tech: [
			"Python",
			"OpenCV",
			"Haar Cascade Classifiers"
		],
		status: "Built",
		filters: ["Python", "OpenCV"]
	},
	{
		slug: "currency-converter",
		name: "Currency Converter",
		category: "Finance / Utility",
		description: "Desktop currency converter supporting 170+ currencies with live exchange rates and offline fallback.",
		built: [
			"Live rates",
			"Offline caching",
			"Desktop UI"
		],
		tech: [
			"Python",
			"Tkinter",
			"Open Exchange Rate API",
			"Offline Caching"
		],
		status: "Built",
		filters: ["Python", "Tkinter"]
	},
	{
		slug: "gestureplay",
		name: "GesturePlay",
		category: "Computer Vision / Interactive",
		description: "Rock, Paper, Scissors, Pencil played entirely through webcam hand gestures.",
		built: [
			"Hand tracking",
			"Gesture recognition",
			"Game loop"
		],
		tech: [
			"Python",
			"OpenCV",
			"MediaPipe",
			"Tkinter",
			"Pillow"
		],
		status: "Built",
		filters: [
			"Python",
			"OpenCV",
			"Tkinter"
		]
	},
	{
		slug: "watch-walkie-talkie",
		name: "Watch Walkie Talkie",
		category: "Real-Time Communication",
		description: "Push-to-talk voice communication concept connecting smartwatches and phones for instant communication.",
		built: [
			"Push-to-talk",
			"Real-time audio streaming",
			"Cross-device pairing"
		],
		tech: [
			"Flutter",
			"Python",
			"Real-Time Audio Streaming",
			"Cross-Device Communication"
		],
		status: "Concept",
		filters: ["Flutter", "Python"]
	},
	{
		slug: "conversacore-ai",
		name: "ConversaCore AI",
		category: "AI / Conversational",
		description: "Multi-model conversational platform with dynamic model selection, persona-driven responses, and fallback systems.",
		built: [
			"Dynamic model selection",
			"Persona responses",
			"Fallback systems"
		],
		tech: [
			"Python",
			"Multi-Model AI",
			"Tkinter"
		],
		status: "Built",
		github: "https://github.com/andrewmkbuilds/ConversaCore-AI",
		filters: [
			"Python",
			"AI",
			"Tkinter"
		]
	},
	{
		slug: "arabica-ai-chat",
		name: "Arabica AI Chat",
		category: "AI / Multilingual",
		description: "Bilingual AI chat focused on English-Arabic conversation, translation, and context-aware responses.",
		built: [
			"Bilingual chat",
			"Translation",
			"Context-aware replies"
		],
		tech: [
			"Python",
			"Tkinter",
			"Translation API",
			"AI"
		],
		status: "Built",
		github: "https://github.com/andrewmkbuilds/Arabica-AI-Chat",
		filters: [
			"Python",
			"AI",
			"Tkinter"
		]
	},
	{
		slug: "neurotac-ai",
		name: "NeuroTac AI",
		category: "AI / Game",
		description: "An intelligent Tic Tac Toe engine that evaluates board states and selects optimal moves.",
		built: [
			"Board evaluation",
			"Optimal move search",
			"Game logic"
		],
		tech: [
			"Python",
			"AI Decision Logic",
			"Game Theory"
		],
		status: "Built",
		github: "https://github.com/andrewmkbuilds/NeuroTac-AI",
		filters: ["Python", "AI"]
	}
];
var allProjects = [...featuredProjects, ...ecosystemProjects];
function getProject(slug) {
	return allProjects.find((p) => p.slug === slug);
}
var projectFilters = [
	"All",
	"Python",
	"Flutter",
	"React",
	"AI",
	"Base44",
	"Lovable",
	"OpenCV",
	"Tkinter"
];
var quickStats = [
	{
		value: "15+",
		label: "Projects & Systems"
	},
	{
		value: "Age 9",
		label: "Started Building"
	},
	{
		value: "3",
		label: "Flagship Products"
	},
	{
		value: "Multiple",
		label: "STEM & Engineering Competitions"
	}
];
var buildingCategories = [
	{
		title: "AI",
		items: [
			"Generative AI",
			"AI APIs",
			"AI applications",
			"AI assistants",
			"AI integrations"
		]
	},
	{
		title: "Software",
		items: [
			"Python",
			"TypeScript",
			"JavaScript",
			"React",
			"Flutter",
			"Tkinter"
		]
	},
	{
		title: "Computer Vision",
		items: [
			"OpenCV",
			"MediaPipe",
			"Motion detection",
			"Gesture recognition"
		]
	},
	{
		title: "Robotics",
		items: [
			"Robotics",
			"Sensors",
			"Hardware integration",
			"Engineering competitions"
		]
	},
	{
		title: "Product",
		items: [
			"Product design",
			"Systems thinking",
			"Rapid prototyping",
			"Problem solving"
		]
	},
	{
		title: "Competition",
		items: [
			"Techfest",
			"FLL",
			"F1 in Schools / STEM Racing",
			"MUN",
			"Exhibitions"
		]
	}
];
var principles = [
	{
		title: "Systems Over Features",
		body: "I like building connected systems that solve a complete problem instead of isolated features."
	},
	{
		title: "Ship First, Improve Always",
		body: "A working product gives me something real to learn from. I build, test, iterate, and improve."
	},
	{
		title: "Real Problems First",
		body: "The best projects start with a problem worth solving."
	}
];
var timeline = [
	{
		year: "2022",
		title: "First Robotics Certification",
		meta: "Age 9 · Grade 4",
		body: ["Completed the Mbot@IHS robotics after-school programme and built and presented an original model at a school exhibition.", "This was the beginning of the building journey."]
	},
	{
		year: "2023",
		title: "Exploring Beyond Hardware",
		meta: "Age 10 · Grade 4-5",
		body: ["After robotics, the focus expanded toward software and discovering what could be built beyond physical hardware."]
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
			"2nd Place at Math Expo \"Math & Me\"",
			"Recognition through school exhibitions and events"
		]
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
			"Additional robotics certification"
		]
	},
	{
		year: "2025-2026",
		title: "From Projects to an Ecosystem",
		meta: "Age 13-14 · Grade 7",
		body: ["Started building a broader ecosystem of products and experiments.", "Also founded Horizon Motorsports and participated in STEM Racing / F1 in Schools."],
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
			"Multiple AI experiments"
		]
	},
	{
		year: "NOW",
		title: "Building What's Next",
		body: ["More ambitious products. More competitions. More experiments. More systems."]
	}
];
var achievementGroups = [{
	title: "STEM & Technology",
	kind: "tags",
	items: [
		"Techfest",
		"Data Science",
		"IoT",
		"Space Tech",
		"Coding",
		"Robotics",
		"FLL",
		"STEM Racing / F1 in Schools"
	]
}];
var competitionResults = [
	{
		place: "1st Place",
		detail: "Data Science",
		event: "Techfest",
		certKey: "techfest-data-science-1st"
	},
	{
		place: "2nd Place",
		detail: "IoT",
		event: "Techfest",
		certKey: "techfest-iot-2nd"
	},
	{
		place: "2nd Place",
		detail: "Space Tech",
		event: "Group Techfest",
		certKey: "techfest-space-tech-2nd"
	},
	{
		place: "Innovation Award",
		detail: "FLL UAE",
		event: "Dubai Regional",
		certKey: "fll-innovation"
	},
	{
		place: "2nd Place",
		detail: "Math Expo",
		event: "\"Math & Me\"",
		certKey: "math-expo"
	},
	{
		place: "3rd Place",
		detail: "Shot Put",
		event: "Annual Athletic Meet",
		certKey: "shot-put"
	}
];
var munResults = [
	{
		title: "IHSMUN 2025",
		detail: "FIA · Verbal Commendation",
		certKey: "mun-ihsmun-2025"
	},
	{
		title: "Novara MUN 2026",
		detail: "UNSC · Verbal Commendation"
	},
	{
		title: "IHS UNSummit 2026",
		detail: "FIA · Verbal Commendation + Best Resolution"
	}
];
var exhibitions = [
	"Robotics exhibitions",
	"School exhibitions",
	"TechFest",
	"STEM / engineering demonstrations",
	"Other project showcases"
];
var buildAreas = [
	{
		id: "ai-ml",
		title: "AI & Machine Learning",
		description: "AI-first applications and assistants built with modern models, APIs, and custom logic — from career tools to conversational systems.",
		icon: "BrainCircuit",
		details: [{
			label: "Focus",
			value: "Assistants · Agents · Model APIs"
		}, {
			label: "Projects",
			value: "Gradr · COGNOS · JARVIS"
		}],
		projects: [
			"gradr",
			"cognos",
			"jarvis"
		]
	},
	{
		id: "software",
		title: "Software Development",
		description: "Full applications built end to end: interface design, application logic, data models, and deployment of things that actually run.",
		icon: "AppWindow",
		details: [{
			label: "Focus",
			value: "Web apps · Tools · Platforms"
		}, {
			label: "Projects",
			value: "Stack Up · DevOS · TabZen"
		}],
		projects: [
			"stack-up",
			"devos",
			"tabzen"
		]
	},
	{
		id: "robotics",
		title: "Robotics & Engineering",
		description: "Competition robotics and engineering builds, from FLL and STEM Racing to hardware experiments and exhibition demonstrations.",
		icon: "Cpu",
		details: [{
			label: "Focus",
			value: "FLL · STEM Racing · Hardware"
		}, {
			label: "Work",
			value: "Competitions · Exhibitions"
		}],
		projects: ["horizon-motorsports"]
	},
	{
		id: "vision",
		title: "Computer Vision",
		description: "Experiments in perception: gesture control, camera systems, and interfaces that respond to the physical world.",
		icon: "ScanEye",
		details: [{
			label: "Focus",
			value: "Gesture · Tracking · Cameras"
		}, {
			label: "Projects",
			value: "GesturePlay · Security Camera System"
		}],
		projects: ["gestureplay", "security-camera-system"]
	},
	{
		id: "product",
		title: "Product Development",
		description: "Taking an idea from a rough concept through structure, interface, and iteration until it becomes a usable product.",
		icon: "Workflow",
		details: [{
			label: "Focus",
			value: "Concept → Interface → Ship"
		}, {
			label: "Projects",
			value: "TerraCart · ClientFlow OS"
		}],
		projects: ["terracart", "clientflow-os"]
	},
	{
		id: "data",
		title: "Data Science",
		description: "Working with data to find patterns, build dashboards, and turn scattered information into something understandable.",
		icon: "LineChart",
		details: [{
			label: "Focus",
			value: "Analysis · Dashboards · Automation"
		}, {
			label: "Interest",
			value: "Systems thinking"
		}],
		projects: ["gemlab"]
	}
];
var currentlyBuilding = [
	{
		name: "Gradr",
		status: "Building",
		note: "AI career accelerator."
	},
	{
		name: "TerraCart",
		status: "Developing",
		note: "Sustainable shopping assistant."
	},
	{
		name: "ClientFlow OS",
		status: "In Active Development",
		note: "Business operating system."
	},
	{
		name: "Horizon Motorsports",
		status: "Active",
		note: "UAE racing team."
	}
];
var GITHUB_URL = "https://github.com/andrewmkbuilds";
var LINKTREE_URL = "https://linktr.ee/andrewmkbuilds";
/** Public contact address shown on the contact page. */
var CONTACT_EMAIL = "buildwithandrewmk@gmail.com";
var socialLinks = [
	{
		id: "github",
		label: "GitHub",
		handle: "@andrewmkbuilds",
		url: "https://github.com/andrewmkbuilds",
		description: "Projects, experiments, and code.",
		cta: "View GitHub"
	},
	{
		id: "base44",
		label: "Base44",
		handle: "@andrewmkbuilds",
		url: "https://app.base44.com/@andrewmkbuilds",
		description: "Apps and products I've built with Base44.",
		cta: "View Base44"
	},
	{
		id: "lovable",
		label: "Lovable",
		handle: "@andrewbuilds",
		url: "https://lovable.dev/@andrewbuilds",
		description: "Web products and experiments built with Lovable.",
		cta: "View Lovable"
	},
	{
		id: "x",
		label: "X",
		handle: "@Andrew444884",
		url: "https://x.com/Andrew444884",
		description: "Thoughts, updates, and what I'm building.",
		cta: "View X"
	},
	{
		id: "instagram",
		label: "Instagram",
		handle: "@andrewmkbuilds",
		url: "https://www.instagram.com/andrewmkbuilds/",
		description: "Personal updates and things I'm working on.",
		cta: "View Instagram"
	},
	{
		id: "linktree",
		label: "All My Links",
		handle: "linktr.ee/andrewmkbuilds",
		url: "https://linktr.ee/andrewmkbuilds",
		description: "The central hub for every profile, project, and link of mine.",
		cta: "View All My Links"
	}
];
var socialIconMap = {
	github: Github,
	x: Twitter,
	instagram: Instagram,
	lovable: Heart,
	base44: Hexagon,
	linktree: Share2
};
/** Safe lookup — falls back to a generic mark for unknown ids. */
function getSocialIcon(id) {
	return socialIconMap[id] ?? Hexagon;
}
/** Compact social icon row with tooltips. All links open in a new tab. */
function SocialIcons({ ids, className }) {
	const links = ids ? ids.map((id) => socialLinks.find((s) => s.id === id)).filter(Boolean) : socialLinks;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex items-center gap-2", className),
			children: links.map((link) => {
				const Icon = getSocialIcon(link.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.url,
						target: "_blank",
						rel: "noopener noreferrer",
						"aria-label": `${link.label} profile (${link.handle})`,
						className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold focus-ring motion-reduce:hover:translate-y-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: link.label })] }, link.id);
			})
		})
	});
}
var andrewbuilds_logo_default = "/assets/andrewbuilds-logo-DtJESMmQ.png";
var navItems = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/projects",
		label: "Projects"
	},
	{
		href: "/blog",
		label: "Blog"
	},
	{
		href: "/profile",
		label: "Profile"
	},
	{
		href: "/resume",
		label: "Résumé"
	},
	{
		href: "/about",
		label: "About"
	},
	{
		href: "/journey",
		label: "Journey"
	},
	{
		href: "/achievements",
		label: "Achievements"
	},
	{
		href: "/contact",
		label: "Contact"
	}
];
function Header() {
	const location = useLocation$1();
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, {
		stiffness: 140,
		damping: 30,
		mass: .3
	});
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent bg-background/40 backdrop-blur-md"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container flex h-16 items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: "/",
					"aria-label": "Andrew Mathews — home",
					className: "flex items-center gap-2.5 transition-opacity hover:opacity-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: andrewbuilds_logo_default,
						alt: "",
						width: 34,
						height: 34,
						className: "h-[34px] w-[34px] rounded-md"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm font-semibold tracking-tight text-foreground",
						children: ["Andrew", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "Builds"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Main",
					className: "hidden lg:flex items-center gap-1",
					children: navItems.map((item) => {
						const active = location.pathname === item.href;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: item.href,
							"aria-current": active ? "page" : void 0,
							className: cn("relative rounded-full px-3.5 py-2 font-mono text-[13px] transition-colors hover:text-gold", active ? "text-primary" : "text-muted-foreground"),
							children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								layoutId: "nav-pill",
								transition: {
									type: "spring",
									stiffness: 380,
									damping: 32
								},
								className: "absolute inset-0 -z-10 rounded-full border border-primary/25 bg-primary/10",
								"aria-hidden": "true"
							}), item.label]
						}, item.href);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden lg:flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialIcons, {
						ids: [
							"github",
							"x",
							"instagram"
						],
						className: "gap-1.5 [&_a]:h-8 [&_a]:w-8 [&_a]:border-transparent [&_a]:bg-transparent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "font-mono transition-transform hover:scale-[1.03]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/projects",
							children: "View My Work"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open: isOpen,
					onOpenChange: setIsOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
						asChild: true,
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "min-h-11 min-w-11",
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "right",
						className: "w-[85vw] max-w-sm border-border bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Mobile",
							className: "mt-10 flex flex-col gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary",
									children: "Navigation"
								}),
								navItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: item.href,
										style: { animationDelay: `${index * 45}ms` },
										className: cn("animate-fade-in-up opacity-0 rounded-lg px-3 py-3 font-mono text-lg transition-colors hover:bg-secondary hover:text-gold", location.pathname === item.href ? "text-primary" : "text-muted-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-3 text-primary",
											children: "→"
										}), item.label]
									})
								}, item.href)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetClose, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/projects",
										className: "mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground transition-transform hover:scale-[1.02]",
										children: "View My Work"
									})
								})
							]
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": "true",
			style: { scaleX: progress },
			className: "absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-primary via-primary-glow to-primary/30"
		})]
	});
}
var links = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/projects",
		label: "Projects"
	},
	{
		href: "/blog",
		label: "Blog"
	},
	{
		href: "/about",
		label: "About"
	},
	{
		href: "/achievements",
		label: "Achievements"
	},
	{
		href: "/contact",
		label: "Contact"
	}
];
function Footer() {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-8 md:flex-row md:items-start md:justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: andrewbuilds_logo_default,
							alt: "AndrewBuilds logo",
							width: 40,
							height: 40,
							className: "h-10 w-10 rounded-md"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold text-foreground",
							children: "Andrew Mathews"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm text-muted-foreground",
						children: "Student · Developer · AI Builder"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Footer",
						className: "flex flex-wrap gap-x-6 gap-y-3",
						children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: link.href,
							className: "font-mono text-sm text-muted-foreground transition-colors hover:text-gold",
							children: link.label
						}, link.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Find me online"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialIcons, {})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 border-t border-border pt-6 font-mono text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "//"
					}),
					" Built by Andrew · ",
					currentYear
				]
			})]
		})
	});
}
/**
* Subtle desktop cursor companion: a small dot plus a ring that expands over
* interactive surfaces and shows "View" over project cards.
* Not rendered on touch/coarse pointers or with reduced motion enabled.
*/
function CustomCursor() {
	const reduce = useReducedMotion();
	const [enabled, setEnabled] = (0, import_react.useState)(false);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)("default");
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const ringX = useSpring(x, {
		stiffness: 320,
		damping: 30,
		mass: .4
	});
	const ringY = useSpring(y, {
		stiffness: 320,
		damping: 30,
		mass: .4
	});
	(0, import_react.useEffect)(() => {
		if (reduce) return;
		const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
		const apply = () => setEnabled(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [reduce]);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		document.documentElement.classList.add("cursor-none-desktop");
		const onMove = (e) => {
			x.set(e.clientX);
			y.set(e.clientY);
			setVisible(true);
			const target = e.target;
			const explicit = (target?.closest?.("[data-cursor]"))?.dataset["cursor"];
			if (explicit) {
				setState(explicit);
				return;
			}
			setState(target?.closest?.("a, button, [role='button'], input, textarea, select") ? "link" : "default");
		};
		const onLeave = () => setVisible(false);
		window.addEventListener("pointermove", onMove, { passive: true });
		document.addEventListener("pointerleave", onLeave);
		return () => {
			document.documentElement.classList.remove("cursor-none-desktop");
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerleave", onLeave);
		};
	}, [
		enabled,
		x,
		y
	]);
	if (!enabled) return null;
	const ringSize = state === "view" ? 64 : state === "link" ? 40 : 26;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": "true",
		className: "pointer-events-none fixed inset-0 z-[100]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "absolute left-0 top-0 rounded-full bg-gold",
			style: {
				x,
				y,
				width: 5,
				height: 5,
				translateX: "-50%",
				translateY: "-50%"
			},
			animate: {
				opacity: visible ? 1 : 0,
				scale: state === "default" ? 1 : .4
			},
			transition: { duration: .18 }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "absolute left-0 top-0 flex items-center justify-center rounded-full border border-gold/50 backdrop-blur-[1px]",
			style: {
				x: ringX,
				y: ringY,
				translateX: "-50%",
				translateY: "-50%"
			},
			animate: {
				width: ringSize,
				height: ringSize,
				opacity: visible ? 1 : 0,
				backgroundColor: state === "view" ? "color-mix(in oklab, var(--gold) 16%, transparent)" : "transparent"
			},
			transition: {
				type: "spring",
				stiffness: 340,
				damping: 28
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: state === "view" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				initial: {
					opacity: 0,
					scale: .7
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .7
				},
				transition: { duration: .15 },
				className: "font-mono text-[9px] uppercase tracking-[0.18em] text-gold",
				children: "View"
			}) })
		})]
	});
}
/** Fast, restrained page transition — never delays reading the content. */
function PageTransition({ children }) {
	const location = useLocation$1();
	if (useReducedMotion()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	}, location.pathname);
}
function Layout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomCursor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "flex-1 pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTransition, { children })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { munResults as C, socialLinks as D, quickStats as E, timeline as O, getSocialIcon as S, projectFilters as T, currentlyBuilding as _, Link$1 as a, featuredProjects as b, TooltipContent as c, achievementGroups as d, allProjects as f, competitionResults as g, buildingCategories as h, Layout as i, useLocation$1 as k, TooltipProvider as l, buildAreas as m, GITHUB_URL as n, SocialIcons as o, andrewbuilds_logo_default as p, LINKTREE_URL as r, Tooltip as s, CONTACT_EMAIL as t, TooltipTrigger as u, ecosystemProjects as v, principles as w, getProject as x, exhibitions as y };
