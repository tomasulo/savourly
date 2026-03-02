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
    sql: `SELECT r.id, r.user_id, r.title, r.description,
                 (SELECT GROUP_CONCAT(rt.tag) FROM recipe_tags rt WHERE rt.recipe_id = r.id) AS tags,
                 r.difficulty,
                 r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                 r.is_public, r.created_at, r.updated_at
          FROM recipes r WHERE r.id = ?`,
    args: [id],
  });

  if (recipeResult.rows.length === 0) {
    return null;
  }

  const row = recipeResult.rows[0];
  const tagsStr = row[4] as string | null;
  const recipe: Recipe = {
    id: row[0] as number,
    user_id: row[1] as string,
    title: row[2] as string,
    description: row[3] as string | null,
    tags: tagsStr ? tagsStr.split(",") : [],
    difficulty: row[5] as "easy" | "medium" | "hard",
    prep_time_minutes: row[6] as number | null,
    cook_time_minutes: row[7] as number | null,
    servings: row[8] as number,
    image_url: row[9] as string | null,
    is_public: row[10] as 0 | 1,
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
  tag?: string;
  difficulty?: string;
  userId?: string;
}

function mapRecipeListRow(row: ArrayLike<unknown>): RecipeListItem {
  const tagsStr = row[4] as string | null;
  return {
    id: row[0] as number,
    user_id: row[1] as string,
    title: row[2] as string,
    description: row[3] as string | null,
    tags: tagsStr ? tagsStr.split(",") : [],
    difficulty: row[5] as "easy" | "medium" | "hard",
    prep_time_minutes: row[6] as number | null,
    cook_time_minutes: row[7] as number | null,
    servings: row[8] as number,
    image_url: row[9] as string | null,
    is_public: row[10] as 0 | 1,
    created_at: row[11] as string,
    updated_at: row[12] as string,
    is_own: Boolean(row[13]),
    is_favorited: Boolean(row[14]),
    last_cooked_at: (row[15] as string | null) ?? null,
  };
}

const TAGS_SUBQUERY = "(SELECT GROUP_CONCAT(rt.tag) FROM recipe_tags rt WHERE rt.recipe_id = r.id)";
const LAST_COOKED_SUBQUERY = "(SELECT MAX(cl.cooked_at) FROM cooking_logs cl WHERE cl.recipe_id = r.id AND cl.user_id = ?)";

