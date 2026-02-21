import { createClient, type Client } from "@libsql/client";
import { initializeSchema } from "./schema";
import { seedDatabase } from "./seed";

let _dbPromise: Promise<Client> | null = null;

export function getDb(): Promise<Client> {
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const db = createClient({
        url: process.env.TURSO_DATABASE_URL || "file:savourly.db",
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      await db.execute("PRAGMA foreign_keys = ON");
      await initializeSchema(db);
      // Only seed in development — prevents runaway inserts on serverless cold starts
      if (process.env.NODE_ENV !== "production") {
        await seedDatabase(db);
      }
      return db;
    })();
  }
  return _dbPromise;
}
