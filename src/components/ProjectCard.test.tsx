import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/projects";

const base: Project = {
  slug: "demo",
  name: "Demo Project",
  tagline: "Does a demo thing.",
  tech: ["Next.js", "TypeScript"],
  status: "coming-soon",
};

describe("ProjectCard", () => {
  it("renders name, tagline and tech tags", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Demo Project")).toBeInTheDocument();
    expect(screen.getByText("Does a demo thing.")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("shows a Coming soon state when not live", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it("shows Live and Code links when the project is live", () => {
    const live: Project = {
      ...base,
      status: "live",
      liveUrl: "https://example.com",
      codeUrl: "https://github.com/x/y",
    };
    render(<ProjectCard project={live} />);
    expect(screen.getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      "https://example.com"
    );
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      "https://github.com/x/y"
    );
  });
});
