import { notFound } from "next/navigation";
import { getRecipeWithDetails, getCookingLogs } from "@/db/queries";
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
  const recipe = getRecipeWithDetails(recipeId);

  if (!recipe) {
    notFound();
  }

  const cookingLogs = getCookingLogs(recipeId);

  return <RecipeDetail recipe={recipe} cookingLogs={cookingLogs} />;
}
