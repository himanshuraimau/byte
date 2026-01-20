import { Day } from "@/types/entities";
import * as SQLite from "expo-sqlite";

export class DayRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create or get a day by date (ISO 8601: YYYY-MM-DD) for a specific user
   */
  async createOrGet(date: string, userId: number): Promise<Day> {
    // Try to get existing day first
    const existing = await this.findByDate(date, userId);
    if (existing) {
      return existing;
    }

    // Create new day
    const result = await this.db.runAsync(
      "INSERT INTO days (date, user_id) VALUES (?, ?)",
      [date, userId],
    );

    if (result.lastInsertRowId) {
      const day = await this.findById(result.lastInsertRowId);
      if (day) {
        return day;
      }
      throw new Error("Failed to retrieve created day");
    }

    throw new Error("Failed to create day");
  }

  /**
   * Find day by ID
   */
  async findById(id: number): Promise<Day | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      date: string;
      user_id: number;
      created_at: number;
    }>("SELECT * FROM days WHERE id = ?", [id]);

    if (result) {
      return {
        id: result.id,
        date: result.date,
        user_id: result.user_id,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Find day by date (ISO 8601: YYYY-MM-DD) for a specific user
   */
  async findByDate(date: string, userId: number): Promise<Day | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      date: string;
      user_id: number;
      created_at: number;
    }>("SELECT * FROM days WHERE date = ? AND user_id = ?", [date, userId]);

    if (result) {
      return {
        id: result.id,
        date: result.date,
        user_id: result.user_id,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Get all days with entries (has tasks, notes, or sessions) for a specific user
   */
  async findAllWithEntries(userId: number): Promise<Day[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      date: string;
      user_id: number;
      created_at: number;
    }>(
      `
      SELECT DISTINCT d.* FROM days d
      LEFT JOIN tasks t ON d.id = t.day_id
      LEFT JOIN notes n ON d.id = n.day_id
      LEFT JOIN sessions s ON d.id = s.day_id
      WHERE d.user_id = ? AND (t.id IS NOT NULL OR n.id IS NOT NULL OR s.id IS NOT NULL)
      ORDER BY d.date DESC
    `,
      [userId],
    );

    return result.map((row) => ({
      id: row.id,
      date: row.date,
      user_id: row.user_id,
      created_at: row.created_at,
    }));
  }

  /**
   * Delete a day (cascades to tasks, notes, sessions)
   */
  async delete(id: number): Promise<void> {
    await this.db.runAsync("DELETE FROM days WHERE id = ?", [id]);
  }
}
