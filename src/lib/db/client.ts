import "server-only";
import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

const DEFAULT_DB_PATH = "data/app.db";

let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: process.env.SQLITE_PATH ?? DEFAULT_DB_PATH,
      driver: sqlite3.Database,
    });
  }
  if (!initPromise) {
    initPromise = initialize(db);
  }
  await initPromise;
  return db;
}

async function initialize(database: Database): Promise<void> {
  await database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS threads (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_threads_created_at
      ON threads(created_at);

    CREATE INDEX IF NOT EXISTS idx_messages_thread_created_at
      ON messages(thread_id, created_at);
  `);
}