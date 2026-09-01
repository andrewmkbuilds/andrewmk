import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CircleAlert, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { TechTag } from "@/components/ui/TechTag";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { allProjects } from "@/data/portfolio";

type TabId = "resume" | "interview" | "insights";

const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: "resume", label: "Resume analysis", hint: "Rubric-based scoring on a real bullet point" },
  { id: "interview", label: "Mock interview", hint: "Answer scoring across three criteria" },
  { id: "insights", label: "Career insights", hint: "Where scores move, and what to do next" },
];

/* ------------------------------------------------------------------ resume */

const RESUME_SAMPLES = [
  {
    id: "sample-a",
    label: "Sample A — student resume",
    bullet: "Worked on a finance app and helped improve the user experience for users.",
    score: 54,
    components: [
      { label: "Parseability", value: 92, note: "Clean single-column layout, no tables." },
      { label: "Section structure", value: 80, note: "Missing a dedicated Projects section." },
      { label: "Keyword coverage", value: 41, note: "6 of 14 target-role keywords present." },
      { label: "Impact language", value: 28, note: "No measurable outcome in this bullet." },
    ],
    findings: [
      {
        kind: "fail" as const,
        criterion: "Quantified outcome",
        detail: "\u201chelped improve\u201d has no number attached, so a reviewer cannot judge the size of the work.",
      },
      {
        kind: "fail" as const,
        criterion: "Ownership",
        detail: "\u201cWorked on\u201d hides what you personally built. Name the component you owned.",
      },
      {
        kind: "pass" as const,
        criterion: "Relevance",
        detail: "Domain matches the target role \u2014 keep the project, rewrite the line.",
      },
    ],
    rewrite:
      "Built the expense-capture flow for a personal finance app in React, cutting the time to log a transaction from ~30s to under 10s and lifting weekly logging retention.",
  },
  {
    id: "sample-b",
    label: "Sample B — after one rewrite pass",
    bullet:
      "Built the expense-capture flow for a personal finance app in React, cutting logging time to under 10s.",
    score: 81,
    components: [
      { label: "Parseability", value: 92, note: "Unchanged \u2014 formatting was never the problem." },
      { label: "Section structure", value: 88, note: "Projects section added with two entries." },
      { label: "Keyword coverage", value: 74, note: "11 of 14 target-role keywords present." },
      { label: "Impact language", value: 79, note: "Outcome is measurable and attributable." },
    ],
    findings: [
      {
        kind: "pass" as const,
        criterion: "Quantified outcome",
        detail: "\u201cunder 10s\u201d is checkable and specific.",
      },
      {
        kind: "pass" as const,
        criterion: "Ownership",
        detail: "\u201cBuilt\u201d plus a named surface makes the contribution clear.",
      },
      {
        kind: "warn" as const,
        criterion: "Keyword coverage",
        detail: "Still missing \u201cstate management\u201d and \u201ctesting\u201d from the job description.",
      },
    ],
    rewrite:
      "Add one line covering state management and testing \u2014 those two keywords are the remaining gap against this job description.",
  },
];

