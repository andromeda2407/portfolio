import { describe, it, expect } from "vitest";
import { skillGroups } from "./skills";

describe("skillGroups", () => {
  it("has at least three categories", () => {
    expect(skillGroups.length).toBeGreaterThanOrEqual(3);
  });

  it("every group has a label and non-empty items", () => {
    skillGroups.forEach((g) => {
      expect(g.label).toBeTruthy();
      expect(g.items.length).toBeGreaterThan(0);
    });
  });
});
