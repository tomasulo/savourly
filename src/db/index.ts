import { createClient, type Client } from "@libsql/client";
import { initializeSchema } from "./schema";
import { seedDatabase } from "./seed";

let _db: Client | null = null;

export async function getDb(): Promise<Client> {
  if (!_db) {
    _db = createClient({
      url: process.env.TURSO_DATABASE_URL || "file:savourly.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    await initializeSchema(_db);
    // Only seed in development — prevents runaway inserts on serverless cold starts
    if (process.env.NODE_ENV !== "production") {
      await seedDatabase(_db);
    }
  }
  return _db;
}
