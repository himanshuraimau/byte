import { User } from "@/types/entities";
import { authAPI } from "@/services/api";

export class UserRepository {
  /**
   * Register a new user
   */
  async register(name: string, password: string): Promise<User> {
    try {
      const response = await authAPI.register(name, password);
      return {
        id: response.user.id,
        email: response.user.email,
        name,
        createdAt: Date.now(),
      } as User;
    } catch (error: any) {
      console.error("User registration error:", error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(name: string, password: string): Promise<User> {
    try {
      const response = await authAPI.login(name, password);
      return {
        id: response.user.id,
        email: response.user.email,
        name,
        createdAt: Date.now(),
      } as User;
    } catch (error: any) {
      console.error("User login error:", error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | null> {
    try {
      const response = await authAPI.getMe();
      if (!response) return null;
      return {
        id: response._id,
        email: response.email,
        name: response.email,
        createdAt: response.createdAt,
      } as User;
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      return null;
    }
  }

  /**
   * Get user by username
   */
  async getByName(name: string): Promise<User | null> {
    try {
      // This would need to be implemented on the backend
      throw new Error("GetByName not available - use login instead");
    } catch (error: any) {
      console.error("Get user by name error:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      // This would need to be implemented on the backend
      throw new Error("Update user profile not yet available in backend");
    } catch (error: any) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      // This would need to be implemented on the backend
      throw new Error("Delete user not yet available in backend");
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw error;
    }
  }

  /**
   * Get all users (for admin purposes)
   */
  async getAll(): Promise<User[]> {
    try {
      // This would need admin access
      throw new Error("GetAll not available");
    } catch (error: any) {
      console.error("Get all users error:", error);
      return [];
    }
  }
}
