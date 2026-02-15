import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./error";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      somethingWentWrong: "Something went wrong",
      errorDescription: "We encountered an unexpected error. Please try again or return home.",
      tryAgain: "Try again",
      goHome: "Go home",
      errorId: "Error ID",
    };
    return translations[key] || key;
  },
}));

// Mock Link component
vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Error Boundary", () => {
  it("renders error message", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders Try again button", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("renders Go home link", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText("Go home")).toBeInTheDocument();
  });
});
