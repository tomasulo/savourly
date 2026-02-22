"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getDb } from "@/db/index";
import { requireAuth } from "@/lib/auth-helpers";

interface FormState {
  error?: string;
}

export async function updateRecipe(
  recipeId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Require authentication
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { error: "You must be logged in to edit a recipe." };
  }

  const db = await getDb();

  // Check if user owns this recipe
  const recipeResult = await db.execute({
    sql: "SELECT user_id FROM recipes WHERE id = ?",
    args: [recipeId],
  });

  if (recipeResult.rows.length === 0) {
    return { error: "Recipe not found." };
  }

  const recipeUserId = recipeResult.rows[0][0] as string;
  if (recipeUserId !== session.user.id) {
    return { error: "You can only edit your own recipes." };
  }

  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const difficulty = formData.get("difficulty") as string | null;
  const prepTime = formData.get("prep_time_minutes") as string | null;
  const cookTime = formData.get("cook_time_minutes") as string | null;
  const servings = formData.get("servings") as string | null;
  const imageUrl = formData.get("image_url") as string | null;
  const isPublicRaw = formData.get("is_public") as string | null;
  const isPublic = isPublicRaw === "1" ? 1 : 0;

  const ingredientNames = formData.getAll("ingredient_name") as string[];
  const ingredientAmounts = formData.getAll("ingredient_amount") as string[];
  const ingredientUnits = formData.getAll("ingredient_unit") as string[];

  const tags = formData.getAll("tags") as string[];
  const instructionContents = formData.getAll("instruction") as string[];

  // Server-side validation
  if (!title || title.trim().length === 0) {
    return { error: "Title is required." };
  }

  const validDifficulties = ["easy", "medium", "hard"];
  if (difficulty && !validDifficulties.includes(difficulty)) {
    return { error: "Invalid difficulty level." };
  }

  const validIngredients = ingredientNames.filter(
    (name) => name.trim().length > 0
  );
  if (validIngredients.length === 0) {
    return { error: "At least one ingredient is required." };
  }

  const validInstructions = instructionContents.filter(
    (content) => content.trim().length > 0
  );
  if (validInstructions.length === 0) {
    return { error: "At least one instruction step is required." };
  }

  // Prepare all statements for batch execution
  const statements: { sql: string; args: (string | number | null)[] }[] = [];

  // Update recipe
  statements.push({
    sql: `UPDATE recipes
          SET title = ?,
              description = ?,
              difficulty = ?,
              prep_time_minutes = ?,
              cook_time_minutes = ?,
              servings = ?,
              image_url = ?,
              is_public = ?,
              updated_at = datetime('now')
          WHERE id = ?`,
    args: [
      title.trim(),
      description?.trim() || null,
      difficulty || "medium",
      prepTime ? parseInt(prepTime, 10) : null,
      cookTime ? parseInt(cookTime, 10) : null,
      servings ? parseInt(servings, 10) : 4,
      imageUrl?.trim() || null,
      isPublic,
      recipeId,
    ],
  });

  // Delete existing ingredients, instructions, and tags
  statements.push({
    sql: "DELETE FROM ingredients WHERE recipe_id = ?",
    args: [recipeId],
  });

  statements.push({
    sql: "DELETE FROM instructions WHERE recipe_id = ?",
    args: [recipeId],
  });

  statements.push({
    sql: "DELETE FROM recipe_tags WHERE recipe_id = ?",
    args: [recipeId],
  });

  // Execute update and delete statements
  await db.batch(statements, "write");

  // Insert new ingredients
  const ingredientStatements: { sql: string; args: (string | number | null)[] }[] = [];
  for (let index = 0; index < ingredientNames.length; index++) {
    const name = ingredientNames[index];
    if (name.trim().length === 0) continue;
    const amount = ingredientAmounts[index]
      ? parseFloat(ingredientAmounts[index])
      : null;
    const unit = ingredientUnits[index]?.trim() || null;
    ingredientStatements.push({
      sql: `INSERT INTO ingredients (recipe_id, name, amount, unit, order_index)
            VALUES (?, ?, ?, ?, ?)`,
      args: [recipeId, name.trim(), amount, unit, index],
    });
  }

  // Insert new instructions
  const instructionStatements: { sql: string; args: (string | number)[] }[] = [];
  let stepNumber = 1;
  for (const content of instructionContents) {
    if (content.trim().length === 0) continue;
    instructionStatements.push({
      sql: `INSERT INTO instructions (recipe_id, step_number, content)
            VALUES (?, ?, ?)`,
      args: [recipeId, stepNumber, content.trim()],
    });
    stepNumber++;
  }

  // Prepare tag statements
  const tagStatements: { sql: string; args: (string | number)[] }[] = [];
  for (const tag of tags) {
    if (tag.trim().length === 0) continue;
    tagStatements.push({
      sql: `INSERT INTO recipe_tags (recipe_id, tag) VALUES (?, ?)`,
      args: [recipeId, tag.trim()],
    });
  }

  // Execute inserts in batch
  if (ingredientStatements.length > 0) {
    await db.batch(ingredientStatements, "write");
  }
  if (instructionStatements.length > 0) {
    await db.batch(instructionStatements, "write");
  }
  if (tagStatements.length > 0) {
    await db.batch(tagStatements, "write");
  }

  const locale = await getLocale();
  redirect(`/${locale}/recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  const locale = await getLocale();

  // Require authentication
  let session;
  try {
    session = await requireAuth();
  } catch {
    redirect(`/${locale}/login`);
  }

  const db = await getDb();

  // Check if user owns this recipe
  const recipeResult = await db.execute({
    sql: "SELECT user_id FROM recipes WHERE id = ?",
    args: [recipeId],
  });

  if (recipeResult.rows.length === 0) {
    redirect(`/${locale}/recipes`);
  }

  const recipeUserId = recipeResult.rows[0][0] as string;
  if (recipeUserId !== session.user.id) {
    redirect(`/${locale}/recipes`);
  }

  await db.execute({
    sql: "DELETE FROM recipes WHERE id = ?",
    args: [recipeId],
  });

  redirect(`/${locale}/recipes`);
}
