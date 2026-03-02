import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecipeDetail } from "./recipe-detail";
import type { RecipeWithDetails, CookingLog } from "@/lib/types";

// Mock next-intl
const mockLocale = vi.hoisted(() => ({ value: "en" }));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      recipe: {
        prepTime: "Prep time",
        cookTime: "Cook time",
        totalTime: "Total time",
        servings: "Servings",
        serving: "Serving",
        difficulty: "Difficulty",
        tags: "Tags",
        ingredients: "Ingredients",
        instructions: "Instructions",
        cookingLog: "Cooking Log",
        notFound: "No image",
      },
      difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
      time: { minutes: "min" },
      common: { edit: "Edit", save: "Save", unsave: "Unsave" },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  },
  useLocale: () => mockLocale.value,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("./actions", () => ({
  addFavoriteAction: vi.fn(),
  removeFavoriteAction: vi.fn(),
}));

vi.mock("./cooking-log-section", () => ({
  CookingLogSection: ({ cookingLogs }: { cookingLogs: CookingLog[] }) => (
    <div data-testid="cooking-log-section">
      {cookingLogs.map((log) => (
        <div key={log.id}>
          <span>{new Date(log.cooked_at).toLocaleDateString(mockLocale.value, { year: "numeric", month: "long", day: "numeric" })}</span>
          {log.rating !== null && (
            <div>{Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className="lucide-star" />
            ))}</div>
          )}
          {log.notes && <p>{log.notes}</p>}
        </div>
      ))}
    </div>
  ),
}));

const mockRecipe: RecipeWithDetails = {
  id: 1,
  user_id: "user-1",
  title: "Test Recipe",
  description: "A delicious test recipe",
  tags: ["dinner"],
  difficulty: "medium",
  prep_time_minutes: 10,
  cook_time_minutes: 20,
  servings: 4,
  image_url: null,
  is_public: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ingredients: [
    { id: 1, recipe_id: 1, name: "Flour", amount: 200, unit: "g", order_index: 1 },
  ],
  instructions: [
    { id: 1, recipe_id: 1, step_number: 1, content: "Mix ingredients" },
  ],
};

const cookingLog: CookingLog = {
  id: 1,
  recipe_id: 1,
  user_id: "user-1",
  cooked_at: "2024-06-15T12:00:00Z",
  rating: 4,
  notes: "Turned out great!",
};

describe("RecipeDetail", () => {
  it("renders recipe title", () => {
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[]}
        currentUserId={null}
        isFavorited={false}
      />
    );
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
  });

  it("renders cooking log section when logs exist", () => {
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[cookingLog]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    expect(screen.getByTestId("cooking-log-section")).toBeInTheDocument();
  });

  it("renders cooking log section even when no logs", () => {
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    expect(screen.getByTestId("cooking-log-section")).toBeInTheDocument();
  });

  it("formats cooking log date using en locale", () => {
    mockLocale.value = "en";
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[cookingLog]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    // en locale: "June 15, 2024"
    expect(screen.getByText(/June 15, 2024/)).toBeInTheDocument();
  });

  it("formats cooking log date using de locale", () => {
    mockLocale.value = "de";
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[cookingLog]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    // de locale: "15. Juni 2024"
    expect(screen.getByText(/15\. Juni 2024/)).toBeInTheDocument();
  });

  it("renders cooking log notes", () => {
    mockLocale.value = "en";
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[cookingLog]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    expect(screen.getByText("Turned out great!")).toBeInTheDocument();
  });

  it("renders star rating in cooking log", () => {
    mockLocale.value = "en";
    const { container } = render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[cookingLog]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    const stars = container.querySelectorAll(".lucide-star");
    expect(stars).toHaveLength(5);
  });

  it("shows edit button for recipe owner", () => {
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[]}
        currentUserId="user-1"
        isFavorited={false}
      />
    );
    expect(screen.getByRole("link", { name: "Edit" })).toBeInTheDocument();
  });

  it("does not show edit button for non-owner", () => {
    render(
      <RecipeDetail
        recipe={mockRecipe}
        cookingLogs={[]}
        currentUserId="user-2"
        isFavorited={false}
      />
    );
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
  });
});
