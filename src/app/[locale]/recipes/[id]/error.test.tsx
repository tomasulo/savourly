import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./error";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      recipeErrorTitle: "Recipe error",
      recipeErrorDescription: "We couldn't load this recipe. Please try again or browse other recipes.",
      tryAgain: "Try again",
      backToRecipes: "Back to recipes",
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

describe("Recipe Error Boundary", () => {
  it("renders recipe-specific error message", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText("Recipe error")).toBeInTheDocument();
  });

  it("renders Try again button", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("renders Back to recipes link", () => {
    const mockReset = vi.fn();
    const mockError = new Error("Test error");

    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText("Back to recipes")).toBeInTheDocument();
  });
});
