import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./page";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      registerTitle: "Create account",
      registerSubtitle: "Get started with Savourly",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      register: "Register",
      hasAccount: "Already have an account?",
      login: "Log in",
      registerError: "Registration failed. Please try again.",
      passwordMismatch: "Passwords do not match",
    };
    return translations[key] || key;
  },
}));

// Mock i18n routing
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock auth client
const { mockSignUp } = vi.hoisted(() => ({
  mockSignUp: vi.fn(),
}));
vi.mock("@/lib/auth-client", () => ({
  signUp: {
    email: mockSignUp,
  },
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form", () => {
    render(<RegisterPage />);

    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByText("Get started with Savourly")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    render(<RegisterPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("shows error message on failed registration", async () => {
    mockSignUp.mockResolvedValue({ error: { message: "Registration failed" } });

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Registration failed. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("shows link to login page", () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText("Log in");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
