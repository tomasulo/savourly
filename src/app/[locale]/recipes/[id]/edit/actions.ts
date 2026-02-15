"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/index";

interface FormState {
  error?: string;
}

export async function updateRecipe(
  recipeId: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const cuisine = formData.get("cuisine") as string | null;
  const difficulty = formData.get("difficulty") as string | null;
  const prepTime = formData.get("prep_time_minutes") as string | null;
  const cookTime = formData.get("cook_time_minutes") as string | null;
  const servings = formData.get("servings") as string | null;
  const imageUrl = formData.get("image_url") as string | null;

  const ingredientNames = formData.getAll("ingredient_name") as string[];
  const ingredientAmounts = formData.getAll("ingredient_amount") as string[];
  const ingredientUnits = formData.getAll("ingredient_unit") as string[];

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

  const db = getDb();

  const updateRecipeStmt = db.prepare(`
    UPDATE recipes
    SET title = ?,
        description = ?,
        cuisine = ?,
        difficulty = ?,
        prep_time_minutes = ?,
        cook_time_minutes = ?,
        servings = ?,
        image_url = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `);

  const deleteIngredients = db.prepare(
    `DELETE FROM ingredients WHERE recipe_id = ?`
  );

  const deleteInstructions = db.prepare(
    `DELETE FROM instructions WHERE recipe_id = ?`
  );

  const insertIngredient = db.prepare(`
    INSERT INTO ingredients (recipe_id, name, amount, unit, order_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertInstruction = db.prepare(`
    INSERT INTO instructions (recipe_id, step_number, content)
    VALUES (?, ?, ?)
  `);

  const updateAll = db.transaction(() => {
    // Update recipe
    updateRecipeStmt.run(
      title.trim(),
      description?.trim() || null,
      cuisine?.trim() || null,
      difficulty || "medium",
      prepTime ? parseInt(prepTime, 10) : null,
      cookTime ? parseInt(cookTime, 10) : null,
      servings ? parseInt(servings, 10) : 4,
      imageUrl?.trim() || null,
      recipeId
    );

    // Delete existing ingredients and instructions
    deleteIngredients.run(recipeId);
    deleteInstructions.run(recipeId);

    // Insert new ingredients
    ingredientNames.forEach((name, index) => {
      if (name.trim().length === 0) return;
      const amount = ingredientAmounts[index]
        ? parseFloat(ingredientAmounts[index])
        : null;
      const unit = ingredientUnits[index]?.trim() || null;
      insertIngredient.run(recipeId, name.trim(), amount, unit, index);
    });

    // Insert new instructions
    instructionContents.forEach((content, index) => {
      if (content.trim().length === 0) return;
      insertInstruction.run(recipeId, index + 1, content.trim());
    });
  });

  updateAll();

  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  const db = getDb();

  const deleteStmt = db.prepare(`DELETE FROM recipes WHERE id = ?`);

  deleteStmt.run(recipeId);

  redirect("/recipes");
}
