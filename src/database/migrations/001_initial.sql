-- Initial Database Schema
-- Byte App

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Days table
CREATE TABLE IF NOT EXISTS days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,  -- ISO 8601: YYYY-MM-DD
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
  completed INTEGER NOT NULL DEFAULT 0,  -- Boolean: 0 or 1
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
  task_id INTEGER,  -- Nullable: standalone sessions allowed
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,  -- Nullable until completed
  completed INTEGER NOT NULL DEFAULT 0,  -- Boolean: 0 or 1
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_day_id ON tasks(day_id);
CREATE INDEX IF NOT EXISTS idx_notes_day_id ON notes(day_id);
CREATE INDEX IF NOT EXISTS idx_sessions_day_id ON sessions(day_id);
CREATE INDEX IF NOT EXISTS idx_sessions_task_id ON sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
