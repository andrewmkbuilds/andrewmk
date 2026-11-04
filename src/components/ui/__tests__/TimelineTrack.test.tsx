import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { TimelineTrack, type TimelineStop } from "../TimelineTrack";

const stops: TimelineStop[] = [
  {
    id: "chapter-one",
    label: "2024",
    title: "Started building",
    meta: "Dubai",
    body: ["The lead paragraph", "A longer detail"],
    points: ["A published fact"],
    status: "complete",
    action: { label: "View certificate", onClick: () => {} },
  },
  {
    id: "chapter-two",
    label: "NOW",
    title: "Current chapter",
    body: ["Only a paragraph"],
    status: "current",
  },
];

describe("TimelineTrack", () => {
  it("always shows the year, title, meta and first paragraph", () => {
    render(<TimelineTrack stops={stops} label="Journey" />);

    expect(screen.getByText("2024")).toBeTruthy();
    expect(screen.getByText("Started building")).toBeTruthy();
    expect(screen.getByText("Dubai")).toBeTruthy();
    expect(screen.getByText("The lead paragraph")).toBeTruthy();
  });

  it("unfolds the remaining detail behind a disclosure button", () => {
    render(<TimelineTrack stops={stops} label="Journey" />);

    const toggle = screen.getByRole("button", {
      name: "Show details: Started building",
    });
    const panel = document.getElementById(
      toggle.getAttribute("aria-controls") ?? "",
    );

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel?.getAttribute("data-open")).toBe("false");
    // The lead paragraph is never hidden behind the disclosure.
    expect(panel?.textContent).not.toContain("The lead paragraph");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(panel?.getAttribute("data-open")).toBe("true");
    expect(panel?.textContent).toContain("A longer detail");
    expect(panel?.textContent).toContain("A published fact");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(panel?.getAttribute("data-open")).toBe("false");
  });

  it("keeps the proof action outside the disclosure and fires it", () => {
    const onClick = vi.fn();
    render(
      <TimelineTrack
        stops={[
          { ...stops[0]!, action: { label: "View certificate", onClick } },
        ]}
        label="Awards"
      />,
    );

    const action = screen.getByRole("button", { name: /View certificate/ });
    const panel = document.getElementById(
      screen
        .getByRole("button", { name: "Show details: Started building" })
        .getAttribute("aria-controls") ?? "",
    );
    expect(panel?.contains(action)).toBe(false);

    fireEvent.click(action);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders no disclosure button when a stop has nothing to unfold", () => {
    render(<TimelineTrack stops={[stops[1]!]} label="Journey" />);

    expect(screen.queryByRole("button", { name: /details:/ })).toBeNull();
    expect(screen.getByText("Only a paragraph")).toBeTruthy();
  });
});