function ScoreRing({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="8" className="stroke-border" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-gold"
          strokeDasharray={circumference}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-display text-3xl text-foreground">{value}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          ATS score
        </span>
      </div>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
      <motion.span
        className="block h-full rounded-full bg-primary"
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

function FindingIcon({ kind }: { kind: "pass" | "warn" | "fail" }) {
  if (kind === "pass") {
    return <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />;
  }
  return (
    <CircleAlert
      aria-hidden="true"
      className={cn("mt-0.5 h-4 w-4 shrink-0", kind === "warn" ? "text-gold" : "text-destructive")}
    />
  );
}

function ResumeDemo() {
  const [sampleId, setSampleId] = useState(RESUME_SAMPLES[0]!.id);
  const sample = useMemo(
    () => RESUME_SAMPLES.find((s) => s.id === sampleId) ?? RESUME_SAMPLES[0]!,
    [sampleId],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a sample resume">
        {RESUME_SAMPLES.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === sample.id}
            onClick={() => setSampleId(option.id)}
            className={cn(
              "focus-ring rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              option.id === sample.id
                ? "border-gold/45 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/30 hover:text-gold",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Resume bullet
        </p>
        <p className="mt-3 border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-foreground md:text-base">
          {sample.bullet}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
        <div className="surface flex items-center justify-center rounded-2xl p-5">
          <ScoreRing key={sample.id} value={sample.score} />
        </div>
        <div className="surface space-y-4 rounded-2xl p-5 md:p-6">
          {sample.components.map((component) => (
            <div key={component.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">
                  {component.label}
                </span>
                <span className="font-mono text-xs text-gold">{component.value}</span>
              </div>
              <div className="mt-2">
                <Bar key={`${sample.id}-${component.label}`} value={component.value} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{component.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Rubric findings
        </p>
        <ul className="mt-4 space-y-3">
          {sample.findings.map((finding) => (
            <li key={finding.criterion} className="flex gap-3 text-sm text-muted-foreground">
              <FindingIcon kind={finding.kind} />
              <span>
                <span className="text-foreground">{finding.criterion}</span> — {finding.detail}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Suggested rewrite
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{sample.rewrite}</p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- interview */

const INTERVIEW_QUESTION =
  "Tell me about a technical decision you made that you would make differently today.";

const INTERVIEW_ANSWERS = [
  {
    id: "first-pass",
    label: "First attempt",
    text: "I picked a library for state and later regretted it because it was hard to work with, so I changed it and it was better after that.",
    overall: 47,
    criteria: [
      { label: "Structure", value: 40, note: "No situation → action → result shape." },
      { label: "Specificity", value: 35, note: "No library, no symptom, no measurement named." },
      { label: "Relevance", value: 66, note: "Answers the question, but stays abstract." },
    ],
    followUp: "Which library, and what specifically made it hard to work with?",
    coaching:
      "Anchor the story: name the decision, the moment it broke, what you replaced it with, and one observable difference afterwards.",
  },
  {
    id: "second-pass",
    label: "After the follow-up",
    text: "On my finance app I put every piece of state in one global store. Once budgets and streaks landed, a single expense edit re-rendered the whole dashboard. I split state into per-feature slices and kept only auth and settings global — the dashboard stopped stuttering on low-end phones, and I now default to local state until sharing is proven.",
    overall: 86,
    criteria: [
      { label: "Structure", value: 88, note: "Situation, break point, fix, outcome, lesson." },
      { label: "Specificity", value: 90, note: "Names the state model, the symptom and the change." },
      { label: "Relevance", value: 80, note: "Ends on a transferable rule, not just the story." },
    ],
    followUp: "How do you decide now when state is genuinely shared?",
    coaching:
      "Strong. Trim ten words from the setup so the outcome lands sooner, then reuse this shape for other decision questions.",
  },
];

function InterviewDemo() {
  const [answerId, setAnswerId] = useState(INTERVIEW_ANSWERS[0]!.id);
  const answer = useMemo(
    () => INTERVIEW_ANSWERS.find((a) => a.id === answerId) ?? INTERVIEW_ANSWERS[0]!,
    [answerId],
  );

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Interviewer</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground md:text-base">
          {INTERVIEW_QUESTION}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a sample answer">
        {INTERVIEW_ANSWERS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={option.id === answer.id}
            onClick={() => setAnswerId(option.id)}
            className={cn(
              "focus-ring rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              option.id === answer.id
                ? "border-gold/45 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:border-gold/30 hover:text-gold",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="surface rounded-2xl p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Candidate answer
        </p>
        <p className="mt-3 border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-foreground">
          {answer.text}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
        <div className="surface flex items-center justify-center rounded-2xl p-5">
          <ScoreRing key={answer.id} value={answer.overall} />
        </div>
        <div className="surface space-y-4 rounded-2xl p-5 md:p-6">
          {answer.criteria.map((criterion) => (
            <div key={criterion.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">
                  {criterion.label}
                </span>
                <span className="font-mono text-xs text-gold">{criterion.value}</span>
              </div>
              <div className="mt-2">
                <Bar key={`${answer.id}-${criterion.label}`} value={criterion.value} />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{criterion.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface rounded-2xl p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Follow-up question
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{answer.followUp}</p>
        </div>
        <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Coaching note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{answer.coaching}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- insights */

const TREND = [
  { week: "W1", resume: 54, interview: 47 },
  { week: "W2", resume: 61, interview: 52 },
  { week: "W3", resume: 66, interview: 63 },
  { week: "W4", resume: 72, interview: 61 },
  { week: "W5", resume: 78, interview: 74 },
  { week: "W6", resume: 81, interview: 86 },
];

const SKILL_GAPS = [
  { label: "State management", coverage: 34 },
  { label: "Testing", coverage: 41 },
  { label: "System design vocabulary", coverage: 58 },
  { label: "Data modelling", coverage: 72 },
];

const NEXT_ACTIONS = [
  "Add one project bullet covering testing — it is the lowest-coverage keyword against your saved roles.",
  "Run two behavioural sessions this week; structure scores rise fastest with repetition.",
  "Three applications have sat in \u201capplied\u201d for over 10 days — follow up before adding new ones.",
];

const PIPELINE = [
  { stage: "Saved", count: 14 },
  { stage: "Applied", count: 9 },
  { stage: "In process", count: 3 },
  { stage: "Interviewing", count: 1 },
];

function TrendChart() {
  const reduce = useReducedMotion();
  const width = 520;
  const height = 190;
  const pad = 18;
  const toPath = (key: "resume" | "interview") =>
    TREND.map((point, index) => {
      const x = pad + (index * (width - pad * 2)) / (TREND.length - 1);
      const y = height - pad - ((point[key] - 30) / 70) * (height - pad * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  return (
    <div className="surface rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Six-week score trend
        </p>
        <div className="flex gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-1.5 w-4 rounded-full bg-primary" /> Resume
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-1.5 w-4 rounded-full bg-gold" /> Interview
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label="Line chart showing resume scores rising from 54 to 81 and interview scores from 47 to 86 over six weeks"
      >
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={width - pad}
            y1={pad + (i * (height - pad * 2)) / 3}
            y2={pad + (i * (height - pad * 2)) / 3}
            className="stroke-border"
            strokeWidth="1"
          />
        ))}
        <motion.path
          d={toPath("resume")}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-primary"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={toPath("interview")}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-gold"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {TREND.map((point) => (
          <span key={point.week}>{point.week}</span>
        ))}
      </div>
    </div>
  );
}

function InsightsDemo() {
  return (
    <div className="space-y-5">
      <TrendChart />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="surface rounded-2xl p-5 md:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Skill-gap coverage
          </p>
          <div className="mt-4 space-y-4">
            {SKILL_GAPS.map((gap) => (
              <div key={gap.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-foreground">{gap.label}</span>
                  <span className="font-mono text-xs text-gold">{gap.coverage}%</span>
                </div>
                <div className="mt-2">
                  <Bar value={gap.coverage} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface rounded-2xl p-5 md:p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Application pipeline
          </p>
          <ul className="mt-4 space-y-3">
            {PIPELINE.map((row) => (
              <li key={row.stage} className="flex items-center justify-between gap-3">
                <span className="text-sm text-foreground">{row.stage}</span>
                <span className="font-mono text-sm text-gold">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Stages, sources and reminders live on the same profile as the scores above, so progress
            is measurable rather than a feeling.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] p-5 md:p-6">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Next actions
        </p>
        <ul className="mt-3 space-y-2.5">
          {NEXT_ACTIONS.map((action) => (
            <li key={action} className="flex gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold" />
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- page */

export default function GradrDemo() {
  const [tab, setTab] = useState<TabId>("resume");
  const gradr = allProjects.find((p) => p.slug === "gradr");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]!;

  return (
    <Layout>
      <article>
        <section className="relative overflow-hidden bg-hero-veil grain">
          <div className="absolute inset-0 bg-grid" aria-hidden="true" />
          <div className="container relative py-14 md:py-20">
            <Link
              to="/projects/gradr"
              className="focus-ring inline-flex items-center gap-2 rounded-md font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Gradr case study
            </Link>

            <div className="mt-7 max-w-3xl">
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                <span aria-hidden="true" className="hairline-gold inline-block w-8" />
                Interactive demo
              </p>
              <h1 className="text-display mt-4 text-4xl text-balance text-foreground md:text-5xl">
                Gradr in action
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                A walkthrough of how Gradr scores a resume, grades an interview answer and turns
                both into career insights. Every panel below runs on sample data so you can explore
                the feedback loop without an account.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {(gradr?.tech ?? ["AI", "React"]).map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {gradr?.live && (
                  <Button asChild className="cta-pop font-mono">
                    <a href={gradr.live} target="_blank" rel="noopener noreferrer">
                      Open the real app
                      <ArrowUpRight className="cta-arrow ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="font-mono">
                  <Link to="/projects/gradr">Read the case study</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="container py-14 md:py-20">
            <Reveal>
              <div
                role="tablist"
                aria-label="Gradr demo sections"
                className="flex flex-wrap gap-2 border-b border-border pb-4"
              >
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    id={`gradr-tab-${item.id}`}
                    role="tab"
                    type="button"
                    aria-selected={tab === item.id}
                    aria-controls={`gradr-panel-${item.id}`}
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "focus-ring rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                      tab === item.id
                        ? "border-gold/45 bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/30 hover:text-gold",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Reveal>

            <p className="mt-4 font-mono text-xs text-muted-foreground">{active.hint}</p>

            <div
              id={`gradr-panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`gradr-tab-${tab}`}
              className="mt-8"
            >
              {tab === "resume" && <ResumeDemo />}
              {tab === "interview" && <InterviewDemo />}
              {tab === "insights" && <InsightsDemo />}
            </div>

            <p className="mt-10 rounded-xl border border-border bg-card/40 p-4 text-xs leading-relaxed text-muted-foreground">
              Sample data, not a live account. The scores, findings and trends shown here illustrate
              how the rubric-based scoring and analytics behave inside Gradr — no real resumes or
              interview transcripts are used on this page.
            </p>
          </div>
        </section>
      </article>
    </Layout>
  );
}
