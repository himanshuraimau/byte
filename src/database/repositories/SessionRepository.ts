import * as SQLite from 'expo-sqlite';
import { Session } from '@/types/entities';

export class SessionRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create a new session
   */
  async create(
    dayId: number,
    name: string,
    durationMinutes: number,
    startedAt: number,
    taskId: number | null = null
  ): Promise<Session> {
    const result = await this.db.runAsync(
      'INSERT INTO sessions (day_id, task_id, name, duration_minutes, started_at) VALUES (?, ?, ?, ?, ?)',
      [dayId, taskId, name, durationMinutes, startedAt]
    );

    if (result.lastInsertRowId) {
      const session = await this.findById(result.lastInsertRowId);
      if (session) {
        return session;
      }
      throw new Error('Failed to retrieve created session');
    }

    throw new Error('Failed to create session');
  }

  /**
   * Find session by ID
   */
  async findById(id: number): Promise<Session | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      day_id: number;
      task_id: number | null;
      name: string;
      duration_minutes: number;
      started_at: number;
      ended_at: number | null;
      completed: number;
      created_at: number;
    }>('SELECT * FROM sessions WHERE id = ?', [id]);

    if (result) {
      return {
        id: result.id,
        day_id: result.day_id,
        task_id: result.task_id,
        name: result.name,
        duration_minutes: result.duration_minutes,
        started_at: result.started_at,
        ended_at: result.ended_at,
        completed: result.completed === 1,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Find all sessions for a specific day
   */
  async findByDayId(dayId: number): Promise<Session[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      day_id: number;
      task_id: number | null;
      name: string;
      duration_minutes: number;
      started_at: number;
      ended_at: number | null;
      completed: number;
      created_at: number;
    }>('SELECT * FROM sessions WHERE day_id = ? ORDER BY started_at ASC', [dayId]);

    return result.map((row) => ({
      id: row.id,
      day_id: row.day_id,
      task_id: row.task_id,
      name: row.name,
      duration_minutes: row.duration_minutes,
      started_at: row.started_at,
      ended_at: row.ended_at,
      completed: row.completed === 1,
      created_at: row.created_at,
    }));
  }

  /**
   * Find all sessions for a specific task
   */
  async findByTaskId(taskId: number): Promise<Session[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      day_id: number;
      task_id: number | null;
      name: string;
      duration_minutes: number;
      started_at: number;
      ended_at: number | null;
      completed: number;
      created_at: number;
    }>('SELECT * FROM sessions WHERE task_id = ? ORDER BY started_at ASC', [taskId]);

    return result.map((row) => ({
      id: row.id,
      day_id: row.day_id,
      task_id: row.task_id,
      name: row.name,
      duration_minutes: row.duration_minutes,
      started_at: row.started_at,
      ended_at: row.ended_at,
      completed: row.completed === 1,
      created_at: row.created_at,
    }));
  }

  /**
   * Complete a session (set ended_at and completed flag)
   */
  async complete(id: number, endedAt: number): Promise<Session> {
    await this.db.runAsync(
      'UPDATE sessions SET ended_at = ?, completed = 1 WHERE id = ?',
      [endedAt, id]
    );

    const session = await this.findById(id);
    if (!session) {
      throw new Error('Failed to retrieve completed session');
    }

    return session;
  }

  /**
   * Delete a session
   */
  async delete(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
  }
}
