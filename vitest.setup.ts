import "@testing-library/jest-dom";

// jsdom does not implement WebGL. The webgl-detection guard checks for
// `window.WebGLRenderingContext`; define a stub so tests can exercise the
// getContext() branch (they mock getContext directly).
if (typeof window !== "undefined" && !("WebGLRenderingContext" in window)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).WebGLRenderingContext = function () {};
}
