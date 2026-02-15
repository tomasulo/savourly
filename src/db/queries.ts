import { getDb } from "./index";
import type {
  Recipe,
  Ingredient,
  Instruction,
  RecipeWithDetails,
  CookingLog,
} from "@/lib/types";

export async function getRecipeWithDetails(id: number): Promise<RecipeWithDetails | null> {
  const db = await getDb();

  const recipeResult = await db.execute({
    sql: "SELECT * FROM recipes WHERE id = ?",
    args: [id],
  });

  if (recipeResult.rows.length === 0) {
    return null;
  }

  // Map the row array to an object using column names
  const recipe: Recipe = {
    id: recipeResult.rows[0][0] as number,
    user_id: recipeResult.rows[0][1] as number,
    title: recipeResult.rows[0][2] as string,
    description: recipeResult.rows[0][3] as string | null,
    cuisine: recipeResult.rows[0][4] as string | null,
    difficulty: recipeResult.rows[0][5] as "easy" | "medium" | "hard",
    prep_time_minutes: recipeResult.rows[0][6] as number | null,
    cook_time_minutes: recipeResult.rows[0][7] as number | null,
    servings: recipeResult.rows[0][8] as number,
    image_url: recipeResult.rows[0][9] as string | null,
    created_at: recipeResult.rows[0][10] as string,
    updated_at: recipeResult.rows[0][11] as string,
  };

  const ingredientsResult = await db.execute({
    sql: "SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY order_index ASC",
    args: [id],
  });

  const ingredients: Ingredient[] = ingredientsResult.rows.map((row) => ({
    id: row[0] as number,
    recipe_id: row[1] as number,
    name: row[2] as string,
    amount: row[3] as number | null,
    unit: row[4] as string | null,
    order_index: row[5] as number,
  }));

  const instructionsResult = await db.execute({
    sql: "SELECT * FROM instructions WHERE recipe_id = ? ORDER BY step_number ASC",
    args: [id],
  });

  const instructions: Instruction[] = instructionsResult.rows.map((row) => ({
    id: row[0] as number,
    recipe_id: row[1] as number,
    step_number: row[2] as number,
    content: row[3] as string,
  }));

  return {
    ...recipe,
    ingredients,
    instructions,
  };
}

export async function getCookingLogs(recipeId: number): Promise<CookingLog[]> {
  const db = await getDb();

  const result = await db.execute({
    sql: "SELECT * FROM cooking_logs WHERE recipe_id = ? ORDER BY cooked_at DESC",
    args: [recipeId],
  });

  return result.rows.map((row) => ({
    id: row[0] as number,
    recipe_id: row[1] as number,
    user_id: row[2] as number,
    cooked_at: row[3] as string,
    rating: row[4] as number | null,
    notes: row[5] as string | null,
  }));
}

export interface RecipeFilters {
  query?: string;
  cuisine?: string;
  difficulty?: string;
}

export async function getRecipes(filters?: RecipeFilters): Promise<Recipe[]> {
  const db = await getDb();

  let sql = "SELECT * FROM recipes WHERE 1=1";
  const args: (string | number)[] = [];

  if (filters?.query) {
    sql += " AND title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.cuisine) {
    sql += " AND cuisine = ?";
    args.push(filters.cuisine);
  }

  if (filters?.difficulty) {
    sql += " AND difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY created_at DESC";

  const result = await db.execute({ sql, args });

  return result.rows.map((row) => ({
    id: row[0] as number,
    user_id: row[1] as number,
    title: row[2] as string,
    description: row[3] as string | null,
    cuisine: row[4] as string | null,
    difficulty: row[5] as "easy" | "medium" | "hard",
    prep_time_minutes: row[6] as number | null,
    cook_time_minutes: row[7] as number | null,
    servings: row[8] as number,
    image_url: row[9] as string | null,
    created_at: row[10] as string,
    updated_at: row[11] as string,
  }));
}

export async function getAllCuisines(): Promise<string[]> {
  const db = await getDb();

  const result = await db.execute(
    "SELECT DISTINCT cuisine FROM recipes WHERE cuisine IS NOT NULL ORDER BY cuisine ASC"
  );

  return result.rows.map((row) => row[0] as string);
}
