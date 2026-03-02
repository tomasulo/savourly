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
  await addCookingLog(recipeId, session.user.id, cookedAt, rating, notes);
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
  await updateCookingLog(logId, session.user.id, cookedAt, rating, notes);
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