export async function getRecipes(filters?: RecipeFilters): Promise<RecipeListItem[]> {
  const db = await getDb();
  const userId = filters?.userId;

  let sql: string;
  const args: (string | number)[] = [];

  if (userId) {
    sql = `SELECT r.id, r.user_id, r.title, r.description,
                  ${TAGS_SUBQUERY} AS tags,
                  r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  (CASE WHEN r.user_id = ? THEN 1 ELSE 0 END) AS is_own,
                  (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) AS is_favorited,
                  ${LAST_COOKED_SUBQUERY} AS last_cooked_at
           FROM recipes r
           LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = ?
           WHERE (r.user_id = ? OR (r.is_public = 1 AND f.id IS NOT NULL))`;
    args.push(userId, userId, userId, userId);
  } else {
    sql = `SELECT r.id, r.user_id, r.title, r.description,
                  ${TAGS_SUBQUERY} AS tags,
                  r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  0 AS is_own, 0 AS is_favorited, NULL AS last_cooked_at
           FROM recipes r
           WHERE r.is_public = 1`;
  }

  if (filters?.query) {
    sql += " AND r.title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.tag) {
    sql += " AND EXISTS (SELECT 1 FROM recipe_tags rt2 WHERE rt2.recipe_id = r.id AND rt2.tag = ?)";
    args.push(filters.tag);
  }

  if (filters?.difficulty) {
    sql += " AND r.difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows.map(mapRecipeListRow);
}

export async function getMyRecipes(userId: string, filters?: Omit<RecipeFilters, "userId">): Promise<RecipeListItem[]> {
  const db = await getDb();
  const args: (string | number)[] = [userId, userId, userId, userId];

  let sql = `SELECT r.id, r.user_id, r.title, r.description,
                    ${TAGS_SUBQUERY} AS tags,
                    r.difficulty,
                    r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                    r.is_public, r.created_at, r.updated_at,
                    (CASE WHEN r.user_id = ? THEN 1 ELSE 0 END) AS is_own,
                    (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) AS is_favorited,
                    ${LAST_COOKED_SUBQUERY} AS last_cooked_at
             FROM recipes r
             LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = ?
             WHERE (r.user_id = ? OR (r.is_public = 1 AND f.id IS NOT NULL))`;

  if (filters?.query) {
    sql += " AND r.title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.tag) {
    sql += " AND EXISTS (SELECT 1 FROM recipe_tags rt2 WHERE rt2.recipe_id = r.id AND rt2.tag = ?)";
    args.push(filters.tag);
  }

  if (filters?.difficulty) {
    sql += " AND r.difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows.map(mapRecipeListRow);
}

export async function getDiscoverRecipes(userId: string | null, filters?: Omit<RecipeFilters, "userId">): Promise<RecipeListItem[]> {
  const db = await getDb();

  let sql: string;
  let args: (string | number)[];

  if (userId) {
    args = [userId, userId, userId];
    sql = `SELECT r.id, r.user_id, r.title, r.description,
                  ${TAGS_SUBQUERY} AS tags,
                  r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  0 AS is_own,
                  (CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END) AS is_favorited,
                  ${LAST_COOKED_SUBQUERY} AS last_cooked_at
           FROM recipes r
           LEFT JOIN favorites f ON f.recipe_id = r.id AND f.user_id = ?
           WHERE r.is_public = 1 AND r.user_id != ?`;
  } else {
    args = [];
    sql = `SELECT r.id, r.user_id, r.title, r.description,
                  ${TAGS_SUBQUERY} AS tags,
                  r.difficulty,
                  r.prep_time_minutes, r.cook_time_minutes, r.servings, r.image_url,
                  r.is_public, r.created_at, r.updated_at,
                  0 AS is_own,
                  0 AS is_favorited,
                  NULL AS last_cooked_at
           FROM recipes r
           WHERE r.is_public = 1`;
  }

  if (filters?.query) {
    sql += " AND r.title LIKE ?";
    args.push(`%${filters.query}%`);
  }

  if (filters?.tag) {
    sql += " AND EXISTS (SELECT 1 FROM recipe_tags rt2 WHERE rt2.recipe_id = r.id AND rt2.tag = ?)";
    args.push(filters.tag);
  }

  if (filters?.difficulty) {
    sql += " AND r.difficulty = ?";
    args.push(filters.difficulty);
  }

  sql += " ORDER BY r.created_at DESC";

  const result = await db.execute({ sql, args });
  return result.rows.map(mapRecipeListRow);
}

export async function getAllTags(): Promise<string[]> {
  const db = await getDb();

  const result = await db.execute(
    "SELECT DISTINCT tag FROM recipe_tags rt JOIN recipes r ON r.id = rt.recipe_id WHERE r.is_public = 1 ORDER BY tag ASC"
  );

  return result.rows.map((row) => row[0] as string);
}

export async function getUserTags(userId: string): Promise<string[]> {
  const db = await getDb();

  const result = await db.execute({
    sql: "SELECT DISTINCT tag FROM recipe_tags rt JOIN recipes r ON r.id = rt.recipe_id WHERE r.is_public = 1 OR r.user_id = ? ORDER BY tag ASC",
    args: [userId],
  });

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

export async function addCookingLog(
  recipeId: number,
  userId: string,
  cookedAt: string,
  rating: number | null,
  notes: string | null
): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "INSERT INTO cooking_logs (recipe_id, user_id, cooked_at, rating, notes) VALUES (?, ?, ?, ?, ?)",
    args: [recipeId, userId, cookedAt, rating, notes],
  });
}

export async function updateCookingLog(
  id: number,
  userId: string,
  cookedAt: string,
  rating: number | null,
  notes: string | null
): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "UPDATE cooking_logs SET cooked_at = ?, rating = ?, notes = ? WHERE id = ? AND user_id = ?",
    args: [cookedAt, rating, notes, id, userId],
  });
}

export async function deleteCookingLog(id: number, userId: string): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: "DELETE FROM cooking_logs WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}
