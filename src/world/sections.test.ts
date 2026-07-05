import { describe, it, expect } from "vitest";
import { worldSections, getSection, sectionSummary } from "./sections";

describe("world sections", () => {
  it("has the four beacon sections", () => {
    expect(worldSections.map((s) => s.id).sort()).toEqual([
      "career",
      "contact",
      "projects",
      "skills",
    ]);
  });

  it("each section has a label and a 3D position", () => {
    worldSections.forEach((s) => {
      expect(s.label).toBeTruthy();
      expect(s.position).toHaveLength(3);
    });
  });

  it("getSection resolves a section by id", () => {
    expect(getSection("projects")?.label).toBe("Projects");
    expect(getSection("skills")?.label).toBe("Skills");
  });

  it("sectionSummary maps each beacon to real data", () => {
    expect(sectionSummary("projects")).toMatch(/project/i);
    expect(sectionSummary("skills")).toMatch(/skill/i);
    expect(sectionSummary("contact")).toContain("@");
    expect(sectionSummary("career")).toBeTruthy();
  });
});
