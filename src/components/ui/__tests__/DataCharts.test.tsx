import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { BarChart, DonutChart, Meter } from "../DataCharts";

const bars = [
  { label: "AI", value: 10 },
  { label: "React", value: 5 },
];

describe("BarChart", () => {
  it("writes every label and value out as text", () => {
    render(<BarChart data={bars} title="Technologies named" unit="projects" />);

    expect(screen.getByText("Technologies named")).toBeTruthy();
    const rows = document.querySelectorAll(".chart-bar");
    expect(rows).toHaveLength(2);
    expect(rows[0]?.textContent).toContain("AI");
    expect(rows[0]?.textContent).toContain("10 projects");
    expect(rows[1]?.textContent).toContain("React");
    expect(rows[1]?.textContent).toContain("5 projects");
  });

  it("scales each bar against the largest value", () => {
    render(<BarChart data={bars} title="Technologies named" />);

    const fills = document.querySelectorAll<HTMLElement>(".chart-bar-fill");
    expect(fills[0]?.style.getPropertyValue("--bar").trim()).toBe("1");
    expect(fills[1]?.style.getPropertyValue("--bar").trim()).toBe("0.5");
  });
});

describe("DonutChart", () => {
  const slices = [
    { label: "Live", value: 4 },
    { label: "Building", value: 3 },
    { label: "Concept", value: 2 },
  ];

  it("draws one slice per entry and totals them in the centre", () => {
    render(<DonutChart data={slices} title="Where the work stands" />);

    expect(document.querySelectorAll("circle.chart-slice")).toHaveLength(3);
    expect(document.querySelector(".chart-center-value")?.textContent).toBe(
      "9",
    );
    expect(document.querySelector(".chart-center-label")?.textContent).toBe(
      "records",
    );
  });

  it("lists every slice with its value in the legend", () => {
    render(<DonutChart data={slices} title="Where the work stands" />);

    const rows = document.querySelectorAll(".chart-legend-row");
    expect(rows).toHaveLength(3);
    expect(rows[0]?.textContent).toContain("Live");
    expect(rows[0]?.textContent).toContain("4");
  });

  it("updates the centre readout while a slice is hovered", () => {
    render(<DonutChart data={slices} title="Where the work stands" />);

    const rows = document.querySelectorAll(".chart-legend-row");
    fireEvent.mouseEnter(rows[1]!);

    expect(document.querySelector(".chart-center-value")?.textContent).toBe(
      "3",
    );
    expect(document.querySelector(".chart-center-label")?.textContent).toBe(
      "Building",
    );
    // The hovered slice stays lit while its neighbours dim.
    expect(document.querySelectorAll(".chart-slice--dim")).toHaveLength(2);

    fireEvent.mouseLeave(rows[1]!);
    expect(document.querySelector(".chart-center-value")?.textContent).toBe(
      "9",
    );
  });
});

describe("Meter", () => {
  it("prints the fraction and fills the track by its ratio", () => {
    render(
      <Meter value={12} total={23} label="Publishing a live URL" note="Note" />,
    );

    const meter = screen
      .getByText("Publishing a live URL")
      .closest(".meter") as HTMLElement;
    expect(within(meter).getByText("12 / 23")).toBeTruthy();
    expect(within(meter).getByText("Note")).toBeTruthy();

    const fill = meter.querySelector<HTMLElement>(".meter-fill");
    expect(Number(fill?.style.getPropertyValue("--p"))).toBeCloseTo(12 / 23);
  });

  it("never divides by zero for an empty total", () => {
    render(<Meter value={0} total={0} label="Nothing yet" />);

    const fill = document.querySelector<HTMLElement>(".meter-fill");
    expect(Number(fill?.style.getPropertyValue("--p"))).toBe(0);
  });
});
