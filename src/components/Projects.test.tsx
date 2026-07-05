import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";

describe("Projects section", () => {
  it("renders a heading and all four project names", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText("GarageConnect")).toBeInTheDocument();
    expect(screen.getByText("Business Website")).toBeInTheDocument();
    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
    expect(screen.getByText("AI Assistant App")).toBeInTheDocument();
  });
});
