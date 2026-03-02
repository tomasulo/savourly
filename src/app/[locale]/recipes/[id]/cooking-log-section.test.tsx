import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookingLogSection } from "./cooking-log-section";
import type { CookingLog } from "@/lib/types";

const mockAddCookingLogAction = vi.fn();
const mockUpdateCookingLogAction = vi.fn();
const mockDeleteCookingLogAction = vi.fn();

vi.mock("./actions", () => ({
  addCookingLogAction: (...args: unknown[]) => mockAddCookingLogAction(...args),
  updateCookingLogAction: (...args: unknown[]) =>
    mockUpdateCookingLogAction(...args),
  deleteCookingLogAction: (...args: unknown[]) =>
    mockDeleteCookingLogAction(...args),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      recipe: {
        cookingLog: "Cooking Log",
        logACook: "Log a Cook",
        cookedOn: "Cooked on",
        rating: "Rating",
        notes: "Notes",
        timesCooked: "{count} times cooked",
        averageRating: "Avg. {rating}",
        confirmDeleteLog: "Delete this log entry?",
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
      },
      empty: {
        noCookingLogs: "No cooking logs yet",
        noCookingLogsDescription: "Log your first cook to start tracking",
      },
    };
    return (key: string, params?: Record<string, string | number>) => {
      let text = translations[namespace]?.[key] || key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    };
  },
  useLocale: () => "en",
}));

const mockLog: CookingLog = {
  id: 1,
  recipe_id: 1,
  user_id: "user-1",
  cooked_at: "2024-06-15T12:00:00Z",
  rating: 4,
  notes: "Turned out great!",
};

const mockLogNoRating: CookingLog = {
  id: 2,
  recipe_id: 1,
  user_id: "user-1",
  cooked_at: "2024-07-01T12:00:00Z",
  rating: null,
  notes: null,
};

describe("CookingLogSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the section title", () => {
    render(
      <CookingLogSection recipeId={1} cookingLogs={[]} currentUserId={null} />
    );
    expect(screen.getByText("Cooking Log")).toBeInTheDocument();
  });

  it("shows empty state when no logs", () => {
    render(
      <CookingLogSection recipeId={1} cookingLogs={[]} currentUserId={null} />
    );
    expect(screen.getByText("No cooking logs yet")).toBeInTheDocument();
  });

  it("renders cooking log entries", () => {
    render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLog]}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText("Turned out great!")).toBeInTheDocument();
  });

  it("shows times cooked and average rating", () => {
    render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLog]}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText("1 times cooked")).toBeInTheDocument();
    expect(screen.getByText("Avg. 4.0")).toBeInTheDocument();
  });

  it("shows Log a Cook button for authenticated users", () => {
    render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[]}
        currentUserId="user-1"
      />
    );
    expect(screen.getByText("Log a Cook")).toBeInTheDocument();
  });

  it("does not show Log a Cook button for unauthenticated users", () => {
    render(
      <CookingLogSection recipeId={1} cookingLogs={[]} currentUserId={null} />
    );
    expect(screen.queryByText("Log a Cook")).not.toBeInTheDocument();
  });

  it("opens add form when Log a Cook is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[]}
        currentUserId="user-1"
      />
    );
    await user.click(screen.getByText("Log a Cook"));
    expect(screen.getByText("Cooked on")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
  });

  it("shows edit and delete buttons for own logs", () => {
    const { container } = render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLog]}
        currentUserId="user-1"
      />
    );
    expect(container.querySelector(".lucide-pencil")).toBeInTheDocument();
    expect(container.querySelector(".lucide-trash-2")).toBeInTheDocument();
  });

  it("does not show edit/delete buttons for other users logs", () => {
    const { container } = render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLog]}
        currentUserId="user-2"
      />
    );
    expect(container.querySelector(".lucide-pencil")).not.toBeInTheDocument();
    expect(container.querySelector(".lucide-trash-2")).not.toBeInTheDocument();
  });

  it("shows delete confirmation when delete button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLog]}
        currentUserId="user-1"
      />
    );
    const deleteBtn = container.querySelector(
      ".lucide-trash-2"
    )!.parentElement!;
    await user.click(deleteBtn);
    expect(screen.getByText("Delete this log entry?")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders log without rating or notes", () => {
    render(
      <CookingLogSection
        recipeId={1}
        cookingLogs={[mockLogNoRating]}
        currentUserId="user-1"
      />
    );
    // Should render without crashing, showing just the date
    expect(screen.getByText("1 times cooked")).toBeInTheDocument();
  });
});
