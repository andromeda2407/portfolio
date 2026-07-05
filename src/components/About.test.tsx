import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { profile } from "@/data/profile";

describe("About", () => {
  it("renders the about heading and blurb", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText(profile.blurb)).toBeInTheDocument();
  });
});
