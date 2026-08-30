/**
 * Data validation: only the specified projects may carry a Base44 or Lovable
 * platform badge. Run with `bun run scripts/validate-portfolio-data.ts`.
 */
import { ecosystemProjects, socialLinks, type Project } from "../src/data/portfolio";

const EXPECTED: Record<"base44" | "lovable", string[]> = {
  base44: ["Stack Up", "DevOS", "COGNOS", "TabZen", "AI for Students"],
  lovable: ["Gradr", "Home ServeAI"],
};

const errors: string[] = [];
const byName = new Map<string, Project>(ecosystemProjects.map((p) => [p.name, p]));

// 1. Every expected project exists and has the right platform.
for (const [platform, names] of Object.entries(EXPECTED) as [keyof typeof EXPECTED, string[]][]) {
  for (const name of names) {
    const project = byName.get(name);
    if (!project) {
      errors.push(`Missing project "${name}" (expected platform: ${platform}).`);
      continue;
    }
    if (project.platform !== platform) {
      errors.push(
        `"${name}" should have platform "${platform}" but has "${project.platform ?? "none"}".`,
      );
    }
  }
}

// 2. No other project may claim a platform badge.
const allowed = new Set(Object.values(EXPECTED).flat());
for (const project of ecosystemProjects) {
  if (project.platform && !allowed.has(project.name)) {
    errors.push(
      `"${project.name}" claims platform "${project.platform}" but is not in the approved list.`,
    );
  }
  if (project.platform && !["base44", "lovable"].includes(project.platform)) {
    errors.push(`"${project.name}" has unknown platform "${project.platform}".`);
  }
  // 3. The badge links to a real social profile, otherwise it renders nothing.
  if (project.platform && !socialLinks.some((s) => s.id === project.platform)) {
    errors.push(
      `"${project.name}" platform "${project.platform}" has no matching socialLinks entry, badge would not render.`,
    );
  }
}

// 4. Duplicate names would make the checks above ambiguous.
const seen = new Set<string>();
for (const project of ecosystemProjects) {
  if (seen.has(project.name)) errors.push(`Duplicate project name "${project.name}".`);
  seen.add(project.name);
}

if (errors.length > 0) {
  console.error("Portfolio data validation failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

const counts = Object.entries(EXPECTED)
  .map(([p, names]) => `${p}: ${names.length}`)
  .join(", ");
console.log(`Portfolio data OK — ${ecosystemProjects.length} projects, platform badges (${counts}).`);
