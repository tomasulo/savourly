import { getDb } from "./index";
import type {
  Recipe,
  RecipeListItem,
  Ingredient,
  Instruction,
  RecipeWithDetails,
  CookingLog,
} from "@/lib/types";

export async function getRecipeWithDetails(id: number): Promise<RecipeWithDetails | null> {
  const db = await getDb();

  const recipeResult = await db.execute({
    sql: `SELECT id, user_id, title, description, cuisine, difficulty,
                 prep_time_minutes, cook_time_minutes, servings, image_url,
                 is_public, created_at, updated_at
          FROM recipes WHERE id = ?`,
    args: [id],
  });

  if (recipeResult.rows.length === 0) {
    return null;
  }

  const row = recipeResult.rows[0];
  const recipe: Recipe = {
    id: row[0] as number,
    user_id: row[1] as string,
    title: row[2] as string,
    description: row[3] as string | null,
    cuisine: row[4] as string | null,
    difficulty: row[5] as "easy" | "medium" | "hard",
    prep_time_minutes: row[6] as number | null,
    cook_time_minutes: row[7] as number | null,
    servings: row[8] as number,
    image_url: row[9] as string | null,
    is_public: row[10] as number,
    created_at: row[11] as string,
    updated_at: row[12] as string,
  };

  const ingredientsResult = await db.execute({
    sql: "SELECT id, recipe_id, name, amount, unit, order_index FROM ingredients WHERE recipe_id = ? ORDER BY order_index ASC",
    args: [id],
  });

  const ingredients: Ingredient[] = ingredientsResult.rows.map((r) => ({
    id: r[0] as number,
    recipe_id: r[1] as number,
    name: r[2] as string,
    amount: r[3] as number | null,
    unit: r[4] as string | null,
    order_index: r[5] as number,
  }));

  const instructionsResult = await db.execute({
    sql: "SELECT id, recipe_id, step_number, content FROM instructions WHERE recipe_id = ? ORDER BY step_number ASC",
    args: [id],
  });

  const instructions: Instruction[] = instructionsResult.rows.map((r) => ({
    id: r[0] as number,
    recipe_id: r[1] as number,
    step_number: r[2] as number,
    content: r[3] as string,
  }));

  return { ...recipe, ingredients, instructions };
}

export async function getCookingLogs(recipeId: number): Promise<CookingLog[]> {
  const db = await getDb();

  const result = await db.execute({
    sql: "SELECT id, recipe_id, user_id, cooked_at, rating, notes FROM cooking_logs WHERE recipe_id = ? ORDER BY cooked_at DESC",
    args: [recipeId],
  });

  return result.rows.map((row) => ({
    id: row[0] as number,
    recipe_id: row[1] as number,
    user_id: row[2] as string,
    cooked_at: row[3] as string,
    rating: row[4] as number | null,
    notes: row[5] as string | null,
  }));
}

export interface RecipeFilters {
  query?: string;
  cuisine?: string;
  difficulty?: string;
  userId?: string;
}

function mapRecipeListRow(row: ArrayLike<unknown>): RecipeListItem {
  return {
    id: row[0] as number,
    user_id: row[1] as string,
    title: row[2] as string,
    description: row[3] as string | null,
    cuisine: row[4] as string | null,
    difficulty: row[5] as "easy" | "medium" | "hard",
    prep_time_minutes: row[6] as number | null,
    cook_time_minutes: row[7] as number | null,
    servings: row[8] as number,
    image_url: row[9] as string | null,
    is_public: row[10] as number,
    created_at: row[11] as string,
    updated_at: row[12] as string,
    is_own: Boolean(row[13]),
    is_favorited: Boolean(row[14]),
  };
}

export async function getRecipes(filters?: RecipeFilters): Promise<RecipeListItem[]> {
  const db = await getDb();
  const userId = filters?.userId;

  let sql: string;
  const args: (string | number)[] = [];

  if (userId) {
    // Authenticated: show own recipes (incl. private) + favorited public recipes
    sql = `SELECT r.id, r.user_id, r.title, r.description, r.cuisine, r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  (CASE WHEN r.user_id = ? THEN 1 ELSE 0 END) AS is_own,
                  (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) AS is_favorited
           FROM recipes r
           LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = ?
           WHERE (r.user_id = ? OR (r.is_public = 1 AND f.id IS NOT NULL))`;
    args.push(userId, userId, userId);
  } else {
    // Guest: show all public recipes
    sql = `SELECT r.id, r.user_id, r.title, r.description, r.cuisine, r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  0 AS is_own, 0 AS is_favorited
           FROM recipes r
           WHERE r.is_public = 1`;
  }

  if (filters?.query) {
    sql += " AND r.title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.cuisine) {
    sql += " AND r.cuisine = ?";
    args.push(filters.cuisine);
  }

  if (filters?.difficulty) {
    sql += " AND r.difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows.map(mapRecipeListRow);
}

export async function getDiscoverRecipes(userId: string, filters?: Omit<RecipeFilters, "userId">): Promise<RecipeListItem[]> {
  const db = await getDb();
  const args: (string | number)[] = [userId, userId];

  let sql = `SELECT r.id, r.user_id, r.title, r.description, r.cuisine, r.difficulty,
                    r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                    r.is_public, r.created_at, r.updated_at,
                    0 AS is_own,
                    (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) AS is_favorited
             FROM recipes r
             LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = ?
             WHERE r.is_public = 1 AND r.user_id != ?`;

  if (filters?.query) {
    sql += " AND r.title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.cuisine) {
    sql += " AND r.cuisine = ?";
    args.push(filters.cuisine);
  }

  if (filters?.difficulty) {
    sql += " AND r.difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows.map(mapRecipeListRow);
}

export async function getAllCuisines(): Promise<string[]> {
  const db = await getDb();

  const result = await db.execute(
    "SELECT DISTINCT cuisine FROM recipes WHERE cuisine IS NOT NULL AND is_public = 1 ORDER BY cuisine ASC"
  );

  return result.rows.map((row) => row[0] as string);
}

export async function addFavorite(userId: string, recipeId: number): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "INSERT OR IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)",
    args: [userId, recipeId],
  });
}

export async function removeFavorite(userId: string, recipeId: number): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?",
    args: [userId, recipeId],
  });
}

export async function isFavorited(userId: string, recipeId: number): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: "SELECT 1 FROM favorites WHERE user_id = ? AND recipe_id = ?",
    args: [userId, recipeId],
  });
  return result.rows.length > 0;
}
