import * as SQLite from 'expo-sqlite';
import { Task } from '@/types/entities';

export class TaskRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create a new task
   */
  async create(dayId: number, title: string, progress: number = 0): Promise<Task> {
    const result = await this.db.runAsync(
      'INSERT INTO tasks (day_id, title, progress) VALUES (?, ?, ?)',
      [dayId, title, progress]
    );

    if (result.lastInsertRowId) {
      const task = await this.findById(result.lastInsertRowId);
      if (task) {
        return task;
      }
      throw new Error('Failed to retrieve created task');
    }

    throw new Error('Failed to create task');
  }

  /**
   * Find task by ID
   */
  async findById(id: number): Promise<Task | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      day_id: number;
      title: string;
      progress: number;
      completed: number;
      created_at: number;
      updated_at: number;
    }>('SELECT * FROM tasks WHERE id = ?', [id]);

    if (result) {
      return {
        id: result.id,
        day_id: result.day_id,
        title: result.title,
        progress: result.progress,
        completed: result.completed === 1,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };
    }

    return null;
  }

  /**
   * Find all tasks for a specific day
   */
  async findByDayId(dayId: number): Promise<Task[]> {
    const result = await this.db.getAllAsync<{
      id: number;
      day_id: number;
      title: string;
      progress: number;
      completed: number;
      created_at: number;
      updated_at: number;
    }>('SELECT * FROM tasks WHERE day_id = ? ORDER BY created_at ASC', [dayId]);

    return result.map((row) => ({
      id: row.id,
      day_id: row.day_id,
      title: row.title,
      progress: row.progress,
      completed: row.completed === 1,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  /**
   * Update task
   */
  async update(id: number, updates: Partial<Pick<Task, 'title' | 'progress' | 'completed'>>): Promise<Task> {
    const updatesList: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      updatesList.push('title = ?');
      values.push(updates.title);
    }
    if (updates.progress !== undefined) {
      updatesList.push('progress = ?');
      values.push(updates.progress);
    }
    if (updates.completed !== undefined) {
      updatesList.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }

    if (updatesList.length === 0) {
      const task = await this.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    }

    updatesList.push('updated_at = strftime(\'%s\', \'now\')');
    values.push(id);

    await this.db.runAsync(
      `UPDATE tasks SET ${updatesList.join(', ')} WHERE id = ?`,
      values
    );

    const task = await this.findById(id);
    if (!task) {
      throw new Error('Failed to retrieve updated task');
    }

    return task;
  }

  /**
   * Delete a task
   */
  async delete(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }
}
