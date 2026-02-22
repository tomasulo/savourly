import { getDiscoverRecipes, getAllTags } from "@/db/queries";
import { RecipeCard } from "@/components/recipe-card";
import { BookmarkButton } from "@/components/bookmark-button";
import { SearchBar } from "../search-bar";
import { FilterChips } from "../filter-chips";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth-helpers";
import { Compass } from "lucide-react";

interface DiscoverPageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    difficulty?: string;
  }>;
}

export const metadata = {
  title: "Discover — Savourly",
};

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const session = await getSession();
  const userId = session?.user?.id ?? null;

  const t = await getTranslations("discover");
  const params = await searchParams;

  const recipes = await getDiscoverRecipes(userId, {
    query: params.q,
    tag: params.tag,
    difficulty: params.difficulty,
  });
  const allTags = await getAllTags();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <SearchBar />
          <FilterChips tags={allTags} />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {recipes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <Compass size={64} className="text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">{t("noRecipes")}</h2>
            <p className="text-muted-foreground max-w-md">{t("noRecipesDescription")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex flex-col gap-2">
                <RecipeCard recipe={recipe} currentUserId={userId} />
                {userId && (
                  <BookmarkButton recipeId={recipe.id} isFavorited={recipe.is_favorited} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
