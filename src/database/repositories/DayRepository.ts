import * as SQLite from 'expo-sqlite';
import { Day } from '@/types/entities';

export class DayRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create or get a day by date (ISO 8601: YYYY-MM-DD)
   */
  async createOrGet(date: string): Promise<Day> {
    // Try to get existing day first
    const existing = await this.findByDate(date);
    if (existing) {
      return existing;
    }

    // Create new day
    const result = await this.db.runAsync(
      'INSERT INTO days (date) VALUES (?)',
      [date]
    );

    if (result.lastInsertRowId) {
      const day = await this.findById(result.lastInsertRowId);
      if (day) {
        return day;
      }
      throw new Error('Failed to retrieve created day');
    }

    throw new Error('Failed to create day');
  }

  /**
   * Find day by ID
   */
  async findById(id: number): Promise<Day | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      date: string;
      created_at: number;
    }>('SELECT * FROM days WHERE id = ?', [id]);

    if (result) {
      return {
        id: result.id,
        date: result.date,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Find day by date (ISO 8601: YYYY-MM-DD)
   */
  async findByDate(date: string): Promise<Day | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      date: string;
      created_at: number;
    }>('SELECT * FROM days WHERE date = ?', [date]);

    if (result) {
      return {
        id: result.id,
        date: result.date,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Get all days with entries (has tasks, notes, or sessions)
   */
  async findAllWithEntries(): Promise<Day[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      date: string;
      created_at: number;
    }>(`
      SELECT DISTINCT d.* FROM days d
      LEFT JOIN tasks t ON d.id = t.day_id
      LEFT JOIN notes n ON d.id = n.day_id
      LEFT JOIN sessions s ON d.id = s.day_id
      WHERE t.id IS NOT NULL OR n.id IS NOT NULL OR s.id IS NOT NULL
      ORDER BY d.date DESC
    `);

    return result.map((row) => ({
      id: row.id,
      date: row.date,
      created_at: row.created_at,
    }));
  }

  /**
   * Delete a day (cascades to tasks, notes, sessions)
   */
  async delete(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM days WHERE id = ?', [id]);
  }
}
