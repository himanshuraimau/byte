/**
 * Entity Type Definitions
 */

export interface User {
  id: number;
  name: string;
  created_at: number; // Unix timestamp
}

export interface Day {
  id: number;
  date: string; // ISO 8601: YYYY-MM-DD
  created_at: number; // Unix timestamp
}

export interface Task {
  id: number;
  day_id: number;
  title: string;
  progress: number; // 0-100
  completed: boolean;
  created_at: number;
  updated_at: number;
}

export interface Note {
  id: number;
  day_id: number;
  content: string;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: number;
  day_id: number;
  task_id: number | null; // Nullable for standalone sessions
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

export type TemporalMode = "yesterday" | "today" | "tomorrow";
