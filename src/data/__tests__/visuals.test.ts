import { describe, expect, it } from "vitest";

import { projectsByTechnology } from "../visuals";
import type { Project } from "../portfolio";

/** Only the fields `projectsByTechnology` reads; the rest are not its input. */
function project(slug: string, record: Partial<Project>): Project {
  return {
    slug,
    name: slug,
    category: "AI",
    description: "",
    built: [],
    tech: [],
    status: "Live",
    filters: [],
    screenshot: `/projects/${slug}.webp`,
    ...record,
  };
}

const gradr = project("gradr", {
  tech: ["AI", "React"],
  filters: ["AI", "React", "Lovable"],
  stack: [{ group: "Interface", items: ["React", "TypeScript"] }],
});
const stackUp = project("stack-up", {
  tech: ["React"],
  stack: [{ group: "Interface", items: ["Charting"] }],
});

describe("projectsByTechnology", () => {
  it("indexes the technologies a record names in its tags and filters", () => {
    const index = projectsByTechnology([gradr, stackUp]);

    expect(index.get("react")?.map((entry) => entry.slug)).toEqual([
      "gradr",
      "stack-up",
    ]);
    expect(index.get("lovable")?.map((entry) => entry.slug)).toEqual(["gradr"]);
  });

  it("counts the technologies a record names only in its stack", () => {
    const index = projectsByTechnology([gradr, stackUp]);

    expect(index.get("typescript")?.map((entry) => entry.slug)).toEqual([
      "gradr",
    ]);
  });

  it("lists a project once per technology even when it names it twice", () => {
    const index = projectsByTechnology([gradr]);

    // React appears in tech, filters and the stack — one entry, not three.
    expect(index.get("react")).toHaveLength(1);
  });

  it("matches case-insensitively, so a skill label always finds its records", () => {
    const index = projectsByTechnology([
      project("cased", { tech: ["JavaScript"], filters: ["OpenCV"] }),
    ]);

    expect(index.get("javascript")).toHaveLength(1);
    expect(index.get("opencv")).toHaveLength(1);
    expect(index.get("TypeScript")).toBeUndefined();
  });
});
