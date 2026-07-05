import { describe, it, expect, afterEach, vi } from "vitest";
import { prefersReducedMotion } from "./motion";

afterEach(() => vi.restoreAllMocks());

describe("prefersReducedMotion", () => {
  it("is false when the media query does not match", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(prefersReducedMotion()).toBe(false);
  });

  it("is true when the reduced-motion media query matches", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
    expect(prefersReducedMotion()).toBe(true);
  });
});
