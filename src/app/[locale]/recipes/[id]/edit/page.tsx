import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRecipeWithDetails } from "@/db/queries";
import EditRecipeForm from "./edit-recipe-form";

interface EditRecipePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    notFound();
  }

  const recipe = getRecipeWithDetails(recipeId);

  if (!recipe) {
    notFound();
  }

  const t = await getTranslations("recipe");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{t("editRecipe")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{recipe.title}</p>
      </div>

      <EditRecipeForm recipe={recipe} />
    </div>
  );
}
