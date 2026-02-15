import { notFound } from "next/navigation";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-muted-foreground">
        Recipe #{id} — detail view coming in issue #3.
      </p>
    </main>
  );
}
