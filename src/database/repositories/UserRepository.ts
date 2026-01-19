import { User } from '@/types/entities';
import * as SQLite from 'expo-sqlite';

export class UserRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Create a new user
   */
  async create(name: string): Promise<User> {
    const result = await this.db.runAsync('INSERT INTO users (name) VALUES (?)', [name]);
    
    if (result.lastInsertRowId) {
      const user = await this.findById(result.lastInsertRowId);
      if (user) {
        return user;
      }
      throw new Error('Failed to retrieve created user');
    }
    
    throw new Error('Failed to create user');
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      name: string;
      created_at: number;
    }>('SELECT * FROM users WHERE id = ?', [id]);

    if (result) {
      return {
        id: result.id,
        name: result.name,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Get the first user (assuming single user app)
   */
  async getFirst(): Promise<User | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      name: string;
      created_at: number;
    }>('SELECT * FROM users ORDER BY id ASC LIMIT 1');

    if (result) {
      return {
        id: result.id,
        name: result.name,
        created_at: result.created_at,
      };
    }

    return null;
  }

  /**
   * Update user name
   */
  async update(id: number, name: string): Promise<User> {
    await this.db.runAsync('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    
    const user = await this.findById(id);
    if (user) {
      return user;
    }
    
    throw new Error('Failed to retrieve updated user');
  }

  /**
   * Check if any user exists
   */
  async exists(): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );
    
    return result ? result.count > 0 : false;
  }
}
