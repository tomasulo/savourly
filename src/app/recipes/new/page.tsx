import RecipeForm from "./recipe-form";

export const metadata = {
  title: "New Recipe — Savourly",
};

export default function NewRecipePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Recipe</h1>
      <RecipeForm />
    </main>
  );
}
