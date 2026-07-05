import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WorldPage from "./page";

describe("World page (stub)", () => {
  it("shows a coming-soon message and a link back home", () => {
    render(<WorldPage />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back/i })).toHaveAttribute("href", "/");
  });
});
