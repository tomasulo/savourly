"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-helpers";
import { addFavorite, removeFavorite } from "@/db/queries";
import { getDb } from "@/db/index";

export async function addFavoriteAction(recipeId: number): Promise<void> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Guard against self-bookmarking
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT user_id FROM recipes WHERE id = ?",
    args: [recipeId],
  });
  if (result.rows.length > 0 && result.rows[0][0] === userId) {
    return;
  }

  await addFavorite(userId, recipeId);
  revalidatePath("/recipes");
}

export async function removeFavoriteAction(recipeId: number): Promise<void> {
  const session = await requireAuth();
  const userId = session.user.id;

  await removeFavorite(userId, recipeId);
  revalidatePath("/recipes");
}
