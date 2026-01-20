import { User } from "@/types/entities";
import * as SQLite from "expo-sqlite";

export class UserRepository {
  private db: SQLite.SQLiteDatabase;

  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  /**
   * Register a new user
   */
  async register(name: string, password: string): Promise<User> {
    try {
      const result = await this.db.runAsync(
        "INSERT INTO users (name, password) VALUES (?, ?)",
        [name, password],
      );

      if (result.lastInsertRowId) {
        const user = await this.findById(result.lastInsertRowId);
        if (user) {
          return user;
        }
        throw new Error("Failed to retrieve created user");
      }

      throw new Error("Failed to create user");
    } catch (error: any) {
      if (error.message && error.message.includes("UNIQUE constraint")) {
        throw new Error("Username already exists");
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(name: string, password: string): Promise<User> {
    const result = await this.db.getFirstAsync<{
      id: number;
      name: string;
      password: string;
      created_at: number;
    }>("SELECT * FROM users WHERE name = ? AND password = ?", [name, password]);

    if (result) {
      return {
        id: result.id,
        name: result.name,
        created_at: result.created_at,
      };
    }

    throw new Error("Invalid username or password");
  }

  /**
   * Find user by ID (without password)
   */
  async findById(id: number): Promise<User | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      name: string;
      created_at: number;
    }>("SELECT id, name, created_at FROM users WHERE id = ?", [id]);

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
   * Find user by name (without password)
   */
  async findByName(name: string): Promise<User | null> {
    const result = await this.db.getFirstAsync<{
      id: number;
      name: string;
      created_at: number;
    }>("SELECT id, name, created_at FROM users WHERE name = ?", [name]);

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
   * Check if any user exists
   */
  async exists(): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM users",
    );

    return result ? result.count > 0 : false;
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, newPassword: string): Promise<void> {
    await this.db.runAsync("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      id,
    ]);
  }
}
