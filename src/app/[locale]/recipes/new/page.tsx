import { useTranslations } from "next-intl";
import RecipeForm from "./recipe-form";

export const metadata = {
  title: "New Recipe — Savourly",
};

export default function NewRecipePage() {
  const t = useTranslations("recipe");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("newRecipe")}</h1>
      <RecipeForm />
    </main>
  );
}
