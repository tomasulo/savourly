import { notFound } from "next/navigation";
import { getRecipeWithDetails, getCookingLogs, isFavorited } from "@/db/queries";
import { getSession } from "@/lib/auth-helpers";
import { RecipeDetail } from "./recipe-detail";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const recipeId = Number(id);
  const [recipe, session] = await Promise.all([
    getRecipeWithDetails(recipeId),
    getSession(),
  ]);

  if (!recipe) {
    notFound();
  }

  // Private recipes are only visible to their owner
  if (!recipe.is_public && session?.user?.id !== recipe.user_id) {
    notFound();
  }

  const currentUserId = session?.user?.id ?? null;

  const [cookingLogs, favorited] = await Promise.all([
    getCookingLogs(recipeId),
    currentUserId
      ? isFavorited(currentUserId, recipeId)
      : Promise.resolve(false),
  ]);

  return (
    <RecipeDetail
      recipe={recipe}
      cookingLogs={cookingLogs}
      currentUserId={currentUserId}
      isFavorited={favorited}
    />
  );
}
