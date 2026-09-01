INSERT INTO public.blog_posts (slug, title, excerpt, content, tags, published, published_at, reading_minutes)
VALUES (
  'building-gradr-ai-career-accelerator',
  'Building Gradr: making AI career feedback actually specific',
  'How Gradr went from a spreadsheet workaround to an AI career accelerator — rubric-based resume scoring, honest ATS analysis, cost control and privacy by design.',
  'Gradr started as a spreadsheet.

I was tracking applications in one tab, keeping three versions of my resume in another, and getting no useful feedback from either. The advice online was always the same: "tailor your resume", "practise your answers". Nobody said which line was weak, or why an application never got a reply. That gap is what Gradr is built to close.

## What it actually is

Gradr is an AI career accelerator for students, graduates and early-career candidates. It does four things that normally live in four different places:

- **Resume analysis** — upload a resume, get an ATS score, keyword coverage against a job description, and rewrite suggestions pinned to specific bullet points.
- **AI mock interviews** — role-specific sessions with follow-up questions, then a score on structure, specificity and relevance.
- **Job tracking** — every application in one board with stages, sources and reminders.
- **Analytics and a career plan** — the trend across sessions, where scores stall, and what to work on next.

The point is not the individual features. It is that analysing, practising and applying feed the same profile, so improvement is measurable rather than a feeling.

## The hard part: making AI feedback specific

My first version asked a model to "review this resume". It came back polite and useless — "consider quantifying your achievements" on a resume that already had numbers in it.

The fix was to stop treating the model as an advisor and start treating it as a grader. Every analysis now runs against a fixed rubric with structured output: each finding has to reference a real line, name the failing criterion, and propose a replacement. If it cannot point at something concrete, it does not get shown. That single constraint changed the product more than any model upgrade did.

## Scoring an ATS you cannot see

Real applicant tracking systems are closed boxes, and any tool claiming to replicate one is guessing. So Gradr scores only what is genuinely checkable: whether the document parses cleanly, whether the expected sections exist, how the keywords line up with the target role, and which formatting choices are known to break parsers. Each component is shown separately with its reasoning. An honest 78 with an explanation beats a confident 94 that means nothing.

## Keeping cost predictable

Resumes and interview transcripts are long, and long context is expensive. Requests are trimmed to the relevant sections, repeat analyses are cached, heavy work runs on demand instead of on every edit, and usage is metered against a credit balance. That keeps per-user cost bounded, which matters when the target audience is students.

## Privacy, because these are real documents

A resume is personal data. Everything is scoped per user with row-level security, files sit in access-controlled storage, and no document is reachable from another account. That constraint was designed in at the schema level rather than bolted on later.

## Where it is now

Gradr is in active development, with the six core modules working end to end and an MCP integration that exposes resumes, tracked jobs and reminders to assistants. Next up: sharper interview scoring, deeper job-match signals, and a cleaner weekly summary.

If you want the full breakdown — stack, screens, challenges and results — the [Gradr project page](/projects/gradr) goes into detail.
',
  ARRAY['Gradr','AI','Product','Case Study'],
  true, now(), 6
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
  tags = EXCLUDED.tags, published = true, published_at = COALESCE(public.blog_posts.published_at, now()),
  reading_minutes = EXCLUDED.reading_minutes, updated_at = now();