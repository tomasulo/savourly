import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      loginTitle: "Welcome back",
      loginSubtitle: "Sign in to your account",
      email: "Email",
      password: "Password",
      login: "Log in",
      noAccount: "Don't have an account?",
      register: "Register",
      loginError: "Invalid email or password",
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
const { mockSignIn } = vi.hoisted(() => ({
  mockSignIn: vi.fn(),
}));
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    email: mockSignIn,
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("shows error message on failed login", async () => {
    mockSignIn.mockResolvedValue({ error: { message: "Invalid credentials" } });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Log in" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("shows link to register page", () => {
    render(<LoginPage />);

    const registerLink = screen.getByText("Register");
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
