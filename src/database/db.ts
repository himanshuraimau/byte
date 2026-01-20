import { Config } from "@/constants/config";
import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const SCHEMA_VERSION = 2; // Increment this to reset database

/**
 * Initialize database and run migrations
 * Uses singleton pattern to ensure only one database instance
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  // Return existing instance if already initialized
  if (dbInstance) {
    return dbInstance;
  }

  // Return existing initialization promise if in progress
  if (initPromise) {
    return initPromise;
  }

  // Start new initialization
  initPromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync(Config.databaseName);

      // Check schema version
      try {
        const versionResult = await db.getFirstAsync<{ user_version: number }>(
          "PRAGMA user_version",
        );
        const currentVersion = versionResult?.user_version || 0;

        // If schema version doesn't match, drop all tables and recreate
        if (currentVersion !== SCHEMA_VERSION) {
          console.log(
            `Schema version mismatch (${currentVersion} vs ${SCHEMA_VERSION}), resetting database...`,
          );
          await db.execAsync(`
            DROP TABLE IF EXISTS sessions;
            DROP TABLE IF EXISTS notes;
            DROP TABLE IF EXISTS tasks;
            DROP TABLE IF EXISTS days;
            DROP TABLE IF EXISTS users;
          `);
        }
      } catch (error) {
        console.log("Error checking version, will recreate tables:", error);
      }

      // Execute migration SQL
      await db.execAsync(`
        -- Users table with authentication
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );

        -- Days table
        CREATE TABLE IF NOT EXISTS days (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          UNIQUE(user_id, date),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Tasks table
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          progress INTEGER NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
          completed INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        -- Notes table
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        -- Sessions table
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          task_id INTEGER,
          name TEXT NOT NULL,
          duration_minutes INTEGER NOT NULL,
          started_at INTEGER NOT NULL,
          ended_at INTEGER,
          completed INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
          FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_days_user_id ON days(user_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_day_id ON tasks(day_id);
        CREATE INDEX IF NOT EXISTS idx_notes_day_id ON notes(day_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_day_id ON sessions(day_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_task_id ON sessions(task_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
        
        -- Set schema version
        PRAGMA user_version = ${SCHEMA_VERSION};
      `);

      dbInstance = db;
      return db;
    } catch (error) {
      console.error("Database initialization error:", error);
      initPromise = null; // Reset on error so retry is possible
      throw error;
    }
  })();

  return initPromise;
}
