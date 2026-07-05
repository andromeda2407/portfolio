import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillsGrid } from "./SkillsGrid";

describe("SkillsGrid", () => {
  it("renders each category label", () => {
    render(<SkillsGrid />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("AI / LLM")).toBeInTheDocument();
  });
});
