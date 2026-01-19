import * as SQLite from 'expo-sqlite';
import { Note } from '@/types/entities';

export class NoteRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create a new note
   */
  async create(dayId: number, content: string): Promise<Note> {
    const result = await this.db.runAsync(
      'INSERT INTO notes (day_id, content) VALUES (?, ?)',
      [dayId, content]
    );

    if (result.lastInsertRowId) {
      const note = await this.findById(result.lastInsertRowId);
      if (note) {
        return note;
      }
      throw new Error('Failed to retrieve created note');
    }

    throw new Error('Failed to create note');
  }

  /**
   * Find note by ID
   */
  async findById(id: number): Promise<Note | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      day_id: number;
      content: string;
      created_at: number;
      updated_at: number;
    }>('SELECT * FROM notes WHERE id = ?', [id]);

    if (result) {
      return {
        id: result.id,
        day_id: result.day_id,
        content: result.content,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };
    }

    return null;
  }

  /**
   * Find all notes for a specific day
   */
  async findByDayId(dayId: number): Promise<Note[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      day_id: number;
      content: string;
      created_at: number;
      updated_at: number;
    }>('SELECT * FROM notes WHERE day_id = ? ORDER BY created_at ASC', [dayId]);

    return result.map((row) => ({
      id: row.id,
      day_id: row.day_id,
      content: row.content,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  /**
   * Update note content
   */
  async update(id: number, content: string): Promise<Note> {
    await this.db.runAsync(
      'UPDATE notes SET content = ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?',
      [content, id]
    );

    const note = await this.findById(id);
    if (!note) {
      throw new Error('Failed to retrieve updated note');
    }

    return note;
  }

  /**
   * Delete a note
   */
  async delete(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  }
}
