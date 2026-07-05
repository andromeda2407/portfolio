import { describe, it, expect, afterEach, vi } from "vitest";
import { isWebGLAvailable } from "./webgl";

afterEach(() => vi.restoreAllMocks());

describe("isWebGLAvailable", () => {
  it("returns false when getContext yields no webgl context (jsdom default)", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    expect(isWebGLAvailable()).toBe(false);
  });

  it("returns true when a webgl context is available", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as unknown as RenderingContext
    );
    expect(isWebGLAvailable()).toBe(true);
  });
});
