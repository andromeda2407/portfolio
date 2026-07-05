import { describe, it, expect } from "vitest";
import { projects, type Project } from "./projects";

describe("projects", () => {
  it("has four showcase projects", () => {
    expect(projects).toHaveLength(4);
  });

  it("has exactly one featured (flagship) project and it is GarageConnect", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].slug).toBe("garageconnect");
  });

  it("every project has the required card fields", () => {
    projects.forEach((p: Project) => {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(Array.isArray(p.tech)).toBe(true);
      expect(p.tech.length).toBeGreaterThan(0);
      expect(["live", "coming-soon"]).toContain(p.status);
    });
  });

  it("live projects must have a live URL", () => {
    projects
      .filter((p) => p.status === "live")
      .forEach((p) => expect(p.liveUrl).toBeTruthy());
  });
});
