import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Fallback } from "./Fallback";

describe("Fallback", () => {
  it("explains WebGL is needed and links back to the hub", () => {
    render(<Fallback />);
    expect(screen.getByRole("heading", { name: /modern browser/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to portfolio/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
