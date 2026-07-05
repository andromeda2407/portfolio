import { describe, it, expect } from "vitest";
import { profile } from "./profile";

describe("profile", () => {
  it("has core identity fields", () => {
    expect(profile.name).toBe("Munaib PC");
    expect(profile.email).toBe("munaib.pc@gmail.com");
  });

  it("has GitHub and LinkedIn URLs", () => {
    expect(profile.github).toContain("github.com/andromeda2407");
    expect(profile.linkedin).toContain("linkedin.com/in/munaib-pc");
  });
});
