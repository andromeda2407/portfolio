import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";

describe("Contact", () => {
  it("renders email, GitHub and LinkedIn links", () => {
    render(<Contact />);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:munaib.pc@gmail.com"
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/andromeda2407"
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  });

  it("renders a contact form with name, email and message fields", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});
