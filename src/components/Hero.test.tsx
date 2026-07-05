import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders name, tagline and both CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Munaib PC")).toBeInTheDocument();
    expect(screen.getByText(/apps, websites & platforms/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute(
      "href",
      "#projects"
    );
    expect(screen.getByRole("link", { name: /3d world/i })).toHaveAttribute(
      "href",
      "/world"
    );
  });
});
