import Database from "better-sqlite3";
import path from "node:path";
import { initializeSchema } from "./schema";
import { seedDatabase } from "./seed";

const DB_PATH = path.join(process.cwd(), "savourly.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initializeSchema(_db);
    seedDatabase(_db);
  }
  return _db;
}
