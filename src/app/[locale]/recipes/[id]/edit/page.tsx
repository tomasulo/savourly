import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRecipeWithDetails } from "@/db/queries";
import { getSession } from "@/lib/auth-helpers";
import EditRecipeForm from "./edit-recipe-form";

interface EditRecipePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { locale, id } = await params;
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId)) {
    notFound();
  }

  // Check authentication
  const session = await getSession();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const recipe = await getRecipeWithDetails(recipeId);

  if (!recipe) {
    notFound();
  }

  // Check if user owns this recipe
  if (recipe.user_id !== session.user.id) {
    redirect(`/${locale}/recipes`);
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
