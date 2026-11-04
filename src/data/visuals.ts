/**
 * Derived shapes for the site's visual components.
 *
 * Nothing in this file invents content. Every milestone, award, date, count
 * and figure is computed from the records the rest of the site already
 * publishes (`timeline`, `competitionResults`, `munResults`, `certificates`
 * and the project catalogue), so a content change in one place reaches the
 * timeline, the charts and the diagrams together.
 */
import {
  certificates,
  certificateDateLabel,
  certificateSortKey,
} from "./certificates";
import {
  competitionResults,
  munResults,
  timeline,
  type Project,
} from "./portfolio";

/* ── Chronology ─────────────────────────────────────────────────────────── */

export type MilestoneStatus = "complete" | "current" | "upcoming";

export interface JourneyMilestone {
  id: string;
  /** The year (or "NOW") as published in the timeline record. */
  label: string;
  title: string;
  meta?: string | undefined;
  body: string[];
  points?: string[] | undefined;
  status: MilestoneStatus;
}

/**
 * The journey timeline, straight from `timeline`. "NOW" is the current
 * chapter; every dated chapter before it is complete. No future chapter is
 * invented — a chapter only appears once there is a record for it.
 */
export const journeyMilestones: JourneyMilestone[] = timeline.map(
  (entry, index) => ({
    id: `journey-${index}`,
    label: entry.year,
    title: entry.title,
    meta: entry.meta,
    body: entry.body,
    points: entry.points,
    status: entry.year.toUpperCase() === "NOW" ? "current" : "complete",
  }),
);

export interface AwardEntry {
  id: string;
  /** Display date, from the certificate when one exists, else the record. */
  when: string;
  sortKey: number;
  /** The placing or recognition — the headline of the entry. */
  title: string;
  /** The discipline or committee it was awarded in. */
  detail?: string | undefined;
  /** The event or conference that issued it. */
  event: string;
  /** The organisation printed on the backing certificate, when there is one. */
  issuer?: string | undefined;
  kind: "competition" | "mun";
  /** Certificate id, when the result is backed by an original document. */
  certId?: string | undefined;
}

const certById = new Map(certificates.map((cert) => [cert.id, cert]));

/**
 * Results in chronological order. A competition or MUN entry borrows its date
 * from the certificate that backs it; an entry without a certificate falls
 * back to the year its title states (e.g. "Novara MUN 2026").
 */
export const awardTimeline: AwardEntry[] = [
  ...competitionResults.map((result, index) => {
    const cert = result.certKey ? certById.get(result.certKey) : undefined;
    return {
      id: `award-competition-${index}`,
      when: cert ? certificateDateLabel(cert) : "",
      sortKey: cert ? certificateSortKey(cert) : 0,
      title: result.place,
      detail: result.detail,
      event: result.event ?? "Competition",
      issuer: cert?.issuer,
      kind: "competition" as const,
      certId: result.certKey,
    };
  }),
  ...munResults.map((mun, index) => {
    const cert = mun.certKey ? certById.get(mun.certKey) : undefined;
    const year = Number(mun.title.match(/20\d{2}/)?.[0] ?? 0);
    return {
      id: `award-mun-${index}`,
      when: cert ? certificateDateLabel(cert) : year ? String(year) : "",
      sortKey: cert ? certificateSortKey(cert) : year * 10000,
      title: mun.title,
      detail: mun.detail,
      event: "Model United Nations",
      issuer: cert?.issuer,
      kind: "mun" as const,
      certId: mun.certKey,
    };
  }),
].sort((a, b) => a.sortKey - b.sortKey || a.title.localeCompare(b.title));

/* ── Measured data ──────────────────────────────────────────────────────── */

export interface Slice {
  label: string;
  value: number;
}

/** How many records name each technology, most-used first. */
export function technologyUsage(projects: Project[]): Slice[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.tech) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

/** How many records publish each status, in the wording the records use. */
export function statusMix(projects: Project[]): Slice[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
  }
  const order = [
    "Live",
    "Built",
    "Building",
    "In Active Development",
    "Developing",
    "Active",
    "Experiment",
    "Concept",
  ];
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort(
      (a, b) =>
        order.indexOf(a.label) - order.indexOf(b.label) ||
        b.value - a.value ||
        a.label.localeCompare(b.label),
    );
}

/**
 * Keep the largest slices and fold the rest into one "Other" slice, so a
 * long tail never turns a chart into a list.
 */
export function tailSlices(data: Slice[], limit: number): Slice[] {
  if (data.length <= limit) return data;
  const head = data.slice(0, limit);
  const rest = data.slice(limit).reduce((sum, slice) => sum + slice.value, 0);
  return rest > 0 ? [...head, { label: "Other", value: rest }] : head;
}

/** Certified documents by the category printed on them. */
export const certificateMix: Slice[] = (() => {
  const counts = new Map<string, number>();
  for (const cert of certificates) {
    counts.set(cert.category, (counts.get(cert.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
})();

/** Projects that publish a live URL — a real, countable fraction. */
export function liveCount(projects: Project[]): number {
  return projects.filter((project) => Boolean(project.live)).length;
}

/**
 * The builds that get a full-width showcase on `/projects`. The first three
 * are the flagships the owner names; Stack Up is the first application that
 * actually shipped. The rest of the catalogue keeps its card.
 */
export const spotlightSlugs = [
  "gradr",
  "scholara",
  "the-neonrush",
  "stack-up",
] as const;
