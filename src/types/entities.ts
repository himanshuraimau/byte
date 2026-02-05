/**
 * Entity Type Definitions
 */

export interface User {
  id: string;
  name: string;
  password?: string; // Optional when retrieving (never expose password)
  created_at: number; // Unix timestamp
}

export interface Day {
  id: string;
  date: string; // ISO 8601: YYYY-MM-DD
  user_id: string; // Foreign key to users table
  created_at: number; // Unix timestamp
}

export interface Task {
  id: string;
  day_id: string;
  title: string;
  progress: number; // 0-100
  completed: boolean;
  created_at: number;
  updated_at: number;
}

export interface Note {
  id: string;
  day_id: string;
  content: string;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: string;
  day_id: string;
  task_id: string | null; // Nullable for standalone sessions
  name: string;
  duration_minutes: number;
  started_at: number;
  ended_at: number | null; // Nullable until completed
  completed: boolean;
  created_at: number;
}

export type TimelineEntry =
  | { type: "task"; data: Task }
  | { type: "note"; data: Note }
  | { type: "session"; data: Session };

export type TemporalMode = "yesterday" | "today" | "tomorrow" | "custom";
