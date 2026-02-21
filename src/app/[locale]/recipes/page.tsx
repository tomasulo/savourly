import { getMyRecipes, getAllCuisines } from "@/db/queries";
import { RecipeCard } from "@/components/recipe-card";
import { SearchBar } from "./search-bar";
import { FilterChips } from "./filter-chips";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { UtensilsCrossed } from "lucide-react";
import { getSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

interface RecipesPageProps {
  searchParams: Promise<{
    q?: string;
    cuisine?: string;
    difficulty?: string;
  }>;
  params: Promise<{ locale: string }>;
}

export const metadata = {
  title: "My Recipes — Savourly",
};

export default async function RecipesPage({ searchParams, params }: RecipesPageProps) {
  const { locale } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("recipe");
  const tEmpty = await getTranslations("empty");
  const tNav = await getTranslations("nav");

  const resolvedParams = await searchParams;
  const userId = session.user.id;

  const filters = {
    query: resolvedParams.q,
    cuisine: resolvedParams.cuisine,
    difficulty: resolvedParams.difficulty,
  };

  const recipes = await getMyRecipes(userId, filters);
  const allCuisines = await getAllCuisines();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">{t("recipes")}</h1>
            <Link href="/recipes/new">
              <Button size="lg">{tNav("addRecipe")}</Button>
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Filter Chips */}
          <FilterChips cuisines={allCuisines} />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {recipes.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <UtensilsCrossed size={64} className="text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">
              {tEmpty("noRecipes")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              {tEmpty("noRecipesDescription")}
            </p>
            <Link href="/recipes/new">
              <Button size="lg">{tNav("addRecipe")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentUserId={userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
