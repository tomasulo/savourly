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

export interface RecipeFilters {
  query?: string;
  cuisine?: string;
  difficulty?: string;
}

export function getRecipes(filters?: RecipeFilters): Recipe[] {
  const db = getDb();

  let sql = "SELECT * FROM recipes WHERE 1=1";
  const params: (string | number)[] = [];

  if (filters?.query) {
    sql += " AND title LIKE ?";
    params.push(`%${filters.query}%`);
  }

  if (filters?.cuisine) {
    sql += " AND cuisine = ?";
    params.push(filters.cuisine);
  }

  if (filters?.difficulty) {
    sql += " AND difficulty = ?";
    params.push(filters.difficulty);
  }

  sql += " ORDER BY created_at DESC";

  return db.prepare(sql).all(...params) as Recipe[];
}

export function getAllCuisines(): string[] {
  const db = getDb();

  const results = db
    .prepare(
      `
      SELECT DISTINCT cuisine FROM recipes WHERE cuisine IS NOT NULL ORDER BY cuisine ASC
    `
    )
    .all() as Array<{ cuisine: string }>;

  return results.map((r) => r.cuisine);
}
