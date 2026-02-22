"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getDb } from "@/db/index";
import { requireAuth } from "@/lib/auth-helpers";

interface FormState {
  error?: string;
}

export async function createRecipe(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Require authentication
  let session;
  try {
    session = await requireAuth();
  } catch {
    return { error: "You must be logged in to create a recipe." };
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

  const db = await getDb();

  // Insert recipe with user_id from session
  const recipeResult = await db.execute({
    sql: `INSERT INTO recipes (user_id, title, description, difficulty, prep_time_minutes, cook_time_minutes, servings, image_url, is_public)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      session.user.id,
      title.trim(),
      description?.trim() || null,
      difficulty || "medium",
      prepTime ? parseInt(prepTime, 10) : null,
      cookTime ? parseInt(cookTime, 10) : null,
      servings ? parseInt(servings, 10) : 4,
      imageUrl?.trim() || null,
      isPublic,
    ],
  });

  const recipeId = recipeResult.lastInsertRowid;

  // Prepare ingredient statements
  const ingredientStatements: { sql: string; args: (string | number | bigint | null)[] }[] = [];
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
      args: [recipeId as bigint | number, name.trim(), amount, unit, index],
    });
  }

  // Prepare instruction statements
  const instructionStatements: { sql: string; args: (string | number | bigint)[] }[] = [];
  let stepNumber = 1;
  for (const content of instructionContents) {
    if (content.trim().length === 0) continue;
    instructionStatements.push({
      sql: `INSERT INTO instructions (recipe_id, step_number, content)
            VALUES (?, ?, ?)`,
      args: [recipeId as bigint | number, stepNumber, content.trim()],
    });
    stepNumber++;
  }

  // Prepare tag statements
  const tagStatements: { sql: string; args: (string | number | bigint)[] }[] = [];
  for (const tag of tags) {
    if (tag.trim().length === 0) continue;
    tagStatements.push({
      sql: `INSERT INTO recipe_tags (recipe_id, tag) VALUES (?, ?)`,
      args: [recipeId as bigint | number, tag.trim()],
    });
  }

  // Execute all statements in batch
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
