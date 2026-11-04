import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./Badges";
import { projectsByTechnology } from "@/data/visuals";
import type { Project, SkillGroup } from "@/data/portfolio";

interface TechIndexProps {
  groups: SkillGroup[];
  projects: Project[];
  className?: string;
}

/**
 * Skills as a relationship, not a logo wall.
 *
 * Every capability is a chip and every chip is a button: selecting one opens
 * the projects whose record names that technology (its tags, filters or stack),
 * so nothing on this panel looks clickable and then does nothing. A capability
 * no shipped record names yet says so in the panel instead of claiming work.
 * No proficiency scores, no percentages — the evidence is the linked work.
 */
export function TechIndex({ groups, projects, className }: TechIndexProps) {
  const [group, setGroup] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);

  /** label (lower case) → the projects whose record names it. */
  const usage = useMemo(() => projectsByTechnology(projects), [projects]);

  const tabs = ["All", ...groups.map((entry) => entry.title)];
  const visibleGroups =
    group === "All" ? groups : groups.filter((entry) => entry.title === group);
  const entries = visibleGroups.flatMap((entry) =>
    entry.items.map((item) => ({ group: entry.title, item })),
  );

  const selectedProjects = selected
    ? (usage.get(selected.toLowerCase()) ?? [])
    : [];

  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]",
        className,
      )}
    >
      <div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter capabilities by area"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setGroup(tab)}
              aria-pressed={group === tab}
              className={cn(
                "focus-ring rounded-full border px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
                group === tab
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-6">
          {visibleGroups.map((entry) => (
            <div key={entry.title}>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">
                {entry.title}
              </p>
              <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                {entry.items.map((item) => {
                  const count = usage.get(item.toLowerCase())?.length ?? 0;
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        className="ti-chip focus-ring"
                        data-active={selected === item}
                        data-empty={count === 0 ? "true" : undefined}
                        aria-pressed={selected === item}
                        onClick={() =>
                          setSelected((current) =>
                            current === item ? null : item,
                          )
                        }
                      >
                        {item}
                        {count > 0 && <span className="ti-count">{count}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
          {selected
            ? `${selectedProjects.length} ${selectedProjects.length === 1 ? "project" : "projects"} name this`
            : `${entries.filter((entry) => (usage.get(entry.item.toLowerCase())?.length ?? 0) > 0).length} capabilities linked to shipped work · select one`}
        </p>
      </div>

      <div
        className="ti-panel rounded-[calc(var(--radius)+4px)] border border-border bg-card/70 p-6"
        aria-live="polite"
      >
        {selected ? (
          <>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">
              Used in
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-foreground">
              {selected}
            </h3>
            {selectedProjects.length === 0 && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                No shipped project record names this one yet — it is a
                capability, not a tool a project lists. The projects that are
                linked above each name the technologies they actually use.
              </p>
            )}
            <ul className="mt-5 grid list-none gap-3 p-0">
              {selectedProjects.map((project) => (
                <li key={project.slug}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="focus-ring group flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-background/60 p-3.5 transition-colors hover:border-gold/40"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">
                        {project.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {project.category}
                      </span>
                      <span className="mt-2 inline-block">
                        <StatusBadge status={project.status} size="sm" />
                      </span>
                    </span>
                    <ArrowRight
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-full min-h-[12rem] flex-col justify-center">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">
              Where it was used
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pick a technology to see the projects whose records name it.
              Skills are listed because the work uses them — there are no
              proficiency scores here, only builds you can open.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
