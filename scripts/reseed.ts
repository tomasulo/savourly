/**
 * One-off script: clears all recipes and reseeds from seed.ts
 * Local:      npx tsx scripts/reseed.ts
 * Production: TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npx tsx scripts/reseed.ts
 */
import { createClient } from "@libsql/client";
import { initializeSchema } from "../src/db/schema";
import { seedDatabase } from "../src/db/seed";

async function main() {
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL ?? "file:savourly.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await initializeSchema(db);

  // Clear all recipe data — CASCADE handles ingredients, instructions, cooking_logs, favorites
  await db.execute("DELETE FROM recipes");
  console.log("Cleared existing recipes.");

  await seedDatabase(db);
  console.log("Seeded 10 German recipes.");
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
