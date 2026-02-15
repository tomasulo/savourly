import { getDb } from "./index";
import type {
  Recipe,
  Ingredient,
  Instruction,
  RecipeWithDetails,
  CookingLog,
} from "@/lib/types";

export function getRecipeWithDetails(id: number): RecipeWithDetails | null {
  const db = getDb();

  const recipe = db
    .prepare(
      `
      SELECT * FROM recipes WHERE id = ?
    `
    )
    .get(id) as Recipe | undefined;

  if (!recipe) {
    return null;
  }

  const ingredients = db
    .prepare(
      `
      SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY order_index ASC
    `
    )
    .all(id) as Ingredient[];

  const instructions = db
    .prepare(
      `
      SELECT * FROM instructions WHERE recipe_id = ? ORDER BY step_number ASC
    `
    )
    .all(id) as Instruction[];

  return {
    ...recipe,
    ingredients,
    instructions,
  };
}

export function getCookingLogs(recipeId: number): CookingLog[] {
  const db = getDb();

  return db
    .prepare(
      `
      SELECT * FROM cooking_logs WHERE recipe_id = ? ORDER BY cooked_at DESC
    `
    )
    .all(recipeId) as CookingLog[];
}
