"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { requireAuth } from "@/lib/auth-helpers";
import { addFavorite, removeFavorite, addCookingLog, updateCookingLog, deleteCookingLog } from "@/db/queries";
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
  const locale = await getLocale();
  revalidatePath(`/${locale}/recipes`);
  revalidatePath(`/${locale}/recipes/discover`);
}

export async function removeFavoriteAction(recipeId: number): Promise<void> {
  const session = await requireAuth();
  const userId = session.user.id;

  await removeFavorite(userId, recipeId);
  const locale = await getLocale();
  revalidatePath(`/${locale}/recipes`);
  revalidatePath(`/${locale}/recipes/discover`);
}

export async function addCookingLogAction(
  recipeId: number,
  cookedAt: string,
  rating: number | null,
  notes: string | null
): Promise<void> {
  const session = await requireAuth();
  const userId = session.user.id;

  // Validate inputs
  if (rating !== null && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
    throw new Error("Rating must be between 1 and 5");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cookedAt) || isNaN(Date.parse(cookedAt))) {
    throw new Error("Invalid date format");
  }
  const trimmedNotes = notes?.trim() ?? null;
  if (trimmedNotes && trimmedNotes.length > 1000) {
    throw new Error("Notes must be 1000 characters or fewer");
  }

  // Verify user can access the recipe (owns it or it's public)
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT is_public, user_id FROM recipes WHERE id = ?",
    args: [recipeId],
  });
  if (result.rows.length === 0) {
    throw new Error("Recipe not found");
  }
  const recipe = result.rows[0];
  if (!recipe.is_public && recipe.user_id !== userId) {
    throw new Error("Cannot log a cook on a private recipe you don't own");
  }

  await addCookingLog(recipeId, userId, cookedAt, rating, trimmedNotes);
  const locale = await getLocale();
  revalidatePath(`/${locale}/recipes/${recipeId}`);
  revalidatePath(`/${locale}/recipes`);
}

export async function updateCookingLogAction(
  logId: number,
  recipeId: number,
  cookedAt: string,
  rating: number | null,
  notes: string | null
): Promise<void> {
  const session = await requireAuth();

  // Validate inputs
  if (rating !== null && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
    throw new Error("Rating must be between 1 and 5");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cookedAt) || isNaN(Date.parse(cookedAt))) {
    throw new Error("Invalid date format");
  }
  const trimmedNotes = notes?.trim() ?? null;
  if (trimmedNotes && trimmedNotes.length > 1000) {
    throw new Error("Notes must be 1000 characters or fewer");
  }

  await updateCookingLog(logId, session.user.id, cookedAt, rating, trimmedNotes);
  const locale = await getLocale();
  revalidatePath(`/${locale}/recipes/${recipeId}`);
}

export async function deleteCookingLogAction(
  logId: number,
  recipeId: number
): Promise<void> {
  const session = await requireAuth();
  await deleteCookingLog(logId, session.user.id);
  const locale = await getLocale();
  revalidatePath(`/${locale}/recipes/${recipeId}`);
  revalidatePath(`/${locale}/recipes`);
}
