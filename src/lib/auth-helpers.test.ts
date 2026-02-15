import { describe, it, expect, vi } from "vitest";
import { getSession, requireAuth } from "./auth-helpers";

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("auth-helpers", () => {
  describe("getSession", () => {
    it("should return session when available", async () => {
      const { auth } = await import("@/lib/auth");
      const mockSession = {
        user: { id: "1", email: "test@example.com", name: "Test User" },
      };
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const session = await getSession();
      expect(session).toEqual(mockSession);
    });
  });

  describe("requireAuth", () => {
    it("should return session when user is authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      const mockSession = {
        user: { id: "1", email: "test@example.com", name: "Test User" },
      };
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const session = await requireAuth();
      expect(session).toEqual(mockSession);
    });

    it("should throw error when user is not authenticated", async () => {
      const { auth } = await import("@/lib/auth");
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("Unauthorized");
    });
  });
});
